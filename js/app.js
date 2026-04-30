// ========== 歌曲数据（网易云可完整播放的歌曲） ==========
const SONGS = [
    { id: 1,  nid: 1330348068, title: "起风了",            artist: "买辣椒也用券",    duration: "5:25", cover: "🍃", color: "#1abc9c", full: true },
    { id: 2,  nid: 569200213,  title: "消愁",             artist: "毛不易",          duration: "4:21", cover: "🍻", color: "#f1c40f", full: true },
    { id: 3,  nid: 1313354324, title: "出山",             artist: "花粥",            duration: "3:20", cover: "🏔️", color: "#27ae60", full: true },
    { id: 4,  nid: 574566207,  title: "盗将行",           artist: "花粥/马雨阳",     duration: "3:18", cover: "🗡️", color: "#c0392b", full: true },
    { id: 5,  nid: 1336778074, title: "沙漠骆驼",         artist: "李传胜",          duration: "5:38", cover: "🐫", color: "#d4a574", full: true },
    { id: 6,  nid: 1998666340, title: "乌兰巴托的夜",     artist: "李雨霏",          duration: "3:50", cover: "🌙", color: "#2c3e50", full: true },
    { id: 7,  nid: 1406036590, title: "须尽欢",           artist: "郑浩",            duration: "4:23", cover: "🎶", color: "#d4a574", full: true },
    { id: 8,  nid: 1394167216, title: "知我",             artist: "国风堂/哦漏",     duration: "4:37", cover: "📜", color: "#6cb4ee", full: true },
    { id: 9,  nid: 1391891631, title: "嗜好",             artist: "颜人中",          duration: "4:44", cover: "🎨", color: "#e67e22", full: true },
    { id: 10, nid: 1873049720, title: "初恋",             artist: "回春丹",          duration: "3:42", cover: "💕", color: "#e94560", full: true },
    { id: 11, nid: 465921195,  title: "还是分开",         artist: "张叶蕾",          duration: "3:46", cover: "💔", color: "#e74c3c", full: true },
    { id: 12, nid: 1393399161, title: "浴室",             artist: "deca joins",      duration: "4:54", cover: "🚿", color: "#0f3460", full: true },
    { id: 13, nid: 1887917182, title: "浪漫主义",         artist: "姜云升",          duration: "3:36", cover: "🌹", color: "#c0392b", full: true },
    { id: 14, nid: 1403318151, title: "把回忆拼好给你",    artist: "王贰浪",          duration: "6:21", cover: "🧩", color: "#9b59b6", full: true },
    { id: 15, nid: 3330497350, title: "女儿心如水",       artist: "黄龄",            duration: "3:49", cover: "💧", color: "#16a085", full: true },
    { id: 16, nid: 1359356908, title: "晚安",             artist: "颜人中",          duration: "4:49", cover: "🌙", color: "#3498db", full: true },
    { id: 17, nid: 1363948882, title: "世间美好与你环环相扣", artist: "柏松",        duration: "3:11", cover: "🌈", color: "#e056a0", full: true },
    { id: 18, nid: 1442508316, title: "丢了你",           artist: "井胧",            duration: "4:37", cover: "😢", color: "#8e44ad", full: true },
    { id: 19, nid: 3371330771, title: "请先说你好",       artist: "贺一航",          duration: "4:43", cover: "👋", color: "#e94560", full: true },
    { id: 20, nid: 35678875,   title: "呼吸决定",         artist: "Fine乐团",        duration: "4:06", cover: "💨", color: "#533483", full: true },
    { id: 21, nid: 135394,     title: "该死的温柔",       artist: "马天宇",          duration: "3:44", cover: "💙", color: "#3498db", full: true },
    { id: 22, nid: 28978321,   title: "逆流成河",         artist: "金南玲",          duration: "2:05", cover: "🌊", color: "#0f3460", full: true },
    { id: 23, nid: 1357999894, title: "归去来兮",         artist: "叶炫清",          duration: "3:26", cover: "🍃", color: "#27ae60", full: true },
    { id: 24, nid: 2645500113, title: "跳楼机",           artist: "LBI利比",         duration: "3:21", cover: "🎡", color: "#8e44ad", full: true },
    { id: 25, nid: 569212211,  title: "盛夏",             artist: "毛不易",          duration: "4:34", cover: "☀️", color: "#f39c12", full: true },
    { id: 26, nid: 569200210,  title: "给你给我",         artist: "毛不易",          duration: "4:01", cover: "🎁", color: "#e94560", full: true },
    { id: 27, nid: 569214252,  title: "如果有一天你变得很有钱", artist: "毛不易",     duration: "2:50", cover: "💰", color: "#f1c40f", full: true },
    { id: 28, nid: 2138072360, title: "夏天的风",         artist: "雯岚",            duration: "2:54", cover: "🎐", color: "#1abc9c", full: true },
    { id: 29, nid: 541131,     title: "大喜",             artist: "陶喆",            duration: "2:27", cover: "🎉", color: "#e67e22", full: true },
    { id: 30, nid: 421423806,  title: "小半",             artist: "陈粒",            duration: "4:57", cover: "🎤", color: "#9b59b6", full: true },
];

