import {abi,address,rpc} from "./data"
import { ethers } from "ethers"
export default async(req,res)=>{

    if(req.method === "GET" ){
        const account = req.query.account
        const privateKey = process.env.PRIVATE_KEY;
        const wallet = new ethers.Wallet(privateKey);
        const provider = new ethers.JsonRpcProvider(rpc);
        const connectedWallet = wallet.connect(provider);
        const contract = new ethers.Contract(address, abi, connectedWallet);
        try{
            const tx = await contract.mint(account);
            await tx.wait(); 
            res.status(200).json({message:"NFT铸造完成"})
        }catch(e){
            res.status(500)
        }
           
    }
    


}