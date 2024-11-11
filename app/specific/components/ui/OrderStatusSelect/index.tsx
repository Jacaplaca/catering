"use client";

import { type OrderStatus } from '@prisma/client';
import SimpleDropdown from '@root/app/_components/ui/SimpleDropdown';
import { orderStatusDictionary } from '@root/app/assets/maps/catering';
import Status from '@root/app/specific/components/ui/OrderStatusSelect/Status';
import { Dropdown } from "flowbite-react";
import { type FC } from 'react';

const OrderStatusSelect: FC<{
    dictionary: Record<string, string>,
    status: OrderStatus | null,
    changeStatus: (status: OrderStatus | null) => void,
    omitStatus?: OrderStatus
}> = ({ dictionary, status, changeStatus, omitStatus }) => {
    return (
        <SimpleDropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
                <div className='cursor-pointer'>
                    <Status status={status} dictionary={dictionary} size='sm' />
                </div>
            )}
        >
            <div className="p-1">
                <Dropdown.Item
                    key="null"
                    onClick={() => changeStatus(null)}
                >
                    <Status status={null} dictionary={dictionary} size='sm' />
                </Dropdown.Item>
                {Object.keys(orderStatusDictionary).map(statusKey => {
                    if (omitStatus && statusKey === omitStatus) return null;
                    const currentStatus = statusKey as OrderStatus;
                    return (
                        <Dropdown.Item
                            key={statusKey}
                            onClick={() => changeStatus(currentStatus)}
                        >
                            <Status status={currentStatus} dictionary={dictionary} size='sm' />
                        </Dropdown.Item>
                    );
                })}
            </div>
        </SimpleDropdown>
    );
}

export default OrderStatusSelect;