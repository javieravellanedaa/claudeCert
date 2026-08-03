/* Question bank — Claude Certified Architect: Foundations (CCA-F)
   Organized by the exam blueprint: 5 domains -> subdomain task statements.
   Every question carries: sub (subdomain), lvl (difficulty), src (provenance).
   Audited against official Anthropic documentation; distractor quality and
   answer-position distribution balanced. */
window.STUDY_DATA = [

/* ============ DOMAIN 1: AGENTIC ARCHITECTURE (27%) ============ */
{ id:"agentic", name:"🤖 Agentic Architecture (27%)", questions:[
  { type:"mc", sub:"1.4", lvl:"intermediate", src:"core",
    question:`A support agent must ALWAYS verify the customer's identity before processing a refund. The system prompt already says so, but in production the model sometimes skips the verification. What is the most robust solution?`,
    options:[
      `Audit refunds after the fact and automatically reverse any that have no matching verification record.`,
      `Move the requirement into the refund tool's description so the model reads it at the moment it decides to call the tool.`,
      `Make the refund tool's handler reject the call when no verification has been recorded earlier in the session.`,
      `Split the flow into two chained steps and pass the verification result forward as an input to the refund step.`],
    correct:2,
    answer:`The golden rule of the exam: **prompt instructions have a non-zero failure rate; programmatic constraints guarantee compliance**.
- A **prerequisite enforced in the tool handler** (refund fails unless a recorded verification exists) makes the ordering **deterministic**, whatever the model decides.
- Moving the rule into the tool description is still a prompt-level instruction — better placed, but not guaranteed.
- Prompt chaining helps only while the model stays on the scripted path; an agent that re-plans can still skip the step.
- Post-hoc reversal detects the violation **after** money has moved.
- For critical business rules: **enforcement in code or hooks, never prompt alone**.` },
  { type:"mc", sub:"1.1", lvl:"basic", src:"core",
    question:`What is the canonical way to detect that an agentic loop has finished its work?`,
    options:[
      `Have the model emit a sentinel marker such as <DONE> and stop when that marker appears in the text.`,
      `Inspect the response's stop_reason field and end the loop when it is "end_turn".`,
      `Stop after a fixed number of iterations chosen to cover the longest expected task.`,
      `Stop when the response contains no tool_use content blocks, whatever the stop_reason says.`],
    correct:1,
    answer:`The **stop_reason** field is the API's structural signal:
- **"tool_use"** → the model wants to execute a tool: the loop continues.
- **"end_turn"** → the model finished its turn: the loop can end.
- A sentinel marker is still natural-language parsing: **fragile and unreliable**.
- Iteration caps are a safety guardrail, **not** the primary termination mechanism.
- "No tool_use blocks" looks equivalent but is subtly wrong: a turn cut off by **"max_tokens"** — or paused with **"pause_turn"** — also contains no tool_use blocks, and treating either as completion silently truncates the task.` },
  { type:"mc", sub:"1.1", lvl:"basic", src:"core",
    question:`In a Messages API response, which stop_reason indicates that the model wants to invoke a tool?`,
    options:[
      `"tool_use"`,
      `"stop_sequence"`,
      `"end_turn"`,
      `"max_tokens"`],
    correct:0,
    answer:`**"tool_use"**: the model emitted one or more tool use blocks and is waiting for the results.
The other values:
- **"end_turn"**: finished naturally.
- **"max_tokens"**: cut off by the token limit (careful: the response may be incomplete!).
- **"stop_sequence"**: it hit a stop sequence you defined.
Other values you may encounter include **"pause_turn"** (a long-running server-side tool turn that can be resumed) and **"refusal"**.` },
  { type:"vf", sub:"1.1", lvl:"basic", src:"core",
    question:`The iteration cap (maximum number of loop turns) should be the main mechanism for deciding when an agent has finished its task.`,
    correct:"F",
    answer:`**False.** The iteration cap is a **safety guardrail** against runaway loops and unbounded costs — a safety net, not the termination mechanism.
Normal termination should be based on **stop_reason = "end_turn"** (the model decided it was done). If the agent frequently hits the cap, that is a symptom of a design problem (poorly defined task, failing tools, insufficient context).` },
  { type:"mc", sub:"1.1", lvl:"intermediate", src:"core",
    question:`An agent runs several searches and then must compare the results against each other. To save context, a developer proposes replacing each result with a one-line summary as soon as it arrives. What is the main risk?`,
    options:[
      `Summaries lose per-result source attribution, so the final answer cannot cite where each fact came from.`,
      `Each summarization costs an extra model call, so latency grows faster than the context saving is worth.`,
      `Rewriting earlier messages invalidates the cached prefix, so every later turn is re-billed at full price.`,
      `Summaries drop details that only turn out to matter once the results are compared, and the originals are gone.`],
    correct:3,
    answer:`When the task requires **reasoning over several results together** (comparing, cross-referencing, detecting inconsistencies), summarizing prematurely destroys information that **cannot be recovered later** — that is the irreversible failure.
- The extra call and the cache invalidation are real costs, but they are *cost* problems, not *correctness* problems.
- Lost attribution is a genuine side effect, but it is a symptom of the same premature compression rather than the main risk.
- Keep the **full results in the history** while the reasoning still needs them; compress or discard **after** the comparison stage is finished (e.g., with a hook that trims old results, or compaction).` },
  { type:"mc", sub:"1.2", lvl:"intermediate", src:"core",
    question:`A coordinator-subagents research system produces reports with coverage gaps: important aspects of the topic are missing. Where is the most likely root cause?`,
    options:[
      `The subagents lack a shared vocabulary, so overlapping findings get merged into a single point.`,
      `The subagents stop early, settling for the first few sources that answer their assigned question.`,
      `The coordinator's task decomposition: aspects the breakdown omits are investigated by no subagent at all.`,
      `The synthesis step, where the coordinator drops findings that do not fit the report outline it chose.`],
    correct:2,
    answer:`**The coordinator's decomposition determines coverage.** Subagents only investigate what they are assigned: if the breakdown omits an aspect, that aspect doesn't exist for the system.
- Shallow subagent research and lossy synthesis are real failure modes, but they degrade *depth* and *fidelity* on aspects that were assigned — they cannot explain an aspect that was never investigated.
- The subagents' execution quality is **secondary** to the quality of the decomposition plan.
- Typical fix: improve the coordinator's planning prompt (ask it to enumerate aspects, verify coverage, consider missing angles).` },
  { type:"mc", sub:"1.2", lvl:"intermediate", src:"core",
    question:`A coordinator has 6 specialized subagents. For simple queries, running the full pipeline wastes time and tokens. Which pattern is appropriate?`,
    options:[
      `Keep running all 6, but give them a smaller, faster model when the query looks simple.`,
      `Adaptive routing: the coordinator assesses the query's complexity and selects which subagents to invoke.`,
      `Keep running all 6 in parallel so that total latency is bounded by the slowest one rather than the sum.`,
      `Cache subagent responses so that repeated or similar queries skip the pipeline entirely.`],
    correct:1,
    answer:`**Query-adaptive routing**: the coordinator decides which subagents are needed based on the query's complexity and type.
- A simple query may be resolved with 1 subagent (or none).
- Downgrading the model still pays for six invocations of work that isn't needed — it lowers the unit cost without removing the waste.
- Parallelizing bounds latency but not tokens, and still runs subagents whose output contributes nothing.
- Caching only helps on **repeats**; a first-time simple query still pays the full pipeline.
- This is the **routing** pattern from "Building Effective Agents" applied to orchestration.` },
  { type:"mc", sub:"1.2", lvl:"intermediate", src:"core",
    question:`A research subagent processed 7 of its 10 assigned sources and returned incomplete results. What is the best recovery?`,
    options:[
      `Re-invoke the subagent with only the 3 pending sources, passing what was already completed as context.`,
      `Synthesize with the 7 processed sources and note in the report that coverage was partial.`,
      `Discard the partial output and relaunch the same subagent with all 10 sources from the start.`,
      `Spawn three new subagents, one per remaining source, each starting from a clean context.`],
    correct:0,
    answer:`**Targeted re-delegation**: reprocess only what's missing (the 3 sources), with the context of what was already done to maintain coherence.
- Relaunching everything wastes the valid work already performed and re-pays its token cost.
- One subagent per remaining source restores coverage but loses coherence: each starts blind to the 7 findings already made, so overlaps and contradictions surface only at synthesis time — and three spawns cost more than one.
- Synthesizing with 7 of 10 reproduces the original problem: a coverage gap, now merely documented.` },
  { type:"mc", sub:"1.3", lvl:"basic", src:"core",
    question:`In the Agent SDK, a coordinator fails to spawn subagents: every attempt is denied or falls through to a permission prompt. Which configuration should you check first?`,
    options:[
      `That every subagent definition supplies a description field so Claude knows when to invoke it.`,
      `That maxTurns is high enough for the coordinator and its subagents to finish their work.`,
      `That the coordinator's model is configured to allow parallel tool calls in a single response.`,
      `That the subagent-invocation tool — "Agent", or "Task" in older releases — is in allowedTools.`],
    correct:3,
    answer:`Subagents are invoked through the SDK's subagent tool. Per the Agent SDK docs, that tool is **\`Agent\`** (it was renamed from \`Task\` in Claude Code v2.1.63; some SDK surfaces still report \`Task\`, so matching both names is the compatible check). If it is not in **allowedTools**, invocations are not auto-approved: they fall through to \`canUseTool\` or are denied outright.
- A missing \`description\` is a real cause of Claude *choosing* not to delegate — but that produces "Claude answers directly", not denied invocations.
- \`maxTurns\` bounds how long an agent runs; it doesn't gate the ability to spawn.
- This is the Agent SDK's basic capability gating: an agent can only do what its allowed tools enable.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"core",
    question:`A multi-agent pipeline loses the correspondence between claims and their sources when passing information from the researcher subagent to the synthesizer. How is traceability (provenance) preserved?`,
    options:[
      `Attach the complete transcript of every subagent so the synthesizer can trace any claim back itself.`,
      `Instruct the synthesizer to attach a source citation to every claim it writes into the final report.`,
      `Pass structured context separating content from metadata (URL, date, page) so claim→source survives each handoff.`,
      `Have each researcher end its prose report with a numbered reference list the synthesizer can draw on.`],
    correct:2,
    answer:`**Structured context with explicit metadata**: each finding travels as a unit {content, source, URL, date, page}.
- Telling the synthesizer to cite doesn't help when the binding was already lost upstream — it can only invent or omit.
- A trailing reference list keeps the sources but not the **mapping**: nothing ties claim #3 to reference #7, and the first rewrite loses even that.
- Shipping the full transcript technically preserves provenance but buries it in noise and burns the context the pipeline was trying to protect.
- With structure, the synthesizer can cite precisely and the system can **audit** every claim in the final report.
- This concept also appears in Domain 5 as "information provenance".` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"core",
    question:`A coordinator must research 4 mutually independent subtopics. How does it minimize total latency?`,
    options:[
      `Invoking the subagents one at a time, waiting for each result before starting the next.`,
      `Emitting the 4 subagent tool calls in a single response, so the subagents run in parallel.`,
      `Concatenating the 4 subtopics into a single subagent with a longer, more detailed prompt.`,
      `Keeping the calls sequential but caching the shared context so later subagents start faster.`],
    correct:1,
    answer:`For **independent** subtasks, the coordinator should emit **multiple subagent (\`Agent\`) tool calls in the same response** → parallel execution.
- Sequential: latency = sum of all 4. Parallel: latency ≈ the slowest one.
- A single subagent with everything loses the benefits of isolated context and specialization, and its total work is unchanged.
- Caching the shared prefix cuts **cost** and per-call prefill, but four calls still happen one after another — the wall-clock ordering is untouched.
- Rule: parallelize what is independent; sequence only what has real dependencies.` },
  { type:"mc", sub:"1.6", lvl:"basic", src:"core",
    question:`Which workflow pattern is appropriate for a task with well-defined stages known in advance (e.g., extract → translate → format)?`,
    options:[
      `Prompt chaining: focused sequential passes, where each step's output feeds the next.`,
      `Evaluator-optimizer: one call generates, another critiques against criteria, and the loop repeats.`,
      `Routing: classify each input and send it to the handler specialized for that category.`,
      `Orchestrator-workers: a central LLM decides at run time what the subtasks are and delegates them.`],
    correct:0,
    answer:`**Prompt chaining** is the pattern for **predictable, decomposable** flows: each step does one thing well, with the option to validate between steps ("gates").
- Each focused pass performs better than a mega-prompt that splits the model's attention.
- Orchestrator-workers is reserved for **exploratory** tasks where the subtasks aren't known in advance — here they are.
- Evaluator-optimizer applies when quality improves through **iteration against a criterion**, not when stages are simply ordered.
- Routing applies when inputs fall into **categories** needing different handling; here every input goes through the same three stages.
- Chaining's trade-off: more total latency in exchange for more precision per stage.` },
  { type:"mc", sub:"1.6", lvl:"intermediate", src:"core",
    question:`A research task is open-ended: it is not known in advance which subtopics will emerge or how many steps are needed. Which decomposition strategy applies?`,
    options:[
      `Parallelization by sectioning: fix a list of ten generic subtopics and research them concurrently.`,
      `Evaluator-optimizer: draft a report, critique it against a rubric, and iterate until it passes.`,
      `Prompt chaining with a fixed sequence of stages defined before the research starts.`,
      `Adaptive decomposition: build and adjust the research plan based on intermediate findings.`],
    correct:3,
    answer:`For **exploratory/open-ended** scope: **adaptive dynamic decomposition** — the plan evolves with the findings (orchestrator-workers pattern).
- A fixed pipeline cannot anticipate unknown subtopics.
- Sectioning is still a *predefined* split; it parallelizes a guess about the structure rather than discovering it. Generic subtopics chosen up front reproduce the coverage-gap problem, faster.
- Evaluator-optimizer improves a draft's **quality**, but the critique loop cannot surface a subtopic nobody researched.
- This is the key **workflow vs agent** difference: workflows follow predefined paths; agents direct their own process based on what they discover.` },
  { type:"mc", sub:"1.2", lvl:"basic", src:"core",
    question:`In the "orchestrator-workers" pattern, what is the orchestrator's role?`,
    options:[
      `Classify each incoming request and forward it to the one worker specialized for that category.`,
      `Execute all the subtasks itself, in order, keeping the whole task in one context.`,
      `Dynamically decompose the task, delegate subtasks to workers, and synthesize their results.`,
      `Run a fixed, predefined set of subtasks in parallel and merge the outputs at the end.`],
    correct:2,
    answer:`The orchestrator (coordinator): **decomposes** the central task into subtasks (that weren't known in advance), **delegates** each one to workers, and **synthesizes** the results.
- Running a **fixed** set of subtasks in parallel is **parallelization (sectioning)**, not orchestration — the distinguishing feature is that orchestrator subtasks are determined **dynamically** from the input.
- Classifying and forwarding is the **routing** pattern: one handler is selected, nothing is decomposed or synthesized.
- Ideal for: multi-source research, code changes touching several files, tasks whose structure depends on the case.` },
  { type:"mc", sub:"1.6", lvl:"intermediate", src:"core",
    question:`When is the "evaluator-optimizer" pattern appropriate?`,
    options:[
      `When the task splits into independent subtasks that can be run at the same time.`,
      `When there is a clear evaluation criterion and quality measurably improves through iteration.`,
      `When inputs fall into distinct categories that each need different handling.`,
      `When the stages are known in advance and each stage's output is the next stage's input.`],
    correct:1,
    answer:`**Evaluator-optimizer**: a generator produces, an evaluator critiques with **explicit criteria**, and the loop iterates until approval.
- It works when: (1) there are clear, verbalizable evaluation criteria, and (2) iteration yields measurable improvement. If either is missing, the loop burns tokens without converging.
- Independent subtasks → **parallelization**. Distinct categories → **routing**. Known ordered stages → **prompt chaining**.
- Examples: literary translation with nuance, code that must pass tests, writing against a rubric.
- Cost: multiple calls per result — don't use it if a single pass already achieves sufficient quality.` },
  { type:"mc", sub:"1.6", lvl:"basic", src:"core",
    question:`What is the "routing" pattern in LLM architectures?`,
    options:[
      `Classifying the input and directing it to a specialized follow-up flow: its own prompt, tools, or model.`,
      `Breaking a request into ordered stages where each stage's output becomes the next stage's input.`,
      `Letting a central LLM decide at run time what the subtasks are and delegating each one to a worker.`,
      `Running the same input through several specialized prompts in parallel and aggregating the answers.`],
    correct:0,
    answer:`**Routing** = classification + dispatch: a first step determines the input's category and sends it to a **specialized** flow.
- Benefit: **separation of concerns** — each flow is optimized for its case without degrading the others.
- The other options are the neighbouring patterns: aggregating parallel answers is **parallelization**, ordered stages are **prompt chaining**, and run-time subtask creation is **orchestrator-workers**.
- Examples: support (general inquiry vs refund vs technical), or routing easy questions to a small/cheap model (Haiku) and hard ones to a large one.` },
  { type:"mc", sub:"1.6", lvl:"intermediate", src:"core",
    question:`Within the "parallelization" pattern, what is the difference between "sectioning" and "voting"?`,
    options:[
      `Sectioning runs the stages one after another; voting is the variant that runs them concurrently.`,
      `Sectioning fans the work out across several different models; voting keeps every run on one model.`,
      `Sectioning aggregates the parallel outputs by consensus; voting concatenates them into one combined answer.`,
      `Sectioning splits a task into independent parallel subtasks; voting runs the same task several times and aggregates.`],
    correct:3,
    answer:`Two variants of parallelization:
- **Sectioning**: splitting the task into **independent subtasks** that run in parallel (e.g., reviewing each file separately; one call processes the query while another screens it for policy).
- **Voting**: running the **same task several times** to get diverse outputs, then aggregating (majority, union, consensus) to gain confidence (e.g., 3 independent reviewers look for vulnerabilities; what the majority confirms gets reported).
- Both variants are **parallel** — concurrency is not what separates them.
- Neither is defined by how many models are used; sectioning and voting can each use one model or several.
- Consensus aggregation belongs to **voting**, not sectioning: sectioning's subtasks answer different questions, so there is nothing to take a consensus over.` },
  { type:"vf", sub:"1.6", lvl:"basic", src:"core",
    question:`In Anthropic's terminology, "workflow" and "agent" are synonyms: any system that uses an LLM with tools is an agent.`,
    correct:"F",
    answer:`**False.** The distinction is central:
- **Workflow**: systems where LLMs and tools are orchestrated through **predefined code paths** — the flow is decided by the developer.
- **Agent**: systems where the LLM **dynamically directs its own process** and tool usage, maintaining control over how it accomplishes the task.
Design advice: seek the **simplest** solution that works — workflows for predictable tasks; agents only when flexibility and autonomous decision-making at scale are needed.` },
  { type:"mc", sub:"1.5", lvl:"intermediate", src:"core",
    question:`The subagents in a system return data in heterogeneous formats (JSON, tables, prose) and the coordinator gets confused integrating them. In the Agent SDK, which mechanism allows them to be normalized automatically?`,
    options:[
      `A strict-schema tool definition, so each subagent's output is validated against a JSON schema on the way out.`,
      `A PreToolUse hook that blocks any invocation whose tool is known to return unstructured prose.`,
      `A PostToolUse hook that intercepts each result and rewrites it into a uniform shape before the model reads it.`,
      `A SessionStart hook that injects the required output format into every subagent's context at startup.`],
    correct:2,
    answer:`**PostToolUse** runs **after** each tool execution and can replace the result before it reaches the model — the hook returns \`updatedToolOutput\`, which substitutes the tool's result. That lets you:
- Normalize heterogeneous formats into a single structure.
- Trim irrelevant fields (context savings).
- It is **deterministic** (code), unlike asking for it via prompt.

Why not the others:
- **PreToolUse** runs *before* execution: it can block or modify the **call**, but it hasn't seen the result yet, so it cannot normalize it.
- **SessionStart** injects context once, at startup — a prompt-level nudge with the usual non-zero failure rate.
- Strict schemas constrain a model's **own** tool-call inputs; they don't reshape what an already-returned subagent report looks like.` },
  { type:"mc", sub:"1.5", lvl:"intermediate", src:"core",
    question:`A compliance policy forbids the agent from executing the "delete_record" tool on records of active customers. Which enforcement point implements this correctly?`,
    options:[
      `Remove delete_record from the agent's allowedTools so the call can never be auto-approved.`,
      `A PreToolUse hook that inspects each delete_record call and denies it when the record belongs to an active customer.`,
      `A PostToolUse hook that inspects the result and raises a compliance alert when an active customer was deleted.`,
      `Set delete_record's permission policy to always ask, so a human approves every individual deletion.`],
    correct:1,
    answer:`The policy is **conditional on the data**, so enforcement must happen **after the arguments are known but before the action runs** — that is exactly **PreToolUse**, which sees the tool input and can deny the call programmatically. Guaranteed compliance, no human in the path.
- Removing the tool from **allowedTools** is too blunt: it blocks *every* deletion, including the permitted ones, breaking the legitimate workflow.
- **PostToolUse** runs after execution — the record is already deleted; you get an alert, not compliance.
- **Human approval on every call** is a real control, but it is neither deterministic (approvers make mistakes) nor scalable, and it stalls the many legitimate deletions.
- General exam pattern: **critical policy → programmatic enforcement at the moment of the call**.` },
  { type:"mc", sub:"1.5", lvl:"advanced", src:"core",
    question:`An agent's hooks return both the raw output of each tool and the processed version into the context, and the context runs out quickly. What should be done?`,
    options:[
      `Modify the hook to return only the formatted version, removing the redundant raw output.`,
      `Add a PreCompact hook that strips the raw outputs whenever compaction is about to run.`,
      `Split the work across two subagents so each one carries only half of the tool output.`,
      `Enable context compaction so older tool results are summarized once the window starts filling up.`],
    correct:0,
    answer:`If the hook already produces a **sufficient processed version**, the raw output is pure redundancy that burns context. Fix it **at the source**: adjust the hook to inject **only** the final format.
- **Compaction** and a **PreCompact** cleanup both treat the symptom: the duplicated tokens are still generated, still paid for, and still occupy the window until the cleanup fires.
- **Splitting across subagents** halves the per-agent pressure but doubles the number of agents carrying redundant data — the waste is unchanged, just distributed.
- Context management principle: every token in the history must **earn its place** — duplicated or intermediate data is removed at the earliest possible layer.` },
  { type:"mc", sub:"1.7", lvl:"intermediate", src:"core",
    question:`You resume an agent session that analyzed a repo days ago, but 3 files have changed since then. What is the best way to resume?`,
    options:[
      `Fork the session and have the fork re-analyze the whole repository from scratch.`,
      `Resume the session and continue from the previous analysis as it stands.`,
      `Start a brand-new session so the analysis is guaranteed to reflect the current code.`,
      `Resume the session, tell the agent which files changed, and have it re-analyze only those.`],
    correct:3,
    answer:`**Resumption with targeted re-analysis**: the session retains the global understanding (valuable, costly to rebuild) and the agent updates **only what changed**.
- Resuming as-is → conclusions drawn from three stale files, with nothing signalling that they are stale.
- A new session is correct but wasteful: it throws away all the accumulated context to fix 3 files.
- Forking preserves the original branch (useful) but the fork still re-analyzes everything, so it pays the same full cost as a new session.
- The targeted middle ground maximizes reuse + correctness.` },
  { type:"mc", sub:"1.7", lvl:"intermediate", src:"core",
    question:`You want to explore 3 different refactoring approaches starting from the same baseline analysis by an agent, without the explorations contaminating each other. Which Agent SDK mechanism do you use?`,
    options:[
      `Re-run the baseline analysis in three fresh sessions, then explore one approach in each.`,
      `Three successive queries in the same session, one per approach.`,
      `Resume the baseline session three times with session forking enabled, once per approach.`,
      `Three queries with continue enabled, so each picks up the most recent state.`],
    correct:2,
    answer:`Forking creates **independent branches** from a common point: resume the baseline session and set the fork option (**\`fork_session=True\`** in Python, **\`forkSession: true\`** in TypeScript) — each fork gets its own new session ID while the original history stays unchanged.
- Each branch inherits the baseline (the analysis already done) without repeating the cost.
- The explorations diverge in **isolation**: what is tried in one branch does not bias the others.
- Exploring in a single session contaminates: the model carries over conclusions from the previous approach.
- **continue** is the opposite of what's needed — it picks up the *most recent* session, so the three approaches chain onto each other instead of branching.
- Three fresh sessions are isolated but pay for the baseline analysis three times.
Note: forking branches the **conversation**, not the filesystem — file edits made in one branch are still real on disk.` },
  { type:"mc", sub:"1.6", lvl:"intermediate", src:"core",
    question:`A coordinator fans out 5 independent complaint investigations in parallel. All 5 need the same 250-line account history the coordinator already holds. How should that shared context reach the subagents?`,
    options:[
      `Reference it as "the account history discussed above"; the subagents inherit the coordinator's conversation.`,
      `Include the account history explicitly in each subagent's prompt, since subagents start with a fresh context.`,
      `Have the first subagent load the account history and let the other four read it from its returned report.`,
      `Write the account history to a shared file and rely on the subagents to discover it while investigating.`],
    correct:1,
    answer:`A subagent's context window starts **fresh**: it receives its own system prompt plus the invocation prompt, and **not** the parent's conversation history or tool results. Anything the subtask needs must be **in that prompt**.
- "As discussed above" refers to a conversation the subagent has never seen — the classic dangling-reference failure.
- Chaining through the first subagent destroys the parallelism (the other four now wait on it) and passes the history through a lossy summarization.
- A shared file works only if the subagents are told the exact path and have file tools; "rely on them to discover it" is not a contract.
- Yes, this duplicates tokens across five prompts — that is the deliberate price of context isolation. Explicit passing is a **design act**, not an accident.` },
  { type:"open", sub:"1.4", lvl:"advanced", src:"core",
    question:`You are designing an autonomous agent that executes actions on real systems (tickets, refunds, code). List the guardrails you would implement for production.`,
    answer:`- **Iteration and budget caps**: safety net against runaway loops and runaway costs (not as primary termination).
- **Termination via stop_reason**: the loop stops on a structural signal ("end_turn"), not by parsing text.
- **PreToolUse hooks**: programmatic blocking of actions forbidden by policy (don't trust the prompt for critical rules).
- **Minimal permissions (allowedTools)**: the agent only has the tools its role needs.
- **Human-in-the-loop**: human approval for irreversible or high-impact actions (deleting data, moving money, publishing) — e.g. an "always ask" permission policy on those specific tools.
- **Idempotent write operations**: client-generated request IDs so a retry after a timeout cannot duplicate a side effect.
- **Structured errors and bounded retries**: distinguish transient errors (retry with backoff) from definitive ones, ideally by returning an explicit retryable/non-retryable classification in the error payload rather than free-text.
- **Sandboxing**: run code/commands in isolated environments.
- **Observability**: logging of every tool call and decision for auditing and debugging.` },
  { type:"open", sub:"1.2", lvl:"advanced", src:"core",
    question:`Explain the coordinator-subagents (orchestrator-workers) pattern: how it works, when to use it, and what its typical risks are.`,
    answer:`**How it works:**
- A **coordinator** receives the task, **dynamically decomposes** it into subtasks, delegates each one to specialized **subagents** (with their own context and scoped tools), and **synthesizes** the results.
- Independent subtasks are launched **in parallel** (multiple subagent tool calls emitted in a single response).

**When to use it:**
- Complex tasks whose structure is **not known in advance** (multi-source research, multi-file changes). If the subtasks are fixed and known up front, that is parallelization/sectioning, not orchestration.
- When a single agent's context isn't enough: each subagent works with a clean, focused context.

**Typical risks:**
- **Coverage gaps**: if the decomposition omits an aspect, nobody investigates it (the root cause usually lies in the coordinator, not the workers).
- **Context isolation cuts both ways**: subagents do not see the coordinator's history, so everything the subtask depends on must be injected explicitly into the invocation prompt.
- **Loss of provenance**: passing findings without structured metadata breaks the claim→source mapping.
- **Fabrication during synthesis**: if a subagent returns incomplete work, the synthesizer may "fill in" — the right move is to re-delegate what's missing, not invent it.
- **Cost**: multiplying agents multiplies tokens; use it only when the task justifies it.` },
  { type:"vf", sub:"1.6", lvl:"basic", src:"core",
    question:`If a task can be solved well with a single model call and a good prompt, you should still build a multi-agent system because it always performs better.`,
    correct:"F",
    answer:`**False.** Anthropic's guiding principle: **seek the simplest solution that works**.
- Every layer of agency adds **cost, latency, and error surface**.
- Multi-agent systems are justified when the task exceeds what a simple call/workflow can achieve: dynamic scope, context that doesn't fit, genuinely parallelizable subtasks.
- On the exam, "more architecture for its own sake" options are usually distractors.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"repos",
    question:`A coordinator has spent 20 turns building an understanding of a research topic. It spawns a subagent for a follow-up subtask, but the subagent produces work that ignores everything already established. Why?`,
    options:[
      `Subagents start with a fresh context: the coordinator's history is invisible unless injected into the prompt.`,
      `The coordinator condensed its 20 turns into a short brief, so the nuance was lost in the handoff.`,
      `The subagent ran in the background and returned before the coordinator's latest findings were written.`,
      `The subagent's tool list is narrower than the coordinator's, so it could not reach the relevant sources.`],
    correct:0,
    answer:`Each subagent starts with a **fresh, isolated context** — that is the point of subagents (clean, focused context), but it cuts both ways:
- Nothing from the coordinator's history is visible to the subagent unless you **pass it explicitly** in the invocation prompt. A narrow tool list or a lossy brief would degrade quality; here the subagent behaves as if the 20 turns never happened, which is the signature of **no** inherited context, not compressed context.
- Background execution changes *when* results arrive, not *what* the subagent can see.
- Inject the relevant findings in a **structured format** (facts, sources, constraints), not "see above".
- Design rule: a subagent prompt must be **self-contained** — everything needed to do the subtask correctly.` },
  { type:"mc", sub:"1.2", lvl:"advanced", src:"repos",
    question:`A coordinator already holds all the information needed to answer a sub-question (it gathered it in earlier turns). Should it spawn a synthesis subagent for that sub-question?`,
    options:[
      `Yes — it keeps the coordinator's own context clean by moving the reasoning elsewhere.`,
      `Yes, but only when the sub-question draws on findings from more than one earlier subagent.`,
      `Yes — a dedicated synthesis subagent applies a consistent output format across all sub-questions.`,
      `No — re-processing context the coordinator already holds pays a full handoff for zero new information.`],
    correct:3,
    answer:`Subagents earn their cost when they do **new work** (exploration, parallel research, verbose discovery) in isolated context.
- Re-processing information the coordinator **already holds** means paying a full handoff (serialize → transfer → re-read) for zero new information — and every handoff risks losing nuance.
- Format consistency is cheaper to get from an output contract or a template than from an extra agent.
- "Keeping context clean" is the strongest-looking distractor, and it is genuinely a benefit of subagents — but only when the subagent's *input* stays out of the coordinator. Here the coordinator is already holding the context; delegating adds the handoff without removing anything.
- The number of upstream subagents doesn't change the calculus: it's still re-reading context that is already present.
- Rule: **delegate to acquire, synthesize in place.**` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"repos",
    question:`A subagent prompt gives a rigid step-by-step procedure ("1. search X, 2. open first result, 3. extract...") and the subagent fails whenever reality deviates from the script. What is the better prompting approach?`,
    options:[
      `Split each numbered step into its own subagent so a failure is isolated to one step.`,
      `Extend the script with branches covering the deviations seen most often in production.`,
      `Replace the procedural script with a research goal plus quality criteria, letting the subagent adapt.`,
      `Wrap the script in a retry loop so the subagent restarts the procedure whenever a step fails.`],
    correct:2,
    answer:`For agents, **goal-oriented prompts beat procedural scripts**:
- State the **objective**, the **quality bar** (what a good result looks like, which sources count), and the **constraints**.
- The agent then adapts when a search returns nothing, a page is down, or the information appears in an unexpected form.
- Adding branches is an endless game: you can only encode the deviations you've already seen, and the prompt grows until it degrades attention.
- A retry loop re-runs the same brittle path against the same reality — it converts a failure into a slower failure.
- Splitting the steps across subagents multiplies cost and *removes* the shared context that would let any one of them adapt.
- Procedural scripts are brittle by construction: they encode one happy path. (Use rigid procedures only where compliance matters more than adaptability — and then enforce them in code, not prose.)` },
  { type:"mc", sub:"1.4", lvl:"advanced", src:"repos",
    question:`An agent's tool call to "create_ticket" times out; the agent cannot tell whether the ticket was created, and retrying might duplicate it. What design property of the tool prevents this problem?`,
    options:[
      `A longer timeout, so the call completes rather than returning an ambiguous result.`,
      `Idempotency: a client-generated request ID makes re-executing the operation safe and non-duplicating.`,
      `A read-back check: after a timeout the agent queries the ticket system to see whether the ticket exists.`,
      `A retry policy with exponential backoff and jitter, so retries land after the backend has recovered.`],
    correct:1,
    answer:`**Idempotency** makes retries safe: executing the same operation twice yields the same outcome as once.
- Typical implementation: a **client-generated idempotency key / request ID** — the backend recognizes the repeat and returns the original result instead of creating a duplicate.
- A longer timeout narrows the window but never closes it: any timeout value can still be exceeded, and the ambiguity returns.
- The read-back check is a real mitigation but it is **racy**: the first request may commit between the read and the retry, and it needs a reliable way to recognize "the same" ticket — which is the idempotency key again, applied late.
- Backoff and jitter control *when* you retry, not whether the retry is safe.
- Essential in agentic loops, where timeouts and retries are normal: without idempotency, every ambiguous failure becomes a potential duplicate side effect.` },
  { type:"mc", sub:"1.2", lvl:"intermediate", src:"ptest",
    question:`Two parallel research subagents keep investigating the same sources, wasting tokens on duplicated work. What should the coordinator do?`,
    options:[
      `Partition the research space (sources, subtopics, time ranges) before delegating, so each slice has one owner.`,
      `Add a third subagent that reviews both reports and removes the duplicated findings.`,
      `Give both subagents the same source list but different research questions to answer from it.`,
      `Run the subagents sequentially so the second one can see what the first already covered.`],
    correct:0,
    answer:`**Partition before delegating**: the coordinator divides the research space into **disjoint assignments** (by source list, subtopic, or period) and each subagent works only its slice.
- Parallel agents cannot see each other mid-flight — deduplication must happen **at assignment time**, not during execution.
- Sequencing fixes duplication by destroying parallelism: latency becomes the sum instead of the max.
- A deduplicating third subagent cleans the *output* after both agents have already paid to fetch and read the same sources — the tokens are already spent, and you add a third agent's cost on top.
- Different questions over the same source list still means both agents fetch and read every source: the reading cost, which is the bulk of it, is duplicated exactly as before.
- Deliberate redundancy is a different pattern (**voting**) used for confidence, not coverage.` },
  { type:"mc", sub:"1.1", lvl:"intermediate", src:"ptest",
    question:`An agent resolves each support case with 8-10 sequential API turns, each making one small tool call (fetch customer, then fetch order, then fetch shipping...). How can turn count be reduced?`,
    options:[
      `Put a cached copy of the customer database in the system prompt so lookups become unnecessary.`,
      `Raise max_tokens so the agent has room to plan all of the lookups within a single response.`,
      `Raise maxTurns so the agent no longer stalls partway through the sequence of lookups.`,
      `Prompt the agent to batch related independent tool requests into one turn, collapsing round-trips.`],
    correct:3,
    answer:`Claude can emit **multiple tool_use blocks in one assistant turn** when the calls are independent — that is parallel tool use, on by default.
- Prompting the agent to **batch related lookups** (customer + order + shipping in one turn) collapses 3 round-trips into 1 → lower latency and fewer turns.
- Raising **maxTurns** raises the ceiling; it does nothing about how many turns the task actually consumes.
- Caching the database in the system prompt fixes the wrong problem and creates worse ones: staleness, a huge prefix, and it doesn't generalize to order or shipping lookups.
- **max_tokens** bounds output length, not the number of round-trips; the agent was never truncated.
- Remember to return **all** the tool_result blocks in a single user message — splitting them trains the model out of parallel calls.
- The same idea appears at the coordinator level (parallel subagent calls) and at the API level (parallel tool use blocks).` },
  { type:"mc", sub:"1.6", lvl:"advanced", src:"ptest",
    question:`A support agent's draft responses are technically correct but often incomplete: missing timelines, next steps, or context the customer needs. Which workflow addition targets this?`,
    options:[
      `Route drafts that look thin to a human reviewer, who fills in the missing context before sending.`,
      `Expand the system prompt with an instruction to always answer completely and cover next steps.`,
      `A self-critique stage: the agent scores its own draft against an explicit completeness checklist, then revises.`,
      `A strict output schema with required fields for timeline and next steps, so a draft cannot omit them.`],
    correct:2,
    answer:`A **self-critique pass** (a lightweight evaluator-optimizer): generate draft → check it against an **explicit checklist** → revise.
- The checklist makes "complete" concrete: did I state what happens next, by when, and why?
- One-shot generation optimizes for answering the question; the critique stage optimizes for the **customer's full needs** — different objective, separate pass.
- A longer system prompt is the same single pass with more instructions competing for attention; it reduces the frequency but doesn't add the second objective.
- A required-fields schema is the strongest alternative and genuinely prevents *empty* fields — but it cannot judge whether the timeline is the right one or whether the next steps are the ones this customer needs. It enforces presence, not adequacy.
- Human review catches the gaps but does not improve the generator, and it puts a person in every case.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"ptest",
    question:`A coordinator's context fills up because subagents return long verbose prose reports. Besides trimming on receipt, what upstream change helps most?`,
    options:[
      `Cap each subagent's report with an explicit length limit stated in its prompt.`,
      `Change the subagents' output contract to structured findings — facts, quotes with sources, relevance scores.`,
      `Enable compaction on the coordinator so older subagent reports get summarized automatically.`,
      `Have each subagent run a second summarization pass over its own report before returning it.`],
    correct:1,
    answer:`Fix the **output contract at the source**: subagents return **structured findings** ({fact, quote, source, score}) instead of essays.
- Structured output is denser (more information per token), trivially mergeable, and preserves provenance.
- A length cap reduces volume but not the *format* problem: you get shorter prose, still unmergeable, and the truncation is chosen by the subagent rather than by relevance.
- Compaction is a downstream mechanism — the verbose tokens are still generated and paid for, and summarizing prose loses exactly the sources you wanted.
- A second summarization pass costs an extra call per subagent and still returns prose, now with information lost twice.
- Trimming downstream (hooks) treats the symptom; the contract change eliminates the waste before it is generated.` },
  { type:"mc", sub:"1.2", lvl:"basic", src:"video1",
    question:`Which task profile actually justifies a multi-agent hub-and-spoke architecture (coordinator + subagents)?`,
    options:[
      `A task decomposable into independent sub-tasks whose parallel, context-isolated work is then synthesized.`,
      `A high-volume task where the same prompt is executed thousands of times a day at high cost.`,
      `A task where the same question is answered several times over to raise confidence in the result.`,
      `A task with well-defined sequential stages, where each stage's output feeds directly into the next.`],
    correct:0,
    answer:`Hub-and-spoke earns its cost when the task **decomposes into independent sub-tasks** that benefit from parallel execution and isolated contexts, plus a synthesis step.
- Sequential stages are **prompt chaining** — a workflow, not a multi-agent system.
- High volume argues *against* multi-agent: multiplying agents multiplies the per-request cost you're already paying thousands of times.
- Repeating the same question is **voting** (a parallelization variant): it buys confidence, not decomposition, and needs no coordinator/subagent topology.
- Using it for a simple narrow task is **over-engineering**: more cost, more latency, more failure surface, no quality gain.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"video1",
    question:`Why do subagents receive an isolated, minimal context instead of the coordinator's full conversation history?`,
    options:[
      `Prompt caching is scoped to a single session, so re-sending the history to a subagent could never hit the cache.`,
      `Subagent transcripts are stored in separate files from the main conversation, so the history is not available to share.`,
      `The parent's history is only finalized when its turn ends, so it cannot be passed at spawn time.`,
      `It is a deliberate design choice: isolation cuts token cost and keeps the subagent focused on its subtask.`],
    correct:3,
    answer:`Context isolation is **by design, not by limitation**:
- **Cost**: re-sending the full history to every subagent multiplies tokens for no benefit.
- **Focus**: a subagent reasoning over 50 turns of unrelated conversation performs worse on its narrow subtask than one seeing only what matters.
- The other options all describe **mechanisms** rather than the reason, and each is either false or beside the point: the parent's history is fully available at spawn time (you can copy any of it into the invocation prompt); cache scoping is a cost detail, not the motivation; and separate transcript storage is a *consequence* of isolation, not its cause — nothing stops you from putting parent content into the subagent's prompt.
- The flip side: whatever the subtask DOES need must be **explicitly injected** — isolation makes context passing a deliberate act.` },
  { type:"mc", sub:"1.4", lvl:"intermediate", src:"video1",
    question:`In a sequential multi-agent pipeline (A → B → C), what is the primary risk of weak error handling?`,
    options:[
      `Stage C retries indefinitely against B's malformed output, burning the whole token budget.`,
      `Each stage re-reads its predecessor's output, so token cost grows across the pipeline.`,
      `Errors propagate silently and compound: C emits a confident wrong answer that is costly to trace to A.`,
      `The pipeline's latency is the sum of all three stages rather than the slowest one.`],
    correct:2,
    answer:`The killer failure mode of pipelines is **silent error propagation**:
- A's subtly wrong output becomes B's trusted input; by C the error is amplified and disguised as a confident conclusion.
- Debugging cost grows with distance from the origin.
- Cost growth and summed latency are inherent properties of a sequential pipeline, present whether or not error handling is weak — they are not *risks of weak error handling*.
- A retry storm is a real consequence, but it is the **loud** failure: it announces itself and burns budget. The dangerous case is the one that *doesn't* fail, and ships a wrong answer.
- Mitigations: validation **between stages** (gates), structured errors that surface failures instead of passing defaults, and provenance so outputs are traceable to inputs.` },
  { type:"mc", sub:"1.4", lvl:"basic", src:"video1",
    question:`What is the core architectural trade-off when granting an agent broader autonomy?`,
    options:[
      `Autonomy versus latency: a more autonomous agent takes more turns before it returns an answer.`,
      `Flexibility versus safety and predictability: model-directed behavior handles novel cases but is harder to constrain.`,
      `Autonomy versus context cost: a more autonomous agent accumulates more history over the course of a task.`,
      `Autonomy versus tool surface: a more autonomous agent needs a broader tool set before it is useful.`],
    correct:1,
    answer:`The fundamental dial of agent design:
- **More autonomy** → handles novel situations, less human overhead — but **less predictable**, and mistakes execute without review.
- **Less autonomy** → predictable and safe, but rigid and demanding of human attention.
- Latency, context growth, and a wider tool surface are all real consequences of autonomy, but they are **cost and engineering** consequences that scale smoothly and can be budgeted. The safety trade-off is the one that changes the *class* of failure you can suffer, which is why it drives the architecture.
- Production systems place the dial per action class: autonomy for routine/reversible, checkpoints (HITL) above a defined risk bar.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"video1",
    question:`What should a handoff between two agents in a workflow contain?`,
    options:[
      `Current task state, the context the next step needs, and what the receiving agent is expected to produce.`,
      `The complete raw conversation transcript, so nothing the receiver might need is left out.`,
      `A structured log of everything the sending agent did, in the order it did it.`,
      `The result produced so far, so the receiving agent works from the conclusion rather than the process.`],
    correct:0,
    answer:`A good handoff is a **structured package**:
- **State**: what has been done, what remains.
- **Relevant context**: the facts/artifacts the next step needs (with sources).
- **Expectation**: what the receiver is supposed to produce.
The three failing shapes:
- **Only the result** strips the context and the constraints the receiver needs to act on it.
- **The full transcript** buries the signal in noise and burns tokens.
- **A complete action log** is the subtlest error: it is structured and it *feels* rigorous, but it records the sender's **process** instead of the receiver's **task** — it still omits what the receiver is expected to produce.
The handoff is an interface — design it like one.` },
  { type:"mc", sub:"1.1", lvl:"basic", src:"video1",
    question:`An agent had all the correct information in context but drew the wrong conclusion from it. What class of failure is this?`,
    options:[
      `A tool error: a tool returned a malformed, truncated, or stale result.`,
      `A context error: the needed facts were present but buried among irrelevant material.`,
      `An environment error: the agent lacked a permission, a file, or a configuration it needed.`,
      `A reasoning error: the inputs were right, and the inference drawn from them was wrong.`],
    correct:3,
    answer:`Failure taxonomy matters because remedies differ:
- **Reasoning error**: right inputs, wrong conclusion → fix with better prompts, decomposition, verification passes.
- **Tool error**: the tool failed (timeout, malformed response) → retries, structured errors.
- **Environment error**: permissions, missing files, config → fix the environment.
- **Context error** is the tempting one here, and it is a real class — but it describes inputs that are *present yet unusable*. The stem says the agent had the correct information and still concluded wrongly, which places the fault in the inference step, not the retrieval step. (If the facts had been buried, the fix would be context curation, not better reasoning.)
Diagnosing the class is the first step of any agent post-mortem — treating a reasoning error with retries fixes nothing.` },
  { type:"mc", sub:"1.2", lvl:"advanced", src:"video2",
    question:`In a coordinator-subagent research system, one subagent proposes passing its findings straight to another subagent "for efficiency", bypassing the coordinator. Why is this generally an anti-pattern?`,
    options:[
      `It becomes a problem only once the two subagents start writing to the same files.`,
      `It is acceptable whenever both subagents were spawned for the same subtask and share a deadline.`,
      `Routing through the coordinator preserves observability, uniform error handling, and flow control.`,
      `Subagents run in isolated contexts, so a message sent from a peer would simply be ignored.`],
    correct:2,
    answer:`The hub-and-spoke's value **is** the hub:
- The coordinator **observes all interactions** (debuggability), applies **uniform error handling**, and **controls what information flows where** (provenance, scope).
- Peer-to-peer shortcuts create hidden state the coordinator can't see — failures become untraceable and synthesis loses inputs it didn't know existed.
- Note the objection is **architectural, not technical**: some agent harnesses do expose direct agent-to-agent messaging (Claude Code's \`SendMessage\` tool, for example, lets a subagent message named peers in the same session). So "subagents cannot exchange messages" is not the reason — the reason is that bypassing the hub forfeits what the hub buys you.
- A shared deadline or a shared file are narrow concerns; the observability loss applies regardless.
- If routing through the hub is too expensive, fix the handoff format (structured, compact), not the topology.` },
]},

/* ============ DOMAIN 2: TOOLS & MCP (18%) ============ */
{ id:"mcp", name:"🔧 Tools & MCP (18%)", questions:[
  { type:"mc", sub:"2.1", lvl:"basic", src:"core",
    question:`An agent with 8 tools systematically picks the wrong tool for certain queries. What is the MOST decisive factor in getting the model to select correctly?`,
    options:[
      `The position of each tool in the \`tools\` array, since the model weights the definitions it reads first.`,
      `Tighter JSON Schemas on the parameters, so a call aimed at the wrong tool fails validation instead.`,
      `The quality of each tool's name and description: what it does, when to use it, when not to, and its scope limits.`,
      `Few-shot examples in the system prompt showing one correctly formed call for each of the 8 tools.`],
    correct:2,
    answer:`**The tool definition — name plus description plus schema — is the primary selection mechanism.** The model chooses a tool by reading that definition at the moment it constructs the call.
A good description states:
- **What it does** and **when to use it** (and when NOT to).
- **Input formats** with concrete examples.
- **Scope limits**: what falls outside the tool.
- Why the others are weaker: schemas (B) constrain *arguments*, not *which tool* is chosen — a wrong tool with valid arguments still passes validation. Few-shot examples (D) help, but they sit far from the decision point and cost context on every request. Ordering (A) is not a reliable selection lever.
Anthropic recommends putting the same care into tool descriptions as into the main prompt.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"core",
    question:`The model calls an invoice search tool with dates in the wrong format ("May 3rd" instead of "2026-05-03"). Where is this best fixed?`,
    options:[
      `In the tool's description and JSON Schema: state the exact format (ISO 8601) with valid and invalid examples.`,
      `In the agent's system prompt, as a global rule that every date argument must be written in ISO 8601.`,
      `In the tool handler, by parsing natural-language dates into ISO 8601 before querying the backend.`,
      `In a few-shot example in the system prompt showing one correctly formatted call to the search tool.`],
    correct:0,
    answer:`A tool's format constraints belong **in the tool**: description + JSON Schema (\`type\`, \`format\`, \`pattern\`, \`enum\`) + examples.
- The model consults the tool definition **at the moment it constructs the call** — that is the point of maximum impact.
- A global system-prompt rule (B) sits far from the decision and competes with every other instruction there.
- Handler-side parsing (C) is a reasonable **second** layer, but on its own it hides the defect and silently guesses on ambiguous input ("03/05").
- A single few-shot example (D) generalizes poorly across the tool's other date parameters.
Ideal design: constrain in the schema, validate in the handler, and return a **structured error** that teaches the correct format when validation fails.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"core",
    question:`Two tools query different customer databases (retail and corporate) but have nearly identical names and descriptions, and the model confuses them. What is the best solution?`,
    options:[
      `Add a disambiguation table to the system prompt explaining when each of the two tools applies.`,
      `Merge them into a single tool with a \`database\` parameter constrained by an enum of the two backends.`,
      `Keep the names and add a \`backend\` field to each tool's response so the model can tell them apart after the call.`,
      `Rename both tools and rewrite their descriptions around their distinct backends and use cases.`],
    correct:3,
    answer:`Disambiguation belongs **in the tools themselves**: names and descriptions that express each one's specialization.
- \`search_retail_customers\` / \`search_corporate_accounts\`, with descriptions stating what data each backend holds and examples of typical queries.
- A system-prompt table (A) is fragile: the strongest signal when choosing a tool is the tool's own definition, and the table competes with everything else in the prompt.
- Merging (B) can be valid, but it moves the ambiguity into a parameter the model can also get wrong; explicit specialization is usually more robust.
- Tagging the response (C) is a post-hoc diagnostic: by then the wrong backend has already been queried.` },
  { type:"mc", sub:"2.2", lvl:"intermediate", src:"core",
    question:`A search tool fails and returns only "Error". The agent retries the same thing over and over. How should the tool respond to enable intelligent recovery?`,
    options:[
      `Return the backend's HTTP status code as the tool result content so the agent can classify the failure.`,
      `Retry inside the handler with exponential backoff, then return the same generic message if it still fails.`,
      `Return a structured error: failure type, the query that was attempted, partial results if any, and suggested alternatives.`,
      `Return an empty result set so the agent treats the search as complete and moves on to another approach.`],
    correct:2,
    answer:`Tool errors are **information for the model**: the more actionable context, the better the recovery.
A good structured error includes:
- **Failure type** (timeout, validation, permission, not found).
- **What was attempted** (the exact query).
- **Partial results** if any exist.
- **Suggested alternatives** ("narrow the date range", "use the ID instead of the name").
Why the others fall short: a bare status code (A) is opaque and lossy — a 400 does not say *which* argument was wrong. Backoff (B) is correct for transient faults but here the final message is still uninformative. An empty result (D) is actively dangerous: it makes a failure indistinguishable from a legitimate "no matches".` },
  { type:"mc", sub:"2.2", lvl:"intermediate", src:"core",
    question:`What metadata should a tool's error payload carry so the agent can decide whether retrying is worthwhile?`,
    options:[
      `A timestamp and the identifier of the backend service that failed, for correlation with server-side logs.`,
      `A failure category (transient / validation / permission), an explicit retryable flag, and a specific explanation.`,
      `The exception type and full stack trace, so the agent can reason about the root cause itself.`,
      `The backend's raw HTTP status code, which already encodes whether the call is safe to repeat.`],
    correct:1,
    answer:`The useful triad for an automated retry decision:
- **Failure category**: transient (retry), validation (fix the input), permission (escalate or abandon).
- **An explicit retryable flag**: a boolean spares the model from inferring retryability.
- **A specific explanation**: what went wrong and what to change.
Why the others fall short: timestamps and service names (A) serve human operators, not the agent's next decision. A stack trace (C) burns context and rarely maps to an action the model can take. Status codes (D) are a lossy proxy — a 500 can be permanent and a 429 is retryable only after a delay, so the agent still has to guess.
> **Note on naming:** field names such as \`errorCategory\` and \`isRetryable\` are a **design convention for your own tool result payload**, not part of the Claude API. The only error field the API itself defines on a \`tool_result\` block is \`is_error\`.` },
  { type:"mc", sub:"2.2", lvl:"advanced", src:"core",
    question:`A search tool returns an empty list both when the backend is down and when there genuinely are no results. Why is this a problem, and how is it fixed?`,
    options:[
      `It is acceptable: in both cases the agent has no records to work with and should report that to the user.`,
      `Return \`null\` on a backend failure and \`[]\` on a genuine empty result, and document the distinction in the tool description.`,
      `Retry every empty result once; if the second call is also empty, treat the result as genuinely empty.`,
      `The agent cannot tell "does not exist" from "could not query"; access failures must be flagged with \`is_error: true\`, distinct from a legitimate empty result.`],
    correct:3,
    answer:`These are two **semantically opposite** facts:
- **Legitimate empty result** → a valid conclusion: "no such record exists".
- **Backend down** → nothing is known; concluding "does not exist" would be **false**.
The tool must signal the failure explicitly. In the Claude API a \`tool_result\` block carries an optional **\`is_error: true\`** field for exactly this; in MCP the equivalent is \`isError: true\` on the tool result. The agent then retries or escalates in one case and concludes with confidence in the other.
Why the others fall short: a \`null\`/\`[]\` sentinel (B) is an out-of-band convention the model has to infer from prose, instead of a protocol-level signal it is trained to read. Blind retrying (C) doubles latency on every genuine miss and still cannot distinguish the two cases. Treating them the same (A) is precisely the bug.` },
  { type:"mc", sub:"2.2", lvl:"intermediate", src:"core",
    question:`A payments tool blocks an operation due to a fraud rule. The agent retries the same operation 5 times. What is missing from the tool's response?`,
    options:[
      `An explicit non-retryable signal plus a \`policy_violation\` category, so the agent stops and escalates instead.`,
      `Exponential backoff between attempts, so the fraud rule has time to clear before the next retry.`,
      `An HTTP 503 status, so the agent's standard retry policy treats the call as temporarily unavailable.`,
      `A clearer message telling the agent the operation was blocked and that it should try again later.`],
    correct:0,
    answer:`A block caused by a **business rule** (fraud, compliance) is **permanent**: retrying is useless and can itself look like abuse.
- A non-retryable flag + a \`policy_violation\` category + an explanation → the agent stops insisting and moves to the correct alternative (report, escalate to a human).
- Backoff (B) and a 503 (C) both encode the *opposite* claim — "try again shortly" — so they make the loop longer, not shorter.
- A friendlier message (D) is a wording fix for a semantics problem; without a machine-readable signal the agent still has to guess.
Distinguishing **transient** from **permanent** failures is the heart of tool error design.` },
  { type:"mc", sub:"2.3", lvl:"intermediate", src:"core",
    question:`A synthesis agent uses only 3 of its 12 available tools in 85% of cases. The other 9 cause occasional wrong selections. What should you do?`,
    options:[
      `Keep all 12: the wrong selections are a prompting problem, so tighten the system prompt instead.`,
      `Keep all 12 but add a system-prompt rule naming the 3 tools that cover the common case.`,
      `Narrow the agent's set to the 3 tools of the common case and cover the rest by delegating to a specialized agent.`,
      `Split the 9 rare tools into a second set that is loaded only after the first 3 return nothing useful.`],
    correct:2,
    answer:`**Tool proliferation raises the probability of wrong selection.** Every tool outside the agent's specialization is noise in the decision and tokens in the context.
- A minimal set for the **common case** (85%): less error surface, faster decisions.
- Complex cases stay covered through **coordination**: delegating to another agent that does hold those tools.
- Principle: an agent's tools should reflect its **role**, not the system's full inventory.
Why the others fall short: prompt-level guidance (A, B) leaves all 12 definitions in context, so the distracting options remain visible at decision time. Conditional loading (D) is the right pattern at a much larger scale (dozens of connectors, dynamic tool scoping), but for a fixed 3-vs-9 split it adds a discovery round trip that role-based scoping avoids entirely.` },
  { type:"mc", sub:"2.3", lvl:"basic", src:"core",
    question:`You need the model to MANDATORILY call the "extract_invoice" tool on every request (never respond with free text). Which configuration guarantees this?`,
    options:[
      `\`tool_choice: {"type": "auto"}\` combined with a system-prompt rule requiring the tool on every request.`,
      `\`tool_choice: {"type": "any", "disable_parallel_tool_use": true}\``,
      `\`tool_choice: {"type": "tool", "name": "extract_invoice"}\``,
      `\`tool_choice: {"type": "any"}\`, with \`extract_invoice\` listed first in the \`tools\` array.`],
    correct:2,
    answer:`The **\`tool_choice\`** values:
- **\`{"type": "auto"}\`** (default): the model decides whether to use a tool or reply with text.
- **\`{"type": "any"}\`**: forced to call **some** tool, but it chooses which.
- **\`{"type": "tool", "name": "..."}\`**: forced to call **that specific** tool → the guarantee the scenario asks for.
- **\`{"type": "none"}\`**: cannot use tools at all.
Why the others fall short: \`auto\` plus prompting (A) is a strong nudge, never a guarantee. \`any\` (B, D) guarantees *a* tool call, not *this* tool call, as soon as more than one tool is defined; \`disable_parallel_tool_use\` caps the call to one per turn but says nothing about which one, and array ordering carries no such guarantee.
Any \`tool_choice\` value may also carry \`disable_parallel_tool_use: true\` to limit the turn to a single tool call.` },
  { type:"mc", sub:"2.3", lvl:"intermediate", src:"core",
    question:`An extraction pipeline pins \`tool_choice: {"type": "tool", "name": "extract_invoice"}\` on every request. It must now handle three document types, each with its own extraction tool, and the downstream code still cannot process a free-text reply. What is the correct change?`,
    options:[
      `Switch to \`tool_choice: {"type": "auto"}\` and describe the three document types in the system prompt.`,
      `Switch to \`tool_choice: {"type": "any"}\`: a tool call stays guaranteed, but the model picks which of the three.`,
      `Keep \`{"type": "tool"}\` and add a prior classification request that decides which tool name to pin.`,
      `Switch to \`tool_choice: {"type": "none"}\` and parse the three document formats out of the text response.`],
    correct:1,
    answer:`The pipeline has two requirements: **always a tool call** (so free text never reaches the parser) and **the model chooses which** (so one pinned name no longer works).
- **\`{"type": "any"}\`** satisfies both by construction: tool use is mandatory, selection is the model's.
- **\`{"type": "auto"}\`** (A) restores selection but drops the guarantee — the model may still answer in prose, and the pipeline breaks.
- A classification pre-call (C) works but adds a full round trip of latency and cost per document to recover something \`any\` gives for free.
- **\`{"type": "none"}\`** (D) forbids tools entirely — the exact opposite of the requirement.` },
  { type:"vf", sub:"2.3", lvl:"basic", src:"core",
    question:`Giving an agent access to every tool available in the system improves its accuracy, because it will never lack a capability.`,
    correct:"F",
    answer:`**False.** An excess of tools **degrades** selection:
- More options = higher probability of choosing wrong, more tokens spent on definitions, slower decisions.
- Tools outside the agent's role are pure distractors.
Rule: **minimal set aligned to the role**; extra capabilities via delegation/coordination, or via dynamic tool discovery when the catalog is genuinely large.` },
  { type:"mc", sub:"2.4", lvl:"intermediate", src:"core",
    question:`Your team wants to version an MCP server's configuration in the repo, but it includes an API key. What is the correct practice?`,
    options:[
      `Commit the key in \`.mcp.json\`: the repository is private and access to it is already controlled.`,
      `Keep the server in local scope (\`~/.claude.json\`) so the key never reaches the repository at all.`,
      `Commit a \`.mcp.json.example\` with placeholder values that each developer copies to an ignored \`.mcp.json\`.`,
      `Commit \`.mcp.json\` at project scope using environment-variable expansion (\`\${API_KEY}\`), so the config is shared and the secret stays in each environment.`],
    correct:3,
    answer:`**\`.mcp.json\`** at the repo root defines MCP servers at **project scope** (shared with the team through version control).
- It supports **environment variable expansion**: \`\${VAR}\`, and \`\${VAR:-default}\` for a fallback. Expansion applies to \`command\`, \`args\`, \`env\`, \`url\`, and \`headers\`. The versioned file references the variable; the real value lives in each developer's or CI environment.
- **Never** commit secrets in plain text (A) — a private repository is not a secret store, and history is hard to purge.
- Local scope (B) does keep the key out of git, but the *configuration* is then not shared, which is the whole point of the request.
- A \`.example\` file (C) shares the shape but not the config: every change has to be re-copied by hand, and drift is invisible.
- Claude Code MCP scopes: **local** (only you, this project — stored in \`~/.claude.json\`), **project** (\`.mcp.json\`, shared via git), **user** (only you, all your projects).` },
  { type:"mc", sub:"2.4", lvl:"intermediate", src:"core",
    question:`An agent spends several exploratory calls just to discover what data an MCP server has available. Which MCP primitive eliminates that overhead?`,
    options:[
      `Add a \`list_available_data\` tool that returns the server's catalog on the agent's first call.`,
      `Resources: the server publishes a URI-addressable catalog of its data that the client can list and read directly.`,
      `Prompts: ship a reusable template whose text already describes what the server holds.`,
      `Raise the MCP tool-output token limit so one exploratory call can return the whole catalog at once.`],
    correct:1,
    answer:`**Resources** is the MCP primitive for **data exposure**: the server publishes an addressable catalog (by URI) of what it holds, discoverable with \`resources/list\` and readable with \`resources/read\`.
- The client and model can **discover and read** data without spending model turns on exploratory tool calls.
- The three server-side primitives: **tools** (executable actions), **resources** (data/context), **prompts** (reusable templates).
Why the others fall short: a catalog tool (A) works but reinvents \`resources\` as a model-invoked action — it still costs a turn and is invisible to clients that browse resources directly. A prompt (C) is a template, not a data source, and goes stale. Raising output limits (D) treats the symptom and floods the context with a catalog the agent mostly does not need.` },
  { type:"mc", sub:"2.4", lvl:"basic", src:"core",
    question:`What are the three main primitives an MCP **server** can expose?`,
    options:[
      `Tools, resources, and roots.`,
      `Tools, prompts, and sampling.`,
      `Tools, resources, and prompts.`,
      `Resources, prompts, and elicitation.`],
    correct:2,
    answer:`An MCP **server** exposes:
- **Tools**: executable functions the model invokes (actions, searches) — \`tools/list\`, \`tools/call\`.
- **Resources**: data/context addressable by URI (files, records, catalogs) — \`resources/list\`, \`resources/read\`.
- **Prompts**: reusable, parameterizable prompt templates the client can offer to the user.
The distractors each smuggle in a **client-side** feature: **roots** (filesystem boundaries the client advertises), **sampling** (the server asking the client for an LLM completion), and **elicitation** (the server asking the client for user input).
> **Spec status:** as of MCP protocol version \`2026-07-28\`, **elicitation** is the current client-side feature; **roots** and **sampling** are both marked **deprecated** and scheduled for removal.` },
  { type:"mc", sub:"2.4", lvl:"basic", src:"core",
    question:`Which transports does the MCP specification define for client-server communication?`,
    options:[
      `stdio for local processes, and Streamable HTTP for remote servers.`,
      `stdio for local processes, and HTTP+SSE for remote servers.`,
      `Streamable HTTP and WebSocket, with stdio available only for local development.`,
      `JSON-RPC over stdio only; remote access is left to each host application to implement.`],
    correct:0,
    answer:`MCP defines **two** transports:
- **stdio**: the server runs as a local process and communicates over stdin/stdout — ideal for local tools (filesystem, git), no network overhead.
- **Streamable HTTP**: HTTP POST for client-to-server messages with optional Server-Sent Events for streaming — for remote or shared servers, with standard HTTP auth (bearer tokens, API keys, OAuth).
**The old HTTP+SSE transport (B) is deprecated** and superseded by Streamable HTTP; note that Streamable HTTP still *uses* SSE internally for the streaming leg, which is why the two are easy to confuse. WebSocket (C) is not an MCP-specified transport, although individual hosts may add one. Choosing: local and per-user → stdio; centralized multi-client service → Streamable HTTP.` },
  { type:"vf", sub:"2.4", lvl:"basic", src:"core",
    question:`MCP (Model Context Protocol) is a proprietary Anthropic protocol that only works with Claude models.`,
    correct:"F",
    answer:`**False.** MCP is an **open standard** (open source) for connecting LLM applications to tools and data sources.
- It was created by Anthropic but is model-agnostic: any client or LLM can implement it.
- Its value: **standardized** integration — an MCP server written once serves any compatible client (Claude Code, Claude Desktop, IDEs, other applications).` },
  { type:"mc", sub:"2.5", lvl:"basic", src:"core",
    question:`In Claude Code, you need to find which files in the repo use the "parseInvoice" function. What is the most efficient approach?`,
    options:[
      `Use Glob to list every source file, then Read each one and scan it for the identifier.`,
      `Use the Grep tool to search the pattern across the whole codebase in a single operation.`,
      `Run a Bash \`find ... -exec grep\` pipeline so the search happens outside the tool layer.`,
      `Read the entry point and follow the import graph until the definition and its callers turn up.`],
    correct:1,
    answer:`**Grep** searches file **contents** by pattern/regex across the entire codebase in one call.
- Enumerating and reading file by file (A) costs orders of magnitude more tokens and turns.
- A Bash pipeline (C) can work, but it needs shell permission, is not portable across environments, and returns raw output with none of Grep's result shaping.
- Following imports (D) is a reasonable strategy for *understanding* a call graph, but for "where does this string appear" it is many sequential reads instead of one search.
Built-in tool selection rule: **Grep** to search contents, **Glob** to find files by name/path pattern, **Read** to read a specific known file.` },
  { type:"mc", sub:"2.5", lvl:"intermediate", src:"core",
    question:`Claude Code's Edit tool fails because the string to replace appears 3 times in the file. What is the correct recovery?`,
    options:[
      `Read the file, find surrounding context that makes the intended occurrence unique, and retry Edit with that expanded string.`,
      `Retry the same Edit with \`replace_all: true\` so the ambiguity no longer blocks the call.`,
      `Use Write to rewrite the whole file with the three occurrences already resolved correctly.`,
      `Run a Bash \`sed -i\` targeting the specific line number reported in the failure.`],
    correct:0,
    answer:`Edit performs an exact string replacement and requires \`old_string\` to appear **exactly once** in the file.
- On ambiguity: **Read** → find surrounding lines that pin down the intended occurrence → retry **Edit** with that expanded context.
- \`replace_all: true\` (B) is a real option, but it is correct only when you actually want **all** occurrences changed. Here two of the three should stay as they are, so it silently corrupts the file.
- Rewriting the whole file with Write (C) is disproportionate and risks losing content outside the edited region.
- A \`sed\` call (D) leaves the tool layer, needs shell permission, and reintroduces the same matching problem with worse error reporting.` },
  { type:"open", sub:"2.1", lvl:"advanced", src:"core",
    question:`List the characteristics of a well-designed tool for an agent (interface, documentation, errors).`,
    answer:`- **Descriptive, unambiguous name**: reflects the action and the domain (\`search_retail_customers\`, not \`search2\`).
- **Complete description**: what it does, **when to use it and when not to**, scope limits — it is the model's primary selection driver.
- **Strict input schema**: types, formats (ISO 8601, \`enum\`, \`pattern\`), required fields, with **valid and invalid examples**.
- **Predictable, structured output**: the same shape every time; content separated from metadata.
- **Machine identifiers for chaining**: return stable IDs alongside display strings so downstream tools receive an unambiguous key.
- **Structured errors**: failure type, a retryability signal, what was attempted, suggested alternatives — and always distinguish "legitimately empty" from "could not access". At the protocol level that distinction is the \`is_error\` field on the \`tool_result\` block (\`isError\` in MCP); richer fields such as a category or a retryable flag are your own payload convention on top of it.
- **Controlled response size**: pagination, total counts, and cursors so a large result set never floods the context.
- **Idempotency where possible**, plus handler-side validation — never rely on the model alone.` },
  { type:"vf", sub:"2.4", lvl:"basic", src:"core",
    question:`An MCP server can expose reusable prompt templates in addition to tools and data.`,
    correct:"V",
    answer:`**True.** MCP's **prompts** primitive lets a server publish parameterizable templates (for example "review PR", "summarize incident") that the client surfaces to the user and executes with arguments.
It complements **tools** (actions) and **resources** (data/context).` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"repos",
    question:`A multi-tool workflow chains results: search_games returns matches, then get_game_details fetches one of them. Passing game titles as free-text strings between tools causes frequent lookup failures. What is the fix?`,
    options:[
      `Add fuzzy matching in \`get_game_details\` so near-miss titles still resolve to the right record.`,
      `Normalize titles to a canonical form (case, punctuation, accents) on both sides of the chain.`,
      `Return a stable machine identifier (\`game_id\`) with each result and have downstream tools accept that instead of the display title.`,
      `Merge the two tools so the search and the detail fetch happen inside a single call.`],
    correct:2,
    answer:`**Machine identifiers over display strings** for tool chaining:
- The first tool returns each result with a stable **ID** (\`game_id\`, \`document_id\`, \`citation_id\`); downstream tools accept the ID.
- Free-text names are ambiguous (typos, duplicates, re-releases, formatting variants) and break the chain unpredictably.
Why the others fall short: fuzzy matching (A) and normalization (B) both raise the hit rate while keeping an inherently ambiguous key — they turn hard failures into silent *wrong* matches, which is worse. Merging the tools (D) removes the seam here, but the moment a third tool needs the same record you are back to passing something between calls.
Same pattern for citations in research pipelines: a persistent **citation_id** assigned at the earliest stage keeps attribution intact through every handoff.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"repos",
    question:`A tool takes a "category" parameter, and the model keeps inventing values the backend does not recognize ("tech support", "technical", "IT help"). What schema feature fixes this?`,
    options:[
      `Expand the description to list the supported categories and instruct the model to use only those.`,
      `Accept any string and map it onto a supported category inside the tool handler.`,
      `Make the parameter optional and infer the category server-side from the ticket body.`,
      `Add an \`enum\` to the parameter's schema listing the exact allowed values.`],
    correct:3,
    answer:`**Enums** bind the parameter to the backend's exact vocabulary:
- \`"category": {"type": "string", "enum": ["technical", "billing", "account"]}\` — the model must map the user's phrasing onto one of the allowed values, and the constraint is enforced at the schema level rather than hoped for in prose.
- With \`strict: true\` on the tool definition, conformance to the schema is guaranteed rather than merely likely.
Why the others fall short: a prose list (A) is the weakest form of the same constraint and degrades as the enum grows. Handler-side mapping (B) is a sensible **backstop**, but on its own you are forever chasing new variants. Making it optional and inferring server-side (C) discards the model's actual knowledge of the ticket and moves classification to a component with less context.
General rule: encode constraints in the **schema** (types, enums, patterns) whenever possible; prose descriptions are the fallback.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"repos",
    question:`A search tool can return thousands of matches, flooding the agent's context. How should the tool's response be designed?`,
    options:[
      `Return every match: the agent, not the tool, should decide what is relevant to the task.`,
      `Return the first page plus a total count and a cursor, so the agent can request more pages only when it needs them.`,
      `Truncate the response to the first 20 matches and note in the payload that the list was truncated.`,
      `Return only an aggregate — counts grouped by type — and let the agent narrow the query before seeing rows.`],
    correct:1,
    answer:`**Pagination with explicit signals**:
- First page of results + **total_count** + **next_cursor**.
- The agent learns how much exists and decides whether to fetch more — most tasks need only the first page.
Why the others fall short: returning everything (A) burns context and buries the relevant items. Plain truncation (C) is close but strictly weaker: without a total count the agent cannot judge whether it saw 20 of 21 or 20 of 4,000, and without a cursor it cannot reach page two except by re-querying. An aggregate-only response (D) is a good *second* tool for exploratory narrowing, but it forces an extra round trip even when the first page would have answered the question.` },
  { type:"mc", sub:"2.4", lvl:"advanced", src:"repos",
    question:`An MCP server from a third-party vendor labels its tools with readOnlyHint annotations. Your security team asks whether agents can safely auto-approve those tools. What is the correct position?`,
    options:[
      `Yes: \`readOnlyHint\` is part of the MCP tool schema, so a spec-compliant server cannot mislabel a destructive tool.`,
      `Yes, provided the client cross-checks each annotation against the tool's \`inputSchema\` before auto-approving it.`,
      `No: annotations are self-reported and must be treated as untrusted unless the server itself is trusted; auto-approval belongs in your own permission rules.`,
      `No: require explicit human confirmation on every MCP tool call, regardless of vendor or annotation.`],
    correct:2,
    answer:`**Annotations are hints, not guarantees.** The MCP specification is explicit: clients **MUST** consider tool annotations to be untrusted unless they come from trusted servers. The server declares its own \`readOnlyHint\` / \`destructiveHint\`, and a malicious or simply buggy server can label a destructive tool as read-only.
- Base auto-approval on **vendor trust plus your own permission configuration** (allow/deny rules, human confirmation for sensitive operations).
Why the others fall short: (A) confuses "present in the schema" with "verified" — the schema defines the field, not its truthfulness. (B) sounds rigorous but is not decidable: an input schema of \`{"path": "string"}\` is equally consistent with a read and a delete. (D) is safe but throws away the trust decision entirely; a blanket confirmation prompt on every call trains operators to click through it, which is how least privilege degrades in practice.
This is least privilege applied to MCP: grant capabilities according to what you can verify, not what the counterpart claims.` },
  { type:"mc", sub:"2.2", lvl:"advanced", src:"repos",
    question:`Where should transient failures (network timeouts) of a tool's backend be retried: inside the tool handler, or by the agent?`,
    options:[
      `Inside the handler with backoff; only errors the agent can act on — such as validation failures with specifics — are returned to it.`,
      `By the agent in every case: surfacing each retry keeps its reasoning grounded in what actually happened.`,
      `Inside the handler, but also return a warning block on success so the agent knows a retry occurred.`,
      `Nowhere: fail fast on the first error and let the orchestration layer replay the whole agent turn.`],
    correct:0,
    answer:`Split error handling by **who can fix it**:
- **Transient technical errors** (timeouts, connection resets): retry **inside the tool** with backoff — the agent gains nothing from seeing them, and every surfaced retry costs a turn and tokens.
- **Actionable errors** (invalid input, policy block): return to the agent **with specifics** so it can correct the call or change strategy.
Why the others fall short: surfacing everything (B) spends the agent's most expensive resource — turns — on plumbing it cannot influence. Retry-plus-warning (C) is defensible for observability, but the warning belongs in your telemetry, not in the model's context, where it is pure noise on a successful call. Replaying the whole turn (D) redoes correct work and multiplies cost for a fault that a 200 ms retry would have absorbed.
This keeps agent turns for decisions, not plumbing.` },
  { type:"mc", sub:"2.3", lvl:"advanced", src:"repos",
    question:`An agent platform exposes 50+ connector tools to every request, and tool-selection accuracy is degrading. What is the recommended pattern?`,
    options:[
      `Compress every tool definition to a single-line description to cut the token cost of the tool list.`,
      `Add a routing table to the system prompt mapping request keywords to the appropriate connectors.`,
      `Split the connectors across several specialized agents and put a router agent in front of them.`,
      `Dynamic tool scoping: expose a small search/discovery tool over the catalog and load only the connectors each request needs.`],
    correct:3,
    answer:`Tool-selection quality **degrades as the tool count grows** — dozens of similar definitions dilute the decision and consume context.
- **Dynamic scoping**: a discovery step (search over the tool catalog) determines which handful of connectors this request needs, and only those are loaded. The Claude API implements this with a tool-search tool plus \`defer_loading\` on the deferred tools; because definitions are *appended* rather than swapped, the prompt cache survives.
Why the others fall short: shortening descriptions (A) reduces tokens but removes exactly the disambiguating detail the model needs, so accuracy usually gets worse. A keyword routing table (B) fires on surface matches and is brittle — it is the failure mode, not the fix. Splitting into sub-agents (C) is genuinely defensible and sometimes right, but each agent still carries a static subset, so it adds coordination hops without adapting to the individual request.
Same principle as agent design: the model should see the **minimal set** relevant to the task at hand.` },
  { type:"mc", sub:"2.3", lvl:"advanced", src:"ptest",
    question:`Fact-verification requests loop through the coordinator for every trivial check, adding latency. Complex verifications, however, genuinely need coordinator judgment. What tool design resolves this?`,
    options:[
      `Keep every verification on the coordinator route so behavior stays consistent and centrally auditable.`,
      `Give the agent a limited-scope \`verify_fact\` tool for simple checks, while complex verifications keep going through the coordinator.`,
      `Cache the coordinator's verdicts so repeated trivial checks are answered from the cache instead of the coordinator.`,
      `Give the agent the coordinator's full verification tool set so it never has to escalate at all.`],
    correct:1,
    answer:`**Scope-split tooling**: a narrow, safe **\`verify_fact\`** tool handles the high-volume simple case directly; the coordinator route remains for cases that need judgment.
- This mirrors the 80/20 tool-scoping principle: optimize the common path with a limited tool, preserve the escalation path for the rest.
- The tool's **limited scope** is what makes direct access safe — it cannot be misused for the complex cases it was not designed for.
Why the others fall short: routing everything through the coordinator (A) is the status quo the scenario is asking you to fix. Caching (C) helps only on *repeat* checks and leaves every first-time trivial check paying full coordinator latency. Handing over the full tool set (D) removes the latency but also removes the scope boundary — the agent can now attempt exactly the complex verifications that required judgment.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"ptest",
    question:`An agent consistently picks customer-account tools whenever the user's message contains the word "account", even when the request is about something else. Tool descriptions look fine. Where should you look next?`,
    options:[
      `The input schemas: an over-broad \`account_id\` parameter makes the customer tools look applicable to anything.`,
      `The conversation history: an earlier turn used the customer tools and the model is anchoring on that precedent.`,
      `The system prompt: a keyword routing rule ("if the user mentions account, use the customer tools") is firing on a surface match.`,
      `The few-shot examples: every worked example in the prompt happens to involve a customer account.`],
    correct:2,
    answer:`When tool descriptions are healthy but selection is systematically wrong on a **specific token**, audit the **system prompt**: hard keyword rules ("mentions X → use tool Y") are blunt instruments that fire on superficial matches regardless of intent.
- Fix: remove the keyword rule and let selection rest on **intent + tool descriptions**, or rewrite the rule to describe intent rather than a literal word.
The other three are all real causes of misrouting and worth checking — but each predicts a different signature. A permissive schema (A) produces broad over-selection, not one keyed to a single word. History anchoring (B) would show up as *stickiness within a conversation*, not on the first turn. Skewed few-shot examples (D) bias the prior generally, again without the word-level trigger. The reported symptom — deterministic, tied to one literal token — points at an explicit rule.
Diagnostic order: descriptions first, then system-prompt interference, then examples.` },
  { type:"mc", sub:"2.4", lvl:"basic", src:"video1",
    question:`What does an MCP server need before being exposed in production that a local prototype typically lacks?`,
    options:[
      `The operational rigor of any production API: authentication and authorization on tool calls, rate limiting, and structured error handling.`,
      `A transport change from stdio to Streamable HTTP so that multiple clients can reach the same instance.`,
      `\`readOnlyHint\` and \`destructiveHint\` annotations on every tool so that clients can auto-approve calls safely.`,
      `Publication in a public MCP registry so that client applications can discover and install it.`],
    correct:0,
    answer:`An MCP server **is** an API in production terms:
- **AuthN/AuthZ**: who may call which tools. Agents can be manipulated, so the server must enforce its own access control rather than trusting the caller.
- **Rate limiting**: an agent in a loop can hammer a backend.
- **Error handling**: structured, actionable errors instead of crashes.
Why the others fall short: the transport move (B) is a real and often necessary step for a shared deployment, but it is packaging — an unauthenticated Streamable HTTP server is *more* exposed than the stdio prototype was, not less. Annotations (C) are self-reported hints the spec tells clients to treat as untrusted, so they are not a security control. Registry publication (D) is distribution, not readiness.
Prototype-to-production is mostly about these operational layers, not about the tools themselves.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"video2",
    question:`Every tool in an agent has a single-sentence description, and tool selection is unreliable. The team debates building an ML-based tool-routing classifier. What is the most effective FIRST step?`,
    options:[
      `Expand the tool descriptions: input formats, triggering conditions, prerequisites, and when-NOT-to-use boundaries.`,
      `Build the routing classifier: it targets selection directly and its accuracy is measurable end to end.`,
      `Fine-tune the model on tool-selection decisions logged from production traffic.`,
      `Add few-shot examples of correct tool calls to the system prompt and measure the change.`],
    correct:0,
    answer:`Two exam patterns in one:
- **The stated defect points to the fix**: "single-sentence descriptions" is the smoking gun — enrich them (formats, conditions, boundaries) before anything else.
- **Premature infrastructure trap**: a classifier (B) or a fine-tune (C) each adds a component, new failure modes, training data requirements, and ongoing maintenance — unjustifiable before the config-level fix has been tried.
- Few-shot examples (D) are the closest competitor and are genuinely cheap, but they sit in the system prompt, cost tokens on every request, and only cover the cases you enumerate; the description is read at the exact moment of selection and covers the tool's whole surface.
"Most effective first step" questions reward the **cheapest adequate intervention**, not the most sophisticated one.` },
  { type:"mc", sub:"2.3", lvl:"advanced", src:"video2",
    question:`A synthesis-only agent keeps calling web_search mid-synthesis, degrading its output. The model clearly understands what web_search does. Why is "improve the tool descriptions" the WRONG fix here?`,
    options:[
      `Because the failure is over-provisioning, not comprehension: the agent holds a tool outside its role, and no wording change removes its access to it.`,
      `Because description changes take effect only after the tool schema is re-registered with the client, so they cannot fix a running agent.`,
      `Because the model always weights system-prompt instructions above tool descriptions, so a description is never the deciding factor.`,
      `Because the fix belongs in the error path: web_search should return \`is_error\` during synthesis so the agent stops calling it.`],
    correct:0,
    answer:`Diagnose **which** failure you have:
- **Misrouting from confusion** → fix descriptions (the model picked the wrong tool because the definitions were unclear).
- **Distraction from over-provisioning** → fix **access**: remove tools outside the agent's role.
Here the model understands \`web_search\` perfectly and still should not use it, so no description rewrite changes the outcome. Scoped tool access is the structural fix: a tool the agent cannot see is a tool it cannot be tempted to call.
Why the others fall short: (B) invents a constraint — tool definitions are sent with every request, so a changed description applies on the very next call. (C) is false as stated: both the system prompt and the tool definitions feed the decision, and neither strictly dominates. (D) is a symptom-level fix — it turns every synthesis turn into a wasted call plus an error round trip, and relies on the tool knowing the agent's phase, which it does not.
This distinction is a favorite exam trap: "better descriptions" sounds always-right, but it only fixes comprehension problems.` },
  { type:"vf", sub:"2.5", lvl:"basic", src:"video2",
    question:`In Claude Code, the Glob tool searches inside file contents, while Grep matches file paths by pattern.`,
    correct:"F",
    answer:`**False — it is exactly the other way around**:
- **Grep** searches file **contents** (regex over text).
- **Glob** finds files by **path/name** pattern (\`src/**/*.ts\`).
Workflow for a large unfamiliar repo: Glob to narrow by structure, Grep to locate by content, and only then Read the handful of relevant files — reading broadly first exhausts the context window.` },
]},

