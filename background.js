// listens for the extension being clicked
// and opens "history.html" in a new tab

import { pipeline } from "@xenova/transformers";

const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
);

chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({
        url: chrome.runtime.getURL("history.html")
    });
});

chrome.runtime.onMessage.addListener(async function(message) {
    if (message.type !== "new_tweet") return;

    const output = await embedder(message.tweet.text, {
        pooling: "mean",
        normalize: true
    });

    const embedding = Array.from(output.data);

    const result = await chrome.storage.local.get("tweets");
    const tweets = result.tweets || [];

    const tweetIndex = tweets.findIndex(
        tweet => tweet.url === message.tweet.url
    );

    if (tweetIndex !== -1) {
        tweets[tweetIndex].embedding = embedding;

        await chrome.storage.local.set({ tweets });
    }
});