<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import BetControls from '$lib/components/BetControls.svelte';
	import CloutCounter from '$lib/components/CloutCounter.svelte';
	import JudgePanel from '$lib/components/JudgePanel.svelte';
	import LeaderboardModal from '$lib/components/LeaderboardModal.svelte';
	import MemeCard from '$lib/components/MemeCard.svelte';
	import ResultPanel from '$lib/components/ResultPanel.svelte';
	import { memeCardById } from '$lib/data/memeCards';
	import { situations } from '$lib/data/situations';
	import { fallbackJudge } from '$lib/game/fallbackJudge';
	import {
		calculateBet,
		chooseOpponent,
		dealRound,
		getRank,
		INITIAL_CLOUT,
		MAX_ROUNDS
	} from '$lib/game/gameLogic';
	import {
		clearLeaderboard,
		loadLeaderboard,
		sanitizePlayerName,
		saveLeaderboardEntry
	} from '$lib/game/leaderboard';
	import type {
		GamePhase,
		GameState,
		JudgeResponse,
		LeaderboardEntry,
		MemeCard as MemeCardType
	} from '$lib/types/game';

	const PROGRESS_KEY = 'all-in-brainrot-progress-v1';
	const SOUND_KEY = 'all-in-brainrot-sound-v1';
	const gamePhases: GamePhase[] = [
		'menu',
		'selecting',
		'betting',
		'judging',
		'result',
		'finished',
		'bankrupt'
	];

	function initialState(): GameState {
		return {
			phase: 'menu',
			clout: INITIAL_CLOUT,
			round: 1,
			maxRounds: MAX_ROUNDS,
			wins: 0,
			losses: 0,
			currentSituation: '',
			playerOptions: [],
			selectedPlayerCard: null,
			opponentCard: null,
			selectedBetPercent: null,
			betAmount: 0,
			lastVerdict: null,
			verdictSource: null
		};
	}

	let state = $state<GameState>(initialState());
	let leaderboard = $state<LeaderboardEntry[]>([]);
	let showLeaderboard = $state(false);
	let soundEnabled = $state(false);
	let playerName = $state('Anonymous Goblin');
	let scoreSaved = $state(false);
	let storageReady = $state(false);
	let statusMessage = $state('');
	let rank = $derived(getRank(state.clout));
	let profit = $derived(state.clout - INITIAL_CLOUT);
	let isFinalScreen = $derived(state.phase === 'finished' || state.phase === 'bankrupt');

	function isRecord(value: unknown): value is Record<string, unknown> {
		return typeof value === 'object' && value !== null;
	}

	function cardFrom(value: unknown): MemeCardType | null {
		if (!isRecord(value) || typeof value.id !== 'string') return null;
		return memeCardById.get(value.id) ?? null;
	}

	function restoreProgress(): GameState | null {
		try {
			const parsed: unknown = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? 'null');
			if (!isRecord(parsed)) return null;
			if (
				typeof parsed.phase !== 'string' ||
				!gamePhases.includes(parsed.phase as GamePhase) ||
				parsed.phase === 'menu' ||
				!Number.isInteger(parsed.clout) ||
				Number(parsed.clout) < 0 ||
				Number(parsed.clout) > 10_000_000 ||
				!Number.isInteger(parsed.round) ||
				Number(parsed.round) < 1 ||
				Number(parsed.round) > MAX_ROUNDS ||
				typeof parsed.currentSituation !== 'string' ||
				!situations.includes(parsed.currentSituation as (typeof situations)[number]) ||
				!Array.isArray(parsed.playerOptions)
			)
				return null;

			const options = parsed.playerOptions
				.map(cardFrom)
				.filter((card): card is MemeCardType => card !== null);
			if (options.length !== 3 || new Set(options.map((card) => card.id)).size !== 3) return null;
			const selectedPlayerCard = cardFrom(parsed.selectedPlayerCard);
			const opponentCard = cardFrom(parsed.opponentCard);
			const selectedBetPercent = [25, 50, 100].includes(Number(parsed.selectedBetPercent))
				? (Number(parsed.selectedBetPercent) as 25 | 50 | 100)
				: null;
			const verdict =
				isRecord(parsed.lastVerdict) &&
				(parsed.lastVerdict.winner === 'player' || parsed.lastVerdict.winner === 'opponent') &&
				typeof parsed.lastVerdict.reason === 'string' &&
				typeof parsed.lastVerdict.roast === 'string' &&
				typeof parsed.lastVerdict.confidence === 'number'
					? {
							winner: parsed.lastVerdict.winner,
							confidence: Math.min(99, Math.max(50, Math.round(parsed.lastVerdict.confidence))),
							reason: parsed.lastVerdict.reason.slice(0, 280),
							roast: parsed.lastVerdict.roast.slice(0, 180)
						}
					: null;

			let phase = parsed.phase as GamePhase;
			if (phase === 'judging') phase = selectedPlayerCard ? 'betting' : 'selecting';
			if (phase === 'result' && (!selectedPlayerCard || !opponentCard || !verdict))
				phase = 'selecting';

			return {
				phase,
				clout: Number(parsed.clout),
				round: Number(parsed.round),
				maxRounds: MAX_ROUNDS,
				wins: Number.isInteger(parsed.wins) ? Math.max(0, Number(parsed.wins)) : 0,
				losses: Number.isInteger(parsed.losses) ? Math.max(0, Number(parsed.losses)) : 0,
				currentSituation: parsed.currentSituation,
				playerOptions: options,
				selectedPlayerCard,
				opponentCard: phase === 'selecting' || phase === 'betting' ? null : opponentCard,
				selectedBetPercent: phase === 'judging' ? null : selectedBetPercent,
				betAmount: Number.isInteger(parsed.betAmount) ? Math.max(0, Number(parsed.betAmount)) : 0,
				lastVerdict: phase === 'result' ? verdict : null,
				verdictSource:
					phase === 'result' &&
					(parsed.verdictSource === 'qwen' || parsed.verdictSource === 'fallback')
						? parsed.verdictSource
						: null
			};
		} catch {
			return null;
		}
	}

	onMount(() => {
		leaderboard = loadLeaderboard();
		soundEnabled = localStorage.getItem(SOUND_KEY) === 'on';
		const saved = restoreProgress();
		if (saved) {
			state = saved;
			statusMessage = 'Your local run was restored.';
		}
		storageReady = true;
	});

	$effect(() => {
		if (browser && storageReady && state.phase !== 'menu') {
			localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
		}
	});

	function playTone(frequency: number, duration = 0.08) {
		if (!browser || !soundEnabled) return;
		try {
			const context = new AudioContext();
			const oscillator = context.createOscillator();
			const gain = context.createGain();
			oscillator.type = 'square';
			oscillator.frequency.value = frequency;
			gain.gain.setValueAtTime(0.045, context.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
			oscillator.connect(gain);
			gain.connect(context.destination);
			oscillator.start();
			oscillator.stop(context.currentTime + duration);
			oscillator.addEventListener('ended', () => void context.close());
		} catch {
			// Sound is an enhancement; unsupported browsers remain fully playable.
		}
	}

	function toggleSound() {
		soundEnabled = !soundEnabled;
		localStorage.setItem(SOUND_KEY, soundEnabled ? 'on' : 'off');
		if (soundEnabled) playTone(520, 0.12);
	}

	function startGame() {
		const round = dealRound();
		state = {
			...initialState(),
			phase: 'selecting',
			currentSituation: round.situation,
			playerOptions: round.options
		};
		scoreSaved = false;
		statusMessage = 'Round one dealt. Pick your most defensible bad idea.';
		playTone(420, 0.12);
	}

	function selectCard(card: MemeCardType) {
		if (state.phase === 'judging' || state.phase === 'result') return;
		if (!state.playerOptions.some((option) => option.id === card.id)) return;
		state.selectedPlayerCard = card;
		state.phase = 'betting';
		state.selectedBetPercent = null;
		statusMessage = `${card.name} selected. Now choose your fictional Clout risk.`;
		playTone(620);
	}

	async function requestVerdict(): Promise<JudgeResponse> {
		if (!state.selectedPlayerCard || !state.opponentCard) throw new Error('Cards are missing.');
		const playerCard = state.selectedPlayerCard;
		const opponentCard = state.opponentCard;
		try {
			const response = await fetch('/api/judge', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					situation: state.currentSituation,
					playerCard,
					opponentCard,
					betAmount: state.betAmount,
					currentClout: state.clout,
					round: state.round
				})
			});
			if (!response.ok) throw new Error('Judge unavailable.');
			const result = (await response.json()) as JudgeResponse;
			if (
				(result.winner !== 'player' && result.winner !== 'opponent') ||
				(result.source !== 'qwen' && result.source !== 'fallback')
			)
				throw new Error('Judge response invalid.');
			return result;
		} catch {
			return {
				...fallbackJudge(
					state.currentSituation,
					playerCard,
					opponentCard,
					state.round,
					state.betAmount,
					state.clout
				),
				source: 'fallback'
			};
		}
	}

	async function placeBet(percent: 25 | 50 | 100) {
		if (state.phase !== 'betting' || !state.selectedPlayerCard || state.clout <= 0) return;
		const betAmount = calculateBet(state.clout, percent);
		if (betAmount > state.clout) return;
		state.selectedBetPercent = percent;
		state.betAmount = betAmount;
		state.opponentCard = chooseOpponent(state.selectedPlayerCard);
		state.phase = 'judging';
		statusMessage = `Judging round ${state.round}. All controls are locked.`;
		playTone(percent === 100 ? 150 : 280, 0.18);

		const [result] = await Promise.all([
			requestVerdict(),
			new Promise((resolve) => window.setTimeout(resolve, 1550))
		]);
		state.lastVerdict = {
			winner: result.winner,
			confidence: result.confidence,
			reason: result.reason,
			roast: result.roast
		};
		state.verdictSource = result.source;
		if (result.winner === 'player') {
			state.clout += betAmount;
			state.wins += 1;
			playTone(780, 0.2);
		} else {
			state.clout = Math.max(0, state.clout - betAmount);
			state.losses += 1;
			playTone(95, 0.28);
		}
		state.phase = 'result';
		statusMessage =
			result.winner === 'player'
				? `You gained ${betAmount.toLocaleString()} fictional Clout.`
				: `You lost ${betAmount.toLocaleString()} fictional Clout.`;
	}

	function continueGame() {
		if (state.phase !== 'result') return;
		if (state.clout <= 0) {
			state.phase = 'bankrupt';
			statusMessage = 'Your fictional Clout balance reached zero.';
			return;
		}
		if (state.round >= state.maxRounds) {
			state.phase = 'finished';
			statusMessage = `Run complete with ${state.clout.toLocaleString()} fictional Clout.`;
			return;
		}

		const next = dealRound(state.currentSituation);
		state.round += 1;
		state.currentSituation = next.situation;
		state.playerOptions = next.options;
		state.selectedPlayerCard = null;
		state.opponentCard = null;
		state.selectedBetPercent = null;
		state.betAmount = 0;
		state.lastVerdict = null;
		state.verdictSource = null;
		state.phase = 'selecting';
		statusMessage = `Round ${state.round} dealt.`;
	}

	function saveScore() {
		if (!isFinalScreen || scoreSaved) return;
		playerName = sanitizePlayerName(playerName);
		leaderboard = saveLeaderboardEntry({
			id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
			playerName,
			score: state.clout,
			wins: state.wins,
			losses: state.losses,
			roundsCompleted: state.round,
			rank,
			createdAt: new Date().toISOString()
		});
		scoreSaved = true;
		statusMessage = `Score saved locally as ${playerName}.`;
		playTone(660, 0.15);
	}

	function confirmClearLeaderboard() {
		if (!window.confirm('Clear every local ALL IN: BRAINROT score on this device?')) return;
		clearLeaderboard();
		leaderboard = [];
		statusMessage = 'Local leaderboard cleared.';
	}
