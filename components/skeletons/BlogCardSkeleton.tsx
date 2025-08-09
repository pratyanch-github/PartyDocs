
import React from 'react';

const SkeletonBar: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded ${className || ''}`}></div>
);

export const BlogCardSkeleton: React.FC = () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse">
        <SkeletonBar className="h-7 w-3/4 mb-4" />
        <div className="space-y-3">
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-5/6" />
        </div>
        <SkeletonBar className="h-5 w-24 mt-6" />
    </div>
);
