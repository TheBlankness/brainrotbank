export const everydaySituations = [
	'Which meme is most likely to survive Monday morning using only one alarm?',
	'Which meme would open the fridge five times and still find nothing to eat?',
	'Which meme would enter a shop for one item and forget that exact item?',
	'Which meme is most likely to choose the slowest checkout line?',
	'Which meme would hear a snack wrapper open from across the house?',
	'Which meme would turn a laundry chair into a permanent piece of furniture?',
	'Which meme is most likely to refresh the delivery tracker every thirty seconds?',
	'Which meme would read the entire group chat and reply with one sticker?',
	'Which meme could solve the mystery of every missing sock?',
	'Which meme would trust a phone at one-percent battery for the whole journey?',
	'Which meme is most likely to start walking just before the bus arrives?',
	'Which meme would call hitting snooze five times a morning routine?'
] as const;

export const studentSituations = [
	'Which meme would start an assignment one hour before the deadline?',
	'Which meme is most likely to carry four pens but find none during class?',
	'Which meme would become the unofficial boss of a group project?',
	'Which meme could turn the cheapest cafeteria sides into a complete meal?',
	'Which meme would highlight an entire textbook page as important?',
	'Which meme is most likely to discover a whole semester of notes before an exam?',
	'Which meme would sprint across campus to catch the last bus?',
	'Which meme could live in the library throughout final week?',
	'Which meme would let the slides do all the talking during a presentation?',
	'Which meme is most likely to appear for attendance and vanish immediately?',
	'Which meme would cross the whole campus searching for working Wi-Fi?',
	'Which meme could power a late-night study session with instant noodles?'
] as const;

export type StaticMemePackId = 'everyday' | 'student';

export const categorySituations: Record<StaticMemePackId, readonly string[]> = {
	everyday: everydaySituations,
	student: studentSituations
};
