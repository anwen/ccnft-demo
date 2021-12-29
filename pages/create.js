import { useState } from "react"
import { ethers } from "ethers"
import { create as ipfsHttpClient } from "ipfs-http-client"
import { useRouter } from "next/router"
import axios from "axios"
import { NFTStorage } from "nft.storage"

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0")
import { nftaddress, nftmarketaddress } from "../config"

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/Market.sol/NFTMarket.json"

let ethAccount
export default function CreateItem() {
  const [publishstate, setPublishstate] = useState("")
  const [fileUrl, setFileUrl] = useState(null)
  const [afile, setAFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    s_tags: "",
    names: "",
  })
  const router = useRouter()
  console.log(router)
  if (router.pathname == "/create") {
    if (typeof document !== "undefined") {
      var els = document.getElementsByClassName("_nav")
      Array.prototype.forEach.call(els, function (el) {
        el.classList.remove("current")
      })
      document.getElementById("_create").classList.add("current")
    }
  }

  if (typeof window !== "undefined") {
    ethAccount = localStorage.getItem("ethAccount")
    if (!ethAccount) {
      alert("No ETH Account, Please login")
      router.push("/articles-all")
    }
  }
  console.log(ethAccount)

  async function onChange(e) {
    const file = e.target.files[0]
    console.log(file)
    console.log("file will be uploaded")
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      alert("file is uploaded!")
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      console.log(added) // added.size file.size
      setAFile(file) // file.name file.type "image/png"
      setFileUrl(url)
    } catch (error) {
      console.log("Error uploading file: ", error)
      alert("Error uploading file: ", error)
    }
  }
  async function PublishIt(e) {
    if (submitted) {
      console.log("already submitted")
      return
    }
    setSubmitted(true)
    e.preventDefault()
    console.log("submitted!")
    setPublishstate("ing...")
    const { name, description, s_tags, names } = formInput
    if (!afile) {
      alert("Please upload FEATURED IMAGE")
      setPublishstate("")
      setSubmitted(false)
      return
    }
    const _filename = afile.name.split(".")
    console.log(afile.type, _filename[_filename.length - 1])
    const filetype = afile.type
    const filesize = afile.size
    const filename = afile.name
    if (!name) {
      alert("Title is not optional")
      setPublishstate("")
      setSubmitted(false)
      return
    }
    if (!description) {
      alert("Content is not optional")
      setPublishstate("")
      setSubmitted(false)
      return
    }
    if (!s_tags) {
      alert("Tags is not optional")
      setPublishstate("")
      setSubmitted(false)
      return
    }
    if (!fileUrl) {
      alert("Feature Image is not optional")
      setPublishstate("")
      setSubmitted(false)
      return
    }
    if (!names) {
      alert("Authors Name is not optional")
      setPublishstate("")
      setSubmitted(false)
      return
    }
    if (!ethAccount) {
      alert("No ETH Account, Please login")
      setPublishstate("")
      setSubmitted(false)
      return
    }
    /* first, upload metadata to IPFS */
    const license = "CC-BY-SA"
    const license_url = "https://creativecommons.org/licenses/by-sa/4.0/"
    const tags = s_tags.split(" ")
    const authors = [
      {
        name: names,
        wallet: {
          eth: ethAccount,
        },
      },
    ]
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
      license,
      license_url,
      filesize,
      filename,
      filetype,
      tags,
      authors,
    })

    // const endpoint = 'https://api.nft.storage' // the default
    const API_TOKEN =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnaXRodWJ8MTQ3Mjg1MCIsImlzcyI6Im5mdC1zdG9yYWdlIiwiaWF0IjoxNjE4ODQ0ODAwOTgzLCJuYW1lIjoiZGVmYXVsdCJ9.bdDjCtOaANp49ysENB4-4xpVrhDRbdeqV39t5aVYsjo" // your API key from https://nft.storage/manage
    try {
      // const store = new NFTStorage({ endpoint, token })
      const client = new NFTStorage({ token: API_TOKEN })
      const cid = await client.storeBlob(new Blob([data]))
      const status = await client.status(cid)
      console.log(cid)
      console.log(status)
    } catch (error) {
      console.log("Error uploading to nft.storage: ", error)
    }

    try {
      const added = await client.add(data)
      console.log(added)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      // We also store metadata in Dweb Search
      console.log(s_tags)
      console.log(names)
      // const dweb_search_url = `https://dweb-search-api.anwen.cc/add_meta?path=${added.path}&eth=${ethAccount}&name=${name}&image=${fileUrl}&tags=${s_tags}&authors=${names}`
      const dweb_search_url = `https://dweb-search-api.anwen.cc/add_meta`
      console.log(dweb_search_url)

      // ?path=${added.path}&eth=${ethAccount}&name=${name}&image=${fileUrl}&tags=${s_tags}&authors=${names}`

      const ret = await axios.post(dweb_search_url, {
        path: added.path,
        eth: ethAccount,
        name: name,
        image: fileUrl,
        tags: s_tags,
        authors: names
      }) // TODO
      console.log(ret)
      if (ret.status == 200 && !('error' in ret.data)) {
        router.push("/articles-my")
      } else {
        let err = ret.data['error']
        console.log(err)
        alert(`Sorry! Publish failed, server error: ${err}. We're fixing. You can try later.`)
        setPublishstate("")
        setSubmitted(false)
        return
      }
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      // createNFT(url)
    } catch (error) {
      console.log("Error uploading to dweb-search: ", error)
      alert("Sorry! Publish failed, server error. we are fixing...")
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-4/5 flex flex-col pb-12">
        <h2 className="mt-2">Attention: </h2>
        <p className="mt-2">
          - All your published data and metadata is open to public and with{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA</a>{" "}
          License.{" "}
        </p>
        <p className="mt-2">
          - They will be on IPFS and Dweb Search Engine too.
        </p>
        <p className="mt-2">
          - It’s forbidden to mint anything which doesn’t belong to you.
        </p>
        <input
          placeholder="Title..."
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <p> -- Markdown Tips: &nbsp;
          <a href="https://anwen.cc/share/6">参考1</a>&nbsp;
          <a href="https://www.markdown.xyz/basic-syntax/">参考2</a>
        </p>
        <textarea
          placeholder="Content of your creative works (you can use Markdown format)"
          className="mt-2 border rounded p-4 h-80"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Tags (Seperate tags by Space)"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, s_tags: e.target.value })
          }
        />

        <p className="mt-8 p-4"> Featured Image </p>
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img src={fileUrl} className="rounded mt-4" width="350" />}
        <input
          placeholder="Author Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, names: e.target.value })
          }
        />
        <button
          onClick={(e) => PublishIt(e)}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Publish{publishstate}
        </button>
      </div>
    </div>
  )
}
