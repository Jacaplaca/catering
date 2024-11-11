import fs from 'fs';
import { basename, extname, join } from 'path';
import matter from 'gray-matter';
// import { i18n } from '@root/i18n-config';


const getContent = <T>(contentDir: string): (T & {
    lang: string;
    key: string;
    context: Record<string, string>;
    content: string[];
    group: string;
})[] => {
    // const { locales } = i18n;
    const folderPath = join(process.cwd(), 'app', "assets", contentDir);
    const pageData: (T & {
        lang: string;
        key: string;
        context: Record<string, string>;
        content: string[];
        group: string;
    })[] = [];

    if (!fs.existsSync(folderPath)) {
        console.log(`Directory not found: ${folderPath}`);
        return pageData;
    }

    try {

        const groupItems = fs.readdirSync(folderPath, { withFileTypes: true });
        const groups = groupItems.filter(item => item.isDirectory()).map(folder => folder.name);

        // groups.forEach((group) => {

        // });

        for (const group of groups) {
            const folderPath = join(process.cwd(), 'app', "assets", contentDir, group);
            const keyItems = fs.readdirSync(folderPath, { withFileTypes: true });
            const folders = keyItems.filter(item => item.isDirectory()).map(folder => folder.name);
            for (const keyFolder of folders) {
                const key = keyFolder;
                const folderFullPath = join(folderPath, keyFolder);
                const items = fs.readdirSync(folderFullPath, { withFileTypes: true });
                const foldersInFolder = items.filter(item => item.isDirectory()).map(folder => folder.name);
                const allLangContextInFolder = items.filter(file => file.isFile() && file.name === 'context.json');
                const contextSeparateLangInFolder = items.filter(file => file.isFile() && extname(file.name) === '.json');
                const mdFilesInFolder = items.filter(file => file.isFile() && extname(file.name) === '.md');

                let context = {};
                if (allLangContextInFolder.length === 1) {
                    const contextFilePath = join(folderFullPath, 'context.json');
                    const contextFileContent = fs.readFileSync(contextFilePath, 'utf8');
                    const contextData = JSON.parse(contextFileContent) as string;
                    Object.assign(context, contextData);
                }

                // const subFoldersAreLocales = foldersInFolder.every(folder => locales.includes(folder));

                if (foldersInFolder.length) {
                    for (const languageFolder of foldersInFolder) {
                        const languageFolderFullPath = join(folderFullPath, languageFolder);
                        const itemsInLanguageFolder = fs.readdirSync(languageFolderFullPath, { withFileTypes: true });
                        const contextInLanguageFolder = itemsInLanguageFolder.filter(file => file.isFile() && file.name === 'context.json');
                        const mdFilesInLanguageFolder = itemsInLanguageFolder.filter(file => file.isFile() && extname(file.name) === '.md');

                        if (contextInLanguageFolder.length === 1) {
                            const contextFilePath = join(languageFolderFullPath, 'context.json');
                            const contextFileContent = fs.readFileSync(contextFilePath, 'utf8');
                            context = JSON.parse(contextFileContent) as string;
                        }

                        let tagData = {} as T;
                        const contents: string[] = [];

                        mdFilesInLanguageFolder.forEach((file, i) => {
                            const filePath = join(languageFolderFullPath, file.name);
                            const fileContent = fs.readFileSync(filePath, 'utf8');
                            const { content, data } = matter(fileContent) as unknown as { content: string, data: T };
                            if (i === 0) {
                                tagData = data;
                            }
                            contents.push(content);
                        });

                        pageData.push({
                            lang: languageFolder,
                            key,
                            context,
                            content: contents,
                            group,
                            ...tagData,
                        });
                    }
                } else {
                    for (const file of mdFilesInFolder) {
                        const filePath = join(folderFullPath, file.name);
                        const lang = basename(filePath, extname(file.name));
                        const fileContent = fs.readFileSync(filePath, 'utf8');

                        if (allLangContextInFolder.length === 0 && contextSeparateLangInFolder.length === mdFilesInFolder.length) {
                            const contextFilePath = join(folderFullPath, `${lang}.json`);
                            const contextFileContent = fs.readFileSync(contextFilePath, 'utf8');
                            const contextData = JSON.parse(contextFileContent) as string;
                            Object.assign(context, contextData);
                        }

                        const { content, data } = matter(fileContent);
                        const tagData = data as T;
                        pageData.push({
                            lang,
                            content: [content],
                            context,
                            key,
                            group,
                            ...tagData,
                        });
                    }
                }
            }
        }


    } catch (error) {
        console.error('initCustomPage error:', error);
    }
    return pageData;
};

export default getContent;