import "../styles/globals.css"
import "../styles/markdown.css"
import Head from "next/head"
import { useState } from "react"
import { ethers } from "ethers"
import { Menu, Transition } from "@headlessui/react"
import { Fragment, useEffect } from "react"
import { ChevronDownIcon } from "@heroicons/react/solid"
import {Navigation} from "../components/Navigation";

// On production, you should use something like web3Modal
// to support additional wallet providers, like WalletConnect

let provider

function Marketplace({ Component, pageProps }) {
  const [ethAccount, setethAccount] = useState(null)
  const [Logined, setLogined] = useState(false)
  const [loadingState, setLoadingState] = useState("not-loaded")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const aethAccount = localStorage.getItem("ethAccount")
      if (aethAccount) {
        setethAccount(aethAccount)
        loginSig()
        setLogined(true)
      }
      async function listenMMAccount() {
        window.ethereum.on("accountsChanged", async function () {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
          if (accounts[0] != localStorage.getItem("ethAccount")) {
            console.log("Got new ethAccount", accounts[0])
            localStorage.setItem("ethAccount", accounts[0])
            localStorage.removeItem("sig_login")
            setethAccount(aethAccount)
            loginSig()
          }
        })
      }
      listenMMAccount()
    }
  }, [])

  async function loginSig() {
    // change network and sig login
    const sig_login = localStorage.getItem("sig_login")
    if (sig_login) {
      console.log("sig_login already done", sig_login)
      return
    }
    await addPolygonTestnetNetwork()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const types = {
      Message: [{ name: "content", type: "string" }],
    }
    const domain = {
      name: "DwebLab Alpha",
      version: "1",
      chainId: 80001,
    }
    const message = {
      content: "Sign this msg to login",
    }
    signer.getAddress().then((walletAddress) => {
      signer._signTypedData(domain, types, message).then((signature) => {
        let verifiedAddress = ethers.utils.verifyTypedData(
          domain,
          types,
          message,
          signature,
        )
        if (verifiedAddress !== walletAddress) {
          alert(`Signed by: ${verifiedAddress}\r\nExpected: ${walletAddress}`)
        } else {
          localStorage.setItem("sig_login", signature)
        }
        console.log("signature", signature)
      })
    })
    setLoadingState("loaded")
  }

  async function addPolygonTestnetNetwork() {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }], // Hexadecimal version of 80001, prefixed with 0x
      })
    } catch (error) {
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881", // Hexadecimal version of 80001, prefixed with 0x
                chainName: "POLYGON Mumbai",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: [
                  "https://speedy-nodes-nyc.moralis.io/cebf590f4bcd4f12d78ee1d4/polygon/mumbai",
                ],
                blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
                iconUrls: [""],
              },
            ],
          })
        } catch (addError) {
          console.log("Did not add network")
        }
      }
    }
  }

  async function ConnectWallet() {
    // if (window.ethereum)
    await window.ethereum.enable()
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    if (accounts.length > 0) {
      setethAccount(accounts[0])
      console.log("Got ethAccount", accounts[0])
      if (typeof window !== "undefined") {
        localStorage.setItem("ethAccount", accounts[0])
      }
      loginSig()
      setLogined(true)
    }
  }

  async function DisconnectWallet() {
    setLogined(false)
    setethAccount(null)
    console.log("Killing the wallet connection", provider)
    if (provider && provider.close) {
      await provider.close()
      provider = null
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("ethAccount")
      localStorage.removeItem("sig_login")
    }
  }

  function getBrief(astr) {
    if (!astr) return ""
    return astr.substring(0, 6) + "..." + astr.substr(astr.length - 4)
  }

  return (
    <div>
      <Head>
        <title>Creative Comomons NFT Playground</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Creative Commons NFT Playground</p>
        <Navigation />
        <button
          style={{ display: Logined ? "none" : "block" }}
          onClick={ConnectWallet}
          className="font-bold mt-2 bg-pink-500 rounded p-2"
        >
          ConnectWallet
        </button>

        <div
          style={{ display: Logined ? "block" : "none" }}
          className="absolute top-8 right-8 text-right fixed "
        >
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full px-2 py-2 font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <ChevronDownIcon
                  className="w-5 h-5 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-blue-500 text-gray-300" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        id: {getBrief(ethAccount)}
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={DisconnectWallet}
                        className={`${
                          active ? "bg-blue-500 text-gray-300" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>

      <Component {...pageProps} />



      <footer className="border-b p-6">
          <p>Version v0.4.4 Powered by Dweb Lab</p>
      </footer>

    </div>
  )
}

export default Marketplace
