import { create as ipfsHttpClient } from "ipfs-http-client"

// TODO: remove this ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0")

// TODO: remove any
export async function addToIPFS(data: any) {
  return client.add(data)
}


