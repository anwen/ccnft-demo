import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"

import { nftaddress, nftmarketaddress } from "../config"

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/Market.sol/NFTMarket.json"
import { useWeb3 } from "../hooks/useWeb3"
import { Layout } from "../components/Layout"

export default function AllAssets() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState("not-loaded")
  const provider = useWeb3()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const signer = provider.getSigner()

    // const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer,
    )
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMarketItems()
    // const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), "ether")
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          sold: i.sold,
        }
        return item
      }),
    )

    /* create a filtered array of items that have been sold */
    // const soldItems = items.filter(i => i.sold)
    // setSold(soldItems)
    setNfts(items)
    setLoadingState("loaded")
  }
  if (loadingState === "loaded" && !nfts.length)
    return (
      <Layout>
        <h1 className="py-10 px-20 text-3xl">No assets created</h1>
      </Layout>
    )
  return (
    <Layout>
      <div>
        <div className="p-4">
          <h2 className="text-2xl py-2">Items Created</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    Price - {nft.price} Eth
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
