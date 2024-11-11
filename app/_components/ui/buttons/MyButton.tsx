import React, { useState, useEffect, forwardRef } from 'react';

const LOADING_TIMEOUT = 1000;

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    loading?: boolean;
    id: string;
    ariaLabel: string;
    icon?: string;
    type?: "button" | "submit" | "reset";
    noButton?: boolean;
};

const MyButton = forwardRef<HTMLInputElement, Props>(({
    noButton,
    children,
    type,
    icon,
    onClick,
    disabled = false,
    className = "",
    onMouseEnter,
    onMouseLeave,
    loading = false,
    id,
    ariaLabel
}, ref) => {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        if (loading) {
            setShowSpinner(true);
            timeout = setTimeout(() => {
                setShowSpinner(false);
            }, LOADING_TIMEOUT);
        } else {
            if (showSpinner) {
                timeout = setTimeout(() => {
                    setShowSpinner(false);
                }, LOADING_TIMEOUT - (Date.now() % LOADING_TIMEOUT));
            } else {
                setShowSpinner(false);
            }
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [loading, showSpinner]);

    const content = (
        <>
            {showSpinner || icon ? <i className={`mr-3 ${showSpinner ? 'animate-spin fas fa-spinner' : icon}`} /> : null}
            {children}
        </>
    );

    if (noButton) {
        return (
            <div
                ref={ref}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                className={`button ${className}`}
                id={id}
                aria-label={ariaLabel}
            >
                {content}
            </div>
        );
    }

    return (
        <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            disabled={disabled}
            className={`button ${type === 'reset' ? "button-reset" : ""} ${className}`}
            id={id}
            aria-label={ariaLabel}
            type={type}
        >
            {content}
        </button>
    );
});

MyButton.displayName = 'MyButton';

export default MyButton;
