import Message from '@root/app/_components/ui/form/Message';
import type { FC, ReactNode } from 'react';

interface FormWrapperProps {
    children: ReactNode;
    label?: string;
    className?: string;
    info?: string | null | ReactNode;
    status?: 'error' | 'info' | 'success';
}

const FormWrapper: FC<FormWrapperProps> = ({ children, label, className, info, status = 'info' }) => {
    return (
        <div className={`form-wrapper ${className ? className : ""}`}>
            <Message
                show={!!info}
                className='mb-4'
                status={status}
                message={info ?? ""}
            />
            {label && <h2>{label}</h2>}
            <div className="form-children">
                {children}
            </div>
        </div>
    );
};


export default FormWrapper;
