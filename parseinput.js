export function parseInput(input) {
    let mermaidCode = 'graph TD;\n';
    const steps = input.split('\n');
    let nodeId = 1;
    let lastNodeId = '';
    let decisionNodeId = '';
    let lastLabel = '';
    let lastNote = '';
    const optionNodes = {};
    let inDecisionTree = false;
    let currentOption = '';

    const processOption = (option, text, note) => {
        const optionNodeId = `N${nodeId}`;
        optionNodes[option] = optionNodeId;
        currentOption = option;
        nodeId++;
        if (lastLabel) {
            console.log(`Adding label "${lastLabel}" between decision node ${decisionNodeId} and option node ${optionNodeId}`);
            mermaidCode += `${decisionNodeId} -->|${lastLabel}| ${optionNodeId}("${text}")${note ? `:::${note}` : ''}\n`;
            lastLabel = '';
        } else {
            console.log(`Connecting decision node ${decisionNodeId} to option node ${optionNodeId}`);
            mermaidCode += `${decisionNodeId} --> ${optionNodeId}("${text}")${note ? `:::${note}` : ''}\n`;
        }
        lastNodeId = optionNodeId;
    };

    for (const line of steps) {
        const [type, text] = line.split(':').map(s => s.trim());
        const currentNodeId = `N${nodeId}`;
        let note = '';

        console.log(`Processing line: ${line}`);
        console.log(`Current lastLabel: ${lastLabel}`);
        console.log(`Current lastNote: ${lastNote}`);

        switch (type.toLowerCase()) {
            case 'start':
                console.log(`Adding start node ${currentNodeId} with text "${text}"`);
                mermaidCode += `${currentNodeId}[${text}]${lastNote ? `:::note ${lastNote}` : ''}\n`;
                lastNodeId = currentNodeId;
                lastNote = '';
                nodeId++;
                break;
            case 'block':
                lastLabel = '';
                if (inDecisionTree && currentOption) {
                    const optionNodeId = optionNodes[currentOption];
                    console.log(`Connecting option node ${optionNodeId} to block node ${currentNodeId}`);
                    mermaidCode += `${optionNodeId} --> ${currentNodeId}("${text}")${lastNote ? `:::note ${lastNote}` : ''}\n`;
                    lastNodeId = currentNodeId;
                    lastNote = '';
                    nodeId++;
                } else {
                    if (lastNote) {
                        note = `:::note ${lastNote}`;
                        lastNote = '';
                    }
                    console.log(`Connecting nodes ${lastNodeId} and ${currentNodeId}`);
                    mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}")${note}\n`;
                    lastNodeId = currentNodeId;
                    nodeId++;
                }
                break;
            case 'tree':
                decisionNodeId = currentNodeId;
                console.log(`Adding decision node ${decisionNodeId} with text "${text}"`);
                mermaidCode += `${lastNodeId} --> ${currentNodeId}{${text}}${lastNote ? `:::note ${lastNote}` : ''}\n`;
                lastNodeId = currentNodeId;
                inDecisionTree = true;
                currentOption = '';
                lastLabel = '';
                lastNote = '';
                nodeId++;
                break;
            case 'label':
                console.log(`Setting last label to "${text}"`);
                lastLabel = text;
                break;
            case 'note':
                console.log(`Setting last note to "${text}"`);
                lastNote = text;
                break;
            default:
                if (!isNaN(parseInt(type))) {
                    console.log(`Processing option ${type} with text "${text}"`);
                    processOption(type, text, lastNote);
                    lastNote = '';
                }
                break;
        }

        console.log(`Updated lastLabel: ${lastLabel}`);
        console.log(`Updated lastNote: ${lastNote}`);
    }

    return mermaidCode;
}
