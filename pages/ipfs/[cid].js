import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useRouter } from 'next/router'

import {
  nftmarketaddress, nftaddress
} from '../../config'

let ethAccount
let cid
export default function MyAssets() {
  // const [nfts, setNfts] = useState([])
  const [nft, setNft] = useState({})
  const [loadingState, setLoadingState] = useState('not-loaded')

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
    console.log(ret);
    // authors[0].name
    if ('data' in ret) {
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
        <div>
              <div className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <p className="text-2xl font-semibold">
                  {nft.description}
                  </p>

                  <p>By: 
                  <a href={"/author/"+nft.authors[0].wallet.eth} >{nft.authors[0].name}</a>
                  </p>

                  Tags: {nft.tags}
                </div>
              </div>
        </div>
      </div>
    </div>



  )

}