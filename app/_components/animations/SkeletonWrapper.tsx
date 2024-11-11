import { opacityDelay } from '@root/app/_components/animations';
import { type FunctionComponent } from 'react';

const SkeletonWrapper: FunctionComponent<{
    className?: string,
    children: React.ReactNode,
    isLoading: boolean
}> = ({ className, isLoading, children }) => {

    if (!isLoading) return <>{children}</>;

    return (
        <div
            role="status"
            className={`animate-pulse ${className}`}
        >
            <style>
                {opacityDelay}
            </style>
            <div
                style={{ animation: 'opacityDelay 0.5s forwards' }}
            >{children}</div>
        </div>
    );
};

export default SkeletonWrapper;