import Link from 'next/link';
import { type FunctionComponent } from 'react';
import { Menu } from "@headlessui/react";

type ElementButtonPropsType = {
    label?: string;
    icon?: string;
    href?: string;
    children?: React.ReactNode;
    button?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const ElementButton: FunctionComponent<ElementButtonPropsType> = (
    { label, icon, href = "", children, button, onClick }) => {

    if (children) {
        return <Link href={href} className={`w-full`} onClick={onClick} >
            <Menu.Item >
                {children}
            </Menu.Item>
        </Link>
    }

    return (
        <div className={`group flex w-full items-center rounded-xl ${children ? "" : ""} hover:opacity-100 opacity-80`}>
            <Link href={href} className={`w-full`} onClick={onClick} >
                <Menu.Item >
                    <div
                        className={`flex w-full items-center justify-between gap-5 px-4 py-2 text-sm font-semibold dark:text-darkmode-text text-text hover:text-dark dark:hover:text-darkmode-light`}
                    >
                        {label && <p className={`whitespace-nowrap`}>{label}</p>}
                        {icon && <div className={`${icon} group-hover:text-secondary-accent dark:group-hover:text-darkmode-secondary`} />}
                    </div>
                </Menu.Item>
            </Link>
            {button && button}
        </div>
    )
}

export default ElementButton;