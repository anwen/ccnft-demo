import { useRouter } from "next/router"
import * as yup from "yup"
import { useEffect, useState } from "react"
import { loadNFT } from "../services/backend"
import { useAccount } from "../hooks/useAccount"
import { Editor } from "../components/Editor"
// todo: move to request center
const dweb_search_url = `https://dweb-search-api.anwen.cc/edit_meta`

export default function EditArticle({ cid }: {cid: string}) {
  const router = useRouter()
  const account = useAccount()
  const [preview, setPreview] = useState<string>()
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
      if (nft?.image) {
        setPreview(nft.image)
      }
      setNft(nft)
      setLoadingState("loaded")
    }
    if (cid) {
      fetchArticle(router.query.cid.toString())
    }
  }, [router.query])


  if (loadingState != "loaded")
    return <h1 className="py-10 px-20 text-3xl"></h1>
  if (loadingState === "loaded" && !nft?.name)
    return <h1 className="py-10 px-20 text-3xl">Article not found, cannot edit</h1>

  return (
    <div className="flex justify-center py-12">
      <Editor account={account} article={nft} publishLink={dweb_search_url} cid={cid} />
    </div>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      cid: context.query.cid
    }
  }
}
