import translate from '@root/app/lib/lang/translate';
import { type RefObject, type FunctionComponent, type ReactNode } from 'react';

export type ListWrapperProps = {
    children: ReactNode[]
    parentRef: RefObject<HTMLDivElement>
    totalHeight: number
    isEmpty: boolean
    isLoading: boolean
    dictionary: Record<string, string>
    maxHeight?: number
}

const ListWrapper: FunctionComponent<ListWrapperProps> = ({ children, parentRef, totalHeight, isEmpty, isLoading, dictionary, maxHeight = 340 }) => {
    return <div
        ref={parentRef}
        className={`min-h-[50px] w-auto overflow-auto rounded-md`}
        style={{ maxHeight: `${maxHeight}px` }}
    >
        <div
            style={{ height: `${totalHeight}px` }}
            className="w-full relative"
        >
            {children}
        </div>
        {isEmpty && <div className={`flex items-center justify-center w-full min-h-[50px]
        dark:border-neutral-700
        `}>
            {(isLoading && isEmpty) && <i className={`animate-spin fas fa-spinner`}></i>}
            {(isEmpty && !isLoading) && <p className="p-2 font-semibold text-center">
                {translate(dictionary, 'shared:no_results')}
            </p>}
        </div>}
    </div>
}

export default ListWrapper;