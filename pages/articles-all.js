import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"

import { nftmarketaddress, nftaddress } from "../config"

let ethAccount
export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState("not-loaded")

  ethAccount = "*"
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const dweb_search_url = `https://dweb-search-api.anwen.cc/get_meta?eth=${ethAccount}`
    console.log(dweb_search_url)
    const ret = await axios.get(dweb_search_url) // TODO
    console.log(ret)
    // setNfts(items)
    if ("data" in ret.data) {
      setNfts(ret.data.data)
    }
    setLoadingState("loaded")
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No creations</h1>

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <a href={"/article?cid=" + nft.path}>
                <img src={nft.image} className="rounded" />
              </a>

              <div className="p-4">
                <a href={"/article?cid=" + nft.path}>
                  <p className="text-2xl font-semibold">{nft.name}</p>
                </a>
                <p className="text-2xl font-semibold">
                  By: &nbsp;
                  <a href={"/articles?author=" + nft.eth}>{nft.authors}</a>
                </p>
                Tags: &nbsp;
                {nft.tags.map((tag, i) => (
                  <a key={i} href={"/articles?tag=" + tag}>{tag}</a>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
