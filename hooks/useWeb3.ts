import {useWeb3Context} from "../context/web3Context";

export const useWeb3 = () => {
    const { state: { web3Provider }} = useWeb3Context()
    return web3Provider
}