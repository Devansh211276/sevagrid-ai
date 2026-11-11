# SevaGrid AI — SevaSetu Rapid Crisis Intelligence Platform

**SevaGrid AI** (built for hackathon rapid crisis response) is the AI orchestration heart of **SevaSetu** — a real-time disaster response dashboard combining India-wide hotspot visualization, volunteer coordination, emergency supply logistics, voice-to-task extraction, and an intelligent command assistant.

---

## Architecture: Local-First, Minimum-Network AI

SevaGrid AI (`sevaai.js`) is designed for resilient operation even in bandwidth-constrained disaster zones:

```text
SevaGrid AI Orchestrator (window.SevaAI)
│
├── 1. SevaGridBrain (100% Local — Zero Network Latency)
│     ├── Multi-hazard crisis classifier (flood, fire, medical, earthquake, cyclone, tsunami, landslide)
│     ├── Severity estimator & structured task generator
│     ├── Resource matcher (crisis need → nearest available inventory)
│     └── Weighted zone risk scorer (0–100)
│
└── 2. GeminiMicro (Network Escalation — Only When Needed)
      ├── Model: gemini-2.0-flash-lite
      ├── Prompt compression & structured JSON mode
      ├── Deterministic hash response cache
      └── Automatic local fallback & interactive Demo Mode
```

- **~95% Local Execution**: Standard triage, classification, resource matching, and risk scoring run entirely in-browser with zero API cost.
- **Privacy-Safe Key Handling**: Optional Google Gemini API keys are kept strictly in browser `sessionStorage` and never persisted to disk.

---

## Features

- **Live Crisis Map & Alert Feed**: Interactive India hotspot view with severity filters (`critical`, `high`, `medium`).
- **Voice-to-Task Engine**: Converts field voice/text situation reports into prioritized, categorized rescue/medical/logistics action items.
- **SevaGrid AI Command Center**: Context-aware disaster coordinator chat fed with live alert and inventory summaries.
- **Resource Optimizer & Risk Predictor**: Automated supply transfer suggestions and per-zone risk assessments.
- **Volunteer Leaderboard & Activity Ledger**: Live responder status and verifiable task completion timeline.

---

## Quick Start

Zero build step or backend required:

1. Clone the repository and open `index.html` in any modern browser (or serve with a static server):
   ```bash
   python -m http.server 8000
   ```
2. Visit `http://localhost:8000`.
3. Optionally enter a Google AI Studio (Gemini) API key in the onboarding modal for hybrid LLM chat, or click **Continue in Demo Mode** to run fully offline via `SevaGridBrain`.

---

## Files

- `index.html` — Command center dashboard layout, hotspot map, tabs, and API key modal
- `sevaai.js` — `SevaGridBrain` local intelligence engine, `GeminiMicro` client, and `SevaGridAI` orchestrator
- `app.js` — Live telemetry simulation, dashboard rendering, Voice-to-Task & AI tab bindings
- `style.css` — Dark glassmorphism UI and responsive layout styles

---

## License
MIT License — see [LICENSE](LICENSE).
