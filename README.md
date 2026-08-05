# RecallX AI

A Chrome extension that automatically tracks every tweet you scroll past on Twitter/X and lets you find them again using natural language search — because Twitter doesn't have a viewing history.

> Built to solve a real problem: you see a great tweet, keep scrolling, and it's gone forever.

---

## What it does

- **Automatically saves tweets** as you scroll through Twitter/X — no manual saving required
- **Direct search** — find tweets by exact phrase or keyword
- **Semantic search** — describe what you're looking for in plain English, even if you don't remember the exact wording (powered by local embeddings, no API key needed)
- **60-day rolling history** — keeps your last 60 days or 10,000 tweets, whichever comes first
- **Fully private** — everything is stored locally in your browser, no servers, no accounts, no data leaves your machine

---

## How it works

### Tweet capture
A content script runs silently on Twitter/X and uses a `MutationObserver` to detect tweets as they load into the DOM while you scroll. Each tweet's text, author, permalink URL, and timestamp get saved to `chrome.storage.local`.

### Search modes

**Direct search** — fast keyword and phrase matching against your saved tweet text. Good when you remember specific wording.

**Semantic search** — uses a local embedding model (Transformers.js) running entirely in your browser to understand the *meaning* of your query and find tweets that match conceptually, even if they share no words with your search. No API key, no internet connection needed, completely private.

### History management
Tweets older than 60 days are automatically pruned on each new save. History is also capped at 10,000 tweets. Both limits run passively in the background — no manual cleanup needed.

---

## Tech stack

- **Manifest V3** Chrome Extension
- **Vanilla JS** — content script, background service worker, history page
- **MutationObserver** — detects tweets loading dynamically as you scroll
- **chrome.storage.local** — local persistent storage, shared across extension contexts
- **Transformers.js** — runs embedding model locally in the browser for semantic search
- **CSS** — custom dark UI with animated cursor trail

---

## Project structure

```
tweet-locator/
├── manifest.json       # Extension config — permissions, content scripts, background
├── background.js       # Service worker — opens history tab on icon click
├── content.js          # Injected into Twitter/X — captures tweets as you scroll
├── history.html        # Full-tab history page
├── history.js          # Renders tweets, handles search
└── static/
    └── style.css       # Styles for history page
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
5. Go to Twitter/X and start scrolling — tweets are being saved automatically
6. Click the extension icon to open your history

---

## Known limitations

- Twitter occasionally changes their DOM structure which can break tweet detection — selectors may need updating after major Twitter UI changes
- Chrome service workers get suspended after inactivity, so embedding generation for semantic search may have a small delay on first use after idle
- Only captures tweets visible in your browser — does not fetch historical tweets you haven't personally scrolled past

---

## Roadmap

- [ ] Semantic search via local Transformers.js embeddings
- [ ] Direct keyword/phrase search
- [ ] Infinite scroll on history page
- [ ] Filter by date range
- [ ] Export history as JSON/CSV
- [ ] Chrome Web Store release
