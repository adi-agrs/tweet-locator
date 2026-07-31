const seenTweetIds = new Set();

console.log("content script loaded");

function extractTweets(nodes) {
    nodes.forEach(function(node) {
        if (node.nodeType !== 1) return; // skip non-elements

        const tweets = node.querySelectorAll('[data-testid="tweet"]');

        tweets.forEach(function(tweet) {
            const textEl = tweet.querySelector('[data-testid="tweetText"]');
            const userEl = tweet.querySelector('[data-testid="User-Name"]');

            if (!textEl || !userEl) return; // skip if missing

            const text = textEl.innerText;
            const user = userEl.innerText;
            const url = window.location.href;
            const timestamp = Date.now();
            const id = user + text.slice(0, 20); // rough unique id

            if (seenTweetIds.has(id)) return; // skip duplicates
            seenTweetIds.add(id);

            const tweetData = { text, user, url, timestamp };

            // save to chrome storage
            chrome.storage.local.get("tweets", function(result) {
                const tweets = result.tweets || [];
                tweets.unshift(tweetData); // add to front
                chrome.storage.local.set({ tweets: tweets });
            });
        });
    });
}

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        extractTweets(Array.from(mutation.addedNodes));
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});