import React from 'react';

interface HighlightTextProps {
    text?: string | null;
    fragment?: string;
    className?: string;
    limit?: number;
    onClick?: () => void;
    isLoading?: boolean;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text = "", fragment = '', className: classNameProp = "", limit, onClick, isLoading }) => {

    const className = `text-neutral-900 dark:text-neutral-100 ${classNameProp}`;

    if (isLoading) {
        return <div className='flex items-center justify-center w-full'>
            <i className={`animate-spin fas fa-spinner `}></i>
        </div>
    }

    if (!text) {
        return null;
    }

    let displayText = text;
    if (limit && text.length > limit + 3) {
        displayText = text.slice(0, limit) + '...';
    }

    if (!fragment || !displayText.toLowerCase().includes(fragment.toLowerCase())) {
        return <span
            onClick={onClick}
            className={className}>{displayText}</span>;
    }

    const parts = displayText.split(new RegExp(`(${fragment})`, 'gi'));

    return (
        <span
            onClick={onClick}
            className={className}>
            {parts.map((part, index) =>
                part.toLowerCase() === fragment.toLowerCase()
                    ? <strong
                        className='font-extrabold'
                        key={index}>{part}</strong>
                    : part
            )}
        </span>
    );
};

export default HighlightText;
