import MainModal from '@root/app/_components/Modals/MainModal';
import translate from '@root/app/lib/lang/translate';
import { type FunctionComponent } from 'react';

const ConfirmationModal: FunctionComponent<{
    question: string
    isModalOpen: boolean
    hide: (value: boolean) => void
    confirmAction: () => void
    dictionary: Record<string, string>
}> = ({
    question,
    isModalOpen,
    hide,
    confirmAction,
    dictionary
}) => {
        return (
            <div>
                <MainModal
                    isOpen={isModalOpen}
                    closeModal={() => hide(false)}
                    header={<div>{question}</div>}
                >
                    <div className="flex justify-center gap-6">
                        <button
                            className="w-20 button font-bold py-2 px-4 rounded gap-2"
                            onClick={() => {
                                hide(false);
                                confirmAction();
                            }}
                        ><i className='fas fa-check text-lg' />
                            <div>
                                {translate(dictionary, 'shared:yes')}
                            </div>
                        </button>
                        <button
                            onClick={() => hide(false)}
                            className="w-20 button bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-100 hover:dark:bg-zinc-700/80 font-bold py-2 px-4 rounded gap-2"
                        ><i className='fas fa-times text-lg' />
                            <div>
                                {translate(dictionary, 'shared:no')}
                            </div>
                        </button>
                    </div>
                </MainModal>
            </div>
        );
    };

export default ConfirmationModal;