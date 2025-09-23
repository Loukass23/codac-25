import type { Value } from 'platejs';

/**
 * Converts JSON data to Plate.js value format
 * @param json - JSON data (can be null, undefined, or any JSON value)
 * @returns Plate.js Value array
 */
export function jsonToPlateValue(json: unknown): Value {
    try {
        // If json is null, undefined, or empty, return default structure
        if (!json) {
            return [
                {
                    type: 'p',
                    children: [{ text: '' }],
                },
            ];
        }

        // If json is already an array, validate and normalize it
        if (Array.isArray(json)) {
            // If empty array, return default structure
            if (json.length === 0) {
                return [
                    {
                        type: 'p',
                        children: [{ text: '' }],
                    },
                ];
            }

            // Validate each node in the array
            const validatedArray = json.map((node: any) => {
                if (!node || typeof node !== 'object') {
                    return {
                        type: 'p',
                        children: [{ text: String(node || '') }],
                    };
                }

                // Ensure required properties exist
                if (!node.type) {
                    node.type = 'p';
                }
                if (!node.children || !Array.isArray(node.children)) {
                    node.children = [{ text: '' }];
                }

                // Validate children
                node.children = node.children.map((child: any) => {
                    if (typeof child === 'string') {
                        return { text: child };
                    }
                    if (!child || typeof child !== 'object') {
                        return { text: String(child || '') };
                    }
                    if (!child.text && !child.type) {
                        return { text: '' };
                    }
                    return child;
                });

                return node;
            });

            return validatedArray as Value;
        }

        // If json is a string, try to parse it
        if (typeof json === 'string') {
            // If it's an empty string, return default structure
            if (json.trim() === '') {
                return [
                    {
                        type: 'p',
                        children: [{ text: '' }],
                    },
                ];
            }

            try {
                const parsed = JSON.parse(json);
                // Recursively call this function with the parsed value
                return jsonToPlateValue(parsed);
            } catch {
                // If parsing fails, treat as plain text
                return [
                    {
                        type: 'p',
                        children: [{ text: json }],
                    },
                ] as Value;
            }
        }

        // If json is an object, try to convert to Plate format
        if (typeof json === 'object') {
            // If it has a structure that looks like Plate content, wrap it in an array
            if ('type' in json && 'children' in json) {
                return [json] as Value;
            }

            // Otherwise, convert to a paragraph with the object as text
            return [
                {
                    type: 'p',
                    children: [{ text: JSON.stringify(json) }],
                },
            ] as Value;
        }

        // For other types, convert to text
        return [
            {
                type: 'p',
                children: [{ text: String(json) }],
            },
        ] as Value;
    } catch (error) {
        // If anything goes wrong, return a safe default structure
        console.error('Error in jsonToPlateValue:', error);
        return [
            {
                type: 'p',
                children: [{ text: '' }],
            },
        ];
    }
}
