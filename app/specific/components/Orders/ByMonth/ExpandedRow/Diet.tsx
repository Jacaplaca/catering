import { Fragment } from 'react';

import { useOrderByDayTableContext } from '@root/app/specific/components/Orders/ByDay/context';
import translate from '@root/app/lib/lang/translate';

const Consumer: React.FC<{
    consumerCode: string, diet: {
        code: string,
        description: string,
    }
}> = ({ consumerCode, diet }) => (
    <div
        className={`
            text-neutral-800 dark:text-neutral-100
            flex flex-row gap-1 items-start
            cursor-help
        `}
        title={diet.description}
    >
        <div className='font-semibold'>{consumerCode}:</div>
        <div>{diet.code}</div>
    </div>
);

const OrderDetails: React.FC<{
    order: {
        consumerCode: string, diet: {
            code: string,
            description: string,
        }
    }[]
}> = ({ order }) => {
    return (
        <div className='flex flex-col gap-2 px-3 border-r-2 border-l-2 border-neutral-300 dark:border-neutral-700'>
            <div className={`flex flex-col gap-2 rounded-md items-center justify-center`}>


                {order.map((consumer) => (
                    <Consumer key={consumer.consumerCode} {...consumer} />
                ))}
            </div>
        </div>
    )
};

const Diet = () => {

    const {
        dictionary,
        row: { diet },
    } = useOrderByDayTableContext();

    const translations = {
        breakfast: translate(dictionary, 'orders:breakfast'),
        lunch: translate(dictionary, 'orders:lunch'),
        dinner: translate(dictionary, 'orders:dinner'),
        clientCode: translate(dictionary, 'orders:client_code'),
    }

    const clientCodes = Object.keys(diet.breakfast);

    if (clientCodes.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 items-center p-2 mt-6 text-neutral-800 dark:text-neutral-200">
            <h3 className="text-lg uppercase font-semibold mb-4">{translate(dictionary, 'orders:diet')}</h3>
            <div className="w-full overflow-hidden">
                <div className="grid grid-cols-[150px_1fr_1fr_1fr] w-full">
                    <div className="font-bold border-b-2 border-neutral-300 dark:border-neutral-700">{translations.clientCode}</div>
                    <div className="font-bold text-center border-b-2 border-neutral-300 dark:border-neutral-700">{translations.breakfast}</div>
                    <div className="font-bold text-center border-b-2 border-neutral-300 dark:border-neutral-700">{translations.lunch}</div>
                    <div className="font-bold text-center border-b-2 border-neutral-300 dark:border-neutral-700">{translations.dinner}</div>

                    {clientCodes.map(clientCode => {
                        const breakfast = diet.breakfast[clientCode] ?? [];
                        const lunch = diet.lunch[clientCode] ?? [];
                        const dinner = diet.dinner[clientCode] ?? [];
                        const clientHasNotDiets = breakfast.length === 0 && lunch.length === 0 && dinner.length === 0;
                        if (clientHasNotDiets) return null;
                        return (
                            <Fragment key={clientCode}>
                                <div className="contents">
                                    <div className='font-bold text-base py-2'>{clientCode}</div>
                                    <div className='py-2'><OrderDetails order={breakfast} /></div>
                                    <div className='py-2'><OrderDetails order={lunch} /></div>
                                    <div className='py-2'><OrderDetails order={dinner} /></div>
                                </div>
                                <div className="col-span-4 h-px bg-neutral-300 dark:bg-neutral-700" />
                            </Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Diet;