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
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);

      signer = await provider.getSigner();

      // 获取输入框内容并进行签名
      const secretKey = inputValue;
      const signature = await signer.signMessage(secretKey);
      setSignature(signature);
      const signerAddress = await signer.getAddress();

      console.log(signerAddress);

      axios
        .post("/api/NFCBind", { secretKey, signerAddress, signature })
        .then((response) => {
          console.log(response.data.message);
          console.log(response.data.savedNFC);
        });
    }
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
