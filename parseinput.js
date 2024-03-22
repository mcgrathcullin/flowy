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
        const optionLabel = lastLabel || text;
        mermaidCode += `${decisionNodeId} -->|${optionLabel}| ${optionNodeId}("${text}")\n`;
        optionNodes[option] = optionNodeId;
        currentOption = option;
        lastLabel = '';
        nodeId++;
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
                    if (lastLabel) {
                        mermaidCode += `${optionNodes[currentOption]} -->|"${lastLabel}"|${currentNodeId}("${text}")\n`;
                        lastLabel = '';
                    } else {
                        mermaidCode += `${optionNodes[currentOption]} --> ${currentNodeId}("${text}")\n`;
                    }
                    lastNodeId = currentNodeId;
                } else {
                    if (lastLabel) {
                        mermaidCode += `${lastNodeId} -->|"${lastLabel}"|${currentNodeId}("${text}")\n`;
                        lastLabel = '';
                    } else {
                        mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}")\n`;
                    }
                    lastNodeId = currentNodeId;
                }
                inDecisionTree = false;
                nodeId++;
                break;
            case 'tree':
                decisionNodeId = currentNodeId;
                const label1 = lastLabel ? `"${lastLabel}"` : '';
                const label2 = `"${text}"`;
                mermaidCode += `${lastNodeId} --> ${currentNodeId}\n${currentNodeId}(${label1 ? `[${label1},${label2}]` : `[${label2}]`})\n`;
                lastNodeId = currentNodeId;
                lastLabel = '';
                inDecisionTree = true;
                currentOption = '';
                nodeId++;
                break;
            case 'label':
                lastLabel = text;
                break;
            default:
                if (!isNaN(parseInt(type))) {
                    processOption(type, text);
                } else {
                    if (inDecisionTree && currentOption) {
                        lastLabel = type; // Treat the line as a label for the current option
                    }
                }
                break;
        }
    }
    return mermaidCode;
}
