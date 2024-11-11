import { getSettingsGroup } from '@root/app/server/cache/settings';
import { getDict } from '@root/app/server/cache/translations';
import { getRequirements, validatePasswordCustomClient } from '@root/app/validators/passwordCustom';

const validatePasswordCustomApi = async (password: string, lang: LocaleApp) => {
    const settings = await getSettingsGroup('auth', true)
    const translations = await getDict({
        lang,
        key: 'auth-validators-errors',
    });
    const requirements = getRequirements(settings, translations)
    const errors = validatePasswordCustomClient(password, settings)
    if (errors?.[0]) {
        throw new Error(requirements[errors[0]])
    }
};

export default validatePasswordCustomApi;
