// there are 2 kinds of backends:
// - api of open-source&open-data backend, such dweb search
//   - we hope they follow a widely used standard
//   - https://github.com/ipfs-search/ipfs-search/issues/194
// - api of public ipfs-gateway

import axios from "axios"
import { CID } from "multiformats/cid"
import { Article } from "../types"

export async function loadNFT(cid): Promise<Article> {
  if (!cid) {
    return
  }
  let ipfs_gateway_url: string
  if (cid.startsWith("Qm")) {
    ipfs_gateway_url = `https://ipfs.infura.io/ipfs/${cid}` // cidv0
  } else {
    ipfs_gateway_url = `https://${cid}.ipfs.infura-ipfs.io/` // cidv1
  }
  const ret = await axios.get(ipfs_gateway_url) // TODO
  if (ret.data) {
    const nft = ret.data // TODO: add minted info
    if (nft.image.startsWith("https://ipfs.infura.io/ipfs/")) {
      const v0 = CID.parse(nft.image.slice(28)) // v0
      const v1 = v0.toV1().toString()
      nft.image = `https://${v1}.ipfs.infura-ipfs.io/`
      console.log("nft.image", nft.image)
    }
    nft.s_tags = nft.tags.join(' ')
    nft.author_names = nft.authors[0]['name']
    return nft
  }

  return null
}
