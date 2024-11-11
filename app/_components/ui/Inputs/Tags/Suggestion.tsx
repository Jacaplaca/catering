const Suggestion: React.FC<{
    label: string;
    onClick: () => void;
    highlighted: boolean;
}> = ({ label, onClick, highlighted }) => {
    return (
        <button
            onClick={onClick}
            className={`m-1 flex cursor-pointer flex-wrap items-center justify-between
            rounded-t-md bg-secondary dark:bg-darkmode-secondary-accent 
            px-2 text-xs font-semibold sm:text-sm leading-loose 
            text-neutral-800 dark:text-white
            ${highlighted ? "bg-secondary-accent dark:bg-darkmode-secondary text-gray-800" : ""}
            hover:bg-secondary-accent dark:hover:bg-darkmode-secondary
            `}
        >
            {label}
        </button>
    )
}

export default Suggestion