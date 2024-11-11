import { opacityDelay } from '@root/app/_components/animations';
import React from 'react';

const SkeletonCell: React.FC<{ className?: string }> = ({ className }) => {

    return (
        <div
            role="status"
            className="max-w-sm animate-pulse"
        >
            <style>
                {opacityDelay}
            </style>
            <div
                className={`h-5 bg-gray-200 rounded-full dark:bg-neutral-700 ${className}`}
                style={{ animation: 'opacityDelay 0.5s forwards' }}
            ></div>
        </div>
    );
};

export default SkeletonCell;
