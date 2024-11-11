import { type z } from 'zod';
import getInputsBulk from '@root/app/lib/table/getInputsBulk';
import useConsumerInputs from '@root/app/specific/components/Consumers/ExpandedRow/useInputs';
import { useConsumerTableContext } from '@root/app/specific/components/Consumers/context';
import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import translate from '@root/app/lib/lang/translate';
import { FormField } from '@root/app/_components/ui/form';
import { type consumerEditValidator } from '@root/app/validators/specific/consumer';
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import FormSection from '@root/app/_components/ui/form/Section';
import ClientDropdown from '@root/app/specific/components/ui/Dropdown/Client';

const ConsumerInputs = () => {

    const {
        dictionary,
        rowClick: { form, isFetching, update,
            clients: {
                chooseClient,
            } },
    } = useConsumerTableContext();

    const inputs = useConsumerInputs();

    const Inputs = getInputsBulk<keyof z.infer<typeof consumerEditValidator>>({
        inputs,
        dictionary,
        formControl: form.control,
        isFetching: isFetching || update.isPending
    });

    return (
        <div className='flex flex-col gap-4'>

            <FormSection
            // title={translate(dictionary, 'consumers:consumer_label')}
            // description={formData?.code?.toString() ?? ''}
            // twoRows={!!expandedRowId}
            >
                <InputsWrapper >
                    <FormField
                        control={form.control}
                        name={'client'}
                        render={({
                            field: { value },
                        }) => {
                            return (
                                <AuthInput
                                    message={translate(dictionary, form.formState.errors.client?.id?.message)}
                                    label={translate(dictionary, 'consumers:client.name_column')}
                                    horizontal
                                >
                                    <ClientDropdown
                                        dictionary={dictionary}
                                        select={chooseClient}
                                        selected={value}
                                        inputClassName='w-full'
                                        foundLimitChars={35}
                                    />
                                </AuthInput>
                            )
                        }}
                    />
                    {Inputs[0]}
                    {Inputs[1]}
                    {/* {!expandedRowId && Inputs[1]} */}
                    {/* {!expandedRowId && Inputs[2]} */}
                </InputsWrapper>
                {/* {!!expandedRowId && <InputsWrapper>
                    {Inputs[1]}
                    {Inputs[2]}
                </InputsWrapper>} */}
            </FormSection>
            <FormSection
                title={translate(dictionary, 'consumers:diet_label')}
            // description={formData?.diet?.code?.toString() ?? ''}
            ><InputsWrapper>
                    {Inputs[2]}
                    {Inputs[3]}
                </InputsWrapper>
            </FormSection>
        </div>
    );
};

export default ConsumerInputs;