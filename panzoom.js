let isPanning = false;
let startX = 0;
let startY = 0;
let transformX = 0;
let transformY = 0;
let scale = 1;

export function handleMouseDown(e) {
    if (e.button === 0) { // Check if the left mouse button is pressed
        isPanning = true;
        startX = e.clientX - transformX;
        startY = e.clientY - transformY;
    }
}

export function handleMouseMove(e) {
    if (!isPanning) return;
    transformX = e.clientX - startX;
    transformY = e.clientY - startY;
    applyTransform();
}

export function handleMouseUp() {
    isPanning = false;
}

export function handlePinchZoom(e) {
    if (e.ctrlKey || e.metaKey) {
        return; // Ignore pinch-to-zoom if the Ctrl or Command key is pressed
    }
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = scale * Math.pow(1.1, delta);
    scale = Math.max(0.5, Math.min(5, newScale));
    applyTransform();
}

function applyTransform() {
    const svg = document.querySelector('.canvas-container svg');
    if (svg) {
        svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
    }
}
