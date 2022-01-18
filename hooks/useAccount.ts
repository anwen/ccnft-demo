import {useWeb3Context} from "../context/web3Context";

export const useAccount = () => {
  const { state} = useWeb3Context()
  return state.account
}