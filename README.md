# JcurveIQ — Agent Run Panel

A real-time UI that shows a live AI agent run unfolding — tasks spawning, tools firing, partial outputs streaming, failures recovering, and a final research output emerging. Built with React + Tailwind CSS + Vite.

---

## Running Locally

npm install
npm run dev
→ http://localhost:5173

---

## Switching Fixtures

| Button | Fixture | What it covers |
|---|---|---|
| ▶ Run success fixture | run_success.json | Full happy path — sequential task, parallel group, retry, cancellation, synthesis, final output |
| ▶ Run error fixture | run_error.json | Run that terminates midway — some tasks complete, one fails permanently, one never starts |

Clicking either button during an active run resets immediately and replays the new fixture.

---

## How It Works

**State machine** — All run state lives in a single useReducer inside useEventStream.js. Task lifecycle transitions (running → failed → running → cancelled) are modelled as immutable state updates.

**Mock emitter** — Reads fixture JSON and schedules each event with setTimeout using accumulated delay values. Produces realistic timing without a backend.

**Render logic** — App.jsx walks taskOrder and builds a renderItems array. Tasks in a parallel_group are deduplicated into a single ParallelGroup slot.

---

## Known Gaps

- No replay speed control (0.5× / 2×)
- Task cards are not collapsible
- Parallel grid collapses to single column on mobile
- Event timestamps not surfaced in UI
- No accessibility pass