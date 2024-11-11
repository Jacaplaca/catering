import axios from 'axios';
import mime from 'mime-types';

const getFile = async (fileUrl: string): Promise<{ buffer: Buffer, ext: string, mimeType: string }> => {
    const response = await axios.get<ArrayBuffer>(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(new Uint8Array(response.data));
    const ext = fileUrl.split('.').pop() ?? 'jpg';
    const mimeType = mime.lookup(ext) || 'application/octet-stream';
    return { buffer, ext, mimeType };
}

export default getFile;