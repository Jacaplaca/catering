import { api } from '@root/app/trpc/react';
import { useEffect, useState } from 'react';

const useConsumersPick = ({
    selectedIds,
    updateSelected,
    allowedIds,
    clientId
}: {
    selectedIds: string[],
    updateSelected: (ids: string[]) => void,
    allowedIds?: string[],
    clientId?: string,
}) => {

    const [selectedItems, setSelectedItems] = useState<{ id: string, name: string, code: string }[]>([]);

    const [inputValue, setInputValue] = useState<string>('');
    const { data: allItems, isLoading } = api.specific.consumer.dietaryAll.useQuery({ clientId: clientId ?? '' }, { enabled: !!clientId });

    const allowedItems = allowedIds ? allItems?.filter(item => allowedIds.includes(item.id)) : allItems;

    const [filteredItems, setFilteredItems] = useState<{ id: string, name: string, code: string }[]>(allowedItems ?? []);

    const searchConsumers = (value: string) => {
        setInputValue(value);
        setFilteredItems(allowedItems?.filter(item => item?.name?.toLowerCase().includes(value.toLowerCase())) ?? []);
    }

    const selectAll = () => {
        // setSelectedItems(allItems?.map(item => ({ id: item.id, name: item.name })) ?? []);
        updateSelected(allowedItems?.map(item => item.id) ?? []);
    }

    const deselectAll = () => {
        // setSelectedItems([]);
        updateSelected([]);
    }

    useEffect(() => {
        if (allowedItems) {
            const newSelectedItems = selectedIds.map(id => {
                const item = allowedItems?.find(item => item.id === id);
                return item ? { id, name: item.name, code: item.code } : { id, name: '', code: '' };
            });

            if (JSON.stringify(newSelectedItems) !== JSON.stringify(selectedItems)) {
                setSelectedItems(newSelectedItems);
            }
        }
    }, [selectedIds, allowedItems]);

    return {
        searchConsumers,
        isLoading,
        selectedItems,
        allItems,
        searchValue: inputValue,
        filteredItems,
        selectAll,
        deselectAll,
    }
}

export default useConsumersPick;