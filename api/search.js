// Vercel Edge Function: 搜索接口
export const config = {
    runtime: 'edge',
};

const NETEASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Referer': 'https://music.163.com/',
    'Cookie': 'os=pc; appver=2.10.11; osver=MacOS14.0',
};

export default async function handler(req) {
    const url = new URL(req.url);
    const keyword = url.searchParams.get('q');
    if (!keyword) return new Response(JSON.stringify({ songs: [] }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

    try {
        const encoded = encodeURIComponent(keyword);
        const searchUrl = `https://music.163.com/api/search/get/web?s=${encoded}&type=1&limit=50`;
        const resp = await fetch(searchUrl, { headers: NETEASE_HEADERS });
        const data = await resp.json();
        const rawSongs = data?.result?.songs || [];

        if (rawSongs.length === 0) return new Response(JSON.stringify({ songs: [] }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });

        const ids = rawSongs.map(s => s.id);
        const checkUrl = `https://music.163.com/api/song/enhance/player/url?id=${ids[0]}&ids=%5B${ids.join('%2C')}%5D&br=320000`;
        const checkResp = await fetch(checkUrl, { headers: NETEASE_HEADERS });
        const checkData = await checkResp.json();

        const urlMap = {};
        for (const item of (checkData?.data || [])) {
            urlMap[item.id] = { fee: item.fee, size: item.size, time: item.time };
        }

        const covers = ['\u{1F3B5}','\u{1F3B6}','\u{1F3A4}','\u{1F3A7}','\u{1F4AB}','\u2728','\u{1F31F}','\u{1F3B8}','\u{1F3B9}','\u{1F941}','\u{1F3BA}','\u{1F3BB}','\u{1F514}','\u{1F3A4}','\u{1F3B6}','\u{1F3B5}'];
        const songs = rawSongs.map((s, i) => {
            const info = urlMap[s.id] || {};
            const ms = info.time || s.duration;
            const dur = `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;
            const fee = info.fee;
            return {
                nid: s.id,
                title: s.name,
                artist: s.artists.map(a => a.name).join('/'),
                duration: dur,
                cover: covers[i % covers.length],
                color: `hsl(${(s.id * 37) % 360}, 60%, 45%)`,
                full: (fee === 0 || fee === 8),
            };
        }).sort((a, b) => (b.full ? 1 : 0) - (a.full ? 1 : 0));

        return new Response(JSON.stringify({ songs }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ songs: [] }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }
}
