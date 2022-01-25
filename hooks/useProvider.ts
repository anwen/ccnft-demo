import {useWeb3Context} from "../context/web3Context";

export const useProvider = () => {
  const { state: { provider }} = useWeb3Context()
  return provider
}
