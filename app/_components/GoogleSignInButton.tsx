import type { FC, ReactNode } from 'react';
import { signIn } from 'next-auth/react';
import MyButton from '@root/app/_components/ui/buttons/MyButton';

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => {
    signIn('google', { callbackUrl: '/' })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <MyButton
      id='google-sign-in-button'
      ariaLabel='Sign in with Google'
      icon={'fab fa-google'}
      loading={true}
      onClick={loginWithGoogle}
      className='w-full text-sm'>
      {children}
    </MyButton>
  );
};

export default GoogleSignInButton;
