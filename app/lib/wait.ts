import { env } from "@root/app/env";

const wait = async (ms = 1000) => {
    if (env.NODE_ENV === 'development') {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export default wait