// import { env } from "@root/app/env";

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";
    // if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    // if (process.env.NODE_ENV === "production") return process.env.DOMAIN_PROD;
    // return `${process.env.DOMAIN_DEV}:${process.env.API_PORT_INTERNAL}`;
    return process.env.DOMAIN;
}

// function getBaseUrl() {
//     if (typeof window !== "undefined") return window.location.origin;
//     if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
//     return `http://localhost:${process.env.PORT ?? 3000}`;
// }

export default getBaseUrl;