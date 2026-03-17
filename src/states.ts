import { MessagesValue, ReducedValue, StateSchema } from "@langchain/langgraph";
import * as z from "zod";
import { anomalySliceSchema, Rapport, rapportSchema } from "./schema";

const RAPPORT_MAX_SIZE = 10;

const rapportReducer = (a: Rapport[], b: Rapport[]) =>
  [...a, ...b].slice(-RAPPORT_MAX_SIZE);

export const baseStateFields = {
  rapportSchema: new ReducedValue(
    z.array(rapportSchema).default(() => []),
    { reducer: rapportReducer },
  ),
  anomaliesList: anomalySliceSchema,
  report: z.string().default(() => ""),
  currentInput: z.string().default(() => ""),
  messages: MessagesValue,
} as const;

export const InputStateSchema = new StateSchema({
  messages: MessagesValue,
});
export type InputState = typeof InputStateSchema.State;

export const MainStateSchema = new StateSchema(baseStateFields);
export type MainState = typeof MainStateSchema.State;
