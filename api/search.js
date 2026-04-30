// 最简单测试：不依赖 node-fetch
module.exports = async (req, res) => {
    res.json({ songs: [], message: 'API search function is working!' });
};
