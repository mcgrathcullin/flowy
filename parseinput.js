export function parseInput(input) {
    let mermaidCode = 'graph TD;\n';
    const steps = input.split('\n');
    let nodeId = 1;
    let lastNodeId = '';
    let decisionNodeId = '';
    let lastLabel = '';
    let lastNote = ''; // New variable to store the last note
    const optionNodes = {};
    let inDecisionTree = false;
    let currentOption = '';

    const processOption = (option, text) => {
        const optionNodeId = `N${nodeId}`;
        optionNodes[option] = optionNodeId;
        currentOption = option;
        nodeId++;
        if (lastLabel) {
            console.log(`Adding label "${lastLabel}" between decision node ${decisionNodeId} and option node ${optionNodeId}`);
            mermaidCode += `${decisionNodeId} -->|${lastLabel}| ${optionNodeId}("${text}"):::${lastNote}\n`; // Append the note
            lastLabel = '';
            lastNote = ''; // Reset the note
        } else {
            console.log(`Connecting decision node ${decisionNodeId} to option node ${optionNodeId}`);
            mermaidCode += `${decisionNodeId} --> ${optionNodeId}("${text}"):::${lastNote}\n`; // Append the note
            lastNote = ''; // Reset the note
        }
        lastNodeId = optionNodeId;
    };

    for (const line of steps) {
        const [type, text] = line.split(':').map(s => s.trim());
        const currentNodeId = `N${nodeId}`;

        console.log(`Processing line: ${line}`);
        console.log(`Current lastLabel: ${lastLabel}`);
        console.log(`Current lastNote: ${lastNote}`);

        switch (type.toLowerCase()) {
            case 'start':
                console.log(`Adding start node ${currentNodeId} with text "${text}"`);
                mermaidCode += `${currentNodeId}[${text}]:::${lastNote}\n`; // Append the note
                lastNodeId = currentNodeId;
                lastNote = ''; // Reset the note
                nodeId++;
                break;
            case 'block':
                lastLabel = ''; // Reset lastLabel here
                lastNote = ''; // Reset lastNote here
                if (inDecisionTree && currentOption) {
                    const optionNodeId = optionNodes[currentOption];
                    console.log(`Connecting option node ${optionNodeId} to block node ${currentNodeId}`);
                    mermaidCode += `${optionNodeId} --> ${currentNodeId}("${text}"):::${lastNote}\n`; // Append the note
                    lastNodeId = currentNodeId;
                    nodeId++;
                } else {
                    if (lastNote) {
                        console.log(`Adding note "${lastNote}" to node ${currentNodeId}`);
                        mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}"):::${lastNote}\n`; // Append the note
                        lastNote = ''; // Reset the note
                    } else {
                        console.log(`Connecting nodes ${lastNodeId} and ${currentNodeId}`);
                        mermaidCode += `${lastNodeId} --> ${currentNodeId}("${text}")\n`;
                    }
                    lastNodeId = currentNodeId;
                    nodeId++;
                }
                break;
            case 'tree':
                decisionNodeId = currentNodeId;
                console.log(`Adding decision node ${decisionNodeId} with text "${text}"`);
                mermaidCode += `${lastNodeId} --> ${currentNodeId}{${text}}:::${lastNote}\n`; // Append the note
                lastNodeId = currentNodeId;
                inDecisionTree = true;
                currentOption = '';
                lastLabel = ''; // Reset lastLabel here
                lastNote = ''; // Reset lastNote here
                nodeId++;
                break;
            case 'label':
                console.log(`Setting last label to "${text}"`);
                lastLabel = text;
                break;
            case 'note':
                console.log(`Setting last note to "${text}"`);
                lastNote = text; // Store the note
                break;
            default:
                if (!isNaN(parseInt(type))) {
                    console.log(`Processing option ${type} with text "${text}"`);
                    processOption(type, text);
                }
                break;
        }

        console.log(`Updated lastLabel: ${lastLabel}`);
        console.log(`Updated lastNote: ${lastNote}`);
    }

    return mermaidCode;
}
