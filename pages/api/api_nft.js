import { bind } from "./db"
import {Alchemy,Network} from 'alchemy-sdk'
import { ethers } from "ethers";
require("dotenv").config()
export default async (req,res)=>{
    
    
    if(req.method === 'GET'){
        //根据账户查找
        const account = req.query.account 
        const network = req.query.network
        const apiKeyDick = {
            "eth-sepolia":process.env.SEPOLIA_API_KEY,
            "polygonzkevm-testnet":process.env.POLYGON_TEST_API_KEY
        }

        const config = {
            apiKey: apiKeyDick[network], // API Key
            network: network, // 区块链网络
        };
    
        const alchemy = new Alchemy(config);
        if(account){
            //检测是否绑定
            const find_bind = await bind.findOne({account_bind:account})
            //获取用户NFT列表
            const data = await alchemy.nft.getNftsForOwner(account)
            const nfts = data.ownedNfts        
            res.status(200).json({
                isBind:find_bind!==null,
                nfts:nfts,
                nft_binds:find_bind===null?null:find_bind.nft_binds
            })
        }
        

        //根据NFC_ID查找
        const nfc_id = req.query.nfc_id
        if(nfc_id){
            const find_bind = await bind.findOne({nfc_id:nfc_id})
            res.status(200).json(find_bind.nft_binds)
        }
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