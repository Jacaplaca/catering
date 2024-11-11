
import { useOrderByDayTableContext } from '@root/app/specific/components/Orders/ByDay/context';
import translate from '@root/app/lib/lang/translate';

const SummaryStandard = () => {

    const {
        dictionary,
        row: { summaryStandard, standard },
    } = useOrderByDayTableContext();


    const translations = {
        breakfast: translate(dictionary, 'orders:breakfast'),
        lunch: translate(dictionary, 'orders:lunch'),
        dinner: translate(dictionary, 'orders:dinner'),
    }

    return (
        <div className='flex flex-col gap-2 items-center'>
            <h3 className='text-lg uppercase font-semibold text-neutral-800 dark:text-neutral-200'>{translate(dictionary, 'orders:standard')}</h3>
            <div
                className='flex flex-row gap-10 items-start justify-center'
            ><div className='flex flex-row gap-8'>{Object.entries(summaryStandard)
                .map(([key, meals]) => (
                    <div key={key} className='border-[1px] border-neutral-400 dark:border-neutral-600 p-4 px-6 rounded-md'>
                        <div className={`flex flex-row gap-4
                        items-baseline
                        `}>
                            <div
                                className='font-bold text-base text-neutral-800 dark:text-neutral-200'
                            >{translations[key as keyof typeof translations]}:{' '}</div>
                            <div className='text-lg font-semibold text-neutral-800 dark:text-neutral-200'>
                                <div className='flex flex-row gap-2'>
                                    {meals}
                                </div>
                            </div>
                        </div>
                        <div>
                            {standard[key as keyof typeof standard].map(({ clientCode, meals }) => {
                                return (
                                    <div key={clientCode}
                                        className={`flex flex-row gap-4 items-center justify-between
                                        text-neutral-800 dark:text-neutral-200
                                        border-b-[1px] border-neutral-400 dark:border-neutral-600
                                        `}>
                                        <div>{clientCode}</div>
                                        <div><div
                                            className='flex flex-row gap-2'
                                        ><div
                                            className='font-semibold'
                                        >{meals}</div></div></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}

export default SummaryStandard;