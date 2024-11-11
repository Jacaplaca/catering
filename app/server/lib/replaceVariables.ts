import { type ContentContextType } from '@root/types';

export const replaceVariables = (content: string, context: ContentContextType): string => {
    if (!context) {
        return content;
    }

    const replacement = (match: string, doubleBracketContent: string, singleBracketContent: string): string => {
        const key = doubleBracketContent || singleBracketContent;
        if (!context.hasOwnProperty(key)) {
            return match;
        }
        const result = context[key];
        if (result === null || result === undefined) {
            return match;
        }
        return doubleBracketContent ? `[${result.toString()}]` : result.toString();
    };

    const pattern = /\[\[(.*?)\]\]|\[(.*?)\]/g;

    return content.replace(pattern, replacement);
}