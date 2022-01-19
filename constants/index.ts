export const RPC_URLS = [
  "https://speedy-nodes-nyc.moralis.io/cebf590f4bcd4f12d78ee1d4/polygon/mumbai",
]

export const BLOCK_EXPLORER_URLS = ["https://explorer-mumbai.maticvigil.com/"]
export const SUPPORT_NETWORKS = [80001]
export const STORAGE_KEY_ACCOUNT = 'ethAccount'
export const STORAGE_KEY_ACCOUNT_SIG = 'sig_login'
export const BACKEND_VERSION = 'backend_version'
export const CREATE_USED_TAGS = 'create_used_tags'
export const CREATE_USED_AUTHORS = 'create_used_authors'
export const CREATE_CACHE = 'create_cache'
export const ARTICLE_LICENSE = "CC-BY-SA"
export const ARTICLE_LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/"
export const DOMAIN = {
  name: "DwebLab Alpha",
  version: "1",
  chainId: 80001,
}

export const signInfo = {
  types: {
    Message: [{ name: "content", type: "string" }],
  },
  message: { content: "Sign this msg to login" }
}
