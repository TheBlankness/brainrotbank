<script lang="ts">
	import { calculateBet } from '$lib/game/gameLogic';

	let {
		clout,
		selected = null,
		disabled = false,
		onBet
	}: {
		clout: number;
		selected?: 25 | 50 | 100 | null;
		disabled?: boolean;
		onBet: (percent: 25 | 50 | 100) => void;
	} = $props();

	const options = [25, 50, 100] as const;
</script>

<div class="bet-controls" aria-label="Choose a fictional Clout bet">
	{#each options as percent}
		<button
			type="button"
			class:all-in={percent === 100}
			class:selected={selected === percent}
			disabled={disabled || clout <= 0}
			aria-pressed={selected === percent}
			onclick={() => onBet(percent)}
		>
			<span>{percent === 100 ? 'ALL IN' : `${percent}%`}</span>
			<small>{calculateBet(clout, percent).toLocaleString()} CLOUT</small>
		</button>
	{/each}
</div>

<style>
	.bet-controls {
		display: grid;
		grid-template-columns: 1fr 1fr 1.5fr;
		gap: 0.65rem;
	}
	button {
		display: flex;
		min-height: 4.25rem;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(0, 229, 255, 0.35);
		border-radius: 0.85rem;
		background: rgba(0, 229, 255, 0.07);
		color: var(--cyan);
		font-family: var(--font-display);
		font-weight: 950;
		transition:
			transform 150ms ease,
			background 150ms ease,
			box-shadow 150ms ease;
	}
	button:not(:disabled):hover {
		transform: translateY(-2px);
		background: rgba(0, 229, 255, 0.13);
	}
	button:disabled {
		cursor: not-allowed;
		opacity: 0.42;
	}
	button span {
		font-size: 1.05rem;
	}
	button small {
		margin-top: 0.2rem;
		color: rgba(255, 255, 255, 0.58);
		font-family: var(--font-body);
		font-size: 0.62rem;
		letter-spacing: 0.06em;
	}
	button.all-in {
		position: relative;
		min-height: 5rem;
		border: 2px solid var(--danger);
		background: linear-gradient(135deg, #ff214f, #b90052 58%, #6b005e);
		color: white;
		box-shadow:
			0 0 24px rgba(255, 33, 79, 0.35),
			inset 0 0 22px rgba(255, 255, 255, 0.1);
		transform: rotate(-1deg);
	}
	button.all-in span {
		font-size: clamp(1.35rem, 4vw, 1.9rem);
		letter-spacing: 0.06em;
		text-shadow: 0 2px 0 #750025;
	}
	button.all-in:not(:disabled):hover {
		transform: rotate(1deg) scale(1.035);
		box-shadow: 0 0 38px rgba(255, 33, 79, 0.58);
	}
	button.selected {
		outline: 3px solid white;
		outline-offset: 3px;
	}
	@media (max-width: 560px) {
		.bet-controls {
			grid-template-columns: 1fr 1fr;
		}
		button.all-in {
			grid-column: 1 / -1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
</style>
