import { MongoClient } from 'mongodb';
import { ethers } from 'ethers'; 

// 连接字符串
const uri = 'mongodb+srv://1575577205:a13662597802@cluster0.nzrcitw.mongodb.net/?retryWrites=true&w=majority';

// 创建MongoDB客户端

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
export default async (req, res)=> {
  if (req.method === 'POST') {
    const { secretKey,signerAddress,signature } = req.body;
    const recoveredAddress = ethers.verifyMessage(secretKey, signature);
    const flag = recoveredAddress === signerAddress
    const data = {
      secretKey:secretKey,
      signerAddress:signerAddress,
      signature:signature,
      recoveredAddress:recoveredAddress,
      flag:flag
    }

    if(flag){
      //连接数据库并插入数据
      connect().then(()=>{
        insertData(data)
      }).finally(()=>{
        client.close()
      })

    }

    res.status(200).json({ message: `接收到数据,激活码:${secretKey},签名者:${signerAddress},签名消息:${signature},验证地址:${recoveredAddress},是否有效:${flag}`,data:data });
  } else {
    res.status(405).json({ message: '只支持POST请求' });
  }
}

// 连接到数据库
async function connect() {
  
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

// 插入数据
async function insertData(data) {
  try {
    const db = client.db('NFCManagerDB'); // 数据库名称
    const collection = db.collection('NFC'); // 表名
    const result = await collection.insertOne(data);
    console.log('Data inserted:', result.insertedId);
  } catch (error) {
    console.error('Error inserting data', error);
  }
}
