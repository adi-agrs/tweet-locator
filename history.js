const trailColor = "#1DA1F2";
let lastX = 0;
let lastY = 0;

chrome.storage.local.get("tweets", function(result) {
    console.log(result.tweets);
});

document.addEventListener('mousemove', function(e){
    lastX = e.clientX;
    lastY = e.clientY;
    const trail = document.createElement('div');
    trail.className = 'trail';

    const color = trailColor;
    const spread = 10;
    const offsetX = (Math.random() -0.5) * spread;
    const offsetY = (Math.random() -0.5) * spread;

    trail.style.left = (e.clientX + offsetX) + 'px';
    trail.style.top = (e.clientY + offsetY) + 'px';

    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 300)

});

// spawn dots at cursor even when not moving
setInterval(function() {
    const trail = document.createElement('div');
    trail.className = 'trail';

    const spread = 20;
    const offsetX = (Math.random() - 0.5) * spread;
    const offsetY = (Math.random() - 0.5) * spread;

    trail.style.left = (lastX + offsetX) + 'px';
    trail.style.top = (lastY + offsetY) + 'px';

    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 300);
}, 300); // spawns a dot every 300ms regardless of movement

chrome.storage.local.get("tweets", function(result) {
    console.log("saved tweets:", result.tweets);
});

chrome.storage.local.get("tweets", function(result) {
    const tweets = result.tweets || [];
    const tweetList = document.getElementById("tweet-list");
    
    tweetList.innerHTML = ""; // clear the placeholder "hiiiii" text
    
    tweets.forEach(function(tweet) {
        const div = document.createElement("div");
        div.className = "tweet-card";
        div.innerHTML = `
            <p class="tweet-user">${tweet.user}</p>
            <p class="tweet-text">${tweet.text}</p>
            <a href="${tweet.url}" target="_blank">→ view tweet</a>
        `;
        tweetList.appendChild(div);
    });
});