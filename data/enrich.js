/* Enrichment layer: attaches API request/response snippets and SVG diagrams
   to questions by (module, 0-based index). Runs after questions.js.
   NOTE: indexes are positional — if questions are reordered, update here. */
(function(){
const S='#9aa7b4', A='#d97742', OK='#2ea043', BAD='#f85149', BX='#1c2230', BR='#2a3240', TX='#e6edf3';
function box(x,y,w,h,label,stroke){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${BX}" stroke="${stroke||BR}"/><text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" fill="${TX}" font-size="12">${label}</text>`}
function arrow(x1,y1,x2,y2,color){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color||S}" stroke-width="1.5" marker-end="url(#ah)"/>`}
const DEFS=`<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${S}"/></marker></defs>`;
function svg(w,h,inner){return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${inner}</svg>`}

/* ---- diagrams ---- */
const DIAG_LOOP=svg(560,190,
  box(20,70,120,44,'Your app')+
  box(230,20,120,44,'Claude (API)')+
  box(440,70,120,44,'Tool handler')+
  arrow(140,85,230,48)+`<text x="160" y="48" fill="${S}" font-size="11">messages</text>`+
  arrow(350,48,440,85)+`<text x="360" y="48" fill="${A}" font-size="11">stop_reason: "tool_use"</text>`+
  arrow(440,105,350,140)+`<text x="360" y="150" fill="${S}" font-size="11">tool_result</text>`+
  arrow(230,140,140,105)+`<text x="150" y="150" fill="${S}" font-size="11">loop continues…</text>`+
  box(230,130,120,40,'append + resend')+
  `<text x="290" y="185" fill="${OK}" font-size="11" text-anchor="middle">exit when stop_reason = "end_turn"</text>`);
const DIAG_HUB=svg(560,210,
  box(215,80,130,46,'Coordinator','${A}')+
  box(20,20,120,40,'Subagent A')+box(20,150,120,40,'Subagent B')+
  box(420,20,120,40,'Subagent C')+box(420,150,120,40,'Subagent D')+
  arrow(140,45,220,88)+arrow(140,165,220,118)+arrow(420,45,340,88)+arrow(420,165,340,118)+
  `<line x1="80" y1="60" x2="80" y2="150" stroke="${BAD}" stroke-width="1.5" stroke-dasharray="4"/><text x="88" y="110" fill="${BAD}" font-size="11">✗ no peer-to-peer</text>`+
  `<text x="280" y="205" fill="${S}" font-size="11" text-anchor="middle">all communication routes through the hub: observable, uniform errors, controlled flow</text>`);
const DIAG_CHAIN=svg(560,180,
  `<text x="10" y="20" fill="${TX}" font-size="12" font-weight="bold">Prompt chaining (sequential)</text>`+
  box(10,30,110,36,'extract')+arrow(120,48,155,48)+box(155,30,110,36,'translate')+arrow(265,48,300,48)+box(300,30,110,36,'format')+
  `<text x="425" y="52" fill="${S}" font-size="11">gates between steps</text>`+
  `<text x="10" y="105" fill="${TX}" font-size="12" font-weight="bold">Parallelization (sectioning)</text>`+
  box(10,115,110,36,'part 1')+box(10,115,0,0,'')+box(135,115,110,36,'part 2')+box(260,115,110,36,'part 3')+
  arrow(65,151,200,170)+arrow(190,151,205,168)+arrow(315,151,215,170)+box(150,168,120,0,'')+
  `<text x="215" y="178" fill="${S}" font-size="11" text-anchor="start">aggregate</text>`);
const DIAG_PIPE=svg(560,120,
  box(20,40,120,44,'Agent A')+arrow(140,62,190,62)+box(190,40,120,44,'Agent B')+arrow(310,62,360,62)+box(360,40,140,44,'Agent C (output)','${BAD}')+
  `<text x="80" y="30" fill="${BAD}" font-size="11">subtle error</text>`+
  `<text x="250" y="30" fill="${BAD}" font-size="11">trusted input ↑</text>`+
  `<text x="430" y="30" fill="${BAD}" font-size="11">confidently wrong</text>`+
  `<text x="280" y="110" fill="${S}" font-size="11" text-anchor="middle">without gates, errors propagate silently and compound downstream</text>`);
const DIAG_CACHE=svg(560,120,
  `<rect x="20" y="35" width="150" height="34" fill="#12261a" stroke="${OK}" rx="6"/><text x="95" y="56" fill="${TX}" font-size="11" text-anchor="middle">tools</text>`+
  `<rect x="170" y="35" width="150" height="34" fill="#12261a" stroke="${OK}" rx="6"/><text x="245" y="56" fill="${TX}" font-size="11" text-anchor="middle">system prompt</text>`+
  `<rect x="320" y="35" width="110" height="34" fill="#12261a" stroke="${OK}" rx="6"/><text x="375" y="56" fill="${TX}" font-size="11" text-anchor="middle">stable docs</text>`+
  `<line x1="435" y1="25" x2="435" y2="80" stroke="${A}" stroke-width="2" stroke-dasharray="5"/><text x="440" y="22" fill="${A}" font-size="11">cache_control breakpoint</text>`+
  `<rect x="440" y="35" width="100" height="34" fill="#2a1416" stroke="${BAD}" rx="6"/><text x="490" y="56" fill="${TX}" font-size="11" text-anchor="middle">dynamic</text>`+
  `<text x="280" y="105" fill="${S}" font-size="11" text-anchor="middle">stable prefix first (cached, ~10% cost) · variable content after the breakpoint</text>`);

/* ---- code snippets ---- */
const E={
agentic:{
  1:{code:`// API response — the loop's control signal
{
  "id": "msg_01...",
  "role": "assistant",
  "content": [
    {"type": "text", "text": "Let me look that up."},
    {"type": "tool_use", "id": "toolu_01...",
     "name": "search_orders", "input": {"customer_id": "C-102"}}
  ],
  "stop_reason": "tool_use"   // ← execute tool, append result, resend
}
// ...when the model is done:
{ "content": [{"type": "text", "text": "Your order ships Friday."}],
  "stop_reason": "end_turn" } // ← loop exits here`,diagram:DIAG_LOOP},
  2:{code:`if (response.stop_reason === "tool_use") {
  const results = await runTools(response.content);
  messages.push({role: "assistant", content: response.content});
  messages.push({role: "user", content: results}); // tool_result blocks
  continue;                       // keep looping
}
if (response.stop_reason === "end_turn") break;    // done
if (response.stop_reason === "max_tokens") retryWithMoreBudget();`},
  8:{code:`// Agent SDK — the coordinator can only spawn subagents
// if "Task" is among its allowed tools
const result = query({
  prompt: "Research these 4 subtopics and synthesize",
  options: {
    allowedTools: ["Task", "Read", "WebSearch"],  // ← "Task" required
    maxTurns: 30
  }
});`},
  10:{code:`// PARALLEL: one assistant turn, multiple Task calls
{ "role": "assistant", "content": [
    {"type": "tool_use", "name": "Task", "input": {"prompt": "Research subtopic A"}},
    {"type": "tool_use", "name": "Task", "input": {"prompt": "Research subtopic B"}},
    {"type": "tool_use", "name": "Task", "input": {"prompt": "Research subtopic C"}}
]}
// SEQUENTIAL (slow): call Task → await → call Task → await → ...`},
  19:{code:`// Hook config — deterministic, the model cannot skip it
{ "hooks": { "PreToolUse": [{
    "matcher": "delete_record",
    "hooks": [{"type": "command",
               "command": "python check_policy.py"}]
}]}}
// check_policy.py exits non-zero → the tool call is BLOCKED
// stdin receives {"tool_name": "delete_record", "tool_input": {...}}`},
  22:{code:`// Agent SDK — independent branches from a shared baseline
const branchA = query({ prompt: "Refactor with approach A",
  options: { resume: sessionId, forkSession: true } });
const branchB = query({ prompt: "Refactor with approach B",
  options: { resume: sessionId, forkSession: true } });
// each fork inherits the analysis; neither sees the other's work`},
  31:{diagram:DIAG_HUB},
  33:{diagram:DIAG_PIPE},
  37:{diagram:DIAG_HUB},
  16:{diagram:DIAG_CHAIN},
},
mcp:{
  3:{code:`// Poor: the model can only retry blindly
{"error": "Error"}

// Good: structured error the model can act on
{ "is_error": true,
  "error": {
    "type": "timeout",
    "errorCategory": "transient",
    "isRetryable": true,
    "attempted_query": "invoices WHERE date='3 de mayo'",
    "suggestion": "Use ISO 8601 dates: 2026-05-03. Narrow the range."
}}`},
  5:{code:`// Legitimate empty result — a valid conclusion:
{"type": "tool_result", "tool_use_id": "toolu_01...",
 "content": "[]"}                     // "no matching records exist"

// Backend failure — NOT a conclusion:
{"type": "tool_result", "tool_use_id": "toolu_01...",
 "is_error": true,                    // ← the distinguishing flag
 "content": "search backend unreachable (timeout after 5s)"}`},
  8:{code:`// Force one specific tool on every request:
{ "model": "claude-sonnet-4-5",
  "tool_choice": {"type": "tool", "name": "extract_invoice"},
  "tools": [{"name": "extract_invoice", "input_schema": {...}}],
  "messages": [...] }`},
  9:{code:`"tool_choice": {"type": "auto"}  // may answer in plain text
"tool_choice": {"type": "any"}   // MUST call some tool (model picks)
"tool_choice": {"type": "tool",  // MUST call this exact tool
                "name": "extract_invoice"}
"tool_choice": {"type": "none"}  // tools disabled this turn`},
  11:{code:`// .mcp.json — committed to the repo, secrets stay in the env
{ "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "\${GITHUB_TOKEN}" }   // ← expanded locally
}}}`},
},
code:{
  12:{code:`# CI pipeline (GitHub Actions step)
claude -p "Review the diff for security issues" \\
  --output-format json \\
  --allowedTools "Read,Grep,Glob"
# -p / --print = headless: run, print, exit. No interactive session.`},
  13:{code:`# Structured findings the pipeline can parse and post as PR comments
claude -p "Review this PR" --output-format json
# → {"result": [
#      {"file": "api/auth.ts", "line": 42, "severity": "high",
#       "comment": "JWT secret read from query string"},
#      ...]}`},
},
prompt:{
  6:{code:`// Structure guaranteed by construction: schema-backed tool + forced choice
{ "tools": [{
    "name": "record_extraction",
    "input_schema": {
      "type": "object",
      "properties": {
        "invoice_number": {"type": "string"},
        "total": {"type": "number"},
        "tax_id": {"type": ["string", "null"]}   // nullable = honesty valve
      },
      "required": ["invoice_number", "total"]
    }}],
  "tool_choice": {"type": "tool", "name": "record_extraction"} }`},
  16:{code:`// Prefill: start the assistant's turn yourself
"messages": [
  {"role": "user", "content": "Extract the invoice as JSON."},
  {"role": "assistant", "content": "{"}     // ← model continues from here
]
// output continues: "invoice_number": "F-2041", ...  (no preamble possible)`},
  13:{code:`// Each batch request carries YOUR correlation id
POST /v1/messages/batches
{ "requests": [
    {"custom_id": "doc-00417",           // ← your key for this document
     "params": {"model": "claude-sonnet-4-5", "max_tokens": 1024,
                "messages": [...]}},
    {"custom_id": "doc-00418", "params": {...}}
]}
// results arrive in ANY order → match them back by custom_id,
// resubmit only the custom_ids that errored`},
},
context:{
  4:{code:`// WRONG — dynamic content first invalidates the cache every request:
"system": "Today is 2026-07-30 09:14:03. You are a support agent..."

// RIGHT — stable prefix, breakpoint, then dynamic content:
"system": [
  {"type": "text", "text": "<8k-token policy manual + instructions>",
   "cache_control": {"type": "ephemeral"}},   // ← cached (reads ~10%)
  {"type": "text", "text": "Today is 2026-07-30."}
]`,diagram:DIAG_CACHE},
  7:{code:`POST /v1/messages/count_tokens        // free — no charge
{ "model": "claude-sonnet-4-5",
  "system": "...", "tools": [...],
  "messages": [{"role": "user", "content": "..."}] }

// → {"input_tokens": 84213}   // decide: send, compact, or trim`},
  8:{code:`HTTP/1.1 429 Too Many Requests
retry-after: 23
{ "type": "error",
  "error": {"type": "rate_limit_error",
            "message": "This request would exceed your rate limit"}}

// handler: wait max(retry-after, backoff * 2^attempt) + jitter, retry
// 429 = YOUR limit · 529 (overloaded_error) = service-side, also retryable`},
},
};

const byId={};(window.STUDY_DATA||[]).forEach(m=>byId[m.id]=m);
Object.entries(E).forEach(([mid,items])=>{
  const m=byId[mid];if(!m)return;
  Object.entries(items).forEach(([idx,ext])=>{
    const q=m.questions[+idx];if(!q)return;
    if(ext.code)q.code=ext.code;
    if(ext.diagram)q.diagram=ext.diagram;
  });
});
})();
