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
        const apiUrl = `https://music.163.com/api/song/enhance/player/url?id=${id}&ids=%5B${id}%5D&br=320000`;
        const resp = await fetch(apiUrl, { headers: NETEASE_HEADERS });
        const data = await resp.json();
        let mp3Url = data?.data?.[0]?.url;

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

        if (mp3Url.startsWith('http://')) {
            mp3Url = 'https://' + mp3Url.substring(7);
        }

        res.redirect(mp3Url);
    } catch (e) {
        res.status(500).send('proxy error: ' + e.message);
    }
};
