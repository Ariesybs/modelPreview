import axios from "axios";
import React,{useEffect, useState} from "react";
import { ethers } from "ethers";
import { ALERT_BOX,BTN_CONNECT } from ".";
export default function NFTList ({curAccount}){
    const[categorizedNFTs,setCategorizedNFTs] = useState([])
    const[NFTCount,setNFTCount] = useState(0)
    const [selectedNFTs, setSelectedNFTs] = useState([]);
    const [alertData,setAlertData] = useState({})
    const [isShow,setIsShow] = useState(false)
    const [selectedNetwork, setSelectedNetwork] = useState(""); // 添加选择的区块链网络变量
    useEffect(()=>{
        fetchNFTs()
        
    },[selectedNetwork])

    const fetchNFTs =  async()=>{
        console.log(selectedNetwork)
        try{
            const res = await axios.get(`/api/api_nft?account=${curAccount}&network=${selectedNetwork}`)
        
        const NFTData = res.data.nfts
        console.log(NFTData)
        setNFTCount(NFTData.length)
        const NFTBinds = res.data.nft_binds
        const dic = {}
        NFTData.map((nft)=>{
            if(!dic[nft.contract.address]){
                dic[nft.contract.address] = {}
                dic[nft.contract.address].symbol = nft.contract.symbol
                dic[nft.contract.address].nft = []
            }
            dic[nft.contract.address].nft.push(nft)
        })

        const tamp = []
        const keys = Object.keys(dic)
        for (const key of keys) {
           tamp.push(dic[key])    
        }
        setCategorizedNFTs(tamp)
        setSelectedNFTs(NFTBinds)
    }catch(e){
        
    }
    }

    const Networks =  {
        ETH_MAINNET : "eth-mainnet",
        ETH_ROPSTEN : "eth-ropsten",
        ETH_GOERLI : "eth-goerli",
        ETH_KOVAN :"eth-kovan",
        ETH_RINKEBY : "eth-rinkeby",
        ETH_SEPOLIA : "eth-sepolia",
        OPT_MAINNET : "opt-mainnet",
        OPT_KOVAN : "opt-kovan",
        OPT_GOERLI : "opt-goerli",
        ARB_MAINNET : "arb-mainnet",
        ARB_RINKEBY : "arb-rinkeby",
        ARB_GOERLI :"arb-goerli",
        MATIC_MAINNET : "polygon-mainnet",
        MATIC_MUMBAI : "polygon-mumbai",
        ASTAR_MAINNET : "astar-mainnet",
        POLYGONZKEVM_MAINNET : "polygonzkevm-mainnet",
        POLYGONZKEVM_TESTNET : "polygonzkevm-testnet",
        BASE_MAINNET : "base-mainnet",
        BASE_GOERLI : "base-goerli"
    }
    const networkOptions = Object.entries(Networks).map(([key, value]) => ({
        value,
        label: key
      }));

    //NFT选择
    const selectClick = (address,tokenId,model)=>{
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
            { address, tokenId, model},
            ]);
        }
    
    }

    const handleNetworkChange = (event) => {
        const option = event.target.value
        if(option === "") return

        setSelectedNetwork(event.target.value);
      };

    //NFT绑定与导入
    const NFTBind = async()=>{        
        const provider = window.ethereum == null?ethers.getDefaultProvider():new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        const selectedNFTsString = JSON.stringify(selectedNFTs);
        const signature = await signer.signMessage(selectedNFTsString);
        try{
            const res = await axios.put('/api/api_nft',{selectedNFTs,signerAddress,signature,selectedNFTsString})
            const data =  {}
            data.isSuccess = res.data.isSuccess
            data.message = res.data.message
            setAlertData(data)
            setIsShow(true)
        }catch(e){

        }
    }

    const onClose = ()=>{
        setIsShow(false)
    }

    
    return (
        <div>
            <BTN_CONNECT/>
            <div className="container mx-auto mt-8">
                {isShow?<ALERT_BOX alertData = {alertData} onClose = {onClose}/>:""}
                <h1 className="text-5xl text-white font-semibold text-center mb-4">我的NFT</h1>
                <p className="text-1xl font-semibold text-center text-white pt-10 mb-4">选择您的NFT，并单击右下方按钮与您的NFC卡带进行绑定</p>
                <div>
                <h2 className="sr-only">NFTs</h2>
                <select
                    value={selectedNetwork}
                    onChange={handleNetworkChange}
                    className="fixed top-4 right-60 flex items-center appearance-none bg-white border rounded py-2 px-4 text-gray-700"
                    style={{ zIndex: '9999' }}
                >
                    <option value="">选择区块链网络</option>
                    {networkOptions.map(network => (
                        <option key={network.value} value={network.value}>{network.label}</option>
                    ))}
                </select>
                    <div >
                    {
                        categorizedNFTs.map((contract) => (
                            <div key={contract.symbol}>
                                <div className=" text-3xl font-semibold text-center text-white pt-10 mb-4">
                                {contract.symbol}
                                </div>
                                <div  className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
                                
                                {contract.nft.map((nft) => {
                                    const isSelected = selectedNFTs.some(
                                        (selectedItem) =>
                                        selectedItem.address === nft.contract.address && selectedItem.tokenId === nft.tokenId
                                    );
                                    return(
                                        <a key={`${nft.address}?id=${nft.tokenId}`} className="group">
                                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 relative">
                                        <img
                                        src={nft.rawMetadata.image}
                                        className={`h-48 w-48 cursor-pointer object-cover object-center group-hover:opacity-75 ${isSelected?"border-4 border-green-500":""}`}
                                        onClick={()=>{selectClick(nft.contract.address,nft.tokenId,nft.rawMetadata.model)}}
                                        />
                                        {isSelected && (
                                            <img
                                                src="/img/check.png" 
                                                alt="Check Icon"
                                                className="absolute top-0 right-0 m-2 h-8 w-8" 
                                            />
                                        )}
                                    </div>
                                    <h1 className="mt-2 text-2xl text-white text-center">{`${nft.contract.name} #${nft.tokenId}`}</h1>
                                    </a>

                                    
                                    )
                                    
                                })}
                                </div>
                                <button className="fixed bottom-10 right-10 rounded-full w-20 h-20 bg-blue-500 text-white p-2 flex flex-col justify-between items-center"
                                    onClick={NFTBind}
                                >
                                    <div className="text-center">
                                        {`${selectedNFTs.length}/${NFTCount}`}
                                    </div>
                                    <div className="text-center border-t pt-1">
                                        绑定
                                    </div>
                                </button>
                            </div>
                        ))
                    }
                        
                    </div>
                </div>
            </div>
        </div>
      )
};

