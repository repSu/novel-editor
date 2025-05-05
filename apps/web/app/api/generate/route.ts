import { getPrompt } from "@/lib/prompts";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { OpenAI } from "openai";
import { match } from "ts-pattern";

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    return new Response("Missing OPENAI_API_KEY - make sure to add it to your .env file.", {
      status: 400,
    });
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  const { prompt, option, command } = await req.json();
  const messages: OpenAI.ChatCompletionMessageParam[] = match(option)
    .with("continue", () => [
      {
        role: "system",
        content: getPrompt("CONTINUE"),
      } as OpenAI.ChatCompletionSystemMessageParam,
      {
        role: "user",
        content: getPrompt("USER_EXISTING", { text: prompt }),
      } as OpenAI.ChatCompletionUserMessageParam,
    ])
    .with("improve", () => [
      {
        role: "system",
        content: getPrompt("IMPROVE"),
      } as OpenAI.ChatCompletionSystemMessageParam,
      {
        role: "user",
        content: getPrompt("USER_EXISTING", { text: prompt }),
      } as OpenAI.ChatCompletionUserMessageParam,
    ])
    .with("shorter", () => [
      {
        role: "system",
        content: getPrompt("SHORTER"),
      } as OpenAI.ChatCompletionSystemMessageParam,
      {
        role: "user",
        content: getPrompt("USER_EXISTING", { text: prompt }),
      } as OpenAI.ChatCompletionUserMessageParam,
    ])
    .with("longer", () => [
      {
        role: "system",
        content: getPrompt("LONGER"),
      } as OpenAI.ChatCompletionSystemMessageParam,
      {
        role: "user",
        content: getPrompt("USER_EXISTING", { text: prompt }),
      } as OpenAI.ChatCompletionUserMessageParam,
    ])
    .with("fix", () => [
      {
        role: "system",
        content: getPrompt("FIX"),
      } as OpenAI.ChatCompletionSystemMessageParam,
      {
        role: "user",
        content: getPrompt("USER_EXISTING", { text: prompt }),
      } as OpenAI.ChatCompletionUserMessageParam,
    ])
    .with("zap", () => [
      {
        role: "system",
        content: getPrompt("ZAP"),
      } as OpenAI.ChatCompletionSystemMessageParam,
      {
        role: "user",
        content: getPrompt("USER_COMMAND", { text: prompt, command: command }),
      } as OpenAI.ChatCompletionUserMessageParam,
    ])
    .run();

  const completion = await openai.chat.completions.create({
    messages,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  });

  return new Response(completion.toReadableStream(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
