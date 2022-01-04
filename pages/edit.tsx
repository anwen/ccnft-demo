import {useRouter} from "next/router"
import axios from "axios"
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {useEffect, useState} from "react";

import {addNFTToNFTStorage} from "../services/NFTStorage";
import {addToIPFS} from "../services/IPFSHttpClient";
import {loadNFT} from "../services/backend";

import {nftaddress, nftmarketaddress} from "../config"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/Market.sol/NFTMarket.json"
import {InputFieldError} from "../components/InputFieldError";


let nft // TODO: use useState?

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
}).required();

export default function EditItem() {
  const router = useRouter()
  // TODO: create useAccount Hook and listen account change
  const [ethAccount, setEthAccount] = useState<string>()
  const [preview, setPreview] = useState<string>()
  const [cid, setCid] = useState<string>()
  const [loadingState, setLoadingState] = useState("not-loaded")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const account = localStorage.getItem("ethAccount")
      if (!account) {
        alert("No ETH Account, Please login")
        router.push("/articles-all")
        return
      }
      setEthAccount(account)
    }
  }, [])

  useEffect(() => {
    async function fetchArticle(cid) {
      nft = await loadNFT(cid)
      if (nft && 'image' in nft) {
        setPreview(nft.image)
        setLoadingState("loaded")
      }
    }
    if ("cid" in router.query) {
      setCid(router.query.cid.toString()) // TODO
      fetchArticle(router.query.cid.toString())
    }
  }, [router.query])

  const {register, handleSubmit, formState: {errors, isSubmitting}, watch} = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });
  const watchedFiles = watch("files", null);

  useEffect(() => {
    if (!watchedFiles) return
    if (!watchedFiles[0]) return

    const url = URL.createObjectURL(watchedFiles[0])
    setPreview(url)
  }, [watchedFiles])

  const onSubmit = async (data: IFormInputs) => {
    // upload new file is optional
    let imageURL
    let filesize
    let filename
    let filetype
    if (data.files.length>0) {
      const file = data.files[0]
      const {type: filetype, size: filesize, name: filename} = file
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
        eth: ethAccount,
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
    const ret = await axios.post(dweb_search_url, {
      previous_path: cid, 
      path: addedNFT.path,
      eth: ethAccount,
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
  if (loadingState === "loaded" && (!nft || !("name" in nft)))
    return <h1 className="py-10 px-20 text-3xl">Article not found, cannot edit</h1>

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="w-4/5 flex flex-col" autoComplete="off">
        <div className="w-full">
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
        </div>
        <div>
          <input
            placeholder="Title..."
            className="mt-8 border rounded p-4 w-full"
            defaultValue={nft.name}
            {...register("name")}
          />
          <InputFieldError message={errors.name?.message} />
        </div>
        <div>

        <p>-- Markdown Tips: &nbsp;
          <a href="https://anwen.cc/share/6">参考1</a>&nbsp;
          <a href="https://www.markdown.xyz/basic-syntax/">参考2</a>
        </p>
        <textarea
          placeholder="Content of your article (you can use Markdown format)"
          className="mt-2 border rounded p-4 h-80 w-full"
          defaultValue={nft.description}
          {...register("description")}
        />
          <InputFieldError message={errors.description?.message} />
        </div>
        <div>
          <input
            placeholder="Tags (Seperate tags by Space)"
            className="mt-8 border rounded p-4 w-full"
            defaultValue={nft.s_tags}
            {...register("s_tags")}
          />
          <InputFieldError message={errors.s_tags?.message} />
        </div>
        <div>
          <p className="mt-8 p-4"> Featured Image </p>
          <input type="file" name="Asset" className="my-4 w-full" {...register("files")} />
          <InputFieldError message={errors.files?.message} />
          {preview && <img src={preview} className="rounded mt-4" width="350"/>}
        </div>
        <div>
          <input
            {...register("author")}
            placeholder="Author Name"
            className="mt-8 border rounded p-4 w-full"
            defaultValue={nft.author_names}
          />
          <InputFieldError message={errors.author?.message} />
        </div>
        <input disabled={isSubmitting} type="submit" className="font-bold mt-4 mb-12 bg-pink-500 text-white rounded p-4 shadow-lg" value={`Publish${isSubmitting ? '...' :''}`}/>
      </form>
    </div>
  )
}