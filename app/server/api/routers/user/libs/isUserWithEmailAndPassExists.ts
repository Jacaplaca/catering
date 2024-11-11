import { throwTranslation } from '@root/app/server/cache/translations';
import { db } from '@root/app/server/db';

const isUserWithEmailAndPassExists = async ({ email, lang }: { email: string, lang: LocaleApp }) => {
    const userExists = await db.user.findUnique({
        where: {
            email: email.toLowerCase().trim(),
        },
    });

    if (userExists) {
        return await throwTranslation(lang, 'sign-up:error_email_exists');
    }
}

export default isUserWithEmailAndPassExists;