// pages/api/data/[id].js

export default (req, res) => {
    const { nftName,id } = req.query; // 通过 req.query 获取 URL 中的 id 参数
  
    // 根据 id 查询相应的 JSON 数据，这里可以模拟一个示例数据
    const path = `https://pencilvision.top/metadata/${nftName}/${id}.json`
  
    res.redirect(path)
  };
  