import { everydaySituations, studentSituations } from '$lib/data/categorySituations';
import { everydayCards } from '$lib/data/everydayCards';
import { memeCards as codeCards } from '$lib/data/memeCards';
import { situations as codeSituations } from '$lib/data/situations';
import { studentCards } from '$lib/data/studentCards';
import type { GameCategoryId, MemeCard } from '$lib/types/game';

export type GameCategoryDefinition = {
	id: GameCategoryId;
	name: string;
	shortName: string;
	icon: string;
	description: string;
	accent: string;
};

export const gameCategories: GameCategoryDefinition[] = [
	{
		id: 'code',
		name: 'Code & Office',
		shortName: 'Code',
		icon: '💻',
		description: 'Deployments, meetings, Wi-Fi and workplace chaos.',
		accent: '#00e5ff'
	},
	{
		id: 'everyday',
		name: 'Everyday Chaos',
		shortName: 'Everyday',
		icon: '🛒',
		description: 'Laundry piles, missed buses, snacks and daily struggles.',
		accent: '#c7ff41'
	},
	{
		id: 'student',
		name: 'Student Life',
		shortName: 'Student',
		icon: '🎒',
		description: 'Deadlines, group projects, exams and campus survival.',
		accent: '#ffb13b'
	},
	{
		id: 'ai',
		name: 'AI Custom',
		shortName: 'AI Custom',
		icon: '✨',
		description: 'Describe any safe theme and Qwen creates each round live.',
		accent: '#bda5ff'
	}
];

export const staticContentPacks: Record<
	Exclude<GameCategoryId, 'ai'>,
	{ cards: MemeCard[]; situations: readonly string[] }
> = {
	code: { cards: codeCards, situations: codeSituations },
	everyday: { cards: everydayCards, situations: everydaySituations },
	student: { cards: studentCards, situations: studentSituations }
};

export const allStaticCards = [
	...staticContentPacks.code.cards,
	...staticContentPacks.everyday.cards,
	...staticContentPacks.student.cards
];

export const allStaticCardById = new Map(allStaticCards.map((card) => [card.id, card]));
export const allStaticSituations: Set<string> = new Set(
	Object.values(staticContentPacks).flatMap((pack) => [...pack.situations])
);

export function getGameCategory(category: GameCategoryId): GameCategoryDefinition {
	return gameCategories.find((item) => item.id === category) ?? gameCategories[0];
}
