import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import axios from 'axios'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '',
   filetype: '', tags: '', names: ''
  })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      console.log(added)
      console.log(file)
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, filetype, tags, names, price } = formInput
    if (!name || !description || !price || !fileUrl || !filetype || !tags|| !names) {
      alert("name,description,filetype,tags,price,authors is not optional")
      return
    }
    /* first, upload to IPFS */
    const license = "CC-BY-SA"
    const license_url = "https://creativecommons.org/licenses/by-sa/4.0/"
    // const filetype
    const l_tags = tags.split(" ")
    // const l_names = names.split(" ") // TODO
    const authors = [{
      "name": names,
    }]
    const data = JSON.stringify({
      name, description, image: fileUrl,
      license, license_url,
      filetype, l_tags, authors
    })
    try {
      const added = await client.add(data)
      console.log(added)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      // We also store metadata in Dweb Search
      // const dweb_search_url = `https://dweb-search-api.anwen.cc/add_meta?path=${added.path}`
      // const ret = await axios.get(dweb_search_url) // TODO
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
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    // store NFT info to the metadata
    const l_url = url.split("/")
    const path = l_url[l_url.length-1]
    const dweb_search_url2 = `https://dweb-search-api.anwen.cc/add_meta?path=${path}+${tokenId}`
    const ret2 = await axios.get(dweb_search_url2) // TODO
    console.log(ret2)

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    let tx2 = await await transaction.wait()
    console.log(tx2)
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <p>Attention: All data and metadata of NFT you mint is open and with <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA</a> License. Will be on on IPFS and Dweb Search Engine too</p>
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description (You can use Markdown too)"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input 
          placeholder="Asset filetype"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, filetype: e.target.value })}
        />
        <input 
          placeholder="Asset Tags (Seperate tags by Space)"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, tags: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <p>Attention: You need sign 2 contracts: Mint(0 fee) and createMarketSale(0.001 Matic is need)</p>
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <input 
          placeholder="Author Names(Seperate by Space)"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, names: e.target.value })}
        />

        <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}