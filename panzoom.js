let isPanning = false;
let lastX = 0;
let lastY = 0;
let transformX = 0;
let transformY = 0;
let scale = 1;

export function handleMouseDown(e) {
    isPanning = true;
    lastX = e.clientX;
    lastY = e.clientY;
}

export function handleMouseMove(e) {
    if (isPanning && e.buttons === 1) { // Check if the left mouse button is pressed
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        transformX += deltaX;
        transformY += deltaY;
        lastX = e.clientX;
        lastY = e.clientY;
        applyTransform();
    }
}

export function handlePinchZoom(e) {
    if (e.ctrlKey || e.metaKey) {
        return; // Ignore pinch-to-zoom if the Ctrl or Command key is pressed
    }

    e.preventDefault();

    const newScale = scale * (1 + Math.sign(e.deltaY) * -0.2);
    scale = Math.max(0.5, Math.min(5, newScale));
    applyTransform();
}

export function handleMouseUp() {
    isPanning = false;
}

function applyTransform() {
    const svg = document.querySelector('.canvas-container svg');
    if (svg) {
        svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
    }
}