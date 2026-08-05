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
document.getElementById("search-btn").addEventListener("click", function() {
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
        // semantic search coming soon
        alert("semantic search coming soon!");
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