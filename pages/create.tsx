import { Editor } from "../components/Editor"
import { useAccount } from "../hooks/useAccount"
import { useEffect } from "react"
import router from "next/router"
import { getBrief } from "../web3/utils"


export default function Create() {
  const account = useAccount()

  useEffect(() => {
    if (!account) {
      alert("No ETH Account, Please login")
      router.push("/articles-all")
      return
    }
  }, [])
  return (
    <div className="flex justify-center py-12">
      <Editor account={getBrief(account)} />
    </div>
  )
}