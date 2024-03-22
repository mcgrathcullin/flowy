const parseInput = require('./parseinput.js');

document.addEventListener('DOMContentLoaded', function() {
    mermaid.initialize({ startOnLoad: false });
    mermaid.init();
    const textInput = document.getElementById('text-input');
    const flowchartOutput = document.getElementById('flowchart-output');
    const addSampleBtn = document.getElementById('add-sample-btn');
    const centerLogsBtn = document.getElementById('center-logs-btn');
    const canvasContainer = document.createElement('div');
    canvasContainer.classList.add('canvas-container');
    flowchartOutput.appendChild(canvasContainer);

    let isPanning = false;
    let startX, startY;
    let transformX = 0, transformY = 0, scale = 1;

    function renderFlowchart(input) {
        const steps = input.split('\n');
        const mermaidDefinition = parseInput(input);
        mermaid.render('theGraph', mermaidDefinition, function (svgCode, bindFunctions) {
            canvasContainer.innerHTML = svgCode;
            const svg = canvasContainer.querySelector('svg');
            if (svg) {
                const nodes = svg.querySelectorAll('.node');
                nodes.forEach((node, index) => {
                    const noteText = steps[index + 1]?.trim();
                    if (noteText && noteText.toLowerCase() === 'note:') {
                        const note = steps[index + 2]?.trim();
                        if (note) {
                            const tooltip = document.createElement('div');
                            tooltip.classList.add('tooltip');
                            tooltip.textContent = note;
                            node.appendChild(tooltip);
                            node.addEventListener('mouseenter', () => {
                                tooltip.style.display = 'block';
                            });
                            node.addEventListener('mouseleave', () => {
                                tooltip.style.display = 'none';
                            });
                        }
                    }
                });
                svg.addEventListener('mousedown', handleMouseDown);
                svg.addEventListener('mousemove', handleMouseMove);
                svg.addEventListener('mouseup', handleMouseUp);
                svg.addEventListener('mouseleave', handleMouseUp);
                svg.addEventListener('wheel', handleWheel);
                bindFunctions(svg);
            }
        });
    }

    function handleMouseDown(event) {
        isPanning = true;
        startX = event.clientX;
        startY = event.clientY;
    }

    function handleMouseMove(event) {
        if (!isPanning) return;
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        transformX += deltaX;
        transformY += deltaY;
        applyTransform();
        startX = event.clientX;
        startY = event.clientY;
    }

    function handleMouseUp() {
        isPanning = false;
    }

    function handleWheel(event) {
        const delta = event.deltaY < 0 ? 1.1 : 0.9;
        scale *= delta;
        applyTransform();
        event.preventDefault();
    }

    function applyTransform() {
        canvasContainer.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
    }

    function centerFlowchart() {
        const containerRect = flowchartOutput.getBoundingClientRect();
        const canvasRect = canvasContainer.getBoundingClientRect();
        const scrollLeft = (canvasRect.width - containerRect.width) / 2;
        const scrollTop = (canvasRect.height - containerRect.height) / 2;
        flowchartOutput.scrollLeft = scrollLeft;
        flowchartOutput.scrollTop = scrollTop;
    }

    textInput.addEventListener('input', () => renderFlowchart(textInput.value));

    addSampleBtn.addEventListener('click', () => {
        const sampleText = "Start: PO Issued\n" +
            "Block: System sends instructions and labels to vendor\n" +
            "Block: Boxes and pallets are labeled\n" +
            "Block: Boxes and pallets are counted. Pictures are taken.\n" +
            "Block: Power on and check status\n" +
            "Note: Test\n" +
            "Tree: Status\n" +
            "Label: Real bad\n" +
            "1: Scrap for parts\n" +
            "Label: Bad\n" +
            "2: Clean device\n" +
            "Label: Good\n" +
            "3: Hardware test and wipe\n" +
            "Block: Graded";
        textInput.value = sampleText;
        renderFlowchart(sampleText);
        centerFlowchart();
    });

    centerLogsBtn.addEventListener('click', centerFlowchart);
});
