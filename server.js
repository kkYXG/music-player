const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname)));

const NETEASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Referer': 'https://music.163.com/',
    'Cookie': 'os=pc; appver=2.10.11; osver=MacOS14.0',
};

// 搜索接口：搜索歌曲，返回所有结果并标记完整/试听
app.get('/api/search', async (req, res) => {
    const keyword = req.query.q;
    if (!keyword) return res.json({ songs: [] });

    try {
        const encoded = encodeURIComponent(keyword);
        const url = `https://music.163.com/api/search/get/web?s=${encoded}&type=1&limit=50`;
        const resp = await fetch(url, { headers: NETEASE_HEADERS });
        const data = await resp.json();
        const rawSongs = data?.result?.songs || [];

        if (rawSongs.length === 0) return res.json({ songs: [] });

        // 批量检查播放状态：分批查询，每批最多 50 个 id
        const ids = rawSongs.map(s => s.id);
        const checkUrl = `https://music.163.com/api/song/enhance/player/url?id=${ids[0]}&ids=%5B${ids.join('%2C')}%5D&br=320000`;
        const checkResp = await fetch(checkUrl, { headers: NETEASE_HEADERS });
        const checkData = await checkResp.json();

        const urlMap = {};
        for (const item of (checkData?.data || [])) {
            urlMap[item.id] = {
                fee: item.fee,
                size: item.size,
                time: item.time,
            };
        }

        // 优先排完整可播的，试听的放后面
        const covers = ['🎵','🎶','🎤','🎧','💫','✨','🌟','🎸','🎹','🥁','🎺','🎻','🔔','🎤','🎶','🎵'];
        const songs = rawSongs
            .map((s, i) => {
                const info = urlMap[s.id] || {};
                const ms = info.time || s.duration;
                const dur = `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;
                const fee = info.fee;
                const full = (fee === 0 || fee === 8);
                return {
                    nid: s.id,
                    title: s.name,
                    artist: s.artists.map(a => a.name).join('/'),
                    duration: dur,
                    cover: covers[i % covers.length],
                    color: `hsl(${(s.id * 37) % 360}, 60%, 45%)`,
                    full: full,
                };
            })
            .sort((a, b) => (b.full ? 1 : 0) - (a.full ? 1 : 0)); // 完整的排前面

        res.json({ songs });
    } catch (e) {
        console.error('Search error:', e.message);
        res.json({ songs: [] });
    }
});

// 音频代理：流式转发真实音频数据
app.get('/api/song', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send('missing id');

    try {
        const apiUrl = `https://music.163.com/api/song/enhance/player/url?id=${id}&ids=%5B${id}%5D&br=320000`;
        const resp = await fetch(apiUrl, { headers: NETEASE_HEADERS });
        const data = await resp.json();
        let mp3Url = data?.data?.[0]?.url;

        // 确保使用 HTTPS
        if (mp3Url && mp3Url.startsWith('http://')) {
            mp3Url = mp3Url.replace('http://', 'https://');
        }

        if (!mp3Url) {
            const altResp = await fetch(
                `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
                { headers: NETEASE_HEADERS, redirect: 'manual' }
            );
            mp3Url = altResp.headers.get('location');
            if (!mp3Url || mp3Url.includes('404')) {
                return res.status(404).send('song not available');
            }
        }

        const audioResp = await fetch(mp3Url);
        if (!audioResp.ok) return res.status(audioResp.status).send('fetch failed');

        const contentType = audioResp.headers.get('content-type') || 'audio/mpeg';
        const contentLength = audioResp.headers.get('content-length');

        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', 'bytes');
        if (contentLength) res.setHeader('Content-Length', contentLength);
        res.setHeader('Access-Control-Allow-Origin', '*');

        audioResp.body.pipe(res);
    } catch (e) {
        console.error('Proxy error:', e.message);
        res.status(500).send('proxy error');
    }
});

app.listen(PORT, () => {
    console.log(`Music player running at http://localhost:${PORT}`);
});
