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
        mermaidCode += `${decisionNodeId}(("${text}")) --> ${optionNodeId}{${lastLabel}}\n`;
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
                    mermaidCode += `${optionNodes[currentOption]} --> ${currentNodeId}("${text}")\n`;
                    lastNodeId = currentNodeId;
                } else {
                    const labelText = lastLabel ? `|${lastLabel}|` : '';
                    mermaidCode += `${lastNodeId} -->${labelText} ${currentNodeId}("${text}")\n`;
                    lastNodeId = currentNodeId;
                    lastLabel = '';
                }
                inDecisionTree = false;
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
