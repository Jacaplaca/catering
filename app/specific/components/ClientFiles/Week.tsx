'use client';

// import { pl } from 'date-fns/locale/pl';
import { type FunctionComponent } from 'react';
// import { registerLocale } from 'react-datepicker';
import { useClientFilesTableContext } from '@root/app/specific/components/ClientFiles/context';
import WeekPicker from '@root/app/_components/ui/Inputs/WeekPicker';
import CustomInput from '@root/app/_components/ui/Inputs/WeekPicker/CustomInput';

// registerLocale('pl', pl);

const Week: FunctionComponent<{ disabled?: boolean }> = ({ disabled }) => {

    const {
        lang,
        filter: { week }
    } = useClientFilesTableContext();

    return (
        <WeekPicker
            locale={lang}
            disabled={disabled}
            // minDate={now}
            selected={week.dayOfWeek}
            CustomInput={<CustomInput disabled={disabled} />}
            onSelect={week.handleChangeDayOfWeek}
        />
    );
};

export default Week;