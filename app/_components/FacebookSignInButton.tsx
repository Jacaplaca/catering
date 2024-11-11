import type { FC, ReactNode } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

interface FacebookSignInButtonProps {
  children: ReactNode;
}
const FacebookSignInButton: FC<FacebookSignInButtonProps> = ({ children }) => {
  const loginWithFacebook = () => {
    signIn('facebook', { callbackUrl: '/' })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <Button onClick={loginWithFacebook} className='w-full'>
      {children}
    </Button>
  );
};

export default FacebookSignInButton;
