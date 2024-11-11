import { type Consumer, type Diet } from '@prisma/client';
import translate from '@root/app/lib/lang/translate';
import { useOrderTableContext } from '@root/app/specific/components/Orders/ByOrder/context';

const DietConsumers = ({ consumers }: { consumers: Array<Consumer & { diet: Diet | null }> }) => {
    return (
        <div className={`flex flex-col gap-2`}>
            {consumers?.map((consumer) => {
                const { code, name, diet, id } = consumer;
                const { code: dietCode, description: dietDescription } = diet ?? {};
                return (
                    <div key={id} className={`bg-white dark:bg-neutral-900/40 rounded-lg  p-2`}>
                        <div className={`flex justify-between items-center mb-1
                        border-b border-neutral-100 dark:border-neutral-700
                            `}>
                            <h3 className={`font-semibold text-base`}>{name}</h3>
                            <span className={`text-sm px-2 py-1
                                text-neutral-800 dark:text-neutral-100 font-semibold
                                `}>{code}</span>
                        </div>
                        {(dietDescription ?? dietCode) && (
                            <div className={`text-sm text-neutral-800 dark:text-neutral-200 flex justify-between items-center`}>
                                <p>
                                    <span
                                        className={`text-neutral-700 text-xs dark:text-neutral-300`}
                                    >{dietDescription}</span>
                                    {dietCode && (
                                        <span className="ml-2 font-bold">
                                            {dietCode}
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

const OrderView = () => {
    const {
        dictionary,
        rowClick: {
            orderForView,
            orderForViewFetching
        }
    } = useOrderTableContext();

    if (orderForViewFetching) return <div
        className={`flex items-center justify-center w-full h-full text-2xl p-6`}
    ><i className={`animate-spin fas fa-spinner`} /></div>;
    if (!orderForView) return <div>Error</div>;

    const headerStyle = 'p-3 font-semibold text-neutral-800 dark:text-neutral-200';
    const standardStyle = 'p-3 font-bold text-base text-center text-neutral-800 dark:text-neutral-200';
    return (
        <div className={`grid grid-cols-4 auto-rows-auto gap-4 p-5`}>
            <div className={`p-3 text-center`}></div>
            <div className={`${headerStyle} text-center`}>{translate(dictionary, 'orders:breakfast')}</div>
            <div className={`${headerStyle} text-center`}>{translate(dictionary, 'orders:lunch')}</div>
            <div className={`${headerStyle} text-center`}>{translate(dictionary, 'orders:dinner')}</div>
            <div className={`${headerStyle} text-right`}>{translate(dictionary, 'orders:standard')}</div>
            <div className={`${standardStyle}`}>{orderForView?.standards?.breakfast}</div>
            <div className={`${standardStyle}`}>{orderForView?.standards?.lunch}</div>
            <div className={`${standardStyle}`}>{orderForView?.standards?.dinner}</div>
            <div className={`${headerStyle} text-right`}>{translate(dictionary, 'orders:diet')}</div>
            <div className="overflow-auto "><DietConsumers consumers={orderForView?.diet.breakfast} /></div>
            <div className="overflow-auto "><DietConsumers consumers={orderForView?.diet.lunch} /></div>
            <div className="overflow-auto "><DietConsumers consumers={orderForView?.diet.dinner} /></div>
        </div>
    );
};

export default OrderView;