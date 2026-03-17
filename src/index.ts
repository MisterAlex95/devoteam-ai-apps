import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { InputStateSchema, MainStateSchema } from "./states";
import { inputNode } from "./nodes";
import { HumanMessage } from "@langchain/core/messages";

const cfg = { configurable: { thread_id: "test-id" } };

export const graph = new StateGraph({
  state: MainStateSchema,
  input: InputStateSchema,
})
  .addNode("inputNode", inputNode)
  .addEdge(START, "inputNode")
  .addEdge("inputNode", END)
  .compile({ checkpointer: new MemorySaver() });

const main = async () => {
  await graph.invoke({ messages: [new HumanMessage("coucou")] }, cfg);
};

main();
