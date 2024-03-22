let transformX = 0;
let transformY = 0;
let scale = 1;

export function initPanZoom(svg) {
    const hammer = new Hammer(svg);
    hammer.get('pinch').set({ enable: true });
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    hammer.on('panstart', (event) => {
        svg.style.cursor = 'grabbing';
    });

    hammer.on('panmove', (event) => {
        transformX += event.deltaX;
        transformY += event.deltaY;
        applyTransform(svg);
    });

    hammer.on('panend', (event) => {
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
