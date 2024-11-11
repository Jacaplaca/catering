import { type FunctionComponent } from 'react';

const DashboardItemWrapper: FunctionComponent<{
    children: React.ReactNode;
    title?: string;
    mainAction?: React.ReactNode;
    className?: string;
}> = ({ children, title, mainAction, className }) => {
    return (
        <div className={`flex flex-col gap-2 dark:bg-darkmode-table-darker bg-neutral-50  
        shadow-small dark:shadow-darkmode-small p-6 rounded-lg ${className}`}>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border dark:border-darkmode-border pb-4 mb-4`}>
                <h3 className="text-2xl md:col-span-2 min-w-0 flex">
                    {title}
                </h3>
                {mainAction && (
                    <div className="flex justify-end items-center">
                        {mainAction}
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}

export default DashboardItemWrapper;