/**
 * Generate a project URL using username and project slug
 */
export function getProjectUrl(username: string, projectSlug: string): string {
    return `/projects/${username}/${projectSlug}`;
}

/**
 * Generate a project edit URL using username and project slug
 */
export function getProjectEditUrl(username: string, projectSlug: string): string {
    return `/projects/${username}/${projectSlug}/edit`;
}

/**
 * Parse a project URL to extract username and project slug
 */
export function parseProjectUrl(url: string): { username: string; projectSlug: string } | null {
    const match = url.match(/^\/projects\/([^\/]+)\/([^\/]+)(?:\/.*)?$/);
    if (!match) {
        return null;
    }

    return {
        username: match[1],
        projectSlug: match[2],
    };
}
