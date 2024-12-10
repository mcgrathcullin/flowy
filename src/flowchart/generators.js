import { NodeShapes } from './shapes.js';

// Create a Mermaid node definition
export function createNode(type, id, text) {
    const shapeFunction = NodeShapes[type];
    if (!shapeFunction) return null;
    return `${shapeFunction(id, text)};`;
}

// Create a connection between nodes
export function createConnection(fromId, toId, label = '') {
    if (label) {
        return `${fromId} -->|${label}| ${toId};`;
    }
    return `${fromId} --> ${toId};`;
}

// Create a note (not used directly anymore, kept for reference)
export function createNote(nodeId, text) {
    return `note right of ${nodeId} "${text}";`;
} 