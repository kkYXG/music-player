import urllib.request
import json
import time
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# 检查哪些歌是免费的
song_ids = [
    (1901371647, "孤勇者 - 陈奕迅"),
    (2061978961, "离别开出花 - 就是南方凯"),
    (354750, "奢香夫人 - 凤凰传奇"),
    (28815250, "平凡之路 - 朴树"),
    (1330348068, "起风了 - 买辣椒也用券"),
    (167827, "素颜 - 许嵩"),
    (449818741, "光年之外 - 邓紫棋"),
    (1430319727, "漠河舞厅 - 柳爽"),
    (1808492017, "错位时空 - 艾辰"),
    (65533, "红玫瑰 - 陈奕迅"),
    (454828887, "遇见 - 孙燕姿"),
    (1293886117, "年少有为 - 李荣浩"),
    (569200213, "消愁 - 毛不易"),
    (516076896, "纸短情长 - 烟把儿"),
    (1400256289, "你的答案 - 阿冗"),
    (1404885266, "下山 - 要不要买菜"),
    (2645500113, "跳楼机 - LBI利比"),
    (1998666340, "乌兰巴托的夜 - 李雨霏"),
    (1406036590, "须尽欢 - 郑浩"),
    (1394167216, "知我 - 国风堂"),
    (1391891631, "嗜好 - 颜人中"),
    (1873049720, "初恋 - 回春丹"),
    (465921195, "还是分开 - 张叶蕾"),
    (421423806, "小半 - 陈粒"),
    (316100, "雨爱 - 杨丞琳"),
    (353066, "迷人的危险 - Dance Flow"),
    (1393399161, "浴室 - deca joins"),
    (1887917182, "浪漫主义 - 姜云升"),
    (1403318151, "把回忆拼好给你 - 王贰浪"),
    (3330497350, "女儿心如水 - 黄龄"),
]

print("=== 检查歌曲免费状态 ===\n")
free_songs = []
paid_songs = []

for sid, name in song_ids:
    url = f"https://music.163.com/api/song/enhance/player/url?id={sid}&ids=%5B{sid}%5D&br=320000"
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://music.163.com/',
            'Cookie': 'os=pc; appver=2.10.11; osver=MacOS14.0',
        })
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode())
        d = data['data'][0]
        fee = d.get('fee', '?')
        dur_ms = d.get('time', 0)
        dur_s = dur_ms // 1000
        size_mb = d.get('size', 0) / 1024 / 1024
        br = d.get('br', 0) // 1000
        free_trial = d.get('freeTrialInfo', {})

        status = "FREE" if fee == 0 else f"VIP(fee={fee})"
        dur_str = f"{dur_s // 60}:{dur_s % 60:02d}"
        if fee == 0:
            free_songs.append((sid, name))
        else:
            paid_songs.append((sid, name, dur_str, f"{size_mb:.1f}MB"))

        print(f"{'✓' if fee == 0 else '✗'} {name}: {status} | {dur_str} | {size_mb:.1f}MB | {br}kbps")
    except Exception as e:
        print(f"✗ {name}: ERROR {e}")
    time.sleep(0.2)

print(f"\n免费: {len(free_songs)} 首, 付费: {len(paid_songs)} 首")
print("\n免费歌曲:")
for sid, name in free_songs:
    print(f"  {sid}: {name}")
