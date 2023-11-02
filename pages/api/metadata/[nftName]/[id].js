// pages/api/data/[id].js

export default (req, res) => {
    const { nftName,id } = req.query; // 通过 req.query 获取 URL 中的 id 参数
  
    
    const path = `https://pencilvision.top/metadata/${nftName}/${id}.json`
  
    res.redirect(path)
  };
  