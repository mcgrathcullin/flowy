let isPanning = false;
let lastX = 0;
let lastY = 0;
let transformX = 0;
let transformY = 0;
let scale = 1;
let lastTouches = null; // Track the last touch points

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

export function handleTouchStart(e) {
    if (e.touches.length === 2) {
        lastTouches = e.touches;
    } else {
        isPanning = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    }
}

export function handleTouchMove(e) {
    if (e.touches.length === 2) {
        const currentTouches = e.touches;
        const lastTouchesDistance = Math.hypot(
            lastTouches[0].clientX - lastTouches[1].clientX,
            lastTouches[0].clientY - lastTouches[1].clientY
        );
        const currentTouchesDistance = Math.hypot(
            currentTouches[0].clientX - currentTouches[1].clientX,
            currentTouches[0].clientY - currentTouches[1].clientY
        );
        const newScale = scale * (currentTouchesDistance / lastTouchesDistance);
        scale = Math.max(0.5, Math.min(5, newScale));
        applyTransform();
        lastTouches = currentTouches;
    } else if (isPanning) {
        const deltaX = e.touches[0].clientX - lastX;
        const deltaY = e.touches[0].clientY - lastY;
        transformX += deltaX;
        transformY += deltaY;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
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
    lastTouches = null;
}

function applyTransform() {
    const svg = document.querySelector('.canvas-container svg');
    if (svg) {
        svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
    }
}
