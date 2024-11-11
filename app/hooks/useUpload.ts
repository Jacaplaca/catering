import { useState } from "react";
import axios, { type AxiosProgressEvent } from 'axios';
import { v4 as uuidV4 } from "uuid";
import mapSeries from '@root/app/lib/mapSeries';
import { api } from '@root/app/trpc/react';

type Progress = Record<string, { loaded: number, fileSize: number }>;

export type AttachmentType = {
    id: string;
    postId: string;
    fileId: string;
    createdAt: Date;
    file: {
        id: string;
        url: string;
        type: string;
        mime: string;
        name: string;
        extension: string;
        size: number;
        height: null;
        width: null;
        createdAt: Date;
    };
};

export type FileAndAttachment = { file: File; attachment: AttachmentType };

const useUpload = (prefix: string, onUploadComplete: ({ key, fileName }: { key: string, fileName: string }) => void) => {
    const [previewAttachments, setPreviewAttachments] = useState<
        Record<string, FileAndAttachment>
    >({});
    const [totalSize, setTotalSize] = useState<number>(0);
    const [progress, setProgress] = useState<Progress>({});
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);

    const presignedUrls = api.aws.createPresignedUrls.useQuery(
        {
            count: Object.keys(previewAttachments).length,
            prefix,
        },
        {
            enabled: Object.keys(previewAttachments).length > 0,
        }
    );

    const onFileRemove = (fileName: string) => {
        if (previewAttachments[fileName]) {
            const obj = previewAttachments[fileName] || { file: { size: 0 } };
            setTotalSize((prevTotalSize) => {
                return prevTotalSize - obj.file.size;
            });
            setPreviewAttachments((prevPreviewAttachments) => {
                const newPreviewAttachments = { ...prevPreviewAttachments };
                delete newPreviewAttachments[fileName];
                return newPreviewAttachments;
            });
        }
    }

    const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProgress({});
        setUploadComplete(false);
        setTotalSize(0);
        if (e.target.files) {
            const newPreviewAttachments = {} as Record<string, FileAndAttachment>;

            for (const file of e.target.files) {

                const attachment = {
                    id: uuidV4(),
                    postId: uuidV4(),
                    fileId: uuidV4(),
                    createdAt: new Date(),
                    file: {
                        id: uuidV4(),
                        type: '',
                        url: URL.createObjectURL(file),
                        mime: file.type,
                        name: file.name,
                        extension: file.name.split(".").pop() ?? "",
                        size: file.size,
                        height: null,
                        width: null,
                        createdAt: new Date(),
                    },
                };
                newPreviewAttachments[attachment.file.name] = { attachment, file };
            }

            setTotalSize((prevTotalSize) => {
                return prevTotalSize + Object.values(newPreviewAttachments).reduce(
                    (acc, { file }) => acc + file.size, 0);
            });

            setPreviewAttachments((prevPreviewAttachments) => ({
                ...prevPreviewAttachments,
                ...newPreviewAttachments
            }));
        }
    };

    const onSubmit = async () => {

        if (presignedUrls.data && Object.keys(previewAttachments).length === presignedUrls.data.length) {
            const urls = presignedUrls.data;
            console.log("onSubmit - urls", urls);
            setUploading(true);
            await mapSeries(Object.values(previewAttachments), async (fileAttach, index) => {
                const file = fileAttach.file;
                const url = urls[index]?.url;
                const key = urls[index]?.key;
                if (!url || !key) {
                    return Promise.resolve();
                }
                const options = {
                    headers: {
                        'Content-Type': file.type
                    },
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        if (progressEvent.total) {
                            console.log({ file: file.name, loaded: progressEvent.loaded, total: progressEvent.total });

                            setProgress((prevProgress) => ({
                                ...prevProgress,
                                [file.name]: {
                                    loaded: progressEvent.loaded,
                                    fileSize: progressEvent.total ?? file.size,
                                }
                            }));
                        }
                    },
                };

                const uploadedResult = await axios.put(url, file, options);
                if (uploadedResult.status === 200) {
                    onUploadComplete({ key, fileName: file.name });
                }
            });
            setUploading(false);
            setUploadComplete(true);
            setProgress({});
            setPreviewAttachments({});

        }

    }

    const totalLoaded = uploadComplete
        ? totalSize
        : Object.values(progress).reduce((acc, { loaded }) => {
            return acc + loaded;
        }, 0)

    const totalProgressPercent = uploadComplete
        ? 100
        : isNaN(totalLoaded / totalSize * 100)
            ? 0
            : totalLoaded / totalSize * 100;

    return {
        previewAttachments,
        totalSize,
        progress,
        uploading,
        uploadComplete,
        onFilesChange,
        onSubmit,
        onFileRemove,
        totalLoaded,
        totalProgressPercent,
        setPreviewAttachments,
        presignedUrls,
        setUploadComplete
    };

}

export default useUpload;