# CareBridge

A static, responsive CarePredict-inspired website and fictional post-hospital recovery demonstration. Open `index.html` or the retained `carebridge.html` entrypoint. No package installation or build is needed.

For a local HTTP preview, run `python3 -m http.server 8000` from this folder, then visit `http://localhost:8000`.

## Project layout

- `components/`: separate homepage, overview, discharge plan, daily checklist, monitoring, coordination, and clinical-review components. Each was implemented by a separate subagent.
- `styles/`: shared dashboard primitives, site branding, and one stylesheet per feature.
- `scripts/`: shared sample data, icons, navigation, theme, and initialization.
- `assets/`: local homepage photograph.

Both HTML entrypoints load the same components. Classic scripts allow direct local opening without a development server. View hashes support direct links, browser history, and keyboard tab navigation.

## Demonstration

1. Open Discharge plan. Use Eleanor’s fictional summary or upload a fictional plain-text file (maximum 100 KB).
2. Generate a preview. Eleanor’s prepared plan is scripted; custom text is grouped locally by keywords. No live AI service is connected.
3. Complete tasks in Daily checklist. Completion persists in the tab’s session storage.
4. Switch the monitoring scenario and review the simulated signals.
5. Create, edit, copy, or download a nurse-review summary. Switch to Clinician to record a simulated review.

Coordination includes local appointment confirmations, medication questions, and family-update previews. Nothing is sent to a provider or family member. Uploaded text and drafts are held in memory; theme/persona preferences use local storage. No backend, live wearable connection, or clinical service is configured.

## Verification

On macOS, run `python3 scripts/check.py`. It checks JavaScript syntax, local asset references, rendering functions, and the connected demo state with JavaScriptCore. It does not replace a visual browser test.

Design reference: [CarePredict](https://www.carepredict.com), using its warm orange, cream, charcoal, and Poppins direction with original CareBridge content and layout. Homepage photograph: [Unsplash](https://images.unsplash.com/photo-1584515933487-779824d29309), downloaded locally.
