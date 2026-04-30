// Vercel Serverless Function: 流式代理音频
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
            return res.status(404).json({ error: 'song not available', id });
        }

        // 确保 HTTPS
        if (mp3Url.startsWith('http://')) {
            mp3Url = 'https://' + mp3Url.substring(7);
        }

        // 构建音频请求头，支持 Range（拖动进度条）
        const audioHeaders = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Referer': 'https://music.163.com/',
        };
        if (req.headers.range) {
            audioHeaders['Range'] = req.headers.range;
        }

        // 流式转发音频
        const audioResp = await fetch(mp3Url, { headers: audioHeaders });
        if (!audioResp.ok && audioResp.status !== 206) {
            return res.status(audioResp.status).json({ error: 'cdn fetch failed', status: audioResp.status });
        }

        res.setHeader('Content-Type', audioResp.headers.get('content-type') || 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=600');

        const cl = audioResp.headers.get('content-length');
        if (cl) res.setHeader('Content-Length', cl);
        const cr = audioResp.headers.get('content-range');
        if (cr) res.setHeader('Content-Range', cr);

        if (audioResp.status === 206) res.status(206);

        audioResp.body.pipe(res);
    } catch (e) {
        res.status(500).json({ error: 'proxy error', detail: e.message });
    }
};
