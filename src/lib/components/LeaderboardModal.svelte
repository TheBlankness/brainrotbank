<script lang="ts">
	import type { LeaderboardEntry } from '$lib/types/game';

	let {
		entries,
		onClose,
		onClear
	}: {
		entries: LeaderboardEntry[];
		onClose: () => void;
		onClear: () => void;
	} = $props();
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && onClose()} />

<div class="backdrop">
	<dialog class="modal" open aria-labelledby="leaderboard-title">
		<header>
			<div>
				<p class="eyebrow">THIS DEVICE ONLY</p>
				<h2 id="leaderboard-title">CLOUT LEDGER</h2>
			</div>
			<button class="close" type="button" aria-label="Close leaderboard" onclick={onClose}>×</button
			>
		</header>

		{#if entries.length === 0}
			<div class="empty">
				<span>📉</span>
				<h3>NO FINANCIAL MISTAKES YET</h3>
				<p>Finish a run and immortalise it on this browser.</p>
			</div>
		{:else}
			<ol>
				{#each entries as entry, index}
					<li>
						<span class="position">{index + 1}</span>
						<div class="identity">
							<strong>{entry.playerName}</strong>
							<small>{entry.rank} · {entry.wins}W/{entry.losses}L</small>
						</div>
						<span class="score">{entry.score.toLocaleString()} <small>C</small></span>
					</li>
				{/each}
			</ol>
			<button class="clear" type="button" onclick={onClear}>CLEAR LOCAL SCORES</button>
		{/if}
	</dialog>
</div>

<style>
	.backdrop {
		position: fixed;
		z-index: 50;
		inset: 0;
		display: grid;
		padding: 1rem;
		place-items: center;
		background: rgba(3, 3, 9, 0.8);
		backdrop-filter: blur(12px);
	}
	.modal {
		width: min(620px, 100%);
		max-height: min(760px, 92vh);
		margin: 0;
		padding: 1.2rem;
		overflow: auto;
		border: 1px solid rgba(139, 92, 246, 0.45);
		border-radius: 1.2rem;
		background: linear-gradient(145deg, #161229, #080812);
		color: var(--text);
		box-shadow:
			0 25px 80px rgba(0, 0, 0, 0.5),
			0 0 45px rgba(139, 92, 246, 0.12);
	}
	header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	.eyebrow {
		margin: 0 0 0.25rem;
		color: var(--acid);
		font-size: 0.64rem;
		font-weight: 900;
		letter-spacing: 0.18em;
	}
	h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.7rem, 5vw, 2.6rem);
		letter-spacing: -0.04em;
	}
	.close {
		width: 2.5rem;
		aspect-ratio: 1;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.65rem;
		background: rgba(255, 255, 255, 0.05);
		color: white;
		font-size: 1.6rem;
	}
	ol {
		display: grid;
		gap: 0.45rem;
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: rank;
	}
	li {
		display: grid;
		grid-template-columns: 2rem 1fr auto;
		gap: 0.75rem;
		align-items: center;
		padding: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 0.75rem;
		background: rgba(255, 255, 255, 0.035);
	}
	li:first-child {
		border-color: rgba(199, 255, 65, 0.35);
		background: rgba(199, 255, 65, 0.065);
	}
	.position {
		color: var(--acid);
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 950;
		text-align: center;
	}
	.identity {
		display: flex;
		min-width: 0;
		flex-direction: column;
	}
	.identity strong {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.identity small {
		margin-top: 0.14rem;
		color: var(--muted);
		font-size: 0.66rem;
	}
	.score {
		color: var(--cyan);
		font-family: var(--font-display);
		font-weight: 900;
	}
	.score small {
		font-size: 0.65em;
	}
	.clear {
		display: block;
		margin: 1rem auto 0;
		border: 0;
		background: transparent;
		color: #ff7891;
		font-size: 0.68rem;
		font-weight: 850;
		letter-spacing: 0.1em;
	}
	.empty {
		padding: 3rem 1rem;
		text-align: center;
	}
	.empty span {
		font-size: 3rem;
	}
	.empty h3 {
		margin: 0.7rem 0 0.3rem;
		font-family: var(--font-display);
	}
	.empty p {
		margin: 0;
		color: var(--muted);
		font-size: 0.8rem;
	}
</style>
