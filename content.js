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

            // select every link with "/status/" in the href
            const links = tweet.querySelectorAll('a[href*="/status/"]');
            let url = null; // fallback to null if no status link found

            // loop through all links in a tweet 
            for (const link of links){
                const href = link.getAttribute('href');
                if (/^\/\w+\/status\/\d+$/.test(href)) { // [start]/username/status/digits[end] 
                    url = href; // store just the path, no domain prefix
                    break; // when we find the first match we break the loop 
                }
            }

            // if we couldn't find a proper tweet URL, skip this tweet
            if (!url) return;

            // the id is the url of the tweet because the url is inherently unique 
            const id = url;

            if (seenTweetIds.has(id)) return; 

            seenTweetIds.add(id);
            const timestamp = Date.now();
            const tweetData = { text, user, url, timestamp };

            // save to chrome storage
            chrome.storage.local.get("tweets", function(result) {
                const tweets = result.tweets || [];
                tweets.unshift(tweetData); // add to front


                const timeLimit = Date.now() - (60 * 60 * 60 * 24 * 1000);
                const filteredTweets = tweets.filter(function(tweet){
                    return tweet.timestamp > timeLimit;
                });

                // cap at last 10000 tweets

                const cappedTweets = filteredTweets.slice(0, 10000);
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