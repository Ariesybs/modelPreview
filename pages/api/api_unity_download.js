import {Alchemy,Network} from 'alchemy-sdk'
require("dotenv").config()

export default async(req,res)=>{

    const config = {
        apiKey: process.env.ALCHEMY_API_KEY, // API Key
        network: Network.ETH_SEPOLIA, // 区块链网络
    };

    const alchemy = new Alchemy(config);

    if(req.method === "GET"){
        const address = req.query.address
        const tokenId = req.query.tokenId
        const metadata = await alchemy.nft.getNftMetadata(address,tokenId)
        
    }

}