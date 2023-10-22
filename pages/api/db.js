// db.js
import mongoose from "mongoose";

// 连接字符串
const uri =
  "mongodb+srv://1575577205:admin@cluster0.nzrcitw.mongodb.net/NFC?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
});

export const NFC = mongoose.model("NFC", {
  secretKey: String,
  signerAddress: String,
  signature: String,
  recoveredAddress: String,
  flag: Boolean,
});
