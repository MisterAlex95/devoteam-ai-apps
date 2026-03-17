import { MessagesValue, ReducedValue, StateSchema } from "@langchain/langgraph";
import * as z from "zod";
import { Rapport, rapportSchema } from "./schema";

const rapportReducer = (a: Rapport[], b: Rapport[]) => [...a, ...b];

export const baseStateFields = {
  rapportSchema: new ReducedValue(
    z.array(rapportSchema).default(() => []),
    { reducer: rapportReducer },
  ),
  currentInput: z.string().default(() => ""),
} as const;

export const InputStateSchema = new StateSchema({
  messages: MessagesValue,
});

export type InputState = typeof InputStateSchema.State;

export const MainStateSchema = new StateSchema(baseStateFields);

export type MainState = typeof MainStateSchema.State;
