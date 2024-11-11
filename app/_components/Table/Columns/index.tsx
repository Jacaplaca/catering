import HeadCellSortable from '@root/app/_components/Table/HeadCellSortable';
import Checkbox from '@root/app/_components/ui/Inputs/Checkbox';
import translate from '@root/app/lib/lang/translate';
import { type TableColumnType } from '@root/types';
import { Label, Table } from 'flowbite-react';
import { type FunctionComponent } from 'react';

const TableColumns: FunctionComponent<{
    columns: TableColumnType[],
    check?: () => void;
    isCheck?: boolean;
    sortName?: string;
    sortDirection?: 'asc' | 'desc';
    show?: string[];
    dictionary: Record<string, string>;
    hideCheck?: boolean;
}> = ({
    columns,
    check,
    isCheck = false,
    sortName,
    sortDirection,
    show,
    dictionary,
    hideCheck
}) => {
        const filter = ({ key }: { key?: string }) => {
            if (!show || !key) return true;
            return show.includes(key);
        };
        return (
            <Table.Head className="">
                {check && (
                    <Table.HeadCell scope="col" className="px-4 py-3">
                        {!hideCheck && <div className="flex items-center">
                            <Checkbox
                                id="checkbox-all"
                                name="checkbox-all"
                                size={'md'}
                                onChange={check}
                                checked={isCheck}
                            />
                            <Label htmlFor="checkbox-all" className="sr-only">
                                Check all
                            </Label>
                        </div>}
                    </Table.HeadCell>
                )}
                {columns.filter(filter).map(({ key, title, sort, align, special }) => (
                    <HeadCellSortable
                        key={key}
                        name={key}
                        sort={sort}
                        sortName={sortName}
                        sortDirection={sortDirection}
                        align={align}
                        special={special}
                    >
                        {translate(dictionary, title)}
                    </HeadCellSortable>
                ))}
            </Table.Head>
        )
    }

export default TableColumns;