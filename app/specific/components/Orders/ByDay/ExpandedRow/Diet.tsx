import { Fragment } from 'react';

import { useOrderByDayTableContext } from '@root/app/specific/components/Orders/ByDay/context';
import translate from '@root/app/lib/lang/translate';

const Consumer: React.FC<{ consumerCode: string, diet: string }> = ({ consumerCode, diet }) => (
    <div
        className={`
            text-neutral-800 dark:text-neutral-100
            flex flex-row gap-1 items-start
        `}
    >
        <div className='font-semibold'>{consumerCode}:</div>
        <div>{diet}</div>
    </div>
);

const OrderDetails: React.FC<{ order: { consumerCode: string, diet: string }[] }> = ({ order }) => {
    return (
        <div className='flex flex-col gap-2 px-3'>
            <div className={`flex flex-col gap-2 rounded-md`}>
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

    return (
        <div className="flex flex-col gap-2 items-center p-2 mt-6 text-neutral-800 dark:text-neutral-200">
            <h3 className="text-lg uppercase font-semibold mb-4">{translate(dictionary, 'orders:diet')}</h3>
            <div className="w-full overflow-hidden">
                <div className="grid grid-cols-[150px_1fr_1fr_1fr] gap-4 w-full">
                    <div className="font-bold">{translations.clientCode}</div>
                    <div className="font-bold text-center">{translations.breakfast}</div>
                    <div className="font-bold text-center">{translations.lunch}</div>
                    <div className="font-bold text-center">{translations.dinner}</div>
                    {clientCodes.map(clientCode => (
                        <Fragment key={clientCode}>
                            <div className="contents">
                                <div className='font-bold text-base py-2'>{clientCode}</div>
                                <div className='py-2'><OrderDetails order={diet.breakfast[clientCode] ?? []} /></div>
                                <div className='py-2'><OrderDetails order={diet.lunch[clientCode] ?? []} /></div>
                                <div className='py-2'><OrderDetails order={diet.dinner[clientCode] ?? []} /></div>
                            </div>
                            <div className="col-span-4 h-px bg-neutral-300 dark:bg-neutral-700 mt-2 -mb-2" />
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Diet;