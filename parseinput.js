function parseInput(input) {
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

        switch (type.toLowerCase()) {
            case 'start':
                console.log(`Adding start node ${currentNodeId} with text "${text}"`);
                mermaidCode += `${currentNodeId}[${text}]\n`;
                lastNodeId = currentNodeId;
                nodeId++;
                break;
            case 'block':
                lastLabel = '';
                if (inDecisionTree && currentOption) {
                    const optionNodeId = optionNodes[currentOption];
                    console.log(`Connecting option node ${optionNodeId} to block node ${currentNodeId}`);
                    mermaidCode += `${optionNodeId} --> ${currentNodeId}("${text}")\n`;
                    lastNodeId = currentNodeId;
                    nodeId++;
                } else {
                    console.log(`Connecting nodes ${lastNodeId} and ${currentNodeId}`);
                    mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}")\n`;
                    lastNodeId = currentNodeId;
                    nodeId++;
                }
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
    }

    return mermaidCode;
}

module.exports = { parseInput };
