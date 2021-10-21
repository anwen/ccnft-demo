import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import axios from 'axios'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

let ethAccount
export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [afile, setAFile] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '',
    s_tags: '', names: ''
  })
  const router = useRouter()
  if (typeof window !== 'undefined') {
      ethAccount = localStorage.getItem("ethAccount");
  }
  console.log(ethAccount);

  async function onChange(e) {
    const file = e.target.files[0]
    console.log(file)
    console.log('file will be uploaded')
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      alert('file is uploaded!')
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      console.log(added) // added.size file.size
      setAFile(file) // file.name file.type "image/png"
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
      alert('Error uploading file: ', error)
    }
  }
  async function PublishIt() {
    const { name, description, s_tags, names } = formInput
    if (!afile) {
      alert('Please upload FEATURED IMAGE')
    }
    const _filename = afile.name.split('.')
    console.log(afile.type, _filename[_filename.length - 1])
    const filetype = afile.type
    const filesize = afile.size
    const filename = afile.name
    if (!name || !description || !s_tags || !fileUrl || !ethAccount) {
      alert("Title, Content, Tags, Feature Image, eth-account are not optional")
      return
    }
    /* first, upload metadata to IPFS */
    const license = "CC-BY-SA"
    const license_url = "https://creativecommons.org/licenses/by-sa/4.0/"
    const tags = s_tags.split(" ")
    const authors = [{
      "name": names,
      "wallet": {
        "eth": ethAccount
      }
    }]
    const data = JSON.stringify({
      name, description, image: fileUrl,
      license, license_url,
      filesize, filename,
      filetype, tags, authors
    })
    try {
      const added = await client.add(data)
      console.log(added)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      // We also store metadata in Dweb Search
      const dweb_search_url = `https://dweb-search-api.anwen.cc/add_meta?path=${added.path}&eth=${ethAccount}&name=${name}&image=${fileUrl}&tags=${s_tags}&authors=${names}`

      const ret = await axios.get(dweb_search_url) // TODO
      console.log(ret)
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      // createNFT(url)
      router.push('/')
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }


  return (
    <div className="flex justify-center">
      <div className="w-4/5 flex flex-col pb-12">

        <h2 className="mt-2">Attention: </h2>
        <p className="mt-2">- All your published data and metadata is public and with <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA</a> License. </p>
        <p className="mt-2">- They will be on on IPFS and Dweb Search Engine too.</p>
        <input 
          placeholder="A Title..."
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Your creative works (you can use Markdown)"
          className="mt-2 border rounded p-4 h-80"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input 
          placeholder="Tags (Seperate tags by Space)"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, s_tags: e.target.value })}
        />
        
        <p className="mt-8 p-4"> FEATURED IMAGE </p>
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img src={fileUrl} className="rounded mt-4" width="350" />
          )
        }
        <input 
          placeholder="Author Name (your name)"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, names: e.target.value })}
        />
        <button onClick={PublishIt} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Publish
        </button>
      </div>
    </div>
  )
}