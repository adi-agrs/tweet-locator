const trailColor = "#1DA1F2";
let lastX = 0;
let lastY = 0;

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
}, 300); // spawns a dot every 80ms regardless of movement
