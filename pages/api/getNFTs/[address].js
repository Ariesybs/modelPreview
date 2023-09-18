export default (req, res) => {
    const { address } = req.query; // 通过 req.query 获取 URL 中的 id 参数
  
    const { Alchemy, Network } = require("alchemy-sdk");

    // Configures the Alchemy SDK
    const config = {
        apiKey: "Ukkx_WIEe6U_bct7Mhy7WovVe5GjW96E", // Replace with your API key
        network: Network.ETH_SEPOLIA, // Replace with your network
    };
    
    // Creates an Alchemy object instance with the config to use for making requests
    const alchemy = new Alchemy(config);
    let response = null
    const main = async () => {
        let owner  = address;
        
        response = await alchemy.nft.getNftsForOwner(owner)
        res.status(200).json(response);
        console.log(response["ownedNfts"])
    };
    
    main();
  
    
  };