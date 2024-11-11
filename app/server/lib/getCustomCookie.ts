import { type NextApiRequest } from 'next';

interface Cookie {
    name: string;
    value: string;
}

interface RequestCookies {
    _parsed: Map<string, Cookie>;
}

function getCustomCookie({ req, cookieName }: { req?: NextApiRequest, cookieName: string }): string | undefined {
    if (!req) return;
    const requestCookies = req.cookies as unknown as RequestCookies;
    const token = requestCookies._parsed.get(cookieName);
    return token?.value;
}


export default getCustomCookie;