/* ============ DOMAIN 3: CLAUDE CODE (20%) ============ */
{ id:"code", name:"💻 Claude Code (20%)", questions:[
  { type:"mc", sub:"3.1", lvl:"basic", src:"core",
    question:`Your team wants the same coding conventions to apply to every developer working in the repository with Claude Code, on every machine, without any manual setup step. Where should those conventions be written?`,
    options:[
      `In \`~/.claude/CLAUDE.md\` on each developer's machine, so they apply across all their projects.`,
      `In \`CLAUDE.local.md\` at the repository root, alongside the project's other memory files.`,
      `In \`CLAUDE.md\` at the repository root, committed to version control.`,
      `In the \`claudeMd\` key of the project's \`.claude/settings.json\`, committed to version control.`],
    correct:2,
    answer:`Team standards belong in the **project memory file**: \`./CLAUDE.md\` (or \`./.claude/CLAUDE.md\`), committed to source control so every clone gets it automatically.
- **\`~/.claude/CLAUDE.md\`** is *user* scope: personal preferences across all your projects, never shared.
- **\`CLAUDE.local.md\`** loads alongside \`CLAUDE.md\` but is meant to be gitignored — personal project notes, not team standards.
- **\`claudeMd\`** is a real settings key, but it is honored **only in managed/policy settings**. Setting it in user, project, or local settings has no effect.
- Load order, broadest to most specific: managed policy → user (\`~/.claude/CLAUDE.md\`) → project (\`./CLAUDE.md\`, \`./.claude/CLAUDE.md\`) → \`CLAUDE.local.md\`. Files are concatenated, not overridden; more specific files are read last.` },
  { type:"vf", sub:"3.1", lvl:"basic", src:"core",
    question:`In a project that has both files, \`CLAUDE.md\` and \`CLAUDE.local.md\` are both loaded into context, and at the same directory level \`CLAUDE.local.md\` is appended after \`CLAUDE.md\`.`,
    correct:"V",
    answer:`**True.** Claude Code walks up the directory tree from the working directory and loads both \`CLAUDE.md\` and \`CLAUDE.local.md\` from each level. Within a directory, \`CLAUDE.local.md\` is appended **after** \`CLAUDE.md\`, so your personal notes are the last thing read at that level.
- \`CLAUDE.local.md\` is **not deprecated**: it is the documented location for personal, project-specific preferences (sandbox URLs, preferred test data).
- Nothing gitignores it for you — you add it to \`.gitignore\` yourself. That is what keeps it personal; team standards still belong in \`CLAUDE.md\`.
- Across git worktrees a gitignored \`CLAUDE.local.md\` exists only where you created it; to share personal instructions across worktrees, import a file from your home directory instead.` },
  { type:"mc", sub:"3.3", lvl:"intermediate", src:"core",
    question:`A monorepo's root \`CLAUDE.md\` has grown past 600 lines. Most of it is area-specific (frontend conventions, backend conventions, infra), yet all of it loads into every session regardless of what is being worked on. Which reorganization actually reduces the per-session context cost?`,
    options:[
      `Split the file into six topic files and pull them in from the root \`CLAUDE.md\` with \`@\` imports.`,
      `Move the area-specific sections into skills, so Claude loads them only when it judges them relevant.`,
      `Pass the area-specific guidance with \`--append-system-prompt\`, using one launch profile per area.`,
      `Move the area-specific sections into \`.claude/rules/\` files with a \`paths\` glob in their frontmatter.`],
    correct:3,
    answer:`**Path-scoped rules** are the mechanism designed for this. Markdown files in \`.claude/rules/\` may carry YAML frontmatter with a \`paths\` field of glob patterns; such a rule loads **only when Claude works with matching files**, so unrelated areas never enter context.

\`\`\`markdown
---
paths:
  - "src/api/**/*.ts"
---
# API rules
\`\`\`

- Rules **without** a \`paths\` field load unconditionally, at the same priority as \`.claude/CLAUDE.md\`.
- \`@\` **imports** improve organization but imported files are expanded into context **at launch**, so they do not reduce startup cost.
- **Skills** are the right home for multi-step procedures, but they are invoked or model-selected — they do not activate deterministically on a file read.
- \`--append-system-prompt\` is a real flag, but it must be passed on every invocation and is aimed at scripting, not at shared repository configuration.` },
  { type:"mc", sub:"3.1", lvl:"intermediate", src:"core",
    question:`A teammate proposes splitting the repository's 600-line \`CLAUDE.md\` into six files referenced with \`@\` imports, arguing this will cut the tokens consumed at session start. How should you assess the proposal?`,
    options:[
      `It works as described: imported files load on demand, only when Claude reads files they relate to.`,
      `It helps organization only: imported files are expanded into context at launch, so startup cost is unchanged.`,
      `It fails: \`@\` imports are resolved only in \`~/.claude/CLAUDE.md\`, not in project-level memory files.`,
      `It fails: imports are limited to a single level, so a six-file split exceeds what the syntax supports.`],
    correct:1,
    answer:`\`@path/to/import\` **composes** files; it does not defer them. Imported files are expanded and loaded into context at launch alongside the \`CLAUDE.md\` that references them, so the token cost is the same.
- Imports are supported in project **and** user memory files; relative paths resolve against the file containing the import.
- Imports can nest recursively to a maximum depth of **four hops** — a six-file flat split is well within that.
- To genuinely reduce startup context, use **path-scoped rules** in \`.claude/rules/\`.
- Note the security behavior: an import in a *project* memory file whose path resolves **outside** the working directory triggers a one-time approval dialog; imports in user-scope files load without it.` },
  { type:"mc", sub:"3.2", lvl:"basic", src:"core",
    question:`You wrote a PR review prompt that the whole team should be able to invoke as \`/review-pr\`, and it must stay in sync as the repository's review standards evolve. Where do you put it?`,
    options:[
      `\`.claude/commands/review-pr.md\` in the repository, committed with the project.`,
      `\`~/.claude/commands/review-pr.md\`, circulating the file so teammates can copy it locally.`,
      `\`~/.claude/skills/review-pr/SKILL.md\`, so it is available in every project you work on.`,
      `\`.claude/agents/review-pr.md\` in the repository, so the review runs as a dedicated subagent.`],
    correct:0,
    answer:`Project-scoped commands live in the repository's **\`.claude/commands/\`** directory, so they are versioned with the code and available to everyone who clones it. A project skill at \`.claude/skills/review-pr/SKILL.md\` is equally valid — custom commands have been merged into skills, and both create \`/review-pr\`.
- \`~/.claude/commands/\` and \`~/.claude/skills/\` are **personal** scope: not shared, and copies drift.
- \`.claude/agents/\` defines **subagents** (a worker with its own context and tool restrictions), not a slash command; a subagent is a different artifact from a prompt you invoke by name.
- Where a skill or command is invoked from also matters: a *personal* skill overrides a *project* skill of the same name.` },
  { type:"mc", sub:"3.2", lvl:"basic", src:"core",
    question:`A skill's body must reference the individual arguments passed to it. Invoked as \`/migrate-component SearchBar React Vue\`, which placeholder expands to \`SearchBar\`?`,
    options:[
      `\`$1\`, because positional placeholders in skill content are numbered starting at one.`,
      `\`$0\`, because \`$N\` is shorthand for \`$ARGUMENTS[N]\` and the indexing is zero-based.`,
      `\`$ARGUMENTS\`, which expands to the first argument when more than one is supplied.`,
      `\`\${ARG1}\`, the named-argument form declared through the \`arguments\` frontmatter field.`],
    correct:1,
    answer:`\`$ARGUMENTS[N]\` accesses an argument by **zero-based** index, and \`$N\` is its shorthand — so \`$0\` is the first argument, \`$1\` the second, \`$2\` the third.
- \`$ARGUMENTS\` always expands to the **full** argument string as typed. If the content contains no \`$ARGUMENTS\`, Claude Code appends \`ARGUMENTS: <value>\` to the end of the skill content.
- Indexed arguments use shell-style quoting: \`/my-skill "hello world" second\` makes \`$0\` expand to \`hello world\`.
- The \`arguments\` frontmatter field declares **named** positional arguments substituted as \`$name\`; there is no \`\${ARG1}\` form.
- An indexed placeholder with no matching argument is left in the content unchanged.` },
  { type:"mc", sub:"3.4", lvl:"basic", src:"core",
    question:`You are about to start a framework migration that touches half the codebase and admits several defensible approaches. Which starting configuration best matches that risk profile?`,
    options:[
      `\`acceptEdits\` mode, reviewing the accumulated diff once the migration has been carried out.`,
      `Delegate the whole migration to an Explore subagent so its research stays out of your context.`,
      `Plan mode: Claude researches and proposes a plan, and edits stay blocked until you approve it.`,
      `Write the target architecture into \`CLAUDE.md\` first, then run the migration in Manual mode.`],
    correct:2,
    answer:`**Plan mode** tells Claude to research and propose changes without making them: it reads files and runs exploratory commands, then presents a plan, and **edits stay blocked until you approve it**. That is exactly the shape of a high-ambiguity, wide-blast-radius change.
- Enter it with \`Shift+Tab\`, by prefixing a prompt with \`/plan\`, or with \`claude --permission-mode plan\`; \`defaultMode: "plan"\` in settings makes it the default.
- \`acceptEdits\` removes the prompts but not the risk — you discover a wrong approach after half the repo is rewritten.
- **Explore** is read-only research; it produces understanding, not an approved plan, and it deliberately skips \`CLAUDE.md\` to stay cheap.
- Recording the target architecture in \`CLAUDE.md\` is useful, but it is durable context, not a checkpoint before execution.` },
  { type:"mc", sub:"3.4", lvl:"basic", src:"core",
    question:`You need to correct a typo in a user-facing error string. You already know the file and the line, and the change is one word. Which setup is proportionate?`,
    options:[
      `Plan mode, so Claude first confirms the string is not referenced anywhere else before editing.`,
      `\`bypassPermissions\` mode, since a one-word change does not warrant any safety checks.`,
      `\`dontAsk\` mode, with an allow rule scoped to \`Edit\` on that specific file.`,
      `Manual (\`default\`) mode, approving the single edit when Claude proposes it.`],
    correct:3,
    answer:`Match the ceremony to the risk. For a scoped change in a known location, **Manual mode** (config value \`default\`) — where Claude asks before each write — is the proportionate choice; plan mode's research-and-approve cycle adds a round trip and buys nothing.
- Plan mode earns its cost when scope is wide or the approach is contested, not for a known one-line edit.
- \`bypassPermissions\` disables prompts and safety checks and is documented for **isolated containers and VMs only**; it also cannot be entered from a session that did not start with it enabled.
- \`dontAsk\` **auto-denies** anything not pre-approved and never waits for input — it is built for CI and locked-down scripts, not interactive work.` },
  { type:"mc", sub:"3.4", lvl:"intermediate", src:"core",
    question:`Understanding an unfamiliar service means grepping across hundreds of files, and those search results crowd out the context you need for the implementation that follows. What prevents the problem rather than cleaning up after it?`,
    options:[
      `Run the searches yourself in a terminal and paste only the relevant excerpts into the session.`,
      `Delegate the sweep to the Explore subagent, which works in its own context window and returns a summary.`,
      `Run \`/compact\` once the exploration phase is finished, to summarize the search output away.`,
      `Finish exploring, then start a fresh session for the implementation, seeded with written notes.`],
    correct:1,
    answer:`A **subagent runs in its own context window** with its own system prompt and tool access; the file reads and search output never touch the main conversation, and only the final summary returns. **Explore** is the built-in subagent for exactly this, invoked with a thoroughness level (quick, medium, very thorough).
- Explore and Plan deliberately skip \`CLAUDE.md\` and the parent session's git status to keep research fast and cheap; every other built-in and custom subagent loads both.
- \`/compact\` and a fresh session are both **recovery** moves: the context was already spent, and compaction is lossy.
- Custom subagents are defined in \`.claude/agents/\` (project) or \`~/.claude/agents/\` (user).` },
  { type:"mc", sub:"3.5", lvl:"intermediate", src:"core",
    question:`Commit messages come out in inconsistent shapes even though \`CLAUDE.md\` describes the required format in prose. What is the most effective change?`,
    options:[
      `Add two or three example commits to \`CLAUDE.md\` showing the exact format expected.`,
      `Restate the rule in imperative form at the top of \`CLAUDE.md\`, so it is the first thing read.`,
      `Move the rule into \`~/.claude/CLAUDE.md\`, which is loaded before project instructions.`,
      `Add a \`commit-msg\` git hook that rejects non-conforming messages so Claude has to retry.`],
    correct:0,
    answer:`For **format** problems, concrete examples outperform prose specification: two to four samples showing the exact structure convey the pattern more reliably than paragraphs describing it. The same principle applies to API prompts (Domain 4).
- Restating or reordering the prose is a marginal fix — the documentation's own guidance is specificity ("use 2-space indentation" beats "format code properly"), and an example is the most specific form available.
- Moving the rule to user scope changes **who** it applies to, not how well it is followed, and it stops being a team standard.
- A \`commit-msg\` git hook enforces the shape but only after the fact, converting a formatting problem into a retry loop; it also lives outside Claude Code's configuration.
- Remember that \`CLAUDE.md\` is context, not enforcement. For an action that must happen at a fixed point, use a Claude Code hook.` },
  { type:"mc", sub:"3.5", lvl:"intermediate", src:"core",
    question:`You need a feature implemented in a subsystem Claude has not seen, and the requirements you were handed are vague. Which approach most improves the first implementation?`,
    options:[
      `Ask Claude for three candidate designs and choose one yourself before it writes any code.`,
      `Point Claude at the closest existing feature and ask it to mirror that implementation.`,
      `Ask Claude to interview you first about requirements, constraints, and existing patterns.`,
      `Write the missing requirements into \`CLAUDE.md\` first, so they persist across sessions.`],
    correct:2,
    answer:`The **interview pattern** attacks the actual bottleneck: the requirements are ambiguous and the architecture is unknown, so the cheapest next token is a question. Claude surfaces the constraints and design decisions **before** committing to an implementation.
- Asking for three designs presumes the requirements are settled — you would be choosing between three answers to the wrong question.
- Mirroring the nearest feature propagates whatever that feature got wrong, and silently assumes the two cases are analogous.
- Writing requirements into \`CLAUDE.md\` is right *after* you know them; it cannot resolve ambiguity you have not yet surfaced, and standing conventions, not one feature's requirements, are what belongs there.
- A handful of clarifying questions costs far less than an implementation aimed in the wrong direction.` },
  { type:"mc", sub:"3.5", lvl:"advanced", src:"core",
    question:`A review returns six issues. Two of them are coupled — changing either affects the other — and the remaining four are independent. How should the fixes be sequenced?`,
    options:[
      `Fix all six in one pass, then run the full suite once at the end to catch any interaction.`,
      `Fix the four independent ones as a single batch, then the two coupled ones one at a time.`,
      `Fix all six strictly one at a time in severity order, verifying the suite after each fix.`,
      `Fix the two coupled ones together, then the four independent ones one at a time with verification.`],
    correct:3,
    answer:`The rule follows the dependency structure, not a fixed policy:
- **Coupled** issues are fixed **together**: addressing them separately produces conflicting intermediate states and rework.
- **Independent** issues are fixed **sequentially with verification**, so a regression is attributable to exactly one change.
- Fixing all six at once mixes effects: when the suite goes red, you cannot tell which change caused it.
- Batching the four independent ones inverts the rule — batching is the remedy for coupling, not for independence.
- Strict one-at-a-time is disciplined but wrong for the coupled pair, and severity order is irrelevant to isolating regressions.` },
  { type:"mc", sub:"3.6", lvl:"basic", src:"core",
    question:`A CI job must run one Claude Code review and emit machine-readable output for the next pipeline step. Which invocation is correct?`,
    options:[
      `\`claude --bg "review the diff" --output-format json\``,
      `\`claude -p "review the diff" --output-format json\``,
      `\`claude --permission-mode dontAsk "review the diff" --output-format json\``,
      `\`claude -p "review the diff" --input-format json\``],
    correct:1,
    answer:`**\`-p\` / \`--print\`** runs Claude Code non-interactively: it executes the prompt, prints the response, and exits. **\`--output-format\`** is a print-mode option accepting \`text\`, \`json\`, or \`stream-json\`.
- \`--bg\` / \`--background\` starts a background agent session and returns immediately; it **cannot be combined with \`-p\`**.
- \`--permission-mode dontAsk\` is a sensible companion for CI, but on its own it starts an interactive session — the job would hang. \`--output-format\` needs print mode.
- \`--input-format\` controls the **input** side and accepts only \`text\` or \`stream-json\`; \`json\` is not a valid value there.` },
  { type:"mc", sub:"3.6", lvl:"intermediate", src:"core",
    question:`The CI reviewer's findings must be posted as line-level PR comments, so the pipeline needs each finding as a record with file, line, severity, and comment. Which approach gives the pipeline data it can rely on?`,
    options:[
      `Extract \`file:line\` pairs from the printed text output using a regular expression.`,
      `Use \`--output-format json\` and parse the prose in the result field with a small script.`,
      `Use \`--json-schema\` with a schema for the findings, so print-mode output is validated against it.`,
      `Ask for a Markdown table in the prompt and parse its rows in the pipeline step.`],
    correct:2,
    answer:`**\`--json-schema\`** (print mode only) returns output **validated against a JSON Schema** you supply after the agent finishes its workflow — the pipeline gets a typed object, not text it has to interpret.

\`\`\`bash
claude -p --json-schema '{"type":"object", ...}' "review the diff"
\`\`\`

- \`--output-format json\` wraps the run in a JSON envelope, but the model's answer inside it is still free text: you have moved the parsing problem, not solved it.
- Regexes over prose and Markdown tables are format conventions the model is merely asked to honor; nothing enforces them, and they fail silently.
- Claude Code exits with an error on an invalid schema, so a broken schema fails the job rather than degrading quietly.
- Same principle as Domain 4: when output feeds software, structure is enforced, not requested.` },
  { type:"mc", sub:"3.6", lvl:"intermediate", src:"core",
    question:`The automated CI reviewer keeps proposing tests that already exist and changes that contradict repository conventions. What addresses the root cause?`,
    options:[
      `Pass the conventions with \`--append-system-prompt\` on every CI invocation.`,
      `Add \`permissions.deny\` rules so the reviewer cannot comment on those areas.`,
      `Include the full diff and the repository's README in the prompt on every run.`,
      `Document the conventions and the existing test layout in the repository's \`CLAUDE.md\`.`],
    correct:3,
    answer:`The reviewer cannot respect conventions it has never been told about. **\`CLAUDE.md\` loads in print mode exactly as it does interactively**, so the repository's own memory file is the durable, versioned channel: standards and conventions, where tests live and what they cover, and architectural decisions already made.
- \`--append-system-prompt\` does inject instructions, but it must be repeated on every invocation and lives in CI configuration rather than the repository — it drifts, and interactive sessions never see it.
- \`permissions.deny\` controls what the tool may **do**, not what it knows; silencing an area removes coverage instead of fixing accuracy.
- Attaching the README adds volume, not the specific facts that are missing (test coverage, naming rules, prior decisions).` },
  { type:"mc", sub:"3.7", lvl:"basic", src:"core",
    question:`Every \`Bash\` call matching \`git push --force\` must be rejected before it runs, regardless of permission mode and without relying on Claude's judgement. Which hook event do you register the check on?`,
    options:[
      `PreToolUse`,
      `PermissionRequest`,
      `PostToolUse`,
      `PermissionDenied`],
    correct:0,
    answer:`**PreToolUse** runs before a tool call executes and **can block it** — a handler exiting with code 2 stops the call and surfaces stderr to Claude. It fires for matching calls irrespective of what Claude intended.
- **PermissionRequest** fires around the permission decision, so it does not see calls that an allow rule or the current mode already approved.
- **PostToolUse** runs after the call succeeded — too late to prevent anything; it is for validating or reformatting results.
- **PermissionDenied** is a notification of a denial, not a control point.
- Other events in the lifecycle include \`UserPromptSubmit\`, \`SessionStart\`, \`SessionEnd\`, \`Stop\`, \`SubagentStart\`/\`SubagentStop\`, \`PreCompact\`/\`PostCompact\`, \`Notification\`, and \`InstructionsLoaded\`.` },
  { type:"vf", sub:"3.7", lvl:"basic", src:"core",
    question:`A \`PreToolUse\` hook handler that exits with status code 2 blocks the tool call, and it does so regardless of what Claude decided to do.`,
    correct:"V",
    answer:`**True.** Hooks are configured handlers that Claude Code fires at fixed lifecycle events; they are not instructions the model weighs up. For \`PreToolUse\`, **exit code 2 blocks the tool call** and the reason is returned to Claude.
- This is why hooks — not \`CLAUDE.md\` prose — are the mechanism for hard policy: blocking dangerous commands, formatting after every edit, validating before a commit.
- Handlers are not limited to shell commands: the documented types are \`command\`, \`http\`, \`mcp_tool\`, \`prompt\`, and \`agent\`. Only \`command\` hooks are fully deterministic; \`prompt\` and \`agent\` handlers involve a model.
- All matching hooks for an event run in parallel, and identical handlers are deduplicated.
- Rule of thumb: instruction = probabilistic; \`command\` hook or \`permissions.deny\` = enforced.` },
  { type:"mc", sub:"3.7", lvl:"intermediate", src:"core",
    question:`Claude Code must never read the project's \`.env\` files or run \`rm -rf\`, in every session and on every teammate's machine. What is the simplest configuration that enforces this?`,
    options:[
      `\`permissions.ask\` rules for \`Read(./.env)\` and \`Bash(rm -rf *)\`, so each attempt needs approval.`,
      `\`permissions.deny\` rules for \`Read(./.env)\` and \`Bash(rm -rf *)\` in the project's \`settings.json\`.`,
      `A \`PreToolUse\` hook committed to the project that inspects each call and exits 2 on a match.`,
      `\`--disallowedTools "Read" "Bash"\` in the launch command the team is instructed to use.`],
    correct:1,
    answer:`**\`permissions.deny\`** rules in \`settings.json\` are client-side enforcement, applied regardless of what Claude decides and in **every** permission mode, including \`bypassPermissions\`. Committing them in \`.claude/settings.json\` distributes them with the repository.

\`\`\`json
{ "permissions": { "deny": ["Read(./.env)", "Read(./.env.*)", "Bash(rm -rf *)"] } }
\`\`\`

- **\`ask\`** guarantees a prompt, not a block — a distracted approval defeats it.
- A \`PreToolUse\` hook can enforce the same thing, but it is more machinery for a rule the permission system already expresses declaratively, and project hooks only take effect after the workspace trust dialog is accepted.
- \`--disallowedTools "Read" "Bash"\` removes those tools wholesale, crippling ordinary work, and depends on everyone remembering the flag.
- Settings precedence, highest first: **managed → command-line arguments → local (\`.claude/settings.local.json\`) → project (\`.claude/settings.json\`) → user (\`~/.claude/settings.json\`)**. Permission rules **merge** across scopes rather than overriding, so a managed deny cannot be undone downstream.` },
  { type:"open", sub:"3.1", lvl:"advanced", src:"core",
    question:`Describe Claude Code's memory file hierarchy: the levels, their file locations, what each is for, which one is shared with the team, and how the levels combine.`,
    answer:`Load order runs from broadest scope to most specific, and all discovered files are **concatenated** into context rather than overriding one another — the more specific file is simply read last.

1. **Managed policy** — \`/Library/Application Support/ClaudeCode/CLAUDE.md\` (macOS), \`/etc/claude-code/CLAUDE.md\` (Linux/WSL), \`C:\\Program Files\\ClaudeCode\\CLAUDE.md\` (Windows). Deployed by IT via MDM or Group Policy; applies to every session on the machine and **cannot be excluded** by individual settings. The \`claudeMd\` key in \`managed-settings.json\` is an alternative to shipping the file.
2. **User** — \`~/.claude/CLAUDE.md\`. Personal preferences across all your projects; never shared.
3. **Project** — \`./CLAUDE.md\` or \`./.claude/CLAUDE.md\`. **This is the team-shared level**: committed to source control, it carries architecture, coding standards, build and test commands, and common workflows.
4. **Local** — \`./CLAUDE.local.md\`. Personal project-specific preferences; you add it to \`.gitignore\`. It loads immediately after \`CLAUDE.md\` at the same directory level.

**Resolution.** Claude Code walks up the directory tree from the working directory, loading \`CLAUDE.md\` and \`CLAUDE.local.md\` at each level, ordered from filesystem root down to the working directory. Files in **subdirectories** are not loaded at launch — they load on demand when Claude reads a file in that directory.

**Complements.**
- **\`@path/to/import\`** composes files (relative or absolute, recursive to four hops). Imports expand at launch, so they aid organization but do not reduce context. An import in a project file resolving outside the working directory triggers a one-time approval dialog.
- **\`.claude/rules/\`** (project) and **\`~/.claude/rules/\`** (user): topic files, discovered recursively. With a \`paths\` glob in YAML frontmatter they load **only** when Claude works with matching files; without it they load unconditionally at \`.claude/CLAUDE.md\` priority. User rules load before project rules.
- **Auto memory** at \`~/.claude/projects/<project>/memory/\`: notes Claude writes itself, with \`MEMORY.md\` loaded each session (first 200 lines or 25KB).
- **\`claudeMdExcludes\`** skips ancestor files by glob in monorepos — except the managed policy file.

**Caveats.** Target under 200 lines per file: longer files consume more context and reduce adherence. Memory is context, not enforcement — for a guarantee, use a \`PreToolUse\` hook or \`permissions.deny\`. Verify what actually loaded with \`/context\`.` },
  { type:"open", sub:"3.6", lvl:"advanced", src:"core",
    question:`Explain how you would integrate Claude Code into a CI/CD pipeline for automated PR review: invocation, output format, context, permissions, and false-positive control.`,
    answer:`- **Headless invocation**: \`claude -p "<review prompt>"\` in the CI job. \`-p\` / \`--print\` executes the prompt, prints the result, and exits. Note it cannot be combined with \`--bg\`.
- **Structured output**: \`--json-schema '<schema>'\` (print mode only) returns output validated against your findings schema — file, line, severity, comment — so the job posts comments without parsing prose. \`--output-format json\` alone only wraps the run; the answer inside remains free text. Use \`stream-json\` when the job needs incremental events.
- **Repository context**: keep standards, conventions, and the existing test layout in the committed \`CLAUDE.md\`; it loads in print mode exactly as it does interactively, which is what stops the reviewer from proposing duplicate tests or convention-violating changes. Scope area-specific guidance with \`paths\` frontmatter in \`.claude/rules/\`.
- **Permissions**: run read-only. \`--permission-mode dontAsk\` auto-denies anything not pre-approved and never waits for input — the correct mode for CI, since the session cannot block on a prompt. Pair it with narrow \`--allowedTools\` (for example \`"Read"\`, \`"Bash(git diff *)"\`) and \`permissions.deny\` for anything destructive. Note that in print mode repeated classifier blocks abort the session rather than prompting.
- **False-positive control**: state the review criteria explicitly — which patterns to flag, which to exclude — with examples, and pass prior findings into context so the reviewer reports only new or still-unresolved issues instead of rediscovering everything each commit.
- **Independence**: review in a **separate invocation** from any generation step, so the reviewer sees the diff rather than the reasoning that produced it.
- **Budget**: cap turns and wall-clock time; a blocking check must be fast, which also rules out the asynchronous Batch API for this use.
- **Verification**: treat findings as candidates; a second pass that confirms each one before posting trades a little cost for a large reduction in noise.` },
  { type:"mc", sub:"3.2", lvl:"intermediate", src:"repos",
    question:`A repository has two kinds of guidance: coding conventions that should shape every request, and a twelve-step release checklist that matters only when someone is cutting a release. How should each be stored?`,
    options:[
      `Both in \`CLAUDE.md\`, with the release checklist under its own clearly labelled heading.`,
      `Conventions in \`.claude/rules/\` scoped with \`paths\`; the release checklist in \`CLAUDE.md\`.`,
      `Conventions in \`CLAUDE.md\`; the release checklist as a skill, whose body loads only when used.`,
      `Both as skills, with \`disable-model-invocation: true\` set on the conventions skill.`],
    correct:2,
    answer:`Match the mechanism to the **activation pattern**.
- **\`CLAUDE.md\`** is always-on context: facts that should hold in every session (conventions, build commands, project layout). It is paid for on every request, so keep it lean.
- **Skills** load on demand. Only the one-line description sits in context at startup; the body loads when you invoke \`/release\` or when Claude judges it relevant — so a long checklist costs almost nothing until it is needed. The documentation states this directly: if an entry is a multi-step procedure, move it out of \`CLAUDE.md\` and into a skill.
- Putting the checklist in \`CLAUDE.md\` under a heading still loads all twelve steps on every unrelated request.
- Path-scoped rules solve a different problem — instructions tied to *which files* are touched, not to which task is running — and conventions that apply everywhere gain nothing from a glob.
- Making the conventions a skill is worse in both directions: \`disable-model-invocation: true\` removes it from Claude's context entirely, so standards would apply only when manually invoked.` },
  { type:"mc", sub:"3.5", lvl:"intermediate", src:"repos",
    question:`A long session is nearing its context limit halfway through a refactor that still has several files to go. What is the right move, and why?`,
    options:[
      `Run \`/compact\`: it summarizes in place, so continuity is preserved and nothing is lost.`,
      `Start a fresh session and re-read the changed files, since compaction summaries are unreliable.`,
      `Run \`/compact\`, then \`/clear\` if the summary still leaves too little room for the remaining work.`,
      `Run \`/compact\` to finish the current task; start a fresh session when the next task is unrelated.`],
    correct:3,
    answer:`Two tools, two situations. **\`/compact\`** replaces the conversation with a structured summary and continues — the right choice **mid-task**, where continuity matters. A **fresh session** is right when the next piece of work is distinct and the accumulated context is mostly irrelevant; seed it with a written checkpoint (decisions made, files touched, what remains).
- What reloads after compaction: the system prompt, \`CLAUDE.md\`, auto memory, and the MCP tool list all live outside the message history and are re-injected. The **skill listing is the exception** — only skills actually invoked are preserved.
- Compaction is **lossy** by design: it is a summary, so precise details can degrade. Facts that must survive belong in files, not only in conversation history. Boundaries stated in chat can also be lost with the message that stated them.
- \`/clear\` after \`/compact\` discards the summary you just paid to produce, leaving you mid-refactor with nothing.
- Declaring compaction unreliable and restarting every time throws away working state for no gain.` },
  { type:"mc", sub:"3.6", lvl:"advanced", src:"ptest",
    question:`Claude writes a module and then reviews it in the same session. The review consistently passes code that later turns out to contain subtle bugs. What is the most effective correction?`,
    options:[
      `Run the review as a separate invocation whose only input is the diff and the review criteria.`,
      `Ask for the review in a later turn of the same session, prefaced with an adversarial instruction.`,
      `Lower the temperature for the review turn so the model rationalizes less about its own code.`,
      `Switch to a larger model for the review turn while keeping the session's accumulated context.`],
    correct:0,
    answer:`A reviewer that shares the generator's context also shares its **assumptions and rationalizations** — it already "knows" why each choice was correct. An **independent invocation with fresh context** sees only the artifact, so it evaluates what was actually written rather than what was intended.
- Instructing the same session to be adversarial changes tone, not information: the reasoning that produced the bug is still in context.
- Temperature is not a knob Claude Code exposes; it is a Messages API parameter and does not apply here. Treat confidently named settings that turn out not to exist as a warning sign.
- A larger model inherits the same contaminated context — capability is not the failing variable.
- The same principle governs human code review: the author is the worst-placed person to find their own blind spots.` },
  { type:"mc", sub:"3.6", lvl:"intermediate", src:"ptest",
    question:`An automated PR reviewer re-reports the same known issues on every new commit, and developers have started ignoring its comments entirely. What fixes the noise without losing coverage?`,
    options:[
      `Review only the diff introduced by the newest commit and ignore the rest of the pull request.`,
      `Cap the reviewer at the five highest-severity findings on each run.`,
      `Feed the prior findings into the review context and ask only for new or unresolved issues.`,
      `Run the review once, when the pull request is marked ready, instead of on every commit.`],
    correct:2,
    answer:`Give the reviewer **memory of what it already said**: prior findings go into context and the instruction becomes "report only what is new or still unresolved". Coverage is unchanged; only the repetition disappears.
- Reviewing only the newest commit's diff looks similar but is not: an unresolved issue from an earlier commit stops being reported at all, and a regression caused by the interaction between commits is invisible.
- A severity cap and a lower review frequency both cut noise by cutting **coverage** — they suppress real findings alongside repeats, and neither stops the ones that do surface from being duplicates.
- The general shape: when an agent's output is correct but unhelpful, the missing ingredient is usually context about prior state, not a constraint on volume.` },
  { type:"mc", sub:"3.2", lvl:"advanced", src:"ptest",
    question:`A team skill should declare the argument it expects, run in isolation so its verbose work stays out of the main session, and be unable to modify files. Which frontmatter combination delivers all three?`,
    options:[
      `\`argument-hint\`, \`context: fork\`, and \`allowed-tools: Read Grep\` to limit it to read-only tools.`,
      `\`argument-hint\`, \`context: fork\`, and \`disallowed-tools\` listing the tools that write.`,
      `\`arguments\`, \`agent: Explore\`, and a \`permissions.deny\` block inside the skill frontmatter.`,
      `\`argument-hint\`, \`background: true\`, and \`allowed-tools: Read Grep\` for read-only execution.`],
    correct:1,
    answer:`Three distinct fields, each doing one job:
- **\`argument-hint\`** — the hint shown during autocomplete to indicate expected arguments, e.g. \`[issue-number]\`. It documents the input; it does not collect it.
- **\`context: fork\`** — runs the skill in a **forked subagent context**. The skill content becomes the subagent's prompt and it has no access to your conversation history. \`agent:\` picks the subagent type and \`background:\` (default \`true\`) controls whether the turn waits for the result.
- **\`disallowed-tools\`** — removes the listed tools from Claude's available pool while the skill is active. This is the field that restricts.

**The trap:** \`allowed-tools\` **pre-approves** tools so they run without a permission prompt during the invoking turn — the documentation is explicit that it *does not restrict which tools are available*. Listing \`Read Grep\` there grants two tools silently; it does not take Edit or Bash away. Both grants and restrictions clear when you send your next message.

\`background: true\` only has meaning alongside \`context: fork\`, and permission blocks belong in \`settings.json\`, not in skill frontmatter.` },
  { type:"mc", sub:"3.2", lvl:"intermediate", src:"ptest",
    question:`A developer has a personal skill named \`commit\` in \`~/.claude/skills/\`, and the project defines a skill with the same name in \`.claude/skills/\`. Which one runs when they type \`/commit\`?`,
    options:[
      `The project version, because configuration closer to the work takes precedence.`,
      `Neither shadows the other: Claude Code namespaces them as \`project:commit\` and \`personal:commit\`.`,
      `Whichever declares \`name: commit\` in its frontmatter, regardless of where the file lives.`,
      `The personal version, because personal skills override project skills of the same name.`],
    correct:3,
    answer:`For skills the precedence is **enterprise → personal → project**: a personal skill overrides a project skill of the same name, and either overrides a bundled skill.
- The consequence for teams: a stale personal \`commit\` skill **silently shadows** the team's updated standard, and "the same command" behaves differently on different machines. Check for shadowing when a teammate's results diverge.
- Only **plugin** skills are namespaced (\`plugin-name:skill-name\`), which is why they cannot conflict across levels; personal and project skills are not.
- For personal and project skills the command name comes from the **directory or file name**, not the frontmatter — \`name\` is only the display label in skill listings. (In a plugin skill, \`name\` does set the last segment.)
- Note the contrast with **subagents**, which resolve the other way: \`.claude/agents/\` takes precedence over \`~/.claude/agents/\`, and managed definitions beat both.` },
  { type:"mc", sub:"3.1", lvl:"advanced", src:"video1",
    question:`A session runs long enough to trigger compaction. What happens to the guidance in the project's root \`CLAUDE.md\`?`,
    options:[
      `It is re-read from disk and re-injected, along with the system prompt and auto memory.`,
      `It is summarized together with the conversation, so only the gist of it survives.`,
      `It is re-injected only if Claude read the file at some point before compaction ran.`,
      `It is re-injected, but the auto-memory index and the MCP tool list are not reloaded.`],
    correct:0,
    answer:`Compaction replaces the **conversation** with a structured summary; the startup content lives outside the message history and reloads. The system prompt, \`CLAUDE.md\`, auto memory, and the MCP tool list are all re-injected afterwards.
- The documented **exception** is the skill listing: it is not re-injected, and only skills you actually invoked are preserved.
- Nested \`CLAUDE.md\` files from subdirectories are not re-injected automatically either — they reload the next time Claude reads a file in that subdirectory.
- The practical consequence is a durability split: anything that must **always** hold (conventions, constraints, prohibitions) belongs in \`CLAUDE.md\` or \`.claude/rules/\`; instructions given only in chat can be summarized away. If an instruction vanished after \`/compact\`, it was conversation-only or lives in a nested file that has not reloaded yet.` },
  { type:"mc", sub:"3.5", lvl:"basic", src:"video1",
    question:`A developer writes the test suite for a feature first, then asks Claude Code to implement until the suite passes, iterating on each failure. Which statement best captures the value of this loop and its main limitation?`,
    options:[
      `It removes the need for a planning step, but it only works for pure, side-effect-free functions.`,
      `It guarantees correctness once the suite is green, but re-running the suite costs extra tokens.`,
      `It gives each iteration a verifiable target, but Claude may satisfy the tests by special-casing them.`,
      `It gives each iteration a verifiable target, but test output is too verbose to serve as feedback.`],
    correct:2,
    answer:`**Test-driven iteration** pairs well with agentic coding because the tests turn a vague requirement into an executable oracle: implement → run → read the failure → fix. Failures are the highest-quality iteration signal available, since they say exactly what broke and where.
- The real limitation is **specification gaming**: the loop optimizes for green, and an implementation that special-cases the assertions satisfies it. Read the diff, not just the result.
- Test output is precisely what makes the loop work; verbosity is not the problem.
- Green does not guarantee correctness — it guarantees the suite passes, which is only as strong as the suite.
- Planning is orthogonal: a wide-scope change still benefits from plan mode before the first test is written.` },
  { type:"vf", sub:"3.6", lvl:"intermediate", src:"video2",
    question:`Claude Code's non-interactive CI mode is enabled with the \`--batch\` flag, or by setting the \`CLAUDE_HEADLESS=1\` environment variable.`,
    correct:"F",
    answer:`**False — neither exists.** Non-interactive execution is enabled with **\`-p\` / \`--print\`**, optionally combined with \`--output-format\` (\`text\`, \`json\`, \`stream-json\`) and \`--json-schema\` for validated structured output. There is no \`--batch\` flag and no \`CLAUDE_HEADLESS\` variable.
- Real flags worth knowing for CI: \`--permission-mode dontAsk\`, \`--allowedTools\` / \`--allowed-tools\`, \`--disallowedTools\`, \`--tools\`, \`--input-format\`, \`--append-system-prompt\`, \`--add-dir\`, \`--bg\` (which cannot be combined with \`-p\`).
- This is a recurring distractor pattern in the exam and in community material: **confidently named flags, fields, or environment variables that sound plausible but are fabricated**.
- Defense: know the real flags cold, and treat an oddly specific unfamiliar option as a claim to verify rather than a fact to accept.` },
]},

