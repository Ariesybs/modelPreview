import React, { useState ,useEffect} from "react";
import { ethers } from "ethers";
import axios from "axios";
import{NFT_BIND_LIST,NFC_BIND,NFT_LIST} from '../components'
const AccountBind = () => {

  const [curAccount,setCurAccount] = useState(null);

  const [isBind,setIsBind] = useState(false);
  
  const nftData = [
    {
      id: 1,
      name: 'Earthen Bottle',
      href: '#',
      price: '$48',
      imageSrc: '/img/box.jpg',
      imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
    },
    {
      id: 2,
      name: 'Nomad Tumbler',
      href: '#',
      price: '$35',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
      imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
    },
    {
      id: 3,
      name: 'Focus Paper Refill',
      href: '#',
      price: '$89',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
      imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
    },
    {
      id: 4,
      name: 'Machined Mechanical Pencil',
      href: '#',
      price: '$35',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
      imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
    },
    
  ];
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
        const res = await axios.get(`/api/api_nft?id=${account}`)
        setIsBind(res.data.isBind)
    }catch(e){

    }
}

  return (
    <>
    <div className="relative isolate overflow-hidden flex justify-center items-center min-h-screen bg-gray-900 py-16 sm:py-24 lg:py-32">
      {/* <NFC_BIND/> */}
      <div className="container mx-auto mt-8">
      <h1 className="text-5xl text-white font-semibold text-center mb-4">我的NFT列表</h1>
      <NFT_LIST nftData={nftData} />
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
    
    </>
    

  );
  
  
};

export default AccountBind;
