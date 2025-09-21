

import React from "react";

function ProjectCardSkeleton() {
    return (
        <div className="animate-pulse bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col gap-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full mb-1" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-5/6 mb-1" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
        </div>
    );
}

export default function ProjectsLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
                <ProjectCardSkeleton key={idx} />
            ))}
        </div>
    );
}
