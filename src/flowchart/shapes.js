import { NodeType } from './types.js';

// Mermaid node shape definitions
export const NodeShapes = {
    [NodeType.START]: (id, text) => `${id}[${text}]`,
    [NodeType.BLOCK]: (id, text) => `${id}(${text})`,
    [NodeType.TREE]: (id, text) => `${id}{${text}}`,
    [NodeType.BRANCH]: (id, text) => `${id}["${text}"]`
}; 