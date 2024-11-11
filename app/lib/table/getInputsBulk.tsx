import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import { TimePickerWatch } from '@root/app/_components/ui/Inputs/elements';
import { FormField } from '@root/app/_components/ui/form';
import translate from '@root/app/lib/lang/translate';
import { type InputsBulkType } from '@root/types';
import { type Control, type FieldValues } from 'react-hook-form';

const getInputsBulk = <T,>({ inputs, dictionary, formControl, isFetching }: {
    inputs: InputsBulkType<T>[],
    dictionary: Record<string, string>,
    formControl: unknown,
    isFetching: boolean
}) => {
    return inputs.map(({
        label,
        name,
        placeholder,
        type,
        message,
        isTextArea,
        isHorizontal,
        disabled,
        labelWidth
    }, index) => {
        return (
            <InputsWrapper key={index}>
                <FormField
                    control={formControl as Control<FieldValues>}
                    name={name as string}
                    render={(props) => {
                        const { field, formState } = props;
                        // const error = errors[name as string];
                        const error = formState.errors[name as string];
                        return (
                            <AuthInput
                                labelWidth={labelWidth}
                                message={translate(dictionary, message)}
                                label={translate(dictionary, label)}
                                horizontal={isHorizontal}
                            >
                                {(() => {
                                    switch (type) {
                                        case 'time':
                                            return (
                                                <div className="relative">
                                                    <TimePickerWatch />
                                                    <InputStandard
                                                        type={type}
                                                        {...field}
                                                        id={name as string}
                                                        disabled={disabled}
                                                        isLoading={isFetching}
                                                        isError={!!error}
                                                    />
                                                </div>
                                            );
                                        case 'text':
                                        case 'email':
                                        default:
                                            return (
                                                <InputStandard
                                                    placeholder={translate(dictionary, placeholder)}
                                                    type={type}
                                                    {...field}
                                                    id={name as string}
                                                    isLoading={isFetching}
                                                    isTextArea={isTextArea}
                                                    disabled={disabled}
                                                    isError={!!error}
                                                />
                                            );
                                    }
                                })()}
                            </AuthInput>
                        );
                    }}
                />
            </InputsWrapper>
        );
    });
}

export default getInputsBulk;
