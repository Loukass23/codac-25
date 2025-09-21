import type { Value } from 'platejs';

/**
 * Converts JSON data to Plate.js value format
 * @param json - JSON data (can be null, undefined, or any JSON value)
 * @returns Plate.js Value array
 */
export function jsonToPlateValue(json: unknown): Value {
    // If json is null, undefined, or empty, return empty array
    if (!json) {
        return [];
    }

    // If json is already an array, assume it's already in Plate format
    if (Array.isArray(json)) {
        return json as Value;
    }

    // If json is a string, try to parse it
    if (typeof json === 'string') {
        try {
            const parsed = JSON.parse(json);
            return Array.isArray(parsed) ? parsed as Value : [];
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
        // If it has a structure that looks like Plate content, return as is
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
}
