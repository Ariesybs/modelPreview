import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async() => {

    try{
        const res = await axios.post('/api/api_admin_login',{username,password})
        if(!res.data.loginSuccess){
            alert(res.data.message)
            return
        }
        //session数据保存
        localStorage.setItem("sessionId",res.data.sessionId)
        router.push('/NFCManager');

    }catch(e){
        console.log("请求错误")
    }
    
  };

  return (
    <div>
      <h1>管理员登陆</h1>
      <input
        type="text"
        placeholder="用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>登陆</button>
    </div>
  );
}
