export const RPC_URLS = [
  "https://speedy-nodes-nyc.moralis.io/cebf590f4bcd4f12d78ee1d4/polygon/mumbai",
]

export const BLOCK_EXPLORER_URLS = ["https://explorer-mumbai.maticvigil.com/"]
export const SUPPORT_NETWORKS = [80001]
export const STORAGE_KEY_ACCOUNT = 'ethAccount'
export const STORAGE_KEY_ACCOUNT_SIG = 'sig_login'
export const BACKEND_VERSION = 'backend_version'
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
