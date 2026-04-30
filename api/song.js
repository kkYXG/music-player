// 最简单测试：不依赖 node-fetch，直接返回文本
module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send('API song function is working! id=' + (req.query.id || 'none'));
};
