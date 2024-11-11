'use client';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import useKeyPressed from '@root/app/hooks/useKeyPressed';
import { useState, useEffect, type FunctionComponent } from 'react';

const PageNumberInput: FunctionComponent<{
    redirect: (page: number) => void;
    currentPage: number;
    totalPages: number;
}> = ({ redirect, currentPage, totalPages }) => {
    const { keyPressed } = useKeyPressed();
    const [inputValue, setInputValue] = useState(1);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        const valueNo = parseInt(value, 10);
        if (valueNo > totalPages) {
            setInputValue(totalPages);
            return;
        }

        if (valueNo < 1) {
            setInputValue(1);
            return;
        }

        setInputValue(valueNo);
    };

    useEffect(() => {
        setInputValue(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (keyPressed === 'Enter') {
            redirect(inputValue);
        } else if (keyPressed === 'Escape') {
            setInputValue(currentPage);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyPressed]);

    const onFocus = (isFocused: boolean) => {
        if (!isFocused) {
            setInputValue(currentPage);
        }
    };

    return (
        <InputStandard
            type='number'
            id='page'
            onChange={handleChange}
            className='w-16 text-center'
            value={inputValue.toString()}
            focus={onFocus}
        />
    );
};



export default PageNumberInput;