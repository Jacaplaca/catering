const Tag: React.FC<{
    label: string;
    remove: () => void;
    highlighted: boolean;
    removing: boolean;
    newHashtag: boolean;
    onClick: () => void;
    show?: boolean;
}> = ({ label, remove, show, highlighted, removing, newHashtag, onClick }) => {
    return (
        <span
            onClick={show ? () => { return } : onClick}
            className={`
            m-1 pl-4 pr-3 py-2
            flex flex-wrap items-center
            justify-between rounded
            dark:bg-neutral-700 bg-neutral-200
            ${show ?? "cursor-pointer hover:dark:bg-neutral-600 hover:bg-neutral-300 "}
            ${highlighted && "animate-highlight dark:text-gray-100"}
            sm:text-sm
            dark:text-neutral-300 text-neutral-700
            text-xs font-bold leading-loose
            ${removing && "animate-disappear"}
            ${newHashtag && "animate-new"}
            `}>
            {label}
            {!show && <i
                onClick={e => {
                    e.stopPropagation();
                    remove();
                }}
                className={`fa-solid fa-times
                ml-2
                text-neutral-500 hover:text-neutral-600
                dark:text-neutral-400 dark:hover:text-neutral-300
                `} />}
        </span>
    )
}

export default Tag