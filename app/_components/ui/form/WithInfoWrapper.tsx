import type { FC, ReactNode } from 'react';

interface FormWrapperProps {
    children: ReactNode;
    oneCol?: boolean;
    id?: string;
    header?: ReactNode;
}

const WithInfoWrapper: FC<FormWrapperProps> = ({ children, oneCol, id = "", header }) => {

    if (oneCol) {
        return <div>{children}</div>
    }

    return (
        <div>
            {header ? <div className='mb-6'>
                {header}
            </div> : null}
            <div id={id} className='flex flex-col lg:flex-row justify-between items-top gap-12'>
                {children}
            </div>
        </div>
    );
};


export default WithInfoWrapper;
