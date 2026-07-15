<script lang="ts">
	import MemeCard from '$lib/components/MemeCard.svelte';
	import type { JudgeResult, MemeCard as MemeCardType } from '$lib/types/game';

	let {
		playerCard,
		opponentCard,
		verdict,
		source,
		betAmount,
		clout,
		allIn = false,
		onContinue
	}: {
		playerCard: MemeCardType;
		opponentCard: MemeCardType;
		verdict: JudgeResult;
		source: 'qwen' | 'fallback';
		betAmount: number;
		clout: number;
		allIn?: boolean;
		onContinue: () => void;
	} = $props();

	let playerWon = $derived(verdict.winner === 'player');
</script>

<section class:all-in={allIn} class:loss={!playerWon} class="result-panel" aria-live="assertive">
	<div class="result-kicker">
		<span class="source">{source === 'qwen' ? 'QWEN VERDICT' : 'EMERGENCY LOCAL VERDICT'}</span>
		<span>CONFIDENCE {verdict.confidence}%</span>
	</div>
	<h2>
		{playerWon
			? allIn
				? 'ALL IN. ABSOLUTE CINEMA.'
				: 'YOUR MEME CLEARS'
			: allIn
				? 'CLOUT EXTINCTION EVENT'
				: 'THE BOT COOKED YOU'}
	</h2>
	<p class="delta">{playerWon ? '+' : '−'}{betAmount.toLocaleString()} FICTIONAL CLOUT</p>

	<div class="matchup">
		<div class:winner={playerWon}>
			<MemeCard card={playerCard} disabled revealed label="YOUR PICK" />
			{#if playerWon}<span class="winner-tag">WINNER</span>{/if}
		</div>
		<span class="versus">VS</span>
		<div class:winner={!playerWon}>
			<MemeCard card={opponentCard} disabled revealed label="BOT PICK" />
			{#if !playerWon}<span class="winner-tag">WINNER</span>{/if}
		</div>
	</div>

	<div class="verdict-copy">
		<div>
			<span>THE RULING</span>
			<p>{verdict.reason}</p>
		</div>
		<div class="roast">
			<span>PLAYFUL DAMAGE</span>
			<p>“{verdict.roast}”</p>
		</div>
	</div>

	<div class="result-footer">
		<p>BALANCE <strong>{clout.toLocaleString()} C</strong></p>
		<button class="primary-button" type="button" onclick={onContinue}
			>{clout <= 0 ? 'VIEW THE DAMAGE' : 'NEXT ROUND →'}</button
		>
	</div>
</section>

<style>
	.result-panel {
		position: relative;
		text-align: center;
	}
	.result-panel.all-in::before {
		content: '';
		position: fixed;
		z-index: -1;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(circle at 50% 30%, rgba(199, 255, 65, 0.14), transparent 45%);
		animation: victoryFlash 650ms ease-out;
	}
	.result-panel.all-in.loss::before {
		background: radial-gradient(circle at 50% 30%, rgba(255, 33, 79, 0.2), transparent 45%);
	}
	.result-kicker {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		align-items: center;
		justify-content: center;
		color: var(--muted);
		font-size: 0.65rem;
		font-weight: 900;
		letter-spacing: 0.12em;
	}
	.result-kicker span {
		padding: 0.35rem 0.55rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 99px;
	}
	.result-kicker .source {
		border-color: rgba(0, 229, 255, 0.3);
		color: var(--cyan);
	}
	h2 {
		max-width: 800px;
		margin: 0.8rem auto 0.25rem;
		font-family: var(--font-display);
		font-size: clamp(2rem, 7vw, 4.5rem);
		line-height: 0.9;
		letter-spacing: -0.055em;
	}
	.delta {
		margin: 0.55rem 0 1.4rem;
		color: var(--acid);
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 950;
		letter-spacing: 0.08em;
	}
	.loss .delta {
		color: #ff6685;
	}
	.matchup {
		display: grid;
		max-width: 760px;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		gap: 1rem;
		align-items: center;
		margin: 0 auto 1.2rem;
	}
	.matchup > div {
		position: relative;
		min-width: 0;
		border-radius: 1rem;
	}
	.matchup > div.winner {
		outline: 3px solid var(--acid);
		outline-offset: 4px;
		box-shadow: 0 0 30px rgba(199, 255, 65, 0.18);
	}
	.winner-tag {
		position: absolute;
		z-index: 4;
		right: 0.55rem;
		bottom: 0.55rem;
		padding: 0.35rem 0.5rem;
		border-radius: 0.35rem;
		background: var(--acid);
		color: #111606;
		font-size: 0.62rem;
		font-weight: 950;
		transform: rotate(-4deg);
	}
	.versus {
		color: #6b687c;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 950;
	}
	.verdict-copy {
		display: grid;
		max-width: 760px;
		grid-template-columns: 1.3fr 1fr;
		gap: 0.75rem;
		margin: auto;
		text-align: left;
	}
	.verdict-copy > div {
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.09);
		border-radius: 0.85rem;
		background: rgba(255, 255, 255, 0.035);
	}
	.verdict-copy > div.roast {
		border-color: rgba(255, 77, 122, 0.22);
		background: rgba(255, 77, 122, 0.055);
	}
	.verdict-copy span {
		color: var(--cyan);
		font-size: 0.63rem;
		font-weight: 900;
		letter-spacing: 0.14em;
	}
	.roast span {
		color: #ff7891;
	}
	.verdict-copy p {
		margin: 0.45rem 0 0;
		color: #d7d5e2;
		font-size: 0.8rem;
		line-height: 1.5;
	}
	.result-footer {
		display: flex;
		max-width: 760px;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		margin: 1rem auto 0;
	}
	.result-footer p {
		margin: 0;
		color: var(--muted);
		font-size: 0.72rem;
		font-weight: 850;
		letter-spacing: 0.1em;
	}
	.result-footer strong {
		margin-left: 0.25rem;
		color: var(--acid);
		font-family: var(--font-display);
		font-size: 1.25rem;
	}
	@keyframes victoryFlash {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	@media (max-width: 650px) {
		.matchup {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 0.7rem;
			align-items: stretch;
		}
		.versus {
			display: none;
		}
		.verdict-copy {
			grid-template-columns: 1fr;
		}
		.result-footer {
			flex-direction: column;
		}
		.result-footer button {
			width: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.result-panel.all-in::before {
			animation: none;
		}
	}
</style>
