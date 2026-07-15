import type { LeaderboardEntry } from '$lib/types/game';

const STORAGE_KEY = 'all-in-brainrot-leaderboard-v1';

export function sanitizePlayerName(value: string): string {
	const cleaned = value
		.replace(/[<>`{}]/g, '')
		.replace(/[\u0000-\u001f\u007f]/g, '')
		.trim()
		.slice(0, 16);
	return cleaned || 'Anonymous Goblin';
}

function sanitizeCategory(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	return (
		value
			.replace(/[<>`{}]/g, '')
			.replace(/[\u0000-\u001f\u007f]/g, '')
			.trim()
			.slice(0, 40) || undefined
	);
}

export function loadLeaderboard(): LeaderboardEntry[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
		if (!Array.isArray(value)) return [];
		return value
			.filter(
				(entry): entry is LeaderboardEntry =>
					typeof entry === 'object' &&
					entry !== null &&
					typeof entry.id === 'string' &&
					typeof entry.playerName === 'string' &&
					Number.isFinite(entry.score)
			)
			.map((entry) => ({
				...entry,
				playerName: sanitizePlayerName(entry.playerName),
				category: sanitizeCategory(entry.category)
			}))
			.sort((a, b) => b.score - a.score)
			.slice(0, 10);
	} catch {
		return [];
	}
}

export function saveLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
	if (typeof localStorage === 'undefined') return [];
	const next = [
		...loadLeaderboard(),
		{
			...entry,
			playerName: sanitizePlayerName(entry.playerName),
			category: sanitizeCategory(entry.category)
		}
	]
		.sort((a, b) => b.score - a.score)
		.slice(0, 10);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	return next;
}

export function clearLeaderboard(): void {
	if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
}
