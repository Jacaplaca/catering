"use client";
import { type FunctionComponent } from 'react';
import { useBoolean } from 'usehooks-ts';

const NavbarToggler: FunctionComponent = () => {
    const { value: isMenuOpen, toggle } = useBoolean(false)

    return (
        <>
            <label
                htmlFor="nav-toggle"
                className="order-3 flex cursor-pointer items-center text-dark dark:text-white lg:order-1 lg:hidden"
            >
                <svg className="h-6 fill-current" viewBox="0 0 20 20">
                    {/* <title>{isMenuOpen ? 'Menu Close' : 'Menu Open'}</title> */}
                    {isMenuOpen ? (
                        // SVG for Close icon
                        <polygon
                            points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
                            transform="rotate(45 10 10)"
                        />
                    ) : (
                        // SVG for Open icon
                        <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V15z"></path>
                    )}
                </svg>
            </label>
            <input
                id="nav-toggle"
                type="checkbox"
                className="hidden"
                onChange={toggle}
                checked={isMenuOpen}
            />
        </>
    );
};

export default NavbarToggler;
