/* Question bank — Claude Certified Architect: Foundations (CCA-F)
   Built from the official exam blueprint (5 domains) and community practice resources
   (OlivierAlter practice exam index, dnacenta guide, claudecertificationguide.com,
   avidevelops & hamzafarooq community repos). All questions written originally,
   covering the concepts those sources test. */
window.STUDY_DATA = [

{ id:"agentic", name:"🤖 Agentic Architecture (27%)", questions:[
  { type:"mc",
    question:`A support agent must ALWAYS verify the customer's identity before processing a refund. The system prompt already says so, but in production the model sometimes skips the verification. What is the most robust solution?`,
    options:[
      `Repeat the instruction in uppercase at the beginning and end of the system prompt.`,
      `Implement a programmatic prerequisite: the refund tool's handler rejects the call if no prior verification occurred in the session.`,
      `Lower the temperature to 0 so the model is more obedient.`,
      `Add more few-shot examples of the correct flow.`],
    correct:1,
    answer:`The golden rule of the exam: **prompt instructions have a non-zero failure rate; programmatic constraints guarantee compliance**.
- A **prerequisite in code** (the refund tool fails if no recorded verification exists) makes the ordering **deterministic**.
- Improving the prompt (options A, C, D) reduces the frequency of the error but does not eliminate it.
- For critical business rules: **enforcement in code or hooks, never prompt alone**.` },

  { type:"mc",
    question:`What is the canonical way to detect that an agentic loop has finished its work?`,
    options:[
      `Look for phrases like "I'm done" in the response text.`,
      `Inspect the stop_reason field of the response: "end_turn" indicates the model finished without requesting more tools.`,
      `Count the number of iterations and stop at a fixed number.`,
      `Wait for the response to come back empty.`],
    correct:1,
    answer:`The **stop_reason** field is the API's structural signal:
- **"tool_use"** → the model wants to execute a tool: the loop continues.
- **"end_turn"** → the model finished its turn: the loop can end.
- Parsing natural language ("I'm done") is **fragile and unreliable**.
- Iteration caps (option C) are a safety guardrail, **not** the primary termination mechanism.` },

  { type:"mc",
    question:`In a Messages API response, which stop_reason indicates that the model wants to invoke a tool?`,
    options:[`"end_turn"`,`"max_tokens"`,`"tool_use"`,`"stop_sequence"`],
    correct:2,
    answer:`**"tool_use"**: the model emitted one or more tool use blocks and is waiting for the results.
The other values:
- **"end_turn"**: finished naturally.
- **"max_tokens"**: cut off by the token limit (careful: the response may be incomplete!).
- **"stop_sequence"**: it hit a stop sequence you defined.` },

  { type:"vf",
    question:`The iteration cap (maximum number of loop turns) should be the main mechanism for deciding when an agent has finished its task.`,
    correct:"F",
    answer:`**False.** The iteration cap is a **safety guardrail** against runaway loops and unbounded costs — a safety net, not the termination mechanism.
Normal termination should be based on **stop_reason = "end_turn"** (the model decided it was done). If the agent frequently hits the cap, that is a symptom of a design problem (poorly defined task, failing tools, insufficient context).` },

  { type:"mc",
    question:`An agent runs several searches and then must compare the results against each other. To save context, a developer proposes replacing each result with a one-line summary as soon as it arrives. What is the main risk?`,
    options:[
      `Summaries consume more tokens than the original results.`,
      `The model cannot read summarized text.`,
      `Summaries may omit details that turn out to be critical when comparing results against each other; multi-result reasoning needs the full data in the history.`,
      `The API rejects edited messages.`],
    correct:2,
    answer:`When the task requires **reasoning over several results together** (comparing, cross-referencing, detecting inconsistencies), summarizing prematurely destroys information that cannot be recovered later.
- Keep the **full results in the history** while the reasoning still needs them.
- Compress or discard **after** the comparison stage is finished (e.g., with a hook that trims old results, or compaction).` },

  { type:"mc",
    question:`A coordinator-subagents research system produces reports with coverage gaps: important aspects of the topic are missing. Where is the most likely root cause?`,
    options:[
      `The subagents use a model that is too small.`,
      `The task decomposition performed by the coordinator: if the breakdown into subtasks doesn't cover all aspects, no subagent will investigate them.`,
      `The subagents don't have enough tools.`,
      `The final report needs more output tokens.`],
    correct:1,
    answer:`**The coordinator's decomposition determines coverage.** Subagents only investigate what they are assigned: if the breakdown omits an aspect, that aspect doesn't exist for the system.
- The subagents' execution quality is **secondary** to the quality of the decomposition plan.
- Typical fix: improve the coordinator's planning prompt (ask it to enumerate aspects, verify coverage, consider missing angles).` },

  { type:"mc",
    question:`A coordinator has 6 specialized subagents. For simple queries, running the full pipeline wastes time and tokens. Which pattern is appropriate?`,
    options:[
      `Always run all 6 subagents to guarantee consistency.`,
      `Adaptive routing: the coordinator assesses the query's complexity and dynamically selects which subagents to invoke.`,
      `Remove subagents until only 2 remain.`,
      `Cache the subagents' responses.`],
    correct:1,
    answer:`**Query-adaptive routing**: the coordinator decides which subagents are needed based on the query's complexity and type.
- A simple query may be resolved with 1 subagent (or none).
- A static pipeline that always runs everything is a **waste of resources** and adds latency without value.
- This is the **routing** pattern from "Building Effective Agents" applied to orchestration.` },

  { type:"mc",
    question:`A research subagent processed 7 of its 10 assigned sources and returned incomplete results. What is the best recovery?`,
    options:[
      `Discard everything and relaunch the subagent with all 10 sources.`,
      `Ask the coordinator to invent the content of the 3 missing sources based on the 7 processed ones.`,
      `Re-invoke the subagent with only the 3 pending sources, passing what was already completed as context.`,
      `Ignore the missing sources and synthesize with what is available.`],
    correct:2,
    answer:`**Targeted re-delegation**: reprocess only what's missing (the 3 sources), with the context of what was already done to maintain coherence.
- Relaunching everything (A) wastes the valid work already performed.
- Synthesizing by "inventing" what's missing (B) produces **fabrication**: the system would cite sources it never read.
- Ignoring (D) reproduces the original problem: coverage gaps.` },

  { type:"mc",
    question:`In the Agent SDK, a coordinator fails to spawn subagents: every attempt fails. Which configuration should you check first?`,
    options:[
      `That the model is the largest one available.`,
      `That the "Task" tool is included in the coordinator's allowedTools list.`,
      `That the subagents have separate API keys.`,
      `That the global timeout is greater than 60 seconds.`],
    correct:1,
    answer:`Subagents are spawned via the **"Task"** tool. If "Task" is not in **allowedTools**, the coordinator has no way to delegate.
- This is the Agent SDK's basic capability gating: an agent can only do what its allowed tools enable.
- Same principle in Claude Code: permissions determine effective capabilities.` },

  { type:"mc",
    question:`A multi-agent pipeline loses the correspondence between claims and their sources when passing information from the researcher subagent to the synthesizer. How is traceability (provenance) preserved?`,
    options:[
      `Ask the synthesizer to "remember" where each piece of data came from.`,
      `Pass structured context that separates content from metadata (URL, date, page), so the claim→source mapping survives each handoff.`,
      `Repeat the research in the synthesizer.`,
      `Attach the complete history of all subagents.`],
    correct:1,
    answer:`**Structured context with explicit metadata**: each finding travels as a unit {content, source, URL, date, page}.
- If the source travels "implicitly" in prose, it gets lost in the first summary or rewrite.
- With structure, the synthesizer can cite precisely and the system can **audit** every claim in the final report.
- This concept also appears in Domain 5 as "information provenance".` },

  { type:"mc",
    question:`A coordinator must research 4 mutually independent subtopics. How does it minimize total latency?`,
    options:[
      `Invoking the subagents one at a time, waiting for each result before the next.`,
      `Emitting the 4 Task tool calls in a single response, so the subagents run in parallel.`,
      `Concatenating the 4 subtopics into a single subagent.`,
      `Using a faster model for the coordinator.`],
    correct:1,
    answer:`For **independent** subtasks, the coordinator should emit **multiple Task calls in the same response** → parallel execution.
- Sequential (A): latency = sum of all 4. Parallel: latency ≈ the slowest one.
- A single subagent with everything (C) loses the benefits of isolated context and specialization.
- Rule: parallelize what is independent; sequence only what has real dependencies.` },

  { type:"mc",
    question:`Which workflow pattern is appropriate for a task with well-defined stages known in advance (e.g., extract → translate → format)?`,
    options:[
      `Orchestrator-workers with dynamic decomposition.`,
      `Prompt chaining: focused sequential passes, where each step's output feeds the next.`,
      `Evaluator-optimizer with a critique loop.`,
      `One giant prompt that does everything at once.`],
    correct:1,
    answer:`**Prompt chaining** is the pattern for **predictable, decomposable** flows: each step does one thing well, with the option to validate between steps ("gates").
- Each focused pass performs better than a mega-prompt that splits the model's attention.
- Dynamic decomposition (A) is reserved for **exploratory** tasks where the steps aren't known in advance.
- Chaining's trade-off: more total latency in exchange for more precision per stage.` },

  { type:"mc",
    question:`A research task is open-ended: it is not known in advance which subtopics will emerge or how many steps are needed. Which decomposition strategy applies?`,
    options:[
      `Prompt chaining with fixed stages.`,
      `Adaptive decomposition: build and adjust the research plan based on intermediate findings.`,
      `Run 10 generic subagents in parallel and merge everything.`,
      `Limit the research to a single step to avoid uncertainty.`],
    correct:1,
    answer:`For **exploratory/open-ended** scope: **adaptive dynamic decomposition** — the plan evolves with the findings (orchestrator-workers pattern).
- A fixed pipeline (A) cannot anticipate unknown subtopics.
- This is the key **workflow vs agent** difference: workflows follow predefined paths; agents direct their own process based on what they discover.` },

  { type:"mc",
    question:`In the "orchestrator-workers" pattern, what is the orchestrator's role?`,
    options:[
      `Execute all the subtasks itself, in order.`,
      `Dynamically decompose the task, delegate subtasks to workers, and synthesize their results.`,
      `Validate the JSON syntax of the responses.`,
      `Choose which model to use for each call.`],
    correct:1,
    answer:`The orchestrator (coordinator): **decomposes** the central task into subtasks (that weren't known in advance), **delegates** each one to workers, and **synthesizes** the results.
- It differs from simple parallelization in that the subtasks are determined **dynamically** based on the input.
- Ideal for: multi-source research, code changes touching several files, tasks whose structure depends on the case.` },

  { type:"mc",
    question:`When is the "evaluator-optimizer" pattern appropriate?`,
    options:[
      `When the task has independent parallelizable subtasks.`,
      `When there is a clear evaluation criterion and quality improves through iteration: one LLM generates, another critiques against the criterion, and this repeats until it passes.`,
      `When inputs must be classified into categories.`,
      `When the token budget is minimal.`],
    correct:1,
    answer:`**Evaluator-optimizer**: a generator produces, an evaluator critiques with **explicit criteria**, and the loop iterates until approval.
- It works when: (1) there are clear, verbalizable evaluation criteria, and (2) iteration yields measurable improvement.
- Examples: literary translation with nuance, code that must pass tests, writing against a rubric.
- Cost: multiple calls per result — don't use it if a single pass already achieves sufficient quality.` },

  { type:"mc",
    question:`What is the "routing" pattern in LLM architectures?`,
    options:[
      `Balancing requests across several API keys.`,
      `Classifying the input and directing it to a specialized flow (different prompt, tools, or model depending on the category).`,
      `Choosing the nearest datacenter region.`,
      `Retrying against another endpoint when the first one fails.`],
    correct:1,
    answer:`**Routing** = classification + dispatch: a first step determines the input's category and sends it to a **specialized** flow.
- Benefit: **separation of concerns** — each flow is optimized for its case without degrading the others.
- Examples: support (general inquiry vs refund vs technical), or routing easy questions to a small/cheap model (Haiku) and hard ones to a large one.` },

  { type:"mc",
    question:`Within the "parallelization" pattern, what is the difference between "sectioning" and "voting"?`,
    options:[
      `Sectioning splits the task into independent parts that run in parallel; voting runs the SAME task several times to compare/aggregate results.`,
      `Sectioning is sequential and voting is parallel.`,
      `Sectioning uses several models; voting uses only one.`,
      `They are synonyms.`],
    correct:0,
    answer:`Two variants of parallelization:
- **Sectioning**: splitting the task into **independent subtasks** that run in parallel (e.g., reviewing each file separately; one call processes the query and another screens it for policy).
- **Voting**: running the **same task several times** and aggregating (majority, union, consensus) to gain confidence (e.g., 3 independent reviewers look for vulnerabilities; what the majority confirms gets reported).` },

  { type:"vf",
    question:`In Anthropic's terminology, "workflow" and "agent" are synonyms: any system that uses an LLM with tools is an agent.`,
    correct:"F",
    answer:`**False.** The distinction is central:
- **Workflow**: the LLM and tools are orchestrated through **predefined code paths** — the flow is decided by the developer.
- **Agent**: the LLM **dynamically directs its own process** and tool usage, deciding how to proceed based on what it finds.
Design advice: seek the **simplest** solution that works — workflows for predictable tasks; agents only when flexibility and autonomous decision-making at scale are needed.` },

  { type:"mc",
    question:`The subagents in a system return data in heterogeneous formats (JSON, tables, prose) and the coordinator gets confused integrating them. In the Agent SDK, which mechanism allows them to be normalized automatically?`,
    options:[
      `A PreToolUse hook that blocks tools that return prose.`,
      `A PostToolUse hook that intercepts each result and transforms it into a uniform format before the model processes it.`,
      `Raise the coordinator's temperature.`,
      `Ask in the prompt that each subagent "try to use JSON".`],
    correct:1,
    answer:`**PostToolUse** runs **after** each tool execution and can transform the result before it reaches the model:
- Normalize heterogeneous formats into a single structure.
- Trim irrelevant fields (context savings).
- It is **deterministic** (code), unlike asking for it via prompt.
Its twin **PreToolUse** runs before execution and can block or modify the call.` },

  { type:"mc",
    question:`A compliance policy forbids the agent from executing the "delete_record" tool on records of active customers. What is the correct implementation?`,
    options:[
      `Document the prohibition in the system prompt with firm language.`,
      `A PreToolUse hook that inspects each call to delete_record and blocks it if the record belongs to an active customer.`,
      `Trust that the model was trained to be careful.`,
      `Log the executions to audit afterwards.`],
    correct:1,
    answer:`**PreToolUse** intercepts the call **before the action happens** and can block it programmatically → **guaranteed** compliance.
- The prompt (A) reduces the probability but gives no guarantees; for hard policies that isn't enough.
- Logging (D) detects the violation **after** the damage.
- General exam pattern: **critical policy → enforcement in code (hooks/permissions), not in the prompt**.` },

  { type:"mc",
    question:`An agent's hooks return both the raw output of each tool and the processed version into the context, and the context runs out quickly. What should be done?`,
    options:[
      `Increase the maximum output tokens.`,
      `Modify the hook to return only the formatted summary, removing the redundant raw output.`,
      `Disable the hooks.`,
      `Split the session into two agents.`],
    correct:1,
    answer:`If the hook already produces a **sufficient processed version**, the raw output is pure redundancy that burns context.
- Adjust the hook to inject **only** the final format.
- Context management principle: every token in the history must **earn its place** — duplicated or intermediate data is removed at the earliest possible layer.` },

  { type:"mc",
    question:`You resume an agent session that analyzed a repo days ago, but 3 files have changed since then. What is the best way to resume?`,
    options:[
      `Resume and assume the previous analysis is still valid.`,
      `Start a brand-new session from scratch.`,
      `Resume the session while informing the agent which files changed, so it re-analyzes only those in the context of its prior understanding.`,
      `Paste the full diff of each file into the first message without explanation.`],
    correct:2,
    answer:`**Resumption with targeted re-analysis**: the session retains the global understanding (valuable, costly to rebuild) and the agent updates **only what changed**.
- Assuming validity (A) → outdated conclusions.
- A new session (B) throws away all the accumulated context.
- The targeted middle ground maximizes reuse + correctness.` },

  { type:"mc",
    question:`You want to explore 3 different refactoring approaches starting from the same baseline analysis by an agent, without the explorations contaminating each other. Which Agent SDK mechanism do you use?`,
    options:[
      `Three calls in the same session, one per approach.`,
      `fork_session: create independent branches of the session that share the baseline but diverge without contaminating each other.`,
      `Delete the history between each approach.`,
      `Three different API keys.`],
    correct:1,
    answer:`**fork_session** creates **independent branches** from a common point:
- Each branch inherits the baseline (the analysis already done) without repeating the cost.
- The explorations diverge in **isolation**: what is tried in one branch does not bias the others.
- Exploring in a single session (A) contaminates: the model carries over conclusions from the previous approach.` },

  { type:"mc",
    question:`An agent must investigate 5 customer complaints that turned out to be independent problems, with common context (same account). How should the investigation be structured?`,
    options:[
      `A single sequential pass that investigates the 5 complaints in order.`,
      `Decompose into 5 parallel investigation items that share the account's common context.`,
      `Investigate only the most severe complaint.`,
      `A single prompt asking to "analyze everything together".`],
    correct:1,
    answer:`**Independent** problems → **parallel investigation**, each item with the **shared context** (account data) it needs.
- Sequential processing is an unnecessary bottleneck when there are no dependencies.
- Each isolated investigation stays focused (better per-item quality) and the whole finishes sooner.` },

  { type:"open",
    question:`You are designing an autonomous agent that executes actions on real systems (tickets, refunds, code). List the guardrails you would implement for production.`,
    answer:`- **Iteration and budget caps**: safety net against runaway loops and runaway costs (not as primary termination).
- **Termination via stop_reason**: the loop stops on a structural signal ("end_turn"), not by parsing text.
- **PreToolUse hooks**: programmatic blocking of actions forbidden by policy (don't trust the prompt for critical rules).
- **Minimal permissions (allowedTools)**: the agent only has the tools its role needs.
- **Human-in-the-loop**: human approval for irreversible or high-impact actions (deleting data, moving money, publishing).
- **Structured errors and bounded retries**: distinguish transient errors (retry with backoff) from definitive ones (isRetryable: false).
- **Sandboxing**: run code/commands in isolated environments.
- **Observability**: logging of every tool call and decision for auditing and debugging.` },

  { type:"open",
    question:`Explain the coordinator-subagents (orchestrator-workers) pattern: how it works, when to use it, and what its typical risks are.`,
    answer:`**How it works:**
- A **coordinator** receives the task, **dynamically decomposes** it into subtasks, delegates each one to specialized **subagents** (with their own context and scoped tools), and **synthesizes** the results.
- Independent subtasks are launched **in parallel** (multiple Task calls in one response).

**When to use it:**
- Complex tasks whose structure is **not known in advance** (multi-source research, multi-file changes).
- When a single agent's context isn't enough: each subagent works with a clean, focused context.

**Typical risks:**
- **Coverage gaps**: if the decomposition omits an aspect, nobody investigates it (the root cause usually lies in the coordinator, not the workers).
- **Loss of provenance**: passing findings without structured metadata breaks the claim→source mapping.
- **Fabrication during synthesis**: if a subagent returns incomplete work, the synthesizer may "fill in" — the right move is to re-delegate what's missing, not invent it.
- **Cost**: multiplying agents multiplies tokens; use it only when the task justifies it.` },

  { type:"vf",
    question:`If a task can be solved well with a single model call and a good prompt, you should still build a multi-agent system because it always performs better.`,
    correct:"F",
    answer:`**False.** Anthropic's guiding principle: **seek the simplest solution that works**.
- Every layer of agency adds **cost, latency, and error surface**.
- Multi-agent systems are justified when the task exceeds what a simple call/workflow can achieve: dynamic scope, context that doesn't fit, genuinely parallelizable subtasks.
- On the exam, "more architecture for its own sake" options are usually distractors.` },

  { type:"mc",
    question:`A coordinator has spent 20 turns building an understanding of a research topic. It spawns a subagent for a follow-up subtask, but the subagent produces work that ignores everything already established. Why?`,
    options:[
      `The subagent used a different model.`,
      `Subagents do NOT inherit the coordinator's session history: any findings the subtask depends on must be explicitly injected into the subagent's prompt in structured form.`,
      `The subagent's temperature was too high.`,
      `Subagents can only read, not reason.`],
    correct:1,
    answer:`Each subagent starts with a **fresh, isolated context** — that is the point of subagents (clean, focused context), but it cuts both ways:
- Nothing from the coordinator's history is visible to the subagent unless you **pass it explicitly**.
- Inject the relevant findings in a **structured format** (facts, sources, constraints), not "see above".
- Design rule: a subagent prompt must be **self-contained** — everything needed to do the subtask correctly.` },

  { type:"mc",
    question:`A coordinator already holds all the information needed to answer a sub-question (it gathered it in earlier turns). Should it spawn a synthesis subagent for that sub-question?`,
    options:[
      `Yes — subagents always produce higher-quality output.`,
      `No — if the coordinator already has the information in context, it should synthesize at its own level; spawning a subagent to re-process existing context adds cost and loses fidelity in the handoff.`,
      `Yes — it keeps the coordinator's context clean.`,
      `Only if more than three sources are involved.`],
    correct:1,
    answer:`Subagents earn their cost when they do **new work** (exploration, parallel research, verbose discovery) in isolated context.
- Re-processing information the coordinator **already holds** means paying a full handoff (serialize → transfer → re-read) for zero new information — and every handoff risks losing nuance.
- Rule: **delegate to acquire, synthesize in place.**` },

  { type:"mc",
    question:`A subagent prompt gives a rigid step-by-step procedure ("1. search X, 2. open first result, 3. extract...") and the subagent fails whenever reality deviates from the script. What is the better prompting approach?`,
    options:[
      `Add more steps covering every possible deviation.`,
      `Replace the procedural script with a research GOAL plus quality criteria, letting the subagent adapt its approach to what it actually finds.`,
      `Lower the temperature so the steps are followed more literally.`,
      `Split each step into its own subagent.`],
    correct:1,
    answer:`For agents, **goal-oriented prompts beat procedural scripts**:
- State the **objective**, the **quality bar** (what a good result looks like, which sources count), and the **constraints**.
- The agent then adapts when a search returns nothing, a page is down, or the information appears in an unexpected form.
- Procedural scripts are brittle by construction: they encode one happy path. (Use rigid procedures only where compliance matters more than adaptability — and then enforce them in code, not prose.)` },

  { type:"mc",
    question:`An agent's tool call to "create_ticket" times out; the agent cannot tell whether the ticket was created, and retrying might duplicate it. What design property of the tool prevents this problem?`,
    options:[
      `Longer timeouts.`,
      `Idempotency: designing the operation (e.g. with a client-generated request ID) so that re-executing it is safe and produces the same result instead of a duplicate.`,
      `Returning errors as plain text.`,
      `Calling the tool twice deliberately and deleting one result.`],
    correct:1,
    answer:`**Idempotency** makes retries safe: executing the same operation twice yields the same outcome as once.
- Typical implementation: a **client-generated idempotency key / request ID** — the backend recognizes the repeat and returns the original result instead of creating a duplicate.
- Essential in agentic loops, where timeouts and retries are normal: without idempotency, every ambiguous failure becomes a potential duplicate side effect.` },
]},

{ id:"mcp", name:"🔧 Tools & MCP (18%)", questions:[
  { type:"mc",
    question:`An agent with 8 tools systematically picks the wrong tool for certain queries. What is the MOST decisive factor in getting the model to select correctly?`,
    options:[
      `The order in which the tools appear in the list.`,
      `The quality of the descriptions: what each tool does, when to use it, input formats, examples, and the limits of its scope.`,
      `Using tool names that are as short as possible.`,
      `Increasing max_tokens.`],
    correct:1,
    answer:`**The tool description is the primary selection mechanism.** The model decides which tool to use by reading name + description + schema.
A good description includes:
- **What it does** and **when to use it** (and when NOT to).
- **Input formats** with concrete examples.
- **Limits**: what falls outside its scope.
Anthropic recommends putting the same care into tool descriptions as into the main prompt.` },

  { type:"mc",
    question:`The model calls an invoice search tool with dates in the wrong format ("May 3rd" instead of "2026-05-03"). Where is this best fixed?`,
    options:[
      `In the agent's general system prompt.`,
      `In the tool's description and schema: specify the exact format (ISO 8601) with valid and invalid examples.`,
      `With a reminder user message on every turn.`,
      `By lowering the temperature.`],
    correct:1,
    answer:`A tool's format constraints live **in the tool**: description + JSON Schema (type, pattern, format, enum) + examples.
- The model consults the tool definition **at the moment it constructs the call** — that is the point of maximum impact.
- The general system prompt (A) sits "far" from the decision and competes with many other instructions.
- Ideally: also validate in the handler and return a **structured error** that teaches the correct format.` },

  { type:"mc",
    question:`Two tools query different customer databases (retail and corporate) but have nearly identical names and descriptions, and the model confuses them. What is the best solution?`,
    options:[
      `Add a table to the system prompt explaining when to use each one.`,
      `Rename the tools and rewrite their descriptions to explicitly reflect their backend and distinct use cases (search_retail_customers vs search_corporate_accounts).`,
      `Merge them into a single tool with a "database" parameter.`,
      `Delete one of the two.`],
    correct:1,
    answer:`Disambiguation happens **in the tools themselves**: names and descriptions that express each one's specialization.
- \`search_retail_customers\` / \`search_corporate_accounts\` with descriptions stating what data each backend contains and examples of typical queries.
- Patching via the system prompt (A) is fragile: the strongest signal when choosing a tool is its own definition.
- Merging (C) can be valid, but it introduces a parameter the model can also get wrong; explicit specialization is usually more robust.` },

  { type:"mc",
    question:`A search tool fails and returns only "Error". The agent retries the same thing over and over. How should the tool respond to enable intelligent recovery?`,
    options:[
      `Return an HTTP code and nothing else.`,
      `Return a structured error: failure type, what query was attempted, partial results if any, and suggested alternative approaches.`,
      `Return an empty list so the agent moves on.`,
      `Throw an exception that kills the loop.`],
    correct:1,
    answer:`Tool errors are **information for the model**: the more context, the better the recovery.
A good structured error includes:
- **Failure type** (timeout, validation, permission, not found).
- **What was attempted** (the exact query).
- **Partial results** if they exist.
- **Suggested alternatives** ("try narrowing the date range", "use the ID instead of the name").
A bare "Error" condemns the model to retry blindly.` },

  { type:"mc",
    question:`What metadata should be included in a tool's error responses so the agent can decide whether to retry?`,
    options:[
      `A timestamp and the server name.`,
      `errorCategory (transient / validation / permission), an isRetryable flag, and a specific explanation of the failure.`,
      `The full stack trace.`,
      `An internal numeric code with no documentation.`],
    correct:1,
    answer:`The useful triad for automated decision-making:
- **errorCategory**: transient (retry), validation (fix the input), permission (escalate or abandon).
- **isRetryable**: an explicit boolean — spares the model from inferring it.
- **Specific explanation**: what went wrong and how to fix it.
The stack trace (C) burns context and does not help decide; the undocumented code (D) is opaque to the model.` },

  { type:"mc",
    question:`A search tool returns an empty list both when the backend is down and when there genuinely are no results. Why is this a problem, and how is it fixed?`,
    options:[
      `It is not a problem: in both cases there is no data.`,
      `The agent cannot distinguish "does not exist" from "could not query"; access failures must be flagged with is_error/an error structure, distinct from a legitimate empty result.`,
      `Always retry on an empty list.`,
      `Return null instead of an empty list.`],
    correct:1,
    answer:`These are two **semantically opposite** facts:
- **Legitimate empty result** → valid conclusion: "no such record exists".
- **Backend down** → nothing is known; concluding "does not exist" would be **false**.
The tool must signal the failure (an **is_error: true** field in the tool_result, or an explicit error structure) so the agent retries/escalates in one case and concludes with confidence in the other.` },

  { type:"mc",
    question:`A payments tool blocks an operation due to a fraud rule. The agent retries the same operation 5 times. What is missing from the tool's response?`,
    options:[
      `A longer delay between retries.`,
      `isRetryable: false with an explanation that this is a policy block, not a technical failure.`,
      `An HTTP 500 code.`,
      `A friendlier message.`],
    correct:1,
    answer:`A block due to a **business rule** (fraud, compliance) is **final**: retrying is useless and even risky.
- **isRetryable: false** + a "policy_violation" category + an explanation → the agent stops insisting and moves to the correct alternative (report, escalate to a human).
- Distinguishing *transient* (retryable) from *permanent* (non-retryable) is the heart of tool error design.` },

  { type:"mc",
    question:`A synthesis agent uses only 3 of its 12 available tools in 85% of cases. The other 9 cause occasional wrong selections. What should you do?`,
    options:[
      `Leave it all 12: more tools = more capability.`,
      `Narrow its set to the 3 tools of the common case, preserving the coordination pattern (delegate/escalate) for complex cases that require the rest.`,
      `Remove all of its tools.`,
      `Duplicate the descriptions of the 9 problematic tools.`],
    correct:1,
    answer:`**Tool proliferation increases the probability of wrong selection.** Every tool outside the agent's specialization is noise in the decision.
- A minimal set for the **common case** (85%): less error surface, faster decisions.
- Complex cases remain covered via **coordination**: delegating to another agent that does have those tools.
- Principle: an agent's tools should reflect its **role**, not the system's full inventory.` },

  { type:"mc",
    question:`You need the model to MANDATORILY call the "extract_invoice" tool on every request (never respond with free text). Which configuration guarantees this?`,
    options:[
      `tool_choice: {"type": "auto"}`,
      `tool_choice: {"type": "any"}`,
      `tool_choice: {"type": "tool", "name": "extract_invoice"}`,
      `Asking nicely in the system prompt.`],
    correct:2,
    answer:`The **tool_choice** values:
- **auto** (default): the model decides whether to use tools or respond with text.
- **any**: forced to call **some** tool, but it chooses which.
- **{"type": "tool", "name": "..."}**: forced to call **that** specific tool → the guarantee the scenario asks for.
- **none**: cannot use tools.
For structured extraction, forcing the tool eliminates free-text responses by construction.` },

  { type:"mc",
    question:`What is the difference between tool_choice "any" and "auto"?`,
    options:[
      `None, they are aliases.`,
      `"auto" lets the model decide whether to use a tool or respond with text; "any" forces it to call some tool (it chooses which).`,
      `"any" allows multiple tools per turn and "auto" only one.`,
      `"auto" is for MCP and "any" for local tools.`],
    correct:1,
    answer:`- **auto**: using tools is optional — it can respond with direct text.
- **any**: using a tool is **mandatory** — it eliminates the possibility of a text response without a tool, but leaves the choice of which one to the model.
Useful when your pipeline only knows how to process tool calls: "any" guarantees there is always one.` },

  { type:"vf",
    question:`Giving an agent access to every tool available in the system improves its accuracy, because it will never lack a capability.`,
    correct:"F",
    answer:`**False.** An excess of tools **degrades** selection:
- More options = higher probability of choosing wrong, more tokens spent on definitions, slower decisions.
- Tools outside the agent's role are pure distractors.
Rule: **minimal set aligned to the role**; extra capabilities via delegation/coordination.` },

  { type:"mc",
    question:`Your team wants to version an MCP server's configuration in the repo, but it includes an API key. What is the correct practice?`,
    options:[
      `Commit the key in .mcp.json: the repo is private.`,
      `Use .mcp.json (project scope, versioned) with environment variable expansion like \${API_KEY}: the config is shared, the secret lives in each person's environment.`,
      `Pass the key through the system prompt.`,
      `Do not use MCP in projects with secrets.`],
    correct:1,
    answer:`**.mcp.json** at the repo root defines MCP servers with **project scope** (shared with the team via git).
- It supports **environment variable expansion** (\`\${VAR}\`): the versioned file references the variable; the real value lives in each person's local/CI environment.
- **Never** put secrets in plain text in versioned files.
- MCP config scopes in Claude Code: **local** (only you, this project), **project** (.mcp.json, shared), **user** (all your projects).` },

  { type:"mc",
    question:`An agent spends several exploratory calls just to discover what data an MCP server has available. Which MCP primitive eliminates that overhead?`,
    options:[
      `Tools with longer names.`,
      `Resources: the server exposes a catalog of available data up front, with no need for exploratory tool calls.`,
      `Preloaded prompts.`,
      `A shorter timeout.`],
    correct:1,
    answer:`**Resources** is the MCP primitive for **data exposure**: the server publishes an addressable catalog (by URI) of what it has available.
- The client/model can **discover and read** data without spending rounds of exploratory tool calls.
- The three server-side primitives: **tools** (executable actions), **resources** (data/context), **prompts** (reusable templates).` },

  { type:"mc",
    question:`What are the three main primitives an MCP server can expose?`,
    options:[
      `Models, endpoints, schemas.`,
      `Tools, resources, and prompts.`,
      `Functions, plugins, and actions.`,
      `Queries, mutations, and subscriptions.`],
    correct:1,
    answer:`An MCP server exposes:
- **Tools**: executable functions the model invokes (actions, searches).
- **Resources**: data/context addressable by URI (files, records, catalogs).
- **Prompts**: reusable prompt templates that the user/client can invoke.
On the **client** side there are also: roots, sampling, and elicitation.` },

  { type:"mc",
    question:`Which transports does MCP define for client-server communication?`,
    options:[
      `gRPC and GraphQL.`,
      `stdio (local processes) and Streamable HTTP (remote servers).`,
      `WebSockets only.`,
      `FTP and SMTP.`],
    correct:1,
    answer:`MCP transports:
- **stdio**: the server runs as a local process and communicates via stdin/stdout — ideal for local tools (filesystem, git).
- **Streamable HTTP**: for remote/shared servers (replaces the SSE transport, now deprecated).
The choice: local and per-user → stdio; centralized multi-client service → HTTP.` },

  { type:"vf",
    question:`MCP (Model Context Protocol) is a proprietary Anthropic protocol that only works with Claude models.`,
    correct:"F",
    answer:`**False.** MCP is an **open standard** (open source) for connecting LLM applications to tools and data sources.
- It was created by Anthropic but is model-agnostic: any client/LLM can implement it.
- Its value: **standardized** integration — an MCP server written once serves any compatible client (Claude Code, Claude Desktop, IDEs, other apps).` },

  { type:"mc",
    question:`In Claude Code, you need to find which files in the repo use the "parseInvoice" function. What is the most efficient approach?`,
    options:[
      `List every file with LS and read them one by one with Read.`,
      `Use the Grep tool to search for the pattern across the whole codebase at once.`,
      `Ask the model to "remember" where it is.`,
      `Open every file in the editor.`],
    correct:1,
    answer:`**Grep** searches content by pattern/regex across the entire codebase in a single operation.
- Enumerating + reading file by file (A) spends orders of magnitude more tokens and time.
- Built-in tool selection rule: **Grep** to search content, **Glob** to search by file name/pattern, **Read** to read a specific known file.` },

  { type:"mc",
    question:`Claude Code's Edit tool fails because the string to replace appears 3 times in the file. What is the correct recovery?`,
    options:[
      `Retry the same call.`,
      `Use Read to load the file, identify unique context around the intended occurrence, and retry Edit with that expanded context.`,
      `Delete the file and rewrite it from scratch.`,
      `Switch to another model.`],
    correct:1,
    answer:`Edit requires the string to replace to be **unique** in the file.
- On ambiguity: **Read** → find surrounding lines that make the target occurrence unique → retry **Edit** including that context.
- Retrying as-is (A) fails deterministically; rewriting everything (C) is disproportionate and risky.` },

  { type:"open",
    question:`List the characteristics of a well-designed tool for an agent (interface, documentation, errors).`,
    answer:`- **Descriptive, unambiguous name**: reflects the action and the domain (search_retail_customers, not search2).
- **Complete description**: what it does, **when to use it and when not to**, scope limits — it is the model's primary selection driver.
- **Strict input schema**: types, formats (ISO 8601, enums), required fields, with **valid and invalid examples**.
- **Predictable, structured output**: same shape every time; separate content from metadata.
- **Structured errors**: failure type, errorCategory, **isRetryable**, what was attempted, suggested alternatives; distinguish "legitimately empty" from "access failure" (is_error).
- **Controlled response size**: pagination/limits to avoid flooding the context.
- **Idempotency** where possible, and handler-side validation (do not rely on the model alone).` },

  { type:"vf",
    question:`An MCP server can expose reusable prompt templates in addition to tools and data.`,
    correct:"V",
    answer:`**True.** MCP's **prompts** primitive lets the server publish parameterizable templates (e.g. "review PR", "summarize incident") that the client presents to the user and executes with arguments.
It complements **tools** (actions) and **resources** (data).` },

  { type:"mc",
    question:`A multi-tool workflow chains results: search_games returns matches, then get_game_details fetches one of them. Passing game titles as free-text strings between tools causes frequent lookup failures. What is the fix?`,
    options:[
      `Fuzzy matching on the backend.`,
      `Return and pass explicit machine identifiers (game_id) between tools instead of ambiguous display strings; text is for humans, IDs are for chaining.`,
      `Uppercase all titles before passing them.`,
      `Merge both tools into one.`],
    correct:1,
    answer:`**Machine identifiers over display strings** for tool chaining:
- The first tool returns each result with a stable **ID** (game_id, document_id, citation_id); downstream tools accept the ID.
- Free-text names are ambiguous (typos, duplicates, formatting variants) and break the chain unpredictably.
- Same pattern for citations in research pipelines: a persistent **citation_id** assigned at the earliest stage keeps attribution intact through every handoff.` },

  { type:"mc",
    question:`A tool takes a "category" parameter, and the model keeps inventing values the backend does not recognize ("tech support", "technical", "IT help"). What schema feature fixes this?`,
    options:[
      `A longer description asking for care.`,
      `An enum constraint listing the exact allowed values, so natural-language variants are forced onto the strict backend vocabulary.`,
      `Accepting any string and normalizing later.`,
      `Making the parameter optional.`],
    correct:1,
    answer:`**Enums** bound the parameter to the exact backend vocabulary:
- \`"category": {"type": "string", "enum": ["technical", "billing", "account"]}\` — the model must map the user's phrasing onto one of the allowed values.
- The mapping becomes **deterministic at the schema level** instead of hoping post-hoc normalization catches every variant.
- General rule: encode constraints in the **schema** (types, enums, patterns) whenever possible; prose descriptions are the fallback.` },

  { type:"mc",
    question:`A search tool can return thousands of matches, flooding the agent's context. How should the tool's response be designed?`,
    options:[
      `Always return everything: completeness first.`,
      `Return the first page plus a total count and a cursor, letting the agent explicitly request more pages only when needed.`,
      `Return a random sample of 10.`,
      `Fail when there are more than 100 matches.`],
    correct:1,
    answer:`**Pagination with explicit signals**:
- First page of results + **total_count** + **next_cursor**.
- The agent knows how much exists and can decide whether to fetch more — most tasks need only the first page.
- Dumping everything burns context and buries the relevant items; a blind sample (C) hides the size of the result space from the agent.` },

  { type:"mc",
    question:`An MCP server from a third-party vendor labels its tools with readOnlyHint annotations. Your security team asks whether agents can safely auto-approve those tools. What is the correct position?`,
    options:[
      `Yes — readOnlyHint guarantees the tool has no side effects.`,
      `MCP annotations (readOnlyHint, destructiveHint) are self-reported, untrusted metadata; access control must be based on your trust in the vendor and your own permission rules, not on the labels.`,
      `Yes, if the server uses HTTPS.`,
      `No tool can ever be auto-approved.`],
    correct:1,
    answer:`**Annotations are hints, not guarantees**: the server itself declares them, and a malicious or buggy server can mislabel a destructive tool as read-only.
- Base auto-approval on **vendor trust + your own permission configuration** (allow/deny rules, human confirmation for sensitive operations).
- This is the principle of least privilege applied to MCP: grant capabilities according to what you can verify, not what the counterpart claims.` },

  { type:"mc",
    question:`Where should transient failures (network timeouts) of a tool's backend be retried: inside the tool handler, or by the agent?`,
    options:[
      `Always by the agent, so it stays informed.`,
      `Transient errors should be retried automatically inside the tool handler (with backoff); only errors the agent can act on — like validation failures with specifics — should be returned to it.`,
      `Neither: fail immediately.`,
      `Both should retry simultaneously.`],
    correct:1,
    answer:`Split error handling by **who can fix it**:
- **Transient technical errors** (timeouts, connection resets): retry **inside the tool** — the agent gains nothing from seeing them, and each surfaced retry wastes tokens and turns.
- **Actionable errors** (invalid input, policy block): return to the agent **with specifics** so it can correct the call or change strategy.
- This keeps agent turns for decisions, not plumbing.` },

  { type:"mc",
    question:`An agent platform exposes 50+ connector tools to every request, and tool-selection accuracy is degrading. What is the recommended pattern?`,
    options:[
      `Alphabetize the tool list.`,
      `Dynamic tool scoping: expose a small search/discovery tool and inject only the relevant connectors for each request, instead of presenting all 50+ at once.`,
      `Ask the model to read the list twice.`,
      `Duplicate the important tools so they appear more often.`],
    correct:1,
    answer:`Tool-selection quality **degrades as the tool count grows** — dozens of similar definitions dilute the decision and burn context.
- **Dynamic scoping**: a discovery step (search over the tool catalog) determines which handful of connectors this request needs; only those are injected.
- Same principle as agent design: the model should see the **minimal set** relevant to the task at hand.` },
]},

/* ============ DOMAIN 3: CLAUDE CODE (20%) ============ */,

{ id:"code", name:"💻 Claude Code (20%)", questions:[
  { type:"mc",
    question:`Your team wants EVERYONE to use the same coding conventions when working with Claude Code in the repo. Where does that configuration go?`,
    options:[
      `In each developer's ~/.claude/CLAUDE.md.`,
      `In the project's CLAUDE.md, versioned in the repo.`,
      `In a message each person types at the start of a session.`,
      `In an external wiki.`],
    correct:1,
    answer:`**Team** standards live in the **project's CLAUDE.md** (repo root, committed): everyone receives it automatically via git.
- **~/.claude/CLAUDE.md** is **personal** (applies to all your projects, never shared) — it is for individual preferences, not team standards.
- Memory hierarchy: Enterprise (org) → Project (repo) → User (personal). More specific levels take precedence.` },

  { type:"vf",
    question:`CLAUDE.local.md is the right file for sharing conventions with the team, because it gets committed to the repo.`,
    correct:"F",
    answer:`**False.** **CLAUDE.local.md** is for **personal project-level** preferences and is designed NOT to be committed (it goes in .gitignore).
- To share with the team: **CLAUDE.md** (versioned).
- For personal global settings: **~/.claude/CLAUDE.md**.` },

  { type:"mc",
    question:`A monorepo's CLAUDE.md has grown so large that it injects irrelevant context into every session (frontend rules while you work on backend, etc.). What is the best reorganization?`,
    options:[
      `Delete half the content.`,
      `Modularize into .claude/rules/ with per-topic files and YAML frontmatter containing path globs, so each rule activates only when working on matching files.`,
      `Duplicate the CLAUDE.md into every subfolder.`,
      `Move everything into the system prompt via a flag.`],
    correct:1,
    answer:`**Modular rules with path scoping**: files in **.claude/rules/** with frontmatter declaring which **globs** each one applies to (e.g. \`src/frontend/**\`).
- The rule **activates automatically** only when matching files are touched → less irrelevant context, no manual invocation.
- Complements: per-subdirectory CLAUDE.md files (loaded when working in that area) and **@imports** for shared bases.` },

  { type:"mc",
    question:`In a monorepo with several packages, you want a common base of conventions plus package-specific rules. How do you structure it?`,
    options:[
      `A single giant CLAUDE.md at the root.`,
      `The root CLAUDE.md imports the shared conventions with @path/to/file, and each package has its own CLAUDE.md with local rules.`,
      `Copy and paste the common base into every package.`,
      `Verbal-only rules during onboarding.`],
    correct:1,
    answer:`**@imports + hierarchy**:
- The root CLAUDE.md uses **@path/to/file** to import the shared base (a single source of truth, no duplication).
- Each package adds its own **local CLAUDE.md** with specific rules, loaded when working in that package.
- Copy/paste (C) inevitably drifts out of sync.` },

  { type:"mc",
    question:`You created a PR review prompt that the whole team should be able to run as /review-pr. Where do you store it?`,
    options:[
      `In ~/.claude/commands/ on your machine.`,
      `In .claude/commands/ inside the repo, so it is versioned and shared with the team.`,
      `In a private gist.`,
      `In the terminal history.`],
    correct:1,
    answer:`**Project slash commands** live in **.claude/commands/** (markdown files): they are versioned with git and become available to the whole team automatically.
- **~/.claude/commands/** defines **personal** commands (all your projects, only you).
- The .md content is the prompt; it supports **$ARGUMENTS** to receive parameters and frontmatter for metadata.` },

  { type:"mc",
    question:`How does a custom Claude Code slash command receive parameters?`,
    options:[
      `They cannot receive parameters.`,
      `Via the $ARGUMENTS placeholder in the command's markdown file (or $1, $2… for positional ones).`,
      `Through environment variables.`,
      `By editing the file before each use.`],
    correct:1,
    answer:`The text following the command arrives via **$ARGUMENTS**: \`/fix-issue 123\` replaces $ARGUMENTS with "123" in the command's prompt.
There are also **$1, $2, …** for positional arguments. The .md frontmatter lets you declare description, allowed-tools, etc.` },

  { type:"mc",
    question:`You are about to tackle a large migration that admits several valid approaches and touches half the codebase. How do you start in Claude Code?`,
    options:[
      `Direct execution: have it start editing right away.`,
      `Plan mode: explore the codebase and agree on the implementation plan before touching any file.`,
      `Ask it to do "whatever it thinks best".`,
      `Split it into 50 one-file sessions.`],
    correct:1,
    answer:`**Plan mode** is for **architectural** changes: large scope, multiple valid approaches, design decisions.
- The model explores in read-only mode, proposes a plan, and you approve it **before** any edit.
- It avoids discovering halfway through that the approach was wrong, with half the repo already edited.` },

  { type:"mc",
    question:`A typo needs fixing in an error message, in a known file. Is plan mode appropriate?`,
    options:[
      `Yes, planning is always appropriate.`,
      `No: for targeted, scoped fixes in a known location, direct execution is appropriate; plan mode adds friction without value.`,
      `Yes, because typos can be a symptom of bigger problems.`,
      `You cannot edit without plan mode.`],
    correct:1,
    answer:`**Direct execution** for **clear, scoped** changes: one location, known fix, no design decisions.
- Plan mode shines for architectural work; for a typo it only adds steps.
- Exam criterion: match the ceremony to the risk/ambiguity of the change, rather than always applying the maximum process.` },

  { type:"mc",
    question:`Exploring a huge codebase to understand its structure fills the main session's context with search results. What mechanism avoids this?`,
    options:[
      `Run the searches more slowly.`,
      `Delegate discovery to a subagent (e.g. Explore): it explores in its own context and returns only the conclusions to the main session.`,
      `Increase the context window.`,
      `Start a new session every 10 minutes.`],
    correct:1,
    answer:`**Subagents** run with their **own context**: the verbose work (massive greps, reading dozens of files) stays isolated, and **only the synthesis** returns to the main session.
- The main session preserves its context for the underlying work.
- Claude Code ships subagents such as **Explore**, and you can define custom subagents in **.claude/agents/**.` },

  { type:"mc",
    question:`Claude Code generates commit messages with inconsistent formatting despite the prose instructions in CLAUDE.md. Which technique solves this best?`,
    options:[
      `Write the instruction in bold.`,
      `Add 2-3 concrete examples of correct commits (few-shot) showing the exact expected format.`,
      `Regenerate each commit until it comes out right.`,
      `Ban commits.`],
    correct:1,
    answer:`For **format consistency** problems, **concrete examples** beat prose specification:
- 2-4 examples showing the exact structure are worth more than paragraphs of description.
- The model imitates patterns far more faithfully than it follows abstract rules.
- This applies equally to API prompts (Domain 4) and to CLAUDE.md.` },

  { type:"mc",
    question:`You ask Claude Code to implement a feature with vague requirements in an architecture it does not know well. Which pattern improves the outcome?`,
    options:[
      `Have it start coding and correct itself along the way.`,
      `Interview pattern: ask it to first ask you questions about requirements, constraints, and system patterns before implementing.`,
      `Give it a single attempt to force focus.`,
      `Write the code yourself and ask it for approval.`],
    correct:1,
    answer:`The **interview pattern**: the model asks before implementing — it clarifies ambiguous requirements, surveys the architecture's constraints and patterns, and surfaces design considerations **before** writing code.
- Especially valuable with vague requirements or unfamiliar architectures.
- Cheap: a few questions cost less than an entire misdirected implementation.` },

  { type:"mc",
    question:`A review found 6 issues: 2 affect each other (changing one impacts the other) and 4 are independent. How do you iterate the fixes?`,
    options:[
      `Everything together in a single pass.`,
      `The 2 that interact are fixed together (as a batch); the 4 independent ones are iterated one at a time, verifying each fix before the next.`,
      `All 6 one at a time, no exceptions.`,
      `Only the 4 easy ones.`],
    correct:1,
    answer:`Iterative refinement rule:
- **Interacting** issues → **batch**: fixing them separately generates conflicts and rework.
- **Independent** issues → **sequential**: one fix at a time, **verified** before moving on — if something breaks, you know exactly which change caused it.
- Everything at once (A) mixes effects and makes it impossible to isolate regressions.` },

  { type:"mc",
    question:`Which flag runs Claude Code in non-interactive (headless) mode for a CI pipeline?`,
    options:[`--batch`,`-p / --print`,`--silent`,`--ci`],
    correct:1,
    answer:`The **-p** (--print) flag runs Claude Code in **headless** mode: it executes the prompt, prints the result, and exits — no interactive session.
- It is the documented way to integrate it into **CI/CD** (GitHub Actions, etc.).
- It combines with **--output-format json** (or stream-json) for output the pipeline can parse.` },

  { type:"mc",
    question:`In CI you want Claude Code's automated review to produce parseable findings (file, line, comment) so they can be posted as PR comments. How?`,
    options:[
      `Parse the response prose with regex.`,
      `Use --output-format json and a JSON schema that defines the structure of the findings.`,
      `Ask for "a tidy response" in the prompt.`,
      `Capture terminal screenshots.`],
    correct:1,
    answer:`**--output-format json** (+ a schema for the expected structure) produces **structured, parseable** output: a list of findings with file/line/severity/comment.
- The pipeline consumes it directly, without fragile regexes over prose.
- Same principle as Domain 4: when output feeds software, structure is enforced — free text is not parsed.` },

  { type:"mc",
    question:`The automated CI reviewer suggests tests that already exist and changes that violate repo conventions. What is missing?`,
    options:[
      `A larger model.`,
      `Context in CLAUDE.md: document the repo's standards and the location/coverage of existing tests so the reviewer knows them.`,
      `More execution time.`,
      `Reviewing only new files.`],
    correct:1,
    answer:`The reviewer cannot respect conventions it **does not know**. **CLAUDE.md** is the channel for providing them:
- The repo's standards and conventions.
- Where the tests live and what they cover (avoids suggesting duplicates).
- Architecture decisions already made (avoids relitigating them on every PR).
In headless mode, CLAUDE.md loads just as in interactive mode: it is the project's persistent memory.` },

  { type:"mc",
    question:`Which Claude Code hook event runs BEFORE each tool execution and can block it?`,
    options:[`PostToolUse`,`PreToolUse`,`Stop`,`SessionStart`],
    correct:1,
    answer:`**PreToolUse**: runs before the tool executes; its exit code/output can **allow, block, or request confirmation**.
Other useful events:
- **PostToolUse**: after execution (validate/transform results, run formatters).
- **UserPromptSubmit**: when the user submits a prompt.
- **Stop / SubagentStop**: when the agent/subagent finishes responding.
- **SessionStart / PreCompact / Notification**: session start, before compaction, notifications.` },

  { type:"vf",
    question:`Claude Code hooks are suggestions that the model may decide to ignore if its reasoning justifies it.`,
    correct:"F",
    answer:`**False.** Hooks are **shell commands executed by the harness**, not instructions to the model:
- They run **deterministically** on the configured event (PreToolUse, PostToolUse, etc.).
- The model cannot ignore or skip them — which is why they are the correct mechanism for hard policies (blocking dangerous commands, formatting after every edit, validating before commit).
- Prompt = probabilistic; hook = guaranteed.` },

  { type:"mc",
    question:`You want Claude Code to NEVER be able to read the project's .env file or run "rm -rf". Where is this configured?`,
    options:[
      `In CLAUDE.md, with a clear warning.`,
      `In settings.json with deny permission rules (e.g. Read(.env), Bash(rm -rf*)).`,
      `By renaming the .env.`,
      `By trusting the model's judgment.`],
    correct:1,
    answer:`**Permissions** in **settings.json** (permissions allow/deny) are harness-level enforcement:
- **deny** on \`Read(.env)\` or dangerous Bash patterns blocks the action **always**, regardless of what the model decides.
- CLAUDE.md (A) is context/instruction: it influences but does not guarantee.
- Settings hierarchy: enterprise (managed) > project local (.claude/settings.local.json) > project (.claude/settings.json, versioned) > user (~/.claude/settings.json).` },

  { type:"open",
    question:`Describe Claude Code's memory file hierarchy (CLAUDE.md): the levels, what each is for, and which one is shared with the team.`,
    answer:`From broadest scope to narrowest:
- **Enterprise policy**: managed by the organization, applies to every user in the company (deployed by IT, not user-editable).
- **User (~/.claude/CLAUDE.md)**: **personal** preferences that apply to all your projects; never shared.
- **Project (CLAUDE.md in the repo)**: the **team's** conventions and context; committed and shared via git — this is where shared standards go.
- **CLAUDE.local.md**: personal notes for this project; goes in .gitignore.

Complements:
- **@imports** (\`@path/file\`) to compose files and avoid duplication.
- **Per-subdirectory CLAUDE.md** in monorepos: loaded when working in that area.
- **.claude/rules/** with path globs for automatically activated, finely scoped rules.
- More specific levels take precedence over general ones.` },

  { type:"open",
    question:`Explain how you would integrate Claude Code into a CI/CD pipeline for automated PR review: flags, output format, context, and false-positive control.`,
    answer:`- **Headless execution**: \`claude -p "<review prompt>"\` in the CI job (GitHub Actions or other).
- **Structured output**: \`--output-format json\` with a findings schema (file, line, severity, comment) so the pipeline can post them as PR comments without parsing prose.
- **Repo context in CLAUDE.md**: standards, conventions, location of existing tests — avoids duplicate suggestions or ones that contradict the conventions.
- **Explicit review criteria** in the prompt: which patterns to flag and which to exclude, with examples (false-positive control, Domain 4).
- **Minimal permissions**: settings with deny for writes/commands; the review is read-only.
- **Budget**: time/token limits for the job; a blocking review must be fast (the Batch API is unsuitable for blocking checks: it is asynchronous).
- **Verification**: treat findings as candidates; optionally a second pass that verifies them to reduce noise.` },

  { type:"mc",
    question:`Some guidance for Claude Code should apply on every request (coding conventions), while other guidance is a multi-step procedure needed only for specific tasks (a release checklist). How should each be stored?`,
    options:[
      `Everything in CLAUDE.md: one file is simpler.`,
      `Always-relevant conventions go in CLAUDE.md (loaded every session); task-specific procedures go in skills/slash commands, loaded only when that task comes up.`,
      `Everything as slash commands.`,
      `Both in settings.json.`],
    correct:1,
    answer:`Match the mechanism to the activation pattern:
- **CLAUDE.md** = **always-on** context: conventions, architecture notes, standards that should shape every session. It costs context on every request — keep it lean.
- **Skills / slash commands** = **on-demand** instructions: multi-step procedures (release, incident review) that load only when invoked or relevant.
- Stuffing procedures into CLAUDE.md burns context on every unrelated request; hiding conventions in commands means they are usually absent.` },

  { type:"mc",
    question:`A long Claude Code session is approaching its context limit mid-task. What are the two main options, and when does each apply?`,
    options:[
      `Restart the terminal vs reinstall Claude Code.`,
      `/compact (summarize the session in place, keeping continuity) when the task is ongoing; a fresh session (optionally seeded with a checkpoint of decisions/state) when starting distinct work or when accumulated context is mostly irrelevant.`,
      `Always /compact — fresh sessions lose everything.`,
      `Always a fresh session — /compact is deprecated.`],
    correct:1,
    answer:`Two tools, two situations:
- **/compact**: compresses the history into a summary and continues — right choice **mid-task**, where continuity matters and recent context is still relevant.
- **Fresh session**: right choice for **new, distinct work** — no summarization noise, clean start. For long-running work, extract a **structured checkpoint** (decisions made, files touched, pending items) and inject it into the new session.
- Compaction is lossy: precise details can degrade — critical facts belong in files (or the checkpoint), not only in conversation history.` },
]},

{ id:"prompt", name:"✍️ Prompt Engineering (20%)", questions:[
  { type:"mc",
    question:`An automated code reviewer reports too many false positives: it flags patterns the team considers acceptable. What is the most effective prompt fix?`,
    options:[
      `Add "be less strict".`,
      `Define explicit criteria: which patterns constitute a finding and which are accepted practice, with concrete examples of each side.`,
      `Reduce the maximum number of allowed findings.`,
      `Run the review twice and report the intersection.`],
    correct:1,
    answer:`False positives are fought with **explicit criteria + examples from both sides of the boundary**:
- "This IS a finding: [example]. This is NOT: [example], because…"
- Vague instructions ("be reasonable", "use your judgment") produce inconsistent boundaries.
- Capping the count (C) or intersecting (D) hides the problem instead of defining the correct boundary.` },

  { type:"mc",
    question:`An extractor must flag "magic numbers" in code, but it also reports HTTP status codes (200, 404). How do you fix it?`,
    options:[
      `Ban all numbers from the report.`,
      `Explicit inclusion AND exclusion rules: exactly what to flag and what to exclude ("do not flag standard HTTP status codes"), instead of "use your judgment".`,
      `Switch models.`,
      `Post-process by filtering out the known numbers.`],
    correct:1,
    answer:`Precision requires **both lists**: inclusion (what to flag) and **exclusion** (what NOT to flag, with the edge cases named).
- "Do not flag standard HTTP codes (200, 404, 500…), conventional ports, 0/1/-1" eliminates the entire class of false positives.
- Post-processing (D) patches symptoms: the exception list always gets away from you; better for the model to understand the boundary.` },

  { type:"mc",
    question:`A documentation generator produces inconsistent results: sometimes it documents private functions, sometimes with too much detail. What is the prompt missing?`,
    options:[
      `More output tokens.`,
      `Criteria with defined scope: WHAT to document (public API only), FOR WHICH elements, and at WHAT level of detail.`,
      `A more formal tone.`,
      `Running it at temperature 0.`],
    correct:1,
    answer:`Consistency requires **explicit scope along three axes**:
- **What**: public API only (exclude private helpers).
- **For which items**: exported functions, public classes…
- **Level of detail**: e.g. a one-line summary + parameters + example.
Without a defined scope, each run "decides" differently. Temperature 0 (D) does not fix missing criteria: it makes the arbitrary consistently arbitrary.` },

  { type:"mc",
    question:`You need generated bug reports to ALWAYS follow the same structure (file, line, description, proposed fix). What is the most effective technique?`,
    options:[
      `Describe the structure in detailed prose.`,
      `Include 2-4 few-shot examples showing exactly the desired structure.`,
      `Ask it to "be consistent".`,
      `Generate and reformat with a second prompt.`],
    correct:1,
    answer:`**Few-shot with 2-4 examples** is the most powerful tool for **format consistency**:
- The model imitates the structure it is shown more faithfully than one that is described.
- Examples should be **diverse** (covering variants) and **exact** (the format you show is the format you get).
- For a hard structural guarantee, combine with tool use + JSON schema (structured output).` },

  { type:"mc",
    question:`A ticket classifier works well on clear cases but fails on ambiguous ones (is "I can't pay" billing or technical?). How do you improve it?`,
    options:[
      `Remove the ambiguous categories.`,
      `Add few-shot examples of the edge cases, showing the reasoning for why they are classified the way they are.`,
      `Let it pick two categories.`,
      `Raise the temperature for more creativity.`],
    correct:1,
    answer:`Easy cases need no help: the valuable examples are the **edge cases** with their **reasoning**:
- "'I can't pay because the button doesn't respond' → technical, because the root cause is the UI, not billing."
- Showing the why gives the model the **decision rule**, not just the mapping.
- General few-shot rule: invest examples where the model gets it wrong, not where it gets it right.` },

  { type:"mc",
    question:`An extractor performs well on tabular documents but fails on prose documents. Which adjustment targets the cause?`,
    options:[
      `Convert all prose to tables before extracting.`,
      `Add few-shot examples specifically for extraction from prose documents.`,
      `Double the number of tabular-document examples.`,
      `Shorten the documents.`],
    correct:1,
    answer:`The gap is **specific to the prose format** → the examples must cover **that** format:
- A "prose document → extracted JSON" example teaches how to locate fields in running text.
- More examples of the format that already works (C) do not transfer to the format that fails.
- Principle: few-shot examples must be **representative of the real input distribution**, including the hard cases.` },

  { type:"mc",
    question:`A pipeline generates JSON that sometimes contains syntax errors (trailing commas, unclosed quotes), breaking the parser. What is the fundamental solution?`,
    options:[
      `A more tolerant JSON parser.`,
      `Structured output via tool use with a JSON schema: the response conforms to the schema by construction, eliminating syntax errors.`,
      `Asking for "valid JSON please" in all caps.`,
      `Retrying until it parses.`],
    correct:1,
    answer:`**Tool use with a JSON schema**: you define a tool whose input schema is your target structure and force its use (**tool_choice**) → the model generates **within the schema**, with structural validation.
- Eliminates by construction the whole class of free-text syntax errors.
- Tolerant parsers (A) and retries (D) treat symptoms and eventually fail.
- Exam rule: if the output feeds software, **force structure**; do not parse prose.` },

  { type:"mc",
    question:`You have several extraction tools and need to guarantee that the model calls SOME tool (never replies with free text), but that it chooses which one based on the document. What do you configure?`,
    options:[
      `tool_choice: {"type": "auto"}`,
      `tool_choice: {"type": "any"}`,
      `tool_choice: {"type": "none"}`,
      `An insistent system prompt.`],
    correct:1,
    answer:`**tool_choice: {"type": "any"}** = required to call a tool, with the freedom to choose which one.
- "auto" would allow a text response without a tool (what you want to avoid).
- {"type":"tool","name":...} would force **a specific one** (here you want it to choose based on the document).
- The scale: none < auto < any < tool — from least to most restrictive.` },

  { type:"mc",
    question:`An invoice extractor produces totals that don't match the line items (arithmetic validation fails). What is the best retry loop?`,
    options:[
      `Retry the exact same request.`,
      `Retry attaching the failed extraction, the specific validation error, and the original document, so the model can correct its own mistake.`,
      `Lower the temperature and pray.`,
      `Accept the result and fix the total by hand.`],
    correct:1,
    answer:`An effective retry **teaches**: you resend with
- the **failed extraction** (what it produced),
- the **specific error** ("the line items sum to 1,520.50 but the extracted total is 1,250.50"),
- the **original document**.
The model can then locate and correct its error. Retrying identically (A) usually repeats the same failure: nothing changed in the input.` },

  { type:"mc",
    question:`You want to systematically analyze a detector's false positives in order to improve it. What field do you add to the output schema?`,
    options:[
      `A timestamp.`,
      `detected_pattern: the exact code fragment/construct that triggered the finding.`,
      `The model name.`,
      `A random ID.`],
    correct:1,
    answer:`**detected_pattern** records **what the model saw** when flagging:
- With the false positives in hand, you group by triggering pattern and discover the systematic error classes (e.g. "it flags all HTTP codes").
- Each class found becomes an **exclusion rule** in the prompt.
- It is instrumentation for iterative improvement: without knowing the why behind each finding, debugging is guesswork.` },

  { type:"mc",
    question:`A pipeline retries the extraction of the "tax_id" field 3 times and always fails. Looking at the document, the field does not exist (it is in an annex that was not included). What is the pipeline missing?`,
    options:[
      `More retries.`,
      `Validating the PRESENCE of the data before retrying: if the field is not in the document, no retry will find it; the right move is to mark it as absent/escalate.`,
      `A more powerful model.`,
      `Increasing max_tokens.`],
    correct:1,
    answer:`Retries only help with **model errors**, not with **missing data**:
- Before retrying, verify that the data exists in the source.
- If it does not exist: record "not present" (or escalate to retrieving the annex) — any extracted value would be **fabricated**.
- The schema should allow null/"not_found" so the model can honestly say "it's not there".` },

  { type:"mc",
    question:`You need to classify 50,000 historical documents with no rush (the result will be used next week). Which API is the right fit and why?`,
    options:[
      `Standard Messages API, in a sequential loop.`,
      `Message Batches API: 50% token discount, asynchronous processing ideal for latency-tolerant jobs.`,
      `Streaming API to watch it progress.`,
      `50,000 simultaneous parallel requests.`],
    correct:1,
    answer:`The **Message Batches API**:
- **50% discount** off the standard token price.
- Asynchronous: you submit the batch and collect results when they finish (most within 1 hour, guaranteed within 24 h).
- Perfect for: backfills, bulk classification, evaluations — anything latency-tolerant.
- **Not** suitable for blocking flows (a PR check that gates the merge cannot wait hours).` },

  { type:"vf",
    question:`The Message Batches API is a good choice for an automated check that blocks the merge of every pull request.`,
    correct:"F",
    answer:`**False.** The Batch API is **asynchronous** (results guaranteed within up to 24 h; usually under 1 h): unacceptable for a **blocking** check where the developer is waiting.
- PR checks → standard Messages API (seconds).
- Batch → latency-tolerant jobs (backfills, nightly analyses) with 50% savings.
The exam loves this trade-off: latency vs cost.` },

  { type:"mc",
    question:`In a batch of 10,000 documents, 200 failed. Which Batch API field lets you identify and reprocess ONLY those 200?`,
    options:[
      `The order index of the responses.`,
      `custom_id: the identifier you assigned to each request correlates each result with its document; you resubmit only the failed ones.`,
      `The batch's global request_id.`,
      `You can't: everything must be reprocessed.`],
    correct:1,
    answer:`**custom_id** is your per-request correlation key:
- Batch results **do not guarantee order**: custom_id is the only reliable result↔document mapping.
- Partial-failure recovery: filter the custom_ids with errors and resubmit **only those** in a new batch.
- Reprocessing everything (D) doubles the cost of the 9,800 that already came out fine.` },

  { type:"mc",
    question:`A code review that evaluates 10 aspects in a single pass produces inconsistent results: sometimes it goes deep on security, sometimes on style. What structure improves consistency?`,
    options:[
      `A longer prompt enumerating the 10 aspects.`,
      `Multiple focused passes: e.g. one per-file local-analysis pass and another cross-file integration pass (or one pass per dimension).`,
      `Asking it to "be thorough".`,
      `Doubling max_tokens.`],
    correct:1,
    answer:`**Multi-pass with focus**: each pass addresses one dimension (or level: local vs integration).
- A single prompt with 10 objectives **dilutes attention**: the model prioritizes differently on each run → inconsistency.
- Focused passes are more consistent and deeper per dimension, at the cost of more calls.
- It is prompt chaining applied to review (Domains 1 and 4 intersect here).` },

  { type:"vf",
    question:`Wrapping prompt sections in XML tags (<document>, <instructions>, <example>) helps Claude distinguish the parts of the prompt and improves reliability.`,
    correct:"V",
    answer:`**True.** **XML tags** are Anthropic's recommended technique for structuring prompts:
- They unambiguously separate instructions, data, examples, and context ("is this part of the document or an instruction?").
- They allow referencing sections ("using the <contract>…").
- They combine well with everything else: few-shot inside <example>, long documents in <document> at the start of the prompt.` },

  { type:"mc",
    question:`You want the response to start directly with the JSON, without a preamble like "Here is the analysis:". Without using tools, what technique achieves this?`,
    options:[
      `Asking it to "add no preamble".`,
      `Prefill: starting the assistant turn with "{" to force it to continue from there.`,
      `Raising the temperature.`,
      `Placing the request at the end of the prompt.`],
    correct:1,
    answer:`**Prefilling the assistant's response**: you send the beginning of the assistant turn (e.g. \`{\`) and the model **continues from that point** — the preamble becomes structurally impossible.
- Also useful for enforcing formats, staying in character, or continuing truncated outputs.
- Note: for JSON with strong guarantees, tool use + schema remains the most robust option; prefill is the lightweight tool-free technique.` },

  { type:"vf",
    question:`Asking the model to reason step by step (chain-of-thought) reduces the latency and cost of each request.`,
    correct:"F",
    answer:`**False.** Chain-of-thought **increases** output tokens → more latency and cost.
- What it improves is **accuracy on complex tasks** (multi-step reasoning, math, analysis).
- It is a trade-off: use it where the difficulty warrants it; for trivial tasks it is pure overhead.
- Tip: request the reasoning in a tag (<thinking>) separate from the final answer (<answer>) so you can discard it in post-processing.` },

  { type:"open",
    question:`Design the prompting approach for a high-precision invoice data extraction pipeline. Which techniques do you combine and why?`,
    answer:`- **Structured output via tool use + JSON schema**, with **tool_choice** forced: eliminates syntax errors and guarantees the shape (fields, types, enums).
- **Explicit inclusion/exclusion criteria**: what each field is, formats (ISO dates, amounts with decimals), what NOT to extract; edge cases named.
- **Few-shot**: 2-4 examples covering the real input formats (tables AND prose), including an example with a **missing field → null** to teach honesty.
- **A schema that allows absence**: null / "not_found" so the model does not fabricate nonexistent data.
- **Programmatic post-extraction validation**: arithmetic (line items vs total), formats, ranges.
- **Retry with feedback**: on validation failure, resend the failed extraction + the specific error + the document; **before retrying, verify the data exists** in the source.
- **Instrumentation**: fields like detected_pattern/confidence to analyze systematic errors.
- **Batch API** if the volume is massive and latency-tolerant (50% savings), with **custom_id** for partial recovery.` },

  { type:"vf",
    question:`For a deterministic extraction task, a high temperature is advisable so the model explores more possibilities.`,
    correct:"F",
    answer:`**False.** High temperature = more randomness → the enemy of deterministic extraction.
- Analytical/extractive/classification tasks: **low temperature (~0)** for maximum consistency.
- High temperature is reserved for **creative** tasks (brainstorming, copy variants).
- Rule: adjust temperature to the task type, and never tune it together with top_p at the same time.` },

  { type:"vf",
    question:`Forcing structured output via tool use with a JSON schema guarantees that the extracted values are factually correct.`,
    correct:"F",
    answer:`**False.** Tool use with a schema guarantees **syntactic** correctness — valid JSON, right field names and types — **by construction**.
- It does NOT guarantee **semantic** correctness: the model can still put a wrong value in a perfectly valid field.
- That is why structured output is paired with **programmatic validation** (arithmetic checks, range checks, cross-field consistency) and retry-with-feedback loops.
- Exam trap: "schema = correct data" is a distractor; schema = correct **shape**.` },

  { type:"mc",
    question:`Some documents legitimately lack certain fields (no tax ID on foreign invoices). How should the extraction schema handle this?`,
    options:[
      `Make every field required so nothing is missed.`,
      `Make legitimately-optional fields nullable, so the model can honestly report absence instead of being forced to fabricate a value.`,
      `Fill missing fields with "N/A" strings.`,
      `Skip documents with missing fields.`],
    correct:1,
    answer:`**Nullable/optional fields** are the honesty valve of an extraction schema:
- If a field is required, a document without it forces the model to choose between failing and **fabricating** — both bad.
- \`"tax_id": {"type": ["string", "null"]}\` lets the output state "not present" as data.
- Pair with an instruction and a few-shot example showing a null extraction, so the model knows absence is an acceptable answer.` },

  { type:"mc",
    question:`You are about to batch-process 80,000 documents with a new extraction prompt. What should happen first?`,
    options:[
      `Submit the full batch — the 50% discount makes failures cheap.`,
      `Refine the prompt against a small representative sample first, then submit the large batch once the prompt's first-pass accuracy is proven.`,
      `Split the batch into 80 batches of 1,000.`,
      `Raise max_tokens for safety.`],
    correct:1,
    answer:`**Pre-batch refinement on a representative sample**:
- Iterate on 50–200 representative documents (covering formats and edge cases) until accuracy is acceptable.
- Then scale to the full batch, where each prompt defect would otherwise be multiplied by 80,000 — discounted wasted tokens are still wasted, and reruns cost real time (batches can take up to 24 h).
- Sample selection matters: it must reflect the true distribution, including the ugly formats.` },

  { type:"mc",
    question:`An extraction pipeline reports 96% aggregate accuracy, and the team wants to automate fully. Why can this number be misleading, and what should be measured instead?`,
    options:[
      `96% is below any automation threshold.`,
      `Aggregate metrics can mask systematic failures in minority subsets (one document type failing badly); accuracy should be stratified by document type and by field before deciding what to automate.`,
      `Accuracy is not measurable for LLMs.`,
      `The metric only matters at 100%.`],
    correct:1,
    answer:`**Stratified metrics** reveal what the aggregate hides:
- 96% overall can coexist with 60% on one document type that is only 10% of volume — full automation would silently mangle that subset.
- Measure **per document type and per field**; automate the segments that clear the bar, route the weak segments to human review or targeted prompt work.
- This is the LLM version of a classic ML lesson: never ship on a single aggregate number.` },
]},

/* ============ DOMAIN 5: CONTEXT & RELIABILITY (15%) ============ */,

{ id:"context", name:"📚 Context & Reliability (15%)", questions:[
  { type:"mc",
    question:`What is the standard context window of current Claude models (generation 4 Sonnet/Opus/Haiku)?`,
    options:[
      `32,000 tokens`,
      `100,000 tokens`,
      `200,000 tokens`,
      `2,000,000 tokens`],
    correct:2,
    answer:`The standard window is **200,000 tokens** (roughly 500 pages of text).
- Some models (e.g. Sonnet 4/4.5) offer **1 million tokens** in beta via a specific header.
- The window includes EVERYTHING: system prompt, history, tool definitions, tool results, and the response in progress.` },

  { type:"mc",
    question:`With prompt caching, how much does reading cached tokens cost relative to the normal input price?`,
    options:[
      `The same.`,
      `50% of the price.`,
      `Approximately 10% of the price (90% discount).`,
      `It's free.`],
    correct:2,
    answer:`**Cache hits cost ~10%** of the normal input price (90% discount).
- **Writing** to the cache costs **25% more** than normal input (for the 5-minute TTL).
- With large, stable prefixes (system prompt + tools + documents), the net savings and latency improvement are enormous in repetitive workloads.` },

  { type:"mc",
    question:`What is the default TTL (time to live) of prompt caching, and what alternative exists?`,
    options:[
      `1 minute, with no alternatives.`,
      `5 minutes by default (renewed on each use); a 1-hour option exists at a higher write cost.`,
      `A fixed 24 hours.`,
      `The cache never expires.`],
    correct:1,
    answer:`- **Default TTL: 5 minutes**, and it is **rolling**: each hit renews the window.
- A **1-hour** option for more spaced-out traffic (higher write cost: 2x vs the 1.25x of the 5-minute one).
- Choose 1 h when the intervals between requests exceed 5 min (e.g. agent sessions with long human pauses).` },

  { type:"vf",
    question:`Writing to the prompt cache costs more than processing those same tokens as normal input.`,
    correct:"V",
    answer:`**True.** Cache writes carry a surcharge: **+25%** over the input price (5-min TTL) or **2x** (1-h TTL).
- The payoff is in the **reads**: each hit costs ~10% of normal input.
- Conclusion: caching pays off when the prefix is **reused** several times within the TTL; for one-off requests it is a loss.` },

  { type:"mc",
    question:`A developer enables prompt caching but the hit rate is 0%. Their system prompt includes a timestamp updated on every request. What is the problem?`,
    options:[
      `Caching requires an enterprise plan.`,
      `The cache requires an EXACTLY identical prefix: the timestamp changes on every request and invalidates the prefix from that point on.`,
      `System prompts cannot be cached.`,
      `The beta header is missing.`],
    correct:1,
    answer:`The cache matches by **exact prefix**: a single differing byte (the timestamp) invalidates everything from there onward.
- Golden rule: **stable content first, variable content last** — order: tools → system → history; dynamic content (date, user data) after the cache breakpoint.
- Also: the cacheable minimum is **1024 tokens** on most models, and breakpoints are marked with **cache_control** (up to 4).` },

  { type:"mc",
    question:`What is the minimum cacheable prefix size on most Claude models?`,
    options:[`128 tokens`,`512 tokens`,`1024 tokens`,`4096 tokens`],
    correct:2,
    answer:`The minimum is **1024 tokens** for most models (some smaller models like Haiku require 2048).
- Prefixes below the minimum are not cached even if you mark cache_control.
- Up to **4** cache breakpoints can be defined per request.` },

  { type:"mc",
    question:`A support agent conversation exceeds 100 interactions and is approaching the context limit. What is the standard strategy?`,
    options:[
      `Cut off the conversation and start from scratch without warning.`,
      `Compact: summarize the old part of the history preserving the key facts (customer data, decisions, state), and continue with the summary + the recent messages.`,
      `Increase max_tokens.`,
      `Delete the user's messages and keep only the assistant's.`],
    correct:1,
    answer:`**Compaction/summarization**: replace the old history with a **structured summary** that preserves the essentials (identity and verified data, decisions made, case state, open items) + keep the recent messages intact.
- Complements: external memory (a file/DB where the agent persists notes) and cleanup of old tool results.
- Starting from scratch (A) loses the state; the user would have to repeat everything.` },

  { type:"mc",
    question:`How do you estimate how many tokens a request will consume BEFORE sending it, at no cost?`,
    options:[
      `By counting characters and dividing by 4.`,
      `With the API's token counting endpoint (count_tokens), which is free.`,
      `By sending the request and looking at the bill.`,
      `It cannot be known in advance.`],
    correct:1,
    answer:`The **count_tokens** endpoint accepts the same structure as Messages (system, messages, tools) and returns the input token count **for free**.
- Use it to: decide whether compaction is needed, budget costs, validate that a document fits in the window.
- The characters/4 heuristic (A) is a rough approximation; the real count depends on the tokenizer.` },

  { type:"mc",
    question:`Your application receives 429 errors from the API during peak hours. What is the correct handling?`,
    options:[
      `Retry immediately in a tight loop until it passes.`,
      `Exponential backoff with jitter, honoring the retry-after header, and consider smoothing peaks (queues, spreading) or requesting a higher rate limit.`,
      `Ignore the errors and drop those requests.`,
      `Switch API keys on every 429.`],
    correct:1,
    answer:`**429 = rate limit exceeded**. Correct handling:
- **Exponential backoff + jitter** (immediate retries worsen the congestion).
- Honor the **retry-after** header if present.
- Structural: smooth peaks with queues, spread load, or request a limit increase.
- Rotating keys (D) violates the terms of use.` },

  { type:"mc",
    question:`What does an HTTP 529 error from the Anthropic API mean and how is it handled?`,
    options:[
      `Invalid API key; regenerate credentials.`,
      `The API is temporarily overloaded; it is transient: retry with backoff.`,
      `The prompt violated the content policy.`,
      `The request exceeds the context window.`],
    correct:1,
    answer:`**529 = overloaded**: temporary service overload (different from 429, which is YOUR rate limit).
- It is **transient** → retries with exponential backoff.
- Quick error reference: **400** invalid request · **401** authentication · **403** permissions · **413** request too large · **429** rate limit · **500** internal error · **529** overloaded.
- Reliable design: classify errors as retryable (429/500/529) vs non-retryable (400/401/403).` },

  { type:"mc",
    question:`An agent must answer questions about a multi-million-line codebase that does not fit in the context. What is the correct approach?`,
    options:[
      `Concatenate all the files until the window is full and truncate the rest.`,
      `Targeted retrieval: search (Grep/Glob/embeddings) and load ONLY the files relevant to the question, optionally with subagents exploring areas in parallel.`,
      `Ask the model to "imagine" the rest of the code.`,
      `Always summarize every file in the repo up front.`],
    correct:1,
    answer:`A large context ≠ stuffing everything in: **targeted retrieval**:
- **Search first** (Grep for symbols, Glob for structure, or embeddings/RAG), **load afterward** only what is relevant.
- **Subagents** to explore areas in parallel without burning the main context (each one returns a synthesis).
- Arbitrary truncation (A) very likely leaves out what matters; the "agentic search" approach is what Claude Code itself uses.` },

  { type:"vf",
    question:`In prompts with long documents, it is best to place the documents at the beginning of the prompt and the question/instructions at the end.`,
    correct:"V",
    answer:`**True.** This is Anthropic's guidance for long-context:
- **Long documents at the top** (ideally in XML tags like <document>), **question and instructions at the end**.
- With long inputs, placing the query at the end measurably improves response quality.
- Bonus: asking it to **quote relevant passages** before answering anchors the response in the actual text and reduces hallucination.` },

  { type:"mc",
    question:`In a report generated by a multi-agent system, the client asks "where did this figure come from?" and nobody can answer. What design principle was missing?`,
    options:[
      `More creativity in the synthesis.`,
      `Provenance: propagating origin metadata (source, URL, date, page) alongside each claim through the entire pipeline, and citing them in the final report.`,
      `A legal disclaimer.`,
      `Using a single agent.`],
    correct:1,
    answer:`**Information provenance**: every claim must be traceable to its source.
- Implementation: findings travel as {claim, source, url, date} structures in every handoff between agents; the final report **cites**.
- Without structured metadata, the first summary destroys the claim↔source link and the system becomes unauditable.
- Critical in regulated or client-facing domains.` },

  { type:"mc",
    question:`Which agent actions warrant mandatory human approval (human-in-the-loop) in production?`,
    options:[
      `All of them: every tool call must be approved by hand.`,
      `The irreversible or high-impact ones: deleting data, moving money, sending external communications, deploying to production.`,
      `None: mature agents need no supervision.`,
      `Only data reads.`],
    correct:1,
    answer:`The criterion is **irreversibility and impact**:
- Human approval for: deletions, transfers, outbound communications, production changes.
- Reversible, low-risk actions (reads, drafts, staging) can be autonomous — approving EVERYTHING (A) destroys the value of automation.
- Implementation: permissions/hooks that intercept the sensitive actions and request confirmation (not an instruction in the prompt).` },

  { type:"vf",
    question:`Since a model's results can vary between runs, it makes no sense to write automated tests for LLM-based systems.`,
    correct:"F",
    answer:`**False.** Variability demands **evaluations (evals)**, not resignation:
- **Case suites** with verifiable criteria (extraction accuracy, valid format, policy compliance).
- **Programmatic assertions** where there is objective truth (the JSON parses, the sum adds up, the field exists).
- **LLM-as-judge** with a rubric for subjective quality.
- Run the evals on every prompt/model change: it is the equivalent of regression tests in classic software.` },

  { type:"open",
    question:`Context management strategies for a long-running agent: name at least five concrete techniques.`,
    answer:`- **Compaction/summarization**: summarize the old history preserving key facts, decisions, and state; keep the recent messages intact.
- **External memory**: the agent persists notes/state to files or a DB and re-reads them when needed (the context stops being the only storage).
- **Trimming tool results**: via hooks (PostToolUse) return only what is useful; clean up old results that have served their purpose.
- **Subagents with isolated context**: verbose work (exploration, searches) happens in child contexts that return a synthesis.
- **Prompt caching**: a stable prefix (tools + system + base documents) cached → 90% discount on reads and lower latency; the dynamic content goes at the end.
- **Targeted retrieval (RAG/search)**: load only what is relevant to the current task instead of the whole corpus.
- **Token counting** (free) to monitor consumption and trigger compaction in time.` },

  { type:"open",
    question:`Design the error handling and reliability strategy for a production application built on the Claude API.`,
    answer:`- **Error classification**: retryable (**429** rate limit, **500** internal, **529** overloaded, timeouts) vs non-retryable (**400** invalid request, **401/403** credentials/permissions).
- **Exponential backoff with jitter** for the retryable ones, honoring **retry-after**; a retry limit.
- **Output validation**: schemas (tool use), business assertions (arithmetic, ranges), and retry **with error feedback** when validation fails.
- **stop_reason checks**: detect **max_tokens** (truncated response → retry with a larger budget or continue), never assume a complete response.
- **Timeouts and circuit breakers**: cut off failure cascades; graceful degradation (partial response or an honest unavailability message).
- **Idempotency** in operations with side effects: a retry must not duplicate actions.
- **Queues and peak smoothing** to respect rate limits; the **Batch API** for latency-tolerant work.
- **Observability**: logging of requests/stop_reasons/errors, latency and failure-rate metrics, alerts.
- **Regression evals** on every prompt or model change.` },

  { type:"mc",
    question:`After several rounds of conversation summarization, an agent "remembers" that a customer needs "a refund" but has lost the exact figure "$247.83 by Friday". What is the mitigation?`,
    options:[
      `Summarize less often but more aggressively.`,
      `Keep critical precise data (amounts, dates, IDs, commitments) in a persistent fact block that is injected verbatim and never summarized; summarization is for narrative, not for high-precision tokens.`,
      `Ask the customer to repeat the amount each session.`,
      `Increase the summary length limit.`],
    correct:1,
    answer:`**Progressive summarization destroys high-precision tokens first**: numbers, dates, identifiers, exact commitments are the first casualties of compression.
- Mitigation: a **persistent fact block** (structured key facts, injected verbatim outside the summarized history) or external memory the agent re-reads.
- Split the state: **narrative** can be compressed; **precise facts** must survive verbatim.` },

  { type:"mc",
    question:`Two sources give different values for the same figure (a company's employee count). The extraction pipeline currently keeps whichever it saw last. What is the correct design?`,
    options:[
      `Keep the larger number.`,
      `Preserve both conflicting values with their source attribution and set a conflict_detected flag, forcing explicit downstream handling instead of a silent, arbitrary collapse.`,
      `Average the two values.`,
      `Discard the document.`],
    correct:1,
    answer:`**Never collapse conflicts silently**:
- Store **all conflicting values with their sources** ({value, source, date}) and a **conflict_detected: true** flag.
- Downstream logic (or a human) then resolves it with full information: recency, source reliability, definitional differences.
- Silent last-write-wins produces confident wrong answers — the worst failure mode for a data pipeline.` },

  { type:"mc",
    question:`A research agent finds a 2021 source saying a product "does not support SSO" and a 2025 source saying it does. How does the pipeline distinguish a real contradiction from normal change over time?`,
    options:[
      `Trust the source with the longer document.`,
      `Include publication_date in the structured output for every claim, so chronological progression (a fact that changed) can be distinguished from genuine same-time contradictions.`,
      `Flag every disagreement as a contradiction.`,
      `Ignore sources older than one year.`],
    correct:1,
    answer:`**Temporal metadata resolves apparent contradictions**:
- With **publication_date** attached to each claim, "no SSO (2021)" vs "SSO (2025)" reads as **evolution**, not conflict — report the current state, optionally with the history.
- Two sources from the **same period** disagreeing is a genuine conflict → conflict handling (preserve both, attribute, flag).
- Without dates, the pipeline cannot tell these two situations apart.` },

  { type:"mc",
    question:`A long-running agent session must be abandoned (context exhausted, degraded quality). The work is half done. What is the recommended recovery pattern?`,
    options:[
      `Resume the same session and hope quality recovers.`,
      `Have the agent produce a structured checkpoint of completed work, decisions, and pending items; start a fresh session and inject the checkpoint with explicit state guidance.`,
      `Restart the entire task from zero.`,
      `Copy the raw transcript into the new session.`],
    correct:1,
    answer:`**Checkpoint + fresh session**:
- The checkpoint captures the durable state: what was completed, key decisions and why, what remains, relevant file/data locations.
- The fresh session starts clean (no degraded, bloated history) but **informed** — inject the checkpoint as structured context with explicit instructions on how to continue.
- Copying the raw transcript (D) imports the bloat you were escaping; restarting from zero (C) throws away paid-for work.` },
]},
];
