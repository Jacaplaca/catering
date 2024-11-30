'use client';
import { useEffect, type FunctionComponent, useState } from "react";
import ElementButton from '@root/app/_components/ui/ContextMenu/ElementButton';
import ContextMenu from '@root/app/_components/ui/ContextMenu';
import { type Session } from 'next-auth';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import Link from 'next/link';
import { type NavProfileElement } from '@root/types';
import translate from '@root/app/lib/lang/translate';
import makeHref from '@root/app/lib/url/makeHref';
import { useRouter } from 'next/navigation';
import signOutWithRedirect from '@root/app/lib/signOutWithRedirect';

const renderItems = (items: NavProfileElement[]) => {
    return items.filter(el => el.access).map(el => <ElementButton
        key={el.name}
        href={el.link}
        label={el.name}
        icon={el.icon}
        onClick={el.onClick}
    />
    )
}

const UserButton: FunctionComponent<{
    mobile?: boolean;
    session?: Session | null;
    dictionary: Record<string, string>;
    loading?: boolean;
}> = ({ session, dictionary, loading }) => {

    let userLabel = translate(dictionary, 'profile-button:sign_in')

    const { user: { name = "", email = "" } = {} } = session ?? {};

    if (session) {
        if (name) {
            const [firstName] = name.split(' ');
            userLabel = firstName ?? name;
        } else if (email) {
            const [firstName] = email.split('@');
            userLabel = firstName ?? email;
        }
    }


    return (<MyButton
        noButton
        id="profile-button"
        ariaLabel='profile'
        loading={loading}
        icon={'fas fa-user'}
        className='profile-button'
    >
        {userLabel}
    </MyButton>
    )
}


const ProfileButton: FunctionComponent<{
    className?: string,
    mobile?: boolean,
    href?: string,
    session: Session | null,
    lang: LocaleApp,
    dictionary: Record<string, string>,
    children?: React.ReactNode
}> =
    ({ className = '', mobile, href, session, lang, dictionary, children }) => {

        const [isMounted, setIsMounted] = useState(false);
        const router = useRouter();

        useEffect(() => {
            setIsMounted(true);
        }, []);

        const [showSession, setShowSession] = useState(false);

        useEffect(() => {
            setShowSession(!!session);
        }, [session]);

        const redirect = async () => {
            await signOutWithRedirect(lang)
        }

        if (!isMounted) {
            return <div className={`flex items-center px-5 ${className}`}>
                <UserButton
                    dictionary={dictionary}
                    loading={true}
                />
            </div>
        }

        if (showSession) {

            const profileButtons = [
                {
                    name: translate(dictionary, 'profile-button:profile'),
                    link: makeHref({ lang, page: 'profile' }),
                    icon: 'fas fa-user',
                    access: true,
                },
                {
                    name: translate(dictionary, 'profile-button:sign_out'),
                    icon: 'fas fa-sign-out-alt',
                    access: true,
                    onClick: redirect,
                    link: "/",
                }
            ]

            return (
                <div className={`flex items-center px-5 ${className}`}>
                    <div className="shrink-0">
                        <ContextMenu
                            button={<UserButton session={session} dictionary={dictionary} />}
                            items={renderItems(profileButtons)}
                        >
                        </ContextMenu>
                    </div>
                </div>)
        }

        if (mobile && href) {
            return (
                <div className="">
                    {href ? <Link
                        href={href}
                        className="flex items-center gap-4 rounded-md px-3 py-2
            text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-gray-200"
                    >
                        <UserButton
                            session={session}
                            mobile
                            dictionary={dictionary}
                        />
                    </Link>
                        : <UserButton
                            session={session}
                            mobile
                            dictionary={dictionary}
                        />}

                </div>
            )
        }

        return (
            <div className={`flex items-center px-5 ${className}`}>
                <div className="shrink-0">
                    {children ? <ContextMenu
                        button={<UserButton
                            dictionary={dictionary}
                        />
                        }
                    >
                        {children}
                        <ElementButton
                            href={makeHref({ lang, page: 'sign-in' })}
                        >
                            <MyButton
                                className="w-full"
                                type="button"
                                id="login-button"
                                ariaLabel='login'
                            >
                                {translate(dictionary, "profile-button:sign_in")}
                            </MyButton>
                        </ElementButton>
                    </ContextMenu> :
                        <MyButton
                            id="profile-button"
                            ariaLabel='profile'
                            icon={'fas fa-user'}
                            className='profile-button'
                            onClick={() => {
                                router.push(makeHref({ lang, page: 'sign-in' }))
                            }}
                        >
                            {translate(dictionary, "profile-button:sign_in")}
                        </MyButton>
                    }
                </div>
            </div>
        );
    };

export default ProfileButton;
