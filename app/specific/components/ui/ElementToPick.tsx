import HighlightText from '@root/app/_components/Table/HighlightText';
import { type FunctionComponent } from 'react';

export type ItemProps = {
    item?: { id: string, name: string, code: string };
    onClick?: (id: string) => void;
    fragment?: string;
    selectedItems: string[];
}

const ElementToPick: FunctionComponent<ItemProps> = ({ item, onClick, fragment, selectedItems }) => {
    const clickable = onClick && item?.id;

    const selected = selectedItems?.includes(item?.id ?? '');
    console.log("fragment", fragment + "AAA");

    return (
        <div
            key={item?.id}
            onClick={(onClick && item?.id) ? () => onClick(item.id) : undefined}
            className={`w-full group
                flex items-center gap-2 justify-between my-2
                px-2
                hover:bg-secondary dark:hover:bg-darkmode-secondary-accent
                rounded-md
                ${(clickable) ? 'cursor-pointer' : 'pointer-events-none'}
                `}
            style={{
                height: `45px`,
            }}
        >
            <i className={`fa-solid fa-circle-check text-sm
                ${selected
                    ? `text-secondary-accent dark:text-darkmode-secondary
                    group-hover:text-white dark:group-hover:text-white
                    `
                    : 'text-transparent'}
                `} />
            <HighlightText
                limit={25}
                className={`text-sm  h-full
                            text-neutral-700 dark:text-white
                            flex items-center
                            `}
                text={item?.name ?? ''}
                fragment={fragment}
            />
            <div className={`ml-auto font-semibold text-neutral-700 dark:text-white text-sm`}>{item?.code}</div>
        </div>
    );
}

export default ElementToPick;

