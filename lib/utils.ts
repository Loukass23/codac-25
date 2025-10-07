import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a counter if needed
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkUnique: (slug: string) => Promise<boolean>,
  maxAttempts = 100
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (await checkUnique(slug) && counter <= maxAttempts) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  if (counter > maxAttempts) {
    throw new Error(`Unable to generate unique slug after ${maxAttempts} attempts`)
  }

  return slug
}