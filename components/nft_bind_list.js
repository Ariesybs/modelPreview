import { useEffect,useState } from "react";
import axios from "axios";
export default function nft_bind_list(props){
    const {account} = props
    console.log(account)
    const [categorizedNFTs, setCategorizedNFTs] = useState({});
    const [selectedNFTs, setSelectedNFTs] = useState([]);
    useEffect(()=>{
      setSelectedNFTs([])
      loadNFTs(account)
    },[account])

    
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

        console.log(selectedNFTs)
    
    }

    return(<>
        {Object.entries(categorizedNFTs).map(([address, data]) => {
        // 使用 filter 过滤满足条件的 NFT
        const selectedNFTsForAddress = selectedNFTs.filter(
          (selectedItem) => selectedItem.address === address
        );
  
        return (
          <div key={address} className="mb-4">
            <h3 className="text-xl font-semibold">
              {data.symbol}  已选  {`${selectedNFTsForAddress.length}/${data.nft.length}`}
            </h3>
            <div className="flex flex-wrap -mx-2">
              {data.nft.map((item) => {
                const isSelected = selectedNFTs.some(
                  (selectedItem) =>
                    selectedItem.address === address && selectedItem.tokenId === item.tokenId
                );
                return (
                  <div
                    key={item.tokenId}
                    className={`w-36 h-36 m-2 rounded-lg border-4 ${
                      isSelected ? 'border-green-500' : 'border-gray-300'
                    } cursor-pointer bg-cover bg-center`}
                    style={{ backgroundImage: `url(${item.image})` }}
                    onClick={() => selectClick(address, item.tokenId)}
                    
                  >
                    {isSelected && (
                      <img
                        src={'/img/check.png'}
                        alt="Selected"
                        className="absolute top-0 left-32 w-9 h-9"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>)
    

}