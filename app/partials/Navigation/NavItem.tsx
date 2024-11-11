'use client';
import { type FunctionComponent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { type NavigationLink } from '@root/app/partials/Navigation/navigationLink';

const Item: FunctionComponent<{ showBottomBorder: boolean, url: string, title: string, isChild?: boolean, pathname: string }> = ({ url, title, isChild, pathname }) => {
    let isActive = pathname === url;
    const pathnameElements = pathname.split("/");
    const urlElements = url.split("/");

    urlElements.forEach((element, index) => {
        isActive = element === pathnameElements[index];
    });

    return (
        <li className={`${isChild ? 'nav-dropdown-item' : 'nav-item'} `}>
            <Link
                href={url}
                className={`
                ${isChild ? "nav-dropdown-link" : "nav-link"} block`}
            >
                <div className="flex items-center">
                    <span className={`inline-block transition-transform duration-200 transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0'} mr-2`}>
                        <i className={`fas fa-chevron-right text-xs scale-75 ${isActive ? '' : 'hidden'}`}></i>
                    </span>
                    <span className="flex-1">{title}</span>
                </div>
            </Link>
        </li>
    )
}

const NavItem: FunctionComponent<{ item: NavigationLink }> = ({ item }) => {
    const pathname = usePathname();
    const { hasChildren, anchor, url, children, isPage } = item;

    if (!hasChildren) {
        return <Item url={url} title={anchor} pathname={pathname} showBottomBorder={false} />
    }

    return (
        <li className="nav-item nav-dropdown group relative">

            <Link
                href={url}
                className={`nav-dropdown-parent ${isPage ? "" : "pointer-events-none"}`}
            >
                <span>{anchor}</span>
                <i className="fas fa-chevron-down ml-2 text-xs transition-transform duration-200 group-hover:rotate-180"></i>
            </Link>


            <ul className={`nav-dropdown-list hidden group-hover:block invisible lg:absolute opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 ease-in-out`}>
                {children?.map(({ url, anchor }, i) => (
                    <Item
                        url={url}
                        title={anchor}
                        isChild key={`children-${i}`}
                        pathname={pathname}
                        showBottomBorder={i !== children.length - 1}
                    />
                ))}
            </ul>
        </li>
    )
};


export default NavItem;