'use client';

// import { pl } from 'date-fns/locale/pl';
import { type FunctionComponent } from 'react';
// import { registerLocale } from 'react-datepicker';
import CustomInput from '@root/app/_components/ui/Inputs/MonthPicker/CustomInput';
import { useByClientAndMonthTableContext } from '@root/app/specific/components/Orders/ByClientAndMonth/context';
import MonthPicker from '@root/app/_components/ui/Inputs/MonthPicker';

// registerLocale('pl', pl);

const Month: FunctionComponent<{ disabled?: boolean }> = ({ disabled }) => {

    const {
        lang,
        month: { deliveryMonth, onClick: onClickDeliveryMonth }
    } = useByClientAndMonthTableContext();

    return (
        <MonthPicker
            locale={lang}
            disabled={disabled}
            // minDate={now}
            selected={deliveryMonth}
            CustomInput={<CustomInput disabled={disabled} />}
            onSelect={onClickDeliveryMonth}
        />
    );
};

export default Month;