// import { pipeline, env } from "./static/transformers.min.js";

// // tell transformers.js to fetch models from hugging face CDN
// // instead of looking for them locally
// env.allowLocalModels = false;
// env.useBrowserCache = true;

// // lazy embedder loading 
// let embedder = null;

// async function getEmbedder() {
//     if (!embedder) {
//         embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
//     }
//     return embedder;
// }

// async function ensureEmbeddings() {
//     const embedder = await getEmbedder();
//     const tweetsMissingEmbeddings = allTweets.filter(t => !t.embedding);
//     if (tweetsMissingEmbeddings.length === 0) return;
//     console.log(`generating embeddings for ${tweetsMissingEmbeddings.length} tweets...`);
//     for (const tweet of tweetsMissingEmbeddings) {
//         const output = await embedder(tweet.text, {
//             pooling: "mean",
//             normalize: true
//         });
//         tweet.embedding = Array.from(output.data);
//     }
//     await chrome.storage.local.set({ tweets: allTweets });
//     console.log("embeddings done");
// }

// cosineSimilarity compares two vectors and returns a value between -1 and 1
// (kept for reference, used in the companion website instead)
// function cosineSimilarity(a, b) {
//     let dot = 0;
//     let magA = 0;
//     let magB = 0;
//     for (let i = 0; i < a.length; i++) {
//         dot += a[i] * b[i];
//         magA += a[i] * a[i];
//         magB += b[i] * b[i];
//     }
//     return dot / (Math.sqrt(magA) * Math.sqrt(magB));
// }

let allTweets = []; // store all tweets globally so search can filter them

function renderTweets(tweets) {
    const tweetList = document.getElementById("tweet-list");
    tweetList.innerHTML = ""; // clear current list

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

// load tweets on page open
chrome.storage.local.get("tweets", function(result) {
    allTweets = result.tweets || [];
    console.log("saved tweets:", allTweets);
    renderTweets(allTweets);
});

// search button click
document.getElementById("search-btn").addEventListener("click", async function() {
    const mode = document.getElementById("search-mode").value;
    const query = document.getElementById("search-bar").value.trim().toLowerCase();

    if (!query) {
        renderTweets(allTweets); // empty search shows everything
        return;
    }

    if (mode === "direct") {
        const filtered = allTweets.filter(function(tweet) {
            return tweet.text.toLowerCase().includes(query) ||
                   tweet.user.toLowerCase().includes(query);
        });
        renderTweets(filtered);
    }

    if (mode === "semantic") {
        // semantic search moved to companion website
        // direct user there instead
        document.getElementById("tweet-list").innerHTML = 
            "<p style='text-align:center; color:#999;'>semantic search is available at the RecallX website — export your history and upload it there.</p>";
    }
});

// also search on Enter key
document.getElementById("search-bar").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        document.getElementById("search-btn").click();
    }
});

document.getElementById("top-btn").addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// download button click 
document.getElementById("download-btn").addEventListener("click", function() {
    chrome.storage.local.get("tweets", function(result) {
        const tweets = result.tweets || [];
        const jsonString = JSON.stringify(tweets, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const blob_url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blob_url;
        link.download = "tweet_history.json";
        link.click();
        URL.revokeObjectURL(blob_url);
    });
});