/* ============ DOMAIN 4: PROMPT ENGINEERING (20%) ============ */
{ id:"prompt", name:"✍️ Prompt Engineering (20%)", questions:[
  { type:"mc", sub:"4.1", lvl:"intermediate", src:"core",
    question:`An automated code reviewer reports too many false positives: it flags patterns the team has explicitly agreed are acceptable. Developers are starting to ignore it. What is the most effective prompt-level fix?`,
    options:[
      `Raise the severity threshold so that only high-severity findings are reported at all.`,
      `Define explicit inclusion and exclusion criteria, with a worked example on each side of the boundary.`,
      `Add a second pass in which the model re-reads and confirms each finding before it is reported.`,
      `Have the model emit a confidence score per finding and drop everything below a fixed cut-off.`],
    correct:1,
    answer:`False positives are fought by **defining the boundary**, not by filtering downstream:
- "This IS a finding: [example]. This is NOT a finding: [example], because…" gives the model a decision rule it can apply consistently.
- Vague instructions ("be reasonable", "use your judgment") produce a different boundary on every run.
- A severity threshold (A) and a confidence cut-off (D) suppress the symptom: the accepted patterns are still being detected, they are just hidden, and any genuinely high-severity false positive still gets through.
- A self-confirmation pass (C) costs an extra call and asks the model to re-apply the same undefined criterion — it usually confirms its own mistake.` },
  { type:"mc", sub:"4.1", lvl:"intermediate", src:"core",
    question:`A "magic number" detector has accumulated an exclusion list of 40 entries (HTTP status codes, well-known ports, 0/1/-1, test fixtures…), and a new class of false positive still appears roughly every week. What is the durable fix?`,
    options:[
      `Keep extending the exclusion list; each new class costs only one more line in the prompt.`,
      `Replace the enumeration with a positive definition of what a magic number is, plus a boundary example.`,
      `Move the exclusion list out of the prompt and into a deterministic post-filter over the model's output.`,
      `Supply the project's constants file so the model can check each literal against the declared constants.`],
    correct:1,
    answer:`An exclusion list enumerates **instances**; the recurring failure means the model never received the **concept**.
- A positive definition ("an unnamed literal whose meaning cannot be recovered from its context") generalises to classes you have not seen yet; an exception list only covers the ones you have.
- Extending the list (A) is the treadmill the scenario describes: it works locally and never converges.
- A deterministic post-filter (C) is legitimate engineering and pairs well with a correct prompt, but on its own it leaves the boundary undefined — you are still enumerating exceptions, just in code.
- The constants file (D) answers a different question (is this literal already a named constant?) and does not cover conventional values that are simply not worth naming.

*Note: this question deliberately attacks a different facet from the previous one — concept definition versus criteria-with-examples.*` },
  { type:"mc", sub:"4.1", lvl:"intermediate", src:"core",
    question:`A documentation generator produces inconsistent results across runs: sometimes it documents private helpers, sometimes it writes three paragraphs where one line was wanted. What is the prompt missing?`,
    options:[
      `A lower sampling temperature, so that successive runs converge on the same choices.`,
      `A defined scope on three axes: what to document, for which elements, and at what level of detail.`,
      `A filled-in template that the model must complete for every item it decides to document.`,
      `A post-processing step that strips private helpers and truncates over-long descriptions.`],
    correct:1,
    answer:`Consistency requires an **explicit scope**, along three axes:
- **What**: the public API only (private helpers excluded).
- **For which elements**: exported functions, public classes, …
- **At what level of detail**: e.g. a one-line summary plus parameters plus one example.

Without that, each run decides for itself — and decides differently.
- A lower temperature (A) makes an undefined decision *repeatable*, not *correct*; it also does not apply to current frontier models, which reject sampling parameters outright.
- A template (C) is a genuinely useful technique and fixes the *level of detail* axis, but it says nothing about *which* elements get documented — the private-helper problem survives.
- Post-processing (D) patches the output after the fact and cannot recover detail the model chose not to write.` },
  { type:"mc", sub:"4.2", lvl:"basic", src:"core",
    question:`You need generated bug reports to ALWAYS follow the same structure (file, line, description, proposed fix). Which technique gives the most reliable format adherence?`,
    options:[
      `Describe the required structure in precise prose, field by field, in the system prompt.`,
      `Include 3–5 few-shot examples, wrapped in <example> tags, showing exactly the desired structure.`,
      `Generate freely and then normalise the output with a second, formatting-only model call.`,
      `Add a stop sequence after the last field so the model cannot drift past the format.`],
    correct:1,
    answer:`**Few-shot (multishot) examples** are the most reliable way to steer output format, tone and structure. Anthropic's prompting guidance recommends **3–5 examples** for best results, and wrapping them in \`<example>\` tags (\`<examples>\` for the set) so the model can tell them apart from instructions.
- Examples must be **relevant** (mirror the real use case), **diverse** (cover edge cases without teaching an unintended pattern) and **exact** (the format you show is the format you get).
- A prose description (A) is a legitimate baseline and often works, but the model imitates a shown structure far more faithfully than a described one.
- A second formatting call (C) doubles cost and latency for something the first call can do.
- A stop sequence (D) can only truncate; it cannot make the four fields appear in order.
- For a hard structural guarantee, combine few-shot with **structured outputs** (\`output_config.format\`) or a tool input schema.` },
  { type:"mc", sub:"4.2", lvl:"intermediate", src:"core",
    question:`A ticket classifier is accurate on clear cases but unreliable on ambiguous ones (is "I can't pay" billing or technical?). Which change targets the failure?`,
    options:[
      `Drop the ambiguous categories and route the tickets that would fall in them to a human queue.`,
      `Add few-shot examples of the edge cases that show the reasoning behind each assigned label.`,
      `Let the model return a ranked list of two categories and take the top-ranked one.`,
      `Expand the category descriptions in the system prompt with more distinguishing detail.`],
    correct:1,
    answer:`Easy cases need no help — the valuable examples are the **edge cases with their reasoning**:
- "'I can't pay because the button doesn't respond' → technical, because the root cause is the UI, not the billing account."
- Showing the *why* transfers the **decision rule**, not just the input→label mapping, so it generalises to edge cases you did not enumerate.
- Longer category descriptions (D) are the most tempting alternative and genuinely help, but prose definitions degrade exactly where the categories overlap; a worked boundary example resolves the overlap directly.
- Two ranked categories (C) records the ambiguity without resolving it, and a human queue (A) is a fallback, not a fix.
- General rule: invest examples where the model is wrong, not where it is already right.` },
  { type:"mc", sub:"4.2", lvl:"intermediate", src:"core",
    question:`An extractor performs well on tabular documents but degrades sharply on prose documents. Which adjustment targets the cause?`,
    options:[
      `Pre-convert prose documents to tables with a first model call, then run the existing extractor.`,
      `Add few-shot examples drawn specifically from prose documents, showing where each field lives.`,
      `Double the number of tabular examples so that the model generalises more strongly overall.`,
      `Chunk the prose documents by paragraph and extract from each chunk independently.`],
    correct:1,
    answer:`The gap is **specific to the prose format**, so the examples must cover **that** format:
- A "prose document → extracted JSON" example teaches the model how to locate fields in running text.
- More examples of the format that already works (C) do not transfer to the format that fails — this is the tempting wrong answer.
- A prose→table pre-pass (A) is a defensible two-stage pipeline, but it adds a call, a failure mode, and a lossy conversion for a problem that a handful of examples solves directly.
- Paragraph chunking (D) would be the right move for a context-length problem; here the model can see the whole document and still misses the fields.
- Principle: few-shot examples must be **representative of the real input distribution**, including the hard formats.` },
  { type:"mc", sub:"4.3", lvl:"basic", src:"core",
    question:`A pipeline consumes model-generated JSON that intermittently contains syntax errors (trailing commas, unclosed quotes), breaking the parser. What is the fundamental solution?`,
    options:[
      `Wrap the parse in a tolerant JSON reader that repairs trailing commas and unbalanced quotes.`,
      `Constrain generation with a schema — structured outputs, or a strict tool input schema.`,
      `Retry on parse failure, appending the parser's error message to the retried prompt.`,
      `Ask for the JSON inside <json> tags and extract it with a regular expression before parsing.`],
    correct:1,
    answer:`**Constrained decoding** removes the whole class of failure:
- **Structured outputs** (\`output_config.format\` with a \`json_schema\`) constrain the response itself; **strict tool use** (\`strict: true\` on the tool definition) constrains the tool input. Either way the model generates *within* the schema.
- Documented guarantees: always-valid JSON (no parse errors), correct field types, required fields present — no retries for schema violations.
- A tolerant parser (A) and an error-feedback retry (C) treat symptoms; both eventually meet an output they cannot repair.
- XML tags plus a regex (D) is the most plausible-looking workaround and is genuinely common, but the text inside the tags is still unconstrained — the trailing comma is simply now inside \`<json>\`.
- Exam rule: if the output feeds software, **constrain the structure**; do not parse prose.

Source: platform.claude.com/docs/en/build-with-claude/structured-outputs` },
  { type:"mc", sub:"4.3", lvl:"intermediate", src:"core",
    question:`You expose several extraction tools and need to guarantee that the model calls SOME tool (never replies with free text), while leaving the choice of which tool to the model based on the document. What do you configure?`,
    options:[
      `tool_choice: {"type": "auto"}`,
      `tool_choice: {"type": "any"}`,
      `tool_choice: {"type": "tool", "name": "extract_invoice"}`,
      `strict: true on every tool definition`],
    correct:1,
    answer:`**\`tool_choice: {"type": "any"}\`** = the model must call a tool, but is free to choose which one — exactly the requirement.
- \`{"type": "auto"}\` (the default) allows a plain text reply, which is what you need to rule out.
- \`{"type": "tool", "name": …}\` forces one **specific** tool; it satisfies "always a tool" but removes the per-document choice.
- \`strict: true\` is a different guarantee: it constrains the **shape of the tool input** once a tool is called, and does nothing to force a call.
- Ordering by restrictiveness: \`none\` < \`auto\` < \`any\` < \`tool\`. Note that \`any\`/\`tool\` also carry a slightly larger tool-use system prompt than \`auto\`/\`none\`.` },
  { type:"mc", sub:"4.4", lvl:"intermediate", src:"core",
    question:`An invoice extractor returns totals that do not match the sum of the line items, and your arithmetic validation rejects them. What is the most effective retry?`,
    options:[
      `Resend the identical request and take the second result, relying on run-to-run variation.`,
      `Resend with the failed extraction, the specific validation error, and the source document.`,
      `Resend only the failing field, with the invoice's line-item table supplied as context.`,
      `Resend with an added instruction telling the model to verify the arithmetic before answering.`],
    correct:1,
    answer:`An effective retry **teaches**. You resend with:
- the **failed extraction** (what the model produced),
- the **specific error** ("the line items sum to 1,520.50 but the extracted total is 1,250.50"),
- the **original document**.

The model can then localise and correct its own mistake.
- An identical retry (A) usually reproduces the failure: nothing in the input changed.
- A narrowed retry (C) is the closest competitor and sometimes works, but discarding the rest of the extraction hides the cross-field evidence — the total may be right and a line item wrong.
- A generic "check your arithmetic" instruction (D) belongs in the *first* prompt; as a retry it withholds the one thing the model needs, which is the concrete discrepancy.` },
  { type:"mc", sub:"4.4", lvl:"advanced", src:"core",
    question:`You want to analyse a detector's false positives systematically in order to improve the prompt. Which field earns its place in the output schema?`,
    options:[
      `confidence: the model's self-reported certainty in each individual finding.`,
      `detected_pattern: the exact code fragment or construct that triggered the finding.`,
      `rule_id: the identifier of the matched rule, drawn from a fixed catalogue of rules.`,
      `explanation: a free-text justification the model writes for each finding it reports.`],
    correct:1,
    answer:`**\`detected_pattern\`** records **what the model actually saw** when it flagged:
- With the false positives in hand you group by triggering pattern and the systematic error classes surface immediately ("it flags every HTTP status code").
- Each class you find becomes an exclusion rule — or, better, a sharper definition — in the prompt.
- \`confidence\` (A) helps you rank and threshold, but a confidently-wrong finding tells you nothing about *why* it fired.
- \`rule_id\` (C) is the right instrumentation for a rules engine with a fixed catalogue; a free-form LLM detector has no such catalogue to key on.
- A free-text \`explanation\` (D) is close, and useful for a human reading one finding — but it does not aggregate, so 400 unique sentences do not become 6 error classes.` },
  { type:"mc", sub:"4.4", lvl:"advanced", src:"core",
    question:`A pipeline retries extraction of the "tax_id" field three times and fails every time. On inspection, the field is genuinely not in the supplied document — it lives in an annex that was never attached. What is the pipeline missing?`,
    options:[
      `An escalation ladder that switches to a more capable model after the second failed attempt.`,
      `A presence check before retrying: if the value is not in the source, record it as absent and escalate.`,
      `A cap of one retry, with every remaining failure routed straight to manual review.`,
      `A looser field description, so that a nearby identifier in the document can satisfy it.`],
    correct:1,
    answer:`Retries only help with **model errors**, never with **missing data**:
- Before retrying, establish that the value exists in the source at all.
- If it does not: record "not present" (or escalate to fetching the annex). Any extracted value would be **fabricated**.
- The schema should permit \`null\` / \`"not_found"\` so the model can honestly report absence.
- A model escalation ladder (A) is a reasonable pattern for genuinely hard extractions, and pure wasted spend here — a stronger model still cannot read a page it was not given.
- A one-retry cap (C) limits the damage but treats "the model slipped" and "the data is absent" as the same event, so the annex is never fetched.
- Loosening the field description (D) is actively harmful: it converts a detectable failure into a plausible wrong answer.` },
  { type:"mc", sub:"4.5", lvl:"basic", src:"core",
    question:`You must classify 50,000 archived documents. The result is needed next week, and cost matters. Which approach fits best?`,
    options:[
      `Standard Messages API behind a bounded concurrency pool sized to your rate limits.`,
      `Message Batches API: asynchronous processing at a 50% discount on token cost.`,
      `Message Batches API, split into 500 batches of 100 requests to stay under the per-batch cap.`,
      `Standard Messages API with prompt caching applied to the shared classification instructions.`],
    correct:1,
    answer:`The **Message Batches API** is built for exactly this shape of work:
- **50% reduction** on token cost.
- **Asynchronous**: most batches finish in under an hour; you can retrieve results when every request has completed **or after 24 hours, whichever comes first**. Requests still processing at 24 hours **expire** (and are not billed) — the 24 hours is an expiry window, not a completion guarantee.
- A single batch holds up to **100,000 requests or 256 MB**, whichever is reached first, so option C's "per-batch cap" of 100 is fictitious — the split buys nothing and multiplies your polling.
- A concurrency pool (A) works and is the right answer for latency-sensitive volume, but pays full price.
- Prompt caching (D) is a real and complementary saving on the shared prefix — and it is available *inside* batch requests too, so it is not an alternative to batching.
- Results remain downloadable for **29 days** after creation.

Source: platform.claude.com/docs/en/build-with-claude/batch-processing` },
  { type:"vf", sub:"4.5", lvl:"basic", src:"core",
    question:`The Message Batches API is a good choice for an automated check that blocks the merge of every pull request.`,
    correct:"F",
    answer:`**False.** The Batches API is **asynchronous**: most batches finish within an hour, and results become available when all requests complete **or after 24 hours, whichever comes first** — anything still unprocessed at that point **expires**. That is unacceptable for a **blocking** check with a developer waiting.
- PR gate → standard Messages API (seconds).
- Batch → latency-tolerant work (backfills, nightly analyses, evaluations) with the 50% saving.
This latency-versus-cost trade-off is a recurring exam theme.` },
  { type:"mc", sub:"4.5", lvl:"intermediate", src:"core",
    question:`In a batch of 10,000 documents, 200 requests failed. Which field lets you identify and reprocess only those 200?`,
    options:[
      `The position of each result in the results file, matched against the submission order.`,
      `custom_id: the identifier you assigned to each request, returned with every result.`,
      `The batch-level id that was returned when the batch was created.`,
      `The message.id carried by each successfully completed result.`],
    correct:1,
    answer:`**\`custom_id\`** is the per-request correlation key you control (1–64 characters, \`^[a-zA-Z0-9_-]{1,64}$\`):
- Batch results are explicitly documented as arriving in **any order**, which may not match submission order — so option A is the classic trap: positional matching silently mis-assigns results.
- Partial-failure recovery: filter the results whose \`result.type\` is \`errored\` or \`expired\`, collect their \`custom_id\`s, and resubmit only those.
- The batch-level \`id\` (C) identifies the batch, not the request within it.
- \`message.id\` (D) is server-assigned at generation time; it has no relationship to your source document, and errored/expired results carry no message at all.

Source: platform.claude.com/docs/en/build-with-claude/batch-processing` },
  { type:"mc", sub:"4.6", lvl:"intermediate", src:"core",
    question:`A code review that evaluates ten aspects in a single pass produces inconsistent results: sometimes it goes deep on security, sometimes on style, rarely on both. Which structural change improves consistency?`,
    options:[
      `Enumerate the ten aspects explicitly in the prompt, each with its own acceptance criteria.`,
      `Split into focused passes — one per dimension, or a local per-file pass plus a cross-file pass.`,
      `Keep the single pass but require one fixed output section per aspect, so none can be skipped.`,
      `Raise max_tokens so that the single pass has room to cover all ten aspects thoroughly.`],
    correct:1,
    answer:`**Multi-pass with focus**: each pass owns one dimension, or one level (local versus integration).
- A single prompt carrying ten objectives **dilutes attention**; the model prioritises differently each run, which is precisely the reported symptom.
- Focused passes are more consistent and deeper per dimension, at the cost of more calls.
- Enumerating criteria (A) is a real improvement and worth doing anyway, but it does not change the fact that ten objectives compete inside one generation.
- A fixed output section per aspect (C) is the strongest distractor: it guarantees **coverage** (nothing is skipped) without guaranteeing **depth** — you get ten shallow sections instead of two deep ones.
- max_tokens (D) is not the binding constraint; the passes were not being truncated.
- This is prompt chaining applied to review — Domains 1 and 4 intersect here.` },
  { type:"vf", sub:"4.2", lvl:"basic", src:"core",
    question:`Wrapping prompt sections in XML tags (<document>, <instructions>, <example>) helps Claude distinguish the parts of the prompt and improves reliability.`,
    correct:"V",
    answer:`**True.** **XML tags** are Anthropic's documented technique for structuring complex prompts:
- They let the model parse a prompt that mixes instructions, context, examples and variable input without misattributing one for another ("is this part of the document, or an instruction?").
- They make sections referenceable ("using the contract in \`<contract>\`…").
- They compose with everything else: few-shot examples inside \`<example>\` (the set inside \`<examples>\`), long documents inside \`<document>\` with \`<document_content>\` and \`<source>\` subtags.
- Related guidance: place **long-form data near the top** of the prompt, above the query and instructions — this improves performance across models.

Source: platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices` },
  { type:"mc", sub:"4.3", lvl:"intermediate", src:"core",
    question:`You need the response to be the JSON object and nothing else — no "Here is the analysis:" preamble — on a current Claude model, and you are not defining any tools. Which approach works?`,
    options:[
      `Prefill the assistant turn with an opening brace so that the model continues from there.`,
      `Use structured outputs: output_config.format with a json_schema constraining the response.`,
      `Add the preamble text as a stop sequence so that it is cut before the JSON begins.`,
      `Ask for the JSON inside <output> tags and discard everything outside them afterwards.`],
    correct:1,
    answer:`**Structured outputs** are the supported tool-free way to constrain the response: \`output_config: {"format": {"type": "json_schema", "schema": …}}\` applies constrained decoding to the response itself, so a preamble is structurally impossible.
- **Prefilling the assistant turn is no longer supported.** Starting with the Claude 4.6 generation, a prefilled (partial) assistant message on the **last** turn returns a **400 error**; Anthropic's documented migrations are structured outputs, tool calling, or an explicit system-prompt instruction ("Respond directly without preamble. Do not start with phrases like 'Here is…'"). Assistant messages *elsewhere* in the conversation — few-shot turns, for example — are unaffected, and older models still accept prefill. Option A is the answer that used to be right.
- A stop sequence (C) can only cut generation at a marker; it cannot prevent text the model has not yet chosen to emit, and the exact preamble wording varies.
- XML tags plus post-processing (D) is a workable fallback the docs also mention, but it is a strip-it-afterwards remedy rather than a guarantee.

Source: platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#migrating-away-from-prefilled-responses` },
  { type:"vf", sub:"4.2", lvl:"basic", src:"core",
    question:`Asking the model to reason step by step (chain-of-thought) reduces the latency and cost of each request.`,
    correct:"F",
    answer:`**False.** Chain-of-thought **increases** generated tokens, and therefore latency and cost.
- What it buys is **accuracy on complex tasks** — multi-step reasoning, arithmetic, analysis.
- It is a trade-off: apply it where the difficulty warrants it; on trivial tasks it is pure overhead.
- Practical tip for manual CoT: separate the reasoning from the deliverable with tags (\`<thinking>\` … \`</thinking>\`, \`<answer>\` … \`</answer>\`) so post-processing can discard the reasoning.
- On current models, prefer the model's own thinking capability at a suitable effort level over hand-rolled CoT; manual CoT is documented as the fallback for when thinking is switched off.` },
  { type:"open", sub:"4.4", lvl:"advanced", src:"core",
    question:`Design the prompting approach for a high-precision invoice data extraction pipeline. Which techniques do you combine, and why?`,
    answer:`- **Constrained structure**: structured outputs (\`output_config.format\` with a \`json_schema\`) or a tool with a \`strict: true\` input schema. Either eliminates syntax errors and guarantees the shape — fields, types, enums — by construction. Note that prefilling the assistant turn is *not* an option on current models (400 error).
- **Explicit inclusion/exclusion criteria**: what each field is, its format (ISO dates, decimal amounts), what must NOT be extracted, and the named edge cases.
- **Few-shot examples**: 3–5, wrapped in \`<example>\` tags, covering the real input formats (tables AND prose) — including one example where a field is absent and the output is \`null\`, to teach honesty.
- **A schema that permits absence**: \`null\` / \`"not_found"\`, so the model never has to choose between failing and fabricating.
- **XML structure**: the invoice inside \`<document>\` near the top of the prompt, instructions and examples in their own tags below it.
- **Programmatic post-extraction validation**: arithmetic (line items versus total), formats, ranges, cross-field consistency. A schema guarantees shape, never semantics.
- **Retry with feedback**: on validation failure, resend the failed extraction + the specific error + the document — and check that the data is actually present in the source before retrying at all.
- **Instrumentation**: fields such as \`detected_pattern\` or \`confidence\` so systematic error classes can be found and turned into prompt changes.
- **Stratified evaluation**: measure accuracy per document type and per field, not as one aggregate, before deciding what to automate.
- **Message Batches API** where volume is high and latency tolerant (50% saving), with \`custom_id\` for partial-failure recovery.` },
  { type:"vf", sub:"4.1", lvl:"basic", src:"core",
    question:`For a deterministic extraction task, a high temperature is advisable so that the model explores more possibilities.`,
    correct:"F",
    answer:`**False.** High temperature means more randomness — the enemy of deterministic extraction.
- Analytical, extractive and classification tasks: temperature **close to 0.0** for maximum consistency. Creative and generative tasks: closer to 1.0. Valid range is 0.0–1.0, default 1.0.
- Caveat worth knowing: even at temperature 0.0 the output is **not fully deterministic**.
- \`top_p\` (nucleus sampling) is documented as being for advanced use cases only; the long-standing practice is to tune one or the other, not both.
- **Current-model note**: on Claude Opus 4.7 and later — including Opus 5 and Sonnet 5 — setting \`temperature\`, \`top_p\` or \`top_k\` to a non-default value returns a **400 error**. On those models the lever is prompting plus the \`effort\` setting, not sampling parameters.` },
  { type:"vf", sub:"4.3", lvl:"intermediate", src:"repos",
    question:`Forcing structured output with a JSON schema guarantees that the extracted values are factually correct.`,
    correct:"F",
    answer:`**False.** Structured outputs guarantee **schema compliance** through constrained decoding: always-valid JSON, correct field names and types, required fields present.
- They explicitly do **not** guarantee **semantic or factual** correctness. The model can place a wrong, or entirely hallucinated, value into a perfectly valid field.
- That is why structured output is paired with **programmatic validation** (arithmetic checks, ranges, cross-field consistency) and retry-with-feedback.
- Classic exam trap: "schema = correct data" is a distractor. Schema = correct **shape**.

Source: platform.claude.com/docs/en/build-with-claude/structured-outputs` },
  { type:"mc", sub:"4.3", lvl:"intermediate", src:"repos",
    question:`Some documents legitimately lack certain fields — foreign invoices carry no domestic tax ID. How should the extraction schema handle this?`,
    options:[
      `Mark every field required, so that no document is ever silently under-extracted.`,
      `Make legitimately optional fields nullable, so that absence can be reported as data.`,
      `Keep the fields required and have the model fill missing ones with an "N/A" sentinel.`,
      `Split into a domestic and a foreign schema, selected upstream from the invoice's origin.`],
    correct:1,
    answer:`**Nullable fields are the honesty valve** of an extraction schema:
- If a field is required, a document that lacks it forces the model to choose between failing and **fabricating** — both bad.
- \`"tax_id": {"type": ["string", "null"]}\` lets the output state "not present" as a first-class value.
- Pair it with an instruction and a few-shot example showing a \`null\` extraction, so the model knows absence is an acceptable answer.
- An \`"N/A"\` sentinel (C) is the closest competitor and is very common in practice — but it types the field as a string, so every downstream consumer must special-case a magic value, and \`"N/A"\` is indistinguishable from a genuine literal in the document.
- Two schemas (D) would be reasonable if origin were reliably known before extraction; it usually is not, and it multiplies the maintenance surface for one optional field.` },
  { type:"mc", sub:"4.5", lvl:"intermediate", src:"repos",
    question:`You are about to batch-process 80,000 documents with a newly written extraction prompt. What should happen first?`,
    options:[
      `Submit the full batch: at half price, a bad run is cheap enough to simply repeat.`,
      `Refine the prompt against a small representative sample, then submit the full batch.`,
      `Submit a first batch of 1,000 documents and inspect those results before sending the rest.`,
      `Split the work into 80 batches of 1,000 so that any failure is contained to one batch.`],
    correct:1,
    answer:`**Refine synchronously, then scale asynchronously.**
- Iterate on 50–200 representative documents (covering formats and edge cases) using the standard API, where each iteration takes seconds. Then submit the full batch, where every prompt defect is multiplied by 80,000.
- Discounted wasted tokens are still wasted, and a rerun costs real time: results are available when all requests finish **or after 24 hours, whichever comes first**.
- Option C is the strongest distractor — it is the right instinct executed through the wrong channel. A 1,000-document *batch* is still an asynchronous round trip, so each prompt iteration can cost hours; the pilot should run on the synchronous API.
- Splitting into 80 batches (D) is reasonable operational hygiene for isolation and progress tracking, but it does nothing about a prompt that is wrong in all 80.
- Sample selection matters: it must reflect the true distribution, including the ugly formats.` },
  { type:"mc", sub:"4.4", lvl:"advanced", src:"repos",
    question:`An extraction pipeline reports 96% aggregate accuracy and the team wants to automate end to end. Why can that number mislead, and what should be measured instead?`,
    options:[
      `96% is a per-field average; the document-level all-fields-correct rate is lower and is the real gate.`,
      `Aggregate accuracy can hide systematic failure in minority subsets; stratify by document type and field.`,
      `Accuracy conflates precision and recall; report F1 over the same evaluation set instead.`,
      `The evaluation set is too small for the estimate to be stable; enlarge it and re-measure before deciding.`],
    correct:1,
    answer:`**Stratified metrics reveal what the aggregate hides.**
- 96% overall can coexist with 60% on a document type that is 10% of volume — full automation would silently mangle that segment.
- Measure **per document type and per field**; automate the segments that clear the bar, route the weak segments to human review or targeted prompt work.
- Option A is a real and important refinement (per-field accuracy does flatter document-level correctness), but it replaces one aggregate with another and still cannot tell you *which* documents fail.
- F1 (C) fixes a different problem — class imbalance in a detection task — and remains an aggregate over the same undifferentiated set.
- Sample size (D) is worth checking, but a larger sample measured the same way reproduces the same blind spot with tighter confidence intervals.
- This is the LLM restatement of a classic ML lesson: never ship on a single aggregate number.` },
  { type:"mc", sub:"4.5", lvl:"advanced", src:"ptest",
    question:`A team wants to move an agentic workflow — the model calls a tool you implement, your code returns the result, the model continues — onto the Message Batches API for the 50% discount. What is the blocker?`,
    options:[
      `Batch requests reject the tools parameter, so no tool can be declared inside a batch at all.`,
      `A batch request runs unattended, so the client-side execute-and-return step has nowhere to happen.`,
      `The 50% discount applies only to output tokens, so the saving does not justify the rewrite.`,
      `Batch results are returned unordered, so the turns of a single conversation cannot be reassembled.`],
    correct:1,
    answer:`A batch request is **fire-and-forget**: it is submitted, processed independently, and returned. Nobody is present mid-request to execute a **client-side** tool and hand back a \`tool_result\`, so the loop cannot advance.
- The request does not error — it simply ends with \`stop_reason: "tool_use"\`. Continuing means running the tool yourself and submitting a *new* batch for the next turn, at potentially many hours per turn.
- Option A is factually wrong and worth knowing precisely: tool use **is** supported inside batches, including all **server tools** (web search, web fetch, code execution, MCP connector, advisor, tool search), which execute on Anthropic's infrastructure and therefore *do* complete inside a single batch request. Multi-turn conversations, vision, system prompts, extended thinking and caching are all supported too; the documented exclusions are \`stream: true\`, \`speed\`, Threads parameters and routing hints.
- Option C is wrong: the 50% reduction applies to token usage generally, not output only.
- Option D has a true premise — results genuinely arrive unordered — but the wrong conclusion: \`custom_id\` reassembles them, and ordering is not what breaks the loop.
- Practical pattern: batch the single-shot stages (classify, extract, summarise) and keep the interactive tool loop on the synchronous API.

Source: platform.claude.com/docs/en/build-with-claude/batch-processing` },
  { type:"mc", sub:"4.1", lvl:"intermediate", src:"ptest",
    question:`Developers have lost trust in an automated reviewer: style and naming findings run at roughly 50% false positives, while security findings run at 8%. What is the pragmatic recovery move?`,
    options:[
      `Disable the reviewer entirely until every category is below the agreed noise threshold.`,
      `Disable the noisy categories, keep the precise ones, and rework the noisy criteria before re-enabling.`,
      `Keep every category enabled but mark style and naming findings as advisory rather than actionable.`,
      `Post all findings as non-blocking comments instead of gating the merge on them.`],
    correct:1,
    answer:`**Trust is the product** of an automated reviewer: once developers start skimming past it, the good findings die with the bad ones.
- Disable the categories that are net-negative at 50% FP; keep the 8% security signal delivering value.
- Rework the noisy categories offline — explicit inclusion/exclusion criteria, boundary examples — measure, then re-enable.
- All-or-nothing (A) discards the security findings that are already working, and "until it is perfect" is not a shippable exit criterion.
- Advisory labelling (C) is the most tempting alternative because it costs nothing, but the reviewer still posts the same volume of noise; developers still read it, and the habit of ignoring the tool forms anyway.
- Non-blocking comments (D) reduce *friction*, not *noise* — a useful change to how findings land, but orthogonal to the precision problem.` },
]},

