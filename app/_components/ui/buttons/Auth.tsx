import Cookies from 'js-cookie';
import { useState, type FC } from 'react';
import { signIn } from 'next-auth/react';
import MyButton from '@root/app/_components/ui/buttons/MyButton';

interface GoogleSignInButtonProps {
    provider: 'google' | 'facebook';
    label: string;
    icon: string;
    inviteToken?: string | null;
    redirectUrl?: string;
}

// const providers = {
//     google: {
//         icon: 'fab fa-google',
//         // ariaLabel: 'Sign in with Google',
//         // label: 'Sign in with Google',
//     },
//     facebook: {
//         icon: 'fab fa-facebook',
//         // ariaLabel: 'Sign in with Facebook',
//         // label: 'Sign in with Facebook',
//     },
// }

const AuthButton: FC<GoogleSignInButtonProps> = ({ provider, label, icon, inviteToken = '', redirectUrl = "/" }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const login = () => {
        setError(false);
        setLoading(true);
        inviteToken && Cookies.set('invitationToken', inviteToken, { expires: .0006944, secure: true, sameSite: 'Strict' });
        signIn(provider, {
            callbackUrl: redirectUrl,
        })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                console.log(err)
            });
    }

    return (
        <MyButton
            id={label}
            ariaLabel={label}
            icon={icon}
            loading={loading}
            onClick={login}
            disabled={loading}
            type='button'
        >
            {error ? "Something went wrong" : label}
        </MyButton>
    );
};

export default AuthButton;
