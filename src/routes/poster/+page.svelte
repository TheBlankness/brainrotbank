<script lang="ts">
	import { onMount } from 'svelte';

	const POSTER_SIZE = 1080;
	const fighters = [
		{ emoji: '😩', name: 'Monday Mood', x: 9, tilt: -8 },
		{ emoji: '😎', name: 'Zero-Context Confidence', x: 25, tilt: 5 },
		{ emoji: '😵', name: 'Wi-Fi Panic', x: 41, tilt: -3 },
		{ emoji: '😱', name: 'Deadline Panic', x: 59, tilt: 4 },
		{ emoji: '🫡', name: 'Reply-All Hero', x: 75, tilt: -5 },
		{ emoji: '🤡', name: 'Pure Chaos', x: 91, tilt: 7 }
	];

	let scale = $state(1);
	let stageSize = $derived(`${POSTER_SIZE * scale}px`);

	onMount(() => {
		function fitPoster() {
			scale = Math.min(1, window.innerWidth / POSTER_SIZE, window.innerHeight / POSTER_SIZE);
		}

		fitPoster();
		window.addEventListener('resize', fitPoster);
		return () => window.removeEventListener('resize', fitPoster);
	});
</script>

<svelte:head>
	<title>ALL IN: BRAINROT — Poster</title>
	<meta
		name="description"
		content="A 1080 by 1080 promotional poster for ALL IN: BRAINROT, the fictional Clout meme battle judged by Qwen."
	/>
</svelte:head>

