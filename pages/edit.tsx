import { useRouter } from "next/router"
import * as yup from "yup"
import { useEffect, useState } from "react"
import { loadNFT } from "../services/backend"
import { useAccount } from "../hooks/useAccount"
import { Editor } from "../components/Editor"
import { Article } from "../types"
// todo: move to request center
const dweb_search_url = `https://dweb-search-api.anwen.cc/edit_meta`

interface EditArticleProps {
  cid: string
  nft: Article
}

export default function EditArticle({ cid, nft }: EditArticleProps) {
  const router = useRouter()
  const account = useAccount()

  useEffect(() => {
    if (!account) {
      alert("No ETH Account, Please login")
      router.push("/articles-all")
      return
    }
  }, [])


  if (!nft?.name)
    return <h1 className="py-10 px-20 text-3xl">Article not found, cannot edit</h1>

  return (
    <div className="flex justify-center py-12">
      <Editor account={account}
        article={nft}
        publishLink={dweb_search_url}
        cid={cid}/>
    </div>
  )
}

export async function getServerSideProps(context) {
  const cid = context.query.cid
  const nft = await loadNFT(cid)
  return {
    props: { cid, nft }
  }
}
