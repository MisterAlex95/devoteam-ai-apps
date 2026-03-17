import { ChatOllama } from "@langchain/ollama";
import "dotenv/config";

const OLLAMA_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "devstral:24b";

export function getLLM(provider = "ollama") {
  if (provider === "ollama")
    return new ChatOllama({
      model: OLLAMA_MODEL,
      baseUrl: OLLAMA_URL,
      temperature: 1.0,
    });
  throw new Error(`Unknown provider: ${provider}`);
}

export const llm = getLLM(process.env.LLM_PROVIDER ?? "ollama");
