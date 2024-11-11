import { type ReactNode, type FunctionComponent } from 'react';

const FormSection: FunctionComponent<{
    children: ReactNode
    title?: string
    description?: string
    className?: string
    twoRows?: boolean
}> = ({ children, title, description, className, twoRows }) => {

    return (
        <div className='p-4'>
            {(title ?? description) && <div className='flex flex-row gap-2 items-center mb-8'>
                {title && <h5
                    className='font-bold'
                >{title} </h5>}
                {description && <p className={`
                    font-black  p-1 px-2 rounded-md
                    bg-neutral-200 dark:bg-neutral-700
                    text-neutral-800 dark:text-neutral-200
                    `}>{description}</p>}
                <div className='flex-1 border-t ml-4 border-neutral-300 dark:border-neutral-600' />
            </div>}
            <div className={`grid grid-cols-1 gap-y-4 gap-x-10 ${twoRows ? "lg:grid-cols-2" : ""} ${className}`} >
                {children}
            </div>
        </div>
    );
};

export default FormSection;
