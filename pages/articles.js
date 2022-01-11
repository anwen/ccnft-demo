import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import { nftmarketaddress, nftaddress } from "../config"

let ethAccount
let tag
export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState("not-loaded")

  const router = useRouter()

  console.log(router.query)
  
  if ("author" in router.query) {
    ethAccount = router.query.author
    console.log("ethAccount", ethAccount)
    if (ethAccount == "me") { // TODO: seems useless
      if (typeof window !== "undefined") {
        ethAccount = localStorage.getItem("ethAccount")
      }
    }
  } else if  ("tag" in router.query) {
    tag = router.query.tag
    console.log("tag", tag)
  }

  useEffect(() => {
    loadNFTs()
  }, [ethAccount, tag])
  async function loadNFTs() {
    // TODO: both author and tag
    if (ethAccount) {
      const dweb_search_url = `https://dweb-search-api.anwen.cc/get_meta?eth=${ethAccount}`
      const ret = await axios.get(dweb_search_url) // TODO
      console.log(ret)
      if ("data" in ret.data) {
        setNfts(ret.data.data)
      }
      setLoadingState("loaded")
    } else if (tag) {
      const dweb_search_url = `https://dweb-search-api.anwen.cc/get_meta?tag=${tag}`
      console.log('dweb_search_url', dweb_search_url)
      const ret = await axios.get(dweb_search_url) // TODO
      console.log(ret)
      if ("data" in ret.data) {
        setNfts(ret.data.data)
      }
      setLoadingState("loaded")
    }
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No creations</h1>

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              <div className="p-4">
                <a href={"/article?cid=" + nft.path}>
                  <p className="text-2xl font-semibold">{nft.name}</p>
                </a>
                <p className="text-2xl font-semibold">
                  By:
                  <a href={"/articles?author=" + nft.eth}>{nft.authors}</a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
