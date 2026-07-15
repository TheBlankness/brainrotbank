import type { JudgeResult, MemeCard } from '$lib/types/game';

const stopWords = new Set([
	'the',
	'a',
	'an',
	'and',
	'or',
	'to',
	'of',
	'in',
	'on',
	'for',
	'is',
	'it',
	'its',
	'with',
	'would',
	'which',
	'meme',
	'most',
	'likely',
	'best'
]);

const relatedWords: Record<string, string[]> = {
	deploying: ['deployment', 'production', 'code'],
	deploy: ['deployment', 'production'],
	meeting: ['calendar', 'corporate', 'manager', 'discussion'],
	email: ['reply', 'corporate', 'meeting'],
	server: ['production', 'outage', 'network', 'cloud'],
	restarted: ['restart', 'router', 'server'],
	restart: ['router', 'server', 'wifi'],
	manager: ['leadership', 'corporate', 'promotion'],
	qualified: ['confidence', 'leadership', 'clueless'],
	forget: ['notification', 'tabs', 'alert'],
	dns: ['network', 'wifi', 'server'],
	overtime: ['unpaid', 'tired', 'deadline'],
	tabs: ['notification', 'browser', 'forget'],
	machine: ['terminal', 'code', 'legacy'],
	documentation: ['wiki', 'legacy', 'ignore'],
	variable: ['code', 'final', 'bug'],
	bug: ['software', 'feature', 'testing'],
	apology: ['email', 'reply', 'ai'],
	celebrate: ['celebration', 'deployment', 'confidence'],
	router: ['wifi', 'network', 'restart'],
	ceo: ['promotion', 'leadership', 'email'],
	printer: ['office', 'error', 'restart'],
	alert: ['notification', 'outage', 'panic'],
	budget: ['money', 'spreadsheet', 'formula'],
	cloud: ['migration', 'server', 'network']
};

function hash(input: string): number {
	let value = 2166136261;
	for (let index = 0; index < input.length; index += 1) {
		value ^= input.charCodeAt(index);
		value = Math.imul(value, 16777619);
	}
	return value >>> 0;
}

function tokenize(value: string): string[] {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, ' ')
		.split(/\s+/)
		.filter((word) => word.length > 2 && !stopWords.has(word));
}

function scoreCard(situation: string, card: MemeCard, seed: string): number {
	const situationWords = tokenize(situation);
	const cardWords = new Set(tokenize(`${card.name} ${card.description} ${card.traits.join(' ')}`));
	let score = 0;

	for (const word of situationWords) {
		if (cardWords.has(word)) score += 5;
		for (const related of relatedWords[word] ?? []) {
			if (cardWords.has(related)) score += 2;
		}
	}

	return score + (hash(`${seed}:${card.id}`) % 7);
}

export function fallbackJudge(
	situation: string,
	playerCard: MemeCard,
	opponentCard: MemeCard,
	round: number,
	betAmount = 0,
	currentClout = 0
): JudgeResult {
	const seed = `${situation}:${round}:${betAmount}:${currentClout}`;
	const playerScore = scoreCard(situation, playerCard, seed);
	const opponentScore = scoreCard(situation, opponentCard, seed);
	const tieBreaker = hash(`${seed}:tie`) % 2 === 0 ? 'player' : 'opponent';
	const winner =
		playerScore === opponentScore
			? tieBreaker
			: playerScore > opponentScore
				? 'player'
				: 'opponent';
	const margin = Math.abs(playerScore - opponentScore);
	const confidence = Math.min(92, 56 + margin * 4 + (hash(`${seed}:confidence`) % 8));
	const winningCard = winner === 'player' ? playerCard : opponentCard;
	const losingCard = winner === 'player' ? opponentCard : playerCard;

	return {
		winner,
		confidence,
		reason: `${winningCard.name} matched the situation's chaotic energy better than ${losingCard.name}. The keyword evidence was suspiciously convincing.`,
		roast:
			winner === 'player'
				? 'Your decision escaped the group chat and somehow became strategy.'
				: 'That card choice had premium confidence and free-trial logic.'
	};
}
