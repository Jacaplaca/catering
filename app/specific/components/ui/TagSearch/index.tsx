import SearchWithResults from '@root/app/_components/ui/Inputs/SearchWithResults';
import ListWrapper from '@root/app/_components/ui/Inputs/SearchWithResults/ListWrapper';
import useVirtualizedList from '@root/app/hooks/useVirtualizedListl';
import translate from '@root/app/lib/lang/translate';
import { api } from '@root/app/trpc/react';
import { useRef, useState, type FunctionComponent } from "react";
import Item from '@root/app/_components/ui/Inputs/SearchWithResults/Item';
import FoundResults from '@root/app/_components/ui/Inputs/SearchWithResults/Found';

const ITEMS_PER_PAGE = 20;

const TagSearch: FunctionComponent<{
    dictionary: Record<string, string>;
    updateTagId: (id: string) => void;
}> = ({ dictionary, updateTagId }) => {
    const tagsRef = useRef<HTMLDivElement>(null);

    const [tagSearchValue, setTagSearch] = useState<string>('');
    const [tagForFilter, setTagForFilter] = useState<{ id: string, name: string } | null>(null);

    const searchTags = (value: string) => {
        setTagSearch(value);
    }

    const clearSearchResult = () => {
        setTagForFilter(null);
        updateTagId('');
    }

    const response = api.specific.tag.getInfinite.useInfiniteQuery(
        {
            limit: ITEMS_PER_PAGE,
            name: tagSearchValue,
            type: 'client',
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    function searchByTag(id: string | null) {
        updateTagId(id ?? '');
        setTagForFilter(allItems.find(item => item.id === id) ?? null)
    }

    const { rowVirtualizer, items, isLoading, isEmpty, allItems } = useVirtualizedList<{ id: string, name: string }>({
        ...response,
        parentRef: tagsRef,
        Item,
        onResultClick: searchByTag,
        searchValue: tagSearchValue
    });

    return (
        <SearchWithResults
            dictionary={dictionary}
            ListComponent={<ListWrapper
                totalHeight={rowVirtualizer.getTotalSize()}
                parentRef={tagsRef}
                isEmpty={isEmpty}
                isLoading={isLoading}
                dictionary={dictionary}
            >
                {items}
            </ListWrapper>
            }
            placeholder={translate(dictionary, 'shared:search_with_tag')}
            FoundComponent={<FoundResults
                clearValue={clearSearchResult}
                value={tagForFilter?.name ?? ''}
            />}
            onSearch={searchTags}
        />
    )
}

export default TagSearch;