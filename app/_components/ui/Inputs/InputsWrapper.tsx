import type { FunctionComponent, ReactNode } from 'react';

const InputsWrapper: FunctionComponent<{
    children: ReactNode,
    className?: string
}> = ({ children, className }) => {
    return (
        <div className={`space-y-6 ${className}`}>
            {children}
        </div>
    );
};

export default InputsWrapper;