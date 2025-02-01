import { forwardRef } from 'react';
import { InputStyleProvider } from '@root/app/_components/ui/Inputs/InputStyleContext';
import InputWithStyle from '@root/app/_components/ui/InputWithStyle';
import { useBoolean } from 'usehooks-ts';

type InputStandardProps = {
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
    type: string;
    accept?: string;
    placeholder?: string;
    isTextArea?: boolean;
    rows?: number;
    focus?: (focused: boolean) => void;
    blur?: (focused: boolean) => void;
    topSharp?: boolean;
    bottomSharp?: boolean;
    borderErrorColor?: string;
    disabled?: boolean;
    id: string;
    ref?: React.ForwardedRef<HTMLInputElement>;
    autoComplete?: string;
    maxLength?: number;
    className?: string;
    mouseLeave?: () => void;
    defaultValue?: string;
    isLoading?: boolean;
    isError?: boolean;
    onClick?: () => void;
};

const InputStandard = forwardRef<HTMLInputElement, InputStandardProps>((
    {
        value,
        onChange,
        name,
        type,
        accept,
        placeholder,
        isTextArea,
        rows,
        focus,
        topSharp,
        bottomSharp,
        borderErrorColor,
        disabled,
        id,
        autoComplete = "off",
        maxLength = Infinity,
        className,
        mouseLeave,
        defaultValue,
        isLoading = false,
        isError = false,
        onClick
    }, ref
) => {

    const { value: showPassword, toggle: handleShowPassword } = useBoolean(false)


    // dark:placeholder-gray-400  placeholder-gray-500
    const onFocus = () => focus && focus(true)
    const onBlur = () => focus && focus(false)
    const onMouseLeave = () => mouseLeave && mouseLeave()

    const props = {
        topSharp,
        bottomSharp,
        borderErrorColor,
        disabled,
        isLoading,
        isError,
        placeholder,
        name,
        id,
        ref,
        // style: { animation: 'opacityDelay 0.5s forwards' },
        value,
        onChange,
        onFocus,
        onBlur,
        onMouseLeave,
        className,
        onClick
    }

    if (isTextArea) {
        return (
            <InputStyleProvider>
                <span className={`contents`} >
                    <InputWithStyle
                        multiline
                        rows={rows ? rows : 3}
                        maxLength={maxLength}
                        {...props}
                    />
                    {
                        maxLength && maxLength !== Infinity ? <div className='text-right text-xs text-gray-500 dark:text-gray-400'>{value?.length ?? 0}/{maxLength}</div> : null
                    }
                </span>
            </InputStyleProvider>
        );
    } else {
        switch (type) {
            case 'password':
                return (
                    <div className="flex justify-between">

                        <InputStyleProvider>
                            {/* <div className={`w-full ${isLoading ? 'animate-pulse' : ""}`}> */}
                            {/* {label ? <div
                        className='mb-1'
                    ><Label label={label} forHtml={id} /></div> : <div />} */}
                            <InputWithStyle
                                type={showPassword ? "text" : type}
                                accept={accept}
                                autoComplete={autoComplete}
                                defaultValue={defaultValue}
                                {...props}
                            // autoComplete='off'
                            // autoComplete="new-password"

                            // ref={ref}
                            />
                            {/* </div> */}
                        </InputStyleProvider>
                        <button
                            className="flex items-center justify-center h-10 w-10 rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            onClick={handleShowPassword}
                        >
                            <i className={`fas ${showPassword ? `fa-eye-slash` : `fa-eye`}`}></i>
                        </button>
                    </div>
                )
            default:
                return (
                    <InputStyleProvider>
                        <InputWithStyle
                            type={type}
                            accept={accept}
                            autoComplete={autoComplete}
                            defaultValue={defaultValue}
                            {...props}
                        />
                    </InputStyleProvider>
                );
        }
    }
})




InputStandard.displayName = 'InputStandard';

export default InputStandard;