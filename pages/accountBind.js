import React, { useState ,useEffect} from "react";
import { ethers } from "ethers";
import axios from "axios";

const AccountBind = () => {

  const [curAccount,setCurAccount] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [signature, setSignature] = useState("");
  const [categorizedNFTs, setCategorizedNFTs] = useState({});
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  
  useEffect(()=>{
    checkAccount();
  },[])

  const checkAccount = async()=>{
    let provider;
    if (window.ethereum == null) {
        provider = ethers.getDefaultProvider();
    } else {
        provider = new ethers.BrowserProvider(window.ethereum);
    }

    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    loadNFTs(account)
    setCurAccount(account);
  }
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const loadNFTs =async(account)=>{
    try{
      const res = await axios.post('/api/api_nft',{account})
      const nfts = res.data.nfts
      // 根据合约地址分类 NFT
      const categorizedNFTs = {};
      nfts.forEach((nft) => {
        
        const {contract:{address,symbol},rawMetadata:{image},tokenId} = nft
        if(!categorizedNFTs[address]){
          categorizedNFTs[address] = {}
          categorizedNFTs[address].symbol = symbol
          categorizedNFTs[address].nft=[]
          
        }
        categorizedNFTs[address].nft.push({tokenId:tokenId,image:image})
      });
      setCategorizedNFTs(categorizedNFTs)
      console.log(categorizedNFTs)
      
    }catch(e){

    }
  }

  const selectClick = (address,tokenId)=>{
    const isSelected = selectedNFTs.some(
      (selectedItem) =>
        selectedItem.address === address && selectedItem.tokenId === tokenId
    );
    if (isSelected) {
      // 如果已选中，则从数组中移除
      setSelectedNFTs((prevSelectedNFTs) =>
        prevSelectedNFTs.filter(
          (selectedItem) =>
            selectedItem.address !== address || selectedItem.tokenId !== tokenId
        )
      );
    } else {
      // 如果未选中，则添加到数组
      setSelectedNFTs((prevSelectedNFTs) => [
        ...prevSelectedNFTs,
        { address, tokenId },
      ]);
    }

  }

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
  
      {Object.entries(categorizedNFTs).map(([address, data]) => {
        // 使用 filter 过滤满足条件的 NFT
        const selectedNFTsForAddress = selectedNFTs.filter(
          (selectedItem) => selectedItem.address === address
        );
  
        return (
          <div key={address}>
            <h3>
              {data.symbol}  已选  {`${selectedNFTsForAddress.length}/${data.nft.length}`}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.nft.map((item) => {
                const isSelected = selectedNFTs.some(
                  (selectedItem) =>
                    selectedItem.address === address && selectedItem.tokenId === item.tokenId
                );
                return (
                  <div
                    key={item.tokenId}
                    style={{
                      width: '150px',
                      height: '150px',
                      margin: '10px',
                      borderRadius: '10px',
                      border: `5px solid ${isSelected ? 'green' : '#ccc'}`,
                      cursor: 'pointer',
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    onClick={() => selectClick(address, item.tokenId)}
                    
                  >
                    {isSelected && (
                      <img
                        src={'/img/check.png'}
                        alt="Selected"
                        style={{
                          position: 'relative',
                          top: 0,
                          right: 0,
                          width: '24px',
                          height: '24px',
                        }}
                      />
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
  
  
};

export default AccountBind;
