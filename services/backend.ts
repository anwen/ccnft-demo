// there are 2 kinds of backends:
// - api of open-source&open-data backend, such dweb search
//   - we hope they follow a widely used standard
//   - https://github.com/ipfs-search/ipfs-search/issues/194
// - api of public ipfs-gateway

import axios from "axios"
import { CID } from "multiformats/cid"

export async function loadNFT(cid) {
  if (!cid) {
    return
  }
  let ipfs_gateway_url = ""
  if (cid.startsWith("Qm")) {
    ipfs_gateway_url = `https://ipfs.infura.io/ipfs/${cid}` // cidv0
  } else {
    ipfs_gateway_url = `https://${cid}.ipfs.infura-ipfs.io/` // cidv1
  }
  const ret = await axios.get(ipfs_gateway_url) // TODO
  let nft = {}
  if ("data" in ret) {
    nft = ret.data
    // console.log("nft.minted", nft.minted) // TODO: add minted info
    // console.log("aname", ret.data.authors[0].name)
    if (nft.image.startsWith("https://ipfs.infura.io/ipfs/")) {
      const v0 = CID.parse(nft.image.slice(28)) // v0
      const v1 = v0.toV1().toString()
      nft.image = `https://${v1}.ipfs.infura-ipfs.io/`
      console.log("nft.image", nft.image)
    }
    nft.s_tags = nft.tags.join(' ')
    nft.author_names = nft.authors[0]['name']
  }
  return nft
}
