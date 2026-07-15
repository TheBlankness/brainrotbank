import type { MemeCard } from '$lib/types/game';

export const studentCards: MemeCard[] = [
	{
		id: 'student-deadline-axolotl',
		name: 'Deadline Axolotl',
		emoji: '🦎',
		category: 'Deadline Panic',
		description: 'Looks peaceful while an assignment timer quietly enters its final hour.',
		traits: ['assignment', 'deadline', 'procrastination', 'panic', 'study'],
		rarity: 'Common'
	},
	{
		id: 'student-library-bat',
		name: 'Library Bat',
		emoji: '🦇',
		category: 'Mystic Weirdness',
		description: 'Appears after sunset, claims the corner desk, and communicates in page turns.',
		traits: ['library', 'night', 'reading', 'quiet', 'study'],
		rarity: 'Rare'
	},
	{
		id: 'student-cafeteria-alchemist',
		name: 'Cafeteria Alchemist',
		emoji: '🥣',
		category: 'Mystic Weirdness',
		description: 'Combines three affordable side dishes into one academically balanced meal.',
		traits: ['cafeteria', 'food', 'budget', 'lunch', 'experiment'],
		rarity: 'Rare'
	},
	{
		id: 'student-group-project-goose',
		name: 'Group Project Goose',
		emoji: '🪿',
		category: 'Boss Energy',
		description: 'Honk-assigns every task, edits the title slide, and demands equal credit.',
		traits: ['group project', 'teamwork', 'presentation', 'credit', 'leader'],
		rarity: 'Cursed'
	},
	{
		id: 'student-highlighter-dragon',
		name: 'Highlighter Dragon',
		emoji: '🖍️',
		category: 'Pure Chaos',
		description: 'Marks the important sentence, then marks every sentence surrounding it.',
		traits: ['notes', 'highlight', 'textbook', 'revision', 'study'],
		rarity: 'Common'
	},
	{
		id: 'student-exam-cicada',
		name: 'Exam Season Cicada',
		emoji: '🪲',
		category: 'Deadline Panic',
		description: 'Disappears all semester and emerges loudly during the final week.',
		traits: ['exam', 'finals', 'revision', 'semester', 'panic'],
		rarity: 'Legendary'
	},
	{
		id: 'student-backpack-black-hole',
		name: 'Backpack Black Hole',
		emoji: '🎒',
		category: 'Pure Chaos',
		description: 'Contains four pens until the exact moment somebody needs one.',
		traits: ['backpack', 'pen', 'supplies', 'missing', 'class'],
		rarity: 'Cursed'
	},
	{
		id: 'student-attendance-phantom',
		name: 'Attendance Phantom',
		emoji: '🕯️',
		category: 'Office Life',
		description: 'Materializes for roll call and fades before anyone can form a study group.',
		traits: ['attendance', 'class', 'roll call', 'absent', 'lecture'],
		rarity: 'Rare'
	},
	{
		id: 'student-campus-bus-sprinter',
		name: 'Campus Bus Sprinter',
		emoji: '👟',
		category: 'Deadline Panic',
		description: 'Discovers championship speed whenever the bus doors begin to close.',
		traits: ['campus', 'bus', 'late', 'running', 'class'],
		rarity: 'Common'
	},
	{
		id: 'student-noodle-scholar',
		name: 'Instant Noodle Scholar',
		emoji: '🍜',
		category: 'Tech Trouble',
		description: 'Measures study sessions in kettle boils and remaining seasoning packets.',
		traits: ['noodles', 'food', 'budget', 'late night', 'study'],
		rarity: 'Legendary'
	},
	{
		id: 'student-presentation-penguin',
		name: 'Presentation Penguin',
		emoji: '🐧',
		category: 'Boss Energy',
		description: 'Waddles to the front, forgets every word, and lets the slides achieve greatness.',
		traits: ['presentation', 'slides', 'speaking', 'nervous', 'class'],
		rarity: 'Common'
	},
	{
		id: 'student-wifi-hermit-crab',
		name: 'Wi-Fi Hermit Crab',
		emoji: '🦀',
		category: 'Tech Trouble',
		description: 'Migrates around campus searching for the one corner where the signal works.',
		traits: ['wifi', 'campus', 'internet', 'signal', 'online class'],
		rarity: 'Rare'
	}
];
