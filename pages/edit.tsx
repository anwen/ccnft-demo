import { useRouter } from "next/router"
import axios from "axios"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { useEffect, useState } from "react"
import { addNFTToNFTStorage } from "../services/NFTStorage"
import { addToIPFS } from "../services/IPFSHttpClient"
import { loadNFT } from "../services/backend"
import { useAccount } from "../hooks/useAccount"
import { Editor } from "../components/Editor"
import { getBrief } from "../web3/utils"


interface IFormInputs {
  price: string
  name: string
  description: string
  s_tags: string
  author: string
  files: FileList
}

const schema = yup.object({
  price: yup.string(),
  name: yup.string().required('Title is not optional'),
  description: yup.string().required("Content is not optional"),
  s_tags: yup.string().required("Tags is not optional"),
  author: yup.string().required("Authors Name is not optional"),
  files: yup.mixed(), // TODO: special case, not a img?
}).required()

export default function EditItem() {
  const router = useRouter()
  const account = useAccount()
  const [preview, setPreview] = useState<string>()
  const [cid, setCid] = useState<string>()
  const [nft, setNft] = useState<any>()
  const [loadingState, setLoadingState] = useState("not-loaded")

  useEffect(() => {
    if (!account) {
      alert("No ETH Account, Please login")
      router.push("/articles-all")
      return
    }
  }, [])

  useEffect(() => {
    async function fetchArticle(cid) {
      const nft = await loadNFT(cid)
      console.log(nft)
      if (nft?.image) {
        setPreview(nft.image)
        setLoadingState("loaded")
      }
      setNft(nft)
    }
    if ("cid" in router.query) {
      setCid(router.query.cid.toString()) // TODO
      fetchArticle(router.query.cid.toString())
    }
  }, [router.query])

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  })
  const watchedFiles = watch("files", null)

  useEffect(() => {
    if (!watchedFiles) return
    if (!watchedFiles[0]) return

    const url = URL.createObjectURL(watchedFiles[0])
    setPreview(url)
  }, [watchedFiles])

  const onSubmit = async(data: IFormInputs) => {
    // upload new file is optional
    let imageURL
    let filesize
    let filename
    let filetype
    if (data.files.length>0) {
      const file = data.files[0]
      const { type: filetype, size: filesize, name: filename } = file
      const addedImage = await addToIPFS(file)
      imageURL = `https://ipfs.infura.io/ipfs/${addedImage.path}`
    } else {
      filesize = nft.filesize
      filename = nft.filename
      filetype = nft.filetype
      imageURL = nft.image
    }
    const license = "CC-BY-SA"
    const license_url = "https://creativecommons.org/licenses/by-sa/4.0/"
    const tags = data.s_tags.split(" ")
    const authors = [{
      name: data.author,
      wallet: {
        eth: account,
      },
    }]
    const nftData = JSON.stringify({
      name: data.name,
      description: data.description,
      image: imageURL,
      license,
      license_url,
      filesize,
      filename,
      filetype,
      tags,
      authors,
    })

    await addNFTToNFTStorage(nftData)

    const addedNFT = await addToIPFS(nftData)
    // TODO: need fix this url?
    const dweb_search_url = `https://dweb-search-api.anwen.cc/edit_meta`

    const sig_login = localStorage.getItem("sig_login")
    const aethAccount = localStorage.getItem("ethAccount")
    axios.defaults.headers.common['authorization'] = `Bearer ${sig_login}` 
    axios.defaults.headers.common['address'] = aethAccount
    const ret = await axios.post(dweb_search_url, {
      // headers: {"Authorization" : `Bearer ${tokenStr}`},
      previous_path: cid, 
      path: addedNFT.path,
      eth: account,
      name: data.name,
      image: imageURL,
      tags: data.s_tags,
      authors: data.author
    })
    if (ret.status == 200 && !('error' in ret.data)) {
      router.push("/articles-my")
    } else {
      const err = ret.data['error']
      throw new Error(err)
    }
  }

  const onError = (error) => {
    console.log("Error uploading to dweb-search: ", error)
    alert("Sorry! Publish failed, server error. we are fixing...")
  }

  if (loadingState != "loaded")
    return <h1 className="py-10 px-20 text-3xl"></h1>
  if (loadingState === "loaded" && !nft?.name)
    return <h1 className="py-10 px-20 text-3xl">Article not found, cannot edit</h1>

  return (
    <div className="flex justify-center py-12">
      <Editor account={getBrief(account)} article={nft} />
    </div>
  )
}
