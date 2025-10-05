import { Value } from 'platejs';

/**
 * Utility functions for working with project content
 */

/**
 * Converts a simple string description to Plate.js Value format
 */
export function stringToPlateValue(text: string): Value {
    if (!text || text.trim() === '') {
        return [
            {
                type: 'p',
                children: [{ text: '' }],
            },
        ];
    }

    return [
        {
            type: 'p',
            children: [{ text: text.trim() }],
        },
    ];
}

/**
 * Extracts plain text from Plate.js Value for previews
 */
export function plateValueToPlainText(value: Value): string {
    if (!value || !Array.isArray(value)) {
        return '';
    }

    return value
        .map(node => {
            if (typeof node === 'object' && node !== null && 'children' in node) {
                return extractTextFromNode(node);
            }
            return '';
        })
        .join('\n')
        .trim();
}

/**
 * Recursively extracts text from a Plate node
 */
function extractTextFromNode(node: any): string {
    if (!node.children) {
        return '';
    }

    return node.children
        .map((child: any) => {
            if (typeof child === 'string') {
                return child;
            }
            if (typeof child === 'object' && child !== null) {
                if ('text' in child) {
                    return child.text || '';
                }
                if ('children' in child) {
                    return extractTextFromNode(child);
                }
            }
            return '';
        })
        .join('');
}

/**
 * Creates a default project summary template
 */
export function createDefaultProjectSummary(): Value {
    return [
        {
            type: 'h2',
            children: [{ text: '🚀 Project Overview' }],
        },
        {
            type: 'p',
            children: [
                { text: 'Brief description of what the project does and why it exists.' },
            ],
        },
        {
            type: 'h2',
            children: [{ text: '🛠️ Tech Stack' }],
        },
        {
            type: 'p',
            children: [
                { text: 'List the main technologies, frameworks, and tools used.' },
            ],
        },
        {
            type: 'h2',
            children: [{ text: '✨ Key Features' }],
        },
        {
            type: 'ul',
            children: [
                {
                    type: 'li',
                    children: [{ text: 'Feature 1' }],
                },
                {
                    type: 'li',
                    children: [{ text: 'Feature 2' }],
                },
            ],
        },
        {
            type: 'h2',
            children: [{ text: '🎯 Challenges & Solutions' }],
        },
        {
            type: 'p',
            children: [
                {
                    text: 'Describe the main challenges faced and how you solved them.',
                },
            ],
        },
        {
            type: 'h2',
            children: [{ text: '📈 Results & Impact' }],
        },
        {
            type: 'p',
            children: [
                {
                    text: 'What did you achieve? Any metrics, user feedback, or lessons learned?',
                },
            ],
        },
    ];
}

/**
 * Validates if content is a valid Plate.js Value
 */
export function isValidPlateValue(content: unknown): content is Value {
    if (!Array.isArray(content)) {
        return false;
    }

    return content.every(node => {
        if (typeof node !== 'object' || node === null) {
            return false;
        }

        // Must have type and children
        if (!('type' in node) || !('children' in node)) {
            return false;
        }

        // Children must be an array
        if (!Array.isArray(node.children)) {
            return false;
        }

        return true;
    });
}
