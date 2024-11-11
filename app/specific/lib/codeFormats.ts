import { type GenerateCodeOptions } from '@root/app/lib/codeGens';

const codeFormats: Record<string, GenerateCodeOptions> = {
    client: { schema: 'i-YY', iLen: 4 },
    consumer: { suffix: "/C", schema: 'i-L', iLen: 6 },
    diet: { suffix: "/D", schema: 'i-L', iLen: 6 },
} as Record<string, GenerateCodeOptions>;

export default codeFormats;
