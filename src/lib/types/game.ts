export type Rarity = 'Common' | 'Rare' | 'Cursed' | 'Legendary';

export type MemeCategory =
	| 'Tech Trouble'
	| 'Office Life'
	| 'Boss Energy'
	| 'Deadline Panic'
	| 'Mystic Weirdness'
	| 'Pure Chaos';

export type MemeCard = {
	id: string;
	name: string;
	emoji: string;
	category: MemeCategory;
	description: string;
	traits: string[];
	rarity: Rarity;
};

export type JudgeResult = {
	winner: 'player' | 'opponent';
	confidence: number;
	reason: string;
	roast: string;
};

export type JudgeResponse = JudgeResult & {
	source: 'qwen' | 'fallback';
};

export type JudgeRequest = {
	situation: string;
	playerCard: MemeCard;
	opponentCard: MemeCard;
	betAmount: number;
	currentClout: number;
	round: number;
};

export type GamePhase =
	'menu' | 'selecting' | 'betting' | 'judging' | 'result' | 'finished' | 'bankrupt';

export type GameState = {
	phase: GamePhase;
	clout: number;
	round: number;
	maxRounds: number;
	wins: number;
	losses: number;
	currentSituation: string;
	playerOptions: MemeCard[];
	selectedPlayerCard: MemeCard | null;
	opponentCard: MemeCard | null;
	selectedBetPercent: 25 | 50 | 100 | null;
	betAmount: number;
	lastVerdict: JudgeResult | null;
	verdictSource: 'qwen' | 'fallback' | null;
};

export type LeaderboardEntry = {
	id: string;
	playerName: string;
	score: number;
	wins: number;
	losses: number;
	roundsCompleted: number;
	rank: string;
	createdAt: string;
};
