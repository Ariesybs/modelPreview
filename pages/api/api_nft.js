import { bind } from "./db"
import {Alchemy,Network} from 'alchemy-sdk'
import { ethers } from "ethers";
require("dotenv").config()
export default async (req,res)=>{
    const config = {
        apiKey: process.env.ALCHEMY_API_KEY, // API Key
        network: Network.ETH_SEPOLIA, // 区块链网络
    };

    const alchemy = new Alchemy(config);
    
    if(req.method === 'GET'){
        const account = req.query.account 
        //检测是否绑定
        const find_bind = await bind.findOne({account_bind:account})
        //获取用户NFT列表
        const data = await alchemy.nft.getNftsForOwner(account)
        const nfts = data.ownedNfts        
        res.status(200).json({isBind:find_bind!==null,nfts:nfts})

    }

    
    if(req.method === 'PUT'){
        const {selectedNFTs,signerAddress,signature,selectedNFTsString} = req.body
        const recoveredAddress = ethers.verifyMessage(selectedNFTsString, signature);
        if(recoveredAddress!==signerAddress){
            res.status(200).json({isSuccess:false,message:"签名验证失败"})
            return
        }

        const find_bind = bind.findOne({account_bind:signerAddress})
        if(find_bind===null){
            res.status(200).json({isSuccess:false,message:"该账户尚未绑定NFC"})
            return
        }
        try{
            //更新数据
            await bind.updateOne({account_bind:signerAddress},{nft_binds:selectedNFTs})

            res.status(200).json({ isSuccess: true, message: "NFC数据更新成功" });
               
        }catch(e){
            res.status(500).json({ isSuccess: false, message: "更新时出现错误" });
        }

    }
}