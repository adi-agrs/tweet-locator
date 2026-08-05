// listens for the extension being clicked
// and opens "history.html" in a new tab

chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({
        url: chrome.runtime.getURL("history.html")
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "new_tweet") {
        // generate embedding for message.tweet
    }
});