import {NFTStorage} from "nft.storage";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnaXRodWJ8MTQ3Mjg1MCIsImlzcyI6Im5mdC1zdG9yYWdlIiwiaWF0IjoxNjE4ODQ0ODAwOTgzLCJuYW1lIjoiZGVmYXVsdCJ9.bdDjCtOaANp49ysENB4-4xpVrhDRbdeqV39t5aVYsjo" // your API key from https://nft.storage/manage

export async function addNFTToNFTStorage(data: string) {
  // const endpoint = 'https://api.nft.storage' // the default
  const client = new NFTStorage({token: API_TOKEN})

  const cid = await client.storeBlob(new Blob([data]))
  const status = await client.status(cid)
  return { cid, status }
}