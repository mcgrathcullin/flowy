import { parseInput } from './parseinput.js';
console.log('parseinput.js is loading');

document.addEventListener('DOMContentLoaded', function() {
    mermaid.initialize({
        startOnLoad: false,
        flowchart: {
            htmlLabels: false,
            curve: 'linear',
            useMaxWidth: true,
            // Add this callback function to customize the rendering
            onNodeRender: function(id, element, node) {
                if (node.type === 'arrow_point') {
                    const label = element.querySelector('.edgeLabel');
                    if (label && label.textContent.trim() === '') {
                        label.style.display = 'none';
                    }
                }
            }
        }
    });

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
        console.log('Inside renderFlowchart function', input);
        let mermaidDefinition = parseInput(input);
        console.log('Mermaid definition after parseInput:', mermaidDefinition);

        // Process "Note" type separately
        const noteRegex = /(\w+):\s*Note:\s*(.+)/;
        for (let i = 0; i < steps.length; i++) {
            const match = steps[i].match(noteRegex);
            if (match) {
                const [, nodeId, noteText] = match;
                mermaidDefinition += `Note over N${nodeId}: ${noteText}\n`;
                steps.splice(i, 1);
                i--;
            }
        }
        console.log('Mermaid definition after processing "Note" type:', mermaidDefinition);

        mermaid.render('theGraph', mermaidDefinition, function (svgCode, bindFunctions) {
            console.log('Mermaid definition passed to mermaid.render:', mermaidDefinition);
            canvasContainer.innerHTML = svgCode;
            const svg = canvasContainer.querySelector('svg');
            if (svg) {
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
        console.log('Add sample button clicked');
        const sampleText = "Start: PO Issued\n" +
            "Block: System sends instructions and labels to vendor\n" +
            "Note: Test\n" +
            "Block: Boxes and pallets are labeled\n" +
            "Block: Boxes and pallets are counted. Pictures are taken.\n" +
            "Block: Power on and check status\n" +
            "Tree: Status\n" +
            "Label: Real bad\n" +
            "1: Scrap for parts\n" +
            "Label: Bad\n" +
            "2: Clean device\n" +
            "Label: Good\n" +
            "3: Hardware test and wipe\n" +
            "Block: Graded";
        textInput.value = sampleText;
        console.log('Sample text set:', textInput.value);
        console.log('Rendering flowchart with sample text');
        renderFlowchart(sampleText);
        console.log('Flowchart rendered');
        centerFlowchart();
    });

    centerLogsBtn.addEventListener('click', centerFlowchart);
});