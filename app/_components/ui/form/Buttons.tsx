import MyButton from '@root/app/_components/ui/buttons/MyButton';
import { type FunctionComponent } from 'react';

const Buttons: FunctionComponent<{
    className?: string
    cancelLabel?: string
    onCancel?: () => void
    cancelDisabled?: boolean
    submitLabel: string
    onSubmit: () => void
    submitDisabled?: boolean
    submitLoading?: boolean
    onReset?: () => void
}> = ({
    className,
    cancelLabel,
    onCancel,
    cancelDisabled,
    submitLabel,
    onSubmit,
    submitDisabled,
    submitLoading,
    onReset
}) => {
        return (
            <div className={`flex gap-4 justify-end items-center ${className ?? ""}`}>
                {onReset
                    ? <i
                        onClick={onReset}
                        className="fas fa-undo-alt text-neutral-500 cursor-pointer"></i>
                    : null}
                {cancelLabel ? <MyButton
                    type='reset'
                    onClick={onCancel}
                    id='cancel-settings'
                    ariaLabel={cancelLabel}
                    disabled={cancelDisabled}
                >
                    {cancelLabel}
                </MyButton> : null}
                <MyButton
                    type='submit'
                    onClick={onSubmit}
                    id='save-settings'
                    ariaLabel={submitLabel}
                    loading={submitLoading}
                    disabled={submitDisabled}
                >
                    {submitLabel}
                </MyButton>
            </div>
        )
    }

export default Buttons;