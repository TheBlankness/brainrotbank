import { memeCards } from '$lib/data/memeCards';
import { situations } from '$lib/data/situations';
import type { MemeCard } from '$lib/types/game';

export const INITIAL_CLOUT = 1000;
export const MAX_ROUNDS = 5;

export function shuffled<T>(items: readonly T[]): T[] {
	const copy = [...items];
	for (let index = copy.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
	}
	return copy;
}

export function dealRound(previousSituation = ''): {
	situation: string;
	options: MemeCard[];
} {
	const availableSituations = situations.filter((item) => item !== previousSituation);
	return {
		situation: availableSituations[Math.floor(Math.random() * availableSituations.length)],
		options: shuffled(memeCards).slice(0, 3)
	};
}

export function chooseOpponent(playerCard: MemeCard): MemeCard {
	return shuffled(memeCards.filter((card) => card.id !== playerCard.id))[0];
}

export function calculateBet(clout: number, percent: 25 | 50 | 100): number {
	return Math.min(clout, Math.max(1, Math.round(clout * (percent / 100))));
}

export function getRank(clout: number): string {
	if (clout <= 0) return 'Financially Deleted';
	if (clout < 500) return 'Certified Bad Decision';
	if (clout < 1000) return 'Clout Survivor';
	if (clout < 1500) return 'Questionable Investor';
	if (clout < 2500) return 'Meme Broker';
	if (clout < 5000) return 'Clout Capitalist';
	return 'Too Big to Meme';
}
