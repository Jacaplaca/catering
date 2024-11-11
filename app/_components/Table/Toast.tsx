import Message, { type MessageStatusType } from '@root/app/_components/ui/form/Message';
import { type FunctionComponent } from "react";

const TableToast: FunctionComponent<{
    message?: { content: string, status: MessageStatusType, spinner?: boolean } | null,
    onClose: () => void
}> = ({ message, onClose }) => {

    return <Message
        show={!!message}
        status={message?.status}
        message={message?.content}
        loading={message?.spinner}
        className='my-6 fixed top-40 left-1/2 -translate-x-1/2 w-fit z-50'
        onClose={onClose}
        animate='slideInTop'
        textSize='2xl'
    />
}

export default TableToast;