import { resetPages } from '@root/scripts/init/content';

const resetTranslations = async () => {
    console.log("14 >>> reset home page...");
    return await resetPages(['home']);
}




export default resetTranslations;