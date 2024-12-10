import { NodeType } from './types.js';

// Parse a single line into a structured object
export function parseLine(line) {
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