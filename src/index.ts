import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { InputStateSchema, MainStateSchema } from "./states";
import { analyzeNode, ingestDataNode, recommendNode } from "./nodes";
import { HumanMessage } from "@langchain/core/messages";
import { streamJsonArray } from "./tool/streamJson";
import { Rapport } from "./schema";

const cfg = { configurable: { thread_id: "test-id" } };

export const graph = new StateGraph({
  state: MainStateSchema,
  input: InputStateSchema,
})
  .addNode("ingestDataNode", ingestDataNode)
  .addNode("analyzeNode", analyzeNode)
  .addNode("recommendNode", recommendNode)
  .addEdge(START, "ingestDataNode")
  .addEdge("ingestDataNode", "analyzeNode")
  .addConditionalEdges(
    "analyzeNode",
    (state) => (state.anomaliesList ? "recommendNode" : END),
  )
  .addEdge("recommendNode", END)
  .compile({ checkpointer: new MemorySaver() });

const main = async () => {
  const rapport = await streamJsonArray<Rapport>("rapport.json");
  for await (const r of rapport) {
    const result = await graph.invoke(
      {
        messages: [new HumanMessage(JSON.stringify(r))],
      },
      cfg,
    );
    console.log(result);
  }
};

main();
