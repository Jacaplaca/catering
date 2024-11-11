// import { Configuration, OpenAIApi } from "openai";

// const openAiInit = () => {
//     const configuration = new Configuration({
//         organization: process.env.OPENAI_ORGANIZATION_ID,
//         apiKey: process.env.OPENAI_API_KEY,
//     });
//     const openAi = new OpenAIApi(configuration);

//     return openAi;
// }

import OpenAI from 'openai';
import { env } from "@root/app/env";

const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

const openAiInit = () => {
    return openai;
}



export default openAiInit;
