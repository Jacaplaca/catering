import initFooter from '@root/scripts/init/footer';

const resetFooter = async () => {
    console.log("16 >>> resetFooter...");
    return await initFooter(true);
}


export default resetFooter;