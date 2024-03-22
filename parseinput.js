export function parseInput(input) {
    let mermaidCode = 'graph TD;\n';
    const steps = input.split('\n');
    let nodeId = 1;
    let lastNodeId = '';
    let decisionNodeId = '';
    let inDecisionTree = false;
    let currentOption = '';
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
                    mermaidCode += `${decisionNodeId} --"${text}"--> ${lastNodeId}\n`;
                }
                break;
            default:
                if (!isNaN(parseInt(type))) {
                    const optionNodeId = `N${nodeId}`;
                    mermaidCode += `${decisionNodeId} ---> ${optionNodeId}("${text}")\n`;
                    lastNodeId = optionNodeId;
                    nodeId++;
                }
                break;
        }
    }
    return mermaidCode;
}
