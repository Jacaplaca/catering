'use client';
import UploadFile from '@root/app/_components/form/UploadFile';
import getSettingsClient from '@root/app/lib/settings/getSettingsClient';
import { api } from '@root/app/trpc/react';
import { type logoUploadValid } from '@root/app/validators/specific/media';
import { useEffect, useState, type FunctionComponent, } from "react";
import { type z } from 'zod';


const LogoUpload: FunctionComponent<{
    dictionary: Record<string, string>;
    mode: z.infer<typeof logoUploadValid>['mode']
}> = ({ dictionary, mode }) => {

    const [prefix, setPrefix] = useState<string | undefined>(undefined)

    const { data: settings } = getSettingsClient('s3-prefix')

    useEffect(() => {
        if (settings) {
            setPrefix(settings.logo as string)
        }
    }, [settings])


    const uploadLogo = api.specific.media.logoUpload.useMutation({
        onSuccess: (got) => {
            console.log(got);
        },
        onError: (error) => {
            console.log(error.data, error.message, error.shape);
        }
    });

    const onUploadComplete = ({ key, fileName }: { key: string; fileName: string; }) => {
        console.log("Upload complete", key, fileName)
        uploadLogo.mutate({
            key,
            mode
        })
    }

    if (!prefix) return null

    return (
        <UploadFile
            dictionary={dictionary}
            onUploadComplete={onUploadComplete}
            prefix={prefix}
            multiple={false}
        />
    );
};

export default LogoUpload;
