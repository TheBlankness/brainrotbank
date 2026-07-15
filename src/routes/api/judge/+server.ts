import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { staticContentPacks } from '$lib/data/contentPacks';
import { fallbackJudge } from '$lib/game/fallbackJudge';
import { verifyRoundToken } from '$lib/server/generatedRoundToken';
import { getRoundSigningSecret, requestQwenContent } from '$lib/server/qwenClient';
import type { JudgeResult, MemeCard } from '$lib/types/game';

const UNSAFE_OUTPUT =
	/\b(?:slur|kill|murder|suicide|sex|sexual|politic|race|religion|disab|disease|family|appearance|body|gender|identity)\w*\b/i;

type ValidatedRequest = {
	situation: string;
	playerCard: MemeCard;
	opponentCard: MemeCard;
	betAmount: number;
	currentClout: number;
	round: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
	return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function validInteger(value: unknown, minimum: number, maximum: number): value is number {
	return (
		typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum
	);
}

async function validateRequest(value: unknown): Promise<ValidatedRequest | null> {
	const body = asRecord(value);
	const playerInput = asRecord(body?.playerCard);
	const opponentInput = asRecord(body?.opponentCard);
	if (
		!body ||
		typeof body.situation !== 'string' ||
		body.situation.length > 220 ||
		!playerInput ||
		!opponentInput ||
		typeof playerInput.id !== 'string' ||
		typeof opponentInput.id !== 'string' ||
		!validInteger(body.betAmount, 1, 10_000_000) ||
		!validInteger(body.currentClout, 1, 10_000_000) ||
		!validInteger(body.round, 1, 5)
	) {
		return null;
	}

	let situation: string | undefined;
	let playerCard: MemeCard | undefined;
	let opponentCard: MemeCard | undefined;

	if (typeof body.roundToken === 'string' && body.roundToken.length <= 12_000) {
		const generated = await verifyRoundToken(body.roundToken, getRoundSigningSecret());
		if (
			!generated ||
			generated.round !== body.round ||
			generated.situation !== body.situation ||
			generated.opponentCard.id !== opponentInput.id
		)
			return null;
		situation = generated.situation;
		playerCard = generated.playerOptions.find((card) => card.id === playerInput.id);
		opponentCard = generated.opponentCard;
	} else {
		const pack = Object.values(staticContentPacks).find((candidate) =>
			candidate.situations.some((item) => item === body.situation)
		);
		if (!pack) return null;
		situation = body.situation;
		playerCard = pack.cards.find((card) => card.id === playerInput.id);
		opponentCard = pack.cards.find((card) => card.id === opponentInput.id);
	}

	if (!situation || !playerCard || !opponentCard || playerCard.id === opponentCard.id) return null;
	if (body.betAmount > body.currentClout) return null;

	return {
		situation,
		playerCard,
		opponentCard,
		betAmount: body.betAmount,
		currentClout: body.currentClout,
		round: body.round
	};
}

function cleanText(value: unknown, maximumLength: number): string | null {
	if (typeof value !== 'string') return null;
	const cleaned = value
		.replace(/[\u0000-\u001f\u007f]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, maximumLength);
	if (!cleaned || UNSAFE_OUTPUT.test(cleaned)) return null;
	return cleaned;
}

function parseJudgeResult(content: unknown): JudgeResult | null {
	if (typeof content !== 'string' || content.length > 4_000) return null;
	const jsonCandidate = content.match(/\{[\s\S]*\}/)?.[0];
	if (!jsonCandidate) return null;
	try {
		const parsed = asRecord(JSON.parse(jsonCandidate));
		if (!parsed || (parsed.winner !== 'player' && parsed.winner !== 'opponent')) return null;
		if (typeof parsed.confidence !== 'number' || !Number.isFinite(parsed.confidence)) return null;
		const reason = cleanText(parsed.reason, 280);
		const roast = cleanText(parsed.roast, 180);
		if (!reason || !roast) return null;
		return {
			winner: parsed.winner,
			confidence: Math.round(Math.min(99, Math.max(50, parsed.confidence))),
			reason,
			roast
		};
	} catch {
		return null;
	}
}

function fallback(request: ValidatedRequest) {
	return {
		...fallbackJudge(
			request.situation,
			request.playerCard,
			request.opponentCard,
			request.round,
			request.betAmount,
			request.currentClout
		),
		source: 'fallback' as const
	};
}

async function askQwen(request: ValidatedRequest): Promise<JudgeResult | null> {
	const systemPrompt = `You are Qwen, the smug but fair judge in a fictional meme betting game.
Compare two original fictional meme cards against one absurd situation and choose the card that semantically matches it best.
Return only a valid JSON object with winner, confidence, reason, and roast. Winner must be "player" or "opponent". Confidence is an integer from 50 to 99. Reason is one or two short sentences. Roast is brief and criticises only the gameplay decision, never the person. Keep it playful and safe. No slurs, harassment, threats, sexual content, politics, violence, protected traits, appearance, family, health, or identity references.`;
	const userPrompt = `Situation: ${request.situation}

Player card: ${request.playerCard.name}
Category: ${request.playerCard.category}
Description: ${request.playerCard.description}
Traits: ${request.playerCard.traits.join(', ')}

Opponent card: ${request.opponentCard.name}
Category: ${request.opponentCard.category}
Description: ${request.opponentCard.description}
Traits: ${request.opponentCard.traits.join(', ')}

Judge the semantic match fairly. Return JSON only.`;
	const content = await requestQwenContent(systemPrompt, userPrompt, {
		maxTokens: 400,
		temperature: 0.35,
		timeoutMs: 10_000
	});
	return parseJudgeResult(content);
}

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ message: 'Malformed JSON request.' }, { status: 400 });
	}

	const validated = await validateRequest(body);
	if (!validated) return json({ message: 'Invalid judge request.' }, { status: 400 });

	const qwenResult = await askQwen(validated);
	return json(qwenResult ? { ...qwenResult, source: 'qwen' as const } : fallback(validated));
};
