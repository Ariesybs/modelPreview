import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { ALERT_BOX } from ".";
import { BTN_CONNECT ,BTN_HONEPAGE} from "../components";
export default function nfc_unbind() {

  const[curAccount,setCurAccount] = useState()
  const[isBind,setIsBind] = useState(false)
  const[nfcBind,setNfcBind] = useState()
  useEffect(()=>{
    checkAccount()
    ethereum.on('accountsChanged', checkAccount);
  },[curAccount])
  const checkAccount = async()=>{
    if (isMobileDevice()) {
      // 手机用户的处理逻辑
      console.log("手机用户无法使用 Metamask");
      return;
    }
    const provider = window.ethereum == null?ethers.getDefaultProvider():new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    setCurAccount(signerAddress)
    const res = await axios.get(`/api/api_bind?account=${signerAddress}`)
    console.log(res.data)
    setIsBind(res.data!==null)
    setNfcBind(res.data===null?null:res.data.nfc_id)
  }

  function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      'iphone',
      'ipod',
      'android',
      'blackberry',
      'windows phone'
    ];
  
    return mobileKeywords.some(keyword => userAgent.includes(keyword));
  }
  

  return (

    <div className="relative isolate overflow-hidden flex justify-center items-center min-h-screen bg-gray-900 py-16 sm:py-24 lg:py-32">
     <div>
     <BTN_CONNECT/>
      <BTN_HONEPAGE/>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">解绑您的NFC</h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              {
                isBind?(
                  `当前账户与ID为 ${nfcBind} 的NFC进行绑定，解绑操作将会解除您的NFC与MetaMask账户的关联，该NFC绑定的所有NFT资产将在游戏中不可用。`
                ):(
                  `当前账户未与任何NFC进行绑定，请点击下列按钮进行绑定。`
                )
              }
              
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Secret key
              </label>
              {
                isBind?(
                  <button
                    className=" flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    解绑
                  </button>
                ):
                (
                <a
                  href="/accountBind"
                  className=" flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  去绑定
                </a>
                )
              }
              
              
            </div>
          </div>
          <div className="flex justify-center items-center pl-16 ">
            <img
            src="/img/unbind.png" 
            className="max-w-full h-auto lg:max-w-none"
            style={{ width: '800px', height: 'auto' }}
            />
        </div>
        </div>
      </div>
      </div>
      
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
  )
}
