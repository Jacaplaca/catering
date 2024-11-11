import fs from 'fs';
import { basename, extname, join } from 'path';
import matter from 'gray-matter';

const initCustomPage = (page: string) => {
    const folderPath = join(process.cwd(), 'app', "assets", page, 'content');
    const pageData = [];
    try {
        const files = fs.readdirSync(folderPath, { withFileTypes: true });
        const mdFilesInFolder = files.filter(file => file.isFile() && extname(file.name) === '.md');
        for (const file of mdFilesInFolder) {
            const filePath = join(folderPath, file.name);
            const lang = basename(filePath, extname(file.name));
            const fileContent = fs.readFileSync(filePath, 'utf8');

            const { content, data } = matter(fileContent);
            const { title, metaTitle, metaDescription, key } = data as { title: string, metaTitle: string, metaDescription: string, key: string };
            pageData.push({
                lang,
                title,
                metaTitle,
                metaDescription,
                content,
                key,
                customData: data
            });
        }
    } catch (error) {
        console.error('initCustomPage error:', error);
    }
    return pageData;
};

export default initCustomPage;