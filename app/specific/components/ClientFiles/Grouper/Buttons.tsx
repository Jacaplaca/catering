import Buttons from '@root/app/_components/ui/form/Buttons';
import translate from '@root/app/lib/lang/translate';
import { useClientFilesTableContext } from '@root/app/specific/components/ClientFiles/context';
import { type FC } from 'react';

const SaveGroupFilesButtons: FC = () => {
    const {
        dictionary,
        uploadFiles: {
            setUploadInProgressTrue,
            setUploadInProgressFalse,
        },
        grouper: { savingDisabled, reset, upload, fileTypeOpened, clientsPicked }
    } = useClientFilesTableContext();

    const submit = async () => {
        if (clientsPicked[0]?.id && fileTypeOpened) {
            setUploadInProgressTrue(clientsPicked[0]?.id, fileTypeOpened);
            await upload.onSubmit();
            upload.setUploadComplete(false);
            setUploadInProgressFalse();
        }
    };

    return <Buttons
        submitLabel={translate(dictionary, 'shared:save')}
        submitDisabled={savingDisabled}
        onSubmit={submit}
        onCancel={reset}
        cancelLabel={translate(dictionary, 'shared:reset')}
    />
}

export default SaveGroupFilesButtons;