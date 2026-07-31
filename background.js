// listens for the extension being clicked
// and opens "history.html" in a new tab

chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({
        url: chrome.runtime.getURL("history.html")
    });
});

// DONE