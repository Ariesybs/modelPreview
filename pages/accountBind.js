import React, { useState ,useEffect} from "react";
import { ethers } from "ethers";
import axios from "axios";
import{NFC_BIND,NFT_LIST} from '../components'
const AccountBind = () => {

  const [curAccount,setCurAccount] = useState(null);

  const [isBind,setIsBind] = useState(false);
  
  const [NFTData,setNFTData] = useState();
  useEffect(()=>{
    checkAccount();
    // 实时监听MetaMask账户变化
    ethereum.on('accountsChanged', checkAccount);
  },[curAccount])

  const checkAccount = async()=>{
    let provider;
    if (window.ethereum == null) {
        provider = ethers.getDefaultProvider();
    } else {
        provider = new ethers.BrowserProvider(window.ethereum);
    }

    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    checkIsBind(account);
    setCurAccount(account);
  }

  
  const checkIsBind = async(account)=>{
    try{
        const res = await axios.get(`/api/api_nft?account=${account}`)
        setIsBind(res.data.isBind)
        setNFTData(res.data.nfts)
    }catch(e){

    }
}

  return (
    <>
    <div className="relative isolate overflow-hidden flex justify-center items-center min-h-screen bg-gray-900 py-16 sm:py-24 lg:py-32">
      {
        isBind?<NFT_LIST NFTData={NFTData} />:<NFC_BIND/>
      }
      
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
    
    </>
    

  );
  
  
};

export default AccountBind;
