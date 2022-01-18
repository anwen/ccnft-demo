import axios from "axios"
import urlcat from "urlcat"

const baseURL = 'https://dweb-search-api.anwen.cc/'

export async function fetchMetadata(eth) {
  const url = urlcat(baseURL, '/get_meta', { eth })
  const result = await axios.get(url)
  return result.data?.data ?? []
}