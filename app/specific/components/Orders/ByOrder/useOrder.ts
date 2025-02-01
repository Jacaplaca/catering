import { type UpdateMessageType } from '@root/app/hooks/useMessage';
import getDeadlinesStatus from '@root/app/specific/lib/getDeadlinesStatus';
import { api } from '@root/app/trpc/react';
import { MealType, type OrderForEdit, type OrdersCustomTable } from '@root/types/specific';
import { format } from 'date-fns-tz';
import { type Session } from 'next-auth';
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

const defaultStandards = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
}

const defaultDiet = {
    breakfast: [],
    lunch: [],
    dinner: [],
} as { breakfast: string[], lunch: string[], dinner: string[] };

const useOrder = ({ orderForEdit, setRows, session, updateMessage, newOrder, clientId }: {
    orderForEdit?: OrderForEdit,
    newOrder: boolean,
    setRows: Dispatch<SetStateAction<OrdersCustomTable[]>>,
    session: Session | null,
    dictionary: Record<string, string>,
    updateMessage: UpdateMessageType,
    resetMessage: () => void,
    clientId?: string,
}) => {
    const isClient = session?.user.roleId === 'client';
    const utils = api.useUtils();
    const [error, setError] = useState<string | null>(null);
    const [day, setDay] = useState<{ year: number, month: number, day: number } | null>(null);
    const [consumersPickerOpen, setConsumersPickerOpen] = useState<MealType | null>(null);

    const [standards, setStandards] = useState(defaultStandards);
    const [diet, setDiet] = useState(defaultDiet);

    useEffect(() => {
        if (orderForEdit) {
            setStandards(orderForEdit.standards);
            setDiet(orderForEdit.diet);
            setDay(orderForEdit.day);
        }
    }, [orderForEdit]);

    const resetError = () => {

        setError(null);
    }

    const resetOrder = () => {
        setStandards(orderForEdit?.standards ?? defaultStandards);
        setDiet(orderForEdit?.diet ?? defaultDiet);

        // setDay(orderForEdit?.day ?? null);
        resetError();
    }


    const updateStandards = (meal: MealType, value: number) => {
        setStandards(prev => ({ ...prev, [meal]: Math.max(0, value) }));
        resetError();
    }

    const updateDiet = (meal: MealType, value: string[]) => {
        setDiet(prev => ({ ...prev, [meal]: value }));
        resetError();
    }

    const updateDay = (value: { year: number, month: number, day: number }) => {
        setDay(value);
        resetError();
    }

    const copyDietsFrom = (meal: MealType) => {
        resetError();
        if (meal === MealType.Lunch) {
            setDiet(prev => ({ ...prev, lunch: prev.breakfast }));
        } else if (meal === MealType.Dinner) {
            setDiet(prev => ({ ...prev, dinner: prev.lunch }));
        }
    }

    const copyStandardsFrom = (meal: MealType) => {
        resetError();
        if (meal === MealType.Lunch) {
            setStandards(prev => ({ ...prev, lunch: prev.breakfast }));
        } else if (meal === MealType.Dinner) {
            setStandards(prev => ({ ...prev, dinner: prev.lunch }));
        }
    }

    const { data: cateringSettings } = api.specific.settings.get.useQuery();
    const { data: orderedDates } = api.specific.order.orderedDates.useQuery({ clientId: clientId ?? '' }, { enabled: isClient && !!clientId });
    const { data: lastOrder } = api.specific.order.last.useQuery({ clientId: clientId ?? '' }, { enabled: newOrder && isClient && !!clientId });

    useEffect(() => {
        if (lastOrder && newOrder) {
            const { standards, diet } = lastOrder;
            setStandards(standards);
            setDiet(diet);
        }
    }, [lastOrder, newOrder]);

    const getNextAvailableDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDate = new Date(today);

        if (cateringSettings && orderedDates) {

            while (true) {
                const formattedDate = format(currentDate, 'yyyy-MM-dd');
                if (!orderedDates.includes(formattedDate)) {
                    const day = {
                        year: currentDate.getFullYear(),
                        month: currentDate.getMonth(),
                        day: currentDate.getDate()
                    }
                    const { first: firstDeadline } = getDeadlinesStatus({
                        settings: cateringSettings,
                        day
                    });

                    if (firstDeadline.canOrder) {
                        setDay(day);
                        break;
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else {
            setDay({
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
                day: currentDate.getDate()
            });
        }
    }

    const clearOrder = () => {
        getNextAvailableDate();
    }

    const deadlines = getDeadlinesStatus({ settings: cateringSettings, day });

    const updateRow = async (id: string) => {
        const updatedOrder = await utils.specific.order.forTable.fetch({ id });
        if (updatedOrder) {
            setRows(prev => prev.map(row => row.id === updatedOrder.id ? updatedOrder : row));
            await utils.specific.order.forEdit.invalidate({ id });
            await utils.specific.order.orderedDates.refetch();
        }
    }

    const saveDraft = api.specific.order.saveDraft.useMutation({

        onSuccess: async () => {
            if (orderForEdit) {
                await updateRow(orderForEdit.id);
            } else {
                await utils.specific.order.table.refetch();
                await utils.specific.order.count.refetch();
            }
            updateMessage('saved');
            resetError();
        },

        onError: (error) => {
            setError(error.message);
        },
    });

    const place = api.specific.order.place.useMutation({
        onSuccess: async () => {
            if (orderForEdit) {
                await updateRow(orderForEdit.id);
            } else {
                await utils.specific.order.orderedDates.refetch();
                await utils.specific.order.table.refetch();
                await utils.specific.order.count.refetch();
            }
            updateMessage('saved');
            resetError();
        },

        onError: (error) => {
            setError(error.message);
        },
    });

    const order = {
        standards,
        diet,
        day: day ?? { year: 0, month: 0, day: 0 },
        id: orderForEdit?.id,
        clientId: clientId ?? '',
    }


    const onSubmitDraft = () => {
        saveDraft.mutate(order);
        updateMessage('saving');
    };

    const onSubmitPlace = () => {
        place.mutate(order);
        updateMessage('saving');
    };

    return {

        standards,
        diet,
        day,
        updateStandards,
        updateDiet,
        updateDay,
        copyDietsFrom,
        copyStandardsFrom,
        deadlines,
        settings: cateringSettings,
        onSubmitDraft,
        savingDraft: saveDraft.isPending,
        reset: resetOrder,
        onSubmitPlace,
        placing: place.isPending,
        error,
        orderedDates,
        clearOrder,
        consumerPicker: {
            open: consumersPickerOpen,
            setOpen: setConsumersPickerOpen,
            close: () => setConsumersPickerOpen(null),
        },
        lastOrder,
    }



}

export default useOrder;