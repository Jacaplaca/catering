import FileList from '@root/app/_components/form/FileList';
import MainModal from '@root/app/_components/Modals/MainModal';
import ProgressBar from '@root/app/_components/ui/ProgressBar';
import { clientFileTypeDictionary } from '@root/app/assets/maps/catering';
import translate from '@root/app/lib/lang/translate';
import { useClientFilesTableContext } from '@root/app/specific/components/ClientFiles/context';
import SaveGroupFilesButtons from '@root/app/specific/components/ClientFiles/Grouper/Buttons';
import Week from '@root/app/specific/components/ClientFiles/Week';
import PickerFromAll from '@root/app/specific/components/ui/PickerFromAll';
import formatFileSize from '@root/app/specific/lib/formatFileSize';
import { useState } from 'react';

const MAX_FILES = 1;

const InstructionStep = ({ label, checked }: { label: string, checked: boolean }) => {
    return <div className='flex flex-row gap-2'>
        <div>{checked ? <i className="fa-solid fa-check text-green-500 dark:text-green-400" /> : <i className="fa-solid fa-check text-neutral-300 dark:text-neutral-700" />}</div>
        <div>{label}</div>
    </div>
}

const Grouper = () => {

    const {
        dictionary,
        settings,
        grouper: { isOpened,
            closeFileType,
            fileTypeOpened, pickClient, clientsPicked, allClients, selectAll, deselectAll,
            upload, dropzone, previewAttachments },
        uploadFiles: {
            uploadInProgress,
        }
    } = useClientFilesTableContext();

    const isMaxFiles = Object.keys(previewAttachments).length >= MAX_FILES

    const [searchValue, setSearchValue] = useState('');
    const [filteredClients, setFilteredClients] = useState<{ id: string, name: string, code: string }[]>([]);

    const updateSearchValue = (value: string) => {
        setSearchValue(value);
        const searchTerm = value.toLowerCase();
        const filtered = allClients?.filter(client =>
        (client?.name?.toLowerCase().includes(searchTerm) ||
            client?.code?.toLowerCase().includes(searchTerm))
        ) ?? [];
        console.log("filtered", filtered);
        setFilteredClients(filtered);
    }

    if (!isOpened || !fileTypeOpened) return null;


    return <MainModal
        width={750}
        isOpen={isOpened}
        closeModal={closeFileType}
        header={translate(dictionary, clientFileTypeDictionary[fileTypeOpened]?.tooltip)}
        footer={
            <SaveGroupFilesButtons />
        }
        footerColor={`border-t dark:border-darkmode-modal-separator border-modal-separator
        bg-neutral-200 dark:bg-neutral-700

        `}
    >
        <div className='flex flex-row gap-4 h-[500px] justify-between '>
            <div className='flex flex-col gap-2 w-3/5 px-2'>
                <PickerFromAll
                    dictionary={dictionary}
                    selected={clientsPicked.map(c => c.id)}
                    onSelect={pickClient}
                    items={filteredClients}
                    search={updateSearchValue}
                    value={searchValue}
                    selectAll={selectAll}
                    deselectAll={deselectAll}
                    searchPlaceholder='clients:info.name_placeholder'
                    notFoundLabel='clients:not_found'
                />
            </div >
            <div className='w-2/5 px-2 flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-4 justify-end'>
                    <Week disabled={true} />
                </div>
                <div className='flex flex-col text-sm gap-1'>
                    <div className='font-bold'>{translate(dictionary, 'client-files:to_assign_files')}</div>
                    <InstructionStep checked={!!clientsPicked.length} label={translate(dictionary, 'client-files:choose_clients')} />
                    <InstructionStep checked={!!Object.keys(previewAttachments).length} label={translate(dictionary, 'client-files:choose_files')} />
                    <InstructionStep checked={upload.uploading || upload.uploadComplete} label={`${translate(dictionary, 'client-files:press_button')} ${translate(dictionary, 'shared:save')}`} />
                </div>
                <div className='flex flex-col items-center gap-4 w-full'>
                    <div
                        {...(!isMaxFiles && dropzone.getRootProps({}))
                        }
                        className={'p-1'}
                    >
                        <div className={`
                flex flex-col gap-2 justify-center items-center cursor-pointer p-2 py-4
                rounded-md text-center
                bg-neutral-100 text-neutral-400
                dark:bg-neutral-700/50 dark:text-neutral-300
                border-2 border-dashed
                outline-none transition-colors duration-300
                ${dropzone.isFocused ? 'border-blue-500' : 'border-neutral-200 dark:border-neutral-600'}
                ${dropzone.isDragAccept ? 'border-green-500' : ''}
                ${dropzone.isDragReject ? 'border-red-500' : ''}
                ${(uploadInProgress ?? isMaxFiles) ? 'opacity-50 pointer-events-none' : ''}
            `}>
                            {uploadInProgress ? null : <input {...dropzone.getInputProps()} disabled={isMaxFiles} />}
                            <i className="fa-solid fa-cloud-arrow-up text-2xl" />
                            <div className='flex flex-col gap-2 text-neutral-800 dark:text-neutral-50'>
                                <div className='text-sm'>{translate(dictionary, 'shared:upload_file_dropzone_single')}</div>
                                <div className='text-xs italic'>{translate(dictionary, 'shared:max_file_size', [formatFileSize(settings.clientFiles['max-file-size'] as number)])}</div>
                            </div>
                        </div>
                    </div>
                    {uploadInProgress ?
                        <div className='p-1 px-2  w-full '>
                            <ProgressBar
                                size={'xl'}
                                progress={Math.round(upload.totalProgressPercent)}
                                labelText={false}
                            />
                        </div>
                        : <FileList
                            removeAllLabel={translate(dictionary, 'shared:remove_all')}
                            files={Object.values(upload.previewAttachments).map(fa => fa.file)}
                            removeFile={upload.onFileRemove}
                            removeAll={() => upload.setPreviewAttachments({})}
                        />}
                </div>
            </div>
        </div>
    </MainModal>
}

export default Grouper;
