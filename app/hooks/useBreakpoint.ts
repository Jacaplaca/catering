
import { useState, useEffect } from 'react';

const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState('xs');

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            let newBreakpoint = 'xs';

            for (const [key, width] of Object.entries(breakpoints)) {
                if (screenWidth >= width) {
                    newBreakpoint = key;
                } else {
                    break;
                }
            }

            setBreakpoint(newBreakpoint);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
};

export default useBreakpoint;