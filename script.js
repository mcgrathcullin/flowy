import { handleMouseDown, handleMouseMove, handlePinchZoom, handleMouseUp } from './panzoom.js';
import { parseInput } from './parseinput.js';

document.addEventListener('DOMContentLoaded', function() {
    mermaid.initialize({ startOnLoad: false });
    mermaid.init(); // Add this line to initialize Mermaid

    const textInput = document.getElementById('text-input');
    const flowchartOutput = document.getElementById('flowchart-output');
    const addSampleBtn = document.getElementById('add-sample-btn');
    const centerLogsBtn = document.getElementById('center-logs-btn');
    const canvasContainer = document.createElement('div');
    canvasContainer.classList.add('canvas-container');
    flowchartOutput.appendChild(canvasContainer);

    function renderFlowchart(input) {
        const mermaidDefinition = parseInput(input);
        mermaid.render('theGraph', mermaidDefinition, function (svgCode, bindFunctions) {
            canvasContainer.innerHTML = svgCode;
            const svg = canvasContainer.querySelector('svg');
            if (svg) {
                svg.addEventListener('mousedown', handleMouseDown);
                svg.addEventListener('mousemove', handleMouseMove);
                svg.addEventListener('mouseup', handleMouseUp);
                svg.addEventListener('mouseleave', handleMouseUp);
                svg.addEventListener('wheel', handlePinchZoom
                bindFunctions(svg);
            }
        });
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
