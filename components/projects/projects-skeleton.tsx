'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProjectsSkeleton() {
  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Page Header Skeleton */}
      <div className='mb-8'>
        <Skeleton className='h-8 w-32 mb-2' />
        <Skeleton className='h-5 w-96 max-w-full' />
      </div>

      {/* Search and Filters Section */}
      <div className='mb-6'>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4'>
          {/* Search Bar Skeleton */}
          <div className='flex-1 max-w-md'>
            <Skeleton className='h-10 w-full' />
          </div>

          {/* Filter and View Controls Skeleton */}
          <div className='flex items-center gap-2'>
            <Skeleton className='h-9 w-20' />
            <div className='flex items-center rounded-md border p-1'>
              <Skeleton className='h-7 w-7' />
              <Skeleton className='h-7 w-7' />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Skeleton */}
      <div className='mb-4'>
        <Skeleton className='h-4 w-48 mb-6' />

        {/* Grid Layout - 3 columns on desktop, responsive */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='bg-card border rounded-lg overflow-hidden'
            >
              {/* Project Image Skeleton */}
              <Skeleton className='aspect-video w-full' />

              {/* Card Content */}
              <div className='p-6 space-y-4'>
                {/* Title and Description */}
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-3/4' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                </div>

                {/* Tech Stack Skeleton */}
                <div className='space-y-2'>
                  <Skeleton className='h-3 w-16' />
                  <div className='flex flex-wrap gap-1'>
                    <Skeleton className='h-5 w-12' />
                    <Skeleton className='h-5 w-16' />
                    <Skeleton className='h-5 w-14' />
                    <Skeleton className='h-5 w-10' />
                  </div>
                </div>

                {/* Author Info Skeleton */}
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-5 w-5 rounded-full' />
                  <Skeleton className='h-4 w-20' />
                </div>
              </div>

              {/* Card Footer */}
              <div className='px-6 pb-6'>
                <div className='flex items-center justify-between'>
                  {/* Stats Skeleton */}
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-4 w-8' />
                    <Skeleton className='h-4 w-6' />
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className='flex items-center gap-1'>
                    <Skeleton className='h-7 w-7' />
                    <Skeleton className='h-7 w-7' />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
