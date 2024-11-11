import React, { type FunctionComponent } from "react";
import NavItem from './NavItem';
import { api } from "app/trpc/server";

const Navigation: FunctionComponent<{
    lang: LocaleApp;
}> = async ({ lang }) => {
    const menuDB = await api.navigation.getMainMenu({ lang });

    return (
        <ul
            id="nav-menu"
            className="navbar-nav order-3 hidden w-full pb-6 lg:order-1 lg:flex lg:w-auto lg:space-x-2 lg:pb-0"
        >
            {menuDB.map((item, i) => {
                return (
                    <React.Fragment key={`menu-${i}`}>
                        <NavItem item={item} />
                    </React.Fragment>
                )
            })}

        </ul>
    )
};

export default Navigation;