const YesNo = ({ value }: { value: boolean }) => {
    const trueClassIcon = "fa-solid fa-check text-green-100 dark:text-white";
    const falseClassIcon = "fa-solid fa-xmark text-red-100 dark:text-white";
    const trueClassColor = "bg-green-500 dark:bg-green-400";
    const falseClassColor = "bg-red-600 dark:bg-red-500";
    return (
        <div className="flex items-center justify-center">
            <div className={`inline-flex h-6 w-6 items-center justify-center rounded-full p-1 ${value ? trueClassColor : falseClassColor}`}>
                <i className={value ? trueClassIcon : falseClassIcon} />
            </div>
        </div>
    )
}

export default YesNo;
