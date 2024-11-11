export type GenerateCodeOptions = {
    schema?: string;
    prefix?: string;
    suffix?: string;
    i?: number;
    iLen?: number;
};

export const codeGen = ({
    schema = 'dddd/YY',
    prefix = '',
    suffix = '',
    i: incrementValue = 0,
    iLen = 0,
}: GenerateCodeOptions): string => {

    // Helper functions for generating parts of the code
    const generateRandomDigit = () => Math.floor(Math.random() * 10).toString();
    const generateRandomUppercaseLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    const generateRandomLowercaseLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);

    const currentYear = new Date().getFullYear();
    const lastTwoDigitsOfYear = (currentYear % 100).toString().padStart(2, '0');
    const fullYear = currentYear.toString();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

    // Format the incrementValue according to iLen
    const formattedIncrementValue = incrementValue.toString().padStart(iLen, '0');

    let code = '';

    for (let i = 0; i < schema.length; i++) {
        const char = schema[i];

        switch (char) {
            case 'Y':
                if (schema[i + 1] === 'Y') {
                    if (schema[i + 2] === 'Y' && schema[i + 3] === 'Y') {
                        code += fullYear;
                        i += 3; // Skip the next 3 characters
                    } else {
                        code += lastTwoDigitsOfYear;
                        i += 1; // Skip the next character
                    }
                }
                break;

            case 'M':
                code += currentMonth;
                break;

            case 'd':
                code += generateRandomDigit();
                break;

            case 'L':
                code += generateRandomUppercaseLetter();
                break;

            case 'l':
                code += generateRandomLowercaseLetter();
                break;

            case 'i':
                code += formattedIncrementValue;
                break;

            default:
                code += char; // treat as a separator or literal
                break;
        }
    }

    return `${prefix}${code}${suffix}`;
};

interface GenerateCodesParams {
    count: number;
    currentCodes: string[];
    options: GenerateCodeOptions;
}

export const generateXUniqueCodes = (
    { count, currentCodes, options }: GenerateCodesParams): string[] => {
    const codes = new Set<string>();
    let i = 0;
    while (codes.size < count) {
        const newCode = codeGen({ ...options, i: options.i ? options.i + i : i });
        i++;
        if (!currentCodes.includes(newCode) && !codes.has(newCode)) {
            codes.add(newCode);
        }
    }
    return Array.from(codes);
}

export const generateUniqueCode = async (schema: GenerateCodeOptions, check: (generatedCode: string) => Promise<unknown>): Promise<string> => {
    let code = '';
    let isUnique = false;
    while (!isUnique) {
        code = codeGen(schema);
        const existingClient = await check(code);
        if (!existingClient) {
            isUnique = true;
        }
    }
    return code;
};