import { NFC } from "./db"
export default async (req,res)=>{
    //获取NFC列表
    if(req.method === 'GET'){
        const nfcs = await NFC.find({})
        res.status(200).json(nfcs)
    }

    //增加NFC
    if(req.method === "POST"){
        const {id,secret_key} = req.body

        const find_id = await NFC.findOne({id:id})
        if(find_id){
            res.status(400).json({message:"id已存在"})
            return
        }
        const find_secret_key = await NFC.findOne({secret_key:secret_key})
        if(find_secret_key){
            res.status(400).json({message:"密钥已存在"})
            return
        }

        const newNFC = new NFC({
            id:id,
            secret_key:secret_key
        })

        try{
            await newNFC.save()
            res.status(200).json({message:"数据保存成功"})
        }catch(e){
            res.status(400).json({message:"数据保存失败"})
        }
    }

    //删除NFC
    if(req.method === "DELETE"){
        const id = req.query.id;
        const find_id = await NFC.findOne({id:id})
        if(!find_id){
            res.status(404).json({message:`id为${id}的NFC不存在`})
            return
        }
        try{
            await NFC.deleteOne({id:id})
            res.status(200).json({message:`删除id为${id}的NFC成功`})
        }catch(e){
            res.status(400).json({message:`删除id为${id}的NFC失败`})
        }
        
        
    }
}