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
  },
  {
    "num": "juli-1",
    "question": "A document analysis agent discovers that two credible sources contain directly contradictory statistics for a key\nmetric: a government report states 40% growth, while an industry analysis states 12%. Both sources look\ncredible, and the discrepancy could materially affect the research conclusions. How should the document\nanalysis agent handle this situation most effectively?",
    "options": [
      "Apply credibility heuristics to pick the most likely correct number, finish analysis with that value, and add a footnote mentioning the discrepancy.",
      "Include both numbers in the analysis output without marking them as conflicting, letting the synthesis agent decide which to use based on broader context.",
      "Stop analysis and immediately escalate to the coordinator, asking it to decide which source is more authoritative before continuing.",
      "Complete analysis with both numbers, explicitly annotate the conflict with source attribution, and let the coordinator decide how to reconcile the data before passing to synthesis."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "This approach preserves separation of responsibilities: the analysis agent completes its core work without blocking, preserves both conflicting values with clear attribution, and correctly passes reconciliation to the coordinator, which has broader context.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-2",
    "question": "The web-search and document-analysis agents have completed their tasks and returned results to the\ncoordinator. What is the next step for creating an integrated research report?",
    "options": [
      "Each agent sends its results directly to the report-writing agent, bypassing the coordinator.",
      "The document analysis agent requests web-search results and merges them internally.",
      "The coordinator passes both sets of results to the synthesis agent for a unified integration.",
      "The coordinator concatenates the raw outputs from both agents and returns them as the final result."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "In a coordinator–subagent architecture, the coordinator forwards both result sets to the synthesis agent for centralized integration, preserving control and ensuring high-quality merging.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-3",
    "question": "A document analysis subagent frequently fails when processing PDF files: some have corrupted sections that\ntrigger parsing exceptions, others are password-protected, and sometimes the parsing library hangs on large\nfiles. Currently, any exception immediately terminates the subagent and returns an error to the coordinator,\nwhich must decide whether to retry, skip, or fail the whole task. This causes excessive coordinator involvement\nin routine error handling. What architectural improvement is most effective?",
    "options": [
      "Create a dedicated error-handling agent that monitors all failures via a shared queue and decides recovery actions, sending restart commands directly to subagents.",
      "Configure the subagent to always return partial results with a success status, embedding error details in metadata; the coordinator treats all responses as successful.",
      "Make the coordinator validate all documents before sending them to the subagent, rejecting documents that might cause failures.",
      "Implement local recovery in the subagent for transient failures and escalate to the coordinator only errors it cannot resolve, including attempted steps and partial results."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "Handle errors at the lowest level capable of resolving them. Local recovery reduces coordinator workload while still escalating truly unrecoverable issues with full context and partial progress.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-4",
    "question": "After running the system on “AI impact on creative industries,” you observe that every subagent completes\nsuccessfully: the web-search agent finds relevant articles, the document analysis agent summarizes them\ncorrectly, and the synthesis agent produces coherent text. However, final reports cover only visual art and\ncompletely miss music, literature, and film. In the coordinator logs, you see it decomposed the topic into three\nsubtasks: “AI in digital art,” “AI in graphic design,” and “AI in photography.” What is the most likely root cause?",
    "options": [
      "The synthesis agent lacks instructions to detect coverage gaps.",
      "The document analysis agent filters out non-visual sources due to overly strict relevance criteria.",
      "The coordinator’s task decomposition is too narrow, assigning subagents work that does not cover all relevant areas.",
      "The web-search agent’s queries are insufficient and should be broadened to cover more sectors."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "The coordinator decomposed a broad topic only into visual-art subtasks, missing music, literature, and film entirely. Since subagents executed their assignments correctly, the narrow decomposition is the obvious root cause.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-5",
    "question": "The web-search subagent returns results for only 3 of 5 requested source categories (competitor sites and\nindustry reports succeed, but news archives and social feeds time out). The document analysis subagent\nsuccessfully processes all provided documents. The synthesis subagent must produce a summary from\nmixed-quality upstream inputs. Which error-propagation strategy is most effective?",
    "options": [
      "Continue synthesis using only successful sources and produce an output without mentioning which data was unavailable.",
      "The synthesis subagent returns an error to the coordinator, triggering a full retry or task failure due to incomplete data.",
      "The synthesis subagent asks the coordinator to retry timed-out sources with a longer timeout before starting synthesis.",
      "Structure the synthesis output with coverage annotations that indicate which conclusions are well-supported and where gaps exist due to unavailable sources."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "Coverage annotations implement graceful degradation with transparency, preserving value from completed work while propagating uncertainty to enable informed decisions about confidence.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-6",
    "question": "The document analysis subagent encounters a corrupted PDF file that it cannot parse. When designing the\nsystem’s error handling, what is the most effective way to handle this failure?",
    "options": [
      "Return an error with context to the coordinator agent, allowing it to decide how to proceed.",
      "Silently skip the corrupted document and continue processing the remaining files to avoid interrupting the workflow.",
      "Automatically retry parsing the document three times with exponential backoff before reporting a failure.",
      "Throw an exception that terminates the entire research workflow."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Returning an error with context to the coordinator is the most effective approach because it lets the coordinator make an informed decision—skip the file, try an alternative parsing method, or notify the user—while maintaining visibility into the failure.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-7",
    "question": "Production logs show a persistent pattern: requests like “analyze the uploaded quarterly report” are routed to the\nweb-search agent 45% of the time instead of the document analysis agent. Reviewing tool definitions, you find\nthat the web-search agent has a tool `analyze_content` described as “analyzes content and extracts key\ninformation,” while the document analysis agent has a tool `analyze_document` described as “analyzes\ndocuments and extracts key information.” How should you fix the misrouting problem?",
    "options": [
      "Add a pre-routing classifier that detects whether the user refers to uploaded files or web content before the coordinator decides on delegation.",
      "Rename the web-search tool to `extract_web_results` and update its description to “processes and returns information retrieved from web search and URLs.”",
      "Add few-shot examples to the coordinator prompt showing correct routing: “User uploads a quarterly report fi document analysis agent” and “User asks about a web page fi web-search agent.”",
      "Expand the document analysis tool description with usage examples like “Use for uploaded PDFs, Word docs, and spreadsheets,” leaving the web-search tool unchanged."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Renaming the web-search tool to `extract_web_results` and updating its description to explicitly reference web search and URLs directly removes the root cause by eliminating semantic overlap between the two tool names and descriptions. This makes each tool’s purpose unambiguous, enabling the coordinator to reliably distinguish document analysis from web search.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-8",
    "question": "A colleague proposes that the document analysis agent should send its results directly to the synthesis agent,\nbypassing the coordinator. What is the main advantage of keeping the coordinator as the central hub for all\ncommunication between subagents?",
    "options": [
      "The coordinator can observe all interactions, handle errors uniformly, and decide what information each subagent should receive.",
      "The coordinator batches multiple requests to subagents, reducing total API calls and overall latency.",
      "Routing through the coordinator enables automatic retry logic that direct inter-agent calls cannot support.",
      "Subagents use isolated memory, and direct communication would require complex serialization that only the coordinator can perform."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "The coordinator pattern provides centralized visibility into all interactions, uniform error handling across the system, and fine-grained control over what information each subagent receives—these are the primary advantages of a star-shaped communication topology.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-9",
    "question": "The web-search subagent times out while researching a complex topic. You need to design how information\nabout this failure is returned to the coordinator. Which error-propagation approach best enables intelligent\nrecovery?",
    "options": [
      "Return structured error context to the coordinator including the failure type, the query executed, any partial results, and potential alternative approaches.",
      "Catch the timeout within the subagent and return an empty result set marked as successful.",
      "Implement automatic exponential-backoff retries inside the subagent, only returning a generic “search unavailable” status after exhausting retries.",
      "Propagate the timeout exception directly to the top-level handler, terminating the entire research workflow."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Returning structured error context—including failure type, executed query, partial results, and alternative approaches—gives the coordinator everything needed to make intelligent recovery decisions (e.g., retry with a modified query or continue with partial results). It preserves maximum context for informed coordination-level decision-making.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-10",
    "question": "In your system design, you gave the document analysis agent access to a general-purpose tool `fetch_url` so it\ncould download documents by URL. Production logs show this agent now frequently downloads search engine\nresults pages to perform ad hoc web search—behavior that should be routed through the web-search\nagent—causing inconsistent results. Which fix is most effective?",
    "options": [
      "Replace `fetch_url` with a `load_document` tool that validates that URLs point to document formats.",
      "Remove `fetch_url` from the document analysis agent and route all URL fetching through the coordinator to the web-search agent.",
      "Implement filtering that blocks `fetch_url` calls to known search engine domains while allowing other URLs.",
      "Add instructions to the document analysis agent prompt that `fetch_url` should only be used to download document URLs, not to search."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Replacing a general-purpose tool with a document-specific tool that validates URLs against document formats fixes the root cause by constraining capability at the interface level. This follows the principle of least privilege, making undesired search behavior impossible rather than merely discouraged.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-11",
    "question": "While researching a broad topic, you observe that the web-search agent and the document analysis agent\ninvestigate the same subtopics, leading to substantial duplication in their outputs. Token usage nearly doubles\nwithout a proportional increase in research breadth or depth. What is the most effective way to address this?",
    "options": [
      "Allow both agents to finish in parallel, then have the coordinator deduplicate overlapping results before passing them to the synthesis agent.",
      "The coordinator explicitly partitions the research space before delegating, assigning each agent distinct subtopics or source types.",
      "Implement a shared-state mechanism where agents log their current focus area so other agents can dynamically avoid duplication during execution.",
      "Switch to sequential execution where document analysis runs only after web search completes, using web-search results as context to avoid duplication."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Having the coordinator explicitly partition the research space before delegating is most effective because it addresses the root cause—unclear task boundaries—before any work begins. It preserves parallelism while preventing duplicated effort and wasted tokens.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-12",
    "question": "During research, the web-search subagent queries three source categories with different outcomes: academic\ndatabases return 15 relevant papers, industry reports return “0 results,” and patent databases return\n“Connection timeout.” When designing error propagation to the coordinator, which approach enables the best\nrecovery decisions?",
    "options": [
      "Aggregate the results into a single success-percentage metric (e.g., “67% source coverage”) with detailed logs available on demand.",
      "Report both “timeout” and “0 results” as failures requiring coordinator intervention.",
      "Retry transient failures internally and report only persistent errors.",
      "Distinguish access failures (timeout) that require a retry decision from valid empty results (“0 results”) that represent successful queries."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A timeout (access failure) and “0 results” (valid empty result) are semantically different outcomes requiring different responses. Distinguishing them allows the coordinator to retry the patent database while accepting the industry reports “0 results” as a valid, informative finding.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-13",
    "question": "Production monitoring shows inconsistent synthesis quality. When aggregated results are ~75K tokens, the\nsynthesis agent reliably cites information from the first 15K tokens (web-search headlines/snippets) and the last\n10K tokens (document analysis conclusions), but often misses critical findings in the middle 50K tokens—even\nwhen they directly answer the research question. How should you restructure the aggregated input?",
    "options": [
      "Summarize all subagent outputs to under 20K tokens before aggregation to keep content within the model’s reliable processing range.",
      "Stream subagent results to the synthesis agent incrementally, processing web-search results first to completion, then adding document analysis results.",
      "Place a key-findings summary at the start of the aggregated input and organize detailed results with explicit section headings for easier navigation.",
      "Implement rotation that alternates which subagent’s results appear first across research tasks to ensure both sources get equal top positioning over time."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "Putting a key-findings summary at the start leverages primacy effects so critical information sits in the most reliably processed position. Adding explicit section headings throughout helps the model navigate and attend to mid-input content, directly mitigating the “lost in the middle” phenomenon.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-14",
    "question": "In testing, the combined output of the web-search agent (85K tokens including page content) and the document\nanalysis agent (70K tokens including chains of thought) totals 155K tokens, but the synthesis agent performs\nbest with inputs under 50K tokens. Which solution is most effective?",
    "options": [
      "Modify upstream agents to return structured data (key facts, quotes, relevance scores) instead of verbose content and reasoning.",
      "Add an intermediate summarization agent that condenses findings before passing them to synthesis.",
      "Have the synthesis agent process findings in sequential batches, maintaining state between calls.",
      "Store findings in a vector database and give the synthesis agent search tools to query during its work."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Modifying upstream agents to return structured data fixes the root cause by reducing token volume at the source while preserving essential information. It avoids passing bulky page content and reasoning traces that inflate tokens without improving the synthesis step.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-15",
    "question": "In testing, you observe that the synthesis agent often needs to verify specific claims while merging results.\nCurrently, when verification is needed, the synthesis agent returns control to the coordinator, which calls the\nweb-search agent and then re-invokes synthesis with the results. This adds 2–3 extra loops per task and\nincreases latency by 40%. Your assessment shows 85% of these verifications are simple fact checks (dates,\nnames, stats) and 15% require deeper research. Which approach most effectively reduces overhead while\npreserving system reliability?",
    "options": [
      "Give the synthesis agent access to all web-search tools so it can handle any verification need directly without coordinator loops.",
      "Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end, which then sends them all to the web-search agent at once.",
      "Have the web-search agent proactively cache extra context around each source during initial research in anticipation of synthesis needing verification.",
      "Give the synthesis agent a limited-scope `verify_fact` tool for simple checks, while routing complex verifications through the coordinator to the web-search agent."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A limited-scope fact-verification tool lets the synthesis agent handle 85% of simple checks directly, eliminating most loops, while preserving the coordinator delegation path for the 15% of complex verifications. This applies least privilege while significantly reducing latency. Claude Code for Continuous Integration",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-16",
    "question": "Your CI pipeline runs the Claude Code CLI (in `--print` mode) using CLAUDE.md to provide project context for\ncode review, and developers generally find the reviews substantive. However, they report that integrating\nfindings into the workflow is difficult—Claude outputs narrative paragraphs that must be manually copied into PR\ncomments. The team wants to automatically post each finding as a separate inline PR comment at the relevant\nplace in code, which requires structured data with file path, line number, severity level, and suggested fix. Which\napproach is most effective?",
    "options": [
      "Add an “Output Format for Review” section to CLAUDE.md with examples of structured findings so Claude learns the expected format from project context.",
      "Use the CLI flags `--output-format json` and `--json-schema` to enforce structured findings, then parse the output to post inline comments via the GitHub API.",
      "Include explicit formatting instructions in the review prompt requiring each finding to follow a parseable template like `[FILE:path] [LINE:n] [SEVERITY:level] ...`.",
      "Keep narrative review format but add a summarization step that uses Claude to generate a structured JSON summary of findings."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Using `--output-format json` with `--json-schema` enforces structured output at the CLI level, guaranteeing well-formed JSON with the required fields (file path, line number, severity, suggested fix) that can be reliably parsed and posted as inline PR comments via the GitHub API. It leverages built-in CLI capabilities designed specifically for structured output.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-17",
    "question": "Your team uses Claude Code for generating code suggestions, but you notice a pattern: non-obvious\nissues—performance optimizations that break edge cases, cleanups that unexpectedly change behavior—are\nonly caught when another team member reviews the PR. Claude’s reasoning during generation shows it\nconsidered these cases but concluded its approach was correct. Which approach directly addresses the root\ncause of this self-check limitation?",
    "options": [
      "Run a second independent instance of Claude Code to review the changes without access to the generator’s reasoning.",
      "Enable extended thinking mode for the generation stage to allow more thorough deliberation before producing suggestions.",
      "Add explicit self-review instructions to the generation prompt asking Claude to critique its own suggestions before finalizing output.",
      "Include full test files and documentation in prompt context so Claude better understands expected behavior during generation."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A second independent Claude Code instance without access to the generator’s reasoning directly addresses the root cause by avoiding confirmation bias. This “fresh eyes” perspective mirrors human peer review, where another reviewer catches issues the author rationalized.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-18",
    "question": "Your code review component is iterative: Claude analyzes the changed file, then may request related files\n(imports, base classes, tests) via tool calls to understand context before providing final feedback. Your\napplication defines a tool that lets Claude request file contents; Claude calls the tool, gets results, and continues\nanalysis. You’re evaluating batch processing to reduce API cost. What is the primary technical limitation when\nconsidering batch processing for this workflow?",
    "options": [
      "Batch processing does not include correlation IDs to map outputs back to input requests.",
      "The asynchronous model cannot execute tools mid-request and return results for Claude to continue analysis.",
      "The Batch API does not support tool definitions in request parameters.",
      "The batch processing latency of up to 24 hours is too slow for pull request feedback, although the workflow would otherwise function."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "A “fire-and-forget” asynchronous Batch API model has no mechanism to intercept a tool call during a request, execute the tool, and return results for Claude to continue analysis. This is fundamentally incompatible with iterative tool-calling workflows that require multiple tool request/response rounds within a single logical interaction.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-19",
    "question": "Your CI/CD system runs three Claude-based analyses: (1) fast style checks on every PR that block merging\nuntil completion, (2) comprehensive weekly security audits of the entire codebase, and (3) nightly test-case\ngeneration for recently changed modules. The Message Batches API offers 50% savings but processing can\ntake up to 24 hours. You want to optimize API cost while maintaining an acceptable developer experience.",
    "options": [
      "Use the Message Batches API for all three tasks to maximize 50% savings, configuring the pipeline to poll for batch completion.",
      "Use synchronous calls for PR style checks; use the Message Batches API for weekly security audits and nightly test generation.",
      "Use synchronous calls for all three tasks for consistent response times, relying on prompt caching to reduce costs across workloads.",
      "Use synchronous calls for PR style checks and nightly test generation; use the Message Batches API only for weekly security audits."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "PR style checks block developers and require immediate responses via synchronous calls, while weekly security audits and nightly test generation are scheduled tasks with flexible deadlines that can tolerate up to a 24-hour batch window—capturing 50% savings for both.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-20",
    "question": "Your automated reviews find real issues, but developers report the feedback is not actionable. Findings include\nphrases like “complex ticket routing logic” or “potential null pointer” without specifying what exactly to change.\nWhen you add detailed instructions like “always include concrete fix suggestions,” the model still produces\ninconsistent output—sometimes detailed, sometimes vague. Which prompting technique most reliably produces\nconsistently actionable feedback?",
    "options": [
      "Further refine instructions with more explicit requirements for each part of the feedback format (location, issue, severity, proposed fix).",
      "Expand the context window to include more surrounding codebase so the model has enough information to propose concrete fixes.",
      "Implement a two-pass approach where one prompt identifies issues and a second generates fixes, allowing specialization.",
      "Add 3–4 few-shot examples showing the exact required format: identified issue, location in code, concrete fix suggestion."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "Few-shot examples are the most effective technique for achieving consistent output format when instructions alone produce variable results. Providing 3–4 examples that show the exact desired structure (issue, location, concrete fix) gives the model a concrete pattern to follow, which is more reliable than abstract instructions.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-21",
    "question": "Your CI pipeline includes two Claude-based code review modes: a pre-merge-commit hook that blocks PR\nmerge until completion, and a “deep analysis” that runs overnight, polls for batch completion, and posts detailed\nsuggestions to the PR. You want to reduce API cost using the Message Batches API, which offers 50% savings\nbut requires polling and can take up to 24 hours. Which mode should use batch processing?",
    "options": [
      "Only the pre-merge-commit hook.",
      "Only the deep analysis.",
      "Both modes.",
      "Neither mode."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Deep analysis is an ideal candidate for batch processing because it already runs overnight, tolerates delay, and uses a polling model before publishing results—matching the asynchronous, polling-based architecture of the Message Batches API while capturing 50% savings.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-22",
    "question": "Your automated review analyzes comments and docstrings. The current prompt instructs Claude to “check that\ncomments are accurate and up to date.” Findings often flag acceptable patterns (TODO markers, simple\ndescriptions) while missing comments describing behavior the code no longer implements. What change\naddresses the root cause of this inconsistent analysis?",
    "options": [
      "Include `git blame` data so Claude can identify comments that predate recent code changes.",
      "Add few-shot examples of misleading comments to help the model recognize similar patterns in the codebase.",
      "Filter TODO, FIXME, and descriptive comment patterns before analysis to reduce noise.",
      "Specify explicit criteria: flag comments only when the behavior they claim contradicts the code’s actual behavior."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "Explicit criteria—flagging comments only when claimed behavior contradicts actual code behavior—directly addresses the root cause by replacing a vague instruction with a precise definition of what constitutes a problem. This reduces false positives on acceptable patterns and misses of truly misleading comments.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-23",
    "question": "Your automated code review system shows inconsistent severity ratings—similar issues like null pointer risks\nare rated “critical” in some PRs but only “medium” in others. Developer surveys show growing distrust—many\nstart dismissing findings without reading because “half are wrong.” High-false-positive categories erode trust in\naccurate categories. Which approach best restores developer trust while improving the system?",
    "options": [
      "Temporarily disable high-false-positive categories (style, naming, documentation) and keep only high-precision categories while improving prompts.",
      "Keep all categories enabled but display confidence scores with each finding so developers can decide what to investigate.",
      "Keep all categories enabled and add few-shot examples to improve accuracy for each category over the next few weeks.",
      "Apply a uniform strictness reduction across all categories to bring the overall false-positive rate down."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Temporarily disabling high-false-positive categories immediately stops trust erosion by removing noisy findings that cause developers to dismiss everything, while preserving value from high-precision categories like security and correctness. It also creates space to improve prompts for problematic categories before re-enabling them.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-24",
    "question": "Your automated review generates test-case suggestions for each PR. Reviewing a PR that adds course\ncompletion tracking, Claude suggests 10 test cases, but developer feedback shows that 6 duplicate scenarios\nalready covered by the existing test suite. What change most effectively reduces duplicate suggestions?",
    "options": [
      "Include the existing test file in context so Claude can determine what scenarios are already covered.",
      "Reduce the requested number of suggestions from 10 to 5, assuming Claude prioritizes the most valuable cases first.",
      "Add instructions directing Claude to focus exclusively on edge cases and error conditions rather than success paths.",
      "Implement post-processing that filters suggestions whose descriptions match existing test names via keyword overlap."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Including the existing test file fixes the root cause of duplication: Claude can only avoid suggesting already-covered scenarios if it knows what tests already exist. This gives Claude the information needed to propose genuinely new, valuable tests.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-25",
    "question": "After an initial automated review identifies 12 findings, a developer pushes new commits to address issues.\nRe-running review produces 8 findings, but developers report that 5 duplicate previous comments on code that\nwas already fixed in the new commits. What is the most effective way to eliminate this redundant feedback while\nmaintaining thoroughness?",
    "options": [
      "Run review only when the PR is created and in the final pre-merge state, skipping intermediate commits.",
      "Add a post-processing filter that removes findings that match previous ones by file paths and issue descriptions before posting comments.",
      "Restrict review scope to files changed in the most recent push, excluding files from earlier commits.",
      "Include previous review findings in context and instruct Claude to report only new or still-unresolved issues."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "Including prior review findings in context lets Claude distinguish new problems from those already addressed in recent commits. This preserves review thoroughness while using Claude’s reasoning to avoid redundant feedback on fixed code.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-26",
    "question": "Your pipeline script runs `claude \"Analyze this pull request for security issues\"`, but the job hangs indefinitely.\nLogs show Claude Code is waiting for interactive input. What is the correct approach to run Claude Code in an\nautomated pipeline?",
    "options": [
      "Add a `--batch` flag: `claude --batch \"Analyze this pull request for security issues\"`.",
      "Add the `-p` flag: `claude -p \"Analyze this pull request for security issues\"`.",
      "Redirect stdin from `/dev/null`: `claude \"Analyze this pull request for security issues\" < /dev/null`.",
      "Set the environment variable `CLAUDE_HEADLESS=true` before running the command."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "The `-p` (or `--print`) flag is the documented way to run Claude Code non-interactively. It processes the prompt, prints the result to stdout, and exits without waiting for user input—ideal for CI/CD pipelines.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-27",
    "question": "A pull request changes 14 files in an inventory tracking module. A single-pass review that analyzes all files\ntogether produces inconsistent results: detailed feedback on some files but shallow comments on others,\nmissed obvious bugs, and contradictory feedback (a pattern is flagged in one file but identical code is approved\nin another file in the same PR). How should you restructure the review?",
    "options": [
      "Run three independent full-PR review passes and flag only issues that appear in at least two of the three runs.",
      "Split into focused passes: review each file individually for local issues, then run a separate integration-oriented pass to examine cross-file data flows.",
      "Require developers to split large PRs into smaller submissions of 3–4 files before running automated review.",
      "Switch to a larger model with a bigger context window so it can pay sufficient attention to all 14 files in one pass."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Focused per-file passes address the root cause—attention dilution—by ensuring consistent depth and reliable local issue detection. A separate integration-oriented pass then covers cross-file concerns such as dependency and data-flow interactions.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-28",
    "question": "Your automated code review averages 15 findings per pull request, and developers report a 40% false-positive\nrate. The bottleneck is investigation time: developers must click into each finding to read Claude’s rationale\nbefore deciding whether to fix or dismiss it. Your CLAUDE.md already contains comprehensive rules for\nacceptable patterns, and stakeholders rejected any approach that filters findings before developers see them.",
    "options": [
      "Require Claude to include its rationale and confidence estimate directly in each finding.",
      "Add a post-processor that analyzes finding patterns and automatically suppresses those that match historical false-positive signatures.",
      "Categorize findings as “blocking issues” vs “suggestions,” with different review requirements by level.",
      "Configure Claude to show only high-confidence findings, filtering uncertain flags before developers see them."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Including rationale and confidence directly in each finding reduces investigation time by letting developers quickly triage without opening each finding. It satisfies the “no filtering” constraint because all findings remain visible while accelerating developer decision-making.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-29",
    "question": "Analysis of your automated code review shows large differences in false-positive rates by finding category:\nsecurity/correctness findings have 8% false positives, performance findings 18%, style/naming findings 52%,\nand documentation findings 48%. Developer surveys show growing distrust—many start dismissing findings\nwithout reading because “half are wrong.” High-false-positive categories erode trust in accurate categories.",
    "options": [
      "Temporarily disable high-false-positive categories (style, naming, documentation) and keep only high-precision categories while improving prompts.",
      "Keep all categories enabled but display confidence scores with each finding so developers can decide what to investigate.",
      "Keep all categories enabled and add few-shot examples to improve accuracy for each category over the next few weeks.",
      "Apply a uniform strictness reduction across all categories to bring the overall false-positive rate down."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Temporarily disabling high-false-positive categories immediately stops trust erosion by removing noisy findings that cause developers to dismiss everything, while preserving value from high-precision categories like security and correctness. It also creates space to improve prompts for problematic categories before re-enabling them.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-30",
    "question": "Your team wants to reduce API costs for automated analysis. Currently, synchronous Claude calls support two\nworkflows: (1) a blocking pre-merge check that must complete before developers can merge, and (2) a technical\ndebt report generated overnight for review the next morning. Your manager proposes moving both to the\nMessage Batches API to save 50%. How should you evaluate this proposal?",
    "options": [
      "Move both to batch processing with fallback to synchronous calls if batches take too long.",
      "Move both workflows to batch processing with status polling to verify completion.",
      "Use batch processing only for technical debt reports; keep synchronous calls for pre-merge checks.",
      "Keep synchronous calls for both workflows to avoid issues with batch result ordering."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "Message Batches API processing can take up to 24 hours with no latency SLA, which is acceptable for overnight technical debt reports but unacceptable for blocking pre-merge checks where developers wait. This matches each workflow to the right API based on latency requirements. Code Generation with Claude Code",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-31",
    "question": "You asked Claude Code to implement a function that transforms API responses into an internal normalized\nformat. After two iterations, the output structure still doesn’t match expectations—some fields are nested\ndifferently and timestamps are formatted incorrectly. You described requirements in prose, but Claude interprets\nthem differently each time.",
    "options": [
      "Write a JSON schema describing the expected output structure and validate Claude’s output against it after each iteration.",
      "Provide 2–3 concrete input-output examples showing the expected transformation for representative API responses.",
      "Rewrite requirements with more technical precision, specifying exact field mappings, nesting rules, and timestamp format strings.",
      "Ask Claude to explain its current understanding of the requirements to identify where interpretations diverge."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Concrete input-output examples remove ambiguity inherent in prose descriptions by showing Claude the exact expected transformation results. This directly addresses the root cause—misinterpretation of textual requirements—by providing unambiguous patterns for field nesting and timestamp formatting.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-32",
    "question": "You need to add Slack as a new notification channel. The existing codebase has clear, established patterns for\nemail, SMS, and push channels. However, Slack’s API offers fundamentally different integration\napproaches—incoming webhooks (simple, one-way), bot tokens (support delivery confirmation and\nprogrammatic control), or Slack Apps (two-way events, requires workspace approval). Your task says “add\nSlack support” without specifying integration method or requiring advanced features like delivery tracking.",
    "options": [
      "Start in direct execution mode using incoming webhooks to match the existing one-way notification pattern.",
      "Switch to planning mode to explore integration options and architectural implications, then present a recommendation before implementation.",
      "Start in direct execution mode by scaffolding a Slack channel class using existing patterns, deferring the integration method decision.",
      "Start in direct execution mode using a bot-token approach to ensure delivery confirmation is possible."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Slack integration has multiple valid approaches with significantly different architectural implications, and requirements are ambiguous. Planning mode lets you evaluate trade-offs among webhooks, bot tokens, and Slack Apps and align on an approach before implementation.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-33",
    "question": "Your CLAUDE.md file has grown to 400+ lines containing coding standards, testing conventions, a detailed PR\nreview checklist, deployment instructions, and database migration procedures. You want Claude to always\nfollow coding standards and testing conventions, but apply PR review, deploy, and migration guidance only\nwhen doing those tasks.",
    "options": [
      "Move all guidance into separate Skills files organized by workflow type, leaving only a brief project description in CLAUDE.md.",
      "Keep everything in CLAUDE.md but use `@import` syntax to organize into separately maintained files by category.",
      "Split CLAUDE.md into files under `.claude/rules/` with path-bound glob patterns so each rule loads only for the relevant file types.",
      "Keep universal standards in CLAUDE.md and create Skills for workflow-specific guidance (PR review, deploy, migrations) with trigger keywords."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "CLAUDE.md content loads in every session, ensuring coding standards and testing conventions always apply, while Skills are invoked on demand when Claude detects trigger keywords—ideal for workflow-specific guidance like PR review, deployment, and migrations.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-34",
    "question": "You’re tasked with restructuring your team’s monolithic application into microservices. This impacts changes\nacross dozens of files and requires decisions about service boundaries and module dependencies.",
    "options": [
      "Switch to planning mode to explore the codebase, understand dependencies, and design the implementation approach before making changes.",
      "Start in direct execution mode and switch to planning only after encountering unexpected complexity during implementation.",
      "Start in direct execution mode and make incremental changes, letting implementation reveal natural service boundaries.",
      "Use direct execution with detailed upfront instructions that specify each service structure."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Planning mode is the right strategy for complex architectural restructuring like splitting a monolith: it allows safe exploration and informed decisions about boundaries before committing to potentially expensive changes across many files.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-35",
    "question": "Your team created a `/analyze-codebase` skill that performs deep code analysis—dependency scanning, test\ncoverage counts, and code quality metrics. After running the command, team members report Claude becomes\nless responsive in the session and loses the context of the original task.",
    "options": [
      "Add `context: fork` in the skill frontmatter to run the analysis in an isolated subagent context.",
      "Add `model: haiku` in frontmatter to use a faster, cheaper model for analysis.",
      "Split the skill into three smaller skills, each producing less output.",
      "Add instructions to the skill to compress all results into a short summary before displaying them."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "`context: fork` runs the analysis in an isolated subagent context so the large output does not pollute the main session’s context window and Claude does not lose track of the original task. It preserves full analysis capability while keeping the main session responsive.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-36",
    "question": "Your team uses a `/commit` skill in `.claude/skills/commit/SKILL.md`. A developer wants to customize it for their\npersonal workflow (different commit message format, extra checks) without affecting teammates.",
    "options": [
      "Create a personal version under `~/.claude/skills/` with a different name, e.g., `/my-commit`.",
      "Add conditional logic based on username in the project skill frontmatter.",
      "Create a personal version at `~/.claude/skills/commit/SKILL.md` with the same name.",
      "Set `override: true` in the personal skill frontmatter to prioritize it over the project version."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "Personal skills take precedence over project skills with the same name, so reusing the name `commit` would silently shadow the team's skill for this developer alone — they'd stop receiving updates whenever the team improves `/commit`, and would need to remember they're running a different skill under the same command. Naming the personal variant `/my-commit` avoids that collision entirely: the developer keeps using the team's maintained `/commit` and gets a separate, clearly-named skill for their personal workflow, with no risk of confusing the two or missing team updates.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-37",
    "question": "Your team has used Claude Code for months. Recently, three developers report Claude follows the guidance\n“always include comprehensive error handling,” but a fourth developer who just joined says Claude does not\nfollow it. All four work in the same repo and have up-to-date code.",
    "options": [
      "The guidance lives in the original developers’ user-level `~/.claude/CLAUDE.md` files, not in the project `.claude/CLAUDE.md`. Move the instruction to the project-level file so all team members receive it.",
      "The new developer’s `~/.claude/CLAUDE.md` contains conflicting instructions overriding project settings; they should delete the conflicting section.",
      "Claude Code learns per-user preferences over time; the new developer must repeat the requirement until Claude “remembers” it.",
      "Claude Code caches CLAUDE.md after first read; original developers use cached versions. Everyone should clear the Claude Code cache."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "If the guidance was added only to the original developers’ user-level configs and not to the project-level `.claude/CLAUDE.md`, new team members won’t receive it. Moving it to the project-level configuration ensures all current and future team members automatically get the guidance.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-38",
    "question": "You find that including 2–3 full endpoint implementation examples as context significantly improves consistency\nwhen generating new API endpoints. However, this context is useful only when creating new endpoints—not\nwhen debugging, reviewing code, or other work in the API directory.",
    "options": [
      "Add endpoint examples and pattern documentation to the project CLAUDE.md so they are always available.",
      "Manually reference endpoint examples in every generation request by copying code into the prompt.",
      "Configure path-specific rules in `.claude/rules/api/` that include endpoint examples and activate when working in the API directory.",
      "Create a skill that references the endpoint examples and contains pattern-following instructions, invoked on demand via a slash command."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "A skill invoked on demand loads the example context only when generating new endpoints, not during unrelated tasks like debugging or review. This keeps the main context clean while preserving high-quality generation when needed.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-39",
    "question": "Your team created a `/migration` skill that generates database migration files. It takes the migration name via\n`$ARGUMENTS`. In production you observe three issues: (1) developers often run the skill without arguments,\ncausing poorly named files, (2) the skill sometimes uses database schema details from unrelated prior\nconversations, and (3) a developer accidentally ran destructive test cleanup when the skill had broad tool\naccess.",
    "options": [
      "Use positional parameters `$1` and `$2` instead of `$ARGUMENTS` to enforce specific inputs, include explicit schema file references via `@` syntax for context control, and add a frontmatter description warning about destructive operations.",
      "Add `argument-hint` in frontmatter to request required parameters, use `context: fork` to isolate execution, and restrict `allowed-tools` to file-write operations.",
      "Split into `/migration-create` and `/migration-apply` skills, add validation instructions to request migration name if missing, and use different `allowed-tools` scopes for each.",
      "Add validation instructions in the skill SKILL.md to ensure `$ARGUMENTS` is a valid name, add prompts to ignore prior conversation context, and list prohibited operations to avoid."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "This uses three separate configuration features to address each problem: `argument-hint` improves argument entry and reduces missing arguments, `context: fork` prevents context leakage from prior conversations, and `allowed-tools` constrains the skill to safe file-writing operations, preventing destructive actions.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-40",
    "question": "Your codebase contains areas with different coding conventions: React components use functional style with\nhooks, API handlers use async/await with specific error handling, and database models follow the repository\npattern. Test files are distributed across the codebase next to the code under test (e.g., `Button.test.tsx` next to\n`Button.tsx`), and you want all tests to follow the same conventions regardless of location.\nWhat is the most supported way to ensure Claude automatically applies the correct conventions when\ngenerating code?",
    "options": [
      "Put all conventions in the root CLAUDE.md under headings for each area and rely on Claude to infer which section applies.",
      "Create skills in `.claude/skills/` for each code type, embedding conventions in each SKILL.md.",
      "Place a separate CLAUDE.md file in each subdirectory containing conventions for that area.",
      "Create rule files under `.claude/rules/` with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "`.claude/rules/` files with YAML frontmatter and glob patterns (e.g., `**/*.test.tsx`, `src/api/**/*.ts`) enable deterministic, path-based convention application regardless of directory structure. This is the most supported approach for cross-cutting patterns like distributed test files.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-41",
    "question": "You want to create a custom slash command `/review` that runs your team’s standard code review checklist. It\nshould be available to every developer when they clone or update the repository.\nWhere should you create the command file?",
    "options": [
      "In `~/.claude/commands/` in each developer’s home directory.",
      "In the project repository under `.claude/commands/`.",
      "In `.claude/config.json` as an array of commands.",
      "In the root project CLAUDE.md."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Putting custom slash commands under `.claude/commands/` inside the project repository ensures they are version-controlled and automatically available to every developer who clones or updates the repo. This is the intended location for project-level custom commands in Claude Code.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-42",
    "question": "Your team’s CLAUDE.md grew beyond 500 lines mixing TypeScript conventions, testing guidance, API patterns,\nand deployment procedures. Developers find it hard to locate and update the right sections.",
    "options": [
      "Define a `.claude/config.yaml` mapping file patterns to specific sections inside CLAUDE.md.",
      "Create separate Markdown files in `.claude/rules/`, each covering one topic (e.g., `testing.md`, `api-conventions.md`).",
      "Split instructions into README.md files in relevant subdirectories that Claude automatically loads as instructions.",
      "Create multiple files named CLAUDE.md at different levels of the directory tree, each overriding parent instructions."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Claude Code supports a `.claude/rules/` directory where you can create separate Markdown files for topical guidance (e.g., `testing.md`, `api-conventions.md`), allowing teams to organize large instruction sets into focused, maintainable modules.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-43",
    "question": "You create a custom skill `/explore-alternatives` that your team uses to brainstorm and evaluate implementation\napproaches before choosing one. Developers report that after running the skill, subsequent Claude responses\nare influenced by the alternatives discussion—sometimes referencing rejected approaches or retaining\nexploration context that interferes with actual implementation.",
    "options": [
      "Use the `!` prefix in the skill to run exploration logic as a bash subprocess.",
      "Add `context: fork` in the skill frontmatter.",
      "Split into two skills—`/explore-start` and `/explore-end`—to mark boundaries when exploration context should be discarded.",
      "Create the skill in `~/.claude/skills/` instead of `.claude/skills/`."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "`context: fork` runs the skill in an isolated subagent context so exploration discussions do not pollute the main conversation history. This prevents rejected approaches and brainstorming context from influencing subsequent implementation work.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-44",
    "question": "Your team wants to add a GitHub MCP server for searching PRs and checking CI status via Claude Code. Each\nof six developers has their own personal GitHub access token. You want consistent tooling across the team\nwithout committing credentials to version control.",
    "options": [
      "Have each developer add the server in user scope via `claude mcp add --scope user`.",
      "Create an MCP server wrapper that reads tokens from a `.env` file and proxies GitHub API calls, then add the wrapper to the project `.mcp.json`.",
      "Add the server to the project `.mcp.json` using environment variable substitution (`${GITHUB_TOKEN}`) for auth and document the required environment variable in the project README.",
      "Configure the server in project scope with a placeholder token, then tell developers to override it in their local config."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A project `.mcp.json` with environment variable substitution is idiomatic: it provides a single version-controlled source of truth for MCP configuration while letting each developer supply credentials via environment variables. Documenting the variable makes onboarding easy without committing secrets.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-45",
    "question": "You’re adding error-handling wrappers around external API calls across a 120-file codebase. The work has\nthree phases: (1) discover all call sites and patterns, (2) collaboratively design the error-handling approach, and\n(3) implement wrappers consistently. In Phase 1, Claude generates large output listing hundreds of call sites\nwith context, quickly filling the context window before discovery finishes.",
    "options": [
      "Use an Explore subagent for Phase 1 to isolate verbose discovery output and return a summary, then continue Phases 2–3 in the main conversation.",
      "Do all phases in the main conversation, periodically using `/compact` to reduce context usage while moving through files.",
      "Switch to headless mode with `--continue`, passing explicit context summaries between batch calls to maintain continuity.",
      "Define the error-handling pattern in CLAUDE.md, then process files in batches across multiple sessions relying on the shared memory file for consistency."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "An Explore subagent isolates the verbose discovery output in a separate context and returns only a concise summary to the main conversation. This preserves the main context window for the collaborative design and consistent implementation phases where retained context is most valuable.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-46",
    "question": "While testing, you notice the agent often calls `get_customer` when users ask about order status, even though\n`lookup_order` would be more appropriate. What should you check first to address this problem?",
    "options": [
      "Implement a preprocessing classifier to detect order-related requests and route them directly to `lookup_order`.",
      "Reduce the number of tools available to the agent to simplify choice.",
      "Add few-shot examples to the system prompt covering all possible order request patterns to improve tool selection.",
      "Check the tool descriptions to ensure they clearly differentiate each tool’s purpose."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "Tool descriptions are the primary input the model uses to decide which tool to call. When an agent consistently picks the wrong tool, the first diagnostic step is to verify that tool descriptions clearly separate each tool’s purpose and usage boundaries.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-47",
    "question": "Your agent handles single-issue requests with 94% accuracy (e.g., “I need a refund for order #1234”). But when\ncustomers include multiple issues in one message (e.g., “I need a refund for order #1234 and also want to\nupdate the shipping address for order #5678”), tool selection accuracy drops to 58%. The agent usually solves\nonly one issue or mixes parameters across requests. What approach most effectively improves reliability for\nmulti-issue requests?",
    "options": [
      "Implement a preprocessing layer that uses a separate model call to decompose multi-issue messages into separate requests, handle each independently, and merge results.",
      "Combine related tools into fewer universal tools.",
      "Add few-shot examples to the prompt demonstrating correct reasoning and tool sequencing for multi-issue requests.",
      "Implement response validation that detects incomplete answers and automatically reprompts the agent to resolve missed issues."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "Few-shot examples that demonstrate correct reasoning and tool sequencing for multi-issue requests are most effective because the agent already performs well on single issues—what it needs is guidance on the pattern for decomposing and routing multiple issues and keeping parameters separated.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-48",
    "question": "Production logs show that for simple requests like “refund for order #1234,” your agent resolves the issue in 3–4\ntool calls with 91% success. But for complex requests like “I was billed twice, my discount didn’t apply, and I\nwant to cancel,” the agent averages 12+ tool calls with only 54% success—often investigating issues\nsequentially and fetching redundant customer data for each. What change most effectively improves handling of\ncomplex requests?",
    "options": [
      "Add explicit verification checkpoints between stages, requiring the agent to record progress after resolving each issue before moving to the next.",
      "Reduce the number of tools by combining `get_customer`, `lookup_order`, and billing-related tools into a single `investigate_issue` tool.",
      "Decompose the request into separate issues, then investigate each in parallel using shared customer context before synthesizing a final resolution.",
      "Add few-shot examples to the system prompt demonstrating ideal tool-call sequences for various multi-faceted billing scenarios."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "Decomposing into separate issues and investigating in parallel with shared customer context fixes both key problems: it eliminates redundant data retrieval by reusing shared context across issues and reduces total tool-call loops by parallelizing investigation before synthesizing a single resolution.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-49",
    "question": "Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates simple\ncases (standard replacements for damaged goods with photo proof) while trying to handle complex situations\nrequiring policy exceptions autonomously. What is the most effective way to improve escalation calibration?",
    "options": [
      "Require the agent to self-rate confidence on a 1–10 scale before each response and automatically route to humans when confidence drops below a threshold.",
      "Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent starts processing.",
      "Add explicit escalation criteria to the system prompt with few-shot examples showing when to escalate versus resolve autonomously.",
      "Implement sentiment analysis to determine customer frustration level and automatically escalate past a negative sentiment threshold."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "Explicit escalation criteria with few-shot examples directly address the root cause—unclear decision boundaries between simple and complex cases. It’s the most proportional, effective first intervention that teaches the agent when to escalate and when to resolve autonomously without extra infrastructure.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-50",
    "question": "After calling `get_customer` and `lookup_order`, the agent has all available system data but still faces\nuncertainty. Which situation is the most justified trigger for calling `escalate_to_human`?",
    "options": [
      "A customer wants to cancel an order shipped yesterday and arriving tomorrow. The agent should escalate because the customer might change their mind after receiving the package.",
      "A customer claims they didn’t receive an order, but tracking shows it was delivered and signed for at their address three days ago. The agent should escalate because presenting contradictory evidence could harm the customer relationship.",
      "A customer requests competitor price matching. Your policies allow price adjustments for price drops on your own site within 14 days, but say nothing about competitor prices. The agent should escalate for policy interpretation.",
      "A customer message contains both a billing question and a product return. The agent should escalate so a human can coordinate both issues in one interaction."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "This is a genuine policy gap: company rules cover price drops on your own site but do not address competitor price matching. The agent must not invent policy and should escalate for human judgment on how to interpret or extend existing rules.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-51",
    "question": "Production logs show that in 12% of cases your agent skips `get_customer` and calls `lookup_order` directly\nusing only the customer-provided name, sometimes leading to misidentified accounts and incorrect refunds.",
    "options": [
      "Add few-shot examples showing that the agent always calls `get_customer` first, even when customers voluntarily provide order details.",
      "Implement a routing classifier that analyzes each request and enables only a subset of tools appropriate for that request type.",
      "Add a programmatic precondition that blocks `lookup_order` and `process_refund` until `get_customer` returns a verified customer identifier.",
      "Strengthen the system prompt stating that customer verification via `get_customer` is mandatory before any order operations."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "A programmatic precondition provides a deterministic guarantee that required sequencing is followed. It’s the most effective approach because it eliminates the possibility of skipping verification, regardless of LLM behavior.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-52",
    "question": "Production metrics show that when resolving complex billing disputes or multi-order returns, customer\nsatisfaction scores are 15% lower than for simple cases—even when the resolution is technically correct.\nRoot-cause analysis shows the agent provides accurate solutions but inconsistently explains rationale:\nsometimes omitting relevant policy details, sometimes missing timeline info or next steps. The specific context\ngaps vary case by case. You want to improve solution quality without adding human oversight. What approach\nis most effective?",
    "options": [
      "Add a self-critique stage where the agent evaluates a draft response for completeness—ensuring it resolves the customer’s issue, includes relevant context, and anticipates follow-up questions.",
      "Add a confirmation stage where the agent asks “Does this fully resolve your issue?” before closing, allowing customers to request additional information if needed.",
      "Upgrade the model from Haiku to Sonnet for complex cases, routing based on a defined complexity metric.",
      "Implement few-shot examples in the system prompt showing complete explanations for five common complex case types, demonstrating how to include policy context, timelines, and next steps."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A self-critique stage (the evaluator-optimizer pattern) directly addresses inconsistent explanation completeness by forcing the agent to assess its own draft against concrete criteria—such as policy context, timelines, and next steps—before presenting it. This catches case-specific gaps without human oversight.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-53",
    "question": "Production metrics show your agent averages 4+ API loops per resolution. Analysis reveals Claude often\nrequests `get_customer` and `lookup_order` in separate sequential turns even when both are needed initially.",
    "options": [
      "Implement speculative execution that automatically calls likely-needed tools in parallel with any requested tool and returns all results regardless of what was requested.",
      "Increase `max_tokens` to give Claude more room to plan and naturally combine tool requests.",
      "Create composite tools like `get_customer_with_orders` that bundle common lookup combinations into single calls.",
      "Instruct Claude in the prompt to bundle tool requests into one turn and return all results together before the next API call."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "Prompting Claude to bundle related tool requests into a single turn leverages its native ability to request multiple tools at once. It directly fixes the sequential-call pattern with minimal architectural change.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-54",
    "question": "Production logs show a pattern: customers reference specific amounts (e.g., “the 15% discount I mentioned”),\nbut the agent responds with incorrect values. Investigation shows these details were mentioned 20+ turns ago\nand condensed into vague summaries like “promotional pricing was discussed.” What fix is most effective?",
    "options": [
      "Increase the summarization threshold from 70% to 85% so conversations have more room before summarization triggers.",
      "Store full conversation history in external storage and implement retrieval when the agent detects references like “as I mentioned.”",
      "Extract transactional facts (amounts, dates, order numbers) into a persistent “case facts” block included in every prompt outside the summarized history.",
      "Revise the summarization prompt to explicitly preserve all numbers, percentages, dates, and customer-stated expectations verbatim."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "Summarization inherently loses precise details. Extracting transactional facts into a structured “case facts” block outside the summarized history preserves critical information so it’s reliably available in every prompt regardless of how many turns have been summarized.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-55",
    "question": "Your `get_customer` tool returns all matches when searching by name. Currently, when there are multiple\nresults, Claude picks the customer with the most recent order, but production data shows this selects the wrong\naccount 15% of the time for ambiguous matches. How should you address this?",
    "options": [
      "Implement a confidence scoring system that acts autonomously above 85% confidence and requests clarification below the threshold.",
      "Instruct Claude to request an additional identifier (email, phone, or order number) when `get_customer` returns multiple matches before taking any customer-specific action.",
      "Modify `get_customer` to return only a single most-likely match based on a ranking algorithm, eliminating ambiguity.",
      "Add few-shot examples to the prompt demonstrating correct reasoning and tool sequencing for ambiguous matches."
    ],
    "answer": "B",
    "correct": 1,
    "explanation": "Asking the user for an additional identifier is the most reliable way to resolve ambiguity because the user has definitive knowledge of their identity. One extra conversational turn is a small price to pay to eliminate a 15% error rate caused by choosing the wrong account.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-56",
    "question": "Production logs show a consistent pattern: when customers include the word “account” in their message (e.g., “I\nwant to check my account for an order I made yesterday”), the agent calls `get_customer` first 78% of the time.\nWhen customers phrase similar requests without “account” (e.g., “I want to check an order I made yesterday”), it\ncalls `lookup_order` first 93% of the time. Tool descriptions are clear and unambiguous. What is the most likely\nroot cause of this discrepancy?",
    "options": [
      "The system prompt contains keyword-sensitive instructions that steer behavior based on terms like “account,” creating unintended tool-selection patterns.",
      "The model’s base training creates associations between “account” terminology and customer-related operations that override tool descriptions.",
      "The model needs more training data on multi-concept messages and should be fine-tuned on examples containing both account and order terminology.",
      "Tool descriptions need additional negative examples specifying when NOT to use each tool to prevent this keyword-induced confusion."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "The systematic keyword-driven pattern (78% vs 93%) strongly indicates explicit routing logic in the system prompt reacting to the word “account” and steering the agent toward customer-related tools. Since tool descriptions are already clear, the discrepancy points to prompt-level instructions creating unintended behavioral steering.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-57",
    "question": "Production logs show the agent often calls `get_customer` when users ask about orders (e.g., “check my order\n#12345”) instead of calling `lookup_order`. Both tools have minimal descriptions (“Gets customer information” /\n“Gets order details”) and accept similar-looking identifier formats. What is the most effective first step to improve\ntool selection reliability?",
    "options": [
      "Implement a routing layer that analyzes user input before each turn and preselects the correct tool based on detected keywords and ID patterns.",
      "Combine both tools into a single `lookup_entity` that accepts any identifier and internally decides which backend to query.",
      "Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5–8 examples routing order-related queries to `lookup_order`.",
      "Expand each tool’s description to include input formats, example queries, edge cases, and boundaries explaining when to use it versus similar tools."
    ],
    "answer": "D",
    "correct": 3,
    "explanation": "Expanding tool descriptions with input formats, example queries, edge cases, and clear boundaries directly fixes the root cause—minimal descriptions that don’t give the LLM enough information to distinguish similar tools. It’s a low-effort, high-impact first step that improves the primary mechanism the LLM uses for tool selection.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-58",
    "question": "You are implementing the agent loop for your support agent. After each Claude API call, you must decide\nwhether to continue the loop (run requested tools and call Claude again) or stop (present the final answer to the\ncustomer). What determines this decision?",
    "options": [
      "Check the `stop_reason` field in Claude’s response—continue if it is `tool_use` and stop if it is `end_turn`.",
      "Parse Claude’s text for phrases like “I’m done” or “Can I help with anything else?”—natural language signals indicate task completion.",
      "Set a maximum iteration count (e.g., 10 calls) and stop when reached, regardless of whether Claude indicates more work is needed.",
      "Check whether the response contains assistant text content—if Claude generated explanatory text, the loop should terminate."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "`stop_reason` is Claude’s explicit structured signal for loop control: `tool_use` indicates Claude wants to run a tool and receive results back, while `end_turn` indicates Claude has completed its response and the loop should end.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-59",
    "question": "Production logs show the agent misinterprets outputs from your MCP tools: Unix timestamps from\n`get_customer`, ISO 8601 dates from `lookup_order`, and numeric status codes (1=pending, 2=shipped). Some\ntools are third-party MCP servers you cannot modify. Which approach to data format normalization is most\nmaintainable?",
    "options": [
      "Use a PostToolUse hook to intercept tool outputs and apply formatting transformations before the agent processes them.",
      "Modify tools you control to return human-readable formats and create wrappers for third-party tools.",
      "Create a `normalize_data` tool that the agent calls after every data retrieval to transform values.",
      "Add detailed format documentation to the system prompt explaining each tool’s data conventions."
    ],
    "answer": "A",
    "correct": 0,
    "explanation": "A PostToolUse hook provides a centralized, deterministic point to intercept and normalize all tool outputs—including third-party MCP server data—before the agent processes them. It’s more maintainable because transformations live in code and apply uniformly, rather than relying on LLM interpretation.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  },
  {
    "num": "juli-60",
    "question": "Production logs show the agent sometimes chooses `get_customer` when `lookup_order` would be more\nappropriate, especially for ambiguous queries like “I need help with my recent purchase.” You decide to add\nfew-shot examples to the system prompt to improve tool selection. Which approach most effectively addresses\nthe problem?",
    "options": [
      "Add explicit “use when” and “don’t use when” guidance in each tool description covering ambiguous cases.",
      "Add examples grouped by tool—all `get_customer` scenarios together, then all `lookup_order` scenarios.",
      "Add 4–6 examples targeted at ambiguous scenarios, each with rationale for why one tool was chosen over plausible alternatives.",
      "Add 10–15 examples of clear, unambiguous requests demonstrating correct tool choice for typical scenarios for each tool."
    ],
    "answer": "C",
    "correct": 2,
    "explanation": "Targeting few-shot examples at the specific ambiguous scenarios where errors occur, with explicit rationale for why one tool is preferable to alternatives, teaches the model the comparative decision process needed for edge cases. This is more effective than generic examples or declarative rules.",
    "type": "mc",
    "src": "juli",
    "lvl": "intermediate",
    "domain": ""
  }
];
