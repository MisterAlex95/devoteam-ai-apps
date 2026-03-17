import { getLLM } from "./config";
import { DEFAULT_THRESHOLDS, THRESHOLD_KEYS } from "./constants";
import {
  AnomalySlice,
  Rapport,
  rapportSchema,
  recommendationsListSchema,
} from "./schema";
import { InputState, MainState } from "./states";
import { AIMessage } from "@langchain/core/messages";

const llm = getLLM();
const recommendationsLlm = llm.withStructuredOutput(recommendationsListSchema);
const thresholdsStr = JSON.stringify(DEFAULT_THRESHOLDS);

export const ingestDataNode = (input: InputState): Partial<MainState> => {
  const msg = input.messages?.at(-1)?.content.toString() ?? "";

  let rapport: Rapport | null = null;
  try {
    const parsed = rapportSchema.safeParse(JSON.parse(msg));
    if (parsed.success) rapport = parsed.data;
  } catch {
    console.error("Invalid JSON");
  }

  return {
    currentInput: msg,
    ...(rapport ? { rapportSchema: [rapport] } : {}),
  };
};

function recordToAnomalySlice(r: Rapport): AnomalySlice {
  const slice: AnomalySlice = { timestamp: r.timestamp };

  for (const key of THRESHOLD_KEYS) {
    const value = r[key];
    const threshold = DEFAULT_THRESHOLDS[key];
    if (typeof value === "number" && value > threshold) slice[key] = value;
  }

  const status = r.service_status;
  const hasOffline =
    status.database != "online" ||
    status.api_gateway != "online" ||
    status.cache != "online";
  if (hasOffline) slice.service_status = status;

  return slice;
}

// Analyze the infrastructure data and return the anomalies
// Could use LLM to be more specific, but want to keep it simple
export const analyzeNode = (input: MainState): Partial<MainState> => {
  const record = rapportSchema.parse(JSON.parse(input.currentInput));
  const slice = recordToAnomalySlice(record);
  const hasAnomalies = Object.keys(slice).length > 1;

  if (!hasAnomalies) return {};
  return { anomaliesList: slice };
};

// Recommend the best action to take based on the latest reports and anomalies
export const recommendNode = async (
  input: MainState,
): Promise<Partial<MainState>> => {
  const anomalies = input.anomaliesList;
  const rapports = input.rapportSchema ?? [];
  if (!anomalies || rapports.length === 0) return {};

  const rapportsStr = JSON.stringify(rapports);
  const anomaliesStr = JSON.stringify(anomalies);

  const response = await recommendationsLlm.invoke(
    `You are an infrastructure monitoring assistant. Based on the latest reports and detected anomalies, return a list of recommendations.

    For each recommendation provide:
      - priority: "high" | "medium" | "low" (high = critical metrics or offline services, medium = elevated metrics, low = preventive)
      - action: concrete action to take
      - related_metrics: array of metric names (snake_case) or "service.<name>" for service status (e.g. "service.api_gateway")
      - estimated_impact: short expected outcome

    Latest reports: ${rapportsStr}
    Anomalies (values above threshold): ${anomaliesStr}
    Thresholds: ${thresholdsStr}`,
  );

  const payload = JSON.stringify(response, undefined, 2);
  return {
    messages: [new AIMessage(payload)],
  };
};