// ========== 全局状态 ==========
let currentUser = null;
let favorites = [];
let currentSongIndex = -1;
let currentSong = null; // 当前正在播放的歌曲对象
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
let showFavoritesOnly = false;
let isDragging = false;
let searchMode = false; // 是否在联网搜索模式
let searchResults = []; // 联网搜索结果
let searchTimer = null; // 搜索防抖定时器

// ========== DOM 元素 ==========
const $ = id => document.getElementById(id);

const loginPage      = $('loginPage');
const mainPage       = $('mainPage');
const loginForm      = $('loginForm');
const registerForm   = $('registerForm');
const audioPlayer    = $('audioPlayer');
const playBtn        = $('playBtn');
const prevBtn        = $('prevBtn');
const nextBtn        = $('nextBtn');
const shuffleBtn     = $('shuffleBtn');
const repeatBtn      = $('repeatBtn');
const progressFill   = $('progressFill');
const progressThumb  = $('progressThumb');
const progressContainer = $('progressContainer');
const progressBar    = progressContainer.querySelector('.progress-bar');
const currentTimeEl  = $('currentTime');
const totalTimeEl    = $('totalTime');
const albumDisc      = $('albumDisc');
const visualizer     = $('visualizer');
const currentSongName = $('currentSongName');
const currentArtist  = $('currentArtist');
const playlistEl     = $('playlist');
const searchInput    = $('searchInput');
const greetingEl     = $('greeting');
const songCountEl    = $('songCount');
const listTitleEl    = $('listTitle');
const favFilterBtn   = $('favFilterBtn');
const heartIcon      = $('heartIcon');
const logoutBtn      = $('logoutBtn');
const toast          = $('toast');

// ========== 工具函数 ==========
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function getUsers() {
    return JSON.parse(localStorage.getItem('musicPlayer_users') || '{}');
}

function saveUsers(users) {
    localStorage.setItem('musicPlayer_users', JSON.stringify(users));
}

function getFavoritesKey() {
    return `musicPlayer_favs_${currentUser}`;
}

function loadFavorites() {
    favorites = JSON.parse(localStorage.getItem(getFavoritesKey()) || '[]');
}

function saveFavorites() {
    localStorage.setItem(getFavoritesKey(), JSON.stringify(favorites));
}

function formatTime(sec) {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function parseDuration(str) {
    const [m, s] = str.split(':').map(Number);
    return m * 60 + s;
}

// ========== 登录 / 注册 ==========
$('showRegister').addEventListener('click', e => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

$('showLogin').addEventListener('click', e => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = $('loginUsername').value.trim();
    const password = $('loginPassword').value;
    const users = getUsers();

    if (!users[username]) {
        showToast('用户名不存在，请先注册');
        return;
    }
    if (users[username] !== password) {
        showToast('密码错误');
        return;
    }

    loginUser(username, $('rememberMe').checked);
});

registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = $('regUsername').value.trim();
    const password = $('regPassword').value;
    const confirm  = $('regPasswordConfirm').value;
    const users = getUsers();

    if (users[username]) {
        showToast('用户名已存在');
        return;
    }
    if (password !== confirm) {
        showToast('两次密码不一致');
        return;
    }

    users[username] = password;
    saveUsers(users);
    showToast('注册成功，已自动登录');
    loginUser(username, true);
});

function loginUser(username, remember) {
    currentUser = username;
    if (remember) {
        localStorage.setItem('musicPlayer_session', username);
    }
    loadFavorites();
    showMainPage();
}

function showMainPage() {
    loginPage.classList.remove('active');
    mainPage.classList.add('active');
    greetingEl.textContent = `Hi，${currentUser}`;
    renderPlaylist();
}

function showLoginPage() {
    mainPage.classList.remove('active');
    loginPage.classList.add('active');
    // 重置表单状态：显示登录表单，隐藏注册表单
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginForm.reset();
    registerForm.reset();
    audioPlayer.pause();
    isPlaying = false;
    updatePlayButton();
    albumDisc.classList.remove('playing');
    visualizer.classList.remove('active');
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('musicPlayer_session');
    currentUser = null;
    favorites = [];
    currentSongIndex = -1;
    showLoginPage();
    showToast('已退出登录');
});

