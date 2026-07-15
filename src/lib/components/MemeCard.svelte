<script lang="ts">
	import type { MemeCard as MemeCardType } from '$lib/types/game';

	let {
		card,
		selected = false,
		disabled = false,
		revealed = false,
		label = '',
		onSelect = () => undefined
	}: {
		card: MemeCardType;
		selected?: boolean;
		disabled?: boolean;
		revealed?: boolean;
		label?: string;
		onSelect?: () => void;
	} = $props();
</script>

<button
	type="button"
	class:selected
	class:revealed
	class="meme-card rarity-{card.rarity.toLowerCase()}"
	{disabled}
	aria-pressed={selected}
	aria-label={`Choose ${card.name}, ${card.category}: ${card.description}`}
	onclick={onSelect}
>
	{#if label}<span class="card-label">{label}</span>{/if}
	<div class="art" aria-hidden="true">
		<span class="orbit orbit-one"></span>
		<span class="orbit orbit-two"></span>
		<span class="emoji">{card.emoji}</span>
	</div>
	<div class="card-copy">
		<div class="card-topline">
			<div class="card-taxonomy">
				<span class="category">{card.category}</span>
				<span class="rarity">{card.rarity}</span>
			</div>
			<span class="card-id">#{card.id.slice(0, 3).toUpperCase()}</span>
		</div>
		<h3>{card.name}</h3>
		<p>{card.description}</p>
		<div class="traits" aria-label="Traits">
			{#each card.traits.slice(0, 3) as trait}
				<span>{trait}</span>
			{/each}
		</div>
	</div>
	<span class="select-prompt">{selected ? 'LOCKED IN ✓' : 'PICK THIS CHAOS'}</span>
</button>

<style>
	.meme-card {
		--card-accent: var(--cyan);
		position: relative;
		display: flex;
		min-width: 0;
		flex-direction: column;
		padding: 0;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 1rem;
		background: linear-gradient(155deg, rgba(23, 20, 45, 0.96), rgba(8, 8, 20, 0.98));
		color: var(--text);
		text-align: left;
		box-shadow: 0 14px 35px rgba(0, 0, 0, 0.24);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}
	.meme-card:not(:disabled):hover {
		transform: translateY(-6px) rotate(-0.5deg);
		border-color: var(--card-accent);
		box-shadow:
			0 18px 45px rgba(0, 0, 0, 0.35),
			0 0 24px color-mix(in srgb, var(--card-accent) 28%, transparent);
	}
	.meme-card.selected {
		transform: translateY(-7px);
		border: 2px solid var(--acid);
		box-shadow:
			0 0 0 3px rgba(199, 255, 65, 0.12),
			0 0 32px rgba(199, 255, 65, 0.2);
	}
	.meme-card:disabled {
		cursor: default;
		opacity: 1;
	}
	.meme-card.rarity-common {
		--card-accent: #80f0ff;
	}
	.meme-card.rarity-rare {
		--card-accent: #8d7dff;
	}
	.meme-card.rarity-cursed {
		--card-accent: #ff4d7a;
	}
	.meme-card.rarity-legendary {
		--card-accent: #ffe55b;
	}
	.card-label {
		position: absolute;
		top: 0.65rem;
		left: 0.65rem;
		z-index: 3;
		padding: 0.34rem 0.52rem;
		border: 1px solid rgba(255, 255, 255, 0.22);
		border-radius: 0.45rem;
		background: rgba(5, 5, 13, 0.8);
		font-size: 0.65rem;
		font-weight: 900;
		letter-spacing: 0.12em;
	}
	.art {
		position: relative;
		display: grid;
		height: 9.4rem;
		place-items: center;
		overflow: hidden;
		background:
			radial-gradient(
				circle at 50% 48%,
				color-mix(in srgb, var(--card-accent) 40%, transparent),
				transparent 37%
			),
			linear-gradient(135deg, rgba(139, 92, 246, 0.24), rgba(0, 229, 255, 0.08));
	}
	.art::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
		background-size: 22px 22px;
		mask-image: linear-gradient(to bottom, black, transparent);
	}
	.emoji {
		position: relative;
		z-index: 2;
		font-size: 4.7rem;
		filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.4));
		transition: transform 200ms ease;
	}
	.meme-card:hover .emoji {
		transform: scale(1.08) rotate(3deg);
	}
	.orbit {
		position: absolute;
		border: 1px solid color-mix(in srgb, var(--card-accent) 50%, transparent);
		border-radius: 50%;
		transform: rotate(-18deg);
	}
	.orbit-one {
		width: 8rem;
		height: 3rem;
	}
	.orbit-two {
		width: 5rem;
		height: 8rem;
		transform: rotate(30deg);
	}
	.card-copy {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 0.9rem 0.95rem 0.75rem;
	}
	.card-topline {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.card-taxonomy {
		display: flex;
		gap: 0.35rem;
		align-items: center;
	}
	.category {
		padding: 0.18rem 0.35rem;
		border: 1px solid rgba(189, 165, 255, 0.2);
		border-radius: 0.3rem;
		background: rgba(139, 92, 246, 0.09);
		color: var(--purple-soft);
		font-size: 0.54rem;
		font-weight: 900;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.rarity {
		color: var(--card-accent);
		font-size: 0.54rem;
		font-weight: 900;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.card-id {
		color: #73728a;
		font-size: 0.6rem;
		font-weight: 800;
	}
	h3 {
		margin: 0.38rem 0 0.36rem;
		font-family: var(--font-display);
		font-size: 1.08rem;
		letter-spacing: -0.03em;
	}
	p {
		flex: 1;
		margin: 0;
		color: #b7b5c8;
		font-size: 0.76rem;
		line-height: 1.45;
	}
	.traits {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.65rem;
	}
	.traits span {
		padding: 0.2rem 0.4rem;
		border: 1px solid rgba(255, 255, 255, 0.09);
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.045);
		color: #9795a9;
		font-size: 0.57rem;
		text-transform: uppercase;
	}
	.select-prompt {
		display: block;
		padding: 0.58rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		background: color-mix(in srgb, var(--card-accent) 8%, transparent);
		color: var(--card-accent);
		font-size: 0.65rem;
		font-weight: 950;
		letter-spacing: 0.1em;
		text-align: center;
	}
	.selected .select-prompt {
		background: var(--acid);
		color: #121606;
	}
	.revealed {
		animation: reveal 560ms cubic-bezier(0.18, 0.8, 0.26, 1) both;
	}
	@keyframes reveal {
		from {
			opacity: 0;
			transform: rotateY(85deg) scale(0.9);
		}
		to {
			opacity: 1;
			transform: rotateY(0) scale(1);
		}
	}
	@media (max-width: 650px) {
		.art {
			height: 7.4rem;
		}
		.emoji {
			font-size: 3.8rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.meme-card,
		.emoji {
			transition: none;
		}
		.revealed {
			animation: none;
		}
	}
</style>
