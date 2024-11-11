export const Label: React.FC<{ label: string, className?: string, forHtml: string }> = ({ label, className, forHtml }) => {
    return <label className={` label ${className ?? ""}`}
        htmlFor={forHtml}
    >{label}</label>
};

export const TimePickerWatch = () => {
    return (
        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
            <i className="fas fa-clock text-neutral-500 dark:text-neutral-400"></i>
        </div>
    )
};