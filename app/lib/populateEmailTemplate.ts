import { replaceVariables } from '@root/app/server/lib/replaceVariables';

const populateEmailTemplate = ({ text, content, subject, context = {} }: { text: string, content: string[], subject: string, context?: Record<string, string> }) => {
    const contentWithContext = content.map(c => replaceVariables(c, context));
    const textWithContext = replaceVariables(text, context);
    const subjectWithContext = replaceVariables(subject, context);
    return { textWithContext, contentWithContext, subjectWithContext };
};

export default populateEmailTemplate;