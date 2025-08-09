
import React from 'react';

const SkeletonBar: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded ${className || ''}`}></div>
);

export const DocSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-8">
        <SkeletonBar className="h-10 w-3/4" />
        <div className="space-y-4">
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-5/6" />
        </div>
        <div className="space-y-4">
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-11/12" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-3/4" />
        </div>
        <div className="space-y-4">
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-4/6" />
        </div>
    </div>
);
