// db.js
import mongoose from "mongoose";

require('dotenv').config(); // 读取并配置环境变量

// 连接字符串
const uri =process.env.DATABASE_URL;


mongoose.connect(uri, {
  useNewUrlParser: true,
  
});

export const bind = mongoose.models.bind?mongoose.models.bind: mongoose.model("bind", {
  nfc_id: String,
  account_bind: String,
  signature: String,
  act_time:Date
},"bind");

export const NFC = mongoose.models.NFC?mongoose.models.NFC: mongoose.model("NFC",{
  id:{
    type:String,
    require:true
  },
  secret_key:{
    type:String,
    require:true
  },
  status:{
    type:Boolean,
    default:false
  },
  account_bind:{
    type:String,
    default:""
  },
  act_time:{
    type:Date,
    default:Date.now()
  },
  out_time:{
    type:Date,
    default:Date.now()
  }
},"nfcs")

export const admin = mongoose.models.admin?mongoose.models.admin:mongoose.model("admin",{
  username:String,
  password:String,
  session_id:String
},"admin")
