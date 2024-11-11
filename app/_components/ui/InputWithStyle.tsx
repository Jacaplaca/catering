import { type InputStyleProps, useInputStyle } from '@root/app/_components/ui/Inputs/InputStyleContext';
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface BaseInputProps extends InputStyleProps {
    multiline?: boolean;
}

interface SingleLineInputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps { }

interface MultiLineInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps { }

type InputProps = SingleLineInputProps | MultiLineInputProps;

const InputWithStyle = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>((
    props,
    ref
) => {
    const { getInputClassName } = useInputStyle();
    const { multiline, ...restProps } = props;
    const className = getInputClassName(restProps);
    const safeClassName = typeof className === 'string' ? className : undefined;

    const cleanProps = { ...restProps };
    delete cleanProps.isLoading;
    delete cleanProps.topSharp;
    delete cleanProps.bottomSharp;
    delete cleanProps.borderErrorColor;
    delete cleanProps.isError;

    if (multiline) {
        return <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            {...cleanProps as TextareaHTMLAttributes<HTMLTextAreaElement>}
            className={safeClassName}
        />;
    }

    return <input
        ref={ref as React.ForwardedRef<HTMLInputElement>}
        {...cleanProps as InputHTMLAttributes<HTMLInputElement>}
        className={safeClassName}
    />;
});

InputWithStyle.displayName = 'Input';

export default InputWithStyle;