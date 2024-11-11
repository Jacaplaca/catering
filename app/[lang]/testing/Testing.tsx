'use client';
import { type FunctionComponent, useRef, useState } from "react";
import { api } from '@root/app/trpc/react';
import { Button } from 'flowbite-react';
import Image from 'next/image';
import useUpload from '@root/app/hooks/useUpload';
import ProgressBar from '@root/app/_components/ui/ProgressBar';


const Testing: FunctionComponent<{
    dictionary: Record<string, string>;
}> = ({ }) => {
    const ref = useRef<HTMLInputElement>(null);
    const [prefix, setPrefix] = useState<string>("");

    const {
        previewAttachments,
        totalSize,
        // progress,
        uploading,
        uploadComplete,
        onFilesChange,
        onSubmit,
        onFileRemove,
        totalLoaded,
        totalProgressPercent
    } = useUpload(prefix, (p) => {
        console.log('Progress', p);
    });

    const [tempPrefix, setTempPrefix] = useState<string>("");

    const files = api.aws.getFiles.useQuery({
        prefix,
    });

    const keys = api.aws.getKeys.useQuery({
        prefix,
    });

    // const tree = api.aws.getTree.useQuery({
    //     prefix,
    // });



    const deleteFile = api.aws.deleteFiles.useMutation({
        onSuccess: async () => {
            await files.refetch();
            console.log("🚀 ~ deleteFile ~ onSuccess")
        },
        onError: () => {
            console.log("🚀 ~ deleteFile ~ onError")
        },
    });

    const deleteBucket = api.aws.deleteBucket.useMutation({
        onSuccess: () => {
            console.log("🚀 ~ deleteBucket ~ onSuccess")
        },
        onError: () => {
            console.log("🚀 ~ deleteBucket ~ onError")
        },
    });




    return (
        <div>
            <ProgressBar
                size={'xl'}
                progress={Math.round(totalProgressPercent)}
                // progress={85}
                labelText={false}
            />
            <div>Total size: {totalSize}</div>
            <div>Uploading: {uploading ? "Yes" : "No"}</div>
            <div>Upload complete: {uploadComplete ? "Yes" : "No"}</div>
            <div>Total loaded: {totalLoaded}</div>
            <div>Total progress percent: {totalProgressPercent}</div>
            <div>{Object.values(previewAttachments).map(p => <div key={p.file.name}>
                <button onClick={() => { onFileRemove(p.file.name) }}>
                    {p.file.name} {p.file.size}
                </button>

            </div>)}</div>
            <Image
                width={200}
                height={200}
                alt="file"
                src={"/file"} />
            <div className=''>
                <h1>Prefix {prefix}</h1>
                <div className='flex'>
                    <input
                        type="text"
                        value={tempPrefix}
                        onChange={(e) => setTempPrefix(e.target.value)}
                        className="ml-3 p-1 text-gray-950 text-xl font-bold"
                    />
                    <Button
                        onClick={() => setPrefix(tempPrefix)}
                        className="ml-3"
                    >Change Prefix</Button>
                </div>

            </div>
            To upload {Object.keys(previewAttachments).length}
            <br />
            {/* Uploaded {upload.length} */}
            <div className="mt-3.5 flex items-start">
                <input
                    ref={ref}
                    className="hidden"
                    type="file"
                    multiple
                    onChange={onFilesChange}
                />
                <Button
                    color="secondary"
                    // iconOnly
                    onClick={() => ref.current?.click()}
                >
                    {/* <PhotoIcon width={20} height={20} /> */}
                    Upload
                </Button>
                <Button
                    // disabled={isDisabled}
                    className="ml-auto"
                    onClick={() => void onSubmit()}
                >
                    Post
                </Button>
                <Button
                    // disabled={isDisabled}
                    className="ml-auto"
                    onClick={() => void deleteFile.mutate({ key: "f99cc58d-3586-4ab2-89c5-de335141c91e" })}
                >
                    Delete
                </Button>
                <Button
                    // disabled={isDisabled}
                    className="ml-auto"
                    onClick={() => void deleteBucket.mutate({ prefix })}
                >
                    Delete Bucket
                </Button>
            </div>
            <div className={'flex'}>
                {keys.data?.map((key) => (
                    <div key={key}
                        className="m-2 cursor-pointer"
                        onClick={() => void deleteFile.mutate({ key })}
                    >
                        <Image
                            width={200}
                            height={200}
                            src={`/file/${key}`} alt={key} />
                    </div>
                ))}

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

export default Testing;
