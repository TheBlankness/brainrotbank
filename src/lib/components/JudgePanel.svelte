<script lang="ts">
	import { onMount } from 'svelte';

	const messages = [
		'QWEN IS JUDGING YOUR LIFE CHOICES',
		'ANALYSING QUESTIONABLE CONFIDENCE',
		'CALCULATING EMOTIONAL DAMAGE',
		'CHECKING IF THIS WAS A SKILL ISSUE'
	];

	let activeMessage = $state(0);

	onMount(() => {
		const timer = window.setInterval(() => {
			activeMessage = (activeMessage + 1) % messages.length;
		}, 1300);
		return () => window.clearInterval(timer);
	});
</script>

<section class="judge-panel" aria-live="polite" aria-busy="true">
	<div class="scanner" aria-hidden="true">
		<div class="eye">Q</div>
		<span></span><span></span><span></span>
	</div>
	<p class="eyebrow">SEMANTIC VIBE TRIBUNAL // ONLINE</p>
	<h2>{messages[activeMessage]}</h2>
	<div class="loading-bar"><span></span></div>
	<p class="fine-print">Comparing traits, context, and dangerous levels of confidence…</p>
</section>

<style>
	.judge-panel {
		position: relative;
		padding: clamp(2rem, 6vw, 4rem) 1.2rem;
		overflow: hidden;
		border: 1px solid rgba(0, 229, 255, 0.35);
		border-radius: 1.2rem;
		background:
			radial-gradient(circle at 50% 20%, rgba(0, 229, 255, 0.13), transparent 30%),
			rgba(8, 8, 21, 0.88);
		text-align: center;
		box-shadow: 0 0 60px rgba(0, 229, 255, 0.1);
	}
	.scanner {
		position: relative;
		display: grid;
		width: 7rem;
		height: 7rem;
		margin: 0 auto 1.3rem;
		place-items: center;
	}
	.eye {
		position: relative;
		z-index: 2;
		display: grid;
		width: 4.4rem;
		aspect-ratio: 1;
		place-items: center;
		border: 2px solid var(--cyan);
		border-radius: 1.25rem;
		background: #0b1623;
		color: var(--cyan);
		font-family: var(--font-display);
		font-size: 2.5rem;
		font-weight: 950;
		box-shadow: 0 0 25px rgba(0, 229, 255, 0.35);
		animation: pulse 1s ease-in-out infinite alternate;
	}
	.scanner span {
		position: absolute;
		inset: 0;
		border: 1px solid rgba(0, 229, 255, 0.2);
		border-radius: 50%;
		animation: spin 3s linear infinite;
	}
	.scanner span:nth-child(3) {
		inset: 0.7rem;
		border-style: dashed;
		animation-direction: reverse;
		animation-duration: 2s;
	}
	.scanner span:nth-child(4) {
		inset: -0.65rem;
		border-color: rgba(139, 92, 246, 0.22);
		animation-duration: 5s;
	}
	.eyebrow {
		color: var(--acid);
		font-size: 0.67rem;
		font-weight: 900;
		letter-spacing: 0.18em;
	}
	h2 {
		max-width: 670px;
		margin: 0.7rem auto 1.4rem;
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 5vw, 2.8rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
	}
	.loading-bar {
		max-width: 440px;
		height: 0.45rem;
		margin: auto;
		overflow: hidden;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.08);
	}
	.loading-bar span {
		display: block;
		width: 42%;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, var(--purple), var(--cyan), var(--acid));
		box-shadow: 0 0 18px var(--cyan);
		animation: scan 1.1s ease-in-out infinite alternate;
	}
	.fine-print {
		margin: 1rem 0 0;
		color: var(--muted);
		font-size: 0.78rem;
	}
	@keyframes pulse {
		to {
			transform: scale(1.06);
			filter: brightness(1.2);
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes scan {
		from {
			transform: translateX(-20%);
		}
		to {
			transform: translateX(160%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.eye,
		.scanner span,
		.loading-bar span {
			animation: none;
		}
		.loading-bar span {
			width: 70%;
		}
	}
</style>
