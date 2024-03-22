let isPanning = false;
let lastX = 0;
let lastY = 0;
let transformX = 0;
let transformY = 0;
let scale = 1;
let lastTouchDistance = null;

export function handleTouchStart(e) {
    e.preventDefault();
    isPanning = true;

    if (e.touches.length === 2) {
        const [touch1, touch2] = e.touches;
        lastTouchDistance = Math.hypot(
            touch1.clientX - touch2.clientX,
            touch1.clientY - touch2.clientY
        );
    } else {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    }
}

export function handleTouchMove(e) {
    e.preventDefault();

    if (e.touches.length === 2) {
        const [touch1, touch2] = e.touches;
        const currentTouchDistance = Math.hypot(
            touch1.clientX - touch2.clientX,
            touch1.clientY - touch2.clientY
        );

        if (lastTouchDistance) {
            const newScale = scale * (currentTouchDistance / lastTouchDistance);
            scale = Math.max(0.5, Math.min(5, newScale));
        }

        lastTouchDistance = currentTouchDistance;
        applyTransform();
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

export function handleTouchEnd() {
    isPanning = false;
    lastTouchDistance = null;
}

export function handleMouseDown(e) {
    isPanning = true;
    lastX = e.clientX;
    lastY = e.clientY;
}

export function handleMouseMove(e) {
    if (isPanning && e.buttons === 1) {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        transformX += deltaX;
        transformY += deltaY;
        lastX = e.clientX;
        lastY = e.clientY;
        applyTransform();
    }
}

export function handleMouseUp() {
    isPanning = false;
}

export function handlePinchZoom(e) {
    if (e.ctrlKey || e.metaKey) {
        return;
    }

    e.preventDefault();

    const newScale = scale * (1 + Math.sign(e.deltaY) * -0.2);
    scale = Math.max(0.5, Math.min(5, newScale));
    applyTransform();
}

function applyTransform() {
    const svg = document.querySelector('.canvas-container svg');
    if (svg) {
        svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
    }
}
