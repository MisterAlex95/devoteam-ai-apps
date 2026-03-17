import { getLLM } from "./config";
import { DEFAULT_THRESHOLDS, THRESHOLD_KEYS } from "./constants";
import {
  AnomalySlice,
  Rapport,
  rapportSchema,
  recommendationOutputSchema,
} from "./schema";
import { InputState, MainState } from "./states";
import { AIMessage } from "@langchain/core/messages";

const llm = getLLM();
const structuredLlm = llm.withStructuredOutput(recommendationOutputSchema);

export const ingestDataNode = (input: InputState): Partial<MainState> => {
  const msg = input.messages?.at(-1)?.content.toString();

  return {
    currentInput: msg ?? "",
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

export const analyzeNode = (input: MainState): Partial<MainState> => {
  const record = rapportSchema.parse(JSON.parse(input.currentInput));
  const slice = recordToAnomalySlice(record);
  const hasAnomalies = Object.keys(slice).length > 1;

  if (!hasAnomalies) return {};
  return { anomaliesList: slice };
};

export const recommendNode = async (
  input: MainState,
): Promise<Partial<MainState>> => {
  const anomalies = input.anomaliesList;
  if (!anomalies) return {};

  const dataStr = JSON.stringify(anomalies);
  const response = await structuredLlm.invoke(
    `Recommend the best action to take based on the infrastructure data.
    Be concise and specific.
    Data: ${dataStr}
    Thresholds: ${JSON.stringify(DEFAULT_THRESHOLDS)}`,
  );

  return {
    messages: [new AIMessage(response.recommendation)],
  };
};
