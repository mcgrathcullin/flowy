let transformX = 0;
let transformY = 0;
let scale = 1;
let lastPosX = 0;
let lastPosY = 0;
let isPanning = false;

export function initPanZoom(svg) {
    const hammer = new Hammer(svg);
    hammer.get('pinch').set({ enable: true });
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, pointers: 2 });

    hammer.on('panstart', (event) => {
        isPanning = true;
        lastPosX = event.center.x;
        lastPosY = event.center.y;
        svg.style.cursor = 'grabbing';
    });

    hammer.on('panmove', (event) => {
        if (!isPanning) return;
        const deltaX = event.center.x - lastPosX;
        const deltaY = event.center.y - lastPosY;
        lastPosX = event.center.x;
        lastPosY = event.center.y;
        transformX += deltaX;
        transformY += deltaY;
        applyTransform(svg);
    });

    hammer.on('panend', (event) => {
        isPanning = false;
        svg.style.cursor = 'grab';
    });

    hammer.on('pinchstart', (event) => {
        svg.style.cursor = 'grab';
    });

    hammer.on('pinchmove', (event) => {
        scale *= event.scale;
        applyTransform(svg);
    });

    hammer.on('pinchend', (event) => {
        svg.style.cursor = 'grab';
    });
}

function applyTransform(svg) {
    svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
}
