import React from "react";

export default function NFTList ({ nftData }){
    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">NFTs</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {nftData.map((nft) => (
            <a key={nft.id}  className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                    src={nft.imageSrc}
                    alt={nft.imageAlt}
                    className="h-48 w-full object-cover object-center group-hover:opacity-75"
                />
                </div>
                <h3 className="mt-4 text-lg text-white">{nft.name}</h3>
            </a>
            ))}
        </div>
        </div>
      )
};

