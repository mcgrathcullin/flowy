let isPanning = false;
let startX = 0;
let startY = 0;
let transformX = 0;
let transformY = 0;
let scale = 1;

export function handleTouchStart(e) {
    if (e.touches.length === 2) {
        isPanning = true;
        startX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - transformX;
        startY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - transformY;
    }
}

export function handleTouchMove(e) {
    if (!isPanning || e.touches.length !== 2) return;
    const currentX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    transformX = currentX - startX;
    transformY = currentY - startY;
    applyTransform();
}

export function handleTouchEnd() {
    isPanning = false;
}

export function handlePinchZoom(e) {
    if (e.touches.length !== 2) return;
    e.preventDefault();
    const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
    );
    const newScale = scale * (distance / e.scale);
    scale = Math.max(0.5, Math.min(5, newScale));
    applyTransform();
}

function applyTransform() {
    const svg = document.querySelector('.canvas-container svg');
    if (svg) {
        svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
    }
}
