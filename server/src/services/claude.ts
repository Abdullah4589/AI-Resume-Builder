import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-6';

const apiKey = process.env.ANTHROPIC_API_KEY;

/** Live mode is enabled only when an API key is present. */
export const isLive = Boolean(apiKey && apiKey.trim());

const client = isLive ? new Anthropic({ apiKey }) : null;

/**
 * Calls Claude with a system prompt + user content and returns the concatenated
 * text output. Throws if not in live mode (callers guard with `isLive`).
 */
export async function callClaude(system: string, userContent: string): Promise<string> {
  if (!client) throw new Error('Claude client is not configured');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages: [{ role: 'user', content: userContent }],
  });

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}

/**
 * Strips accidental markdown code fences and parses JSON safely.
 * Returns null if the text can't be parsed into JSON.
 */
export function extractJSON<T>(text: string): T | null {
  let cleaned = text.trim();
  // Remove ```json ... ``` or ``` ... ``` fences if present.
  const fenceMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to locate the first JSON array/object substring as a fallback.
    const start = cleaned.search(/[[{]/);
    const end = Math.max(cleaned.lastIndexOf(']'), cleaned.lastIndexOf('}'));
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
