import HighlightText from '@root/app/_components/Table/HighlightText';
import formatFileSize from '@root/app/specific/lib/formatFileSize';
import React from 'react';

interface FileListProps {
    files: File[];
    removeFile: (fileName: string) => void;
    removeAll: () => void;
    removeAllLabel?: string;
}

const FileList: React.FC<FileListProps> = ({ files, removeFile, removeAll, removeAllLabel }) => {
    const fileList = files.map(file => (
        <li key={file.name} className="flex gap-2 items-center mb-2">
            <i
                className='fa-solid fa-xmark text-red-500 cursor-pointer hover:text-red-700 transition-colors'
                onClick={() => removeFile(file.name)}
            />
            {/* <span className="text-sm">{file.name}</span> */}
            <span className="text-sm"><HighlightText
                limit={25}
                className={`text-sm`}
                text={file.name}
            /></span>
            <span className="text-xs font-bold">{formatFileSize(file.size)}</span>
        </li>
    ));

    return (
        <aside>
            <ul className="flex flex-col">{fileList}</ul>
            {files.length > 1 && removeAllLabel && (
                <button onClick={removeAll}
                    className={`mt-2 gap-2 flex items-center 
                    text-red-600 hover:text-red-700
                    dark:text-red-400 dark:hover:text-red-500
                    `}>
                    <i className='fa-solid fa-trash-can' />
                    <span>{removeAllLabel}</span>
                </button>
            )}
        </aside>
    );
};

export default FileList;