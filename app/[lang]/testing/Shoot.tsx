'use client';

import { type FunctionComponent } from "react";
import { api } from '@root/app/trpc/react';


const Shoot: FunctionComponent = () => {
    const { data } = api.dev.dbg.useQuery({ time: '18:00' });
    return <div>{data?.dateTime.toLocaleString()}</div>;
}

export default Shoot;