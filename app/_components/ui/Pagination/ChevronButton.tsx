import Link from "next/link";

const ChevronButton: React.FC<{
    direction: "left" | "right", double?: boolean, disabled?: boolean, url: string
}> = ({ direction, double, disabled, url }) => {
    const sr = {
        left: 'Previous',
        right: 'Next',
    }

    const icon = {
        left: double ? 'fa-angle-double-left' : 'fa-chevron-left',
        right: double ? 'fa-angle-double-right' : 'fa-chevron-right',
    }

    return (
        <Link href={url} className={`mx-2 p-2 text-xl ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
            <span className="sr-only">{sr[direction]}</span>
            <i className={`fa-solid ${icon[direction]}`} />
        </Link>
    )
};

export default ChevronButton;