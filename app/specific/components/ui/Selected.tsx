import { type FC } from 'react';

const Selected: FC<{ element: { id: string, name: string, code: string }, onClick: (a: unknown) => void }> = ({ element, onClick }) => {
    return <div
        onClick={onClick}
        className={`dark:bg-neutral-700/90 bg-neutral-100
    text-neutral-900 dark:text-neutral-100
    cursor-pointer
    hover:bg-secondary
    dark:hover:bg-darkmode-secondary-accent
rounded-md px-3 py-1 text-sm flex flex-row items-center`}>
        {element.name} <span className='text-xs'>
            <i className='fa-solid fa-circle-small mx-1 dark:text-neutral-800 text-neutral-300' />
            <span className='font-semibold tracking-wider'>{element.code}</span>
        </span>
    </div>
}

export default Selected;