</script>

<svelte:head>
	<title>ALL IN: BRAINROT — Fictional Clout Game</title>
	<meta
		name="description"
		content="Risk fictional Clout on terrible original memes and let Qwen judge your decisions."
	/>
</svelte:head>

<div class="site-shell" class:bankruptcy-flash={state.phase === 'bankrupt'}>
	<div class="noise" aria-hidden="true"></div>
	<div class="particles" aria-hidden="true">
		{#each Array(14) as _, index}<span style={`--i:${index};--x:${(index * 23) % 100}`}
			></span>{/each}
	</div>

	<button class="sound-toggle" type="button" aria-pressed={soundEnabled} onclick={toggleSound}>
		<span aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span> SOUND {soundEnabled ? 'ON' : 'OFF'}
	</button>

	<p class="sr-only" aria-live="polite">{statusMessage}</p>

	{#if state.phase === 'menu'}
		<main class="landing">
			<section class="hero-copy">
				<div class="live-tag"><span></span> QWEN-POWERED VIBE TRIBUNAL</div>
				<p class="overline">A FIVE-ROUND FICTIONAL CLOUT DISASTER</p>
				<h1><span>ALL IN:</span> BRAINROT</h1>
				<p class="subtitle">
					Risk fictional Clout on terrible memes. Let Qwen judge your decisions.
				</p>
				<div class="hero-actions">
					<button class="start-button" type="button" onclick={startGame}
						>START WITH 1,000 CLOUT <span>→</span></button
					>
					<button class="secondary-button" type="button" onclick={() => (showLeaderboard = true)}
						>LOCAL LEADERBOARD</button
					>
				</div>
				<p class="disclaimer">
					<strong>NO REAL MONEY.</strong> Clout is fictional. No purchases, cash-out, or prizes.
				</p>
			</section>

			<section class="hero-terminal" aria-label="How the game works">
				<div class="terminal-top">
					<span></span><span></span><span></span><small>terrible_decisions.exe</small>
				</div>
				<div class="terminal-body">
					<div class="fake-score">
						<span>STARTING BALANCE</span><strong>1,000 <small>CLOUT</small></strong>
					</div>
					<div class="mini-situation">
						<small>TODAY'S BAD IDEA</small>
						<p>Which meme would deploy on Friday and call it “agile”?</p>
					</div>
					<div class="mini-cards">
						<div><span>🦝</span><small>DEPLOY RACCOON</small></div>
						<div class="selected-mini"><span>🐹</span><small>PROD HAMSTER</small></div>
						<div><span>👻</span><small>DOCS GHOST</small></div>
					</div>
					<div class="terminal-rule">
						<span>01</span> PICK A MEME <i></i><span>02</span> RISK CLOUT <i></i><span>03</span> GET JUDGED
					</div>
				</div>
			</section>

			<div class="format-strip">
				<div><strong>24</strong><span>ORIGINAL MEMES</span></div>
				<div><strong>5</strong><span>ROUNDS</span></div>
				<div><strong>0</strong><span>REAL CURRENCY</span></div>
				<div><strong>∞</strong><span>BAD DECISIONS</span></div>
			</div>
		</main>
	{:else}
		<main class="game-layout">
			<header class="game-header">
				<button
					class="mini-logo"
					type="button"
					onclick={() => {
						state = initialState();
						localStorage.removeItem(PROGRESS_KEY);
					}}>ALL IN: <span>BRAINROT</span></button
				>
				<div class="round-progress" aria-label={`Round ${state.round} of ${state.maxRounds}`}>
					<div class="progress-copy">
						<span>ROUND {state.round}/{state.maxRounds}</span><small
							>{state.wins}W · {state.losses}L</small
						>
					</div>
					<div class="progress-dots">
						{#each Array(state.maxRounds) as _, index}<span
								class:active={index < state.round}
								class:complete={index < state.round - 1}
							></span>{/each}
					</div>
				</div>
				<CloutCounter amount={state.clout} />
			</header>

			{#if state.phase === 'selecting' || state.phase === 'betting'}
				<section class="play-screen">
					<div class="situation-card">
						<div class="situation-meta">
							<span>SITUATION #{String(state.round).padStart(2, '0')}</span><span
								>CHOOSE WISELY-ISH</span
							>
						</div>
						<h2>{state.currentSituation}</h2>
						<div class="tape">SEMANTIC CHAOS DETECTED</div>
					</div>

					<div class="section-heading">
						<div>
							<span>STEP 01</span>
							<h3>PICK YOUR FIGHTER</h3>
						</div>
						<p>
							{state.selectedPlayerCard
								? `${state.selectedPlayerCard.name} is locked in.`
								: 'Three cards. One questionable instinct.'}
						</p>
					</div>
					<div class="card-grid">
						{#each state.playerOptions as card}
							<MemeCard
								{card}
								selected={state.selectedPlayerCard?.id === card.id}
								onSelect={() => selectCard(card)}
							/>
						{/each}
					</div>

					<div class="bet-zone" class:ready={state.selectedPlayerCard !== null}>
						<div class="bet-heading">
							<div>
								<span>STEP 02</span>
								<h3>RISK FICTIONAL CLOUT</h3>
							</div>
							<p>
								{state.selectedPlayerCard
									? 'The tribunal is ready. How loud is your confidence?'
									: 'Pick a card to unlock the terrible financial controls.'}
							</p>
						</div>
						<BetControls
							clout={state.clout}
							selected={state.selectedBetPercent}
							disabled={!state.selectedPlayerCard}
							onBet={placeBet}
						/>
						<small class="fictional-note">GAME CURRENCY ONLY · NO PURCHASES · NO PRIZES</small>
					</div>
				</section>
			{:else if state.phase === 'judging'}
				<section class="center-stage"><JudgePanel /></section>
			{:else if state.phase === 'result' && state.selectedPlayerCard && state.opponentCard && state.lastVerdict && state.verdictSource}
				<section class="center-stage result-stage">
					{#if state.selectedBetPercent === 100 && state.lastVerdict.winner === 'player'}
						<div class="confetti" aria-hidden="true">
							{#each Array(28) as _, index}<i style={`--i:${index};--x:${(index * 37) % 100}`}
								></i>{/each}
						</div>
					{/if}
					<ResultPanel
						playerCard={state.selectedPlayerCard}
						opponentCard={state.opponentCard}
						verdict={state.lastVerdict}
						source={state.verdictSource}
						betAmount={state.betAmount}
						clout={state.clout}
						allIn={state.selectedBetPercent === 100}
						onContinue={continueGame}
					/>
				</section>
			{:else if isFinalScreen}
				<section class:bankrupt={state.phase === 'bankrupt'} class="end-screen">
					<p class="end-kicker">
						RUN COMPLETE // {state.round} ROUND{state.round === 1 ? '' : 'S'} SURVIVED
					</p>
					<div class="end-icon" aria-hidden="true">{state.phase === 'bankrupt' ? '📉' : '🏆'}</div>
					<h1>{state.phase === 'bankrupt' ? 'BANKRUPT' : 'CLOUT SECURED'}</h1>
					<p class="end-subtitle">
						{state.phase === 'bankrupt'
							? 'YOUR CLOUT PORTFOLIO HAS BEEN LIQUIDATED'
							: 'YOU SURVIVED FIVE ROUNDS OF ALGORITHMIC JUDGMENT'}
					</p>
					<div class="final-score">
						<small>FINAL FICTIONAL CLOUT</small><strong>{state.clout.toLocaleString()}</strong><span
							class:negative={profit < 0}
							>{profit >= 0 ? '+' : '−'}{Math.abs(profit).toLocaleString()} FROM START</span
						>
					</div>
					<div class="rank-stamp"><small>OFFICIAL RANK</small><strong>{rank}</strong></div>
					<div class="end-stats">
						<div><strong>{state.wins}</strong><span>WINS</span></div>
						<div><strong>{state.losses}</strong><span>LOSSES</span></div>
						<div>
							<strong
								>{Math.round((state.wins / Math.max(1, state.wins + state.losses)) * 100)}%</strong
							><span>VIBE RATE</span>
						</div>
					</div>
					{#if state.phase === 'bankrupt'}<p class="final-roast">
							“The balance hit zero, but the confidence remained wildly overfunded.”
						</p>{/if}

					<div class="save-panel">
						<label for="player-name">SAVE TO THIS DEVICE'S LEADERBOARD</label>
						<div>
							<input
								id="player-name"
								bind:value={playerName}
								maxlength="16"
								autocomplete="nickname"
								aria-label="Display name, maximum 16 characters"
								disabled={scoreSaved}
							/>
							<button type="button" onclick={saveScore} disabled={scoreSaved}
								>{scoreSaved ? 'SAVED ✓' : 'SAVE SCORE'}</button
							>
						</div>
					</div>
					<div class="end-actions">
						<button class="primary-button" type="button" onclick={startGame}>PLAY AGAIN</button>
						<button class="secondary-button" type="button" onclick={() => (showLeaderboard = true)}
							>LEADERBOARD</button
						>
					</div>
					<p class="disclaimer">
						Clout is fictional. No real money, purchases, cash-out, or prizes.
					</p>
				</section>
			{/if}
		</main>
	{/if}

	{#if showLeaderboard}
		<LeaderboardModal
			entries={leaderboard}
			onClose={() => (showLeaderboard = false)}
			onClear={confirmClearLeaderboard}
		/>
	{/if}
</div>

<style>
	.site-shell {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
		isolation: isolate;
	}
	.noise {
		position: fixed;
		z-index: -1;
		inset: 0;
		pointer-events: none;
		opacity: 0.18;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
		mix-blend-mode: soft-light;
	}
	.particles {
		position: fixed;
		z-index: -2;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.particles span {
		position: absolute;
		left: calc(var(--x) * 1%);
		bottom: -20px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--cyan);
		box-shadow: 0 0 8px var(--cyan);
		opacity: 0.35;
		animation: float calc(13s + var(--i) * 0.8s) linear infinite;
		animation-delay: calc(var(--i) * -1.7s);
	}
	.particles span:nth-child(3n) {
		background: var(--purple);
		box-shadow: 0 0 8px var(--purple);
	}
	.particles span:nth-child(4n) {
		background: var(--acid);
		box-shadow: 0 0 8px var(--acid);
	}
	.sound-toggle {
		position: fixed;
		z-index: 20;
		right: 1rem;
		bottom: 1rem;
		padding: 0.55rem 0.7rem;
		border: 1px solid rgba(255, 255, 255, 0.13);
		border-radius: 0.65rem;
		background: rgba(8, 8, 20, 0.78);
		color: var(--muted);
		backdrop-filter: blur(10px);
		font-size: 0.61rem;
		font-weight: 850;
		letter-spacing: 0.08em;
	}
	.landing {
		display: grid;
		width: min(1180px, calc(100% - 2rem));
		min-height: 100vh;
		grid-template-columns: 1.08fr 0.92fr;
		gap: clamp(2rem, 6vw, 6rem);
		align-content: center;
		align-items: center;
		margin: auto;
		padding: 5rem 0 7rem;
	}
	.hero-copy {
		position: relative;
		z-index: 1;
	}
	.live-tag {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.38rem 0.55rem;
		border: 1px solid rgba(199, 255, 65, 0.25);
		border-radius: 0.45rem;
		background: rgba(199, 255, 65, 0.06);
		color: var(--acid);
		font-size: 0.62rem;
		font-weight: 900;
		letter-spacing: 0.11em;
	}
	.live-tag span {
		width: 0.43rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--acid);
		box-shadow: 0 0 10px var(--acid);
		animation: pulseDot 1.2s ease-in-out infinite alternate;
	}
	.overline {
		margin: 1.5rem 0 0.45rem;
		color: var(--cyan);
		font-size: 0.7rem;
		font-weight: 900;
		letter-spacing: 0.2em;
	}
	.hero-copy h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(4.1rem, 9vw, 8.5rem);
		line-height: 0.74;
		letter-spacing: -0.075em;
		text-transform: uppercase;
		text-shadow: 0 5px 0 #31105a;
		transform: skewY(-2deg);
	}
	.hero-copy h1 span {
		display: block;
		color: transparent;
		-webkit-text-stroke: 2px var(--purple);
		font-size: 0.57em;
		letter-spacing: -0.035em;
		text-shadow: none;
	}
	.subtitle {
		max-width: 560px;
		margin: 1.8rem 0 0;
		color: #c8c5d8;
		font-size: clamp(0.98rem, 2vw, 1.18rem);
		line-height: 1.55;
	}
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 1.6rem 0 1rem;
	}
	.start-button {
		display: flex;
		gap: 1.2rem;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.15rem;
		border: 1px solid var(--acid);
		border-radius: 0.8rem;
		background: var(--acid);
		color: #111606;
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 950;
		box-shadow: 0 0 28px rgba(199, 255, 65, 0.22);
		transition:
			transform 150ms ease,
			box-shadow 150ms ease;
	}
	.start-button span {
		font-size: 1.25rem;
	}
	.start-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 0 38px rgba(199, 255, 65, 0.38);
	}
	.secondary-button {
		padding: 0.9rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 0.8rem;
		background: rgba(255, 255, 255, 0.045);
		color: white;
		font-size: 0.7rem;
		font-weight: 900;
		letter-spacing: 0.08em;
	}
	.disclaimer {
		color: #858297;
		font-size: 0.67rem;
		line-height: 1.5;
	}
	.disclaimer strong {
		color: #ff7891;
	}
	.hero-terminal {
		position: relative;
		border: 1px solid rgba(0, 229, 255, 0.22);
		border-radius: 1.1rem;
		background: linear-gradient(145deg, rgba(20, 17, 39, 0.92), rgba(6, 7, 16, 0.94));
		box-shadow:
			0 35px 80px rgba(0, 0, 0, 0.42),
			0 0 45px rgba(0, 229, 255, 0.07);
		transform: rotate(1.5deg);
	}
	.hero-terminal::before {
		content: '100% FICTIONAL';
		position: absolute;
		z-index: 3;
		right: -1.2rem;
		top: 4.2rem;
		padding: 0.42rem 0.6rem;
		background: var(--danger);
		color: white;
		font-size: 0.62rem;
		font-weight: 950;
		letter-spacing: 0.12em;
		transform: rotate(5deg);
	}
	.terminal-top {
		display: flex;
		gap: 0.35rem;
		align-items: center;
		padding: 0.7rem 0.8rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}
	.terminal-top span {
		width: 0.48rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: #ff4967;
	}
	.terminal-top span:nth-child(2) {
		background: #ffe15b;
	}
	.terminal-top span:nth-child(3) {
		background: var(--acid);
	}
	.terminal-top small {
		margin-left: 0.35rem;
		color: #656278;
		font-family: monospace;
		font-size: 0.6rem;
	}
	.terminal-body {
		padding: 1.1rem;
	}
	.fake-score {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding-bottom: 0.8rem;
		border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	}
	.fake-score span {
		color: var(--muted);
		font-size: 0.61rem;
		font-weight: 850;
		letter-spacing: 0.11em;
	}
	.fake-score strong {
		color: var(--acid);
		font-family: var(--font-display);
		font-size: 2rem;
		line-height: 1;
	}
	.fake-score small {
		font-size: 0.35em;
	}
	.mini-situation {
		margin: 0.8rem 0;
		padding: 0.8rem;
		border-left: 3px solid var(--purple);
		background: rgba(139, 92, 246, 0.08);
	}
	.mini-situation small {
		color: var(--purple-soft);
		font-size: 0.55rem;
		font-weight: 900;
		letter-spacing: 0.12em;
	}
	.mini-situation p {
		margin: 0.35rem 0 0;
		font-family: var(--font-display);
		font-size: 0.9rem;
		line-height: 1.25;
	}
	.mini-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.55rem;
	}
	.mini-cards div {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem 0.3rem 0.55rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.65rem;
		background: rgba(255, 255, 255, 0.025);
	}
	.mini-cards .selected-mini {
		border-color: var(--acid);
		background: rgba(199, 255, 65, 0.07);
	}
	.mini-cards span {
		font-size: 2rem;
	}
	.mini-cards small {
		margin-top: 0.35rem;
		overflow: hidden;
		color: #858297;
		font-size: 0.49rem;
		font-weight: 850;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.terminal-rule {
		display: flex;
		gap: 0.35rem;
		align-items: center;
		margin-top: 0.85rem;
		color: #777489;
		font-size: 0.49rem;
		font-weight: 850;
		letter-spacing: 0.06em;
	}
	.terminal-rule span {
		color: var(--cyan);
	}
	.terminal-rule i {
		flex: 1;
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
	}
	.format-strip {
		position: absolute;
		right: 0;
		bottom: 1.4rem;
		left: 0;
		display: flex;
		width: min(900px, calc(100% - 2rem));
		align-items: center;
		justify-content: space-around;
		margin: auto;
		padding: 0.8rem 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}
	.format-strip div {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.format-strip strong {
		color: var(--purple-soft);
		font-family: var(--font-display);
		font-size: 1.15rem;
	}
	.format-strip span {
		color: #716e82;
		font-size: 0.55rem;
		font-weight: 850;
		letter-spacing: 0.09em;
	}
	.game-layout {
		width: min(1160px, calc(100% - 2rem));
		min-height: 100vh;
		margin: auto;
		padding: 1rem 0 5rem;
	}
	.game-header {
		position: relative;
		z-index: 10;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 1rem;
		align-items: center;
		padding: 0.65rem 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.09);
		border-radius: 0.9rem;
		background: rgba(9, 8, 20, 0.7);
		backdrop-filter: blur(14px);
	}
	.game-header > :last-child {
		justify-self: end;
	}
	.mini-logo {
		border: 0;
		background: none;
		color: white;
		font-family: var(--font-display);
		font-size: 0.86rem;
		font-weight: 950;
		letter-spacing: -0.02em;
		text-align: left;
	}
	.mini-logo span {
		color: var(--purple-soft);
	}
	.round-progress {
		min-width: min(290px, 35vw);
	}
	.progress-copy {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.38rem;
		color: var(--muted);
		font-size: 0.6rem;
		font-weight: 850;
		letter-spacing: 0.1em;
	}
	.progress-copy small {
		font-size: 0.6rem;
	}
	.progress-dots {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.25rem;
	}
	.progress-dots span {
		height: 0.28rem;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.1);
	}
	.progress-dots span.active {
		background: var(--cyan);
		box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
	}
	.progress-dots span.complete {
		background: var(--acid);
	}
	.play-screen {
		padding: 1.2rem 0 0;
	}
	.situation-card {
		position: relative;
		padding: clamp(1.15rem, 3vw, 2rem);
		overflow: hidden;
		border: 1px solid rgba(139, 92, 246, 0.34);
		border-radius: 1.05rem;
		background:
			linear-gradient(120deg, rgba(139, 92, 246, 0.14), rgba(0, 229, 255, 0.035)),
			rgba(9, 8, 21, 0.82);
	}
	.situation-card::before {
		content: '?';
		position: absolute;
		right: 2rem;
		top: -2.4rem;
		color: rgba(139, 92, 246, 0.08);
		font-family: var(--font-display);
		font-size: 11rem;
		font-weight: 950;
		transform: rotate(9deg);
	}
	.situation-meta {
		position: relative;
		display: flex;
		justify-content: space-between;
		color: var(--cyan);
		font-size: 0.59rem;
		font-weight: 900;
		letter-spacing: 0.14em;
	}
	.situation-meta span:last-child {
		color: #777489;
	}
	.situation-card h2 {
		position: relative;
		max-width: 940px;
		margin: 0.65rem 0 0.15rem;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2.8rem);
		line-height: 1;
		letter-spacing: -0.04em;
	}
	.tape {
		position: absolute;
		right: -2rem;
		bottom: 0.9rem;
		padding: 0.3rem 2.3rem;
		background: var(--acid);
		color: #111606;
		font-size: 0.52rem;
		font-weight: 950;
		letter-spacing: 0.12em;
		transform: rotate(-4deg);
	}
	.section-heading,
	.bet-heading {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		justify-content: space-between;
		margin: 1.2rem 0 0.7rem;
	}
	.section-heading span,
	.bet-heading span {
		color: var(--purple-soft);
		font-size: 0.59rem;
		font-weight: 900;
		letter-spacing: 0.15em;
	}
	.section-heading h3,
	.bet-heading h3 {
		margin: 0.18rem 0 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
		letter-spacing: -0.02em;
	}
	.section-heading p,
	.bet-heading p {
		margin: 0;
		color: var(--muted);
		font-size: 0.68rem;
	}
	.card-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.85rem;
	}
	.bet-zone {
		margin-top: 1rem;
		padding: 0.85rem 1rem 1rem;
		border: 1px dashed rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		background: rgba(4, 4, 12, 0.38);
		transition:
			border-color 180ms ease,
			background 180ms ease;
	}
	.bet-zone.ready {
		border-style: solid;
		border-color: rgba(255, 33, 79, 0.25);
		background: rgba(255, 33, 79, 0.025);
	}
	.bet-heading {
		margin: 0 0 0.7rem;
	}
	.fictional-note {
		display: block;
		margin-top: 0.65rem;
		color: #6c697c;
		font-size: 0.55rem;
		font-weight: 850;
		letter-spacing: 0.1em;
		text-align: center;
	}
	.center-stage {
		padding: clamp(2rem, 7vh, 5rem) 0;
	}
	.result-stage {
		padding-top: 2rem;
	}
	.end-screen {
		width: min(700px, 100%);
		margin: auto;
		padding: clamp(3rem, 8vh, 6rem) 0;
		text-align: center;
	}
	.end-kicker {
		margin: 0 0 0.7rem;
		color: var(--cyan);
		font-size: 0.67rem;
		font-weight: 900;
		letter-spacing: 0.17em;
	}
	.end-icon {
		font-size: 4rem;
		filter: drop-shadow(0 0 22px rgba(199, 255, 65, 0.25));
	}
	.end-screen h1 {
		margin: 0.2rem 0 0;
		font-family: var(--font-display);
		font-size: clamp(3.7rem, 12vw, 7.5rem);
		line-height: 0.8;
		letter-spacing: -0.07em;
	}
	.end-screen.bankrupt h1 {
		color: var(--danger);
		text-shadow: 0 0 35px rgba(255, 33, 79, 0.25);
	}
	.end-subtitle {
		margin: 0.9rem 0 1.5rem;
		color: var(--muted);
		font-size: 0.72rem;
		font-weight: 850;
		letter-spacing: 0.11em;
	}
	.final-score {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		border: 1px solid rgba(199, 255, 65, 0.24);
		border-radius: 1rem;
		background: rgba(199, 255, 65, 0.05);
	}
	.final-score small {
		color: var(--muted);
		font-size: 0.6rem;
		font-weight: 850;
		letter-spacing: 0.14em;
	}
	.final-score strong {
		color: var(--acid);
		font-family: var(--font-display);
		font-size: clamp(3rem, 9vw, 5rem);
		line-height: 0.95;
	}
	.final-score span {
		margin-top: 0.25rem;
		color: var(--acid);
		font-size: 0.64rem;
		font-weight: 900;
	}
	.final-score span.negative {
		color: #ff7891;
	}
	.rank-stamp {
		display: inline-flex;
		gap: 0.55rem;
		align-items: center;
		margin: 0.75rem 0;
		padding: 0.45rem 0.7rem;
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 0.5rem;
		background: rgba(139, 92, 246, 0.08);
		transform: rotate(-1deg);
	}
	.rank-stamp small {
		color: var(--muted);
		font-size: 0.56rem;
		font-weight: 850;
		letter-spacing: 0.12em;
	}
	.rank-stamp strong {
		color: var(--purple-soft);
		font-family: var(--font-display);
		font-size: 0.9rem;
	}
	.end-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.6rem;
	}
	.end-stats div {
		display: flex;
		flex-direction: column;
		padding: 0.7rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.7rem;
		background: rgba(255, 255, 255, 0.025);
	}
	.end-stats strong {
		font-family: var(--font-display);
		font-size: 1.3rem;
	}
	.end-stats span {
		color: var(--muted);
		font-size: 0.55rem;
		font-weight: 850;
		letter-spacing: 0.1em;
	}
	.final-roast {
		margin: 0.75rem 0;
		color: #ff9aac;
		font-style: italic;
		font-size: 0.75rem;
	}
	.save-panel {
		margin: 0.8rem 0;
		padding: 0.8rem;
		border: 1px solid rgba(0, 229, 255, 0.15);
		border-radius: 0.8rem;
		background: rgba(0, 229, 255, 0.035);
	}
	.save-panel label {
		display: block;
		margin-bottom: 0.45rem;
		color: var(--cyan);
		font-size: 0.58rem;
		font-weight: 900;
		letter-spacing: 0.12em;
	}
	.save-panel > div {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.45rem;
	}
	.save-panel input {
		min-width: 0;
		padding: 0.7rem 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.13);
		border-radius: 0.55rem;
		outline: none;
		background: rgba(0, 0, 0, 0.24);
		color: white;
	}
	.save-panel input:focus {
		border-color: var(--cyan);
		box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.1);
	}
	.save-panel button {
		padding: 0.65rem 0.8rem;
		border: 1px solid var(--cyan);
		border-radius: 0.55rem;
		background: var(--cyan);
		color: #041114;
		font-size: 0.65rem;
		font-weight: 950;
	}
	.save-panel button:disabled {
		border-color: rgba(199, 255, 65, 0.3);
		background: rgba(199, 255, 65, 0.1);
		color: var(--acid);
	}
	.end-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.65rem;
		margin-top: 0.8rem;
	}
	.end-actions button {
		width: 100%;
	}
	.bankruptcy-flash {
		animation:
			screenShake 380ms ease-out,
			redFlash 900ms ease-out;
	}
	.confetti {
		position: fixed;
		z-index: 30;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.confetti i {
		position: absolute;
		top: -2rem;
		left: calc(var(--x) * 1%);
		width: 0.55rem;
		height: 1rem;
		background: hsl(calc(var(--i) * 47deg) 92% 60%);
		animation: confettiFall calc(1.7s + (var(--i) % 5) * 0.18s) ease-in both;
		animation-delay: calc((var(--i) % 7) * 0.08s);
	}
	@keyframes float {
		to {
			transform: translateY(-110vh) rotate(360deg);
		}
	}
	@keyframes pulseDot {
		to {
			opacity: 0.35;
		}
	}
	@keyframes confettiFall {
		to {
			transform: translateY(110vh) rotate(720deg);
		}
	}
	@keyframes screenShake {
		20% {
			transform: translateX(-7px);
		}
		40% {
			transform: translateX(6px);
		}
		60% {
			transform: translateX(-3px);
		}
	}
	@keyframes redFlash {
		from {
			box-shadow: inset 0 0 0 100vmax rgba(255, 20, 55, 0.18);
		}
		to {
			box-shadow: inset 0 0 0 100vmax transparent;
		}
	}
	@media (max-width: 820px) {
		.landing {
			grid-template-columns: 1fr;
			padding: 6rem 0 8rem;
		}
		.hero-copy {
			text-align: center;
		}
		.live-tag {
			margin: auto;
		}
		.subtitle {
			margin-right: auto;
			margin-left: auto;
		}
		.hero-actions {
			justify-content: center;
		}
		.hero-terminal {
			width: min(520px, 100%);
			margin: auto;
		}
		.format-strip {
			position: static;
			grid-column: 1;
			width: 100%;
			margin-top: 1rem;
		}
		.card-grid {
			gap: 0.65rem;
		}
		.game-header {
			grid-template-columns: 1fr 1fr;
		}
		.round-progress {
			grid-row: 2;
			grid-column: 1 / -1;
			width: 100%;
			min-width: 0;
		}
		.game-header > :last-child {
			grid-column: 2;
			grid-row: 1;
		}
	}
	@media (max-width: 620px) {
		.landing {
			width: min(100% - 1.2rem, 1180px);
			padding-top: 5rem;
		}
		.hero-copy h1 {
			font-size: clamp(3.9rem, 20vw, 6rem);
		}
		.hero-actions {
			display: grid;
		}
		.format-strip {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.7rem;
		}
		.format-strip div {
			justify-content: center;
		}
		.game-layout {
			width: min(100% - 1rem, 1160px);
		}
		.game-header {
			padding: 0.55rem;
		}
		.mini-logo {
			font-size: 0.72rem;
		}
		.card-grid {
			grid-template-columns: 1fr;
		}
		.section-heading,
		.bet-heading {
			align-items: flex-start;
			flex-direction: column;
		}
		.situation-meta span:last-child {
			display: none;
		}
		.tape {
			display: none;
		}
		.sound-toggle {
			right: 0.6rem;
			bottom: 0.6rem;
		}
		.save-panel > div,
		.end-actions {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			scroll-behavior: auto !important;
		}
		.particles span,
		.live-tag span,
		.confetti i,
		.bankruptcy-flash {
			animation: none;
		}
		.start-button,
		.bet-zone {
			transition: none;
		}
	}
</style>
