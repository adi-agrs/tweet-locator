import { pipeline } from "@xenova/transformers";

const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
);

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

// cosineSimilarity compares two vectors and returns a value between -1 and 1

function cosineSimilarity(a, b) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

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
        // get the embedding for the query
        const output = await embedder(query, {
            pooling: "mean",
            normalize: true
        });

        const queryEmbedding = Array.from(output.data);
        const filtered = allTweets
        .map(tweet => ({
            tweet,
            similarity: cosineSimilarity(queryEmbedding, tweet.embedding)
        }))

        // descending order of similarity score
        .sort((a,b) => b.similarity - a.similarity);
        
        // filter out tweets with less than a 0.4 similarity score
        const threshold = 0.4;
        const finalFiltered = filtered.filter(item => item.similarity >= threshold).map(item => item.tweet);
        renderTweets(finalFiltered);
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