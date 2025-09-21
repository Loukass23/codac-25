import type { ProjectStatus } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export type FilterState = {
    search: string
    tech: string[]
    status: ProjectStatus[]
    featured: boolean
    view: 'grid' | 'list'
}

export function useUrlFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateFilters = useCallback((updates: Partial<FilterState>) => {
        const params = new URLSearchParams(searchParams.toString())

        // Update search
        if (updates.search !== undefined) {
            if (updates.search) {
                params.set('search', updates.search)
            } else {
                params.delete('search')
            }
        }

        // Update tech stack
        if (updates.tech !== undefined) {
            params.delete('tech')
            updates.tech.forEach(tech => {
                params.append('tech', tech)
            })
        }

        // Update status
        if (updates.status !== undefined) {
            params.delete('status')
            updates.status.forEach(status => {
                params.append('status', status)
            })
        }

        // Update featured
        if (updates.featured !== undefined) {
            if (updates.featured) {
                params.set('featured', 'true')
            } else {
                params.delete('featured')
            }
        }

        // Update view
        if (updates.view !== undefined) {
            params.set('view', updates.view)
        }

        // Update URL
        const newUrl = params.toString() ? `?${params.toString()}` : ''
        router.push(`/projects${newUrl}`)
    }, [router, searchParams])

    const clearAllFilters = useCallback(() => {
        router.push('/projects')
    }, [router])

    const getCurrentFilters = useCallback((): FilterState => {
        return {
            search: searchParams.get('search') || '',
            tech: searchParams.getAll('tech'),
            status: searchParams.getAll('status') as ProjectStatus[],
            featured: searchParams.get('featured') === 'true',
            view: (searchParams.get('view') as 'grid' | 'list') || 'grid'
        }
    }, [searchParams])

    return {
        updateFilters,
        clearAllFilters,
        getCurrentFilters
    }
}

export function buildFilterUrl(filters: Partial<FilterState>): string {
    const params = new URLSearchParams()

    if (filters.search) {
        params.set('search', filters.search)
    }

    if (filters.tech && filters.tech.length > 0) {
        filters.tech.forEach(tech => {
            params.append('tech', tech)
        })
    }

    if (filters.status && filters.status.length > 0) {
        filters.status.forEach(status => {
            params.append('status', status)
        })
    }

    if (filters.featured) {
        params.set('featured', 'true')
    }

    if (filters.view && filters.view !== 'grid') {
        params.set('view', filters.view)
    }

    return params.toString() ? `?${params.toString()}` : ''
}