// ========== 自动登录 ==========
function tryAutoLogin() {
    const session = localStorage.getItem('musicPlayer_session');
    if (session) {
        const users = getUsers();
        if (users[session]) {
            loginUser(session, true);
            return;
        }
    }
}

// ========== 播放列表渲染 ==========
function getActiveList() {
    // 联网搜索模式用搜索结果，否则用默认歌单
    return searchMode ? searchResults : SONGS;
}

function getSongsToShow() {
    let list = getActiveList();
    if (showFavoritesOnly) {
        list = list.filter(s => favorites.includes(s.nid));
    }
    return list;
}

function renderPlaylist(songsOverride) {
    const songs = songsOverride || getSongsToShow();
    songCountEl.textContent = `${songs.length}首`;

    if (songs.length === 0) {
        playlistEl.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎵</div>
                <p>${showFavoritesOnly ? '还没有收藏歌曲<br>点击歌曲旁的心形按钮添加收藏' : searchMode ? '未找到可完整播放的歌曲，换个关键词试试' : '没有找到匹配的歌曲'}</p>
            </div>`;
        return;
    }

    playlistEl.innerHTML = songs.map((song, idx) => {
        const isActive = currentSong && currentSong.nid === song.nid;
        const isFav = favorites.includes(song.nid);
        const badge = searchMode ? (song.full ? '<span class="badge-full">完整</span>' : '<span class="badge-trial">试听</span>') : '';
        return `
            <div class="song-item${isActive ? ' active' : ''}" data-nid="${song.nid}">
                <span class="song-rank">${idx + 1}</span>
                <div class="song-cover" style="background:${song.color}22; font-size:22px">${song.cover}</div>
                <div class="song-details">
                    <div class="song-title">${song.title} ${badge}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-actions">
                    <button class="fav-btn${isFav ? ' favorited' : ''}" data-nid="${song.nid}" title="收藏">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                    <span class="song-duration">${song.duration}</span>
                </div>
            </div>`;
    }).join('');

    // 绑定点击播放
    playlistEl.querySelectorAll('.song-item').forEach(el => {
        el.addEventListener('click', e => {
            if (e.target.closest('.fav-btn')) return;
            const nid = parseInt(el.dataset.nid);
            const list = getActiveList();
            const song = list.find(s => s.nid === nid);
            if (song) playSongDirect(song);
        });
    });

    // 绑定收藏
    playlistEl.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.dataset.nid));
        });
    });
}

// ========== 收藏 ==========
function toggleFavorite(nid) {
    const idx = favorites.indexOf(nid);
    if (idx > -1) {
        favorites.splice(idx, 1);
        showToast('已取消收藏');
    } else {
        favorites.push(nid);
        showToast('已添加到收藏 ❤️');
    }
    saveFavorites();
    renderPlaylist();
}

favFilterBtn.addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    heartIcon.textContent = showFavoritesOnly ? '❤️' : '♡';
    heartIcon.classList.toggle('active', showFavoritesOnly);
    listTitleEl.textContent = showFavoritesOnly ? '❤️ 我的收藏' : '🔥 抖音热歌榜';
    renderPlaylist();
});

// ========== 联网搜索 ==========
searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim();
    if (!keyword) {
        // 清空搜索框回到默认歌单
        searchMode = false;
        searchResults = [];
        listTitleEl.textContent = '🔥 抖音热歌榜';
        renderPlaylist();
        return;
    }

    // 防抖：300ms 后发起联网搜索
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => onlineSearch(keyword), 300);
});

async function onlineSearch(keyword) {
    listTitleEl.textContent = '🔍 搜索中...';
    try {
        const resp = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
        const data = await resp.json();
        searchResults = data.songs || [];
        searchMode = true;
        listTitleEl.textContent = `🔍 搜索"${keyword}"`;
        renderPlaylist();
    } catch (e) {
        showToast('搜索失败，请重试');
        listTitleEl.textContent = '🔥 抖音热歌榜';
    }
}

// ========== 播放控制 ==========
function playSongDirect(song) {
    currentSong = song;
    currentSongIndex = -1; // 兼容旧的索引逻辑

    currentSongName.textContent = song.title;
    currentArtist.textContent = song.artist;

    // 彻底重置音频元素
    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
    audioPlayer.load();

    // 通过本地代理获取网易云真实音频
    audioPlayer.src = `/api/song?id=${song.nid}`;

    // 更新 UI 状态
    isPlaying = true;
    updatePlayButton();
    albumDisc.classList.add('playing');
    visualizer.classList.add('active');

    audioPlayer.play().then(() => {
        showToast(`正在播放：${song.title}`);
    }).catch(err => {
        console.warn('播放失败:', err);
    });

    renderPlaylist();

    setTimeout(() => {
        const activeEl = playlistEl.querySelector('.song-item.active');
        if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function playSong(index) {
    if (index < 0 || index >= SONGS.length) return;
    playSongDirect(SONGS[index]);
}

function togglePlay() {
    if (!currentSong) {
        playSong(0);
        return;
    }
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        albumDisc.classList.remove('playing');
        visualizer.classList.remove('active');
    } else {
        audioPlayer.play().catch(() => {});
        isPlaying = true;
        albumDisc.classList.add('playing');
        visualizer.classList.add('active');
    }
    updatePlayButton();
}

function updatePlayButton() {
    playBtn.textContent = isPlaying ? '⏸' : '▶';
}

function getNextSong() {
    const list = getActiveList();
    if (list.length === 0) return null;
    if (!currentSong) return list[0];

    const curIdx = list.findIndex(s => s.nid === currentSong.nid);

    if (isShuffle) {
        let next;
        do { next = Math.floor(Math.random() * list.length); }
        while (next === curIdx && list.length > 1);
        return list[next];
    }
    return list[(curIdx + 1) % list.length];
}

function getPrevSong() {
    const list = getActiveList();
    if (list.length === 0) return null;
    if (!currentSong) return list[0];

    const curIdx = list.findIndex(s => s.nid === currentSong.nid);

    if (isShuffle) {
        let prev;
        do { prev = Math.floor(Math.random() * list.length); }
        while (prev === curIdx && list.length > 1);
        return list[prev];
    }
    return list[(curIdx - 1 + list.length) % list.length];
}

function playNext() {
    const song = getNextSong();
    if (song) playSongDirect(song);
}

function playPrev() {
    const song = getPrevSong();
    if (song) playSongDirect(song);
}

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    showToast(isShuffle ? '随机播放已开启' : '随机播放已关闭');
});

repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const labels = ['🔁', '🔁', '🔂'];
    const texts = ['循环已关闭', '列表循环', '单曲循环'];
    repeatBtn.textContent = labels[repeatMode];
    repeatBtn.classList.toggle('active', repeatMode > 0);
    showToast(texts[repeatMode]);
});

// ========== 进度条 ==========
audioPlayer.addEventListener('timeupdate', () => {
    if (isDragging) return;
    const pct = audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0;
    progressFill.style.width = pct + '%';
    progressThumb.style.left = pct + '%';
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 2) {
        audioPlayer.currentTime = 0;
        audioPlayer.play().catch(() => {});
    } else {
        playNext();
    }
});

audioPlayer.addEventListener('error', () => {
    const code = audioPlayer.error ? audioPlayer.error.code : 0;
    const msgs = {
        1: '播放被中断',
        2: '网络错误，音频加载失败',
        3: '音频解码失败',
        4: '音频源不可用',
    };
    showToast('播放失败: ' + (msgs[code] || '未知错误'));

    // 诊断：请求 API 看看返回什么
    if (currentSong) {
        fetch(`/api/song?id=${currentSong.nid}`).then(r => {
            if (!r.ok) return r.text();
            return 'API 返回状态: ' + r.status + ', Content-Type: ' + r.headers.get('content-type');
        }).then(t => console.warn('[音频诊断]', t)).catch(() => {});
    }
});

// 进度条拖动
function seekToPosition(e) {
    const rect = progressBar.getBoundingClientRect();
    let clientX = e.clientX;
    if (e.touches) clientX = e.touches[0].clientX;
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    if (audioPlayer.duration) {
        audioPlayer.currentTime = pct * audioPlayer.duration;
    }
    progressFill.style.width = (pct * 100) + '%';
    progressThumb.style.left = (pct * 100) + '%';
}

progressBar.addEventListener('mousedown', e => {
    isDragging = true;
    seekToPosition(e);
});
progressBar.addEventListener('touchstart', e => {
    isDragging = true;
    seekToPosition(e);
}, { passive: true });

document.addEventListener('mousemove', e => {
    if (isDragging) seekToPosition(e);
});
document.addEventListener('touchmove', e => {
    if (isDragging) seekToPosition(e);
}, { passive: true });

document.addEventListener('mouseup', () => { isDragging = false; });
document.addEventListener('touchend', () => { isDragging = false; });

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', e => {
    if (!mainPage.classList.contains('active')) return;
    if (e.target.tagName === 'INPUT') return;
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            playNext();
            break;
        case 'ArrowLeft':
            playPrev();
            break;
    }
});

// ========== 初始化 ==========
function init() {
    // 预置演示账号
    const users = getUsers();
    if (!users['admin']) {
        users['admin'] = '123456';
        saveUsers(users);
    }

    // 默认显示登录页
    loginPage.classList.add('active');

    // 尝试自动登录
    tryAutoLogin();
}

init();