<main class="poster-page">
	<div class="poster-viewport" style:width={stageSize} style:height={stageSize}>
		<article
			class="poster"
			style:transform={`scale(${scale})`}
			aria-label="ALL IN BRAINROT promotional poster and game rules"
		>
			<div class="grain" aria-hidden="true"></div>
			<div class="grid" aria-hidden="true"></div>
			<div class="warning-stripe stripe-one" aria-hidden="true"></div>
			<div class="warning-stripe stripe-two" aria-hidden="true"></div>

			<header class="poster-header">
				<div class="top-rail">
					<span>★★★★★ 5-ROUND MEME SURVIVAL ★★★★★</span>
					<span>100% FICTIONAL CLOUT</span>
				</div>

				<p class="boss-alert"><i></i> FINAL BOSS DETECTED IN YOUR AREA</p>
				<h1><span>ALL IN:</span> BRAINROT</h1>
				<p class="battle-cry">
					WE ARE SMALL. OUR MEMES ARE TERRIBLE. <strong>THE MOTHERSHIP MUST FALL.</strong>
				</p>
			</header>

			<section class="mothership-zone" aria-label="Qwen as the judging mothership">
				<div class="orbit orbit-a" aria-hidden="true"></div>
				<div class="orbit orbit-b" aria-hidden="true"></div>
				<div class="god-rays" aria-hidden="true"></div>
				<div class="ship">
					<div class="ship-wing left-wing" aria-hidden="true">
						<span></span><span></span><span></span>
					</div>
					<div class="ship-wing right-wing" aria-hidden="true">
						<span></span><span></span><span></span>
					</div>
					<div class="ship-body">
						<div class="antenna" aria-hidden="true"><i></i></div>
						<div class="qwen-core">
							<img src="/Qwen%20logo-Color.png" alt="Qwen" />
						</div>
						<div class="ship-caption">THE ALL-SEEING SEMANTIC VIBE TRIBUNAL</div>
					</div>
					<div class="thrusters" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
				</div>
				<div class="judgment-beam" aria-hidden="true"><span>JUDGMENT BEAM</span></div>
			</section>

			<section class="rules-zone" aria-label="How to play">
				<div class="rules-card">
					<div class="rules-title"><span>HOW TO FIGHT A GOD</span><small>IT'S EASY-ISH</small></div>
					<ol>
						<li>
							<span class="rule-number">01</span>
							<div>
								<strong>PICK</strong>
								<p>Choose the meme that best matches the absurd situation.</p>
							</div>
						</li>
						<li>
							<span class="rule-number">02</span>
							<div>
								<strong>RISK</strong>
								<p>Bet 25%, 50%, or go <b>ALL IN</b> with fictional Clout.</p>
							</div>
						</li>
						<li>
							<span class="rule-number">03</span>
							<div>
								<strong>FIGHT</strong>
								<p>Qwen picks a rival. The best meme match wins the pot.</p>
							</div>
						</li>
					</ol>
				</div>

				<div class="goal-card">
					<p class="goal-label">YOUR IMPOSSIBLE MISSION</p>
					<h2>OUT-MEME<br />THE<br /><span>MOTHERSHIP</span></h2>
					<div class="goal-rule">
						<strong>SURVIVE 5 ROUNDS</strong><span>Finish with the most Clout.</span>
					</div>
					<div class="starting-clout">
						<small>YOU START WITH</small><strong>1,000</strong><span>FICTIONAL CLOUT</span>
					</div>
				</div>
			</section>

			<section class="smallings" aria-label="Relatable everyday meme reactions">
				<p><span>⚠</span> EVERYDAY MEMES, ASSEMBLE! <span>⚠</span></p>
				<div class="fighter-line">
					{#each fighters as fighter}
						<div
							class="fighter"
							style={`--x:${fighter.x};--tilt:${fighter.tilt}deg`}
							aria-label={fighter.name}
						>
							<i class="weapon" aria-hidden="true"></i>
							<span aria-hidden="true">{fighter.emoji}</span>
							<small>{fighter.name}</small>
						</div>
					{/each}
				</div>
			</section>

			<footer class="poster-footer">
				<div class="infinite-copy">
					<strong>ENDLESS FUN.</strong><strong>MAXIMUM BRAINROT.</strong><strong
						>ZERO REAL MONEY.</strong
					>
				</div>
				<a href="/" aria-label="Play ALL IN BRAINROT now"
					><span>PLAY NOW</span><strong>ENTER THE VIBE WAR →</strong></a
				>
				<p>
					Clout is fictional game currency. No purchases, cash-out, or prizes. Just terrible
					decisions.
				</p>
			</footer>
		</article>
	</div>
</main>

<style>
	:global(html) {
		background: #020208;
	}

	:global(body) {
		overflow: hidden;
		background: #020208;
	}

	.poster-page {
		display: grid;
		min-height: 100vh;
		place-items: center;
		overflow: hidden;
		background: #020208;
	}

	.poster-viewport {
		position: relative;
		flex: none;
	}

	.poster {
		--ink: #f8f7ff;
		--night: #080713;
		--purple: #7657ff;
		--purple-hot: #a889ff;
		--acid: #caff37;
		--cyan: #00eaff;
		--red: #ff315d;
		position: absolute;
		inset: 0 auto auto 0;
		width: 1080px;
		height: 1080px;
		overflow: hidden;
		transform-origin: top left;
		color: var(--ink);
		background:
			radial-gradient(circle at 50% 35%, rgba(118, 87, 255, 0.32), transparent 31%),
			radial-gradient(circle at 15% 70%, rgba(0, 234, 255, 0.1), transparent 24%),
			radial-gradient(circle at 88% 76%, rgba(202, 255, 55, 0.07), transparent 20%),
			linear-gradient(155deg, #100b27 0%, #060610 52%, #0e071c 100%);
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
		isolation: isolate;
	}

	.poster::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 0;
		border: 14px solid #0d0b1c;
		box-shadow:
			inset 0 0 0 3px rgba(0, 234, 255, 0.22),
			inset 0 0 90px rgba(0, 0, 0, 0.8);
		pointer-events: none;
	}

	.poster::after {
		content: 'BRAINROT // BRAINROT // BRAINROT // BRAINROT // BRAINROT //';
		position: absolute;
		z-index: 20;
		right: -255px;
		top: 464px;
		width: 620px;
		padding: 8px 0;
		background: var(--red);
		color: white;
		font-size: 14px;
		font-weight: 1000;
		letter-spacing: 0.12em;
		text-align: center;
		transform: rotate(90deg);
	}

	.grain {
		position: absolute;
		z-index: 30;
		inset: 0;
		pointer-events: none;
		opacity: 0.13;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
		mix-blend-mode: soft-light;
	}

	.grid {
		position: absolute;
		z-index: -1;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px);
		background-size: 36px 36px;
		mask-image: linear-gradient(to bottom, transparent 5%, black 28%, black 80%, transparent 100%);
	}

	.warning-stripe {
		position: absolute;
		z-index: 2;
		width: 210px;
		height: 26px;
		background: repeating-linear-gradient(135deg, var(--acid) 0 15px, #101406 15px 30px);
		box-shadow: 0 0 22px rgba(202, 255, 55, 0.16);
	}

	.stripe-one {
		left: -58px;
		top: 327px;
		transform: rotate(90deg);
	}
	.stripe-two {
		right: -56px;
		bottom: 172px;
		transform: rotate(90deg);
	}

	.poster-header {
		position: relative;
		z-index: 5;
		padding: 17px 42px 0;
		text-align: center;
	}

	.top-rail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 9px 15px;
		border: 1px solid rgba(0, 234, 255, 0.28);
		background: rgba(0, 234, 255, 0.055);
		color: var(--cyan);
		font-size: 12px;
		font-weight: 950;
		letter-spacing: 0.16em;
	}

	.top-rail span:last-child {
		color: var(--acid);
	}

	.boss-alert {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		margin: 14px 0 3px;
		padding: 5px 10px;
		border: 1px solid rgba(255, 49, 93, 0.4);
		border-radius: 999px;
		background: rgba(255, 49, 93, 0.09);
		color: #ff7e98;
		font-size: 11px;
		font-weight: 950;
		letter-spacing: 0.18em;
	}

	.boss-alert i {
		width: 7px;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--red);
		box-shadow: 0 0 11px var(--red);
	}

	h1 {
		margin: 0;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
		font-size: 101px;
		font-weight: 950;
		line-height: 0.84;
		letter-spacing: -0.045em;
		text-transform: uppercase;
		text-shadow:
			5px 5px 0 #2c145c,
			9px 9px 0 rgba(0, 0, 0, 0.45);
		transform: skewY(-1.5deg);
	}

	h1 span {
		color: transparent;
		-webkit-text-stroke: 3px var(--purple-hot);
		text-shadow: none;
	}

	.battle-cry {
		margin: 11px 0 0;
		color: #aaa6bb;
		font-size: 13px;
		font-weight: 850;
		letter-spacing: 0.09em;
	}

	.battle-cry strong {
		color: var(--acid);
	}

	.mothership-zone {
		position: absolute;
		z-index: 3;
		top: 230px;
		left: 50%;
		width: 790px;
		height: 330px;
		transform: translateX(-50%);
	}

	.orbit {
		position: absolute;
		left: 50%;
		top: 46%;
		border: 1px solid rgba(168, 137, 255, 0.21);
		border-radius: 50%;
		transform: translate(-50%, -50%) rotate(-8deg);
	}

	.orbit::before,
	.orbit::after {
		content: '';
		position: absolute;
		width: 7px;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--cyan);
		box-shadow: 0 0 12px var(--cyan);
	}

	.orbit::before {
		left: 12%;
		top: 15%;
	}
	.orbit::after {
		right: 9%;
		bottom: 18%;
		background: var(--acid);
		box-shadow: 0 0 12px var(--acid);
	}
	.orbit-a {
		width: 740px;
		height: 188px;
	}
	.orbit-b {
		width: 570px;
		height: 294px;
		transform: translate(-50%, -50%) rotate(18deg);
	}

	.god-rays {
		position: absolute;
		left: 50%;
		top: 30px;
		width: 520px;
		height: 280px;
		background: repeating-conic-gradient(
			from 265deg at 50% 42%,
			rgba(118, 87, 255, 0.12) 0deg 5deg,
			transparent 5deg 14deg
		);
		transform: translateX(-50%);
		mask-image: radial-gradient(circle, black, transparent 68%);
	}

	.ship {
		position: absolute;
		left: 50%;
		top: 72px;
		width: 700px;
		height: 206px;
		transform: translateX(-50%);
		filter: drop-shadow(0 23px 25px rgba(0, 0, 0, 0.5));
	}

	.ship-body {
		position: absolute;
		z-index: 3;
		left: 50%;
		top: 8px;
		width: 422px;
		height: 168px;
		border: 3px solid var(--purple-hot);
		clip-path: polygon(12% 0, 88% 0, 100% 55%, 84% 100%, 16% 100%, 0 55%);
		background: linear-gradient(180deg, #281d55, #100d23 63%, #080715);
		box-shadow:
			inset 0 0 38px rgba(118, 87, 255, 0.42),
			0 0 30px rgba(118, 87, 255, 0.35);
		transform: translateX(-50%);
	}

	.ship-wing {
		position: absolute;
		top: 58px;
		width: 238px;
		height: 92px;
		border: 2px solid rgba(0, 234, 255, 0.66);
		background: linear-gradient(145deg, #171235, #080713);
		box-shadow:
			inset 0 0 24px rgba(0, 234, 255, 0.13),
			0 0 17px rgba(0, 234, 255, 0.14);
	}

	.left-wing {
		left: 17px;
		clip-path: polygon(0 38%, 78% 0, 100% 30%, 81% 100%, 10% 77%);
	}
	.right-wing {
		right: 17px;
		clip-path: polygon(22% 0, 100% 38%, 90% 77%, 19% 100%, 0 30%);
	}

	.ship-wing span {
		position: absolute;
		top: 38px;
		width: 36px;
		height: 8px;
		border-radius: 999px;
		background: var(--cyan);
		box-shadow: 0 0 13px var(--cyan);
	}

	.left-wing span:nth-child(1) {
		left: 28px;
	}
	.left-wing span:nth-child(2) {
		left: 83px;
	}
	.left-wing span:nth-child(3) {
		left: 137px;
	}
	.right-wing span:nth-child(1) {
		right: 28px;
	}
	.right-wing span:nth-child(2) {
		right: 83px;
	}
	.right-wing span:nth-child(3) {
		right: 137px;
	}

	.qwen-core {
		position: absolute;
		left: 50%;
		top: 34px;
		width: 326px;
		height: 78px;
		overflow: hidden;
		border: 4px solid #c8bbff;
		border-radius: 18px;
		background: white;
		box-shadow:
			0 0 25px rgba(168, 137, 255, 0.75),
			inset 0 0 16px rgba(118, 87, 255, 0.18);
		transform: translateX(-50%);
	}

	.qwen-core img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.ship-caption {
		position: absolute;
		right: 0;
		bottom: 23px;
		left: 0;
		color: var(--cyan);
		font-size: 9px;
		font-weight: 950;
		letter-spacing: 0.22em;
		text-align: center;
	}

	.antenna {
		position: absolute;
		left: 50%;
		top: -30px;
		width: 2px;
		height: 36px;
		background: var(--purple-hot);
		transform: translateX(-50%);
	}

	.antenna i {
		position: absolute;
		left: 50%;
		top: -7px;
		width: 12px;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--red);
		box-shadow: 0 0 15px var(--red);
		transform: translateX(-50%);
	}

	.thrusters {
		position: absolute;
		z-index: 2;
		left: 50%;
		bottom: 2px;
		display: flex;
		gap: 35px;
		transform: translateX(-50%);
	}

	.thrusters i {
		width: 18px;
		height: 47px;
		clip-path: polygon(22% 0, 78% 0, 100% 100%, 50% 73%, 0 100%);
		background: linear-gradient(to bottom, white, var(--cyan) 38%, transparent);
		filter: drop-shadow(0 0 8px var(--cyan));
	}

	.judgment-beam {
		position: absolute;
		z-index: -1;
		left: 50%;
		top: 213px;
		width: 245px;
		height: 245px;
		clip-path: polygon(34% 0, 66% 0, 100% 100%, 0 100%);
		background: linear-gradient(to bottom, rgba(0, 234, 255, 0.3), rgba(118, 87, 255, 0.025));
		transform: translateX(-50%);
	}

	.judgment-beam span {
		position: absolute;
		left: 50%;
		top: 105px;
		color: rgba(255, 255, 255, 0.45);
		font-size: 9px;
		font-weight: 950;
		letter-spacing: 0.24em;
		white-space: nowrap;
		transform: translateX(-50%) rotate(90deg);
	}

	.rules-zone {
		position: absolute;
		z-index: 8;
		top: 528px;
		left: 50%;
		display: grid;
		width: 914px;
		grid-template-columns: 1.25fr 0.75fr;
		gap: 18px;
		transform: translateX(-50%);
	}

	.rules-card,
	.goal-card {
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: rgba(7, 7, 18, 0.91);
		box-shadow:
			0 18px 40px rgba(0, 0, 0, 0.38),
			inset 0 0 26px rgba(255, 255, 255, 0.018);
		backdrop-filter: blur(12px);
	}

	.rules-card {
		padding: 17px 21px 14px;
		border-left: 5px solid var(--cyan);
		transform: rotate(-0.4deg);
	}
	.rules-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}
	.rules-title span {
		font-family: Impact, sans-serif;
		font-size: 24px;
		letter-spacing: 0.025em;
	}
	.rules-title small {
		padding: 4px 7px;
		border: 1px solid rgba(202, 255, 55, 0.28);
		color: var(--acid);
		font-size: 8px;
		font-weight: 950;
		letter-spacing: 0.15em;
	}

	ol {
		display: grid;
		gap: 5px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: 43px 1fr;
		gap: 9px;
		align-items: center;
		padding: 6px 8px;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
	}
	.rule-number {
		color: transparent;
		-webkit-text-stroke: 1px var(--purple-hot);
		font-family: Impact, sans-serif;
		font-size: 29px;
		line-height: 1;
	}
	li div {
		display: grid;
		grid-template-columns: 66px 1fr;
		gap: 7px;
		align-items: center;
	}
	li strong {
		color: var(--cyan);
		font-family: Impact, sans-serif;
		font-size: 20px;
		letter-spacing: 0.05em;
	}
	li p {
		margin: 0;
		color: #c0bdcc;
		font-size: 11px;
		font-weight: 650;
		line-height: 1.3;
	}
	li b {
		color: #ff6f8b;
	}

	.goal-card {
		padding: 15px 17px;
		overflow: hidden;
		border-color: rgba(202, 255, 55, 0.33);
		background: linear-gradient(145deg, rgba(202, 255, 55, 0.075), rgba(7, 7, 18, 0.94));
		transform: rotate(0.7deg);
	}
	.goal-card::after {
		content: 'WIN';
		position: absolute;
		right: -13px;
		top: -38px;
		color: rgba(202, 255, 55, 0.06);
		font-family: Impact, sans-serif;
		font-size: 126px;
		transform: rotate(9deg);
	}
	.goal-label {
		position: relative;
		z-index: 1;
		margin: 0;
		color: var(--acid);
		font-size: 9px;
		font-weight: 950;
		letter-spacing: 0.18em;
	}
	.goal-card h2 {
		position: relative;
		z-index: 1;
		margin: 5px 0 9px;
		font-family: Impact, sans-serif;
		font-size: 35px;
		line-height: 0.86;
		letter-spacing: -0.02em;
	}
	.goal-card h2 span {
		color: var(--acid);
	}
	.goal-rule {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		padding: 7px 9px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.035);
	}
	.goal-rule strong {
		color: white;
		font-size: 12px;
		letter-spacing: 0.08em;
	}
	.goal-rule span {
		margin-top: 2px;
		color: #9b97aa;
		font-size: 9px;
	}
	.starting-clout {
		position: absolute;
		z-index: 2;
		right: 17px;
		bottom: 15px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.starting-clout small {
		color: #9894a6;
		font-size: 7px;
		font-weight: 900;
		letter-spacing: 0.12em;
	}
	.starting-clout strong {
		color: var(--cyan);
		font-family: Impact, sans-serif;
		font-size: 30px;
		line-height: 0.95;
	}
	.starting-clout span {
		color: var(--cyan);
		font-size: 7px;
		font-weight: 950;
		letter-spacing: 0.1em;
	}

	.smallings {
		position: absolute;
		z-index: 9;
		right: 56px;
		bottom: 155px;
		left: 56px;
		height: 184px;
	}

	.smallings > p {
		position: absolute;
		right: 0;
		bottom: 9px;
		left: 0;
		margin: 0;
		color: var(--acid);
		font-family: Impact, sans-serif;
		font-size: 21px;
		letter-spacing: 0.16em;
		text-align: center;
		text-shadow: 0 0 13px rgba(202, 255, 55, 0.3);
	}

	.smallings > p span {
		color: var(--red);
	}

	.fighter-line {
		position: absolute;
		inset: 0 0 40px;
		border-bottom: 3px solid rgba(168, 137, 255, 0.32);
	}

	.fighter-line::before {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -4px;
		width: 680px;
		height: 46px;
		border-radius: 50%;
		background: radial-gradient(ellipse, rgba(118, 87, 255, 0.28), transparent 67%);
		transform: translateX(-50%);
	}

	.fighter {
		position: absolute;
		left: calc(var(--x) * 1%);
		bottom: 1px;
		display: flex;
		width: 112px;
		flex-direction: column;
		align-items: center;
		transform: translateX(-50%) rotate(var(--tilt));
	}

	.fighter > span {
		position: relative;
		z-index: 2;
		font-size: 53px;
		line-height: 1;
		filter: drop-shadow(0 8px 7px rgba(0, 0, 0, 0.6));
	}

	.fighter small {
		margin-top: 6px;
		padding: 3px 5px;
		border: 1px solid rgba(255, 255, 255, 0.13);
		border-radius: 3px;
		background: #0a0915;
		color: #a9a5b7;
		font-size: 7px;
		font-weight: 900;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.weapon {
		position: absolute;
		z-index: 1;
		right: 15px;
		top: 11px;
		width: 39px;
		height: 27px;
		border: 3px solid var(--cyan);
		border-radius: 3px;
		background: linear-gradient(145deg, #271c51, #090812);
		box-shadow: 0 0 9px rgba(0, 234, 255, 0.35);
		transform: rotate(-28deg);
	}

	.weapon::before {
		content: '';
		position: absolute;
		left: -10px;
		bottom: -10px;
		width: 11px;
		height: 19px;
		border-radius: 2px;
		background: var(--purple-hot);
		transform: rotate(-26deg);
	}

	.weapon::after {
		content: 'MEME';
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: white;
		font-size: 6px;
		font-style: normal;
		font-weight: 1000;
		letter-spacing: 0.08em;
	}

	.poster-footer {
		position: absolute;
		z-index: 12;
		right: 42px;
		bottom: 21px;
		left: 42px;
	}

	.infinite-copy {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin-bottom: 8px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		color: var(--purple-hot);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-align: center;
	}

	.infinite-copy strong {
		padding: 7px 5px;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
	}
	.infinite-copy strong:nth-child(2) {
		color: var(--acid);
	}
	.infinite-copy strong:last-child {
		border: 0;
		color: var(--cyan);
	}

	.poster-footer a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 11px 15px;
		border: 2px solid var(--acid);
		background: var(--acid);
		color: #101506;
		text-decoration: none;
		box-shadow: 0 0 28px rgba(202, 255, 55, 0.24);
		transform: rotate(-0.4deg);
	}

	.poster-footer a span {
		font-family: Impact, sans-serif;
		font-size: 25px;
		letter-spacing: 0.06em;
	}
	.poster-footer a strong {
		font-size: 11px;
		letter-spacing: 0.12em;
	}
	.poster-footer p {
		margin: 7px 0 0;
		color: #6e6a7c;
		font-size: 8px;
		font-weight: 750;
		letter-spacing: 0.08em;
		text-align: center;
	}

	@media print {
		:global(body) {
			width: 1080px;
			height: 1080px;
		}
		.poster-page,
		.poster-viewport {
			width: 1080px !important;
			height: 1080px !important;
		}
		.poster {
			transform: none !important;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.poster {
			scroll-behavior: auto;
		}
	}
</style>
