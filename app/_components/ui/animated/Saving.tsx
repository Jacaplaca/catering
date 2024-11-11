import React from 'react';

const Saving: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div
            className="max-w-sm animate-ping"
        >
            {/* <style>
                {opacityDelay}
            </style> */}
            <div
                className={`text-2xl fas fa-floppy-disk text-secondary dark:text-darkmode-secondary ${className}`}
            // style={{ animation: 'opacityDelay 0.5s forwards' }}
            ></div>
        </div>
    );
};

export default Saving;
