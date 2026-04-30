// Vercel Serverless Function: 音频代理
// 获取真实音频 URL 并重定向，浏览器直接下载音频
const fetch = require('node-fetch');

const NETEASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Referer': 'https://music.163.com/',
    'Cookie': 'os=pc; appver=2.10.11; osver=MacOS14.0',
};

module.exports = async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send('missing id');

    try {
        // 获取真实音频 URL
        const apiUrl = `https://music.163.com/api/song/enhance/player/url?id=${id}&ids=%5B${id}%5D&br=320000`;
        const resp = await fetch(apiUrl, { headers: NETEASE_HEADERS });
        const data = await resp.json();
        let mp3Url = data?.data?.[0]?.url;

        // 备选
        if (!mp3Url) {
            const altResp = await fetch(
                `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
                { headers: NETEASE_HEADERS, redirect: 'manual' }
            );
            mp3Url = altResp.headers.get('location');
        }

        if (!mp3Url || mp3Url.includes('404')) {
            return res.status(404).send('song not available');
        }

        // 确保使用 HTTPS（浏览器在 HTTPS 页面会阻止 HTTP 混合内容）
        if (mp3Url.startsWith('http://')) {
            mp3Url = mp3Url.replace('http://', 'https://');
        }

        // 302 重定向到真实音频地址
        res.redirect(mp3Url);
    } catch (e) {
        res.status(500).send('proxy error');
    }
};
