// import NextAuth from "next-auth";
// import { authOptions } from "server/auth";
// import { type NextRequest, type NextResponse } from 'next/server';
// import { type NextApiRequest, type NextApiResponse } from 'next';

// const nextAuthHandler = (req: NextApiRequest, res: NextApiResponse) => {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
//     return NextAuth(req, res, authOptions(req))
// };

// export const GET = nextAuthHandler as unknown as (req: NextRequest, res: NextResponse) => void;
// export const POST = nextAuthHandler as unknown as (req: NextRequest, res: NextResponse) => void;

import { authOptions } from '@root/app/server/auth/config';
import NextAuth from "next-auth";
import { cache } from 'react';


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// const handler = NextAuth(authOptions());
// export { handler as GET, handler as POST };
const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authOptions());

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
