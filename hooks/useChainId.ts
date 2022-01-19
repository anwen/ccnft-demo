import {useWeb3Context} from "../context/web3Context";

export const useChainId = () => {
  const { state: { chainId }} = useWeb3Context()
  return chainId
}