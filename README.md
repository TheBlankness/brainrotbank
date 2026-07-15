# ALL IN: BRAINROT

ALL IN: BRAINROT is a local, five-round SvelteKit game about risking **fictional Clout** on original meme cards. Pick the card that best matches an absurd workplace situation, choose how much Clout to risk, and let Qwen—or the deterministic offline judge—decide whether your instinct was inspired or terminally online.

Clout is fictional game currency. There is no real money, purchasing, cash-out, wagering, or prizes.

## Features

- Complete five-round game loop with bankruptcy and final-score endings
- 24 original emoji/CSS meme cards and 24 absurd situations
- 25%, 50%, and dramatic ALL IN Clout choices
- Server-only Qwen judging through an OpenAI-compatible endpoint
- Deterministic semantic fallback judge when Qwen is not configured or unavailable
- Strict request validation and sanitized model output
- Local top-10 leaderboard with display-name sanitization
- Game-progress and muted sound-setting persistence in `localStorage`
- Responsive keyboard-accessible interface with reduced-motion support
- CSS card artwork, particles, card reveals, screen shake, and ALL IN confetti

## Local setup

Install dependencies using the package manager already configured for this repository:

```sh
yarn
```

Copy `.env.example` to `.env` and optionally add Qwen credentials. The game works without them.

```env
QWEN_API_KEY=
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
```

Start the development server:

```sh
yarn dev
```

Create or preview a production build when needed:

```sh
yarn build
yarn preview
```

Never use a `PUBLIC_` prefix for `QWEN_API_KEY`; the key must remain server-only.

## How judging works

The browser sends the situation, selected card IDs, round, balance, and Clout amount to `POST /api/judge`. The server does not trust browser-provided card copy: it reloads both cards from the local catalog by ID, verifies that the situation is part of the game, validates numeric limits, and rejects duplicate cards.

When `QWEN_API_KEY` is configured, the server calls the OpenAI-compatible `/chat/completions` endpoint with an approximately 10-second timeout. The prompt asks for a genuine semantic comparison and strict JSON. Winner, confidence, reason, and roast are validated, clamped, length-limited, and screened for unsafe topics before reaching the browser.

## Offline fallback judge

If credentials are missing, the service times out, the endpoint fails, or Qwen returns invalid output, the same request is judged locally. The fallback extracts situation keywords, expands a small set of related concepts, compares them with each card's trusted traits and description, and adds a seeded tie-break factor. Identical round inputs produce consistent results and neither side receives a built-in advantage.

The verdict panel clearly labels results as either `QWEN VERDICT` or `EMERGENCY LOCAL VERDICT`.

## Recommended competition demo

1. Open the landing page and point out the fictional-currency disclaimer.
2. Start with 1,000 Clout and show the three original cards.
3. Read the absurd situation, choose a card, and press ALL IN.
4. Let the animated tribunal judge the matchup.
5. Reveal Qwen's verdict, confidence, explanation, and playful roast.
6. Continue the run—or show the bankruptcy ending after a loss.
7. Save a short display name and open the device-local leaderboard.

## Project structure

- `src/lib/data`: meme-card and situation catalogs
- `src/lib/game`: betting, round, rank, fallback-judge, and leaderboard logic
- `src/lib/components`: reusable cards, controls, judging, results, and leaderboard UI
- `src/routes/api/judge`: validated server-only Qwen integration
- `src/routes/+page.svelte`: game-state orchestration and complete screen flow

Leaderboard entries, progress, and sound preference remain only in the current browser's `localStorage`. No database or authentication is used.
