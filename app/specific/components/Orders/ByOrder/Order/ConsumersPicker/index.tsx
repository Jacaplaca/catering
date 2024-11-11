import translate from '@root/app/lib/lang/translate';
import { useOrderTableContext } from '@root/app/specific/components/Orders/ByOrder/context';
import useConsumersPick from '@root/app/specific/components/Orders/ByOrder/Order/ConsumersPicker/useConsumersPick';
import PickerFromAll from '@root/app/specific/components/ui/PickerFromAll';
import Selected from '@root/app/specific/components/ui/Selected';
import { MealType } from '@root/types/specific';

type ConsumersPickerProps = {
    onResultClick: (id: string | null, allItems: { id: string, name: string }[]) => void,
    mealType: MealType,
}

const ConsumersPicker: React.FC<ConsumersPickerProps> = ({
    onResultClick,
    mealType,
}) => {

    const {
        dictionary,
        order: {
            diet,
            updateDiet,
            deadlines: { isBetween },
            consumerPicker: {
                setOpen: setConsumersPickerOpen,
            }
        },
        rowClick: {
            orderForEdit
        }
    } = useOrderTableContext();

    const updateSelected = (ids: string[]) => {
        updateDiet(mealType, ids);
    }

    const onBack = () => {
        setConsumersPickerOpen(null);
    }

    const selectedConsumers = diet[mealType];
    const consumersBeforeDeadline = orderForEdit?.dietBeforeDeadline?.[mealType as keyof typeof orderForEdit.dietBeforeDeadline] ?? [];


    const getSelectedLabel = () => {
        switch (mealType) {
            case MealType.Breakfast:
                return 'orders:selected_breakfasts';
            case MealType.Lunch:
                return 'orders:selected_lunches';
            case MealType.Dinner:
                return 'orders:selected_dinners';
            default:
                return 'orders:selected_consumers';
        }
    }

    const getTitle = () => {
        switch (mealType) {
            case MealType.Breakfast:
                return 'orders:select_dietary_breakfasts';
            case MealType.Lunch:
                return 'orders:select_dietary_lunches';
            case MealType.Dinner:
                return 'orders:select_dietary_dinners';
            default:
                return 'orders:select_dietary_meals';
        }
    }

    const {
        searchConsumers,
        selectedItems,
        allItems,
        searchValue,
        filteredItems,
        selectAll,
        deselectAll,
    } = useConsumersPick({
        selectedIds: selectedConsumers,
        allowedIds: isBetween ? consumersBeforeDeadline : undefined,
        updateSelected
    });

    if (!allItems) return null;

    return (
        <div className={`w-full 
        border-[1px] border-neutral-200 dark:border-neutral-700 
        rounded-md p-4`}>
            <div className='flex flex-row gap-12 mb-4'>
                <button onClick={onBack}><i
                    className={`fa-solid fa-chevron-left
                    px-3 py-2
                    hover:bg-secondary dark:hover:bg-darkmode-secondary-accent
                    rounded-md
                    `}
                /></button>
                <div className='font-semibold text-lg'>{translate(dictionary, getTitle())}</div>
            </div>

            <div className='flex flex-row gap-4 h-[370px] '>

                <div className='flex flex-col gap-2 w-2/5 px-2'>
                    <PickerFromAll
                        dictionary={dictionary}
                        selected={selectedConsumers}
                        onSelect={onResultClick}
                        items={filteredItems}
                        search={searchConsumers}
                        value={searchValue}
                        selectAll={selectAll}
                        deselectAll={deselectAll}
                        searchPlaceholder='orders:search_consumer_placeholder'
                        notFoundLabel='orders:dietary_consumers_not_found'
                    />
                </div >

                {selectedItems.length > 0 ? <div className="w-3/5 flex flex-col px-2">
                    <div className='flex flex-row justify-start items-center mb-2 '>
                        <div className="font-semibold">
                            {translate(dictionary, getSelectedLabel())}
                        </div>
                        <div className='text-sm font-semibold ml-2'>
                            {selectedItems.length}
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <div className="flex flex-wrap gap-2 justify-stretch">
                            {selectedItems.map((consumer) => (
                                <Selected
                                    key={consumer.id}
                                    element={consumer}
                                    onClick={() => onResultClick(consumer.id, allItems)}
                                />
                            ))}
                        </div>
                    </div>
                </div> : <div className='flex w-3/5 flex-col justify-center items-center h-full'>
                    <i className='fa-solid fa-plate-utensils text-4xl text-neutral-400' />
                </div>}
            </div>

        </div>


    );
}

export default ConsumersPicker;