import { InputState, MainState } from "./states";

export const inputNode = (input: InputState): Partial<MainState> => {
  const msg = input.messages?.at(-1)?.content.toString();

  return {
    currentInput: msg ?? "",
  };
};
