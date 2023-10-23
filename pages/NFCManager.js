import { useState, useEffect } from 'react';
import axios from 'axios';

const NFC = () => {
  const [nfcList, setNfcList] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    secret_key: '',
  });

  useEffect(() => {
    fetchNFCList();
  }, []);

  const fetchNFCList = async () => {
    try {
      const response = await axios.get('/api/api_nfc');
      console.log(response.data)
      setNfcList(response.data);
    } catch (error) {
      console.error('获取NFC列表时出现错误：', error);
      
    }
  };

  const handleInputChange = (e) => {

    const data = {
      ...formData,
      [e.target.name]: e.target.value
    }
    
    setFormData(data);

    
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const res = await axios.post('/api/api_nfc', formData);
      console.log(res.data.message)
      setFormData({
        id: '',
        secret_key: '',
      });
      fetchNFCList();
    } catch (error) {
      console.error('创建NFC时出现错误：', error);
      alert(error.response.data.message)
    }
  };

  const handleDelete = async (id) => {
    if(!confirm(`确定删除id为${id}的NFC?`))return
    try {
      const res = await axios.delete(`/api/api_nfc?id=${id}`);
      console.log(res.data.message)
      fetchNFCList();
    } catch (error) {
      console.error('删除NFC时出现错误：', error);
    }
  };

  return (
    <div>
      <h1>NFC管理</h1>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="number" name="id" value={formData.id} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          密钥:
          <input type="text" name="secret_key" value={formData.secret_key} onChange={handleInputChange} />
        </label>
        <br />
        <br />
        <button type="submit">添加</button>
      </form>
      <h2>NFC列表</h2>
      <ul>
        {nfcList.map((nfc) => (
          <li key={nfc._id}>
            ID: {nfc.id}, 密钥: {nfc.secret_key}, 状态: {nfc.status ? '激活' : '未激活'}, 激活时间: {nfc.status ? nfc.act_time:""},出厂时间:{nfc.out_time}, 绑定账户: {nfc.account_bind}
            <button onClick={() => handleDelete(nfc.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NFC;
