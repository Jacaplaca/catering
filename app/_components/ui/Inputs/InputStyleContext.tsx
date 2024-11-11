import React, { createContext, useContext } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputStyleContextType {
    getInputClassName: (props: InputStyleProps) => string;
}

export interface InputStyleProps {
    topSharp?: boolean;
    bottomSharp?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
    borderErrorColor?: string;
    isError?: boolean;
}

const InputStyleContext = createContext<InputStyleContextType | undefined>(undefined);

export const InputStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const getInputClassName = ({
        topSharp,
        bottomSharp,
        disabled,
        isLoading,
        className,
        borderErrorColor,
        isError,
    }: InputStyleProps) => {
        return twMerge(
            'input-standard',
            topSharp && bottomSharp ? 'rounded-none' :
                topSharp ? 'rounded-t-none rounded-b-md' :
                    bottomSharp ? 'rounded-b-none rounded-t-md' :
                        'rounded-md',
            isError ? borderErrorColor
                ? borderErrorColor
                : 'border-red-300 dark:border-red-800'
                : '',
            isLoading && 'animate-pulse',
            disabled && 'cursor-not-allowed',
            className ?? ''
        );
    };

    return (
        <InputStyleContext.Provider value={{ getInputClassName }}>
            {children}
        </InputStyleContext.Provider>
    );
};

export const useInputStyle = () => {
    const context = useContext(InputStyleContext);
    if (!context) {
        throw new Error('useInputStyle must be used within an InputStyleProvider');
    }
    return context;
};