import { v4 as uuidv4 } from 'uuid'; 
import { admin } from './db';
export default async(req,res)=>{

    if(req.method === 'GET'){
        const sessionId = req.query.sessionId
        const find_admin = await admin.findOne({session_id:sessionId})
        res.status(200).json({isValid:find_admin?true:false})
    }

    if(req.method === 'POST'){
        const {username,password} = req.body
        const find_admin = await admin.findOne({username:username,password:password})
        if(find_admin){
            const sessionId = uuidv4(); // 生成 UUID 作为会话标识
            find_admin.session_id = sessionId
            try{
                await find_admin.save()
                res.status(200).json({loginSuccess:true,message:`接收到${username},${password}的数据,会话id为:${sessionId}`,sessionId:sessionId})
            }catch(e){
                res.status(400).json({message:"服务器繁忙"})
            }
            
        }else{
            res.status(200).json({loginSuccess:false,message:"用户名或密码错误"})
        }
        
        
    }

}