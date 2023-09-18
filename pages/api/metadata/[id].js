// pages/api/data/[id].js

export default (req, res) => {
  const { id } = req.query; // 通过 req.query 获取 URL 中的 id 参数

  // 根据 id 查询相应的 JSON 数据，这里可以模拟一个示例数据
  const jsonData = {
      "name":"weapon"+id,
      "description":"this is a useful weapon,please keep it safe",
      "image":"https://www.pencilvision.top/img/box.jpg",
      "animation_url":"https://pencilvision.top/model/"+id
  };

  res.status(200).json(jsonData);
};
