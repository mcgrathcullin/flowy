let transformX = 0;
let transformY = 0;
let scale = 1;
let startX = 0;
let startY = 0;
let isPanning = false;

export function initPanZoom(svg) {
    svg.addEventListener('touchstart', handleTouchStart);
    svg.addEventListener('touchmove', handleTouchMove);
    svg.addEventListener('touchend', handleTouchEnd);
    svg.addEventListener('touchcancel', handleTouchEnd);
}

function handleTouchStart(event) {
    if (event.touches.length === 2) {
        startX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        startY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        isPanning = true;
        event.preventDefault();
        console.log('Touch start');
    }
}

function handleTouchMove(event) {
    if (isPanning && event.touches.length === 2) {
        const currentX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const currentY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        transformX += deltaX;
        transformY += deltaY;
        applyTransform(event.target);
        startX = currentX;
        startY = currentY;
        event.preventDefault();
        console.log('Touch move');
    }
}

function handleTouchEnd(event) {
    isPanning = false;
    console.log('Touch end');
}

function applyTransform(svg) {
    svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
}
