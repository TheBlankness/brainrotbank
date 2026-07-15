import type { MemeCard } from '$lib/types/game';

export type GeneratedRoundPayload = {
	version: 1;
	issuedAt: number;
	prompt: string;
	round: number;
	situation: string;
	playerOptions: MemeCard[];
	opponentCard: MemeCard;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

function bytesToBase64Url(bytes: Uint8Array): string {
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(value: string): Uint8Array {
	const base64 = value
		.replace(/-/g, '+')
		.replace(/_/g, '/')
		.padEnd(Math.ceil(value.length / 4) * 4, '=');
	const binary = atob(base64);
	return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
}

function isGeneratedCard(value: unknown): value is MemeCard {
	if (typeof value !== 'object' || value === null) return false;
	const card = value as Record<string, unknown>;
	return (
		typeof card.id === 'string' &&
		card.id.startsWith('ai-') &&
		typeof card.name === 'string' &&
		card.name.length > 0 &&
		card.name.length <= 40 &&
		typeof card.emoji === 'string' &&
		card.emoji.length > 0 &&
		card.emoji.length <= 12 &&
		card.category === 'AI Custom' &&
		typeof card.description === 'string' &&
		card.description.length > 0 &&
		card.description.length <= 180 &&
		Array.isArray(card.traits) &&
		card.traits.length >= 3 &&
		card.traits.length <= 5 &&
		card.traits.every(
			(trait) => typeof trait === 'string' && trait.length > 0 && trait.length <= 28
		) &&
		(card.rarity === 'Common' ||
			card.rarity === 'Rare' ||
			card.rarity === 'Cursed' ||
			card.rarity === 'Legendary')
	);
}

function isGeneratedRoundPayload(value: unknown): value is GeneratedRoundPayload {
	if (typeof value !== 'object' || value === null) return false;
	const payload = value as Record<string, unknown>;
	return (
		payload.version === 1 &&
		typeof payload.issuedAt === 'number' &&
		Date.now() - payload.issuedAt >= -60_000 &&
		Date.now() - payload.issuedAt <= MAX_TOKEN_AGE &&
		typeof payload.prompt === 'string' &&
		payload.prompt.length >= 3 &&
		payload.prompt.length <= 160 &&
		Number.isInteger(payload.round) &&
		Number(payload.round) >= 1 &&
		Number(payload.round) <= 5 &&
		typeof payload.situation === 'string' &&
		payload.situation.length > 0 &&
		payload.situation.length <= 220 &&
		Array.isArray(payload.playerOptions) &&
		payload.playerOptions.length === 3 &&
		payload.playerOptions.every(isGeneratedCard) &&
		isGeneratedCard(payload.opponentCard) &&
		new Set([...payload.playerOptions.map((card) => card.id), payload.opponentCard.id]).size === 4
	);
}

export async function createRoundToken(
	payload: GeneratedRoundPayload,
	secret: string
): Promise<string> {
	const encodedPayload = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
	const key = await importSigningKey(secret);
	const signature = new Uint8Array(
		await crypto.subtle.sign('HMAC', key, encoder.encode(encodedPayload))
	);
	return `${encodedPayload}.${bytesToBase64Url(signature)}`;
}

export async function verifyRoundToken(
	token: string,
	secret: string
): Promise<GeneratedRoundPayload | null> {
	if (token.length > 12_000) return null;
	const [encodedPayload, encodedSignature, extra] = token.split('.');
	if (!encodedPayload || !encodedSignature || extra) return null;

	try {
		const key = await importSigningKey(secret);
		const valid = await crypto.subtle.verify(
			'HMAC',
			key,
			base64UrlToBytes(encodedSignature),
			encoder.encode(encodedPayload)
		);
		if (!valid) return null;
		const parsed: unknown = JSON.parse(decoder.decode(base64UrlToBytes(encodedPayload)));
		return isGeneratedRoundPayload(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
