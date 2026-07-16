<script lang="ts">
	import Icon from '@iconify/svelte/offline';
	import type { IconifyIcon } from '@iconify/svelte';

	type MemeCardIcon = {
		mascot: IconifyIcon;
		prop?: IconifyIcon;
		effect?: IconifyIcon;
		variant: 'cook' | 'over' | 'skill' | 'cinema' | 'round';
	};

	let {
		title,
		icon,
		rotation,
		accent,
		description
	}: {
		title: string;
		icon: MemeCardIcon;
		rotation: number;
		accent: string;
		description: string;
	} = $props();
</script>

<article
	class="meme-card"
	class:is-over={icon.variant === 'over'}
	style={`--card-rotation:${rotation}deg;--card-accent:${accent}`}
	role="listitem"
	aria-label={`${title}: ${description}`}
>
	<div class="mascot-stage" aria-hidden="true">
		{#if icon.effect}
			<Icon class="effect-icon" icon={icon.effect} width="68" height="68" />
		{/if}

		<Icon class="mascot-icon" icon={icon.mascot} width="74" height="74" />

		{#if icon.variant === 'cook'}
			<svg class="chef-hat" viewBox="0 0 56 36">
				<path
					d="M13 30h31l-2-13c4-1 7-4 7-8 0-5-4-8-9-8-3 0-6 2-7 5-2-4-5-6-9-6s-8 3-9 7c-1-2-4-3-6-3-5 0-9 4-9 9 0 4 3 8 8 9l5 8Z"
					fill="#f7f5ff"
					stroke="#33245f"
					stroke-width="2.5"
				/>
				<path d="M14 27h29v7H14z" fill="#d9d1ff" stroke="#33245f" stroke-width="2.5" />
			</svg>
		{/if}

		{#if icon.prop}
			<Icon class="prop-icon" icon={icon.prop} width="40" height="40" />
		{/if}
	</div>

	<div class="card-shell" aria-hidden="true">
		<div class="circuit circuit-a"></div>
		<div class="circuit circuit-b"></div>
		<i class="bolt bolt-a"></i>
		<i class="bolt bolt-b"></i>
		<span class="status">MEME READY</span>
	</div>

	<h3>{title}</h3>
	<span class="sr-only">{description}</span>
</article>

<style>
	.meme-card {
		position: relative;
		display: block;
		width: 142px;
		height: 118px;
		flex: 0 0 142px;
		align-self: end;
		justify-self: center;
		filter: drop-shadow(0 12px 11px rgba(0, 0, 0, 0.54));
		scroll-snap-align: center;
		transform: rotate(var(--card-rotation));
		transform-origin: 50% 86%;
		transition:
			transform 180ms ease,
			filter 180ms ease;
	}

	.meme-card:hover {
		z-index: 5;
		filter: drop-shadow(0 15px 14px rgba(0, 0, 0, 0.62))
			drop-shadow(0 0 9px color-mix(in srgb, var(--card-accent) 48%, transparent));
		transform: translateY(-5px) rotate(calc(var(--card-rotation) * 0.45));
	}

	.card-shell {
		position: absolute;
		inset: 25px 0 0;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--card-accent) 82%, white 18%);
		clip-path: polygon(
			11px 0,
			100% 0,
			100% calc(100% - 12px),
			calc(100% - 12px) 100%,
			0 100%,
			0 11px
		);
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--card-accent) 12%, transparent),
				transparent 46%
			),
			linear-gradient(180deg, rgba(22, 18, 45, 0.9), rgba(5, 6, 16, 0.96));
		box-shadow:
			inset 0 0 0 2px rgba(8, 231, 255, 0.1),
			inset 0 0 24px rgba(116, 74, 255, 0.14),
			0 0 10px color-mix(in srgb, var(--card-accent) 24%, transparent);
	}

	.card-shell::before,
	.card-shell::after {
		content: '';
		position: absolute;
		background: var(--card-accent);
		box-shadow: 0 0 7px var(--card-accent);
	}

	.card-shell::before {
		right: 10px;
		top: 9px;
		width: 18px;
		height: 2px;
	}

	.card-shell::after {
		right: 10px;
		top: 14px;
		width: 9px;
		height: 2px;
		opacity: 0.54;
	}

	.mascot-stage {
		position: absolute;
		z-index: 3;
		left: 50%;
		top: -18px;
		width: 104px;
		height: 91px;
		transform: translateX(-50%);
	}

	:global(.mascot-icon) {
		position: absolute;
		z-index: 2;
		left: 50%;
		bottom: 0;
		filter: drop-shadow(0 7px 5px rgba(0, 0, 0, 0.56));
		transform: translateX(-50%);
	}

	:global(.effect-icon) {
		position: absolute;
		z-index: 0;
		left: 50%;
		bottom: 2px;
		opacity: 0.82;
		filter: drop-shadow(0 0 8px color-mix(in srgb, var(--card-accent) 62%, transparent));
		transform: translateX(-50%) scale(1.04);
	}

	:global(.prop-icon) {
		position: absolute;
		z-index: 4;
		right: -1px;
		bottom: -4px;
		filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.64));
		transform: rotate(-12deg);
	}

	.is-over :global(.prop-icon) {
		right: auto;
		left: 0;
		bottom: -1px;
		width: 34px;
		height: 34px;
		transform: rotate(9deg);
	}

	.chef-hat {
		position: absolute;
		z-index: 4;
		left: 29px;
		top: 7px;
		width: 45px;
		height: 29px;
		filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.35));
		transform: rotate(-7deg);
	}

	h3 {
		position: absolute;
		z-index: 7;
		right: 4px;
		bottom: 4px;
		left: 4px;
		display: grid;
		height: 27px;
		margin: 0;
		place-items: center;
		border-top: 1px solid color-mix(in srgb, var(--card-accent) 58%, transparent);
		clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
		background: rgba(4, 5, 13, 0.96);
		color: #f8f7ff;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
		font-size: 13px;
		font-weight: 900;
		letter-spacing: 0.055em;
		line-height: 1;
		text-align: center;
		text-shadow: 0 0 8px color-mix(in srgb, var(--card-accent) 45%, transparent);
		white-space: nowrap;
	}

	.status {
		position: absolute;
		left: 9px;
		top: 10px;
		color: color-mix(in srgb, var(--card-accent) 80%, white 20%);
		font-size: 5px;
		font-weight: 1000;
		letter-spacing: 0.13em;
	}

	.circuit {
		position: absolute;
		bottom: 36px;
		height: 1px;
		background: color-mix(in srgb, var(--card-accent) 58%, transparent);
	}

	.circuit::after {
		content: '';
		position: absolute;
		right: -3px;
		top: -2px;
		width: 5px;
		height: 5px;
		border: 1px solid var(--card-accent);
		border-radius: 50%;
	}

	.circuit-a {
		left: 8px;
		width: 23px;
	}

	.circuit-b {
		right: 9px;
		width: 16px;
		transform: scaleX(-1);
	}

	.bolt {
		position: absolute;
		width: 4px;
		height: 4px;
		border: 1px solid rgba(255, 255, 255, 0.54);
		border-radius: 50%;
		background: #17172b;
	}

	.bolt-a {
		left: 8px;
		top: 27px;
	}

	.bolt-b {
		right: 8px;
		bottom: 8px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.meme-card {
			transition: none;
		}

		.meme-card:hover {
			transform: rotate(var(--card-rotation));
		}
	}
</style>
