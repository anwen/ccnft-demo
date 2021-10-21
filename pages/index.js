import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    setLoadingState('loaded')
  }

  return (
    <div className="px-4" style={{ maxWidth: '1600px' }}>
      <h2 className="px-20 py-10 text-3xl">Tips</h2>
      <ul className="px-20 py-2">
        <li>🌏 Every NFT is Creative Comomons licensed and worldwide publicly accessed! 🅭</li>
        <li>🎁 Buying NFT is used for donating tokens to the NFT minter(maybe the author). You can&apos;t sell it to others. </li>
        <li>🎓 Please don't mint anything which is not belong to you. </li>
      </ul>
    </div>

  )

}
