import { NodeType } from './types.js';
import { createNode, createConnection, createNote } from './generators.js';
import { parseLine } from './parser.js';

// Debug function to print Mermaid code with line numbers
function debugMermaidCode(code) {
    const lines = code.split('\n');
    console.log('Generated Mermaid code (with line numbers):');
    lines.forEach((line, index) => {
        if (line.trim()) {
            console.log(`${(index + 1).toString().padStart(2, '0')}: ${line}`);
        }
    });
    return code;
}

// Main parsing function that converts text input to Mermaid flowchart
export function parseInput(input, isVertical = true) {
    let mermaidCode = `flowchart ${isVertical ? 'TD' : 'LR'}\n`;
    const nodeStack = { label: null };
    let nodeId = 0;
    let lastMainNode = null;
    let currentDecision = null;

    const lines = input.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
        const indentLevel = (line.match(/^>+/) || [''])[0].length;
        const cleanLine = line.replace(/^>+/, '').trim();
        const parsedLine = parseLine(cleanLine);
        const currentNodeId = `node${nodeId}`;

        switch (parsedLine.type) {
            case NodeType.START:
                mermaidCode += `    ${currentNodeId}["${parsedLine.text}"]\n`;
                if (lastMainNode) {
                    mermaidCode += `    ${lastMainNode} --> ${currentNodeId}\n`;
                }
                lastMainNode = currentNodeId;
                nodeId++;
                break;

            case NodeType.BLOCK:
                mermaidCode += `    ${currentNodeId}["${parsedLine.text}"]\n`;
                if (indentLevel === 0) {
                    if (lastMainNode) {
                        mermaidCode += `    ${lastMainNode} --> ${currentNodeId}\n`;
                    }
                    lastMainNode = currentNodeId;
                } else if (nodeStack[indentLevel - 1]) {
                    mermaidCode += `    ${nodeStack[indentLevel - 1]} --> ${currentNodeId}\n`;
                }
                nodeStack[indentLevel] = currentNodeId;
                nodeId++;
                break;

            case NodeType.TREE:
                mermaidCode += `    ${currentNodeId}{"${parsedLine.text}"}\n`;
                if (lastMainNode) {
                    mermaidCode += `    ${lastMainNode} --> ${currentNodeId}\n`;
                }
                currentDecision = currentNodeId;
                lastMainNode = currentNodeId;
                nodeStack[indentLevel] = currentNodeId;
                nodeId++;
                break;

            case NodeType.NOTE:
                mermaidCode += `    ${currentNodeId}["${parsedLine.text}"]\n`;
                if (nodeStack[indentLevel - 1]) {
                    mermaidCode += `    ${nodeStack[indentLevel - 1]} --> ${currentNodeId}\n`;
                }
                nodeStack[indentLevel] = currentNodeId;
                nodeId++;
                break;

            case NodeType.LABEL:
                nodeStack.label = parsedLine.text;
                break;

            case NodeType.BRANCH:
                mermaidCode += `    ${currentNodeId}["${parsedLine.text}"]\n`;
                if (currentDecision && nodeStack.label) {
                    mermaidCode += `    ${currentDecision} -->|${nodeStack.label}| ${currentNodeId}\n`;
                }
                nodeStack[indentLevel] = currentNodeId;
                nodeStack.label = null;
                nodeId++;
                break;
        }
    }

    return debugMermaidCode(mermaidCode);
} 