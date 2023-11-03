import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function btn_connect() {

    const[curAccount,setCurAccount] = useState(null)
    useEffect(()=>{
        connect()
    },[])
    const connect = async()=>{
      console.log("connect")
        const provider = window.ethereum == null?ethers.getDefaultProvider():new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        setCurAccount(signerAddress)
        console.log(signerAddress)
    }

    const formatAccountAddress = (accountAddress, prefixLength = 5, suffixLength = 5)=> {

        const prefix = accountAddress.slice(0, prefixLength);
        const suffix = accountAddress.slice(-suffixLength);
      
        return `${prefix}····${suffix}`;
    }

  return (
    <div
      className="fixed top-4 right-4 flex items-center"
      style={{ zIndex: '9999' }}
    >
      
      <button
        className="bg-blue-500 font-bold text-white px-4 py-2 rounded-full hover:bg-blue-600"
        onClick={() => connect()}
      >
        {curAccount&&<FontAwesomeIcon icon="wallet" className="text-xl mr-2" />}
        {!curAccount?"Connect Wallet":formatAccountAddress(curAccount)}
      </button>
    </div>
  );
}
