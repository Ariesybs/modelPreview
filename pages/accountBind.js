import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const AccountBind = () => {
  const [inputValue, setInputValue] = useState("");
  const [signature, setSignature] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleBindClick = async () => {
    let signer = null;

    let provider;
    if (window.ethereum == null) {
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);

      signer = await provider.getSigner();

      // 获取输入框内容并进行签名
      const secret_key = inputValue;
      const signature = await signer.signMessage(secret_key);
      setSignature(signature);
      const signerAddress = await signer.getAddress();

      try{
        const res = await axios.post("/api/api_bind", { secret_key, signerAddress, signature })
        alert(res.data.message)
      }catch(e){
        alert(e.response.data.message)
      }

    }
  };

  return (
    <div>
      <input type="text" placeholder="请输入NFC激活码" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleBindClick}>绑定</button>
      <p>签名: {signature}</p>
    </div>
  );
};

export default AccountBind;
