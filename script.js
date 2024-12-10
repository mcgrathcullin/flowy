import { parseInput } from './src/flowchart/index.js';
import { enhanceTextInput } from './src/flowchart/ui/input-enhancer.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
            primaryColor: '#1a1e24',
            primaryTextColor: '#c9d1d9',
            primaryBorderColor: '#30363d',
            lineColor: '#30363d',
            secondaryColor: '#161b22',
            tertiaryColor: '#161b22'
        },
        flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 15
        },
        securityLevel: 'loose'
    });

    const textInput = document.getElementById('text-input');
    const flowchartOutput = document.getElementById('flowchart-output');
    const addSampleBtn = document.getElementById('add-sample-btn');
    const centerLogsBtn = document.getElementById('center-logs-btn');
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeBtn = document.querySelector('.close');
    
    const canvasContainer = document.createElement('div');
    canvasContainer.classList.add('canvas-container');
    flowchartOutput.appendChild(canvasContainer);

    let isPanning = false;
    let startX, startY;
    let transformX = 0, transformY = 0, scale = 1;
    let isVertical = true;
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const directionToggle = document.getElementById('direction-toggle');
    const saveFlowchartBtn = document.getElementById('save-flowchart');
    
    function renderFlowchart(input) {
        try {
            const mermaidDefinition = parseInput(input, isVertical);
            console.log('Generated Mermaid code:', mermaidDefinition);
            
            // Store current transform state
            const currentSvg = canvasContainer.querySelector('svg');
            const currentTransform = currentSvg ? currentSvg.style.transform : '';
            
            // Clear previous content
            canvasContainer.innerHTML = '';
            
            // Create a new container for this render
            const container = document.createElement('div');
            container.className = 'mermaid';
            container.textContent = mermaidDefinition;
            canvasContainer.appendChild(container);
            
            // Render the new diagram
            mermaid.render('graphDiv', mermaidDefinition).then(({svg, bindFunctions}) => {
                canvasContainer.innerHTML = svg;
                
                // Add event listeners to the new SVG
                const svgElement = canvasContainer.querySelector('svg');
                if (svgElement) {
                    svgElement.style.width = '100%';
                    svgElement.style.height = '100%';
                    
                    // Restore previous transform if it exists
                    if (currentTransform) {
                        svgElement.style.transform = currentTransform;
                    }
                    
                    svgElement.addEventListener('mousedown', handleMouseDown);
                    svgElement.addEventListener('mousemove', handleMouseMove);
                    svgElement.addEventListener('mouseup', handleMouseUp);
                    svgElement.addEventListener('mouseleave', handleMouseUp);
                    svgElement.addEventListener('wheel', handleWheel);
                }
                
                if (bindFunctions) bindFunctions(svgElement);
            }).catch(err => {
                console.error('Error rendering:', err);
                canvasContainer.innerHTML = `<div class="error">Error rendering flowchart: ${err.message}</div>`;
            });
        } catch (error) {
            console.error('Error parsing input:', error);
            canvasContainer.innerHTML = `<div class="error">Error parsing input: ${error.message}</div>`;
        }
    }

    function handleMouseDown(event) {
        isPanning = true;
        startX = event.clientX - transformX;
        startY = event.clientY - transformY;
        event.preventDefault();
    }

    function handleMouseMove(event) {
        if (!isPanning) return;
        transformX = event.clientX - startX;
        transformY = event.clientY - startY;
        applyTransform();
        event.preventDefault();
    }

    function handleMouseUp(event) {
        isPanning = false;
        event.preventDefault();
    }

    function handleWheel(event) {
        const delta = -event.deltaY;
        const scaleChange = delta > 0 ? 1.1 : 0.9;
        
        // Get mouse position relative to the container
        const rect = canvasContainer.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Calculate new scale
        const newScale = scale * scaleChange;
        if (newScale < 0.1 || newScale > 10) return;
        
        // Calculate new transform to zoom toward mouse position
        transformX = mouseX - (mouseX - transformX) * scaleChange;
        transformY = mouseY - (mouseY - transformY) * scaleChange;
        scale = newScale;
        
        applyTransform();
        event.preventDefault();
    }

    function applyTransform() {
        const svg = canvasContainer.querySelector('svg');
        if (svg) {
            svg.style.transform = `translate(${transformX}px, ${transformY}px) scale(${scale})`;
        }
    }

    function centerFlowchart() {
        transformX = 0;
        transformY = 0;
        scale = 1;
        applyTransform();
    }

    // Debounce the input to prevent too frequent updates
    let debounceTimeout;
    textInput.addEventListener('input', function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const input = textInput.value;
            if (input.trim()) {
                renderFlowchart(input);
            }
        }, 300);
    });

    // Initialize the enhancer
    const enhancer = enhanceTextInput(textInput);

    // Add sample button handler
    addSampleBtn.addEventListener('click', () => {
        const sampleText = [
            "Start: Begin Process",
            "Block: Receive Package",
            ">Note: Check for damage",
            ">Block: Scan Barcode",
            "Tree: Quality Check",
            ">Label: Pass",
            ">>1: Move to Storage",
            ">Label: Minor Issues",
            ">>2: Repair Item",
            ">Label: Major Issues",
            ">>3: Return to Sender",
            "Block: Update System"
        ].join('\n');

        textInput.value = sampleText;
        enhancer.updateStyles(); // Explicitly update styles
        renderFlowchart(sampleText);
    });

    centerLogsBtn.addEventListener('click', centerFlowchart);

    helpBtn.addEventListener('click', () => {
        helpModal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        helpModal.classList.remove('show');
    });

    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.classList.remove('show');
        }
    });

    // Prevent scrolling of background when modal is open
    helpModal.addEventListener('wheel', (e) => {
        e.stopPropagation();
    });

    // Settings modal controls
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('show');
    });

    // Close button for settings modal
    settingsModal.querySelector('.close').addEventListener('click', () => {
        settingsModal.classList.remove('show');
    });

    // Direction toggle
    directionToggle.addEventListener('click', () => {
        isVertical = !isVertical;
        directionToggle.innerHTML = isVertical ? '↕️ Vertical' : '↔️ Horizontal';
        directionToggle.classList.toggle('active');
        const input = textInput.value;
        if (input.trim()) {
            renderFlowchart(input);
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove('show');
        }
    });

    // Prevent scrolling of background when modal is open
    settingsModal.addEventListener('wheel', (e) => {
        e.stopPropagation();
    });
});