# DECISIONS.md

## 1. Agent Thoughts

**Decision:** Coordinator thoughts render at the top of the run before any tasks appear. Task-level thoughts render inline within their task card.

**Why:** The analyst needs a mental model of what the system is doing before tasks appear — surfacing the coordinator's plan upfront builds trust early. Task-level thoughts are contextually tied to a specific card, so inline placement keeps them meaningful rather than noise. Neither is hidden — suppressing them makes the system feel like a black box.

**What would change this:** If user research showed analysts found thoughts distracting, I'd move them behind a collapsible "Show reasoning" toggle. If the primary user were a developer, I'd surface all thoughts with full timestamps.

---

## 2. Parallel Task Layout

**Decision:** Tasks sharing a `parallel_group` render inside a bordered container with a CSS grid (3 columns desktop, 1 column mobile), labelled "N tasks ran in parallel" with a parallel-lines icon.

**Why:** A vertical list of three tasks with no grouping implies sequential execution — factually wrong and misleading. The side-by-side grid makes parallelism immediately legible without a graph. The blue group border creates a clear visual boundary from sequential tasks above and below.

**What would change this:** If mobile usage were significant, the single-column collapse loses the parallel metaphor entirely. I'd explore horizontal scroll or a compact timeline view for smaller viewports.

---

## 3. Partial Outputs

**Decision:** Intermediate outputs (`is_final: false`) render inline with a "streaming..." label and blue left border. When the final output arrives, intermediates are replaced — the border turns green.

**Why:** Intermediates contain real signal an analyst cares about mid-run. Discarding them makes tasks feel opaque until completion. The streaming label and blue border clearly signal incompleteness, preventing the analyst from anchoring on partial data. Replacing intermediates on finalisation keeps the card clean.

**What would change this:** If partials were very high frequency or low quality (token-by-token), inline rendering creates visual noise. I'd collapse them to an animated indicator and surface only the final output.

---

## 4. Cancelled — `reason: "sufficient_data"`

**Decision:** Cancelled tasks show a grey dot, reduced card opacity, and a neutral pill: "◎ sufficient data — skipped early". No red or warning styling anywhere.

**Why:** This is a deliberate coordinator decision, not a failure. Red or amber would alarm the analyst unnecessarily. Grey communicates "did not complete" without implying error. The plain-English label tells a non-technical analyst the system was being efficient. The hollow ◎ is visually distinct from filled green (complete) and red (failed) dots.

**What would change this:** If analysts in testing consistently read grey as failure, I'd shift to a positive framing — "✓ enough data collected" — and use a muted green instead.

---

## 5. Task Dependency Display

**Decision:** Each task card shows a small muted label listing its `depends_on` IDs (e.g. "after t_001, t_002, t_003"). No graph is drawn. Cancelled dependencies don't appear on the synthesis card because the coordinator correctly excluded t_004 from `depends_on` before spawning it.

**Why:** A dependency graph for 5 tasks adds visual complexity without proportional value for an analyst reading results. The text label is enough to communicate sequencing. Since the coordinator resolved the cancellation before spawning synthesis, the UI has no incomplete dependency to show — the completed synthesis implicitly resolves it.

**What would change this:** At 20+ tasks with deep dependency chains, a collapsible DAG becomes necessary. If analysts asked "why didn't synthesis wait for Meta?", I'd surface a clearer coordinator decision note on the synthesis card.