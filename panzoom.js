let transformX = 0;
let transformY = 0;
let scale = 1;
let lastPosX = 0;
let lastPosY = 0;
let isPanning = false;

export function initPanZoom(svg) {
    svg.addEventListener('touchstart', handleTouchStart);
    svg.addEventListener('touchmove', handleTouchMove);
    svg.addEventListener('touchend', handleTouchEnd);
}

function handleTouchStart(event) {
    if (event.touches.length === 2) {
        isPanning = true;
        lastPosX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        lastPosY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        event.preventDefault();
    }
}

function handleTouchMove(event) {
    if (isPanning && event.touches.length === 2) {
        const currentPosX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const currentPosY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        const deltaX = currentPosX - lastPosX;
        const deltaY = currentPosY - lastPosY;
        lastPosX = currentPosX;
        lastPosY = currentPosY;
        transformX += deltaX;
        transformY += deltaY;
        applyTransform(event.target);
        event.preventDefault();
    }
}

function handleTouchEnd(event) {
    isPanning = false;
}

function applyTransform(svg) {
    svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
}
