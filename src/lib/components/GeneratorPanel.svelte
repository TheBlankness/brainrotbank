<script lang="ts">
	let { prompt, round }: { prompt: string; round: number } = $props();
</script>

<section class="generator-panel" aria-live="polite" aria-busy="true">
	<div class="forge" aria-hidden="true">
		<span>✨</span>
		<i></i><i></i><i></i>
	</div>
	<p class="eyebrow">AI CUSTOM // ROUND {round} CONTENT FORGE</p>
	<h2>QWEN IS BUILDING<br />YOUR NEXT MEME DIMENSION</h2>
	<div class="prompt-chip"><small>YOUR THEME</small><strong>{prompt}</strong></div>
	<div class="assembly-line" aria-hidden="true">
		<span>Situation</span><i></i><span>4 original cards</span><i></i><span>Vibe battle</span>
	</div>
	<p class="fine-print">
		Inventing safe, original chaos. A local generator takes over if Qwen is unavailable.
	</p>
</section>

<style>
	.generator-panel {
		position: relative;
		padding: clamp(2rem, 6vw, 4rem) 1.2rem;
		overflow: hidden;
		border: 1px solid rgba(189, 165, 255, 0.38);
		border-radius: 1.2rem;
		background:
			radial-gradient(circle at 50% 24%, rgba(139, 92, 246, 0.2), transparent 29%),
			rgba(8, 8, 21, 0.9);
		text-align: center;
		box-shadow: 0 0 60px rgba(139, 92, 246, 0.12);
	}
	.generator-panel::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
		background-size: 28px 28px;
		mask-image: radial-gradient(circle, black, transparent 72%);
		pointer-events: none;
	}
	.forge {
		position: relative;
		display: grid;
		width: 8rem;
		height: 8rem;
		margin: 0 auto 1rem;
		place-items: center;
	}
	.forge span {
		position: relative;
		z-index: 2;
		display: grid;
		width: 4.8rem;
		aspect-ratio: 1;
		place-items: center;
		border: 2px solid var(--purple-soft);
		border-radius: 1.2rem;
		background: #15102c;
		font-size: 2.3rem;
		box-shadow: 0 0 28px rgba(139, 92, 246, 0.45);
		animation: forgePulse 900ms ease-in-out infinite alternate;
	}
	.forge i {
		position: absolute;
		inset: 0;
		border: 1px dashed rgba(189, 165, 255, 0.3);
		border-radius: 50%;
		animation: orbit 4s linear infinite;
	}
	.forge i:nth-child(3) {
		inset: 0.8rem;
		animation-direction: reverse;
		animation-duration: 2.8s;
	}
	.forge i:nth-child(4) {
		inset: -0.65rem;
		border-color: rgba(0, 229, 255, 0.2);
		animation-duration: 6s;
	}
	.eyebrow {
		position: relative;
		margin: 0;
		color: var(--acid);
		font-size: 0.67rem;
		font-weight: 900;
		letter-spacing: 0.18em;
	}
	h2 {
		position: relative;
		margin: 0.7rem auto 1rem;
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 6vw, 3.4rem);
		line-height: 0.9;
		letter-spacing: -0.045em;
	}
	.prompt-chip {
		position: relative;
		display: flex;
		width: min(560px, 100%);
		flex-direction: column;
		margin: auto;
		padding: 0.8rem 1rem;
		border: 1px solid rgba(0, 229, 255, 0.22);
		border-radius: 0.8rem;
		background: rgba(0, 229, 255, 0.045);
	}
	.prompt-chip small {
		color: var(--cyan);
		font-size: 0.56rem;
		font-weight: 900;
		letter-spacing: 0.14em;
	}
	.prompt-chip strong {
		margin-top: 0.3rem;
		color: #dedbea;
		font-size: 0.84rem;
		line-height: 1.35;
	}
	.assembly-line {
		position: relative;
		display: flex;
		max-width: 570px;
		gap: 0.45rem;
		align-items: center;
		justify-content: center;
		margin: 1.15rem auto 0;
	}
	.assembly-line span {
		color: #8d899e;
		font-size: 0.58rem;
		font-weight: 850;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.assembly-line i {
		width: 2rem;
		height: 1px;
		background: linear-gradient(90deg, var(--purple), var(--cyan));
		animation: lineGlow 700ms ease-in-out infinite alternate;
	}
	.fine-print {
		position: relative;
		margin: 0.9rem 0 0;
		color: var(--muted);
		font-size: 0.72rem;
	}
	@keyframes forgePulse {
		to {
			transform: scale(1.07) rotate(3deg);
			filter: brightness(1.2);
		}
	}
	@keyframes orbit {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes lineGlow {
		to {
			filter: brightness(1.8);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.forge span,
		.forge i,
		.assembly-line i {
			animation: none;
		}
	}
</style>
