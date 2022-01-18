import { useRouter } from "next/router"
import { useEffect } from "react"
import { loadNFT } from "../services/backend"
import { useAccount } from "../hooks/useAccount"
import { Editor } from "../components/Editor"
import { useAsync, useMountEffect } from "@react-hookz/web"
// todo: move to request center
const dweb_search_url = `https://dweb-search-api.anwen.cc/edit_meta`

export default function EditArticle() {
  const router = useRouter()
  const account = useAccount()


  const [info, actions] = useAsync(async () => {
    const cid = router.query.cid as string || (new URLSearchParams(router.asPath.match(/cid=(.*)/g)[0])).get('cid')
    if (!cid) return  { cid: null, nft: null }
    const nft = await loadNFT(cid)
    return { cid, nft }
  })

  useMountEffect(actions.execute)

  useEffect(() => {
    if (!account) {
      alert("No ETH Account, Please login")
      router.push("/articles-all")
      return
    }
  }, [])


  if (info.status === 'loading') {
    return <h1 className="py-10 px-20 text-3xl">Loading</h1>
  }

  if (!info.result?.nft?.name || !info.result?.cid)
    return <h1 className="py-10 px-20 text-3xl">Article not found, cannot edit</h1>

  return (
    <div className="flex justify-center py-12">
      <Editor account={account}
        article={info.result?.nft}
        publishLink={dweb_search_url}
        cid={info.result?.cid}/>
    </div>
  )
}
