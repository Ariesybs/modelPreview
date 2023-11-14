import { ethers } from "ethers";
import { bind } from "./db";
import { NFC } from "./db";
export default async (req, res) => {

  if(req.method === 'GET'){
    const account = req.query.account
    const data = await bind.findOne({account_bind:account})
    res.status(200).json(data)
  }

  if (req.method === "POST") {
    const { secret_key, signerAddress, signature } = req.body;
    const recoveredAddress = ethers.verifyMessage(secret_key, signature);
    const flag = recoveredAddress === signerAddress;
    if(!flag){
      res.status(200).json({isSuccess:false, message: "签名验证失败" });
      return
    }

    const nfc = await NFC.findOne({ secret_key: secret_key });
    if (nfc===null||nfc.status) {
      res.status(200).json({isSuccess:false, message: "激活码无效" });
      return;
    }

    const find_bind = await bind.findOne({account_bind:signerAddress})
    if(find_bind){
      res.status(200).json({isSuccess:false, message: `该账户已与id为${find_bind.nfc_id}的NFC进行绑定,请解绑后再操作` });
      return
    }

    const newBind = new bind({
      nfc_id:nfc.id,
      account_bind:signerAddress,
      signature:signature,
      act_time:Date.now()
    })
    nfc.status = true
    nfc.account_bind = signerAddress
    nfc.act_time = Date.now()
    try{
      await newBind.save()
      await nfc.save()
      res.status(200).json({isSuccess:true,message:"账户绑定成功"})
    }catch(e){
      res.status(200).json({isSuccess:false,message:"账户绑定失败"})
    }

    
  }

  if(req.method === "DELETE"){
    const nfc_id = req.query.id
    const nfc = await NFC.findOne({id:nfc_id})
    nfc.status = false
    nfc.account_bind = ""
    try{
      await bind.deleteOne({nfc_id:nfc_id})
      await nfc.save()
      res.status(200).json({isSuccess:true,message:"账户解绑成功"})
    }catch(e){
      res.status(200).json({isSuccess:false,message:"账户解绑失败"})
    }
  }
};
