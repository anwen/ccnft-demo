import { ethers } from "ethers"
import { useState, createRef } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import { useRouter } from "next/router"
import ReactMarkdown from "react-markdown"
import { CID } from "multiformats/cid"
import { createPopper } from "@popperjs/core"

import { nftmarketaddress, nftaddress } from "../config"

// const hre = require("hardhat");

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/Market.sol/NFTMarket.json"

import { providers } from "ethers"
import { init } from "@textile/eth-storage"
import { useWeb3 } from "../hooks/useWeb3"
import { Layout } from "../components/Layout"
import { useAccount } from "../hooks/useAccount"

let cid
let nft = {}
export default function MyAssets() {
  const myethAccount = useAccount()
  const provider = useWeb3()
  const [loadingState, setLoadingState] = useState("not-loaded")
  const router = useRouter()

  const [formInput, updateFormInput] = useState({
    amount: "",
  })

  const [popoverShow, setPopoverShow] = useState(false)
  if (typeof window !== "undefined") {
    const btnRef = createRef()
    const popoverRef = createRef()
    const openTooltip = () => {
      createPopper(btnRef.current, popoverRef.current, {
        placement: "top",
      })
      setPopoverShow(true)
    }
    const closeTooltip = () => {
      setPopoverShow(false)
    }
  }

  async function createMint() {
    let url = ""
    try {
      if (cid.startsWith("Qm")) {
        // v0
        url = `https://ipfs.infura.io/ipfs/${cid}`
      } else {
        // v1
        url = `https://${cid}.ipfs.infura-ipfs.io/`
      }
      console.log("!nft.minted", !nft.minted)
      createSale(url)
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  async function mintAsDonation() {
    const { amount } = formInput
    // alert(amount)
    let url = ""
    try {
      if (cid.startsWith("Qm")) {
        // v0
        url = `https://ipfs.infura.io/ipfs/${cid}`
      } else {
        // v1
        url = `https://${cid}.ipfs.infura-ipfs.io/`
      }
      // TODO: allow
      const signer = provider.getSigner()
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
      // const price = ethers.utils.parseUnits("0.2", "ether")
      const price = ethers.utils.parseUnits(amount, "ether")
      // const price = ethers.utils.parseUnits("0.01", "ether")
      let transaction = await contract.mintAsDonorFromAuthor(
        url,
        nft.authors[0].wallet.eth,
        {
          value: price,
        },
      )
      console.log(transaction)
      // let tx = await transaction.wait()
      // let event = tx.events[0]
      // console.log(tx)
      // console.log(event)
      // let value = event.args[2]
      // let tokenId = value.toNumber()

      await transaction.wait()
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  async function gotoEdit() {
    if ("cid" in router.query) {
      cid = router.query.cid
    }
    if (!cid) {
      return
    }
    router.push(`/edit?cid=${cid}`)
  }

  async function storeNFTtoFilecoin() {
    const wallet = provider.getSigner()
    const storage = await init(wallet)
    // const blob = new Blob(["Hello, world!"], { type: "text/plain" });
    const jsonse = JSON.stringify(nft)
    const blob = new Blob([jsonse], { type: "application/json" })
    const file = new File([blob], "metadata.json", {
      type: "application/json",
      lastModified: new Date().getTime(),
    })
    try {
      await storage.addDeposit() // "execution reverted: BridgeProvider: depositee already has deposit"
    } catch (error) {
      console.error(error)
    }

    const { id, cid } = await storage.store(file)
    const { request, deals } = await storage.status(id)

    console.log("id, cid, request, deals", id, cid, request, deals)
    console.log(request.status_code)

    console.log([...deals])
    console.log("stored~")
    alert("Your NFT has been stored on Filecoin Network~")
  }

  async function createSale(url) {
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    console.log(NFT.abi)
    console.log(signer)
    console.log("signer")
    console.log(contract)
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

    const price = ethers.utils.parseUnits("0.1", "ether")
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    })
    await transaction.wait()
  }

  if (loadingState != "loaded" && !("name" in nft)) {
    loadNFT()
  }

  async function loadNFT() {
    console.log(router.query)
    if ("cid" in router.query) {
      cid = router.query.cid
      console.log("cid", cid)
    }
    console.log("cid2", cid)
    if (!cid) {
      return
    }
    let ipfs_gateway_url = ""
    if (cid.startsWith("Qm")) {
      // v0
      ipfs_gateway_url = `https://ipfs.infura.io/ipfs/${cid}`
    } else {
      // v1
      ipfs_gateway_url = `https://${cid}.ipfs.infura-ipfs.io/`
    }
    const ret = await axios.get(ipfs_gateway_url) // TODO
    console.log(ret)
    // authors[0].name
    if ("data" in ret) {
      console.log(ret.data.description)
      nft = ret.data
      console.log("nft.minted", nft.minted)
      console.log("aname", ret.data.authors[0].name)

      if (nft.image.startsWith("https://ipfs.infura.io/ipfs/")) {
        // v0
        let acid0 = nft.image.slice(28)
        console.log("acid0", acid0)
        const v0 = CID.parse(acid0)
        const v1 = v0.toV1().toString()
        nft.image = `https://${v1}.ipfs.infura-ipfs.io/`
        console.log("nft.image", nft.image)
      }
    }
    setLoadingState("loaded")
  }

  if (loadingState != "loaded" && !("name" in nft))
    return (
      <Layout>
        <h1 className="py-10 px-20 text-3xl"></h1>
      </Layout>
    )
  if (loadingState === "loaded" && !("name" in nft))
    return (
      <Layout>
        <h1 className="py-10 px-20 text-3xl">No creation</h1>
      </Layout>
    )
  return (
    <Layout>
      <div className="flex justify-center">
        <div className="p-6 w-full">
          <div className="rounded-xl overflow-hidden">
            <img src={nft.image} className="rounded" />
            <div className="py-6">
              <p className="text-3xl font-semibold flex justify-center">
                {nft.name}
              </p>
              <div className="markdown">
                <ReactMarkdown escapeHtml={true}>
                  {nft.description}
                </ReactMarkdown>
              </div>
              <p>
                By:
                <a href={"/articles?author=" + nft.authors[0].wallet.eth}>
                  {nft.authors[0].name}
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;Author-Wallet:{" "}
                {nft.authors[0].wallet.eth}
              </p>
              <p>Tags: {nft.tags}</p>
              <p>
                License: <a href={nft.license_url}>{nft.license}</a>
              </p>
              <input
                id="amount"
                onChange={(e) =>
                  updateFormInput({ ...formInput, amount: e.target.value })
                }
                type="text"
                defaultValue="0.1"
                placeholder="0.1"
                className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
              {!("disallow_mint" in nft) && (
                <button
                  id="popcorn"
                  aria-describedby="tooltip"
                  onMouseEnter={openTooltip}
                  onMouseLeave={closeTooltip}
                  ref={btnRef}
                  onClick={mintAsDonation}
                  className="font-bold mt-4 bg-blue-500 text-white rounded p-2 shadow-lg">
                  Mint As Donation
                </button>
              )}
              <div
                className={
                  (popoverShow ? "" : "hidden ") +
                  "bg-sky-600 border-0 mr-3 block z-50 font-normal leading-normal text-m break-words rounded-lg"
                }
                ref={popoverRef}>
                <div>
                  <div className="text-white font-semibold p-3 mb-0 uppercase rounded-t-lg">
                    Tips!!!
                  </div>
                  <div className="text-white p-3">
                    <ul>
                      <li>You mint the article NFT is only for Donation.</li>
                      <li>
                        The platform will get 10% (60% of them will give back to
                        early donors).
                      </li>
                      <li>
                        If an author got x (from early donors), and then got
                        20*x later, we will give 1.2*x to early donors.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <br />
              {!("minted" in nft) && nft.authors[0].wallet.eth == myethAccount && (
                <button
                  onClick={createMint}
                  className="font-bold mt-4 bg-blue-500 text-white rounded p-2 shadow-lg">
                  Mint (Will sign 2 times. Be patient...)
                </button>
              )}
              <br />
              {nft.authors[0].wallet.eth == myethAccount && (
                <button
                  onClick={gotoEdit}
                  className="font-bold mt-4 bg-blue-500 text-white rounded p-2 shadow-lg">
                  Edit
                </button>
              )}
              <br />{" "}
              {nft.authors[0].wallet.eth == myethAccount && (
                <button
                  onClick={storeNFTtoFilecoin}
                  className="font-bold mt-4 bg-blue-500 text-white rounded p-2 shadow-lg">
                  Store NFT on the Filecoin network(optional)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
