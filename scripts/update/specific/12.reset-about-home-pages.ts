import { resetPages } from '@root/scripts/init/content';

const resetTranslations = async () => {
    console.log("12 >>> reset home page and about page...");
    return await resetPages(['home', 'about']);
}



export default resetTranslations;