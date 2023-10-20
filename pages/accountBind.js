import React, { useState } from 'react';  
import { ethers ,utils } from 'ethers';  
import axios from "axios"
  
const AccountBind = () => {  
  const [inputValue, setInputValue] = useState('');  
  const [signature, setSignature] = useState('');  
  
  const handleInputChange = (event) => {  
    setInputValue(event.target.value);  
  };  
  
  const handleBindClick = async () => {  

    let signer = null;

    let provider;
    if (window.ethereum == null) {

        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed so are
        // only have read-only access
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()

    } else {

        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum)

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        signer = await provider.getSigner();

        // 获取输入框内容并进行签名  
        const secretKey = inputValue;  
        const signature = await signer.signMessage(secretKey); 
        setSignature(signature); 
        const signerAddress = await signer.getAddress();
       
        console.log(signerAddress)

        axios.post('/api/NFCBind',{secretKey,signerAddress,signature}).then(response=>{
            console.log(response.data.message)
            console.log(response.data.data)
        })
    }
    // try {  
    //     // 连接 Meta Mask  
    //     const web3Provider = new ethers.providers.Web3Provider(window.ethereum);  
        
    //     const accounts = await web3Provider.send("eth_requestAccounts", [])

    //     // 获取签名者  
    //     const signer = web3Provider.getSigner();  
        
    //     // 获取输入框内容并进行签名  
    //     const secretKey = inputValue;  
    //     const signature = await signer.signMessage(secretKey);  
        
    //     setSignature(signature);  

    //     const signerAddress = await signer.getAddress();
    //     //调用接口
    //     // axios.post('/api/NFCBind',{secretKey,signerAddress,signature}).then(response=>{
    //     //     console.log(response)
    //     // })

    //     // 验证签名  
    //     const { utils } = require('ethers');
        
    //     const recoveredAddress = utils.verifyMessage(secretKey, signature);
    //     console.log(recoveredAddress)
    //   } catch (error) {  
    //     console.error(error);  
    //   }
  };  
  
  return (  
    <div>  
      <input type="text" value={inputValue} onChange={handleInputChange} />  
      <button onClick={handleBindClick}>绑定</button>  
      <p>签名: {signature}</p>  
    </div>  
  );  
};  
  
export default AccountBind;