import { type MessageStatusType } from '@root/app/_components/ui/form/Message';
import translate from '@root/app/lib/lang/translate';
import { useEffect, useState, useRef, useCallback } from 'react';

export type PredefinedMessageType = 'saving' | 'saved' | 'removed' | 'removing' | 'error';

export type UpdateMessageType = (messageObj: { content: string, status: MessageStatusType, timeout?: number, spinner?: boolean } | PredefinedMessageType) => void;

const useMessage = (dictionary: Record<string, string>) => {
    const [messageObj, setMessageObj] = useState<
        { content: string, status: MessageStatusType, timeout?: number } | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messageIdRef = useRef<number>(0);

    const resetMessage = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setMessageObj(null);
    }, []);

    const updateMessage: UpdateMessageType = useCallback((messageObj: { content: string, status: MessageStatusType, timeout?: number, spinner?: boolean } | PredefinedMessageType) => {
        const predefinedMessages = {
            saving: { content: translate(dictionary, 'shared:saving'), status: 'info', spinner: true },
            removing: { content: translate(dictionary, 'shared:removing'), status: 'info', spinner: true },
            saved: { content: translate(dictionary, 'shared:saved_successfully'), status: 'success', timeout: 5000 },
            removed: { content: translate(dictionary, 'shared:removed'), status: 'success', timeout: 5000 },
            error: { content: translate(dictionary, 'shared:error'), status: 'error', timeout: 5000 },
        } as Record<PredefinedMessageType, { content: string, status: MessageStatusType, timeout?: number, spinner?: boolean }>
        resetMessage();

        const newMessageId = ++messageIdRef.current;
        const newMessage = typeof messageObj === 'string' ? predefinedMessages[messageObj] : messageObj;

        setMessageObj(newMessage);

        if (newMessage.timeout) {
            timeoutRef.current = setTimeout(() => {
                if (newMessageId === messageIdRef.current) {
                    resetMessage();
                }
            }, newMessage.timeout);
        }
    }, [resetMessage, dictionary]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { messageObj, resetMessage, updateMessage };
}

export default useMessage;
