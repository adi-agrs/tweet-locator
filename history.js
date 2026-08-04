chrome.storage.local.get("tweets", function(result) {
    console.log("saved tweets:", result.tweets);
});

chrome.storage.local.get("tweets", function(result) {
    const tweets = result.tweets || [];
    const tweetList = document.getElementById("tweet-list");
    
    tweets.forEach(function(tweet) {
        const div = document.createElement("div");
        div.className = "tweet-card";
        div.innerHTML = `
            <p class="tweet-user">${tweet.user}</p>
            <p class="tweet-text">${tweet.text}</p>
            <a href="${tweet.url}" target="_blank">view tweet</a>
        `;
        tweetList.appendChild(div);
    });
});

document.getElementById("top-btn").addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});