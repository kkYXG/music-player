// Vercel Edge Function: 流式代理音频
// 通过 Edge Runtime 流式转发音频，避免 302 重定向被 CDN 防盗链拦截
export const config = {
    runtime: 'edge',
};

const NETEASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Referer': 'https://music.163.com/',
    'Cookie': 'os=pc; appver=2.10.11; osver=MacOS14.0',
};

export default async function handler(req) {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Range',
            },
        });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response('missing id', { status: 400 });

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
            return new Response('song not available', { status: 404 });
        }

        // 确保 HTTPS
        if (mp3Url.startsWith('http://')) {
            mp3Url = 'https://' + mp3Url.substring(7);
        }

        // 构建请求头，传递 Range 以支持拖动进度条
        const audioHeaders = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Referer': 'https://music.163.com/',
        };
        const range = req.headers.get('range');
        if (range) audioHeaders['Range'] = range;

        // 流式转发音频数据
        const audioResp = await fetch(mp3Url, { headers: audioHeaders });

        if (!audioResp.ok && audioResp.status !== 206) {
            return new Response('fetch audio failed', { status: audioResp.status });
        }

        const respHeaders = new Headers({
            'Content-Type': audioResp.headers.get('content-type') || 'audio/mpeg',
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*',
        });

        const cl = audioResp.headers.get('content-length');
        if (cl) respHeaders.set('Content-Length', cl);
        const cr = audioResp.headers.get('content-range');
        if (cr) respHeaders.set('Content-Range', cr);

        return new Response(audioResp.body, {
            status: audioResp.status,
            headers: respHeaders,
        });
    } catch (e) {
        return new Response('proxy error: ' + e.message, { status: 500 });
    }
}
