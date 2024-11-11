import NewEmail from '@root/app/_components/Profile/modules/NewEmail';
import NewPassword from '@root/app/_components/Profile/modules/NewPassword';
import { auth } from '@root/app/server/auth';
const ProfilePage: React.FC<{
    lang: LocaleApp
}> = async ({ lang }) => {
    const session = await auth();

    const canChangeEmailAndPass = session!.user.emailVerified || session!.user.hasPassword;

    return (
        <div className='flex gap-6'>
            {canChangeEmailAndPass && <NewPassword session={session!} lang={lang} />}
            {canChangeEmailAndPass && <NewEmail session={session!} lang={lang} />}
        </div>
    )

};

export default ProfilePage;
