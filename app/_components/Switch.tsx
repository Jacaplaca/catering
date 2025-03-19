"use client";

interface SwitchProps {
    id?: string;
    checked?: boolean;
    onClick?: () => void;
    checkedIcon?: string;
    uncheckedIcon?: string;
    className?: string;
    checkedColor?: string;
    uncheckedColor?: string;
}

const Switch = ({
    id = "custom-switch",
    checked = false,
    onClick,
    checkedIcon = "fa-solid fa-moon",
    uncheckedIcon = "fa-solid fa-sun",
    checkedColor = "bg-green-500 dark:bg-green-400",
    uncheckedColor = "bg-neutral-400 dark:bg-neutral-500",
    className = ""
}: SwitchProps) => {
    // const [mounted, setMounted] = useState(false);

    // useEffect(() => setMounted(true), []);

    return (
        <div className={`custom-switch ${className}`}>
            <input
                id={id}
                type="checkbox"
                defaultChecked={checked}
                onClick={onClick}
            />
            <label htmlFor={id} >
                <span className="sr-only">switch</span>
                <span className={`${checked ? checkedColor : uncheckedColor}`}>
                    <i id="switch-icon"
                        className={`absolute z-10 text-base opacity-100 
                            ${checked ? checkedIcon : uncheckedIcon} 
                            `}
                    ></i>
                    {/* <i
                        className={`absolute left-[4px] top-[4px] z-10 text-base ${rightIcon} ${defaultChecked ? 'opacity-100' : 'opacity-0'}`}
                    ></i> */}
                </span>
            </label>
        </div>
    );
};

export default Switch; 