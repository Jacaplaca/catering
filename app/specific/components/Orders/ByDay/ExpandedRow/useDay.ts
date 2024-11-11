import { api } from '@root/app/trpc/react';
import { useEffect, useState } from 'react';

const useDay = () => {
    const [dayId, setDayId] = useState<string | null>(null);

    const [summaryStandard, setSummaryStandard] = useState({
        breakfast: 0,
        lunch: 0,
        dinner: 0,
    });

    const [standard, setStandard] = useState<{
        breakfast: { meals: number; clientCode: string }[];
        lunch: { meals: number; clientCode: string }[];
        dinner: { meals: number; clientCode: string }[];
    }>({
        breakfast: [],
        lunch: [],
        dinner: [],
    });

    const [diet, setDiet] = useState<{
        breakfast: Record<string, { consumerCode: string, diet: string }[]>
        lunch: Record<string, { consumerCode: string, diet: string }[]>
        dinner: Record<string, { consumerCode: string, diet: string }[]>
    }>({
        breakfast: {},
        lunch: {},
        dinner: {},
    })

    const onClick = (key: string | null) => {
        setDayId(state => state === key ? null : key);
    };

    const { data: dayData, isFetching: dayFetching }
        = api.specific.order.groupedByDay.day.useQuery(
            { dayId: dayId ?? '' },
            { enabled: Boolean(dayId) }
        );

    useEffect(() => {
        if (dayData) {
            const { summary, standard, diet } = dayData;
            const processSummary = () => {
                const { breakfastStandard, lunchStandard, dinnerStandard } = summary;
                setSummaryStandard({
                    breakfast: breakfastStandard,
                    lunch: lunchStandard,
                    dinner: dinnerStandard,
                });
            }
            const processStandard = () => {
                const { breakfast, lunch, dinner } = standard;
                const processedStandard = {
                    breakfast: Object.entries(breakfast).map(([clientCode, value]) => ({
                        clientCode,
                        meals: value,
                    })),
                    lunch: Object.entries(lunch).map(([clientCode, value]) => ({
                        clientCode,
                        meals: value,
                    })),
                    dinner: Object.entries(dinner).map(([clientCode, value]) => ({
                        clientCode,
                        meals: value,
                    })),
                };
                setStandard(processedStandard);
            }
            const processDiet = () => {
                const { breakfast, lunch, dinner } = diet;
                const processedDiet = {
                    breakfast: Object.entries(breakfast).reduce((acc, [clientCode, value]) => {
                        acc[clientCode] = Object.entries(value).map(([consumerCode, diet]) => ({
                            consumerCode,
                            diet,
                        }));
                        return acc;
                    }, {} as Record<string, { consumerCode: string, diet: string }[]>),
                    lunch: Object.entries(lunch).reduce((acc, [clientCode, value]) => {
                        acc[clientCode] = Object.entries(value).map(([consumerCode, diet]) => ({
                            consumerCode,
                            diet,
                        }));
                        return acc;
                    }, {} as Record<string, { consumerCode: string, diet: string }[]>),
                    dinner: Object.entries(dinner).reduce((acc, [clientCode, value]) => {
                        acc[clientCode] = Object.entries(value).map(([consumerCode, diet]) => ({
                            consumerCode,
                            diet,
                        }));
                        return acc;
                    }, {} as Record<string, { consumerCode: string, diet: string }[]>),
                }
                setDiet(processedDiet);
            }
            processSummary();
            processStandard();
            processDiet();
        }
    }, [dayData]);

    return {
        onClick,
        dayId,
        summaryStandard,
        standard,
        diet,
        fetching: dayFetching
    };
};

export default useDay;