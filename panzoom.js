let transformX = 0;
let transformY = 0;
let scale = 1;
let startX = 0;
let startY = 0;
let isPanning = false;

export function initPanZoom(svg) {
    svg.addEventListener('pointerdown', handlePointerDown);
    svg.addEventListener('pointermove', handlePointerMove);
    svg.addEventListener('pointerup', handlePointerUp);
    svg.addEventListener('pointercancel', handlePointerUp);

    // Test touch support
    svg.addEventListener('touchstart', function(event) {
        console.log('Touch event triggered');
    });
}

function handlePointerDown(event) {
    if (event.pointerType === 'touch' && event.isPrimary && event.pointerId === 1) {
        startX = event.clientX;
        startY = event.clientY;
        isPanning = true;
        event.target.setPointerCapture(event.pointerId);
        console.log('Pointer down');
    }
}

function handlePointerMove(event) {
    if (isPanning && event.pointerType === 'touch' && event.isPrimary) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        transformX += deltaX;
        transformY += deltaY;
        applyTransform(event.target);
        startX = event.clientX;
        startY = event.clientY;
        console.log('Pointer move');
    }
}

function handlePointerUp(event) {
    if (event.pointerType === 'touch' && event.isPrimary) {
        isPanning = false;
        event.target.releasePointerCapture(event.pointerId);
        console.log('Pointer up');
    }
}

function applyTransform(svg) {
    svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
}
