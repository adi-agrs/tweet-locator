import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js";

env.allowLocalModels = false;
env.useBrowserCache = true;

let embedder = null;
let allTweets = [];

async function getEmbedder() {
    if (!embedder) {
        setStatus("loading AI model (first time only, ~20MB)...");
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        setStatus("model loaded.");
    }
    return embedder;
}

function setStatus(msg) {
    document.getElementById("status").textContent = msg;
}

function renderTweets(tweets) {
    const tweetList = document.getElementById("tweet-list");
    tweetList.innerHTML = "";

    if (tweets.length === 0) {
        tweetList.innerHTML = "<p style='text-align:center; color:#999;'>no tweets found</p>";
        return;
    }

    tweets.forEach(function(tweet) {
        const div = document.createElement("div");
        div.className = "tweet-card";
        div.innerHTML = `
            <p class="tweet-user">${tweet.user}</p>
            <p class="tweet-text">${tweet.text}</p>
            <a href="https://twitter.com${tweet.url}" target="_blank">view tweet</a>
        `;
        tweetList.appendChild(div);
    });
}

function cosineSimilarity(a, b) {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// file upload
document.getElementById("upload-area").addEventListener("click", function() {
    document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        allTweets = JSON.parse(event.target.result);
        setStatus(`loaded ${allTweets.length} tweets. ready to search.`);

        // show the search bar 
        // hide the upload section
        document.getElementById("upload-section").classList.add("hidden");
        document.getElementById("search-section").classList.remove("hidden");

        renderTweets(allTweets);
    };
    reader.readAsText(file);
});

// search
document.getElementById("search-btn").addEventListener("click", async function() {
    const query = document.getElementById("search-bar").value.trim();
    if (!query) { renderTweets(allTweets); return; }
    if (allTweets.length === 0) { setStatus("upload your history file first."); return; }

    const embedder = await getEmbedder();

    // generate embeddings for tweets missing them
    const missing = allTweets.filter(t => !t.embedding);
    if (missing.length > 0) {
        setStatus(`generating embeddings for ${missing.length} tweets...`);
        for (const tweet of missing) {
            const output = await embedder(tweet.text, { pooling: "mean", normalize: true });
            tweet.embedding = Array.from(output.data);
        }
    }

    setStatus("searching...");
    const queryOutput = await embedder(query, { pooling: "mean", normalize: true });
    const queryEmbedding = Array.from(queryOutput.data);

    const results = allTweets
        .filter(t => t.embedding)
        .map(tweet => ({ tweet, similarity: cosineSimilarity(queryEmbedding, tweet.embedding) }))
        .sort((a, b) => b.similarity - a.similarity)
        .filter(item => item.similarity >= 0.1)
        .map(item => item.tweet);

    setStatus(`found ${results.length} results.`);
    renderTweets(results);
});

document.getElementById("search-bar").addEventListener("keydown", function(e) {
    if (e.key === "Enter") document.getElementById("search-btn").click();
});