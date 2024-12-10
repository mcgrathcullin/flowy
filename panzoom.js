let transformX = 0;
let transformY = 0;
let scale = 1;
let startX = 0;
let startY = 0;
let isPanning = false;
let containerBounds = null;

export function initPanZoom(container) {
    containerBounds = container.getBoundingClientRect();
    
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel);
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);
    
    window.addEventListener('resize', () => {
        containerBounds = container.getBoundingClientRect();
    });
}

function handleMouseDown(event) {
    if (event.target.closest('#flowchart-output')) {
        isPanning = true;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
        event.target.closest('#flowchart-output').style.cursor = 'grabbing';
    }
}

function handleMouseMove(event) {
    if (!isPanning) return;
    
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    
    const newTransformX = transformX + deltaX;
    const newTransformY = transformY + deltaY;
    
    if (isWithinBounds(newTransformX, newTransformY)) {
        transformX = newTransformX;
        transformY = newTransformY;
        
        startX = event.clientX;
        startY = event.clientY;
        
        const container = document.querySelector('#flowchart-output');
        applyTransform(container);
    }
}

function handleMouseUp(event) {
    if (isPanning) {
        isPanning = false;
        const container = document.querySelector('#flowchart-output');
        container.style.cursor = 'grab';
    }
}

function handleWheel(event) {
    event.preventDefault();
    
    const delta = event.deltaY;
    const scaleChange = delta > 0 ? 0.9 : 1.1;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const newScale = scale * scaleChange;
    
    if (newScale > 0.1 && newScale < 5) {
        transformX = mouseX - (mouseX - transformX) * scaleChange;
        transformY = mouseY - (mouseY - transformY) * scaleChange;
        scale = newScale;
        
        applyTransform(event.currentTarget);
    }
}

function isWithinBounds(newX, newY) {
    if (!containerBounds) return true;
    
    const padding = 100;
    const maxX = containerBounds.width / 2;
    const maxY = containerBounds.height / 2;
    
    return Math.abs(newX) < maxX + padding && 
           Math.abs(newY) < maxY + padding;
}

function applyTransform(container) {
    if (!container) return;
    const svg = container.querySelector('svg');
    if (svg) {
        svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
    }
}

function handleTouchStart(event) {
    if (event.touches.length === 2) {
        startX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        startY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        isPanning = true;
        event.preventDefault();
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
        
        applyTransform(event.currentTarget);
        
        startX = currentX;
        startY = currentY;
        event.preventDefault();
    }
}

function handleTouchEnd() {
    isPanning = false;
}
