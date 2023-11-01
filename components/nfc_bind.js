import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { ALERT_BOX , BTN_CONNECT} from ".";
export default function nfc_bind({curAccount}) {
  console.log(curAccount)
    const [inputValue, setInputValue] = useState("");
    const [alertData, setAlertData] = useState(null);
    const [signature, setSignature] = useState("");
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        
    };

    const handleBindClick = async () => {
   
    const provider = window.ethereum === null?ethers.getDefaultProvider():new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 获取输入框内容并进行签名
    const secret_key = inputValue;
    const signature = await signer.signMessage(secret_key);
    setSignature(signature);
    const signerAddress = await signer.getAddress();

    try{
        const res = await axios.post("/api/api_bind", { secret_key, signerAddress, signature })
        setAlertData({ isSuccess: res.data.isSuccess, message: res.data.message });
    }catch(e){
        console.log(e)
    }
    
    };
  return (
    <div>
      <BTN_CONNECT account={curAccount}/>
        {alertData && (
        <ALERT_BOX
          isSuccess={alertData.isSuccess}
          message={alertData.message}
          onClose={() => setAlertData(null)}
        />
      )}    
      <div className="mx-auto max-w-7xl px-6 lg:px-8    ">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">绑定您的NFC</h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              输入NFC的激活码并与metamask账户进行绑定，我们将获取您的NFT数字资产，您可将数字资产导入NFC中。
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Secret key
              </label>
              <input
                id="email-address"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="请输入激活码"
                onChange={(e)=>{handleInputChange(e)}}
              />
              <button
                onClick={handleBindClick}
                type="submit"
                className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                激活并绑定
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center pl-16 ">
            <img
            src="/img/bind.png" 
            className="max-w-full h-auto lg:max-w-none"
            style={{ width: '800px', height: 'auto' }}
            />
        </div>
        </div>
      </div>
    </div>
  )
}
