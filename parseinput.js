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
        if (lastLabel) {
            mermaidCode += `${decisionNodeId} -->|${lastLabel}| ${optionNodeId}("${text}")\n`;
            lastLabel = '';
        } else {
            mermaidCode += `${decisionNodeId} --> ${optionNodeId}("${text}")\n`;
        }
        optionNodes[option] = optionNodeId;
        currentOption = option;
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
                mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}")\n`;
                lastNodeId = currentNodeId;
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
                if (inDecisionTree) {
                    lastLabel = text;
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