/* ============ DOMAIN 5: CONTEXT & RELIABILITY (15%) ============ */
{ id:"context", name:"📚 Context & Reliability (15%)", questions:[
  { type:"mc", sub:"5.1", lvl:"basic", src:"core",
    question:`A team is sizing prompts for Claude Sonnet 4.5 and Claude Haiku 4.5. What context window must each request fit within, and what counts toward it?`,
    options:[
      `128,000 tokens, counting the user and assistant messages exchanged so far.`,
      `200,000 tokens, counting system prompt, history, tool definitions and results, and the output in progress.`,
      `1,000,000 tokens, available on every current model once the long-context beta header is set.`,
      `200,000 tokens of input, with the generated output budgeted separately on top of that.`],
    correct:1,
    answer:`**200,000 tokens**, and *everything* in the request counts: system prompt, every message in \`messages\` (including tool results, images and documents), the tool definitions, and the output Claude generates for the turn — including its thinking.
- **200K is not universal.** Claude Opus 4.6 and later Opus models, Claude Sonnet 4.6 and later Sonnet models, and Claude Fable 5 have a **1M-token** window. On those models 1M is the **default**: no beta header, no long-context price premium.
- **128,000** is the *max output* (\`max_tokens\`) ceiling on 1M-context models — not a window size.
- Output is not budgeted on top of the window; it is inside it.
- Estimate a request before sending it with the token counting endpoint; the response \`usage\` reports what it actually consumed.` },
  { type:"mc", sub:"5.1", lvl:"basic", src:"core",
    question:`A stable 30,000-token prefix is reused across many requests with prompt caching enabled. On a request that hits the cache, how are those 30,000 tokens billed relative to the normal input price?`,
    options:[
      `At 0.25x — a quarter of the normal input price.`,
      `At 0.5x — half the normal input price.`,
      `At 1.25x — the same rate charged when the prefix was written to the cache.`,
      `At 0.1x — a tenth of the normal input price.`],
    correct:3,
    answer:`**Cache read tokens are billed at 0.1x the base input token price** (a 90% discount).
- Don't confuse it with the **write** side: cache creation costs **1.25x** base input for the default 5-minute TTL and **2x** for the 1-hour TTL.
- Verify it is actually happening: the response \`usage\` splits input into \`cache_read_input_tokens\` (0.1x), \`cache_creation_input_tokens\` (1.25x/2x) and \`input_tokens\` (full price). If \`cache_read_input_tokens\` stays at 0 across repeated requests, something is invalidating the prefix.
- Caching changes what you pay for those tokens, not whether they occupy the context window.` },
  { type:"mc", sub:"5.1", lvl:"basic", src:"core",
    question:`An agent sends a request against the same cached prefix roughly every 90 seconds. What is the default cache lifetime, and what happens to it on each hit?`,
    options:[
      `5 minutes, measured from the write and never extended, so the prefix must be rewritten every 5 minutes.`,
      `1 hour by default, reduced to 5 minutes only for prefixes that sit below the cacheable minimum.`,
      `5 minutes, refreshed at no additional cost on every hit; a 1-hour TTL is also available at a higher write cost.`,
      `5 minutes, refreshed on every hit, with no longer-lived option offered by the API.`],
    correct:2,
    answer:`**Default TTL is 5 minutes and it is rolling**: the cache is refreshed for no additional cost each time the cached content is used. At one request every 90 s the entry never expires.
- A **1-hour TTL** is also available (generally available, not beta): \`"cache_control": {"type": "ephemeral", "ttl": "1h"}\`. It costs **2x** base input to write versus **1.25x** for the 5-minute TTL.
- Choose 1h when the gaps between requests routinely exceed 5 minutes (agent sessions with long human pauses, bursty batch traffic). If traffic is continuous, the default TTL keeps itself warm and the higher write premium is wasted.` },
  { type:"vf", sub:"5.1", lvl:"intermediate", src:"core",
    question:`For a prompt prefix that is sent once and never reused within the TTL, enabling prompt caching costs more than not caching at all.`,
    correct:"V",
    answer:`**True.** A one-off request pays the **1.25x** cache-write premium instead of 1.0x, with no read to recover it.
- **Break-even (5-minute TTL):** two uses. Write + one read = 1.25x + 0.1x = **1.35x**, versus **2.0x** uncached.
- **Break-even (1-hour TTL):** the write costs **2x**, so you need roughly three uses (2x + 0.2x = 2.2x versus 3.0x uncached).
- Practical rule: cache large, stable prefixes that are genuinely reused within the TTL; leave caching off for prompts that differ from the first tokens on every request.` },
  { type:"mc", sub:"5.1", lvl:"intermediate", src:"core",
    question:`A developer enables prompt caching but \`cache_read_input_tokens\` is always 0. Their system prompt begins with a header containing the current timestamp, regenerated on every request. What is the problem?`,
    options:[
      `The prefix must match byte-for-byte; the timestamp changes each request and invalidates everything from that point onward.`,
      `Caching applies only to the \`messages\` array, so content placed in the system prompt is never cached.`,
      `The timestamp pushes the request past the four-breakpoint limit, so only the final breakpoint is retained.`,
      `Cache entries are only created once the same prefix has been seen twice, so early requests are always misses.`],
    correct:0,
    answer:`Caching is a **prefix match on 100% identical content** up to and including the block marked with \`cache_control\`. One differing byte at position N invalidates every breakpoint at or after N — and a timestamp at the *top* of the system prompt invalidates the whole thing.
- Render order is **tools → system → messages**. Put stable content first (frozen system prompt, deterministic tool list) and volatile content (timestamps, request IDs, the varying question) **after the last breakpoint**.
- Other silent invalidators: UUIDs, \`json.dumps()\` without sorted keys, per-user strings interpolated into the system prompt, a tool set that varies by user, switching models mid-conversation.
- Up to **4** \`cache_control\` breakpoints per request; each looks back at most 20 content blocks.` },
  { type:"mc", sub:"5.1", lvl:"intermediate", src:"core",
    question:`A ~700-token system prompt is marked with \`cache_control\`, but \`usage\` reports 0 for both \`cache_creation_input_tokens\` and \`cache_read_input_tokens\`. What is the most likely explanation?`,
    options:[
      `Short prefixes are cached but expire immediately, so the usage counters never record them.`,
      `\`cache_control\` is honoured only on tool definitions and message blocks, never on system blocks.`,
      `The request is missing the prompt-caching beta header that the API requires before any block is cached.`,
      `The prefix is below the model's minimum cacheable length, so nothing is cached and no error is raised.`],
    correct:3,
    answer:`Prefixes below the minimum are **silently not cached** — no error, just zeroed counters.
- **The minimum is model-dependent**, so check the docs table for the model you deploy rather than memorising one number: **512** tokens on Claude Opus 5 / Fable 5, **1,024** on Claude Opus 4.8, Sonnet 5, Sonnet 4.6, Sonnet 4.5 and Opus 4/4.1, **2,048** on Claude Opus 4.7 and Haiku 3.5, **4,096** on Claude Opus 4.6, Opus 4.5 and Haiku 4.5. It is not monotonic across generations.
- \`cache_control\` is valid on system text blocks, tool definitions and message content blocks alike, and prompt caching is generally available — no beta header is required.
- Fix: enlarge the cached prefix (fold tool definitions and shared instructions into it) or accept that this prompt is not worth caching.` },
  { type:"mc", sub:"5.2", lvl:"intermediate", src:"core",
    question:`A support agent conversation has run for over 100 turns and is approaching the context limit. Which approach preserves continuity with the lowest risk of losing case state?`,
    options:[
      `Drop the oldest turns on a rolling first-in-first-out basis, keeping as many recent turns as fit.`,
      `Raise \`max_tokens\` so that each request can accommodate the longer accumulated history.`,
      `Summarize the older turns into a structured record of state and open items, keeping recent turns verbatim.`,
      `Move the accumulated history into the system prompt, which is not counted against the context window.`],
    correct:2,
    answer:`**Compaction / summarization**: replace the old history with a structured summary of the essentials (identity and verified data, decisions taken, case state, open items) and keep the recent turns intact. Server-side compaction is available in beta on Claude 4.6 and later models; you can also implement it yourself.
- **FIFO trimming** is what chat UIs do, and it is the tempting wrong answer: the *earliest* turns usually hold identity, verified data and commitments — exactly what must survive.
- **Raising \`max_tokens\`** caps the output of one response; it does not enlarge the context window.
- **The system prompt counts toward the window** like everything else — moving history there changes nothing.
- Complements: external memory the agent re-reads, and context editing to clear stale tool results.` },
  { type:"mc", sub:"5.1", lvl:"basic", src:"core",
    question:`Before dispatching a large document, a pipeline must know how many input tokens the request will consume. What is the supported way to find out?`,
    options:[
      `POST the same request body to \`/v1/messages/count_tokens\`, which returns \`input_tokens\` and is free of charge.`,
      `Send the real request with \`max_tokens\` set to 1 and read \`input_tokens\` from the response \`usage\`.`,
      `Estimate locally with a tokenizer such as \`tiktoken\`, which matches Claude's tokenization.`,
      `Read \`input_tokens\` from the response headers, which the API returns before generation begins.`],
    correct:0,
    answer:`The **token counting endpoint** (\`POST /v1/messages/count_tokens\`) accepts the same structured input as message creation — \`model\`, \`system\`, \`messages\`, \`tools\`, images and PDFs — and returns \`{"input_tokens": N}\`.
- It is **free to use**, though subject to its own requests-per-minute limit by usage tier, independent of the message-creation limits.
- The count is an **estimate**; the actual figure may differ slightly.
- **Sending a real request with \`max_tokens: 1\`** does yield the number, but you pay for the input on every check — a defensible habit that becomes expensive at pipeline scale.
- **\`tiktoken\` is OpenAI's tokenizer** and materially undercounts Claude tokens. Also re-count per model: Claude 4.7 and later use a newer tokenizer that produces roughly 30% more tokens for the same text.` },
  { type:"mc", sub:"5.3", lvl:"basic", src:"core",
    question:`An application receives HTTP 429 responses from the API during peak hours. What is the correct client behaviour?`,
    options:[
      `Retry immediately; 429s clear as soon as the current rate-limit window rolls over.`,
      `Back off exponentially with jitter, honour \`retry-after\` when present, and smooth peaks with queueing or a limit increase.`,
      `Treat 429 as a permanent client error, log it, and drop the request without retrying.`,
      `Retry on a fixed one-second interval so throughput stays predictable while the limit clears.`],
    correct:1,
    answer:`**429 = \`rate_limit_error\`** — your organisation hit a rate limit. It is retryable.
- **Exponential backoff with jitter**, honouring the **\`retry-after\`** header when present. The official SDKs already do this for transient failures (connection errors, 429, 5xx), twice by default, and expose a max-retries option.
- **Fixed-interval retries** are the tempting near-miss: without jitter every blocked client retries in lockstep, and the congestion simply repeats.
- **Immediate retries** make it worse; **dropping the request** turns a transient condition into lost work.
- Structural fixes: queue and spread load, use the Batch API for latency-tolerant work, request a limit increase, and **ramp traffic gradually** — sharp usage spikes can trip acceleration limits and produce 429s of their own.` },
  { type:"mc", sub:"5.3", lvl:"basic", src:"core",
    question:`A production service starts seeing HTTP 529 responses during a traffic spike. What does 529 mean and how should the client treat it?`,
    options:[
      `The organisation's own rate limit was exceeded; slow down until the limit window resets.`,
      `The request body exceeded the maximum allowed size; split the payload and resend.`,
      `The service is under maintenance; requests will keep failing until the status page reports recovery.`,
      `The API is temporarily overloaded; the condition is transient, so retry with exponential backoff.`],
    correct:3,
    answer:`**529 = \`overloaded_error\`**: the API is temporarily overloaded, typically under high traffic across all users. It is **transient** → retry with exponential backoff.
- **529 is not 429.** 429 is *your* rate limit; 529 is *service-side* capacity. Confusing the two leads teams to throttle their own traffic for a problem that isn't theirs.
- **413 \`request_too_large\`** is the size error (32 MB on Messages and Token Counting, 256 MB on Batches, 500 MB on Files).
- Quick reference: **400** invalid_request · **401** authentication · **402** billing · **403** permission · **404** not_found · **409** conflict · **413** request_too_large · **429** rate_limit · **500** api_error · **504** timeout · **529** overloaded.
- Reliable design: classify as **retryable** (429, 500, 504, 529, connection errors) vs **non-retryable** (400, 401, 402, 403, 404, 413) and only retry the first group.` },
  { type:"mc", sub:"5.4", lvl:"intermediate", src:"core",
    question:`An agent must answer questions about a multi-million-line codebase that cannot fit in the context window. What is the correct approach?`,
    options:[
      `Summarize the whole repository once up front and answer every subsequent question from that summary.`,
      `Search first (grep/glob or embeddings) and load only the files relevant to the question, optionally fanning out to subagents.`,
      `Concatenate files until the window is full and answer from whatever happens to fit.`,
      `Split the work into one request per file in the repository and merge the individual answers.`],
    correct:1,
    answer:`**Targeted retrieval**: search first, load afterwards, and only what the question needs. Subagents can explore areas in parallel in isolated contexts and return a synthesis, keeping the main context lean.
- **Whole-repo summarization** is the plausible-but-inferior option: it costs a full pass over the corpus, discards the detail most questions actually need, and goes stale on every commit.
- **Per-file fan-out** costs one request per file and still leaves you ranking relevance afterwards.
- **Truncation** silently omits whatever mattered.
- A large window is not a reason to stuff it: accuracy and recall degrade as token count grows ("context rot"), so curation beats capacity.` },
  { type:"vf", sub:"5.4", lvl:"basic", src:"core",
    question:`In prompts containing long documents, the documents should be placed near the top and the query and instructions at the end.`,
    correct:"V",
    answer:`**True**, and it is Anthropic's documented long-context guidance for inputs of roughly 20k tokens or more.
- **Longform data at the top**, above the query, instructions and examples. Queries placed at the end have improved response quality by up to ~30% in testing, especially with complex multi-document inputs.
- **Structure with XML tags**: wrap each document in \`<document>\` with \`<document_content>\` and \`<source>\` subtags.
- **Ground responses in quotes**: ask Claude to quote the relevant passages first, then answer from those quotes. This focuses attention on the relevant material and makes the answer auditable.` },
  { type:"mc", sub:"5.5", lvl:"intermediate", src:"core",
    question:`In a report produced by a multi-agent research system, the client asks "where did this figure come from?" and nobody can answer. Which design principle was missing?`,
    options:[
      `Verification: the final agent re-running a search on each figure it reports to confirm the number still holds.`,
      `Observability: full transcript logging for every agent, so any figure can be traced afterwards from the logs.`,
      `Provenance: origin metadata (source, URL, date) carried alongside each claim through every handoff and cited in the final report.`,
      `Calibration: each agent stating its confidence in each figure so uncertain numbers can be flagged.`],
    correct:2,
    answer:`**Information provenance**: every claim must be traceable to its source, and the link has to survive every handoff.
- Implementation: findings travel as \`{claim, source, url, date}\` structures between agents, and the final report **cites** them. Without that structure, the first summarization step destroys the claim↔source link and the system becomes unauditable.
- **Verification** confirms a number is currently true; it still does not say where the reported figure came from.
- **Transcript logging** is the symptom-level fix: the logs exist, but reconstructing which retrieval produced which sentence after several summarization passes is impractical — and it is not something you can hand a client.
- **Confidence** is a self-assessment, not a source.
- Critical in regulated and client-facing domains.` },
  { type:"mc", sub:"5.6", lvl:"basic", src:"core",
    question:`Which agent actions warrant mandatory human approval (human-in-the-loop) in production?`,
    options:[
      `Any action that touches an external system, since anything leaving the process is outside the agent's control.`,
      `Any action the agent reports low confidence in, so that uncertain steps receive a human check.`,
      `Every tool call, so that an operator retains a complete record of everything the agent did.`,
      `Actions that are irreversible or high-impact: deleting data, moving money, external communications, production deploys.`],
    correct:3,
    answer:`The criterion is **irreversibility and impact**, not surface area or self-assessment.
- Gate: deletions, transfers, outbound communications, production changes. Leave reversible low-risk actions (reads, drafts, staging writes) autonomous.
- **Gating all external calls** is the over-broad near-miss: a read-only external lookup is harmless, and gating it destroys most of the automation value while training operators to click through prompts.
- **Confidence-based gating** keys on an invalid signal — a model can be entirely confident and wrong.
- **Approving every tool call** is supervision theatre.
- Implement in the harness (permissions/hooks that intercept the sensitive tool calls), not as an instruction in the prompt.` },
  { type:"vf", sub:"5.6", lvl:"intermediate", src:"core",
    question:`Since a model's results can vary between runs, it makes no sense to write automated tests for LLM-based systems.`,
    correct:"F",
    answer:`**False.** Variability is an argument for **evaluations (evals)**, not for abandoning testing.
- **Case suites** with verifiable criteria (extraction accuracy, valid format, policy compliance).
- **Programmatic assertions** wherever there is objective truth (the JSON parses, the totals add up, the required field exists).
- **LLM-as-judge** with an explicit rubric for subjective quality.
- Run the suite on every prompt, tool or model change — it is the regression-test equivalent for LLM systems, and it is the only way to know whether a change helped.` },
  { type:"open", sub:"5.2", lvl:"advanced", src:"core",
    question:`Context management strategies for a long-running agent: name at least five concrete techniques.`,
    answer:`- **Compaction / summarization**: condense the old history into a structured record of key facts, decisions and state; keep recent turns intact. Server-side compaction is available in beta on Claude 4.6 and later models.
- **Context editing**: clear stale tool results (\`clear_tool_uses\`) and old thinking blocks (\`clear_thinking\`) instead of summarizing them — pruning rather than rewriting.
- **External memory**: the agent persists notes and state to files or a database and re-reads them, so the context window stops being the only storage.
- **Subagents with isolated context**: verbose work (exploration, wide searches) runs in child contexts that return only a synthesis.
- **Prompt caching**: a stable prefix (tools + system + base documents) cached → cache reads at 0.1x base input price and lower latency; keep dynamic content after the last breakpoint.
- **Targeted retrieval (search/RAG)**: load only what the current task needs instead of the whole corpus.
- **Token counting** (free) to monitor consumption and trigger compaction before quality degrades.
- **Checkpoint and restart**: when a session is exhausted, emit a structured checkpoint and seed a fresh session with it.` },
  { type:"open", sub:"5.3", lvl:"advanced", src:"core",
    question:`Design the error handling and reliability strategy for a production application built on the Claude API.`,
    answer:`- **Error classification**: retryable (**429** rate_limit, **500** api_error, **504** timeout, **529** overloaded, connection errors) vs non-retryable (**400** invalid_request, **401** authentication, **402** billing, **403** permission, **404** not_found, **413** request_too_large).
- **Exponential backoff with jitter** for the retryable set, honouring **\`retry-after\`**, with a retry ceiling. The official SDKs do this by default (two retries) and expose a max-retries setting — configure rather than reimplement.
- **\`stop_reason\` checks on every response**: \`end_turn\`, \`max_tokens\` (truncated — raise the budget or continue the response), \`stop_sequence\`, \`tool_use\`, \`pause_turn\` (server-tool loop hit its iteration limit; resend to continue), \`refusal\` (inspect \`stop_details\`), \`model_context_window_exceeded\` (the window itself filled — compact or split). Never assume a complete response.
- **Output validation**: schemas (structured outputs / strict tool use), business assertions (arithmetic, ranges, referential integrity), and retry **with error feedback** when validation fails.
- **Timeouts and long requests**: stream, or use the Batch API, for anything long-running; degrade gracefully with a partial result or an honest unavailability message, and use circuit breakers to stop failure cascades.
- **Idempotency** for operations with side effects, so a retry cannot duplicate an action.
- **Queues and peak smoothing** to respect rate limits; ramp traffic gradually rather than spiking.
- **Observability**: log the \`request_id\` from every response and error, plus stop reasons, latency and failure-rate metrics, with alerting.
- **Regression evals** on every prompt or model change.` },
  { type:"mc", sub:"5.2", lvl:"advanced", src:"repos",
    question:`After several rounds of conversation summarization, an agent still "remembers" that a customer needs "a refund" but has lost the exact figure "$247.83 by Friday". What is the right mitigation?`,
    options:[
      `Summarize less often, but compress more aggressively each time it happens.`,
      `Hold precise values (amounts, dates, IDs, commitments) in a structured fact block injected verbatim and never summarized.`,
      `Increase the summary length budget so more of the original detail survives each pass.`,
      `Have the agent re-read the original transcript before any action that depends on a specific figure.`],
    correct:1,
    answer:`**Progressive summarization destroys high-precision tokens first**: numbers, dates, identifiers and exact commitments are the earliest casualties of compression, because they carry the least redundancy.
- Mitigation: split the state. **Narrative** can be compressed; **precise facts** live in a structured block that is injected verbatim outside the summarized history (or in external memory the agent re-reads).
- **Re-reading the original transcript** is the tempting near-miss — it works right up until the transcript has itself been compacted or no longer fits, which is exactly the situation you are already in.
- **A longer summary budget** only postpones the loss by a pass or two; **less frequent, more aggressive summarization** makes each pass lossier still.` },
  { type:"mc", sub:"5.5", lvl:"advanced", src:"repos",
    question:`Two sources give different values for the same figure (a company's employee count). The extraction pipeline currently keeps whichever value it saw last. What is the correct design?`,
    options:[
      `Keep the value from the more recently published source, since figures like headcount change over time.`,
      `Keep the value that the majority of sources agree on and discard the outlier.`,
      `Keep both values with their source attribution and set a conflict flag, forcing explicit downstream handling.`,
      `Keep the value from whichever source carries the higher reliability score.`],
    correct:2,
    answer:`**Never collapse a conflict silently at extraction time.** Store *all* conflicting values as \`{value, source, date}\` plus \`conflict_detected: true\`, and let a downstream step — or a human — resolve it with the full evidence in view.
- Recency, majority vote and source reliability are all **legitimate resolution policies** — that is precisely what makes them tempting here. The defect is applying any of them silently inside the extractor: it discards the evidence the resolver would need and emits a confident, unqualified, possibly wrong number.
- Definitional differences (contractors included? subsidiaries?) often explain the gap, and only surviving evidence can reveal that.
- Silent last-write-wins is the worst failure mode for a data pipeline: wrong *and* unfalsifiable.` },
  { type:"mc", sub:"5.5", lvl:"advanced", src:"repos",
    question:`A research agent finds a 2021 source saying a product "does not support SSO" and a 2025 source saying it does. What lets the pipeline tell a real contradiction from normal change over time?`,
    options:[
      `Preferring the more recent source whenever two claims about the same attribute disagree.`,
      `Attaching \`publication_date\` to every claim, so change over time is distinguishable from same-period disagreement.`,
      `Flagging both claims as a conflict and routing every disagreement to a human reviewer.`,
      `Weighting each source by domain authority, so the more authoritative of the two claims wins.`],
    correct:1,
    answer:`**Temporal metadata is what makes the two situations distinguishable at all.**
- With \`publication_date\` on each claim, "no SSO (2021)" vs "SSO (2025)" reads as **evolution** — report the current state, optionally with the history. Two sources from the **same period** disagreeing is a **genuine conflict** → preserve both, attribute, flag.
- **Prefer-the-recent-source** happens to produce the right answer in this specific case, which is exactly why it is the tempting distractor: it silently discards the history, and it mislabels genuine same-period conflicts as resolved.
- **Flagging every disagreement** floods human review with ordinary temporal change.
- **Authority weighting** answers "whom do we trust", not "has this changed".
- Without dates, no policy can tell the two cases apart.` },
  { type:"mc", sub:"5.2", lvl:"advanced", src:"repos",
    question:`A long-running agent session must be abandoned — the context is exhausted and output quality has visibly degraded — with the work half done. What is the recommended recovery pattern?`,
    options:[
      `Compact the session in place and continue in the same context once the history has been summarized.`,
      `Copy the full transcript into a new session so that no detail is lost in the handover.`,
      `Restart the task from the beginning, this time with a more precise and complete initial prompt.`,
      `Emit a structured checkpoint of completed work, decisions and open items, then seed a fresh session with it.`],
    correct:3,
    answer:`**Checkpoint + fresh session.** The checkpoint captures the durable state: what was completed, the key decisions and why, what remains, and where the relevant files or data live. The new session starts clean but **informed**.
- **In-place compaction** is the strongest distractor and a genuinely correct technique — *before* quality degrades. Once the session has already drifted, compacting it preserves the same degraded trajectory rather than resetting it.
- **Copying the transcript** re-imports precisely the bloat you were escaping.
- **Restarting from zero** throws away work you already paid for.
- Design for this ahead of time: instruct the agent to keep the checkpoint current as it works, so recovery never depends on a degraded final turn.` },
  { type:"mc", sub:"5.3", lvl:"advanced", src:"ptest",
    question:`In a research pipeline, one of five subagents failed and its assigned sources went unanalyzed. The final report must still ship today. How should the failure be represented?`,
    options:[
      `Ship with coverage annotations stating which conclusions rest on complete data and which areas were not analyzed.`,
      `Ship the report and open a follow-up task to re-run the failed subagent and revise the findings later.`,
      `Have the coordinator skim the orphaned sources itself, however shallowly, so that coverage is nominally complete.`,
      `Drop the sections that depended on the failed subagent, so that nothing unsupported is published.`],
    correct:0,
    answer:`**Graceful degradation with honest coverage annotations**: "sources X–Y were not analyzed; conclusions in section Z rest on partial data." Readers can then calibrate trust per conclusion.
- **A follow-up task** is good practice *in addition*, but it does nothing for the reader holding today's report — who still cannot tell that it is incomplete.
- **A shallow coordinator pass** manufactures findings of unmarked lower quality, which is worse than a marked gap.
- **Dropping the affected sections** is the subtle one: it looks conservative, but the reader cannot distinguish "we looked and found nothing" from "we never looked".
- The principle: a known gap that is stated is manageable; a known gap that is hidden becomes an unknown gap — the most dangerous kind.` },
  { type:"mc", sub:"5.6", lvl:"basic", src:"ptest",
    question:`A support agent with authority to resolve cases "per policy" faces a request the policy does not address at all. What should it do?`,
    options:[
      `Resolve it by analogy with the closest covered case and record the reasoning for later review.`,
      `Deny the request, since the agent should not grant anything the policy does not authorise.`,
      `Escalate to a human with the full case context: where policy is silent, the agent must not create policy.`,
      `Ask the customer what outcome they would consider fair and apply it if it seems reasonable.`],
    correct:2,
    answer:`**Policy gaps are escalation triggers, not judgment calls.** The agent's mandate is to *apply* policy, not to author it — and an invented resolution sets precedent nobody approved.
- **Reasoning by analogy** is the strongest distractor: it sounds like sound professional judgment, and "recorded for later review" sounds like a control. It is still the agent writing policy, and the review happens only after the customer has been told.
- **Blanket denial** is policy invention in the other direction, and it is the failure mode that generates complaints and appeals.
- **Asking the customer** outsources the decision to the interested party.
- Design the agent with an explicit rule: *if no policy covers the case → escalate with full context.*` },
  { type:"mc", sub:"5.6", lvl:"basic", src:"ptest",
    question:`A lookup tool returns three customer records matching the name the user gave. What should the agent do next?`,
    options:[
      `Present all three matching records, including their names and email addresses, so the user can pick one.`,
      `Ask the user for an additional identifier and act only once exactly one record matches.`,
      `Act on the most recently active of the three, which is usually the account the user means.`,
      `Return the raw lookup results to the user and end the turn without proposing a next step.`],
    correct:1,
    answer:`**Ambiguity about identity is never resolved by guessing** — acting on the wrong account is a serious and often irreversible error.
- Request a **discriminating identifier** (email, phone, order number) and proceed only on a unique match.
- **Showing all three records** is the trap: it feels helpful and it does resolve the ambiguity, but it discloses other customers' personal data to an unauthenticated third party.
- **"Most recently active"** is a heuristic guess dressed up as a policy.
- **Dumping the results and stopping** abandons the task without advancing it.
- Generalises to a core reliability rule: when input is ambiguous and the action has consequences, **clarify before acting** — and design tools to report multiplicity rather than silently returning a first hit.` },
  { type:"mc", sub:"5.4", lvl:"intermediate", src:"video1",
    question:`A RAG-based assistant sometimes produces answers built on irrelevant retrieved chunks. Why is retrieval quality a first-class reliability concern rather than a tuning detail?`,
    options:[
      `Retrieved chunks dominate the token bill, so weak retrieval shows up primarily as unnecessary cost.`,
      `Retrieval is normally the slowest pipeline stage, so poor relevance surfaces first as user-visible latency.`,
      `The model down-weights chunks that conflict with its training data, so bad retrieval mainly causes omissions.`,
      `Retrieved chunks enter the prompt with implicit authority, so off-topic chunks are synthesized into confidently wrong answers.`],
    correct:3,
    answer:`The model **weighs what you give it**. Retrieved chunks arrive as trusted context, and the model synthesizes from them even when they are off-topic — garbage retrieval produces confident garbage, not a visible failure.
- Reliability work therefore belongs in the **retrieval layer**: relevance thresholds, reranking, filtering, and "no good source found" as an honest, supported outcome.
- Also instruct the model to **quote or cite the chunks that support each claim**, and to say when none do — the documented long-context grounding technique, which makes bad retrieval visible instead of silently absorbed.
- **Cost** and **latency** are real but secondary consequences.
- The claim that the model **down-weights chunks conflicting with prior knowledge** is simply not how supplied context is treated — it does not reliably reject a chunk on those grounds.` },
  { type:"mc", sub:"5.1", lvl:"intermediate", src:"video1",
    question:`An architect proposes "always pick the model with the largest context window and put everything in it." What does this overlook?`,
    options:[
      `Every token in the window is billed and processed on every request, and recall degrades as the window fills — capacity is not effective use.`,
      `The largest context windows are billed at a long-context premium above standard input pricing.`,
      `The 1M-token window requires a beta header and is restricted to higher usage tiers.`,
      `Tool definitions and tool results are excluded from the window, so tool-heavy prompts break the estimate.`],
    correct:0,
    answer:`Trade-offs of long context:
- **Cost**: every token in the window is billed and processed on every request in the conversation.
- **Latency**: processing time grows with input size.
- **Accuracy**: as token count grows, recall and accuracy degrade — the effect Anthropic's docs call **context rot**. More context is not automatically better.
- The other options are plausible-but-outdated or simply wrong details. On models with a 1M-token window, **1M is the default**: no beta header, no tier gate, and long-context requests are billed at **standard pricing**. And **tool definitions and tool results do count** toward the window, along with the system prompt and the output in progress.
- Curation beats capacity: targeted retrieval plus good ordering (documents first, query last) usually outperforms filling the window because you can.` },
  { type:"mc", sub:"5.2", lvl:"intermediate", src:"video1",
    question:`A support agent handles multi-issue conversations spanning dozens of turns. Beyond periodic summarization, what should its design maintain?`,
    options:[
      `A longer system prompt restating the agent's responsibilities and available actions on every turn.`,
      `A rule that the agent re-reads the full conversation before each reply to re-derive which issues remain open.`,
      `An explicit structured tracker of each issue's status and next action, updated as the conversation proceeds and carried across summarization.`,
      `A hard one-issue-per-session policy, so that no conversation ever tracks more than one thread.`],
    correct:2,
    answer:`Long multi-issue conversations need **explicit state**, not inferred state.
- A structured tracker — \`{issue, status: resolved|pending, next_action}\` — updated as the conversation progresses and **carried through compaction**, alongside the persistent fact block.
- **Re-deriving state from the transcript** is the strongest distractor: it works early and fails exactly when it matters, because the transcript is the thing that gets summarized. Resolved issues resurface; pending ones get dropped.
- **A longer system prompt** adds instructions, not state.
- **One session per issue** is a real product pattern, but it fragments the customer's context and does not fit conversations where new issues surface mid-thread.
- State and precise facts belong outside the compressible narrative.` },
  { type:"mc", sub:"5.6", lvl:"intermediate", src:"video2",
    question:`An agent escalates to humans "whenever its self-reported confidence drops below 70%", and the mechanism misfires constantly — escalating trivial cases while handling badly-wrong ones itself. What is wrong with the design?`,
    options:[
      `The signal itself is invalid: self-reported confidence does not track correctness, so escalation must key on observable conditions.`,
      `The threshold is miscalibrated; it should be tuned against historical outcomes rather than set at a round number.`,
      `Confidence is being sampled once; it should be averaged over several runs to reduce variance.`,
      `Confidence is being used alone; it should be combined with case severity so only high-stakes uncertain cases escalate.`],
    correct:0,
    answer:`**Confidence-based gating is an anti-pattern**: model self-assessment does not correlate reliably with correctness — confidently wrong is the normal case, not the exception.
- Replace it with **observable triggers**: the customer explicitly asks for a human, a defined policy gap or violation is hit, N attempts have failed to make progress, or the action falls into a high-stakes class.
- The other three options are the instructive distractors — recalibrating the threshold, averaging across runs, and weighting by severity are all sensible techniques applied at the wrong layer. Each one refines a signal that is invalid to begin with, making the mechanism look more principled without making it more accurate.` },
]},

