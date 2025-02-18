import { Table } from 'flowbite-react';
import { type FunctionComponent } from 'react';

const TableContent: FunctionComponent<{
    tableData: {
        rows: {
            className?: string;
            component?: React.ReactNode;
            key?: string;
        }[];
        blockClick?: boolean;
        className?: string;
        key: string;
    }[]
    className?: string;
    show?: string[];
    onRowClick?: (key: string) => void;
    ExpandedRow?: React.ComponentType;
    expandedRowId?: string | null;
}> = ({
    tableData,
    className,
    show,
    onRowClick,
    ExpandedRow,
    expandedRowId
}) => {
        const filter = ({ key }: { key?: string }) => {
            if (!show || !key) return true;
            return show.includes(key);
        };
        const onClick = (key: string) => {
            onRowClick
                ? onRowClick(key)
                : () => { return }
        };

        const dataToRender = tableData.reduce((acc, { rows, className, key, blockClick }) => {
            const isExpanded = ExpandedRow && key === expandedRowId;
            acc.push(<Table.Row
                key={`row-${key}`}
                className={`
                ${className ? className : ''} 
                ${isExpanded ? 'bg-neutral-50 dark:bg-neutral-800 ' : ''}
                ${(onRowClick && !blockClick) ? 'cursor-pointer' : ''}
                `}
                onClick={() => blockClick ? () => { return } : onClick(key)}>
                {rows.filter(filter).map(({ className, component }, index) => {
                    const isLastCell = index === rows.length - 1;
                    return (
                        <Table.Cell key={`row-${key}-cell-${index}`}
                            className={`${className} border-e 
                        ${isLastCell ? 'border-transparent' : 'border-neutral-200/50 dark:border-neutral-700/20'}
                    `}>
                            {component}
                        </Table.Cell>
                    )
                })}
            </Table.Row>);
            { isExpanded ? acc.push(<ExpandedRow key={`expanded-${key}`} />) : null; }
            return acc;
        }, [] as JSX.Element[]);

        return (
            <Table.Body className={`${className ? className : ""}`}>
                {dataToRender}
            </Table.Body>
        )
    }

export default TableContent;
