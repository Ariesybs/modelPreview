import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

export default function UnbindPage() {
    const [currentAccount, setCurrentAccount] = useState('');
    const [bindingInfo, setBindingInfo] = useState(null);

    useEffect(() => {
        // 监听MetaMask账户变化
        async function checkAccount() {
            let provider;
            if (window.ethereum == null) {
                provider = ethers.getDefaultProvider();
            } else {
                provider = new ethers.BrowserProvider(window.ethereum);
            }

            const signer = await provider.getSigner();
            const curAccount = await signer.getAddress();
            setCurrentAccount(curAccount);
            getBindingInfo(curAccount);
        }

        // 初始页面加载时检查账户
        checkAccount();

        // 实时监听MetaMask账户变化
        const accountsChangedHandler = (accounts) => {
            checkAccount();
        };

        ethereum.on('accountsChanged', accountsChangedHandler);

        // 清理事件侦听器
        return () => {
            ethereum.removeListener('accountsChanged', accountsChangedHandler);
        };
    }, []);

    // 发送GET请求获取绑定信息
    async function getBindingInfo(account) {
        try {
            const res = await axios.get(`/api/api_bind?account=${account}`);
            console.log(res)
            setBindingInfo(res.data);
        } catch (e) {
            console.log("获取数据失败", e);
        }
    }

    // 发送DELETE请求解绑NFC
    async function unbindNFC(nfc_id) {
        if(!confirm("确定解绑?"))return
        if(currentAccount&&bindingInfo){
            try{
                const res = await axios.delete(`/api/api_bind?id=${nfc_id}`)
                alert(res.data.message)
                getBindingInfo(currentAccount)
            }catch(e){

            }
        }
    }

    return (
        <div>
            <h1>解除绑定</h1>
            <p>当前MetaMask账户: {currentAccount}</p>
            {bindingInfo ? (
                <div>
                    <p>NFC ID: {bindingInfo.nfc_id}</p>
                    <p>绑定账户: {bindingInfo.account_bind}</p>
                    <p>绑定时间: {bindingInfo.act_time}</p>
                    <button onClick={()=>{unbindNFC(bindingInfo.nfc_id)}}>解绑</button>
                </div>
            ) : (
                <p>当前账户未绑定任何NFC。<a href='/accountBind'>去绑定</a></p>
            )}
        </div>
    );
}
