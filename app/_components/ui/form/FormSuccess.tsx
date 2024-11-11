import FormWrapper from '@root/app/_components/ui/form/Wrapper'

const FormSuccess: React.FC<{
    title: string,
    icon: string,
    className?: string
    handleBack?: () => void
}> = ({ title, icon, className = "", handleBack }) => {
    return (
        <FormWrapper>
            <div
                className={`flex flex-col items-center justify-center ${className}`}
            >
                <i className={`${icon} text-4xl dark:text-green-400 text-green-500 mb-8`}></i>
                <h2 className='text-2xl font-bold mb-6 text-center dark:text-gray-300 text-gray-700'>
                    {title}
                </h2>
                {handleBack && (
                    <button
                        onClick={handleBack}
                        className='transition-all duration-200 hover:scale-125 flex items-center justify-center ml-2'
                    >
                        <i className='fas fa-arrow-left mr-2'></i>
                    </button>
                )}
            </div>
        </FormWrapper>
    )
}

export default FormSuccess
