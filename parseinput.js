export function parseInput(input) {
    console.log('parseInput called with:', input);
    let mermaidCode = 'graph TD;\n';
    const steps = input.split('\n');
    let nodeId = 1;
    let lastNodeId = '';
    let decisionNodeId = '';
    let lastLabel = '';
    const optionNodes = {};
    let inDecisionTree = false;
    let currentOption = '';

    for (const line of steps) {
        const [type, text] = line.split(':').map(s => s.trim());
        const currentNodeId = `N${nodeId}`;

        console.log('Processing line:', line);
        console.log('Type:', type);
        console.log('Text:', text);
        console.log('Current node ID:', currentNodeId);
        console.log('Last node ID:', lastNodeId);
        console.log('Last label:', lastLabel);

        switch (type.toLowerCase()) {
            case 'start':
                console.log(`Adding start node ${currentNodeId} with text "${text}"`);
                mermaidCode += `${currentNodeId}[${text}]\n`;
                lastNodeId = currentNodeId;
                nodeId++;
                break;
            case 'block':
                console.log(`Connecting nodes ${lastNodeId} and ${currentNodeId}`);
                if (lastLabel) {
                    console.log(`Adding label "${lastLabel}" between nodes ${lastNodeId} and ${currentNodeId}`);
                    mermaidCode += `${lastNodeId} -->|${lastLabel}| ${currentNodeId}("${text}")\n`;
                    lastLabel = '';
                } else {
                    mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}")\n`;
                }
                lastNodeId = currentNodeId;
                nodeId++;
                break;
            case 'tree':
                decisionNodeId = currentNodeId;
                console.log(`Adding decision node ${decisionNodeId} with text "${text}"`);
                mermaidCode += `${lastNodeId} --> ${currentNodeId}{${text}}\n`;
                lastNodeId = currentNodeId;
                inDecisionTree = true;
                currentOption = '';
                lastLabel = '';
                nodeId++;
                break;
            case 'label':
                console.log(`Setting last label to "${text}"`);
                lastLabel = text || '';
                break;
            default:
                if (!isNaN(parseInt(type))) {
                    const optionNodeId = `N${nodeId}`;
                    optionNodes[type] = optionNodeId;
                    currentOption = type;
                    console.log(`Processing option ${type} with text "${text}"`);
                    if (lastLabel) {
                        console.log(`Adding label "${lastLabel}" between decision node ${decisionNodeId} and option node ${optionNodeId}`);
                        mermaidCode += `${decisionNodeId} -->|${lastLabel}| ${optionNodeId}("${text}")\n`;
                        lastLabel = '';
                    } else {
                        console.log(`Connecting decision node ${decisionNodeId} to option node ${optionNodeId}`);
                        mermaidCode += `${decisionNodeId} --> ${optionNodeId}("${text}")\n`;
                    }
                    lastNodeId = optionNodeId;
                    nodeId++;
                }
                break;
        }

        console.log('Mermaid code so far:', mermaidCode);
        console.log('------------------------------------');
    }

    console.log('Final Mermaid code:', mermaidCode);
    return mermaidCode;
}