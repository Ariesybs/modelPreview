import { ethers } from "ethers";
import { NFC } from "./db";

export default async (req, res) => {
  if (req.method === "POST") {
    const { secretKey, signerAddress, signature } = req.body;
    const recoveredAddress = ethers.verifyMessage(secretKey, signature);
    const flag = recoveredAddress === signerAddress;
    const result = await NFC.findOne({ secretKey: secretKey });
    if (result) {
      res.status(200).json({ message: "激活码已存在" });
      return;
    }
    if (flag) {
      const newNFC = new NFC({
        secretKey: secretKey,
        signerAddress: signerAddress,
        signature: signature,
        recoveredAddress: recoveredAddress,
        flag: flag,
      });

      try {
        const savedNFC = await newNFC.save();
        res.status(200).json({
          message: `接收到数据,激活码:${secretKey},签名者:${signerAddress},签名消息:${signature},验证地址:${recoveredAddress},是否有效:${flag}`,
          savedNFC: savedNFC, // 返回保存后的文档
        });
      } catch (err) {
        res.status(500).json({ message: "保存数据时出错", error: err.message });
      }
    } else {
      res.status(400).json({ message: "数据无效" });
    }
  } else {
    res.status(405).json({ message: "只支持POST请求" });
  }
};
