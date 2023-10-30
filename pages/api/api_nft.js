import { bind } from "./db"
import {Alchemy,Network} from 'alchemy-sdk'
require("dotenv").config()
export default async (req,res)=>{
    const config = {
        apiKey: process.env.ALCHEMY_API_KEY, // API Key
        network: Network.ETH_SEPOLIA, // 区块链网络
    };

    const alchemy = new Alchemy(config);
    //检测是否绑定
    if(req.method === 'GET'){
        const nfc_id = req.query.id
        const find_bind = await bind.findOne({nfc_id:nfc_id})        
        res.status(200).json({isBind:find_bind===null})

    }

    //获取用户NFT列表
    if(req.method === 'POST'){
        const {account} = req.body
        const data = await alchemy.nft.getNftsForOwner(account)
        const nfts = data.ownedNfts
        res.status(200).json({nfts})
    }
}