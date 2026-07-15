import { env } from '$env/dynamic/private';

const DEFAULT_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
const DEFAULT_MODEL = 'qwen-plus';

type QwenRequestOptions = {
	maxTokens?: number;
	temperature?: number;
	timeoutMs?: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
	return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

export function hasQwenCredentials(): boolean {
	return Boolean(env.QWEN_API_KEY?.trim());
}

export function getRoundSigningSecret(): string {
	return env.QWEN_API_KEY?.trim() || 'all-in-brainrot-local-round-token-v1';
}

export async function requestQwenContent(
	systemPrompt: string,
	userPrompt: string,
	options: QwenRequestOptions = {}
): Promise<string | null> {
	const apiKey = env.QWEN_API_KEY?.trim();
	if (!apiKey) return null;

	const baseUrl = (env.QWEN_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, '');
	const chatCompletionsUrl = baseUrl.endsWith('/chat/completions')
		? baseUrl
		: `${baseUrl}/chat/completions`;
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);

	try {
		const response = await fetch(chatCompletionsUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: env.QWEN_MODEL?.trim() || DEFAULT_MODEL,
				stream: false,
				temperature: options.temperature ?? 0.35,
				max_tokens: options.maxTokens ?? 400,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userPrompt }
				]
			}),
			signal: controller.signal
		});
		if (!response.ok) return null;
		const payload = asRecord(await response.json());
		const choices = Array.isArray(payload?.choices) ? payload.choices : [];
		const firstChoice = asRecord(choices[0]);
		const message = asRecord(firstChoice?.message);
		return typeof message?.content === 'string' ? message.content : null;
	} catch {
		return null;
	} finally {
		clearTimeout(timeout);
	}
}
