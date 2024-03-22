export function parseInput(input) {
    let mermaidCode = 'graph TD;\n';
    const steps = input.split('\n');
    let nodeId = 1;
    let lastNodeId = '';
    let decisionNodeId = '';
    let lastLabel = '';
    const optionNodes = {};
    let inDecisionTree = false;
    let currentOption = '';

    const processOption = (option, text) => {
        const optionNodeId = `N${nodeId}`;
        optionNodes[option] = optionNodeId;
        currentOption = option;
        nodeId++;
        if (lastLabel) {
            mermaidCode += `${decisionNodeId} -->|${lastLabel}| ${optionNodeId}("${text}")\n`;
            lastLabel = '';
        } else {
            mermaidCode += `${decisionNodeId} --> ${optionNodeId}("${text}")\n`;
        }
        lastNodeId = optionNodeId;
    };

    for (const line of steps) {
        const [type, text] = line.split(':').map(s => s.trim());
        const currentNodeId = `N${nodeId}`;

        switch (type.toLowerCase()) {
            case 'start':
                mermaidCode += `${currentNodeId}[${text}]\n`;
                lastNodeId = currentNodeId;
                nodeId++;
                break;
            case 'block':
                if (inDecisionTree && currentOption) {
                    const optionNodeId = optionNodes[currentOption];
                    mermaidCode += `${optionNodeId} --> ${currentNodeId}("${text}")\n`;
                    lastNodeId = currentNodeId;
                } else {
                    mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}")\n`;
                    lastNodeId = currentNodeId;
                }
                nodeId++;
                break;
            case 'tree':
                decisionNodeId = currentNodeId;
                mermaidCode += `${lastNodeId} --> ${currentNodeId}{${text}}\n`;
                lastNodeId = currentNodeId;
                inDecisionTree = true;
                currentOption = '';
                nodeId++;
                break;
            case 'label':
                lastLabel = text;
                if (inDecisionTree && currentOption) {
                    const optionNodeId = optionNodes[currentOption];
                    const labelNodeId = `N${nodeId}`;
                    mermaidCode += `${optionNodeId} -->|"${text}"| ${labelNodeId}\n`;
                    lastNodeId = labelNodeId;
                    nodeId++;
                }
                break;
            default:
                if (!isNaN(parseInt(type))) {
                    processOption(type, text);
                }
                break;
        }
    }

    return mermaidCode;
}