/* ============ THIRD-PARTY BANK (rewritten originally) ============ */
{ id:"pdf", name:"📄 ExamTopics (34)", questions:[
  { type:"mc", sub:"1.3", lvl:"basic", src:"pdf",
    question:`A coordinator orchestrates a research pipeline in which a web search subagent and a document analysis subagent both finish their work. The coordinator then calls a synthesis subagent, but that agent replies that it cannot proceed because it received no research material. What is the most probable root cause?`,
    options:[
      `The synthesis agent has no tool that would let it read the other subagents' stored transcripts from the session.`,
      `The synthesis agent's context window is too small to hold the combined output of the two earlier agents.`,
      `The two research subagents were launched as background tasks, so synthesis began before their results were available.`,
      `The coordinator never placed the earlier agents' results into the prompt it sent to the synthesis agent.`],
    correct:3,
    answer:`A subagent's context window starts fresh: the only content that crosses from parent to child is the delegation prompt itself, so findings the coordinator does not inject simply do not exist for the synthesis agent.
- **A**: subagent transcripts are stored separately and are not readable by sibling agents; results reach the next agent only because the orchestrator passes them along.
- **B**: an oversized payload would truncate or error on the findings, not produce a clean report of having received none at all.
- **C**: a background/timing race is a real failure mode, but the stem states both research agents finished before synthesis was invoked.` },
  { type:"mc", sub:"1.2", lvl:"intermediate", src:"pdf",
    question:`While researching renewable energy adoption, the web search subagent reports a recent figure (35% adoption in 2024) and the document analysis subagent extracts an older figure from internal reports (18% in 2022). The synthesis agent treats the two numbers as conflicting sources instead of recognizing an upward trend. Which change would best let the synthesis agent interpret such time-based differences correctly?`,
    options:[
      `Make every subagent stamp each finding with the publication or data-collection date of the underlying source.`,
      `Instruct the synthesis agent to treat the newest figure as authoritative and move older numbers into a historical appendix.`,
      `Have the synthesis agent weight findings by source authority, so peer-reviewed studies override figures drawn from web results.`,
      `Restrict the web search agent to sources published within the last twelve months so all findings describe the same period.`],
    correct:0,
    answer:`Attaching a date to each finding gives the synthesis agent the metadata it needs to see that the figures describe different points in time — a growth trend, not a contradiction. The alternatives fail:
- **B**: relegating older values to an appendix keeps them out of the comparison rather than helping the model relate data points across time.
- **C**: authority weighting resolves credibility conflicts, which is a different problem — here neither figure is wrong.
- **D**: narrowing the window removes the older data point entirely, so trend analysis becomes impossible.` },
  { type:"mc", sub:"1.1", lvl:"advanced", src:"pdf",
    question:`Final research reports are sometimes shallow on particular subtopics. The document analysis agent regularly surfaces gap observations — for example, "sources cover API authentication but say nothing about token refresh patterns" — but the pipeline is strictly linear, so by the time analysis runs, the search phase is already over and the insight goes unused. Which architectural change fixes this most effectively?`,
    options:[
      `Let the analysis agent detect its own gaps and spawn follow-up search agents directly, iterating until coverage is sufficient.`,
      `Insert a research-planning agent ahead of the search phase that decomposes the topic into fine-grained sub-questions.`,
      `Have the synthesis agent attach per-section confidence scores and mark thin areas for human review before publication.`,
      `Have the coordinator read gap signals out of the analysis output and re-run the search phase with gap-informed queries.`],
    correct:3,
    answer:`Detect gap indicators in the analysis output, issue targeted follow-up searches, re-analyze: this is the evaluator-optimizer loop applied to the pipeline, and it keeps orchestration centralized in the coordinator.
- **A**: nested delegation is technically supported, but the nested work and its decisions never surface to the coordinator, so a worker ends up steering the workflow and the run becomes hard to trace.
- **B**: better upfront decomposition raises baseline coverage but cannot address gaps that only become visible once analysis has run.
- **C**: confidence scoring labels the problem for a human; nothing in the pipeline is automatically remedied.` },
  { type:"mc", sub:"1.7", lvl:"advanced", src:"pdf",
    question:`A multi-agent research pipeline crashed after 12 of 28 documents were processed: the search agent had located sources, the analyzer was partway through, and the synthesizer had begun identifying patterns. You must resume without redoing completed work and without degrading the accuracy of what was already found. Which state-management design best balances information fidelity with context efficiency on restart?`,
    options:[
      `Each agent persists a structured export of its progress; on resume the coordinator reads a manifest and injects only the state that agent needs.`,
      `Persist the coordinator's full conversation log — every delegation and every reply — and replay it to each agent on restart.`,
      `Give every agent its own persistent state file that it loads independently whenever a new session begins.`,
      `Index all agent outputs into a shared vector store and have each resuming agent retrieve its prior findings semantically.`],
    correct:0,
    answer:`Structured per-agent exports plus a coordinator-managed manifest preserve complete, machine-readable state (**fidelity**) while letting the coordinator inject only what each agent actually needs (**context efficiency**).
- **B**: raw conversation logs are verbose and unstructured, so they burn context without guaranteeing that the needed state is unambiguous.
- **C**: independent per-agent reloads leave no global view of what is done, so the coordinator cannot sequence the remaining work.
- **D**: semantic retrieval is approximate; recovery needs exact state, not the most similar prior finding.` },
  { type:"mc", sub:"1.1", lvl:"intermediate", src:"pdf",
    question:`A coordinator was extended so that whenever the synthesis agent flags unanswered research questions, it re-dispatches targeted search and analysis tasks and synthesizes again. Coverage improved, but some runs now cycle through five or six rounds on topics where no further sources exist, exhausting the budget and eventually timing out. Which refinement best preserves the completeness gains?`,
    options:[
      `Bound the loop: cap the number of refinement rounds and stop early when a round adds no new findings for the outstanding questions.`,
      `Instruct the synthesis agent to lower its evidence bar after the second round so fewer questions remain flagged as unanswered.`,
      `Run the refinement rounds on a smaller, cheaper model so that additional iterations cost far less per cycle.`,
      `Remove the loop and instead widen the initial query set so the first pass is far less likely to leave gaps.`],
    correct:0,
    answer:`An iterative refinement loop needs an explicit termination condition: a maximum round count plus a no-progress check stops the cycle when further searching is genuinely futile, while leaving the productive iterations intact.
- **B**: relaxing the evidence bar makes the stop condition easier to satisfy by degrading quality — the loop terminates because the check was weakened, not because coverage improved.
- **C**: a cheaper model reduces the cost per round but the run still iterates without end and still hits the timeout.
- **D**: reverting to a single wider pass discards the improvement that motivated the loop, and broad queries still cannot anticipate gaps that surface only after analysis.` },
  { type:"mc", sub:"1.6", lvl:"intermediate", src:"pdf",
    question:`The document analysis subagent processes cited precedents one at a time when examining complex legal cases; a landmark case with 12 precedents takes over three minutes. What is the best way to cut this latency while keeping the system easy for the coordinator to monitor and debug?`,
    options:[
      `Let the analysis subagent spawn its own child agents whenever a case carries an unusually large number of citations.`,
      `Introduce a message queue so precedent-analysis jobs are consumed asynchronously by a pool of long-lived worker agents.`,
      `Build a recursive hierarchy in which analysis agents keep subdividing citations until each child handles a single precedent.`,
      `Have the coordinator launch several analysis subagents in parallel, each taking a slice of the precedents, then merge the results.`],
    correct:3,
    answer:`Coordinator-managed fan-out is the parallelization (sectioning) pattern: independent slices run concurrently, and every subagent remains directly visible to the coordinator that launched it.
- **A**: nesting is supported, but only the top-level subagent's summary returns to the parent, so the child work the coordinator would need in order to debug a bad citation analysis never reaches it.
- **B**: a queue and worker pool add operational infrastructure and decouple execution from the coordinator's view of the run.
- **C**: recursive subdivision multiplies agents and depth, making a single execution path very hard to trace.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"pdf",
    question:`Monitoring shows the research phase is slow because the coordinator calls the web search subagent, waits for it to finish, and only then calls the document analysis subagent — even though neither task depends on the other's output. How do you make these two subagents actually run concurrently?`,
    options:[
      `Move both subagents to a faster, cheaper model tier so that each one's individual runtime drops substantially.`,
      `Build an external async orchestration layer that runs one coordinator-subagent pair per thread and merges the results.`,
      `Expand the coordinator's system prompt with an explanation of why parallelism matters and a request to invoke both subagents at once.`,
      `Have the coordinator emit both Agent tool calls inside a single assistant turn rather than across two separate turns.`],
    correct:3,
    answer:`Concurrency comes from tool-call structure: current Claude models emit several \`tool_use\` blocks in one assistant turn by default when the request benefits from it, and the runtime then executes those calls in parallel. Two calls split across turns are serial by construction. (The tool used to spawn subagents was renamed from \`Task\` to \`Agent\` in Claude Code v2.1.63; \`Task\` still resolves as an alias.)
- **A**: a faster model shortens each leg but the legs still run one after the other.
- **B**: duplicating coordinators adds architecture around the problem instead of fixing concurrency in the existing loop.
- **C**: prompt exhortation influences but does not guarantee call structure — and if \`disable_parallel_tool_use\` is set in \`tool_choice\`, the model is limited to one call per turn no matter what the prompt says.` },
  { type:"mc", sub:"5.5", lvl:"advanced", src:"pdf",
    question:`Production reviews show inconsistent uncertainty handling: sometimes conflicting subagent findings get collapsed into a single confident claim, other times reports hedge so heavily they become useless. When one source says analysts estimate a $50B market and another cites a peer-reviewed study with a much lower figure and a 95% confidence interval, the coordinator either picks one arbitrarily or emits a vague range. Which systematic approach best fixes this?`,
    options:[
      `Have subagents withhold any finding whose confidence falls below a set threshold, so only well-supported material reaches the coordinator.`,
      `Insert a verification subagent that forwards a claim into synthesis only when at least two independent sources corroborate it.`,
      `Have the synthesis agent separate well-supported findings from contested ones and preserve each source's own estimate and methodology.`,
      `Normalize every uncertainty expression to a 0.0-1.0 score and report a reliability-weighted average as the single synthesized figure.`],
    correct:2,
    answer:`Reporting consensus and disagreement in distinct sections — with each source's own characterization and methodology intact — makes uncertainty explicit and reproducible rather than hidden by an arbitrary pick or smeared into a vague range.
- **A**: thresholding suppresses genuinely uncertain evidence, which biases the report by removing the very ambiguity the reader needs to see.
- **B**: corroboration filtering is a reasonable quality control but still discards uncertainty (and every valid single-source finding) instead of representing it.
- **D**: converting qualitative hedges into a weighted numeric average fabricates precision that none of the underlying sources support.` },
  { type:"mc", sub:"1.2", lvl:"intermediate", src:"pdf",
    question:`In production, trivial factual lookups (e.g., "When was the Paris Climate Agreement signed?") flow through all four subagents in sequence, taking 40+ seconds — acceptable for deep comparative research, wasteful for simple questions. The query mix is diverse and keeps shifting as users find new uses. What is the most effective way to handle this varying complexity?`,
    options:[
      `Build rule-based routing that classifies each query by shape and maps each class to a fixed subagent combination.`,
      `Train a complexity classifier on labelled historical queries and retrain it periodically as usage patterns drift.`,
      `Let the coordinator read each incoming query and decide which subagents, if any, that request actually requires.`,
      `Add a triage step that sends short factual questions straight to the search subagent and everything else through the full pipeline.`],
    correct:2,
    answer:`Model-driven routing puts the classification where it can adapt: the coordinator judges each query on its merits, with no rule table to maintain and no retraining cycle — which is what a diverse, shifting workload demands.
- **A**: a fixed rule set is workable when the query taxonomy is stable, but here it develops coverage gaps as soon as users invent new request shapes.
- **B**: a learned classifier needs labelled data and periodic retraining, and it lags behind exactly the new query types that are appearing.
- **D**: surface features such as length are poor proxies for depth — short questions can require comparative analysis, and this triage misroutes them.` },
  { type:"mc", sub:"1.2", lvl:"intermediate", src:"pdf",
    question:`A research system grows beyond a single web search agent: a financial API agent returns structured JSON metrics, a news monitoring agent returns prose summaries, and a patent agent returns structured technology lists. The synthesis agent builds executive briefings but currently flattens everything into bullet points, so financial comparisons lose their tabular clarity and news loses narrative flow. What change most improves briefing quality?`,
    options:[
      `Have the synthesis agent render each content type in its natural form: tables for metrics, prose for news, lists for technical items.`,
      `Convert every subagent output into one intermediate format such as Markdown before synthesis so rendering stays flexible.`,
      `Require every subagent to emit JSON against a single schema covering all data types so the pipeline is programmatically uniform.`,
      `Require every subagent to emit prose summaries so the briefing keeps one consistent executive voice throughout.`],
    correct:0,
    answer:`Matching presentation to content type restores exactly what flattening destroyed: tabular comparability for metrics, narrative continuity for news, and enumerable structure for technical items.
- **B**: a shared intermediate format standardizes transport but does not tell synthesis how to present each type, so generic bullets remain the likely output.
- **C**: one universal schema forces unnatural fields onto dissimilar data and moves complexity into synthesis without improving the human-readable briefing.
- **D**: uniform prose is the most direct restatement of the current failure — it discards tables and lists for the content that most needs them.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"pdf",
    question:`A coordinator has AgentDefinitions properly configured for four specialized subagents — good descriptions, prompts, and tool restrictions. In tests, the coordinator reasons correctly about delegation ("I'll ask the web search agent to find sources"), yet no subagent ever actually runs; the coordinator then carries on as if the delegation had happened, relying on partial knowledge, and the logs contain no errors. What most likely explains this?`,
    options:[
      `Context isolation blocks the coordinator's task descriptions from reaching subagents, so explicit context forwarding must be enabled first.`,
      `The coordinator's max_tokens value is too small, truncating the tool call before the subagent type can be written.`,
      `The coordinator's allowed-tools list omits the Agent tool, so it can describe delegation but has no mechanism to perform it.`,
      `The agent definitions were added after the session started, so the coordinator is still running against the configuration loaded at launch.`],
    correct:2,
    answer:`Omitting \`Agent\` (formerly \`Task\`) from the coordinator's tool list removes its only means of spawning subagents: the model can still plan and narrate delegation, which produces precisely this pattern — no tool calls, no subagent runs, no errors.
- **A**: context isolation governs what a spawned subagent receives; here nothing is ever spawned.
- **B**: truncation at the token limit yields malformed or cut-off output, not a clean turn that simply contains no tool call.
- **D**: stale configuration is a genuine failure mode for filesystem-defined agents, but it would surface as an unknown or missing agent type rather than as delegation that is narrated and silently skipped.` },
  { type:"mc", sub:"5.5", lvl:"intermediate", src:"pdf",
    question:`Final reports keep making claims without proper source attribution. The search and analysis agents do attach citations to their own outputs, but the synthesis agent loses the claim-to-source linkage when merging findings. What architectural change fixes this most effectively?`,
    options:[
      `Have the report generator match claims back to the original sources by semantic similarity and insert the citations afterwards.`,
      `Have the coordinator prefix each handoff with source identifiers and parse those prefixes back out during report generation.`,
      `Retain full subagent transcripts and add a citation-resolution agent that mines them to assign attributions before writing.`,
      `Require every subagent to emit structured claim-to-source mappings that the synthesis agent must carry through and merge.`],
    correct:3,
    answer:`Attribution survives only if it is carried explicitly end to end: structured claim-source pairs that synthesis is required to preserve keep provenance intact through every handoff, rather than reconstructing it later.
- **A**: post-hoc semantic matching is approximate and reliably misattributes claims that resemble more than one source.
- **B**: inline text markers are fragile — any summarizing or reformatting step strips or garbles them, and the scheme degrades as findings multiply.
- **C**: transcript mining preserves the raw material but still infers the linkage indirectly, at considerable complexity and cost.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"pdf",
    question:`A coordinator delegates a 40-file codebase audit to an analysis subagent. The subagent runs dozens of reads and greps and returns a solid summary. The engineer is surprised that the coordinator's own context grew only slightly, and that the coordinator cannot afterwards name the individual files the subagent examined. Which statement correctly explains this behavior?`,
    options:[
      `Only the subagent's final message returns to the coordinator; its intermediate tool calls and results stay in the subagent's own context.`,
      `The coordinator receives the subagent's full transcript but automatically compacts it before appending it to the conversation.`,
      `The subagent's tool results are written to the session transcript and remain outside the coordinator's context until it asks for them.`,
      `The subagent shares the coordinator's context window, so its reads were charged against the coordinator's budget rather than added to it.`],
    correct:0,
    answer:`Context isolation is the point of a subagent: it works in a fresh context window and the parent receives its final message as the tool result. Intermediate reads, greps, and their outputs never enter the parent conversation — which is why the coordinator's context barely moved and why it cannot enumerate the files.
- **B**: no automatic compaction of the child transcript into the parent occurs; the transcript is stored separately and is not appended at all.
- **C**: subagent transcripts do persist independently, but there is no in-conversation mechanism by which the coordinator pulls them into its own context on demand.
- **D**: a subagent does not share the parent's context window, and its window is sized by its own model, not the parent's.` },
  { type:"mc", sub:"1.2", lvl:"basic", src:"pdf",
    question:`The web search subagent has assembled a set of relevant sources, and the document analysis subagent must now examine them. In the standard orchestration model, how does information travel between these two specialized subagents?`,
    options:[
      `The coordinator takes the search agent's output and embeds the relevant findings in the prompt that invokes the analysis agent.`,
      `The two agents exchange data over an event-driven message queue, with the analysis agent subscribed to search-completion events.`,
      `The search agent calls the analysis agent directly, passing the discovered sources as arguments to that invocation.`,
      `Both agents read and write a shared memory store: search writes its findings there and analysis picks them up.`],
    correct:0,
    answer:`In the orchestrator-workers pattern all data flow passes through the coordinator: the only content that reaches a subagent is the delegation prompt, so the coordinator must place the relevant search findings (or the paths and identifiers needed to reach them) into the analysis agent's prompt.
- **B**: an event bus is deployment infrastructure the standard pattern does not use, and it removes the coordinator from the data path.
- **C**: peer-to-peer invocation gives up centralized control and observability over what each worker received.
- **D**: a shared store is a legitimate scaling technique for very large payloads, but the coordinator still has to tell the analysis agent what to read — the store alone conveys nothing.` },
  { type:"mc", sub:"5.1", lvl:"intermediate", src:"pdf",
    question:`In a pipeline, web search yields 25 sources (~120K tokens of raw content), document analysis distills them to 15K tokens of insights, and synthesis produces a 3K-token narrative draft. The coordinator must now hand context to the report generation agent, which needs to produce the final output with accurate citations. Which context-passing strategy best balances completeness and efficiency?`,
    options:[
      `Send only the synthesis draft and let a post-processing pipeline match claims back to sources and insert citations afterwards.`,
      `Send the entire accumulated context from every prior stage so that nothing which might matter is left behind.`,
      `Send the synthesis draft together with a structured index mapping each key claim to its source URL and supporting excerpt.`,
      `Send a condensed digest of all upstream stages that keeps the major findings but credits sources by name only.`],
    correct:2,
    answer:`The draft supplies the narrative to finish; the claim-to-source index supplies exactly the evidence needed to cite it — a few thousand tokens instead of the 138K accumulated upstream. That is the completeness/efficiency optimum for this task.
- **A**: deferring citation to a matching pass re-derives attribution by inference, which is where wrong and missing citations come from.
- **B**: forwarding everything is wasteful and risks the context limit, and the raw sources are not what the report agent needs.
- **D**: source names without excerpts let the agent cite material it cannot check, so citations land on the wrong sentences.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"pdf",
    question:`A product-search tool wraps an external catalog API that pages results 50 at a time. Logs show queries often match 200+ products, and the current design — which automatically fetches every page — causes 15-20 second stalls. How should pagination be redesigned?`,
    options:[
      `Split the capability into a search tool and a separate fetch-more-results tool that the agent calls to page forward.`,
      `Add server-side relevance ranking and return only the fifty highest-ranked products for any query.`,
      `Add a max_pages parameter defaulting to two that caps how many pages the tool fetches internally per call.`,
      `Return the first page along with the total match count and a cursor the agent can use to request further pages.`],
    correct:3,
    answer:`Sensible pagination defaults plus an explicit continuation signal is the recommended shape: the agent immediately sees how large the result set is and pulls more only when the task actually needs it.
- **A**: exposing paging as a second tool works, but it turns control flow into tool-selection decisions and adds a tool whose purpose is purely mechanical.
- **B**: ranking-plus-truncation is fast and often reasonable, but it silently makes the remaining matches unreachable and gives the agent no signal that they exist.
- **C**: a page cap bounds the latency yet still decides inside the tool how much to fetch, so it either over-fetches or truncates without telling the agent.` },
  { type:"mc", sub:"2.2", lvl:"basic", src:"pdf",
    question:`A flight-search tool calls an external airline API that intermittently responds with 503 Service Unavailable. What is the most effective way for the tool implementation to deal with this error?`,
    options:[
      `Return an empty flight list, as though the search completed successfully but matched no itineraries.`,
      `Serve the most recent cached result set for that route and mark the response as possibly out of date.`,
      `Return a tool result flagged as an error explaining that the airline service is temporarily unavailable.`,
      `Retry inside the tool with exponential backoff, reporting an error only if every attempt fails.`],
    correct:3,
    answer:`A 503 is transient, and the tool layer is where it should be absorbed: a bounded retry with exponential backoff usually succeeds without costing the agent a turn, and only a persistent outage is surfaced as an error.
- **A**: presenting an outage as "no flights" is the worst outcome — the agent draws a confident, wrong conclusion.
- **B**: stale cached fares are plausible for some read paths but wrong for pricing and availability, where the user may act on the data.
- **C**: an honest error result is correct once retries are exhausted, but returning it immediately spends a turn on a failure that would most likely have cleared on the next attempt.` },
  { type:"mc", sub:"2.4", lvl:"intermediate", src:"pdf",
    question:`An MCP server exposes a check_availability tool backed by an external calendar API. Testing produces three failures: (1) the tool is invoked without the required user_email argument; (2) the calendar API returns 404 because the named user does not exist; (3) the calendar API returns 503 because the service is briefly down. Under MCP's error-handling model, how should each be reported?`,
    options:[
      `All three as tool results carrying isError: true.`,
      `Errors 1 and 2 as JSON-RPC protocol errors; error 3 surfaced through a tool result that sets isError: true.`,
      `Error 1 as a JSON-RPC protocol error; errors 2 and 3 surfaced through tool results that set isError: true.`,
      `All three as JSON-RPC protocol errors.`],
    correct:2,
    answer:`The MCP tools specification defines two mechanisms: **protocol errors** (standard JSON-RPC) for unknown tools, invalid arguments, and server errors; and **tool execution errors** reported in the result with \`isError: true\` for API failures, invalid input data, and business-logic failures.
- A missing required parameter (error 1) is an invalid argument — the request itself is malformed, so it is a **JSON-RPC protocol error**.
- A 404 for a nonexistent user (error 2) is a business-logic outcome the tool executed correctly and reports — **isError: true**.
- A 503 from the upstream calendar (error 3) is an API failure during execution — **isError: true**.
Option A demotes a malformed request to an execution result; B promotes a valid "not found" outcome to a protocol failure; D treats upstream API behavior as a protocol failure, which it is not.` },
  { type:"mc", sub:"2.1", lvl:"basic", src:"pdf",
    question:`A document-lookup tool currently replies in prose, e.g. "3 matches: Q3 Hiring Plan, Q3 Hiring Forecast, Yearly Summary." In later steps the agent must operate on particular documents — fetching them, running further queries against them, chaining operations. Which return format best supports these multi-step workflows?`,
    options:[
      `Clickable URLs that open each matching document directly in the user's browser.`,
      `Structured results carrying a stable, semantically meaningful document identifier plus key metadata per match.`,
      `A JSON array containing the document titles taken verbatim from the search results.`,
      `Longer human-readable descriptions adding details such as file size, author, and last-modified date.`],
    correct:1,
    answer:`Tool responses should return only high-signal information, including stable identifiers the agent can feed straight into the next call. Meaningful IDs plus a little metadata are what make chained operations reliable.
- **A**: browser links target a human reader; the agent cannot use them as arguments to a follow-up tool call.
- **C**: titles are neither unique nor stable — two "Q3 Hiring" documents already collide in this result set.
- **D**: richer prose helps a person skim but leaves the agent parsing free text for the identifier it needs.` },
  { type:"mc", sub:"2.3", lvl:"advanced", src:"pdf",
    question:`An agent has 50+ specialized API connectors, and tool-selection accuracy has fallen to 58% as the library grew. You add a search_connectors(description) discovery tool, but in testing the agent often skips the search and invokes connectors directly (frequently the wrong ones), or searches and then still picks a poor match from the results. Which tool-composition design addresses both failure modes?`,
    options:[
      `Give each connector built-in compatibility validation that returns a descriptive error when a request does not fit it.`,
      `Build a composite find_and_execute(description, params) tool that selects the best-matching connector and runs it in one step.`,
      `Enrich every connector description with usage samples and edge cases, plus few-shot examples of the search-then-use workflow.`,
      `Defer loading of the connectors so that none is callable until search_connectors surfaces it and adds it to the toolset.`],
    correct:3,
    answer:`Deferred loading is the mechanism behind the Tool Search Tool: connectors marked \`defer_loading: true\` are absent from the initial context, so a direct call to an undiscovered connector is structurally impossible, and after a search only the matching handful are visible — which also raises accuracy on the second decision. Anthropic reports selection accuracy rising from 49% to 74% (Opus 4) and 79.5% to 88.1% (Opus 4.5) with tool search enabled, alongside roughly an 85% reduction in tool-definition tokens.
- **A**: validation reports a mismatch only after the wrong connector was chosen; first-pass selection is unchanged.
- **B**: folding selection into execution removes the agent's visible reasoning, so a wrong pick becomes opaque and hard to diagnose.
- **C**: richer descriptions genuinely help selection, but they enlarge the very context that is causing the problem and still rely on the agent voluntarily searching first.` },
  { type:"mc", sub:"2.2", lvl:"intermediate", src:"pdf",
    question:`A publish-article tool talks to a CMS API that produces both transient failures (network timeouts, 503s) and permanent ones (403 permission denied, 422 validation errors). Today every error goes straight back to the agent, which wastes turns retrying failures that can never succeed. How should error handling be divided between the tool implementation and the agent?`,
    options:[
      `Handle everything in the tool: retry every error class with exponential backoff and report failure only once the budget is spent.`,
      `Retry transient errors inside the tool, and return permanent ones to the agent with specific, actionable messages.`,
      `Return every error to the agent immediately with full context and let it decide what to retry, keeping the tool stateless.`,
      `Normalize all failures into a single retryable error type with a uniform message so the agent's handling logic stays simple.`],
    correct:1,
    answer:`The division follows recoverability: the tool silently absorbs what a retry can fix, and escalates what only a behavioral change can fix — with an error message that communicates specific, actionable improvements (fix the payload, request the permission).
- **A**: retrying 403s and 422s burns the budget on failures that are deterministic, and it withholds the feedback the agent needs.
- **C**: pushing retry policy onto the agent reproduces exactly the wasted turns described in the stem.
- **D**: a uniform generic error simplifies the agent's code by destroying the information that would let it recover.` },
  { type:"mc", sub:"1.4", lvl:"advanced", src:"pdf",
    question:`A remove_team_member tool offers a dry_run boolean so impacts can be previewed before execution, but monitoring shows the agent skips the preview and calls dry_run=false directly in 15% of cases. Policy requires that a preview run first and that the user explicitly confirm it before any removal executes. Which design enforces this most reliably?`,
    options:[
      `Add server-side validation that accepts dry_run=false only if an identical dry_run=true call was made within the last sixty seconds.`,
      `Split into preview_remove_member, which returns the impacts plus a single-use token, and execute_remove_member, which requires that token.`,
      `Mark the tool as confirmation-required and let the orchestration layer collect the user's approval before forwarding any such call.`,
      `Strengthen the tool description with explicit instructions and worked examples requiring a dry run and a confirmation before execution.`],
    correct:1,
    answer:`Binding execution to a single-use token that only the preview can issue makes the sequence structurally unskippable: without a token there is no valid execute call, and the token identifies the exact impact set that was reviewed.
- **A**: a recent-call window is close, but it proves only that some preview happened — not that this user saw and approved this result — and it fails or misfires around retries and concurrent operations.
- **C**: orchestration-level confirmation is a real control, yet it lives outside the tool and depends on every caller being configured with it.
- **D**: instruction-following is precisely what is already failing 15% of the time; better wording changes the rate, not the guarantee.` },
  { type:"mc", sub:"1.4", lvl:"intermediate", src:"pdf",
    question:`An expense-reimbursement agent handles hundreds of daily requests through a reimbursement-processing tool. Policy says amounts over $500 require managerial approval before payout, and this threshold must hold no matter how the agent is prompted. Which design makes the $500 rule impossible to bypass?`,
    options:[
      `The tool takes an approved_by_manager flag that the agent sets after verifying approval, with a nightly audit over every true value.`,
      `Offer a capped auto-reimburse tool and a manager-approval tool, with prompt guidance on choosing plus a PostToolUse hook logging the choice.`,
      `The tool enforces the threshold itself: under $500 it disburses, and over $500 it opens a pending approval request and reports that.`,
      `A PreToolUse hook inspects the amount and, above $500, injects a requires_approval flag that the tool checks before disbursing.`],
    correct:2,
    answer:`Only a check inside the tool's own execution path is unconditional: the tool reads the amount it was given and routes large requests to pending approval, so no prompt, jailbreak, or misconfigured client can produce an unapproved payout.
- **A**: the agent decides the flag's value, so the control is exactly as trustworthy as the prompt, and the nightly audit detects violations only after the money moved.
- **B**: two tools with prompt guidance still leaves selection to the agent; a PostToolUse hook records what happened but cannot prevent it.
- **D**: a PreToolUse hook can allow, ask, or deny a call, but it is configuration outside the tool — if it is absent or bypassed the tool still disburses, and here the tool is trusting a flag it did not compute.` },
  { type:"mc", sub:"2.1", lvl:"basic", src:"pdf",
    question:`An order-management agent needs three operations: issuing a refund (needs amount and reason), canceling an order (needs reason), and reshipping (needs a shipping address). All three share an order_id but differ in their other requirements. Testing shows the agent frequently omits required parameters or supplies irrelevant ones. Which design change most improves parameter accuracy?`,
    options:[
      `Split into three tools, each declaring only the parameters that its own operation actually requires.`,
      `Keep one tool with an operation parameter and the rest optional, adding few-shot examples of each valid combination.`,
      `Keep one tool but express the per-operation requirements using JSON Schema if/then/else conditionals.`,
      `Keep one tool with a nested operation object whose shape varies by operation type, documented in the description.`],
    correct:0,
    answer:`Because the three operations have disjoint parameter sets, separate tools let \`required\` do the work: for any call the schema names exactly the fields that apply, so omissions and stray fields are rejected before the model can make them. (The general advice to consolidate related operations into fewer tools targets fragmentation into low-level primitives that must be chained — not distinct write operations with incompatible inputs.)
- **B**: examples raise accuracy, but an all-optional schema still declares every wrong combination to be legal.
- **C**: conditional schemas encode the rule correctly and are the right fallback when the tool surface must stay fixed; they are simply more complex than splitting when nothing forces a single tool.
- **D**: a polymorphic nested object shifts the requirements into prose the model must infer, which is the weakest form of enforcement here.` },
  { type:"mc", sub:"2.1", lvl:"basic", src:"pdf",
    question:`A tool in your finance agent reports the total value of a user's investment portfolio. You must choose whether the tool returns a JSON object with well-defined fields or a human-readable sentence. What is the main benefit of the field-based structured response?`,
    options:[
      `JSON is markedly more token-efficient than prose, so the same information costs measurably less on every call.`,
      `The agent reads exact values from named fields instead of parsing prose, which reduces errors in later steps.`,
      `Structured output makes the model's extraction deterministic, so the value it reads is correct by construction.`,
      `A response schema verifies that the upstream API returned accurate figures before the agent acts on them.`],
    correct:1,
    answer:`**B is correct.** Named, predictable fields let the agent address a value directly rather than inferring it from free text, and that is what removes downstream extraction errors.
- **A**: JSON is not inherently cheaper — keys, braces, and quoting often make it cost more tokens than the equivalent sentence.
- **C**: structure improves reliability but the model remains probabilistic; nothing about JSON makes its reading of a field deterministic.
- **D**: a schema constrains shape and types only. A well-formed response carrying a wrong number still validates.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"pdf",
    question:`A clinic-booking agent first calls get_available_slots(date, provider_id) and then book_appointment(provider_id, slot_time, patient_id). Support data shows 15% of bookings fail with "slot no longer available" because a different user grabs the slot in the window between the availability lookup and the booking call. What tool redesign best resolves this?`,
    options:[
      `Return richer booking failures that include the currently open alternatives, so the agent can immediately retry with another time.`,
      `Keep both tools and instruct the agent to re-fetch availability and choose a different slot whenever a booking attempt fails.`,
      `Add hold_slot(provider_id, slot_time), a sixty-second soft lock the agent must take between checking and booking.`,
      `Merge the two into find_and_book_appointment, which checks and reserves atomically and returns a confirmation or alternatives.`],
    correct:3,
    answer:`**D is correct.** Collapsing check-then-book into one atomic server-side operation closes the window entirely — there is no interval in which another user can take the slot — and it also consolidates a two-call workflow into one call.
- **A**: better failure payloads speed recovery but the 15% failure rate remains, because the race is still there.
- **B**: prompt-level retry logic depends on agent behavior and simply re-enters the same race.
- **C**: a hold shortens the window rather than removing it, and it introduces lock expiry, orphaned holds, and an extra call that can itself fail.` },
  { type:"mc", sub:"2.1", lvl:"intermediate", src:"pdf",
    question:`A fitness agent calls log_workout(exercise_type, value, measurement). The schema is already tight — measurement is an enum of "minutes", "miles", "reps", "sets" — yet 23% of calls still pair a strength exercise with "miles" or a run with "reps". A partner API fixes the single-tool shape, so splitting it is not an option. Which change is most likely to raise parameter accuracy?`,
    options:[
      `Add schema-validated input examples to the tool definition showing correct exercise/measurement pairings for each category.`,
      `Set strict schema validation on the tool so the platform validates every input before the call reaches your handler.`,
      `Reject invalid pairings server-side with an error naming the measurements valid for that exercise so the agent retries.`,
      `Make exercise_type an enum as well, so the model can only choose from the catalogued exercise names.`],
    correct:0,
    answer:`**A is correct.** A JSON Schema can express structural validity but not a correlation between two fields. Concrete input examples show the model the pairing convention directly; Anthropic reports accuracy on complex parameter handling improving from 72% to 90% when tool definitions carry examples.
- **B**: strict validation guarantees the call conforms to the schema — and every one of these bad calls already does, because "miles" is a legal enum member.
- **C**: server-side rejection is worth having as a backstop, but it corrects errors after they cost a turn instead of preventing them.
- **D**: constraining exercise_type removes invented exercise names; it says nothing about which measurement goes with which exercise.` },
  { type:"mc", sub:"2.1", lvl:"basic", src:"pdf",
    question:`An MCP server offers archive_file(file_id) and delete_file(file_id), currently described only as "Archives a file" and "Deletes a file." Logs show the agent invokes delete_file when users say "remove old backups," even though policy says backups must be archived. Which change most directly improves the agent's choice of tool?`,
    options:[
      `Insert a confirmation gate requiring the user to type CONFIRM DELETE before delete_file will execute.`,
      `Have the server reject delete_file on backup-tagged files and return an error pointing the agent to archive_file.`,
      `Rewrite both descriptions with explicit use cases and exclusions, stating that delete_file is not for backup files.`,
      `Add few-shot demonstrations to the system prompt mapping requests that mention backups or old files to archive_file.`],
    correct:2,
    answer:`**C is correct.** Detailed tool descriptions are by far the strongest lever on tool-use performance: a good description states what the tool does, when it should be used, and — critically here — when it should not. That is exactly the missing signal driving the wrong selection.
- **A**: a typed confirmation reduces the blast radius of a bad choice but leaves the choice itself unchanged.
- **B**: server-side rejection enforces the policy only after the wrong tool has already been selected, and it covers only files the tagging happens to catch.
- **D**: prompt-level examples do help, but they sit further from the decision than the descriptions the model reads alongside every candidate tool.` },
  { type:"mc", sub:"1.4", lvl:"intermediate", src:"pdf",
    question:`In a CRM agent, the delete_contact tool handles requests such as "remove the duplicate record for Orion Labs." Its database contains several nearly identical names ("Orion Labs," "Orion Laboratories," "ORION Labs Ltd."), and 8% of deletions get reversed within a day because the wrong record was removed. Meanwhile users complain the existing multi-step confirmation makes routine cleanup tedious. Which design best cuts the error rate without sacrificing efficiency?`,
    options:[
      `Present the candidate matches side by side with their distinguishing fields and take a single-click confirmation of the intended record.`,
      `Require the exact record identifier from the CRM interface instead of allowing users to refer to contacts by name.`,
      `Roll out automated duplicate detection that merges likely duplicates so that manual deletion requests become rare.`,
      `Switch to soft deletion with a thirty-day undo window so that mistakes are recoverable without adding steps to the flow.`],
    correct:0,
    answer:`**A is correct.** The failure is misidentification among near-identical names, so showing the ambiguous candidates with the fields that tell them apart addresses the cause directly, while one click keeps the flow lighter than today's multi-step confirmation — satisfying both requirements.
- **B**: exact identifiers would cut errors, at the cost of exactly the friction users are already complaining about.
- **C**: auto-merge is a reasonable parallel initiative but does not protect the manual deletions that remain — and merging the wrong pair repeats the same misidentification.
- **D**: soft delete limits the damage of an error and is worth having, yet the 8% wrong-record rate is unchanged.` },
  { type:"mc", sub:"4.2", lvl:"intermediate", src:"pdf",
    question:`After adopting tool use with strict schemas for a document-extraction pipeline, malformed JSON is gone, yet 5% of outputs are schema-valid but carry empty arrays or nulls in mandatory fields such as citations and methodology. Spot checks confirm the source documents do contain that information, just in heterogeneous forms — inline citations versus bibliographies, dedicated methodology sections versus details woven into the introduction. What is the most effective fix?`,
    options:[
      `Relax the schema so citations and methodology become optional and route incomplete records to manual review.`,
      `Add a post-processing pass that scans each document with regexes for citation patterns and methodology keywords.`,
      `Supply examples spanning the differing document layouts, showing how citations and methodology appear in each.`,
      `Add retry logic that resubmits the extraction whenever validation finds an empty required field.`],
    correct:2,
    answer:`**C is correct.** Strict schemas guarantee shape, never content. The residual failures come from layout variation the model has not been shown how to read, and examples covering those layouts are the standard remedy for exactly that kind of recognition gap.
- **A**: making the fields optional converts a quality problem into a manual-review queue without improving extraction.
- **B**: regex extraction is workable for tightly formatted citations and hopeless for methodology prose, and it degrades on every new layout.
- **D**: an unchanged request retried against an unchanged document reproduces the same empty fields.` },
  { type:"mc", sub:"5.5", lvl:"intermediate", src:"examtopics",
    question:`Every finding in your research pipeline now travels as a structured {claim, source_url, excerpt} triple, and the writer agent emits citations against those triples. QA nonetheless still finds occasional sentences whose linked excerpt does not actually support what the sentence asserts. You need an automated check that runs on every report before release. Which check is most effective?`,
    options:[
      `Verify that each cited URL in the report resolves successfully and that the linked document is still reachable.`,
      `Run a judge model over each cited sentence paired with its excerpt, deciding whether the excerpt supports the sentence.`,
      `Compare embedding similarity between each cited sentence and its excerpt, flagging pairs that fall below a threshold.`,
      `Assert that every sentence carries at least one citation and that no single source is cited more than a few times.`],
    correct:1,
    answer:`**A judge-model entailment check** is the only option that evaluates the property that is actually failing: does this excerpt support this sentence? Scoring each pair in isolation keeps the judgement narrow and reviewable.
- Link resolution (**A**) confirms the source exists, which it does — the linkage is intact and the support is not.
- Embedding similarity (**C**) is a cheap proxy that scores topical relatedness; a sentence that contradicts its excerpt sits close to it in embedding space.
- Structural assertions (**D**) measure citation coverage and distribution, so a fully cited report with unsupported claims passes cleanly.` },
  { type:"mc", sub:"1.3", lvl:"intermediate", src:"examtopics",
    question:`In a long-running orchestration the coordinator has built up a detailed picture of the user's requirements, the constraints agreed along the way, and the decisions already taken. It now needs a side investigation into a flaky integration test. Restating the whole situation in a delegation prompt would be long and error-prone, but the investigation itself will produce a large volume of logs and test output. How should the coordinator delegate this?`,
    options:[
      `Fork the conversation, so the child inherits the full history while its own tool output stays out of the parent's context.`,
      `Spawn a standard subagent and paste the coordinator's accumulated conversation history into the delegation prompt.`,
      `Spawn a standard subagent with a brief task description and let it rediscover the constraints from the repository and CLAUDE.md.`,
      `Investigate in the coordinator itself, since any delegation would discard the context that has been accumulated.`],
    correct:0,
    answer:`A fork is the subagent variant that inherits the entire conversation instead of starting fresh: the child sees the same history, so nothing has to be re-explained, while its tool calls remain in its own context and only the final result returns to the parent — which is precisely the combination this task needs.
- **B**: pasting history into a normal delegation prompt approximates the same effect but is lossy, expensive, and easy to get wrong under a long history.
- **C**: a fresh subagent starting from files will miss the decisions that were made in conversation and never written down.
- **D**: keeping the work inline preserves context but dumps every log line into the coordinator's window, which is the cost delegation exists to avoid.` },
  { type:"mc", sub:"1.7", lvl:"advanced", src:"examtopics",
    question:`Your recovery design already checkpoints each agent's completed work to durable storage. During a restart drill you find duplicated records: the extraction agent wrote its output for document 12 and then crashed before the checkpoint marking document 12 as done, so on resume it processed and wrote that document a second time. What is the most reliable fix?`,
    options:[
      `Make each write idempotent by keying it on the work item's identifier, so reprocessing a document overwrites rather than appends.`,
      `Write the checkpoint before performing the work, so that a crash can never leave completed work unrecorded.`,
      `Add a deduplication pass at the end of the run that collapses records sharing the same document identifier.`,
      `Shrink the checkpoint interval so that the window between writing output and recording it is as small as possible.`],
    correct:0,
    answer:`A crash can always land between the write and the checkpoint, so resume must tolerate replaying an item. Keying each write on the item's identifier makes reprocessing harmless: the second write lands on the same record instead of creating a new one.
- **B**: checkpointing first inverts the failure into the worse one — a crash then marks work done that was never written, and the item is silently skipped forever.
- **C**: an end-of-run dedup pass cleans up the symptom, and it cannot distinguish a duplicate from two legitimately similar records.
- **D**: the interval here is already one item; the gap is between two operations, not between checkpoints, so it cannot be closed by checkpointing more often.` },
  { type:"mc", sub:"2.3", lvl:"intermediate", src:"examtopics",
    question:`Four specialized subagents were each wired up with the platform's entire catalog of 18 tools. In testing, they routinely reach for tools outside their role — the synthesizer fires web searches, the report writer tries document analysis. What is the PRIMARY cause?`,
    options:[
      `Choosing among eighteen options rather than the four or five relevant to the role pushes selection past reliable accuracy.`,
      `Eighteen tool definitions consume enough of the context window that little room is left for the task itself.`,
      `The role descriptions in the system prompts conflict with the breadth of tool access each agent was granted.`,
      `The coordinator loses track of which subagent holds which capability and routes tasks to the wrong specialist.`],
    correct:0,
    answer:`The primary cause is **selection complexity from over-provisioning**: every tool beyond the role's needs is one more plausible candidate, and measured selection accuracy falls as the visible catalog grows — Anthropic's tool-search results show accuracy rising sharply (49% to 74% on Opus 4) once the model chooses from a filtered subset rather than the whole library.
- **B**: definition tokens are a real cost, but eighteen definitions leave ample room here; this degrades capacity, not primarily choice.
- **C**: the tension between a narrow prompt and broad access is a contributing factor, yet the prompts already state each role — the model is choosing wrongly among tools it understands.
- **D**: misrouting is a different failure: these agents received the correct tasks and then picked the wrong tools themselves.
- Fix: scope each agent's \`tools\` to its role, and reach anything else through delegation.` },
]},
];
