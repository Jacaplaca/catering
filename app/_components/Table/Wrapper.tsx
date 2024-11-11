import { type FunctionComponent } from 'react';

const TableWrapper: FunctionComponent<{ children: React.ReactNode }>
    = ({ children }) => {
        return (
            <div className={`
            w-full
                relative shadow-md
                bg-neutral-50 dark:bg-darkmode-table-darker
                sm:rounded-lg
            `}>
                {children}
            </div>
        )
    };

export default TableWrapper;