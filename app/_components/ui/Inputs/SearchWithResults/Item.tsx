import HighlightText from '@root/app/_components/Table/HighlightText';
import ItemWrapper from '@root/app/_components/ui/Inputs/SearchWithResults/ItemWrapper';
import { type VirtualItem } from '@tanstack/react-virtual';
import { type FunctionComponent } from 'react';

export type ItemProps = {
    item?: { id: string, name: string };
    virtualRow: VirtualItem;
    isLoaderRow: boolean;
    onClick?: (id: string) => void;
    fragment?: string;
    limitChars?: number;
    isSelected?: boolean;
}

const Item: FunctionComponent<ItemProps> = ({ item, virtualRow, isLoaderRow, onClick, fragment, limitChars = 25, isSelected }) => {
    return (
        <ItemWrapper
            item={item}
            virtualRow={virtualRow}
            onClick={onClick}
            isLoaderRow={isLoaderRow}
        >
            <HighlightText
                isLoading={isLoaderRow}
                limit={limitChars}
                className={`text-base  h-full
                            text-neutral-700 dark:text-white
                            flex items-center
                            `}
                text={item?.name ?? ''}
                fragment={fragment}
            />
        </ItemWrapper>
    );
}

export default Item;

