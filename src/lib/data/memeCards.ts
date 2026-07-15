import type { MemeCard } from '$lib/types/game';

export const memeCards: MemeCard[] = [
	{
		id: 'confident-pigeon',
		name: 'Confident Pigeon',
		emoji: '🐦',
		description: 'Struts into every decision with no context and immaculate posture.',
		traits: ['confidence', 'leadership', 'guessing', 'approval', 'ceo'],
		rarity: 'Common'
	},
	{
		id: 'exhausted-wizard',
		name: 'Exhausted Wizard',
		emoji: '🧙',
		description: 'Has one spell left and it only refreshes the browser.',
		traits: ['tired', 'overtime', 'magic', 'restart', 'deadline'],
		rarity: 'Rare'
	},
	{
		id: 'corporate-goblin',
		name: 'Corporate Goblin',
		emoji: '👺',
		description: 'Collects action items, buzzwords, and unattended promotion opportunities.',
		traits: ['meeting', 'manager', 'corporate', 'email', 'promotion'],
		rarity: 'Cursed'
	},
	{
		id: 'wifi-gremlin',
		name: 'Wi-Fi Gremlin',
		emoji: '📶',
		description: 'Lives behind the router and eats bandwidth during important calls.',
		traits: ['wifi', 'router', 'network', 'restart', 'call'],
		rarity: 'Common'
	},
	{
		id: 'suspicious-accountant',
		name: 'Suspicious Accountant',
		emoji: '🧾',
		description: 'Can smell an undocumented expense from three spreadsheets away.',
		traits: ['money', 'spreadsheet', 'audit', 'risk', 'documentation'],
		rarity: 'Rare'
	},
	{
		id: 'overconfident-capybara',
		name: 'Overconfident Capybara',
		emoji: '🦫',
		description: 'Understands nothing, stays calm, and somehow gets promoted.',
		traits: ['confidence', 'promotion', 'manager', 'survival', 'clueless'],
		rarity: 'Legendary'
	},
	{
		id: 'microwave-prophet',
		name: 'Microwave Prophet',
		emoji: '📻',
		description: 'Predicts outages by listening to leftovers rotate.',
		traits: ['prediction', 'server', 'outage', 'production', 'mystery'],
		rarity: 'Cursed'
	},
	{
		id: 'monday-knight',
		name: 'Monday Knight',
		emoji: '🛡️',
		description: 'Defends the weekend from calendar invites with a foam sword.',
		traits: ['monday', 'meeting', 'calendar', 'survival', 'tired'],
		rarity: 'Common'
	},
	{
		id: 'unpaid-intern-dragon',
		name: 'Unpaid Intern Dragon',
		emoji: '🐉',
		description: 'Guards a hoard of tasks, none of which appear in the job description.',
		traits: ['intern', 'unpaid', 'overtime', 'tasks', 'deadline'],
		rarity: 'Legendary'
	},
	{
		id: 'documentation-ghost',
		name: 'Documentation Ghost',
		emoji: '👻',
		description: 'Haunts the wiki page that nobody updated after 2019.',
		traits: ['documentation', 'legacy', 'wiki', 'ignore', 'mystery'],
		rarity: 'Rare'
	},
	{
		id: 'production-hamster',
		name: 'Production Hamster',
		emoji: '🐹',
		description: 'Keeps the server running by sprinting harder whenever alarms sound.',
		traits: ['production', 'server', 'deployment', 'outage', 'panic'],
		rarity: 'Common'
	},
	{
		id: 'meeting-summoner',
		name: 'Meeting Summoner',
		emoji: '🔮',
		description: 'Conjures a recurring calendar event to solve every minor question.',
		traits: ['meeting', 'calendar', 'manager', 'discussion', 'email'],
		rarity: 'Cursed'
	},
	{
		id: 'spreadsheet-necromancer',
		name: 'Spreadsheet Necromancer',
		emoji: '📊',
		description: 'Raises dead forecasts with forbidden formulas and one hidden column.',
		traits: ['spreadsheet', 'forecast', 'formula', 'money', 'final'],
		rarity: 'Legendary'
	},
	{
		id: 'deadline-frog',
		name: 'Deadline Frog',
		emoji: '🐸',
		description: 'Sits perfectly still until the due date is close enough to taste.',
		traits: ['deadline', 'panic', 'procrastination', 'overtime', 'survival'],
		rarity: 'Common'
	},
	{
		id: 'bug-collector',
		name: 'Bug Collector',
		emoji: '🐞',
		description: 'Labels every software defect as an exciting undocumented feature.',
		traits: ['bug', 'software', 'feature', 'replace', 'testing'],
		rarity: 'Rare'
	},
	{
		id: 'cloud-chicken',
		name: 'Cloud Chicken',
		emoji: '🐔',
		description: 'Migrated to the cloud and now refuses to explain the monthly bill.',
		traits: ['cloud', 'server', 'money', 'network', 'migration'],
		rarity: 'Cursed'
	},
	{
		id: 'keyboard-oracle',
		name: 'Keyboard Oracle',
		emoji: '⌨️',
		description: 'Types a command from memory, closes the terminal, and says nothing.',
		traits: ['code', 'confidence', 'terminal', 'machine', 'mystery'],
		rarity: 'Rare'
	},
	{
		id: 'coffee-alchemist',
		name: 'Coffee Alchemist',
		emoji: '☕',
		description: 'Converts caffeine into pull requests with unpredictable side effects.',
		traits: ['coffee', 'overtime', 'pull request', 'code', 'deadline'],
		rarity: 'Common'
	},
	{
		id: 'deployment-raccoon',
		name: 'Deployment Raccoon',
		emoji: '🦝',
		description: 'Ships suspicious code at midnight, then washes its tiny hands.',
		traits: ['deployment', 'production', 'friday', 'code', 'celebration'],
		rarity: 'Legendary'
	},
	{
		id: 'legacy-code-skeleton',
		name: 'Legacy Code Skeleton',
		emoji: '💀',
		description: 'Still works, fears updates, and knows where every TODO is buried.',
		traits: ['legacy', 'code', 'bug', 'documentation', 'machine'],
		rarity: 'Cursed'
	},
	{
		id: 'notification-duck',
		name: 'Notification Duck',
		emoji: '🦆',
		description: 'Quacks seventeen alerts and forgets which one was important.',
		traits: ['notification', 'tabs', 'forget', 'alert', 'email'],
		rarity: 'Common'
	},
	{
		id: 'firewall-cat',
		name: 'Firewall Cat',
		emoji: '🐈',
		description: 'Blocks every request, including the one asking why requests are blocked.',
		traits: ['firewall', 'network', 'security', 'server', 'deny'],
		rarity: 'Rare'
	},
	{
		id: 'email-sorcerer',
		name: 'Email Sorcerer',
		emoji: '✉️',
		description: 'Replies all with such force that reporting structures rearrange.',
		traits: ['email', 'reply', 'ceo', 'apology', 'corporate'],
		rarity: 'Legendary'
	},
	{
		id: 'printer-demon',
		name: 'Printer Demon',
		emoji: '🖨️',
		description: 'Demands cyan ink before printing one page in black and white.',
		traits: ['printer', 'error', 'office', 'mystery', 'restart'],
		rarity: 'Cursed'
	}
];

export const memeCardById = new Map(memeCards.map((card) => [card.id, card]));
