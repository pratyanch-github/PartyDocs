
import React from 'react';

const SkeletonBar: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded ${className || ''}`}></div>
);

export const ListSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-3 p-3">
        <SkeletonBar className="h-5 w-3/4" />
        <SkeletonBar className="h-5 w-5/6" />
        <SkeletonBar className="h-5 w-1/2" />
        <SkeletonBar className="h-5 w-4/5" />
        <SkeletonBar className="h-5 w-3/4" />
    </div>
);
