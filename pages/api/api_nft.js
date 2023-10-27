import { bind } from "./db"
import {Alchemy,Network} from 'alchemy-sdk'
require("dotenv").config()
export default async (req,res)=>{
    const config = {
        apiKey: process.env.ALCHEMY_API_KEY, // API Key
        network: Network.ETH_SEPOLIA, // 区块链网络
    };

    const alchemy = new Alchemy(config);
    if(req.method === 'GET'){
        const nfc_id = req.query.id
        const find_bind = await bind.findOne({nfc_id:nfc_id})
        if(!find_bind){
            res.status(404).json({message:"该NFC尚未绑定"})
            return
        }

        const account = find_bind.account_bind
        
        const data = await alchemy.nft.getNftsForOwner(account)
        const nfts = data.ownedNfts
        const nftIds = []
        for (let i = 0; i < nfts.length; i++) {
            if(nfts[i].contract.address!=='0x6709f7f16d7c4969244e900854f45a8c0738793d') continue
            nftIds.push(nfts[i].tokenId)
        }
        res.status(200).json({nftIds})

    }

    if(req.method === 'POST'){
        const {account} = req.body
        const data = await alchemy.nft.getNftsForOwner(account)
        const nfts = data.ownedNfts
        res.status(200).json({nfts})
    }
}