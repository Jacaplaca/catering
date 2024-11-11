import { api } from '@root/app/trpc/react';
import { useState } from 'react';

const useTags = ({
    tagsLocal,
    setTagsLocal,
}: {
    tagsLocal: string[],
    setTagsLocal: (hashtags: string[]) => void
}) => {

    const [searchValue, setSearchValue] = useState<string>('');

    const addTag = (hashtagName: string) => {
        setTagsLocal([...tagsLocal, hashtagName]);
        return true;
    };

    const removeTag = (hashtagName: string) => {
        setTagsLocal(tagsLocal.filter((hashtag) => hashtag !== hashtagName));
        return true;
    }

    const { data: searchResults = [], isFetching: isSearching }
        = api.specific.tag.getMany.useQuery({ name: searchValue, type: 'client' }, {
            enabled: searchValue.length > 0,
        });

    const searchTags = (value: string) => {
        setSearchValue(value);
    }

    return {
        searchValue,
        tagsLocal,
        searchResults,
        isSearching,
        addTag,
        removeTag,
        searchTags
    };

}

export default useTags;