import type { MemeCard } from '$lib/types/game';

export const everydayCards: MemeCard[] = [
	{
		id: 'everyday-monday-sloth',
		name: 'Monday Sloth',
		emoji: '🦥',
		category: 'Deadline Panic',
		description: 'Moves at weekend speed while the weekday arrives at full volume.',
		traits: ['monday', 'alarm', 'tired', 'slow', 'work'],
		rarity: 'Common'
	},
	{
		id: 'everyday-laundry-kraken',
		name: 'Laundry Kraken',
		emoji: '🧺',
		category: 'Pure Chaos',
		description: 'Turns one innocent chair into a mountain of almost-clean clothes.',
		traits: ['laundry', 'clothes', 'mess', 'chair', 'chores'],
		rarity: 'Cursed'
	},
	{
		id: 'everyday-fridge-archaeologist',
		name: 'Fridge Archaeologist',
		emoji: '🧊',
		category: 'Mystic Weirdness',
		description: 'Excavates leftovers and dates them to an uncertain previous weekend.',
		traits: ['fridge', 'leftovers', 'food', 'mystery', 'snack'],
		rarity: 'Rare'
	},
	{
		id: 'everyday-bus-stop-oracle',
		name: 'Bus Stop Oracle',
		emoji: '🚏',
		category: 'Mystic Weirdness',
		description: 'Predicts the bus will appear immediately after everyone starts walking.',
		traits: ['bus', 'waiting', 'commute', 'late', 'prediction'],
		rarity: 'Rare'
	},
	{
		id: 'everyday-snack-drawer-raccoon',
		name: 'Snack Drawer Raccoon',
		emoji: '🦝',
		category: 'Office Life',
		description: 'Hears a wrapper open from three rooms away and arrives without explanation.',
		traits: ['snack', 'hungry', 'wrapper', 'sharing', 'food'],
		rarity: 'Common'
	},
	{
		id: 'everyday-alarm-clock-gladiator',
		name: 'Alarm Clock Gladiator',
		emoji: '⏰',
		category: 'Boss Energy',
		description: 'Fights five alarms every morning and calls the snooze button a strategy.',
		traits: ['alarm', 'snooze', 'morning', 'sleep', 'battle'],
		rarity: 'Legendary'
	},
	{
		id: 'everyday-grocery-cart-drifter',
		name: 'Grocery Cart Drifter',
		emoji: '🛒',
		category: 'Boss Energy',
		description: 'Enters for bread and exits with candles, cereal, and no bread.',
		traits: ['shopping', 'grocery', 'list', 'impulse', 'forgot'],
		rarity: 'Common'
	},
	{
		id: 'everyday-group-chat-pigeon',
		name: 'Group Chat Pigeon',
		emoji: '🕊️',
		category: 'Office Life',
		description: 'Reads every message, contributes one sticker, and vanishes until dinner plans.',
		traits: ['group chat', 'message', 'friends', 'reply', 'plans'],
		rarity: 'Rare'
	},
	{
		id: 'everyday-lost-sock-detective',
		name: 'Lost Sock Detective',
		emoji: '🧦',
		category: 'Mystic Weirdness',
		description: 'Maintains a corkboard connecting every missing sock to the washing machine.',
		traits: ['sock', 'missing', 'laundry', 'mystery', 'washing machine'],
		rarity: 'Legendary'
	},
	{
		id: 'everyday-delivery-door-ninja',
		name: 'Delivery Door Ninja',
		emoji: '📦',
		category: 'Deadline Panic',
		description: 'Reaches the door in record time after pretending not to track the driver.',
		traits: ['delivery', 'package', 'door', 'waiting', 'tracking'],
		rarity: 'Rare'
	},
	{
		id: 'everyday-battery-possum',
		name: 'One-Percent Possum',
		emoji: '🔋',
		category: 'Tech Trouble',
		description: 'Plays dead beside a charger while the phone clings to its final percent.',
		traits: ['phone', 'battery', 'charger', 'one percent', 'panic'],
		rarity: 'Cursed'
	},
	{
		id: 'everyday-queue-tortoise',
		name: 'Queue Tortoise',
		emoji: '🐢',
		category: 'Pure Chaos',
		description: 'Always chooses the line that stops moving for a brand-new reason.',
		traits: ['queue', 'waiting', 'checkout', 'slow', 'luck'],
		rarity: 'Common'
	}
];
