window.EXAMTOPICS_ORIGINALS = [
  {
    "num": 1,
    "question": "After the web search agent and document analysis agent complete their tasks, the coordinator invokes the synthesis agent. However, the synthesis agent responds that it cannot complete the task because no research findings were provided. What is the most likely cause of this issue?",
    "options": [
      "The synthesis agent needs tools that can fetch results directly from the other agents' conversation histories.",
      "The synthesis agent's context window is not large enough to hold the combined outputs from both previous agents.",
      "The subagents need to share a single API connection to enable automatic context sharing between invocations.",
      "The coordinator did not include the outputs from the previous agents in the synthesis agent's prompt."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. The synthesis agent needs tools that can fetch results directly from the other agents' conversation histories. ❌ Incorrect.Agents do not require direct access to each other’s histories. Proper orchestration passes outputs explicitly via prompts.B. The synthesis agent's context window is not large enough to hold the combined outputs from both previous agents. ❌ Incorrect.If this were the issue, the agent would receive truncated data, not no data at all. The error indicates missing inputs entirely.C. The subagents need to share a single API connection to enable automatic context sharing between invocations. ❌ Incorrect.Agent communication does not depend on shared API connections. Context must be explicitly passed by the coordinator.D. The coordinator did not include the outputs from the previous agents in the synthesis agent's prompt. ✅ Correct.The synthesis agent can only act on the information provided in its prompt. If prior outputs are not passed, it will report missing research findings.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 2,
    "question": "When researching \"renewable energy adoption,\" the web search agent returns recent statistics (2024: 35% adoption) while the document analysis agent extracts data from internal reports (2022: 18% adoption). The synthesis agent incorrectly flags these as contradictory sources rather than recognizing the data shows growth over time. What change would best enable the synthesis agent to correctly interpret such temporal differences?",
    "options": [
      "Require subagents to include publication or data collection dates in their structured outputs.",
      "Instruct the synthesis agent to always treat the most recent data as authoritative and place older findings in a separate historical appendix.",
      "Add a conflict resolution agent that automatically discards older data when newer data exists for the same metric.",
      "Configure the web search agent to only return results from the past 6 months"
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Require subagents to include publication or data collection dates in their structured outputs. Correct.Providing timestamps allows the synthesis agent to understand that the figures refer to different points in time, enabling it to interpret the data as a trend (growth) rather than a contradiction.B. Instruct the synthesis agent to always treat the most recent data as authoritative and place older findings in a separate historical appendix. Incorrect.This approach hides useful context and does not help the agent understand relationships between data points over time.C. Add a conflict resolution agent that automatically discards older data when newer data exists for the same metric. Incorrect.Discarding older data removes valuable historical insight and prevents trend analysis.D. Configure the web search agent to only return results from the past 6 months. Incorrect.Limiting recency reduces context and does not address the core issue of interpreting time-based differences.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 3,
    "question": "Users report that final reports sometimes lack depth on specific subtopics. Investigation shows that the document analysis agent frequently identifies gaps—for instance, noting \"the retrieved sources discuss API authentication but lack details on token refresh patterns\"—but under the current strict pipeline, this insight isn't actionable since search has already completed. What is the most effective architectural change?",
    "options": [
      "Have the analysis agent report specific gaps to the coordinator, which triggers targeted searches and re-invokes analysis until sufficient.",
      "Add a research planning agent before the search phase that decomposes topics into specific sub-questions.",
      "Have the synthesis agent attach confidence scores to each section and flag areas with insufficient coverage for manual review.",
      "Have the coordinator review analysis output for gap indicators and re-invoke search with gap-informed queries when gaps are detected."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Have the analysis agent report specific gaps to the coordinator, which triggers targeted searches and re-invokes analysis until sufficient.This introduces a dynamic, agentic loop (or reflection pattern) into the workflow. Instead of a rigid, linear pipeline where steps cannot be retraced, the system can now adapt based on what it discovers.The Analysis Agent is the Expert: The document analysis agent is the one actively reading the text and identifying exactly what is missing (e.g., \"missing token refresh patterns\").The Coordinator Manages the Flow: By reporting these specific gaps back to the coordinator, the coordinator can intelligently route the workflow back to the search agent with a highly targeted query, then pass the new findings back to the analysis agent to close the loop.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 4,
    "question": "Your multi-agent research pipeline crashed after processing 12 of 28 documents. The web search agent had identified relevant sources, the document analyzer had partially complete and the synthesizer had begun pattern identification. You need to resume processing without repeating work or losing fidelity of prior findings. What state management approach be Information fidelity with context efficiency when restoring agent state?",
    "options": [
      "Have each agent persist a structured export to a known location. On resume, the coordinator loads the manifest and injects relevant state into agent prompts.",
      "Persist the coordinator's conversation log containing all task delegations and responses, providing this to agents when resuming.",
      "Have each agent maintain its own persistent state file and reload it independently at the start of each session.",
      "Index all agent outputs in a shared vector store. When resuming each agent queries the store using semantic search to retrieve relevant prior findings."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Have each agent persist a structured export to a known location. On resume, the coordinator loads the manifest and injects relevant state into agent prompts. Correct.This provides high information fidelity (structured, complete outputs) while maintaining context efficiency (only relevant pieces are re-injected into prompts). The coordinator remains in control of what each agent needs, avoiding unnecessary bloat and duplication.B. Persist the coordinator's conversation log containing all task delegations and responses, providing this to agents when resuming. ❌ Incorrect.Conversation logs are often verbose and unstructured, leading to context overload and inefficient prompt usage without guaranteed clarity.C. Have each agent maintain its own persistent state file and reload it independently at the start of each session. ❌ Incorrect.This decentralizes control and can lead to inconsistencies and coordination issues, especially when agents need shared or aligned context.D. Index all agent outputs in a shared vector store. When resuming each agent queries the store using semantic search to retrieve relevant prior findings. Incorrect.Vector stores are useful for retrieval, but they introduce probabilistic recall and may miss or distort critical structured state, reducing fidelity during recovery.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 5,
    "question": "The synthesis agent completes its initial pass but flags that three key research questions remain unanswered because the web search and document analysis agents didn't find relevant information on those specific subtopics. The coordinator currently proceeds directly to report generation, producing reports with incomplete coverage. What change would most effectively improve research completeness?",
    "options": [
      "Have the coordinator evaluate synthesis output for gaps, then re-delegate to web search and document analysis with targeted queries before Invoking synthesis again.",
      "Increase the initial breadth of queries sent to web search and document analysis to reduce the probability of missing relevant information.",
      "Have the report generation agent note which research questions couldn't be answered, so users understand the limitations of the final output.",
      "Give the synthesis agent direct access to web search tools so it can autonomously fill knowledge gaps without returning control to the coordinator."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Have the coordinator evaluate synthesis output for gaps, then re-delegate to web search and document analysis with targeted queries before invoking synthesis again. Correct.This introduces an iterative feedback loop, where identified gaps are actively addressed. The coordinator maintains control and ensures completeness before final report generation.B. Increase the initial breadth of queries sent to web search and document analysis to reduce the probability of missing relevant information. Incorrect.Broader queries may help coverage but are inefficient and still won’t guarantee that specific gaps discovered later are filled.C. Have the report generation agent note which research questions couldn't be answered, so users understand the limitations of the final output. Incorrect.This improves transparency but does not solve the completeness problem.D. Give the synthesis agent direct access to web search tools so it can autonomously fill knowledge gaps without returning control to the coordinator. Incorrect.This breaks separation of concerns and reduces system control. The coordinator should manage task delegation, not the synthesis agent.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 6,
    "question": "When analyzing complex legal cases that cite multiple precedents, the document analysis subagent processes each sequentially. A landmark case citing 12 precedents takes over 3 minutes to analyze completely. What's the most effective way to reduce this latency while preserving the coordinator's ability to monitor and debug the system?",
    "options": [
      "Enable the document analysis subagent to spawn its own specialized subagents dynamically when it encounters cases with many citations",
      "Implement a message queue where precedent analysis tasks are processed asynchronously by a pool of worker agents",
      "Create a recursive agent hierarchy where analysis agents subdivide work among child agents until reading single-precedent granularity",
      "Have the coordinator spawn parallel document analysis subagents, each handling a subset of precedents, then aggregate results before synthesis"
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Enable the document analysis subagent to spawn its own specialized subagents dynamically when it encounters cases with many citations. Incorrect.This decentralizes orchestration and makes the system harder to monitor and debug. The coordinator loses visibility into dynamically spawned agents.B. Implement a message queue where precedent analysis tasks are processed asynchronously by a pool of worker agents. Incorrect.While this improves scalability, it introduces infrastructure complexity and reduces transparency for debugging at the coordinator level.C. Create a recursive agent hierarchy where analysis agents subdivide work among child agents until reaching single-precedent granularity. Incorrect.This further complicates the architecture and makes tracing execution paths difficult, reducing observability and control.D. Have the coordinator spawn parallel document analysis subagents, each handling a subset of precedents, then aggregate results before synthesis. Correct.This enables parallel processing to reduce latency while keeping orchestration centralized. The coordinator retains full visibility, making monitoring and debugging easier.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 7,
    "question": "Introduction monitoring shows the research phase takes longer than expected. Analysis reveals the coordinator invokes the web search subagent, waits for its response, then invokes the document analysis subagent and waits again. These tasks are independent - neither requires the other's output. How should you modify the system to run these subagents concurrently?",
    "options": [
      "Switch both subagents to use a Haiku tier model instead of to reduce their individual execution time.",
      "Create an async orchestration layer outside the agent that spawns parallel threads, each running a separate coordinator subagent pair, then aggregates results.",
      "Add detailed instructions to the coordinator's system prompt explaining the performance benefits of parallel execution and requesting it invoke both subagents at the same",
      "Structure the coordinator to emit both Task tool calls (for web search and document analysis) in a single response message rather than across separate conversation turns."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Switch both subagents to use a Haiku tier model instead to reduce their individual execution time. Incorrect.This may reduce latency per task, but it does not address the core issue of sequential execution vs. parallelism.B. Create an async orchestration layer outside the agent that spawns parallel threads, each running a separate coordinator subagent pair, then aggregates results. Incorrect.This overcomplicates the architecture and duplicates coordinators unnecessarily instead of fixing concurrency within the existing flow.C. Add detailed instructions to the coordinator's system prompt explaining the performance benefits of parallel execution and requesting it invoke both subagents at the same time. Incorrect.Instructions alone are not reliable for enforcing concurrency. Execution behavior depends on how tool calls are structured, not just prompt wording.D. Structure the coordinator to emit both Task tool calls (for web search and document analysis) in a single response message rather than across separate conversation turns. Correct.Issuing both tool calls in one response enables true parallel execution, since the system can run them concurrently instead of waiting for one to finish before starting the other.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 8,
    "question": "Production reviews reveal inconsistent handling of uncertainty in final reports. Sometimes conflicting subagent findings are synthesized into a single confident statement (losing other times reports over hedge with excessive qualifications (becoming unhelpful). When the web search agent returns \"Industry analysts estimate $50B market size (methodolo the document analysis agent returns \"peer-reviewed study estimates $358 (1578, 95% CI),\" the coordinator either picks one arbitrarily or produces vague statements like \"the ma 6358-6508 depending on factors.\" What systematic approach best addresses this?",
    "options": [
      "Configure subagents to only report findings meeting a high confidence threshold, filtering uncertain information before it reaches the coordinator.",
      "Add a verification subagent that cross-references findings across sources, only passing claims to synthesis that are corroborated by at least two independent sources.",
      "Instruct the synthesis agent to structure reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterization and methodological context.",
      "Implement a confidence calibration layer that normalizes subagent uncertainty expressions to standardized probability scores (0.0-1.0), then weight-average findings by their calculated reliability scores to produce a statistically grounded synthesis."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Configure subagents to only report findings meeting a high confidence threshold, filtering uncertain information before it reaches the coordinator. Incorrect.This suppresses potentially valuable but uncertain insights and introduces bias by hiding ambiguity rather than managing it.B. Add a verification subagent that cross-references findings across sources, only passing claims to synthesis that are corroborated by at least two independent sources. Incorrect.While useful for validation, this approach still filters out uncertainty instead of representing it, and may discard novel or emerging insights.C. Instruct the synthesis agent to structure reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterization and methodological context. Correct.This directly addresses inconsistent handling of uncertainty by making it explicit and structured, allowing users to understand both consensus and disagreement without losing context.D. Implement a confidence calibration layer that normalizes subagent uncertainty expressions to standardized probability scores (0.0–1.0), then weight-average findings by their calculated reliability scores to produce a statistically grounded synthesis. Incorrect.This introduces artificial precision and may oversimplify complex, qualitative uncertainty, potentially misleading users.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 9,
    "question": "In production, you observe that simple fact-checking queries (e.g., \"What year was the Paris Climate Agreement signed?\") traverse all four subagents sequentially, consuming 40+ seconds. While this might be acceptable for complex comparative research benefits from the full pipeline. Your query distribution is diverse and evolving as users discover new applications. What's the most effective approach to optimize for varying query complexity?",
    "options": [
      "Implement pattern-based routing that categorizes queries by structure (single-fact vs. comparative vs. analytical) and maps each category to a predefined subagent combination.",
      "Train a query complexity classifier on labeled historical data to predict optimal subagent combinations, retraining periodically as query patterns evolve.",
      "Have the coordinator analyze each query and dynamically decide which subagents to invoke based on its assessment of query requirements.",
      "Create a fast-path for factual questions that bypasses subagents entirely, routing all other queries through the complete pipeline to ensure research thoroughness."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Implement pattern-based routing that categorizes queries by structure (single-fact vs. comparative vs.\nanalytical) and maps each category to a predefined subagent combination. ❌ Incorrect.\nThis is rigid and brittle. As query patterns evolve, maintaining rules becomes difficult and coverage gaps are\nlikely.\nB. Train a query complexity classifier on labeled historical data to predict optimal subagent combinations,\nretraining periodically as query patterns evolve. ❌ Incorrect.\nWhile adaptive, this introduces model maintenance overhead, requires labeled data, and may lag behind new\nor rare query types.\nC. Have the coordinator analyze each query and dynamically decide which subagents to invoke based on its\nassessment of query requirements. ✅ Correct.\nThis provides flexible, real-time routing without rigid rules or heavy ML infrastructure. The coordinator can\ntailor execution paths to query complexity efficiently.\nD. Create a fast-path for factual questions that bypasses subagents entirely, routing all other queries\nthrough the complete pipeline to ensure research thoroughness. ❌ Incorrect.\nThis is overly simplistic and risks misclassification, reducing accuracy or missing nuance for queries that\nappear simple but require deeper analysis.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 10,
    "question": "A user is expanding the research system beyond its single web search agent by adding specialized data sources. They add a financial API agent that returns structured JSON with margins, and growth rates; a news monitoring agent that returns prose summaries of recent developments; and a patent analysis agent that returns structured lists of technology synthesis agent combines these into executive briefings. Currently, it converts everything to bullet points, causing financial comparisons to lose tabular clarity and news summari narrative flow. What change would most improve briefing quality?",
    "options": [
      "Update the synthesis agent to render each content type appropriately—financial data as tables, news as prose, and technical lists as structured points.",
      "Add a format conversion layer between subagents and synthesis that transforms all outputs to a common intermediate representation (such as Markdown) to facilitate more flexible rendering.",
      "Standardize all subagent outputs to JSON with fields for every data type to ensure programmatic consistency across the pipeline.",
      "Standardize all subagent outputs to prose summaries with a uniform character to maintain a consistent executive voice regardless of the source material."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Update the synthesis agent to render each content type appropriately—financial data as tables, news as prose, and technical lists as structured points. Correct.This preserves the natural structure and strengths of each data type, improving clarity, readability, and usefulness of the final briefing.B. Add a format conversion layer between subagents and synthesis that transforms all outputs to a common intermediate representation (such as Markdown) to facilitate more flexible rendering. Incorrect.While helpful for consistency, this does not guarantee appropriate presentation of different content types and may still lead to generic formatting.C. Standardize all subagent outputs to JSON with fields for every data type to ensure programmatic consistency across the pipeline. Incorrect.This improves structure but shifts complexity to the synthesis stage and does not inherently improve human-readable output quality.D. Standardize all subagent outputs to prose summaries with a uniform character to maintain a consistent executive voice regardless of the source material. Incorrect.This sacrifices important structure (like tables and lists), reducing clarity and effectiveness for data-heavy content.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 11,
    "question": "The coordinator agent has AgentDefinitions configured for all four specialized subagents, each with appropriate descriptions, prompts, and tool restrictions. During testing, you notice the coordinator correctly reasons about when to delegate—it generates messages like “I’ll ask the web search agent to find sources on this topic”—but no subagent execution ever occurs. The coordinator then proceeds as if the delegation happened and continues with incomplete information. Logs show no errors. What is the most likely cause?",
    "options": [
      "Subagent context isolation means task descriptions from the coordinator don’t automatically reach subagents; you need to configure explicit context forwarding in Claude AgentOptions.",
      "The coordinator’s max_tokens setting is too low, causing the Task tool invocation to be truncated before the subagent type parameter can be specified.",
      "The coordinator’s allowed Tools configuration doesn’t include “Task”, so while it can reason about delegation, cannot invoke the tool required to spawn subagents.",
      "The AgentDefinitions are configured correctly, but the coordinator’s system prompt doesn’t explicitly list the available subagent types, preventing the model from knowing they can be invoked."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Subagent context isolation means task descriptions from the coordinator don’t automatically reach subagents; you need to configure explicit context forwarding in Claude AgentOptions. Incorrect.Even with context isolation, subagents would still be invoked—the issue here is that no invocation happens at all, not that context is missing.B. The coordinator’s max_tokens setting is too low, causing the Task tool invocation to be truncated before the subagent type parameter can be specified. Incorrect.Token limits might truncate responses, but this would typically produce malformed outputs or errors—not silent absence of any tool calls.C. The coordinator’s allowed Tools configuration doesn’t include “Task”, so while it can reason about delegation, it cannot invoke the tool required to spawn subagents. Correct.The coordinator can plan and describe delegation, but without the Task tool enabled, it cannot actually execute subagent calls—resulting in no errors but no execution.D. The AgentDefinitions are configured correctly, but the coordinator’s system prompt doesn’t explicitly list the available subagent types, preventing the model from knowing they can be invoked. Incorrect.While listing agents can help, the model already demonstrates awareness (“I’ll ask the web search agent…”). The problem is execution capability, not awareness.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 12,
    "question": "In production, final reports frequently contain claims without proper source attribution. Investigation shows that while the web search and document analysis agents correctly attach citations to their outputs, the synthesis agent loses track of which sources support which conclusions when combining findings. What's the most effective architectural change?",
    "options": [
      "Add a verification step where the report generator uses semantic similarity matching against original sources to reconstruct which claims came from which documents.",
      "Have the coordinator inject source identifier prefixes into text before each handoff, then parse these prefixes at report generation to reconstruct citations.",
      "Maintain complete transcripts of all subagent interactions and add a citation-resolution agent to analyze logs and determine attributions before report generation.",
      "Require all subagents to output structured claim-source mappings that the synthesis agent must preserve and merge when combining findings from multiple sources."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Add a verification step where the report generator uses semantic similarity matching against original sources to reconstruct which claims came from which documents. Incorrect.This relies on post-hoc inference, which is error-prone and can misattribute claims due to semantic ambiguity.B. Have the coordinator inject source identifier prefixes into text before each handoff, then parse these prefixes at report generation to reconstruct citations. Incorrect.This is a fragile, text-based workaround that can break during transformations and doesn’t scale well.C. Maintain complete transcripts of all subagent interactions and add a citation-resolution agent to analyze logs and determine attributions before report generation. Incorrect.This adds unnecessary complexity and still depends on indirect reconstruction rather than preserving attribution explicitly.D. Require all subagents to output structured claim-source mappings that the synthesis agent must preserve and merge when combining findings from multiple sources. Correct.This ensures end-to-end attribution fidelity by keeping claim-to-source relationships explicit and structured throughout the pipeline, preventing loss during synthesis.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 13,
    "question": "After the web search and document analysis subagents complete their tasks, the coordinator needs to spawn the synthesis subagent to synthesize the findings. What is the correct approach for providing the synthesis subagent with the information it needs?",
    "options": [
      "Provide the subagent with tool definitions that allow it to request outputs from other subagents via callbacks",
      "Include the complete findings from both subagents directly in the synthesis subagent's prompt",
      "Pass reference Identifiers and configure the subagent with read access to a shared memory store where other subagents deposited their results",
      "Spawn the subagent with only a brief task description, relying on automatic context inheritance from the coordinator"
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Provide the subagent with tool definitions that allow it to request outputs from other subagents via callbacks. Incorrect.This introduces unnecessary coupling and complexity. Subagents shouldn’t need to actively fetch data from others.B. Include the complete findings from both subagents directly in the synthesis subagent's prompt. Incorrect.While simple, this approach does not scale well for large outputs and can exceed context limits, reducing efficiency.C. Pass reference identifiers and configure the subagent with read access to a shared memory store where other subagents deposited their results. Correct.This is the most scalable and production-ready approach. It preserves information fidelity while avoiding context bloat, allowing the synthesis agent to retrieve exactly what it needs.D. Spawn the subagent with only a brief task description, relying on automatic context inheritance from the coordinator. Incorrect.There is no automatic context inheritance—without explicit data access, the synthesis agent cannot function properly.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 14,
    "question": "The web search agent has gathered several relevant sources for a research topic. The document analysis agent now needs to examine these sources. How does information flow between these two specialized subagents?",
    "options": [
      "\"The coordinator agent receives the web search agent's output and includes relevant findings in the prompt when invoking the document analysis agent.",
      "The agents communicate through an event-driven message queue, with the document analysis agent subscribing to web search completion events.",
      "The web search agent directly invokes the document analysis agent, using the discovered sources as parameters.",
      "Both agents access a shared memory store where the web search agent writes findings and the document analysis agent reads them."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. The coordinator agent receives the web search agent's output and includes relevant findings in the prompt when invoking the document analysis agent. Correct.This follows the standard orchestration pattern where the coordinator manages all data flow, explicitly passing outputs between subagents.B. The agents communicate through an event-driven message queue, with the document analysis agent subscribing to web search completion events. Incorrect.This introduces unnecessary infrastructure complexity and is not the typical agent orchestration model.C. The web search agent directly invokes the document analysis agent, using the discovered sources as parameters. Incorrect.Subagents should not invoke each other directly; this breaks centralized control and observability.D. Both agents access a shared memory store where the web search agent writes findings and the document analysis agent reads them. Incorrect.While possible in advanced systems, this is not the standard or simplest approach; it adds complexity without clear necessity in typical pipelines.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 15,
    "question": "After the web search agent finds 25 sources (120K tokens of raw content), the document analysis agent extracts key insights (15K tokens), and the synthesis agent produces a coherent narrative draft (3K tokens), the coordinator must pass context to the report generation agent for the final output with proper source citations. What context-passing strategy provides the best balance of completeness and efficiency?",
    "options": [
      "Pass only the synthesis draft and have a separate post-processing pipeline match claims to sources and insert citations after the report is generated.",
      "Pass the full accumulated context from all prior agents.",
      "Pass the synthesis draft along with a structured source index that maps key claims to their source URLs and ant Irant excerpts.",
      "Pass a condensed summary of all prior stages that preserves the main findings and attributes them to sources by name only."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Pass only the synthesis draft and have a separate post-processing pipeline match claims to sources and insert citations after the report is generated. Incorrect.This relies on post-hoc reconstruction, which is error-prone and can lead to incorrect or missing citations.B. Pass the full accumulated context from all prior agents. Incorrect.This ensures completeness but is highly inefficient (120K+ tokens) and risks exceeding context limits.C. Pass the synthesis draft along with a structured source index that maps key claims to their source URLs and relevant excerpts. Correct.This provides the best balance of completeness and efficiency—retaining precise attribution while keeping context size manageable.D. Pass a condensed summary of all prior stages that preserves the main findings and attributes them to sources by name only. Incorrect.This loses granularity and makes precise citation mapping difficult, reducing attribution fidelity.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 16,
    "question": "Your search products tool queries an external catalog API that returns paginated results (50 items per request). Production logs show queries frequently match 200+ products, and the design that auto-fetches all pages causes 15-20 second delays. How should you redesign the pagination handling?",
    "options": [
      "Create separate search products and fetch more results tools for pagination.",
      "Implement server-side relevance ranking and return only the top 50 most relevant items.",
      "Add a max pages parameter (default: 2) that controls how many pages are fetched internally.",
      "Return the first page with total match count and cursor for additional pages."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Create separate search products and fetch more results tools for pagination. Incorrect.This exposes pagination mechanics to the agent, increasing complexity and coupling tool usage with control flow.B. Implement server-side relevance ranking and return only the top 50 most relevant items. Incorrect.While this reduces latency, it removes access to the full result set, limiting flexibility when more results are actually needed.C. Add a max pages parameter (default: 2) that controls how many pages are fetched internally. Incorrect.This is an improvement over fetching everything, but it still hides pagination control inside the tool and may fetch unnecessary data.D. Return the first page with total match count and cursor for additional pages. Correct.This enables lazy loading and explicit control, allowing the agent to fetch more results only when needed—balancing performance and completeness.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 17,
    "question": "Your search Flights tool calls an external airline API that occasionally returns a 503 Service Unavailable error. What is the most effective way to handle this error in your tool implementation?",
    "options": [
      "Return an empty flight list as if the search succeeded but found no matching flights.",
      "Log the error internally and return an empty response, letting the model continue without the flight data.",
      "Return an error message in the tool result explaining the service is temporarily unavailable.",
      "Automatically retry the request up to five times with exponential backoff before returning results to the agent."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Return an empty flight list as if the search succeeded but found no matching flights. Incorrect.This hides the failure and misleads the system into thinking no flights exist, which can lead to incorrect conclusions.B. Log the error internally and return an empty response, letting the model continue without the flight data. Incorrect.This still suppresses the failure signal, preventing the agent from taking corrective action.C. Return an error message in the tool result explaining the service is temporarily unavailable. Incorrect.While transparent, this alone doesn’t attempt recovery and may degrade user experience unnecessarily.D. Automatically retry the request up to five times with exponential backoff before returning results to the agent. Correct.This is the most effective approach—handles transient failures gracefully, improves reliability, and only surfaces errors if retries fail.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 18,
    "question": "Your MCP server implements a check_availability tool that queries an external calendar API. During testing, you encounter three error conditions:(1) the tool is called with a malformed request, missing the required user_email parameter(2) the calendar API returns a 404 because the specified user doesn't exist in the calendar system(3) the calendar API returns a 503 because the service is temporarily unavailable.How should each error be reported according to MCP's error handling design?",
    "options": [
      "Report all three as tool results with isError: true",
      "Report errors 1 and 2 as JSON-RPC protocol errors, report error 3 as a tool result with isError: true",
      "Report error 1 as a JSON-RPC protocol error, report errors 2 and 3 as tool results with isError: true",
      "Report all three as JSON-RPC protocol errors."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Report all three as tool results with isError: true Incorrect.Malformed requests (error 1) are protocol-level issues, not tool execution results, so they should not be reported this way.B. Report errors 1 and 2 as JSON-RPC protocol errors, report error 3 as a tool result with isError: true Incorrect.A 404 (error 2) is a valid tool execution outcome (the user doesn’t exist), not a protocol error.C. Report error 1 as a JSON-RPC protocol error, report errors 2 and 3 as tool results with isError: true Correct.Error 1 (malformed request) → JSON-RPC protocol error (invalid input)Error 2 (user not found) → Tool result with isError: true (valid execution, meaningful failure)Error 3 (service unavailable) → Tool result with isError: true (transient external failure)D. Report all three as JSON-RPC protocol errors. ❌ Incorrect.Only malformed requests should be protocol errors; external API responses are tool-level outcomes, not protocol failures.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 19,
    "question": "Your documents (query) tool returns results as \"Found 3 documents: Q2 Budget Proposal, Q2 Budget Forecast, Annual Review\". You want the agent to document (4, multi) and doc (24, multi). What return format would best enable these multi-step workflows?",
    "options": [
      "URLs that users can click to open the document in their browser.",
      "Structured data containing document IDs and metadata for each result.",
      "A JSON array of document titles extracted from the search results.",
      "More detailed human-readable descriptions including the size and authors."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "A. URLs that users can click to open the document in their browser. Incorrect.URLs are useful for users, but not ideal for agents performing multi-step workflows that require reliable referencing and further operations.B. Structured data containing document IDs and metadata for each result. Correct.This enables the agent to programmatically reference specific documents (via IDs) across multiple steps, making workflows like follow-up queries or document retrieval precise and reliable.C. A JSON array of document titles extracted from the search results. Incorrect.Titles alone are ambiguous and not stable identifiers, making it difficult for agents to reliably act on specific documents.D. More detailed human-readable descriptions including the size and authors. Incorrect.Helpful for users, but still unstructured and not suitable for precise multi-step agent operations.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 20,
    "question": "Your agent has access to 50+ specialized API connectors for different external services. As the connector library grew, tool selection accuracy dropped to 58%. You design a search_connectors(description) tool that finds matching connectors, but in testing agents frequently skip searching and call connectors directly (often incorrectly), or search select wrong connectors from the filtered results.How should you design the tool composition pattern to address both issues?",
    "options": [
      "Design connectors with built-in compatibility validation that return descriptive errors for mismatched requests.",
      "Design a find_and_execute(description, params) composite tool that searches and immediately executes the best matching connector.",
      "Enhance all connector descriptions with detailed usage samples, edge cases, and input requirements. Add few-shot examples showing the correct search-then-use workflow.",
      "Design search_connectors to dynamically add matched connectors to the agent's available tools. Connectors start unavailable and persist once discovered."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Design connectors with built-in compatibility validation that return descriptive errors for mismatched requests. Incorrect.This helps with error handling after a wrong choice is made, but does not improve initial tool selection accuracy.B. Design a find_and_execute(description, params) composite tool that searches and immediately executes the best matching connector. Incorrect.This removes transparency and control, making debugging harder and preventing the agent from reasoning about tool choice.C. Enhance all connector descriptions with detailed usage samples, edge cases, and input requirements. Add few-shot examples showing the correct search-then-use workflow. Incorrect.While helpful, this still relies on the agent to follow instructions and does not enforce correct behavior, especially at scale with 50+ tools.D. Design search_connectors to dynamically add matched connectors to the agent's available tools. Connectors start unavailable and persist once discovered. Correct.This enforces the search-first pattern by limiting available tools initially and reducing the decision space, improving both discovery and correct selection.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 21,
    "question": "Your publish article tool calls an external CMS API that occasionally returns transient errors (network timeouts, 503s) and non-transient errors (403 permission denied, 422 validation failure).Currently, every error is returned directly to the agent, which leads to the agent retrying non-transient errors and wasting turns on failures that will never succeed. How should you partition error-handling responsibility between the tool implementation and the agent?",
    "options": [
      "Handle all errors inside the tool: Implement retries with exponential backoff for every error type, and only surface a failure to the agent after a fixed number of retry attempts have been exhausted.",
      "Handle transient errors (timeouts, 503s) with automatic retries inside the tool implementation, and surface non-transient errors (permission denied, validation fallures) to the agent with descriptive messages so it can take corrective action.",
      "Surface all errors to the agent immediately with detailed context, and let the agent decide which errors to retry and how many times-keeping the tool implementation stateless and simple.",
      "Implement a universal error handler that catches all exceptions and returns a generic \"tool unavailable-try again later\" message, shielding the agent from error complexity."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "A. Handle all errors inside the tool: Implement retries with exponential backoff for every error type, and only surface a failure to the agent after a fixed number of retry attempts have been exhausted. ❌ Incorrect.This wastes time retrying non-transient errors (e.g., 403, 422) that will never succeed and hides useful feedback from the agent.B. Handle transient errors (timeouts, 503s) with automatic retries inside the tool implementation, and surface non-transient errors (permission denied, validation failures) to the agent with descriptive messages so it can take corrective action. ✅ Correct.This cleanly separates responsibility:Tool handles recoverable/transient issues automaticallyAgent receives actionable errors it can fix (permissions, input validation)C. Surface all errors to the agent immediately with detailed context, and let the agent decide which errors to retry and how many times—keeping the tool implementation stateless and simple. ❌ Incorrect.This pushes retry logic to the agent, leading to inefficient behavior and wasted turns.D. Implement a universal error handler that catches all exceptions and returns a generic \"tool unavailable—try again later\" message, shielding the agent from error complexity. ❌ Incorrect.This removes critical detail, preventing the agent from taking corrective actions when possible.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 22,
    "question": "Your remove_team_member tool uses a dry_run: boolean parameter for previewing impacts before execution. Production monitoring shows the agent bypasses the preview step in 15% of calls by calling with dry_run=false directly. You need to ensure every removal is preceded by a preview that the user explicitly confirms. What is the most reliable approach?",
    "options": [
      "Add server-side validation that permits dry_run=false only when a dry_run=true call with identical parameters occurred within the past 60 seconds.",
      "Replace with two tools: preview_remove_member returns impact details and a single-use confirmation token; execute_remove_member requires that token, binding execution to the specific previewed action.",
      "Annotate the tool as requiring confirmation and configure the orchestration layer to prompt the user for approval before forwarding any calls to annotated tools.",
      "Add detailed instructions and few-shot examples to the tool description requiring the agent to always call with dry_run=true first and wait for user confirmation before calling with dry_run=false."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "A. Add server-side validation that permits dry_run=false only when a dry_run=true call with identical parameters occurred within the past 60 seconds. ❌ Incorrect. This approach is brittle because it depends on timing and does not guarantee that the user actually reviewed or confirmed the preview.B. Replace with two tools: preview_remove_member returns impact details and a single-use confirmation token; execute_remove_member requires that token, binding execution to the specific previewed action. ✅ Correct. This enforces the correct workflow at the system level by requiring a valid preview step and tying execution to an explicit confirmation, making bypass impossible.C. Annotate the tool as requiring confirmation and configure the orchestration layer to prompt the user for approval before forwarding any calls to annotated tools. ❌ Incorrect. This depends on orchestration behavior and is not strictly enforced, so it can still be bypassed or misconfigured.D. Add detailed instructions and few-shot examples to the tool description requiring the agent to always call with dry_run=true first and wait for user confirmation before calling with dry_run=false. ❌ Incorrect. Instruction-based approaches are not reliable for enforcement, as demonstrated by the existing bypass rate.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 23,
    "question": "Your expense reimbursement agent processes employee requests using a process reimbursement tool. Company policy requires that reimbursements above $500 must be approved before funds are disbursed. The agent handles hundreds of requests daily, and you need the threshold enforcement to be tamper-proof regardless of how the agent is prompted ensures the $500 approval threshold cannot be bypassed?",
    "options": [
      "The process reimbursement tool accepts an approved by manager parameter. The system prompt instructs the agent to only set this to true after confirming that a manager approved the request. A nightly audit script reviews all reimbursements where approved by manager was set to true.",
      "Provide two tools: auto reimburse (hard-coded limit of $500) and manager approval. Include detailed system prompt instructions telling the agent to check the amount and use the appropriate tool. Add a Post ToolUse hook that logs which tool was called for auditing.",
      "The process reimbursement tool accepts amount and details, and internally enforces the threshold; amounts <$500 are auto-disbursed and the tool returns a success confirmation. Amounts >$500 cause the tool to create a pending approval request and return a status indicating manager review is pending.",
      "Implement the threshold check in a PreToolUse hook that inspects the amount parameter before process reimbursement executes. If the amount exceeds $500, the hook modifies the context to add a requires approval: true flag, which the tool checks before disbursing."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. The process reimbursement tool accepts an approved by manager parameter. The system prompt instructs the agent to only set this to true after confirming that a manager approved the request. A nightly audit script reviews all reimbursements where approved by manager was set to true. ❌ Incorrect. This relies on the agent following instructions and post-hoc auditing, which is not tamper-proof and allows bypass at execution time.B. Provide two tools: auto reimburse (hard-coded limit of $500) and manager approval. Include detailed system prompt instructions telling the agent to check the amount and use the appropriate tool. Add a Post ToolUse hook that logs which tool was called for auditing. ❌ Incorrect. Again depends on agent behavior and correct tool selection. Logging helps auditing but does not prevent misuse.C. The process reimbursement tool accepts amount and details, and internally enforces the threshold; amounts <$500 are auto-disbursed and the tool returns a success confirmation. Amounts >$500 cause the tool to create a pending approval request and return a status indicating manager review is pending. ✅ Correct. This enforces the rule inside the tool itself, making it impossible to bypass regardless of how the agent is prompted.D. Implement the threshold check in a PreToolUse hook that inspects the amount parameter before process reimbursement executes. If the amount exceeds $500, the hook modifies the context to add a requires approval: true flag, which the tool checks before disbursing. ❌ Incorrect. PreToolUse hooks can be bypassed or misconfigured and still rely on downstream logic. Enforcement should reside directly within the tool for full reliability.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 24,
    "question": "Your order management system requires tools for three distinct operations: issuing refunds (requires amount and reason), canceling orders (requires reason), and res (requires shipping address). Each operation shares an order id parameter but has different additional requirements. You notice during testing that with your current frequently omits required parameters or includes irrelevant ones. What design change will most effectively improve parameter accuracy?",
    "options": [
      "Split into three separate tools (each defining only the parameters required for that specific operation.",
      "Keep one unified tool with all parameters marked optional, but add few-shot examples in the system prompt showing correct parameter combinations for each operation.",
      "Keep one unified tool but add JSON Schema if-then-else conditionals to enforce that parameters like amount are required only when the operation type is \"refund\".",
      "Keep one unified tool with a nested operation object parameter whose internal structure varies by operation type, documented in the tool description."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Split into three separate tools (e.g., issue_refund, cancel_order, reship_order), each defining only the parameters required for that specific operation. ✅ Correct. This reduces ambiguity and ensures the agent only sees relevant parameters per operation, leading to much higher accuracy.B. Keep one unified tool with all parameters marked optional, but add few-shot examples in the system prompt showing correct parameter combinations for each operation. ❌ Incorrect. Examples help, but the schema remains ambiguous, so errors will still occur.C. Keep one unified tool but add JSON Schema if-then-else conditionals to enforce that parameters like amount are required only when the operation type is \"refund\". ❌ Incorrect. While technically valid, this increases complexity and is less reliable than simply separating tools.D. Keep one unified tool with a nested operation object parameter whose internal structure varies by operation type, documented in the tool description. ❌ Incorrect. This adds complexity and cognitive load, making it harder for the agent to consistently provide correct parameters.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 25,
    "question": "Your portfolio value tool returns the total value of a user's investment portfolio. You're deciding between returning a structured JSON object with explicit fields versus returning information as a formatted text string. What is the primary advantage of using structured output with defined fields?",
    "options": [
      "Structured JSON consumes significantly fewer tokens than natural language, substantially reducing API costs.",
      "The agent can reliably extract specific values without parsing free form text, reducing errors in subsequent operations.",
      "Structured JSON is processed deterministically by the model, significantly improving accuracy when extracting values.",
      "JSON schemas automatically validate that the underlying API returned correct data before the agent processes it."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "A. Structured JSON consumes significantly fewer tokens than natural language, substantially reducing API costs. ❌ Incorrect. Token usage depends on the content; JSON is not inherently more compact than text and may sometimes use more tokens.B. The agent can reliably extract specific values without parsing free form text, reducing errors in subsequent operations. ✅ Correct. Structured output provides clear, predictable fields, making it easy for the agent to use the data accurately in downstream steps.C. Structured JSON is processed deterministically by the model, significantly improving accuracy when extracting values. ❌ Incorrect. The model is still probabilistic; JSON improves structure, but not deterministic processing.D. JSON schemas automatically validate that the underlying API returned correct data before the agent processes it. ❌ Incorrect. Schemas define structure, but they do not guarantee correctness of the actual data returned by the API.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 26,
    "question": "Your scheduling agent uses get_available_slots(date, provider_id) to retrieve open appointment times, then book_appointment(provider_id, slot_time, patient_id) to reserve a slot. tickets show that 15% of booking attempts fall with \"slot no longer available\" because another user booked the slot between the availability check and the booking call. How should you r these tools?",
    "options": [
      "Modify book_appointment to return detailed failure information including currently available alternative slots when the requested slot is unavailable, enabling the agent to retry with a di time.",
      "Keep both tools but add retry logic to the agent's system prompt, instructing it to call get_available_slots again and select a different time if booking fails.",
      "Add a hold_slot(provider_id, slot_time) tool that creates a 60 second temporary reservation, requiring the agent to call it between checking availability and booking.",
      "Combine both tools into a single find_and_book_appointment that atomically checks availability and books, returning either the confirmed booking or available alternatives."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Modify book_appointment to return detailed failure information including currently available alternative slots when the requested slot is unavailable, enabling the agent to retry with a different time. ❌ Incorrect. This improves recovery but does not fix the race condition between availability check and booking.B. Keep both tools but add retry logic to the agent's system prompt, instructing it to call get_available_slots again and select a different time if booking fails. ❌ Incorrect. This still suffers from the same race condition and relies on agent behavior rather than fixing the underlying issue.C. Add a hold_slot(provider_id, slot_time) tool that creates a 60 second temporary reservation, requiring the agent to call it between checking availability and booking. ❌ Incorrect. This reduces the issue but introduces additional complexity and still requires multiple steps that can fail.D. Combine both tools into a single find_and_book_appointment that atomically checks availability and books, returning either the confirmed booking or available alternatives. ✅ Correct. This eliminates the race condition by making the operation atomic, ensuring consistency and reliability.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 27,
    "question": "Your agent has a log_workout tool that accepts exercise_type (string), value (number), and measurement (string). Production monitoring shows the agent frequently passes mismatched combinations-using measurement: \"reps\" for cardio exercises like running, or measurement: \"miles\" for strength exercises like bench press. Your exercises naturally divide into two categories: cardio (measured in time or distance) and strength (measured in reps and sets). 23% of tool calls have invalid combinations. What approach would most effectively reduce these errors?",
    "options": [
      "Implement server-side validation returning descriptive errors for invalid combinations, allowing the agent to retry with corrections.",
      "Add enum constraints on measurement limiting values to \"minutes\", \"miles\", \"reps\", or \"sets\" to prevent arbitrary measurement strings.",
      "Add explicit examples to the tool description showing valid combinations (e.g., \"For running: use minutes or miles. For push-ups: use reps\") with constraints for each exercise category.",
      "Split into log_cardio_workout (with duration_minutes or distance_miles parameters) and log_strength_workout (with reps and sets parameters)."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Implement server-side validation returning descriptive errors for invalid combinations, allowing the agent to retry with corrections. ❌ Incorrect. This catches errors after they occur but does not prevent them, leading to wasted turns and inefficiency.B. Add enum constraints on measurement limiting values to \"minutes\", \"miles\", \"reps\", or \"sets\" to prevent arbitrary measurement strings. ❌ Incorrect. This restricts values but does not prevent invalid combinations (e.g., still allows \"miles\" for bench press).C. Add explicit examples to the tool description showing valid combinations (e.g., \"For running: use minutes or miles. For push-ups: use reps\") with constraints for each exercise category. ❌ Incorrect. Helpful guidance, but not enforceable—agents can still make mistakes.D. Split into log_cardio_workout (with duration_minutes or distance_miles parameters) and log_strength_workout (with reps and sets parameters). ✅ Correct. This enforces correctness at the schema level by eliminating invalid parameter combinations entirely, significantly reducing errors.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 28,
    "question": "Your MCP server includes archive_file(file_id) and delete_file(file_id) tools. Production logs show the agent calls delete_file when users ask to \"remove old backups,\" policy requires archiving backup files. Both tools currently have minimal descriptions: \"Archives a file\" and \"Deletes a file.\" Which change most directly improves tool selection?",
    "options": [
      "Add a confirmation step that requires users to type \"CONFIRM DELETE\" before delete_file executes.",
      "Implement server-side validation that rejects delete_file calls for files tagged as backups, returning an error message suggesting archive_file.",
      "Expand tool descriptions to clarify use cases, adding guidance like \"Do not use for backup files\" to delete_file.",
      "Add few-shot examples to the system prompt demonstrating that requests involving \"backup\" or \"old\" should use archive_file."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Add a confirmation step that requires users to type \"CONFIRM DELETE\" before delete_file executes. ❌ Incorrect. This prevents accidental execution but does not improve the agent’s tool selection decision.B. Implement server-side validation that rejects delete_file calls for files tagged as backups, returning an error message suggesting archive_file. ❌ Incorrect. This enforces policy after the wrong choice is made but does not directly improve initial selection.C. Expand tool descriptions to clarify use cases, adding guidance like \"Do not use for backup files\" to delete_file. ✅ Correct. Clear, specific descriptions directly influence the agent’s tool selection reasoning, making it less likely to choose the wrong tool.D. Add few-shot examples to the system prompt demonstrating that requests involving \"backup\" or \"old\" should use archive_file. ❌ Incorrect. Helpful, but less direct and less reliable than improving the tool descriptions themselves.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 29,
    "question": "Your CRM agent's delete_contact tool handles requests like \"delete the duplicate entry for Acme Corp.\" The database contains similarly named records (e.g., \"Acme Corp,\" \"Acme Corporation,\" \"ACME Corp Inc.\"), and analytics show 8% of deletions are reversed within 24 hours due to misidentified records. Users have also complained that the current multi-step confirmation flow adds too much friction to routine cleanup tasks. Which approach most effectively reduces the error rate while maintaining workflow efficiency?",
    "options": [
      "Present matched records with differentiating fields and require single-click confirmation of the intended target before executing deletion.",
      "Require users to supply the exact record ID from the CRM Interface rather than using natural language references to contact names.",
      "Deploy automated duplicate detection that identifies and merges probable duplicates, removing the need for manual deletion requests.",
      "Implement soft-delete with a 30-day recovery window so users can undo mistakes without slowing down the deletion workflow."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Present matched records with differentiating fields and require single-click confirmation of the intended target before executing deletion. ✅ Correct. This directly addresses ambiguity by showing clear distinctions between similar records while keeping the workflow fast with a lightweight confirmation step.B. Require users to supply the exact record ID from the CRM interface rather than using natural language references to contact names. ❌ Incorrect. This reduces errors but adds significant friction and hurts usability for routine tasks.C. Deploy automated duplicate detection that identifies and merges probable duplicates, removing the need for manual deletion requests. ❌ Incorrect. Helpful as a separate improvement, but it doesn’t solve incorrect deletions during manual requests.D. Implement soft-delete with a 30-day recovery window so users can undo mistakes without slowing down the deletion workflow. ❌ Incorrect. This mitigates impact after errors occur but does not reduce the error rate itself.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 30,
    "question": "After Implementing tool use with strict schema definitions, JSON syntax errors are eliminated, but 5% of extractions still have valid JSON with empty arrays or null values for required fields like citations and methodology. Spot-checking reveals that source documents contain this information, but in varied formats—Inline citations vs. bibliographies, methodology sections vs. details embedded in Introductions. What's the most effective way to address these failures?",
    "options": [
      "Modify your schema to make citations and methodology optional, and flag Incomplete records for manual review rather than falling validation.",
      "Build a regex-based post-processing layer that scans source documents for citation patterns and methodology keywords, populating empty fields when the model falls to extract.",
      "Add few-shot examples demonstrating extractions from documents with varied structures—showing how to identify citations in different formats and locate methodology details across section types.",
      "Implement retry logic that re-sends requests when validation detects empty required fields."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Modify your schema to make citations and methodology optional, and flag incomplete records for manual review rather than failing validation. ❌ Incorrect. This lowers data quality standards and avoids solving the extraction problem.B. Build a regex-based post-processing layer that scans source documents for citation patterns and methodology keywords, populating empty fields when the model fails to extract. ❌ Incorrect. Regex approaches are brittle and unreliable across varied formats, especially for complex structures like methodology.C. Add few-shot examples demonstrating extractions from documents with varied structures—showing how to identify citations in different formats and locate methodology details across section types. ✅ Correct. This directly improves the model’s ability to generalize across diverse document formats, addressing the root cause of missed extractions.D. Implement retry logic that re-sends requests when validation detects empty required fields. ❌ Incorrect. Retries without improving guidance will likely produce the same incomplete outputs.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 31,
    "question": "The system processes product reviews using tool use with a defined schema: rating (integer 1-5), pros (string array), cons (string array), and overall_sentiment (enum: positive, neTesting reveals two issues with brief or ambiguous reviews (-20% of the dataset): (1) for reviews like \"Great product!\", Claude fabricates specific pros and cons rather than IndicaInformation isn't explicitly stated, and (2) for sarcastic reviews like \"Well that was.. interesting\", Claude picks sentiment arbitrarily since there's no option for ambiguous cases. Wmodification best addresses both issues?",
    "options": [
      "Make pros and cons optional fields, and add \"neutral\" and \"unclear\" to the sentiment enum",
      "Allow empty arrays for pros/cons as valid output, and add \"unclear\" ss the sentiment enum",
      "Add an extraction_confidence field (0.0-1.0) for each value, and filter outputs where any confidence falls below a threshold.",
      "Allow null values for pros/cons, and add \"unclear\" to the sentiment earum."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "A. Make pros and cons optional fields, and add \"neutral\" and \"unclear\" to the sentiment enum ❌ Incorrect.Making fields optional can lead to inconsistent outputs, and “neutral” doesn’t solve ambiguity—it’s different from “unclear”.B. Allow empty arrays for pros/cons as valid output, and add \"unclear\" as the sentiment enum ✅ Correct.This prevents fabrication by allowing explicitly empty outputs when no details are present, and “unclear” handles ambiguous or sarcastic sentiment appropriately.C. Add an extraction_confidence field (0.0–1.0) for each value, and filter outputs where any confidence falls below a threshold. ❌ Incorrect.This adds complexity but doesn’t prevent fabrication or resolve ambiguity in outputs.D. Allow null values for pros/cons, and add \"unclear\" to the sentiment enum. ❌ Incorrect.Nulls are less consistent than empty arrays for structured outputs and can complicate downstream processing.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 32,
    "question": "Your extraction system implements automatic retries when validation fails. On each retry, the specific validation error is appended to the prompt. This retry-with-error-feedback approach resolves most failures within 2-3 attempts. For which failure pattern would additional retries be LEAST effective?",
    "options": [
      "The model extracts \"et al.\" for co-authors when the full list exists only in an external document not in the input",
      "The model extracts citation counts as locale-formatted strings (\"1234\") when the schema requires integers",
      "The model extracts dates as ISO 8601 datetime strings (\"2003-03-15T00:00:00Z\") when the schema requires only the date portion.",
      "The model extracts keywords as a nested object organized by category when the schema requires a flat array of strings"
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. The model extracts \"et al.\" for co-authors when the full list exists only in an external document not in the input ✅ Correct.Retries won’t help because the required information is not present in the input context. The model cannot recover missing data through repeated attempts.B. The model extracts citation counts as locale-formatted strings (\"1234\") when the schema requires integers ❌ Incorrect.This is a formatting issue that can be corrected through retries with validation feedback.C. The model extracts dates as ISO 8601 datetime strings (\"2003-03-15T00:00:00Z\") when the schema requires only the date portion (YYYY-MM-DD) ❌ Incorrect.Also a format mismatch, which retries can fix easily.D. The model extracts keywords as a nested object organized by category when the schema requires a flat array of strings ❌ Incorrect.This is a structural mismatch that can typically be corrected with retry feedback.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 33,
    "question": "Your invoice extraction uses tool use with strict JSON schemas. JSON syntax errors never occur, but 12% of extractions fail semantic validation--for example, line Item amounts don't extracted total, or vendor IDs don't match valid formats. These failures currently route to manual review. What's the most effective approach to reduce manual review volume while m accuracy?",
    "options": [
      "Retry the extraction up to 3 times when validation fallis, accepting the first result that passes validation.",
      "Implement post-processing logic that automatically corrects common amors, such as recalculating totais from line items when sums don't match.",
      "When validation falls, make a follow-up request with the document, extraction, and validation errors for model correction.",
      "Add stricter schema constraints with detailed field descriptions to prevent the model from generating invalid values initially."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Retry the extraction up to 3 times when validation fails, accepting the first result that passes validation. ❌ Incorrect. Retries without targeted feedback often repeat the same mistakes and don’t reliably fix semantic inconsistencies.B. Implement post-processing logic that automatically corrects common errors, such as recalculating totals from line items when sums don't match. ❌ Incorrect. While useful for specific cases, this is narrow and brittle, and doesn’t address broader validation failures like incorrect IDs.C. When validation fails, make a follow-up request with the document, extraction, and validation errors for model correction. ✅ Correct. This provides targeted feedback, enabling the model to fix specific issues, significantly reducing manual review while maintaining accuracy.D. Add stricter schema constraints with detailed field descriptions to prevent the model from generating invalid values initially. ❌ Incorrect. Schema improvements help upfront, but they cannot fully prevent semantic errors like mismatched totals.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 34,
    "question": "Your team is extracting structured data from 50,000 legacy legal contracts under a two-week deadline. Initial testing with 500 sample documents shows 82% pass JSON schema first attempt, while the remaining 18% fall due to diverse issues—missing required fields, malformed dates, and incorrectly identified parties. Documents that fail typically need refinements targeting their specific failure modes before extraction succeeds. Which batch processing strategy is the most cost-efficient while still meeting the deadline?",
    "options": [
      "Split documents into 10 sequential batches of 5,000 each, analysing results and refining prompts between batches to improve extraction quality progressively.",
      "Submit all 50,000 documents via batch API, then submit failed extractions in successive batches—refining prompts between each batch—until all documents pass validation.",
      "Use the real-time API for all 50,000 documents since the batch API's 24-hour processing window creates unacceptable deadline risk.",
      "Process 2,000 sample documents via real time API to identify failure patterns and refine prompts, then batch process all 50,000 with the optimized prompts."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "A. Split documents into 10 sequential batches of 5,000 each, analysing results and refining prompts between batches to improve extraction quality progressively. ❌ Incorrect. This introduces unnecessary sequential delays and reduces throughput, risking the deadline.B. Submit all 50,000 documents via batch API, then submit failed extractions in successive batches—refining prompts between each batch—until all documents pass validation. ✅ Correct. This maximizes throughput and parallelism upfront, ensuring the deadline is met. Then it uses targeted iterative refinement only on failures, making it cost-efficient while handling diverse failure modes effectively.C. Use the real-time API for all 50,000 documents since the batch API's 24-hour processing window creates unacceptable deadline risk. ❌ Incorrect. This is unnecessarily expensive and not required given batch processing capabilities.D. Process 2,000 sample documents via real-time API to identify failure patterns and refine prompts, then batch process all 50,000 with the optimized prompts. ❌ Incorrect. While proactive, this assumes failure patterns generalize well, which the scenario suggests they don’t—since failures are diverse and require case-specific refinements.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 35,
    "question": "Your extraction pipeline processes contracts that frequently include amendments. When a contract contains both original terms and later amendments (e.g., original clause specifies \"30-day payment terms\" while Amendment 1 changes this to \"45 days\"), the model inconsistently extracts one value or the other with no indication of which applies. What's the most effective approach to improve extraction accuracy for documents with amendments?",
    "options": [
      "Preprocess documents with a classifier that identifies and removes superseded sections before the main extraction step.",
      "Implement post-extraction validation using pattern matching to detect amendments and flag those extractions for manual review.",
      "Redesign the schema so amended fields capture multiple values, each with source location and effective date.",
      "Add prompt instructions to always extract the most recent amendment value and ignore superseded original terms."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A. Preprocess documents with a classifier that identifies and removes superseded sections before the main extraction step. ❌ Incorrect. This is brittle and risky—accurately identifying and removing superseded clauses is complex and may lead to loss of important context.B. Implement post-extraction validation using pattern matching to detect amendments and flag those extractions for manual review. ❌ Incorrect. This increases manual review but does not improve extraction accuracy or resolve ambiguity.C. Redesign the schema so amended fields capture multiple values, each with source location and effective date. ✅ Correct. This preserves both original and amended values with context, enabling accurate interpretation and avoiding ambiguity about which value applies.D. Add prompt instructions to always extract the most recent amendment value and ignore superseded original terms. ❌ Incorrect. This relies on model judgment, which is inconsistent, and loses traceability of how values changed over time.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 36,
    "question": "Your system must extract event details from calendar invitations and output JSON that strictly conforms to a schema with fields for title, date, time, location, and attendees. Downstream reject any malformed or non-conformant JSON. What approach provides the most reliable schema compliance?",
    "options": [
      "Define a tool with your target schema as input parameters and have Claude call it with the extracted data.",
      "Pre-fill Claude's response with an opening brace to force JSON output, then complete and parse the response.",
      "Append instructions like \"Output only valid JSON matching the schema exactly\" and implement retry logic to re-prompt when JSON parsing fails.",
      "Include detailed JSON formatting instructions and the target schema in your prompt, then parse Claude's text response as JSON."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Define a tool with your target schema as input parameters and have Claude call it with the extracted data. ✅ Correct. Tool use enforces strict schema compliance at generation time, ensuring valid, structured JSON that downstream systems can reliably consume.B. Pre-fill Claude's response with an opening brace to force JSON output, then complete and parse the response. ❌ Incorrect. This is a fragile workaround and does not guarantee valid or schema-compliant JSON.C. Append instructions like \"Output only valid JSON matching the schema exactly\" and implement retry logic to re-prompt when JSON parsing fails. ❌ Incorrect. Helpful but not reliable—models can still produce malformed or non-conformant JSON.D. Include detailed JSON formatting instructions and the target schema in your prompt, then parse Claude's text response as JSON. ❌ Incorrect. Prompt-based formatting alone cannot guarantee strict compliance, especially in edge cases.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 37,
    "question": "Your schema includes a skills: string[] field. Production monitoring reveals three consistency issues: (1) compound phrases like \"Python and SQL\" are sometimes kept as one entry, sometimes split; (2) implied but unstated skills occasionally appear in extractions; (3) similar documents produce wildly different array lengths (5-10 vs 40+ entries). Your prompt currently says \"Extract skills mentioned.\" What's the most effective improvement?",
    "options": [
      "Add constraints: \"Extract 10-20 skills maximum, one skill per entry, only explicitly named skills.\"",
      "Add post-extraction normalization that maps skills to a canonical taxonomy and deduplicates similar entries.",
      "Enrich the schema to [scondidering] to capture extraction metadata.",
      "Add few-shot examples demonstrating compound phrase handling, explicit mention criteria, and appropriate entry granularity."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A. Add constraints: \"Extract 10–20 skills maximum, one skill per entry, only explicitly named skills.\" ❌ Incorrect. This enforces limits but is arbitrary and may exclude valid skills or still leave ambiguity in how to split phrases.B. Add post-extraction normalization that maps skills to a canonical taxonomy and deduplicates similar entries. ❌ Incorrect. Helpful downstream, but it does not fix inconsistent extraction behavior at the source.C. Enrich the schema to capture extraction metadata. ❌ Incorrect. Adds complexity but does not directly address inconsistency in skill identification and formatting.D. Add few-shot examples demonstrating compound phrase handling, explicit mention criteria, and appropriate entry granularity. ✅ Correct. Examples directly guide the model on how to split, what to include, and the expected level of detail, addressing all three issues effectively.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 38,
    "question": "Your pipeline uses a tool called extract_metadata with a JSON schema for paper details. You've also defined lookup_citations and verify_doi tools for enrichment. During testing, you notice that when users include requests like \"extract the metadata and tell me how cited it is,\" Claude sometimes calls lookup_citations first, which fails because it needs the DOI that extract_metadata would provide. What's the most effective way to ensure structured metadata extraction happens first?",
    "options": [
      "Set tool choice to (\"type\": \"tool\", \"name\": \"extract_metadata\") and process the enrichment requests in subsequent turns after receiving the extracted metadata.",
      "Set tool choice to \"any\" so Claude must use a tool, combined with system prompt instructions prioritizing extract_metadata.",
      "Set tool choice to (\"type\": \"tool\", \"name\": \"extract_metadata\") for every API call in the pipeline, ensuring Claude always extracts metadata before any enrichment can occur.",
      "Set tool choice to \"auto\" and reorder the tool definitions so extract_metadata appears first in the tools array, since Claude prioritizes earlier-listed tools."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Set tool choice to (\"type\": \"tool\", \"name\": \"extract_metadata\") and process the enrichment requests in subsequent turns after receiving the extracted metadata. ✅ Correct. This enforces the correct execution order, ensuring required data (like DOI) is available before dependent tools are called.B. Set tool choice to \"any\" so Claude must use a tool, combined with system prompt instructions prioritizing extract_metadata. ❌ Incorrect. This does not guarantee ordering—Claude may still choose the wrong tool first.C. Set tool choice to (\"type\": \"tool\", \"name\": \"extract_metadata\") for every API call in the pipeline, ensuring Claude always extracts metadata before any enrichment can occur. ❌ Incorrect. This is too rigid and prevents legitimate use of other tools in later steps.D. Set tool choice to \"auto\" and reorder the tool definitions so extract_metadata appears first in the tools array, since Claude prioritizes earlier-listed tools. ❌ Incorrect. Tool ordering does not reliably control selection or execution order.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 39,
    "question": "Your system has been operating with 100% human review for 3 months. Analysis shows that extractions with model confidence >90% have 97% accuracy overall. To reduce reviewer workload, you plan to automate high-confidence extractions. Before deploying, what validation step is most critical?",
    "options": [
      "Verify that 97% accuracy meets requirements for all downstream systems that consume the extracted data.",
      "Analyze accuracy by document type and field to verify high-confidence extractions perform consistently across all segments, not just in aggregate.",
      "Compare accuracy at different confidence thresholds (85%, 90%, 95%) to find the optimal cutoff that maximizes automation while minimizing errors.",
      "Run a two-week pilot routing 25% of high-confidence extractions directly to downstream systems and monitor error reports."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "A. Verify that 97% accuracy meets requirements for all downstream systems that consume the extracted data. ❌ Incorrect. Important, but it doesn’t ensure the confidence signal is reliable across different cases—it only checks overall acceptability.B. Analyze accuracy by document type and field to verify high-confidence extractions perform consistently across all segments, not just in aggregate. ✅ Correct. Aggregate accuracy can hide weak spots. You need to ensure confidence >90% is trustworthy across all segments, otherwise automation may introduce systematic errors.C. Compare accuracy at different confidence thresholds (85%, 90%, 95%) to find the optimal cutoff that maximizes automation while minimizing errors. ❌ Incorrect. Useful for tuning, but only after confirming the confidence signal is consistent and reliable across segments.D. Run a two-week pilot routing 25% of high-confidence extractions directly to downstream systems and monitor error reports. ❌ Incorrect. A pilot is valuable, but deploying without validating segment-level reliability first introduces avoidable risk.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 40,
    "question": "Your extraction system uses tool_use with a JSON schema containing 12 fields and detailed descriptions, totaling approximately 2,500 tokens for the complete tool definition. Processing documents under 150K tokens yields 98% accuracy. For documents between 175-190K tokens, accuracy drops to 71%, with information from the final third consistently missed. The model's context window is 200K tokens. What is the most likely cause?",
    "options": [
      "Tool definitions consume input context tokens. Combined with system prompts and document content, the total approaches the context limit, degrading end-of-document processing.",
      "Very long documents exceed the model's effective attention span regardless of context limits, causing accuracy degradation for content farther from the prompt instructions.",
      "The model distributes attention proportionally across input length, causing fields mentioned only once near the document's end to receive insufficient processing focus.",
      "Schemas exceeding 8-10 fields increase decision complexity during parameter generation, reducing extraction accuracy independent of document length."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Tool definitions consume input context tokens. Combined with system prompts and document content, the total approaches the context limit, degrading end-of-document processing. ✅ Correct. The tool schema (~2,500 tokens) plus system prompts and large documents push total input close to the 200K context limit, causing truncation or reduced attention to the final portion—hence missed information in the last third.B. Very long documents exceed the model's effective attention span regardless of context limits, causing accuracy degradation for content farther from the prompt instructions. ❌ Incorrect. While attention can vary, the sharp drop near the context boundary strongly indicates a context limit issue, not general attention decay.C. The model distributes attention proportionally across input length, causing fields mentioned only once near the document's end to receive insufficient processing focus. ❌ Incorrect. This is a weaker effect and does not explain the consistent failure in the final third tied to document size thresholds.D. Schemas exceeding 8–10 fields increase decision complexity during parameter generation, reducing extraction accuracy independent of document length. ❌ Incorrect. Schema size is constant across cases; it does not explain why accuracy drops only for longer documents.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": 41,
    "question": "Your extraction pipeline processes invoices and extracts line items, subtotals, tax amounts, and grand totals. During evaluation, you discover that in 18% of extractions, the sum of extracted line item amounts doesn't match the extracted grand total—sometimes due to OCR errors in the source document, sometimes due to extraction mistakes by the model. Downstream accounting systems reject records with mismatched totals. What's the most effective approach to improve extraction reliability?",
    "options": [
      "Add a \"calculated total\" field where the model sums extracted line items alongside a \"stated_total\" field. Flag records for human review when values differ.",
      "Extract line items and totals independently, then use a separate validation model to reconcile discrepancies by determining which extracted values are most likely correct.",
      "Add few-shot examples demonstrating invoices where extracted line items sum correctly to the stated total, encouraging the model to produce mathematically consistent extractions.",
      "Implement post-processing that automatically adjusts line item amounts proportionally when their sum doesn't match the stated total."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A. Add a \"calculated total\" field where the model sums extracted line items alongside a \"stated_total\" field. Flag records for human review when values differ. ✅ Correct. This preserves both sources of truth and enables reliable validation. Discrepancies can be flagged explicitly, improving accuracy without silently altering financial data.B. Extract line items and totals independently, then use a separate validation model to reconcile discrepancies by determining which extracted values are most likely correct. ❌ Incorrect. This adds complexity and uncertainty—“guessing” which value is correct can introduce errors in financial data.C. Add few-shot examples demonstrating invoices where extracted line items sum correctly to the stated total, encouraging the model to produce mathematically consistent extractions. ❌ Incorrect. Helpful but insufficient—does not handle OCR errors or real inconsistencies in source documents.D. Implement post-processing that automatically adjusts line item amounts proportionally when their sum doesn't match the stated total. ❌ Incorrect. This modifies financial data artificially, which is risky and unacceptable for accounting accuracy.",
    "type": "mc",
    "src": "examtopics",
    "lvl": "intermediate"
  },
  {
    "num": "cs-1",
    "question": "An agent has tried three times to resolve a billing issue and the customer is still stuck. The right next step is to:",
    "options": [
      "Try the same resolution a fourth time.",
      "Escalate to a human with the full history and what has been tried, so the customer does not start over.",
      "Tell the customer to open a new ticket.",
      "Close the conversation as resolved."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-2",
    "question": "Documents arrive continuously throughout business hours and need structured data extracted. To reduce costs, you want to use the `Message Batches API` (50% discount, up-to-24-hour processing window). Your SLA specifies that extraction results must be available within 30 hours of document arrival with 99.9% reliability.\nWhich batching strategy is most appropriate?",
    "options": [
      "Submit batches every 6 hours containing documents from that window",
      "Submit a single batch at end of day containing all documents from that day",
      "Submit batches every 4 hours containing documents from that window",
      "Use the real-time API for all documents instead of batch processing"
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-3",
    "question": "A customer returns 4 hours after their initial session about the same billing dispute. The previous 32-turn session contains `lookup_order` results showing \"Status: PENDING, Expected resolution: 24-48 hours.\" In testing, you observe that when resuming sessions with stale tool results, the agent often references the outdated data in responses (e.g., \"I see your refund is still being processed\") even after subsequent fresh tool calls return different information.\nWhat approach most reliably handles returning customers?",
    "options": [
      "Resume with full history but filter out previous `tool_result` messages before resuming, keeping only the human/assistant turns so the agent must re-fetch needed data.",
      "Start a new session, inject a structured summary of the previous interaction (issue type, actions taken, resolution status), then make fresh tool calls before engaging.",
      "Resume with full history and add a system prompt instruction telling the agent to always prefer the most recent tool results when multiple calls to the same tool exist in context.",
      "Resume with full history and configure the agent to automatically re-call all previously-used tools at session start to ensure data freshness."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-4",
    "question": "An engineer used the agent yesterday to analyze a legacy authentication module, identifying two distinct refactoring approaches: extracting a microservice versus refactoring in-place. Today, they want to explore both approaches in depth—having the agent propose specific code changes for each—before deciding which to implement.\nWhat's the most effective way to structure this exploration?",
    "options": [
      "Resume yesterday's session to explore the first approach, then start a new session for the second, manually recreating the original context.",
      "Start two fresh sessions, manually providing a summary of yesterday's analysis findings to establish context.",
      "Resume yesterday's session and explore both approaches sequentially within the same conversation thread.",
      "Use `fork_session` to create two branches from yesterday's analysis, exploring one approach in each fork."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-5",
    "question": "Your codebase exploration tool stores session IDs to allow engineers to continue investigations across work sessions. An engineer spent an hour yesterday analyzing a legacy authentication module, building context about its architecture and dependencies. They want to continue today. The session ID is valid, but version control shows 3 of the 12 files the agent previously read were modified overnight by a teammate's merge.\nWhat approach best balances efficiency and accuracy?",
    "options": [
      "Resume the session without informing the agent about the changed files",
      "Start a fresh session to ensure the agent works with current codebase state without stale assumptions",
      "Resume the session and inform the agent which specific files changed for targeted re-analysis",
      "Resume the session and immediately have the agent re-read all 12 previously analyzed files"
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-6",
    "question": "An engineer's exploration subagent spent 30 minutes analyzing a legacy payment system, reading 47 files and documenting data flows. The session was interrupted when the engineer's connection dropped. While away, a teammate merged a PR that renamed two utility functions. The engineer wants to continue the same exploration.\nWhat's the most effective approach?",
    "options": [
      "Resume the subagent from its previous transcript without mentioning the changes—the architecture understanding remains valid.",
      "Launch a fresh subagent and include the prior transcript in the initial prompt for context.",
      "Launch a fresh subagent with a summary of prior findings.",
      "Resume the subagent from its previous transcript and inform it about the renamed functions."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-7",
    "question": "A contract is too long to fit in one context window, and you need fields from across the whole document. The dependable approach is to:",
    "options": [
      "Truncate the document to what fits and extract from the first part.",
      "Chunk the document with slight overlap, extract per chunk, then merge and reconcile the fields.",
      "Summarize the document first, then extract from the summary.",
      "Raise the temperature so the model fills in the missing parts."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-8",
    "question": "A customer raises three separate issues during one session: a refund inquiry (turns 1-15), a subscription question (turns 16-30), and a payment method update (turns 31-45). At turn 48, the customer asks \"What happened with my refund?\" The conversation is approaching context limits.\nWhat strategy best maintains the agent's ability to address all issues throughout the session?",
    "options": [
      "Extract and persist structured issue data (order IDs, amounts, statuses) into a separate context layer.",
      "Rely on MCP tools to re-fetch relevant information on demand when the customer references earlier issues.",
      "Summarize earlier turns into a narrative description, preserving full message history only for the active issue.",
      "Implement sliding window context that retains the most recent 30 turns."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-9",
    "question": "Three sub-agents searched overlapping territory and several findings repeat across their reports. Before synthesis, the coordinator should:",
    "options": [
      "Concatenate all three reports verbatim into the final answer.",
      "Keep the first report and discard the other two unread.",
      "Merge the reports, collapse duplicate findings, and keep one cited instance of each.",
      "Ask the user to remove the duplicates."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "research_pipeline"
  },
  {
    "num": "cs-10",
    "question": "The document analysis agent has a single `analyze_document` tool that takes a document and a free-text instruction parameter. During evaluation, requests like \"extract the key financial metrics\" often return narrative summaries, while \"summarize the methodology\" sometimes returns raw data tables. The synthesis agent reports that 35% of analysis results require re-requests with clarified instructions.\nWhat's the most effective way to improve reliability?",
    "options": [
      "Split the generic tool into purpose-specific tools—`extract_data_points`, `summarize_content`, `verify_claim_against_source`—each with defined input/output contracts.",
      "Keep the single tool but add an `analysis_type` enum parameter requiring explicit selection between extraction, summarization, and verification modes.",
      "Have the coordinator pre-classify each analysis request before passing instructions to the document analysis agent.",
      "Enhance the tool description with detailed examples showing how different instruction phrasings should map to different output formats."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "research_pipeline"
  },
  {
    "num": "cs-11",
    "question": "Production logs reveal inconsistent error handling: when `lookup_order` fails, the agent sometimes retries 5+ times (wasteful when the order ID doesn't exist), sometimes escalates immediately (premature for temporary network issues), and sometimes asks users for clarification (inappropriate when the issue is a backend permission error). Investigation shows your MCP tool returns uniform error responses: {\"isError\": true, \"content\": [{\"type\": \"text\", \"text\": \"Operation failed\"}]}. The agent cannot distinguish between error types.\nWhat's the most effective improvement?",
    "options": [
      "Enhance error responses with structured metadata: include errorCategory (transient/validation/permission), isRetryable boolean, and a description of what caused the failure.",
      "Create an `analyze_error` MCP tool the agent calls after any failure to determine the error category and recommended action.",
      "Implement retry logic with exponential backoff in your MCP server for all errors, returning to the agent only after retries are exhausted.",
      "Add few-shot examples to the system prompt demonstrating how to interpret error message patterns and select appropriate responses for each."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-12",
    "question": "The coordinator provides detailed step-by-step instructions to the web search subagent, specifying exact search queries, source priorities, and date filters. Production monitoring reveals three issues: (1) the subagent reports \"insufficient results\" rather than trying alternative approaches when pre-specified searches fail, (2) research quality drops for emerging topics that don't match expected patterns, and (3) the subagent rarely surfaces valuable tangential sources.\nWhat's the most effective way to improve subagent adaptability?",
    "options": [
      "Remove procedural details entirely, delegating with simple goals like \"research X thoroughly\" and relying on the subagent's general capabilities.",
      "Add explicit fallback directives to the detailed instructions: \"If specified searches yield fewer than N results, attempt alternative query formulations before reporting failure.\"",
      "Implement a topic classification step where the coordinator categorizes requests as \"well-defined\" or \"exploratory\" and uses different instruction styles for each category.",
      "Specify research goals and quality criteria (coverage breadth, source diversity, recency) rather than procedural steps, letting the subagent determine its search strategy."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "research_pipeline"
  },
  {
    "num": "cs-13",
    "question": "An extractor pulls line items and an invoice total from a receipt. The strongest integrity check before accepting the output is to:",
    "options": [
      "Trust the total field because it is printed prominently.",
      "Verify that the line items sum to the extracted total, and on a mismatch retry or flag the record.",
      "Check only that the total is a number.",
      "Accept the first extraction without checking."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-14",
    "question": "The agent verifies customer identity through a multi-step process before resetting passwords. During testing, you notice that after the customer answers the third verification question, the agent asks them to provide their name again, as if the earlier exchange never happened.\nWhat's the most likely cause of this behavior?",
    "options": [
      "The verification tool is clearing the agent's internal state after each successful validation step.",
      "The prompt lacks instructions telling Claude to remember information across multiple exchanges.",
      "The conversation history isn't being passed in subsequent API requests.",
      "Claude's memory retention is limited to two conversational turns by default, requiring explicit configuration to extend it."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-15",
    "question": "After integrating a local MCP server providing code analysis tools (`analyze_dependencies`, `find_dead_code`, `calculate_complexity`), you verify the server is healthy and tools appear in the tools/list response. However, you observe that the agent consistently uses Grep to search for import statements instead of calling `analyze_dependencies`—even when users explicitly ask about \"code dependencies.\" Examining tool definitions reveals:\nMCP: `analyze_dependencies` - \"Analyzes dependency graph\"\nBuilt-in: Grep - \"Search file contents for a pattern using regular expressions. Returns matching lines with line numbers and surrounding context.\"\nWhat's the most effective approach to improve the agent's selection of MCP tools?",
    "options": [
      "Remove Grep from available tools when the MCP server is connected to eliminate functional overlap.",
      "Add routing instructions to the system prompt specifying that dependency-related questions should use MCP tools rather than Grep.",
      "Split `analyze_dependencies` into granular tools (`list_imports`, `resolve_transitive_deps`, `detect_circular_deps`) so each has a focused purpose less likely to overlap with Grep.",
      "Expand MCP tool descriptions to detail capabilities and outputs—e.g., \"Builds dependency graph showing direct imports, transitive dependencies, and cycles.\""
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-16",
    "question": "A support agent order-status tool returns data that looks stale and contradicts what the customer sees. The agent should:",
    "options": [
      "Report the tool value confidently as the truth.",
      "Tell the customer the system shows a possibly outdated status, and verify or escalate before committing to it.",
      "Side with whatever the customer says without checking.",
      "Keep retrying the tool silently until it agrees with the customer."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-17",
    "question": "The coordinator agent has `AgentDefinitions` configured for all four specialized subagents, each with appropriate descriptions, prompts, and tool restrictions. During testing, you notice the coordinator correctly reasons about when to delegate—it generates messages like \"I'll ask the web search agent to find sources on this topic\"—but no subagent execution ever occurs. The coordinator then proceeds as if the delegation happened and continues with incomplete information. Logs show no errors.\nWhat is the most likely cause?",
    "options": [
      "The coordinator's `max_tokens` setting is too low, causing the Task tool invocation to be truncated before the subagent type parameter can be specified.",
      "The `AgentDefinitions` are configured correctly, but the coordinator's system prompt doesn't explicitly list the available subagent types, preventing the model from knowing they can be invoked.",
      "The coordinator's allowedTools configuration doesn't include \"Task\", so while it can reason about delegation, it cannot invoke the tool required to spawn subagents.",
      "Subagent context isolation means task descriptions from the coordinator don't automatically reach subagents; you need to configure explicit context forwarding in ClaudeAgentOptions."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "research_pipeline"
  },
  {
    "num": "cs-18",
    "question": "A user asks a support agent for specific legal advice about a contract dispute. The right behavior is to:",
    "options": [
      "Give the best legal opinion the agent can produce.",
      "Say plainly this is outside what support can advise on, and point the user to the right resource or a human.",
      "Answer vaguely so the agent does not commit to anything.",
      "Ignore the legal part and answer something easier."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-19",
    "question": "A single source file is thousands of lines long and the agent needs one function from it. The agent should:",
    "options": [
      "Read the entire file into context to be thorough.",
      "Search within the file for the function and read only that region and its immediate dependencies.",
      "Read the first few hundred lines and stop.",
      "Reformat the file so it is easier to scan."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-20",
    "question": "A developer asks the agent to investigate why a specific API endpoint intermittently returns 500 errors. The codebase has 200+ files and the developer doesn't know which components are involved. The agent must trace the error through routing, middleware, business logic, and database layers.\nWhat task decomposition approach would be most effective?",
    "options": [
      "Have the agent first create a comprehensive plan mapping all code paths through the endpoint before beginning any file exploration or code reading.",
      "Have the agent dynamically generate investigation subtasks based on what it discovers at each step, adapting its exploration plan as new information about the error path emerges.",
      "Define a fixed sequence of investigation steps upfront—grep for error patterns, then read error handlers, then check database queries, then examine middleware—executing each step regardless of intermediate findings.",
      "Run parallel worker agents that simultaneously investigate all four layers, then synthesize their findings to identify where the error originates."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-21",
    "question": "After your daily batch of 10,000 documents completes, 300 documents (3%) failed with \"`context_length_exceeded`\" errors. The results file identifies each failure by `custom_id`.\nWhat's the most cost-effective approach to process these failures?",
    "options": [
      "Reprocess the entire batch with prompt caching enabled to reduce the cost of retrying requests with identical system prompts",
      "Resubmit only the 300 failed documents after chunking them into smaller pieces, then combine the partial extractions",
      "Resubmit the entire 10,000 document batch using a model tier with a larger context window",
      "Increase the `max_tokens` parameter for the 300 failed documents and resubmit them in a new batch"
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-22",
    "question": "After adding an MCP server with specialized code refactoring tools (`extract_function`, `rename_variable`, `inline_function`), you notice the agent still uses basic text manipulation via Write and Bash sed commands for refactoring tasks. The MCP server is connected and healthy. Examining the configuration, you find each MCP tool has a minimal description like \"`extract_function`: extracts a function from code.\"\nWhat's the most effective way to improve adoption of the MCP refactoring tools?",
    "options": [
      "Implement a request classifier that detects refactoring intent and automatically routes those requests to the MCP server before the agent processes them.",
      "Remove the Write tool from the agent's configuration for refactoring sessions so it must use the MCP tools for code modifications.",
      "Accept this as expected behavior since simpler tools like sed are more predictable than specialized refactoring tools.",
      "Enhance the MCP tool descriptions to explain when each tool is preferable to text manipulation and clarify expected inputs and outputs."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-23",
    "question": "You're implementing the escalation logic for when the agent should call `escalate_to_human`. Your team proposes four different approaches for triggering escalation.\nWhich approach will most reliably identify cases that genuinely require human intervention?",
    "options": [
      "Instruct the agent to escalate when the customer requests a human, when the issue requires policy exceptions, or when the agent cannot make meaningful progress.",
      "Configure the agent to escalate after three consecutive tool calls that fail to resolve the customer's stated issue, ensuring a reasonable attempt before involving a human.",
      "Implement sentiment analysis that monitors for frustration indicators (negative language, repeated questions, exclamation marks) and trigger escalation when the frustration score exceeds a configured threshold.",
      "Build a rules engine that maps specific issue types, customer segments, and product categories to escalation decisions, removing the need for model judgment calls."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-24",
    "question": "A customer asks a simple question that the agent can answer directly from the knowledge base. The agent should:",
    "options": [
      "Escalate every question to a human to be safe.",
      "Answer the question directly and clearly, and offer escalation only if the customer needs more.",
      "Ask the customer to confirm three times before answering.",
      "Give a long disclaimer and avoid answering."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-25",
    "question": "An engineer asks the agent to understand how the caching layer works before adding a new cache invalidation trigger. After initial Grep searches, the agent has identified that caching logic spans 15 files including decorators, middleware, and service classes (~8,000 lines total).\nWhat's the most effective next step for building understanding while managing context constraints?",
    "options": [
      "Use the Read tool to sequentially load all 15 files, building complete understanding across the full caching implementation.",
      "Analyze imports and class hierarchies to identify the base cache class, Read that file to understand the interface, then trace specific invalidation implementations.",
      "Use Grep to search for \"invalidate\" and \"expire\" patterns across all files, then Read only those specific line ranges with minimal surrounding context.",
      "Use Glob to find files matching common caching patterns (cache.py, caching/), prioritize the largest files by reading them first, then check smaller files for gaps."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-26",
    "question": "Your system extracts event metadata (date, location, organizer, `attendee_count`) from news articles using a JSON schema with all nullable fields. During evaluation, you observe the model frequently generates plausible but incorrect values for fields not mentioned in the article—for example, outputting \"500\" for `attendee_count` when the source contains no attendance information.\nWhat's the most effective way to reduce these false extractions?",
    "options": [
      "Add a post-processing step using a second LLM call to verify each extracted value exists in the source document.",
      "Add prompt instructions to return null for any field where information is not directly stated in the source.",
      "Make all schema fields required (non-nullable) with strict validation rules to ensure the model only outputs verifiable data.",
      "Upgrade to a more capable model tier with improved instruction-following to reduce hallucination tendencies."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-27",
    "question": "A frustrated customer demands a refund that the policy does not allow. The best response is to:",
    "options": [
      "Grant the refund anyway to calm them down.",
      "Acknowledge the frustration, state the policy plainly, and offer the options that do exist.",
      "Restate the policy firmly and end the conversation.",
      "Promise to escalate without intending to."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-28",
    "question": "A customer sends: \"This is frustrating. I've explained my issue twice and nothing is being resolved. I want to talk to a real person NOW.\" The agent has not yet called any tools to investigate their account.\nWhat should the agent do?",
    "options": [
      "Acknowledge the frustration and ask one targeted question to understand the specific issue before escalating.",
      "Briefly explain what the agent can help with and offer to resolve the issue quickly, escalating only if the customer repeats their request.",
      "Immediately call `escalate_to_human` with the conversation history.",
      "First call `get_customer` and `lookup_order` to gather account context, then escalate to a human agent."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-29",
    "question": "Your extraction system parses e-commerce product descriptions to extract specifications like dimensions, weight, and materials into JSON. Despite having a well-defined schema, the model inconsistently extracts the \"materials\" field—sometimes returning \"cotton blend\", other times \"Cotton/Polyester mix\", and occasionally omitting the field when material information is clearly present in the source.\nWhat's the most effective way to improve extraction consistency?",
    "options": [
      "Make the \"materials\" field required instead of optional in the schema to force the model to always extract a value",
      "Switch to a more capable model tier since inconsistent extraction indicates insufficient model capability",
      "Set temperature to 0 to eliminate randomness and ensure deterministic outputs",
      "Add few-shot examples showing 2-3 complete input-output pairs with standardized material description formats"
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-30",
    "question": "When implementing your `lookup_order` MCP tool, the backend sometimes returns errors (e.g., \"Order not found\" or temporary database failures).\nWhat is the correct pattern for communicating these errors back to the agent?",
    "options": [
      "Log the error server-side and return an empty result to avoid confusing the model",
      "Return the error message in the tool result content with the isError flag set to true",
      "Throw an exception from the tool handler so the agent framework can catch and log it",
      "Return a success response with a \"status\" field indicating the error type"
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-31",
    "question": "An extractor must label each support ticket with one of five priority levels. To stop the model from inventing new labels, you should:",
    "options": [
      "Ask for the priority as free text and clean it up afterward.",
      "Constrain the field to the five allowed values in the schema or tool definition, and reject anything else.",
      "List the five levels in the prompt and hope the model complies.",
      "Accept any label and map unknowns to the closest match later."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-32",
    "question": "Production monitoring shows that follow-up queries like \"summarize what we learned about market trends\" consistently take 40+ seconds. Investigation reveals the coordinator spawns the synthesis subagent for each summarization request, passing 80K+ tokens of accumulated findings. The coordinator already has these findings in its context from orchestrating the research.\nWhat's the most effective way to improve response time for these follow-up summaries?",
    "options": [
      "Pre-generate and cache summaries at multiple granularities whenever new findings accumulate.",
      "Have the coordinator handle straightforward summarization requests directly using its existing context, reserving subagent spawning for complex analysis.",
      "Enable prompt caching on the synthesis subagent to reduce the overhead of repeatedly transferring the same research findings.",
      "Spawn the synthesis subagent with reduced context and have it request specific findings from the coordinator on-demand."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "research_pipeline"
  },
  {
    "num": "cs-33",
    "question": "Before renaming a widely used function, an agent needs to know what a change would break. The right move is to:",
    "options": [
      "Rename it and run the build to see what fails.",
      "Search the codebase for all references first, then plan the change across the call sites.",
      "Rename only the definition and assume callers will adapt.",
      "Add a second function and leave the old one untouched."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "code_exploration"
  },
  {
    "num": "cs-34",
    "question": "A research agent must gather facts from eight independent web sources and produce one synthesis. None of the sources depend on each other. Which dispatch pattern stays fast without flooding the coordinator context?",
    "options": [
      "Read all eight sources into the coordinator context, then write the synthesis in a single pass.",
      "Dispatch eight sub-agents in parallel, each returning a short structured summary with citations, then synthesize from the summaries.",
      "Process the sources one at a time in a single agent, appending each full page to the running prompt.",
      "Pick the two sources that look most promising and ignore the rest to save tokens."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "research_pipeline"
  },
  {
    "num": "cs-35",
    "question": "Your pipeline uses a tool called `extract_metadata` with a JSON schema for paper details. You've also defined `lookup_citations` and `verify_doi` tools for enrichment. During testing, you notice that when users include requests like \"extract the metadata and tell me how cited it is,\" Claude sometimes calls `lookup_citations` first, which fails because it needs the DOI that `extract_metadata` would provide.\nWhat's the most effective way to ensure structured metadata extraction happens first?",
    "options": [
      "Set `tool_choice` to \"any\" so Claude must use a tool, combined with system prompt instructions prioritizing `extract_metadata`.",
      "Set `tool_choice` to \"auto\" and reorder the tool definitions so `extract_metadata` appears first in the tools array, since Claude prioritizes earlier-listed tools.",
      "Set `tool_choice` to {\"type\": \"tool\", \"name\": \"`extract_metadata`\"} and process the enrichment requests in subsequent turns after receiving the extracted metadata.",
      "Set `tool_choice` to {\"type\": \"tool\", \"name\": \"`extract_metadata`\"} for every API call in the pipeline, ensuring Claude always extracts metadata before any enrichment can occur."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-36",
    "question": "An invoice extractor reads dates like 03/04/2025 that could be March 4 or April 3. The design that avoids silent errors is to:",
    "options": [
      "Assume the United States month-first format everywhere.",
      "Require an ISO date in the output schema, and when the input is ambiguous, flag the field for review instead of guessing.",
      "Store the date as the raw string and sort it out later.",
      "Drop any date that is ambiguous."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "extraction_pipeline"
  },
  {
    "num": "cs-37",
    "question": "After investigating a billing dispute over 25+ turns, you've identified that duplicate charges occurred due to a payment gateway timeout triggering retry logic. The required refund ($847) exceeds your $500 authorization limit. You need to call `escalate_to_human`, and the human agent won't have access to your conversation transcript.\nWhat context should you pass to enable effective resolution?",
    "options": [
      "The customer's original complaint verbatim plus the tool result excerpts showing duplicate transactions.",
      "A structured summary: customer ID, root cause, refund amount, and recommended action.",
      "The complete conversation transcript with all tool results.",
      "Your diagnosis and the refund amount only."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  },
  {
    "num": "cs-38",
    "question": "Your `process_refund` tool returns two types of errors: technical errors (\"503 Service Unavailable\", \"Connection timeout\") that are transient (5% of calls), and business errors (\"Order exceeds 30-day return window\", \"Item already refunded\") that are permanent (12% of calls). Monitoring shows the agent wastes 3-4 turns retrying business errors that can never succeed. Currently, both error types return only a plain text message to Claude.\nWhat's the most effective way to reduce wasted retries while improving customer-facing response quality?",
    "options": [
      "Return structured error responses with retryable: false for business errors and a customer-friendly explanation for Claude to use.",
      "Add few-shot examples showing how to distinguish retryable from non-retryable errors by parsing error message text.",
      "Add a `check_refund_eligibility` tool that must be called before `process_refund` to prevent business rule violations.",
      "Implement automatic retry logic at the tool level for technical errors only, passing business errors to Claude without retries."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "",
    "type": "mc",
    "src": "cyberskill",
    "lvl": "intermediate",
    "domain": "customer_support"
  }
];
