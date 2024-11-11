'use client';

import type { FunctionComponent } from 'react';
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '../form';

const AuthInput: FunctionComponent<{
    label?: string
    children: React.ReactNode,
    message?: string
    horizontal?: boolean
    className?: string
    labelWidth?: string
}> = ({ label, children, message, horizontal, className, labelWidth = '170px' }) => {

    return (
        <FormItem>
            <div
                className={`
                    ${horizontal ? 'flex flex-col md:grid md:gap-4 md:items-center' : 'flex flex-col'}
                    ${horizontal ? `md:grid-cols-[${labelWidth}_1fr]` : ''}
                    ${className ?? ''}
                `}
                style={horizontal ? { gridTemplateColumns: `${labelWidth} 1fr` } : undefined}
            >
                {label && (
                    <div className="min-w-0">
                        <FormLabel>{label}</FormLabel>
                    </div>
                )}
                <div className="min-w-0">
                    <FormControl>
                        {children}
                    </FormControl>
                    <FormMessage message={message} />
                </div>
            </div>
        </FormItem>
    );
};

export default AuthInput;