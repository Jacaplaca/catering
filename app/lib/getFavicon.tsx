import axios from 'axios';

const getFavicon = async (link: string) => {
    const url = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link}&size=128`;
    // const url = `https://s2.googleusercontent.com/s2/favicons?domain=${name}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data as string, 'binary');
    return `data:image/png;base64,${buffer.toString('base64')}`;
};

export default getFavicon;