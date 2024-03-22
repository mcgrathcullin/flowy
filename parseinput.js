export function parseInput(input) {
    console.log('parseInput called with:', input);
    let mermaidCode = 'graph TD;\n';
    const steps = input.split('\n');
    let nodeId = 1;
    let lastNodeId = '';
    let decisionNodeId = '';
    let lastLabel = null;
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
                if (inDecisionTree && currentOption) {
                    const optionNodeId = optionNodes[currentOption];
                    console.log(`Connecting option node ${optionNodeId} to block node ${currentNodeId}`);
                    if (lastLabel !== null) {
                        mermaidCode += `${optionNodeId} -->|${lastLabel}| ${currentNodeId}("${text}")\n`;
                        lastLabel = null;
                    } else {
                        mermaidCode += `${optionNodeId} --> ${currentNodeId}("${text}")\n`;
                    }
                    lastNodeId = currentNodeId;
                    nodeId++;
                } else {
                    console.log(`Connecting nodes ${lastNodeId} and ${currentNodeId}`);
                    if (lastLabel !== null) {
                        mermaidCode += `${lastNodeId} -->|${lastLabel}| ${currentNodeId}("${text}")\n`;
                        lastLabel = null;
                    } else {
                        mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}")\n`;
                    }
                    lastNodeId = currentNodeId;
                    nodeId++;
                }
                break;
            case 'tree':
                decisionNodeId = currentNodeId;
                console.log(`Adding decision node ${decisionNodeId} with text "${text}"`);
                if (lastLabel !== null) {
                    mermaidCode += `${lastNodeId} -->|${lastLabel}| ${currentNodeId}{${text}}\n`;
                    lastLabel = null;
                } else {
                    mermaidCode += `${lastNodeId} --> ${currentNodeId}{${text}}\n`;
                }
                lastNodeId = currentNodeId;
                inDecisionTree = true;
                currentOption = '';
                nodeId++;
                break;
                    }
                }

                return mermaidCode;
            }