import { useState, useEffect } from 'react';
import axios from 'axios';

const NFC = () => {
  const [nfcList, setNfcList] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    secret_key: '',
    status: false,
    act_time: '',
    account_bind: '',
  });

  useEffect(() => {
    //fetchNFCList();
  }, []);

  const fetchNFCList = async () => {
    try {
      const response = await axios.get('/api/nfc');
      setNfcList(response.data);
    } catch (error) {
      console.error('获取NFC列表时出现错误：', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/nfc', formData);
      setFormData({
        id: '',
        secret_key: '',
        status: false,
        act_time: '',
        account_bind: '',
      });
      fetchNFCList();
    } catch (error) {
      console.error('创建NFC时出现错误：', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/nfc/`);
      fetchNFCList();
    } catch (error) {
      console.error('删除NFC时出现错误：', error);
    }
  };

  return (
    <div>
      <h1>NFC管理页面</h1>
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
        <label>
          状态:
          <input type="checkbox" name="status" checked={formData.status} onChange={handleCheckboxChange} />
        </label>
        <br />
        <label>
          激活时间:
          <input type="date" name="act_time" value={formData.act_time} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          绑定账户:
          <input type="text" name="account_bind" value={formData.account_bind} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">添加</button>
      </form>
      <h2>NFC列表</h2>
      <ul>
        {nfcList.map((nfc) => (
          <li key={nfc._id}>
            ID: {nfc.id}, 密钥: {nfc.secret_key}, 状态: {nfc.status ? '启用' : '禁用'}, 激活时间: {nfc.act_time}, 绑定账户: {nfc.account_bind}
            <button onClick={() => handleDelete(nfc._id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NFC;
