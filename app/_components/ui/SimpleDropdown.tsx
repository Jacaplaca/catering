import { Dropdown, type FlowbiteDropdownTheme } from 'flowbite-react';
import { type DeepPartial } from 'flowbite-react/dist/types/types';
import { type ReactElement, type FunctionComponent } from 'react';

const dropdownTheme = {
    arrowIcon: "ml-2 h-4 w-4",
    content: "py-1 focus:outline-none",
    floating: {
        animation: "transition-opacity",
        arrow: {
            base: "absolute z-10 h-2 w-2 rotate-45",
            style: {
                dark: "bg-neutral-900 dark:bg-neutral-700",
                light: "bg-white",
                auto: "bg-white dark:bg-neutral-700"
            },
            placement: "-4px"
        },
        base: "z-10 w-fit divide-y divide-neutral-100 rounded shadow focus:outline-none",
        content: "py-1 text-sm text-neutral-700 dark:text-neutral-200",
        divider: "my-1 h-px bg-neutral-100 dark:bg-neutral-600",
        header: "block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200",
        hidden: "invisible opacity-0",
        item: {
            container: "",
            base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none dark:text-neutral-200 dark:hover:bg-neutral-600 dark:hover:text-white dark:focus:bg-neutral-600 dark:focus:text-white",
            icon: "mr-2 h-4 w-4"
        },
        style: {
            auto: `border  border-neutral-300 dark:border-neutral-800
            text-neutral-900 dark:text-neutral-100
            bg-white  dark:bg-neutral-700
            shadow-small dark:shadow-darkmode-small`
        },
        target: `w-fit bg-white dark:bg-neutral-700
        border-1 border-neutral-300 dark:border-neutral-700
        text-neutral-800 dark:text-neutral-200
        ring-1 focus:ring-1
        ring-neutral-300 focus:ring-secondary
        dark:focus:ring-darkmode-secondary-accent dark:ring-neutral-700
        `
    },
    inlineWrapper: "flex items-center "
}

const SimpleDropdown: FunctionComponent<{
    label: React.ReactNode;
    children: React.ReactNode;
    theme?: DeepPartial<FlowbiteDropdownTheme>
    disabled?: boolean;
    renderTrigger?: (theme: FlowbiteDropdownTheme) => ReactElement;
    dismissOnClick?: boolean;
}> = ({ label, children, theme = {}, disabled, renderTrigger, dismissOnClick = false }) => {

    return (
        <Dropdown
            disabled={disabled}
            dismissOnClick={dismissOnClick}
            label={label}
            renderTrigger={renderTrigger}
            theme={{
                ...dropdownTheme,
                ...theme
            }}
        >
            {children}
        </Dropdown>
    )
};

export default SimpleDropdown;