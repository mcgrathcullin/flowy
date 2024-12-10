// Types of nodes in our flowchart
const NodeType = {
    START: 'start',
    BLOCK: 'block',
    TREE: 'tree',
    NOTE: 'note',
    LABEL: 'label',
    BRANCH: 'branch'
};

// Mermaid node shape definitions
const NodeShapes = {
    [NodeType.START]: (id, text) => `${id}["${text}"]:::start`,
    [NodeType.BLOCK]: (id, text) => `${id}["${text}"]:::process`,
    [NodeType.TREE]: (id, text) => `${id}{"${text}"}:::diamond`,
    [NodeType.BRANCH]: (id, text) => `${id}["${text}"]:::process`
};

// Parse a single line into a structured object
function parseLine(line) {
    if (!line.trim()) return null;

    if (line.startsWith('Note:')) {
        return {
            type: NodeType.NOTE,
            text: line.substring(5).trim()
        };
    }

    if (line.startsWith('Label:')) {
        return {
            type: NodeType.LABEL,
            text: line.substring(6).trim()
        };
    }

    if (line.match(/^\d+:/)) {
        return {
            type: NodeType.BRANCH,
            text: line.substring(line.indexOf(':') + 1).trim()
        };
    }

    const [type, ...textParts] = line.split(':');
    const text = textParts.join(':').trim();
    
    return {
        type: type.trim().toLowerCase(),
        text
    };
}

// Create a Mermaid node definition
function createNode(type, id, text) {
    const shapeFunction = NodeShapes[type];
    if (!shapeFunction) return null;
    return `${shapeFunction(id, text)};`;
}

// Create a connection between nodes
function createConnection(fromId, toId, label = '') {
    if (label) {
        return `${fromId} -->|${label}| ${toId};`;
    }
    return `${fromId} --> ${toId};`;
}

// Create a note
function createNote(nodeId, text) {
    return `note right of ${nodeId} "${text}";`;
}

// Main parsing function
export function parseInput(input, isVertical = true) {
    const lines = input.split('\n').filter(line => line.trim());
    let nodeId = 1;
    let lastNodeId = null;
    let decisionNodeId = null;
    let currentLabel = '';
    
    // Collections for different parts of the flowchart
    const elements = {
        nodes: [],
        connections: [],
        notes: []
    };

    // Process each line
    for (const line of lines) {
        const currentNodeId = `node${nodeId}`;
        const parsedLine = parseLine(line);
        
        if (!parsedLine) continue;

        switch (parsedLine.type) {
            case NodeType.NOTE:
                if (lastNodeId) {
                    elements.notes.push(createNote(lastNodeId, parsedLine.text));
                }
                break;

            case NodeType.LABEL:
                currentLabel = parsedLine.text;
                break;

            case NodeType.BRANCH:
                const node = createNode(NodeType.BRANCH, currentNodeId, parsedLine.text);
                if (node) {
                    elements.nodes.push(node);
                    if (decisionNodeId && currentLabel) {
                        elements.connections.push(createConnection(decisionNodeId, currentNodeId, currentLabel));
                    }
                    lastNodeId = currentNodeId;
                    nodeId++;
                }
                break;

            case NodeType.START:
            case NodeType.BLOCK:
            case NodeType.TREE:
                const newNode = createNode(parsedLine.type, currentNodeId, parsedLine.text);
                if (newNode) {
                    elements.nodes.push(newNode);
                    if (lastNodeId && !decisionNodeId) {
                        elements.connections.push(createConnection(lastNodeId, currentNodeId));
                    }
                    if (parsedLine.type === NodeType.TREE) {
                        decisionNodeId = currentNodeId;
                    } else {
                        decisionNodeId = null;
                    }
                    lastNodeId = currentNodeId;
                    nodeId++;
                }
                break;
        }
    }

    // Generate the final Mermaid code
    return [
        `graph ${isVertical ? 'TD' : 'LR'};`,
        ...elements.nodes.map(node => `    ${node}`),
        ...elements.connections.map(conn => `    ${conn}`),
        ...elements.notes.map(note => `    ${note}`)
    ].join('\n') + '\n';
}