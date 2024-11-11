import { Alert } from 'react-daisyui';

export type MessageStatusType = "info" | "success" | "warning" | "error";

const Message: React.FC<{
    show?: boolean,
    message?: string | null | React.ReactNode,
    status?: MessageStatusType
    loading?: boolean,
    className?: string
    onClose?: () => void
    animate?: 'slideInRight' | 'slideInLeft' | 'slideInTop' | 'slideInBottom'
    textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}> = ({ show, message, status = 'info', loading = false, className = "", onClose, animate, textSize = 'sm' }) => {

    if (!show || !message) return null;

    const mainAnimateClass = 'transform transition-all duration-300 ease-in-out';

    const animateClass = {
        slideInRight: 'animate-slideInRight',
        slideInLeft: 'animate-slideInLeft',
        slideInTop: 'animate-slideInTop',
        slideInBottom: 'animate-slideInBottom',
    }

    const textClass = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-md',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
    }

    const data = {
        info: {
            icon: 'fas fa-info-circle text-info dark:text-darkmode-info',
        },
        spinner: {
            icon: 'fas fa-spinner animate-spin',
        },
        success: {
            icon: 'fas fa-check-circle text-success dark:text-darkmode-success',
        },
        warning: {
            icon: 'fas fa-exclamation-triangle text-warning dark:text-darkmode-warning',
        },
        error: {
            icon: 'fas fa-exclamation-triangle text-alarm dark:text-darkmode-alarm',
        }
    }
    return <Alert
        status={status}
        className={`dark:bg-neutral-900 bg-white text-text dark:text-darkmode-text 
            border-border dark:border-darkmode-border shadow-small dark:shadow-darkmode-small ${className}
        ${animate ? `${animateClass[animate]} ${mainAnimateClass}` : ""}
        ${onClose ? 'cursor-pointer' : ""}
        `}
        icon={message ? <i className={`${data[loading ? 'spinner' : status].icon} `}></i> : null}
        onClick={onClose}
    >
        <div
            className={`font-semibold w-full ${textClass[textSize]}`}
        >{message}</div>
        {onClose && <div className={`${textClass[textSize]}`}>
            <i className={`fas fa-xmark opacity-50 hover:opacity-100`}></i>
        </div>}
    </Alert>
};

export default Message;