import { type FunctionComponent } from 'react';

const Or: FunctionComponent<{ label: string }> = ({ label }) => {
    return (
        <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
            {label}
        </div>
    )
}

export default Or;