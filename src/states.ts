import { MessagesValue, ReducedValue, StateSchema } from "@langchain/langgraph";
import * as z from "zod";
import { anomalySliceSchema, Rapport, rapportSchema } from "./schema";

const rapportReducer = (a: Rapport[], b: Rapport[]) => [...a, ...b];

export const baseStateFields = {
  rapportSchema: new ReducedValue(
    z.array(rapportSchema).default(() => []),
    { reducer: rapportReducer },
  ),
  anomaliesList: anomalySliceSchema,
  currentInput: z.string().default(() => ""),
  messages: MessagesValue,
} as const;

export const InputStateSchema = new StateSchema({
  messages: MessagesValue,
});
export type InputState = typeof InputStateSchema.State;

export const MainStateSchema = new StateSchema(baseStateFields);
export type MainState = typeof MainStateSchema.State;
