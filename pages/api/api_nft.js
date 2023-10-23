import { bind } from "./db"
import {Alchemy,Network} from 'alchemy-sdk'
require("dotenv").config()
export default async (req,res)=>{
    if(req.method === 'GET'){
        const nfc_id = req.query.id
        const find_bind = await bind.findOne({nfc_id:nfc_id})
        if(!find_bind){
            res.status(404).json({message:"该NFC尚未绑定"})
            return
        }

        const account = find_bind.account_bind
        const config = {
            apiKey: process.env.ALCHEMY_API_KEY, // API Key
            network: Network.ETH_SEPOLIA, // 区块链网络
        };

        const alchemy = new Alchemy(config);
        const nfts = await alchemy.nft.getNftsForOwner(account)
        res.status(200).json({nfts})


    }
}