
import { Table } from 'flowbite-react';
import { type FunctionComponent } from 'react';

const ExpandedRow: FunctionComponent<{
    rowClassName?: string;
    cellClassName?: string;
    children?: React.ReactNode;
    colSpan?: number;
}> = ({
    rowClassName,
    cellClassName,
    children,
    colSpan = 20
}) => {

        return (
            <Table.Row
                className={` flex-1 overflow-x-auto
            bg-neutral-50 dark:bg-neutral-800
            hover:bg-neutral-50 hover:dark:bg-neutral-800
            border-transparent dark:border-transparent
            ${rowClassName ?? ''}
            `}
                id="table-column-body-4"
                aria-labelledby="table-column-header-4"
            >
                <Table.Cell
                    className={`p-4 ${cellClassName ?? ''}`}
                    colSpan={colSpan}
                > {children}
                </Table.Cell>
            </Table.Row>
        );
    }


export default ExpandedRow;