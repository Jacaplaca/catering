"use client";

import React, { useEffect, useState } from 'react';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { format } from 'date-fns';

const Clock = () => {
    // Initialize current time state with the value returned from getCurrentTime
    const [currentTime, setCurrentTime] = useState<Date>(getCurrentTime());

    useEffect(() => {
        // Update the current time every minute (60000ms)
        const intervalId = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    // Format the current time using date-fns
    const formattedTime = format(currentTime, "yyyy-MM-dd HH:mm");

    return (
        <div style={{ textAlign: "center", marginTop: "1rem", fontWeight: "bold" }}>
            {formattedTime}
        </div>
    );
};

export default Clock; 