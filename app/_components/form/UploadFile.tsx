'use client';
import { type FunctionComponent, useRef, useState } from "react";
import Image from 'next/image';
import useUpload from '@root/app/hooks/useUpload';
import ProgressBar from '@root/app/_components/ui/ProgressBar';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import translate from '@root/app/lib/lang/translate';


const UploadFile: FunctionComponent<{
    dictionary: Record<string, string>;
    prefix: string;
    multiple?: boolean;
    onUploadComplete: ({ key, fileName }: { key: string; fileName: string; }) => void;
}> = ({ prefix, multiple = false, dictionary, onUploadComplete }) => {
    const ref = useRef<HTMLInputElement>(null);
    const chooseFilesLabel = translate(dictionary, multiple ? "shared:choose_files" : "shared:choose_file")
    const uploadFilesLabel = translate(dictionary, multiple ? "shared:upload_files" : "shared:upload_file")
    const {
        previewAttachments,
        onFilesChange,
        onSubmit,
        onFileRemove,
        totalProgressPercent,
        uploading,
    } = useUpload(prefix, onUploadComplete);

    const [showProgressBar, setShowProgressBar] = useState(false)

    const imagesToUpload = Object.values(previewAttachments).length

    const disabled = multiple ? true : imagesToUpload >= 1

    const addToPreviewAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilesChange(e)
    }

    const handleSubmit = async () => {
        setShowProgressBar(true)
        await onSubmit()
        setShowProgressBar(false)
    }


    return (
        <div>
            {showProgressBar && <ProgressBar
                size={'xl'}
                progress={Math.round(totalProgressPercent)}
                labelText={false}
            />}
            <div>{Object.values(previewAttachments).map(p => <div key={p.file.name}>
                <button onClick={() => { onFileRemove(p.file.name) }}>
                    {p.file.name} {p.file.size}
                </button>

            </div>)}</div>
            <input
                ref={ref}
                className="hidden"
                type="file"
                multiple={multiple}
                onChange={addToPreviewAttachments}
            />
            <div className="mt-3.5 flex items-start gap-4 w-fit">
                <MyButton
                    id='choose-files'
                    ariaLabel='Choose files'
                    icon='fas fa-image'
                    disabled={disabled}
                    onClick={() => ref.current?.click()}
                >
                    {chooseFilesLabel}
                </MyButton>
                <MyButton
                    id='upload-files'
                    ariaLabel='Upload files'
                    icon='fas fa-cloud-arrow-up'
                    disabled={!imagesToUpload}
                    className="ml-auto"
                    onClick={handleSubmit}
                    loading={uploading}
                >
                    {uploadFilesLabel}
                </MyButton>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                {Object.values(previewAttachments).map((p) => (
                    <div key={p.file.name} className="relative">
                        {p.file.type.startsWith('image/') ? (
                            <Image
                                src={URL.createObjectURL(p.file)}
                                alt={p.file.name}
                                width={200}
                                height={200}
                                className="object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                                <span className="text-gray-500">{p.file.name}</span>
                            </div>
                        )}
                        <button
                            onClick={() => onFileRemove(p.file.name)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadFile;
