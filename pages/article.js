import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useRouter } from 'next/router'
import matter from 'gray-matter'
// import ReactMarkdown from "react-markdown"
import ReactMarkdown from 'react-markdown/react-markdown.min';

import {
  nftmarketaddress, nftaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

let ethAccount
let myethAccount
let cid
export default function MyAssets() {
  // const [nfts, setNfts] = useState([])
  const [nft, setNft] = useState({})
  const [loadingState, setLoadingState] = useState('not-loaded')

  async function createMint() {
    /* first, upload to IPFS */
    try {
      const url = `https://ipfs.infura.io/ipfs/${nft.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    console.log(nftaddress)
    console.log(NFT.abi)
    console.log(signer)
    console.log("signer")
    console.log(contract)
    console.log(url)
    let transaction = await contract.createToken(url)
    console.log(transaction)
    let tx = await transaction.wait()

    let event = tx.events[0]
    console.log(tx)
    console.log(event)
    // console.log(event.getBlock())
    // console.log(event.getTransaction())
    // console.log(event.getTransactionReceipt())
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(1, 'ether')
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
  }

  if (typeof window !== 'undefined') {
      myethAccount = localStorage.getItem("ethAccount");
      console.log('myethAccount', myethAccount)
  }

  const router = useRouter()
  console.log(router.query)
  console.log(nft)
  console.log(loadingState != 'loaded', !nft)

  // const { cid } = router.query
  // console.log(cid)
  if (loadingState != 'loaded' && !('name' in nft)) {
    loadNFT()
  }

  useEffect(() => {
    loadNFT()
  }, [])

  async function loadNFT() {
    console.log(router.query)
    // const dweb_search_url = `https://dweb-search-api.anwen.cc/get_meta?cid=${cid}`
    if ('cid' in router.query){
      cid = router.query.cid
      console.log('cid', cid)
    }
    console.log('cid2', cid)
    if (!cid) {
      return
    }
    const ipfs_gateway_url = `https://ipfs.infura.io/ipfs/${cid}`
    const ret = await axios.get(ipfs_gateway_url) // TODO
    console.log(ret)
    // authors[0].name
    if ('data' in ret) {
      // const { data, content } = matter(ret.data.description)
      // console.log('data, content')
      // console.log(data, content)
      // const result = await remark().use(html).process(content);
      // ret.data.description = result.toString()
      console.log(ret.data.description)
      setNft(ret.data)
      console.log('aname', ret.data.authors[0].name)
    }
    setLoadingState('loaded')
  }

  if (loadingState != 'loaded' && !('name' in nft)) return (
    <h1 className="py-10 px-20 text-3xl"></h1>
  )
  if (loadingState === 'loaded' && !('name' in nft)) return (
    <h1 className="py-10 px-20 text-3xl">No creation</h1>
  )
  return (
    <div className="flex justify-center">
      <div className="p-4">
              <div className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-3xl font-semibold flex justify-center">{nft.name}</p>
                  <div className="markdown">
                  <ReactMarkdown escapeHtml={true}>{nft.description}</ReactMarkdown>
                  </div>
                  <p>By: 
                  <a href={"/articles?author="+nft.authors[0].wallet.eth} >{nft.authors[0].name}</a>
                  </p>

                  <p>Tags: {nft.tags}</p>
                  <p>License: <a href={nft.license_url}>{nft.license}</a></p>
                  
                  {!nft.minted &&
                    <button onClick={createMint} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                      Mint
                    </button>
                  }
                </div>
              </div>
      </div>
    </div>

  )

}