<img width="1004" height="176" alt="recall_screenshot" src="https://github.com/user-attachments/assets/dc7021f0-cf91-4d2f-ae35-901b1be9123d" />

A Chrome extension that automatically tracks every tweet you scroll past on Twitter/X and lets you find them again later — because Twitter doesn't have a viewing history.

> Built to solve a real problem: you see a great tweet, keep scrolling, and it's gone forever.

<img width="1919" height="919" alt="extension_screenshot" src="https://github.com/user-attachments/assets/f7e2205a-ab17-49e9-8f81-fa0fe218d509" />

---

## What it does

- **Automatically saves tweets** as you scroll through Twitter/X — no manual saving required
- **In-extension search** — quick keyword/phrase matching against your saved tweets, right from the history tab

<img width="1919" height="930" alt="tweets_screenshot" src="https://github.com/user-attachments/assets/d84728a9-2d4e-4b2f-a025-a3f5441eaf5e" />

- **AI-powered semantic search** — export your history and search it by *meaning* on the companion website, even if you don't remember the exact wording (powered by local embeddings, no API key needed)

<img width="1919" height="938" alt="results_screenshot" src="https://github.com/user-attachments/assets/d08e777e-904a-4f1c-add8-9c25bbd9bbbe" />

- **60-day rolling history** — keeps your last 60 days or 10,000 tweets, whichever limit comes first
- **Fully private** — everything is stored locally in your browser via `chrome.storage.local`; nothing is sent to a server

---

## How it works

### Tweet capture (`content.js`)
A content script runs on Twitter/X and uses a `MutationObserver` to detect tweet elements as they're added to the DOM while you scroll. For each tweet it pulls the text, author, and permalink (used as a unique ID to avoid duplicates), then saves it to `chrome.storage.local`. Tweets older than 60 days are pruned automatically on every save, and history is capped at 10,000 entries.

### History tab (`history.html` / `history.js`)
Clicking the extension icon (`background.js`) opens a full-tab history page. It lists everything you've captured and supports fast local keyword search across tweet text and author. You can also export your entire history as a `tweet_history.json` file.

### AI semantic search (`docs/`)
Semantic search lives on a separate companion site (published from the `docs/` folder, e.g. via GitHub Pages). You upload the `tweet_history.json` you exported from the extension, and the site runs a local embedding model (Transformers.js, `Xenova/all-MiniLM-L6-v2`) entirely in your browser to rank tweets by conceptual similarity to your query — no API key, no server round-trip.

---

## Tech stack

- **Manifest V3** Chrome Extension
- **Vanilla JS** — content script, background service worker, history page, docs site
- **MutationObserver** — detects tweets loading dynamically as you scroll
- **chrome.storage.local** — local persistent storage, shared across extension contexts
- **Transformers.js** — runs an embedding model client-side for semantic search on the docs site
- **Rollup** — bundles `@huggingface/transformers` for the extension build
- **CSS** — custom dark UI

---

## Project structure

```
tweet-locator/
├── manifest.json              # Extension config — permissions, content scripts, background
├── background.js              # Service worker — opens history tab on icon click
├── content.js                 # Injected into Twitter/X — captures tweets as you scroll
├── history.html                # Full-tab history page
├── history.js                  # Renders saved tweets, handles keyword search & JSON export
├── package.json                 # Build config (rollup + @huggingface/transformers)
├── static/
│   ├── style.css                # Styles for the history page
│   ├── transformers.min.js      # Bundled Transformers.js
│   └── images/                  # Logo, icons, screenshots
└── docs/                        # Companion site for AI semantic search (e.g. GitHub Pages)
    ├── index.html                # Upload + search UI
    ├── search.js                 # Loads embedding model, computes similarity, ranks results
    └── static/                   # Site assets
```

---

## Setup (local development)

1. Clone the repo:
   ```bash
   git clone https://github.com/adi-agrs/tweet-locator
   ```
2. Open Chrome and go to `chrome://extensions`
3. Toggle **Developer mode** on (top right)
4. Click **Load unpacked** and select the `tweet-locator` folder
5. Go to Twitter/X and start scrolling — tweets are saved automatically
6. Click the extension icon to open your history and search it

To use AI semantic search, export your history (`.json` button) from the history page, then open the companion site and upload the file there.

---

## Known limitations

- Twitter occasionally changes their DOM structure, which can break tweet detection — selectors may need updating after major Twitter UI changes
- Only captures tweets you've personally scrolled past — it doesn't fetch historical tweets you haven't seen
- Semantic search requires a manual export/upload step rather than running inside the extension itself

---

## Roadmap

- [ ] Chrome Web Store release
