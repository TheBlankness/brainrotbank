<script lang="ts">
	let { amount, label = 'CLOUT' }: { amount: number; label?: string } = $props();
</script>

<div
	class="clout-counter"
	aria-live="polite"
	aria-label={`${amount.toLocaleString()} fictional Clout`}
>
	<span class="coin" aria-hidden="true">C</span>
	<span class="value">{amount.toLocaleString()}</span>
	<span class="label">{label}</span>
</div>

<style>
	.clout-counter {
		display: inline-grid;
		grid-template-columns: auto auto;
		grid-template-rows: auto auto;
		align-items: center;
		column-gap: 0.55rem;
		padding: 0.62rem 0.85rem;
		border: 1px solid rgba(199, 255, 65, 0.45);
		border-radius: 0.85rem;
		background: rgba(199, 255, 65, 0.08);
		box-shadow: inset 0 0 22px rgba(199, 255, 65, 0.06);
	}
	.coin {
		grid-row: 1 / 3;
		display: grid;
		width: 2rem;
		aspect-ratio: 1;
		place-items: center;
		border-radius: 50%;
		background: var(--acid);
		color: #121606;
		font-family: var(--font-display);
		font-weight: 950;
		box-shadow: 0 0 18px rgba(199, 255, 65, 0.45);
	}
	.value {
		font-family: var(--font-display);
		font-size: clamp(1.05rem, 3vw, 1.5rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.04em;
	}
	.label {
		color: var(--muted);
		font-size: 0.63rem;
		font-weight: 850;
		letter-spacing: 0.16em;
	}
</style>
