import '../styles/globals.css'
import '../styles/markdown.css'
import Link from 'next/link'
import Head from "next/head";
import { useState } from 'react'
import Web3Modal from 'web3modal'
import Web3 from 'web3'

import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

let provider

function Marketplace({ Component, pageProps }) {
  const [ethAccount, setethAccount] = useState(null)
  const [Logined, setLogined] = useState(false)

  useEffect(() => {

  if (typeof window !== "undefined") {
    const aethAccount = localStorage.getItem("ethAccount")
    if (aethAccount){
      setethAccount(aethAccount)
      setLogined(true);
    }
  }

  }, [])



async function ConnectWallet() {
    // const web3Modal = new Web3Modal()
    // const connection = await web3Modal.connect()
    // const provider = new ethers.providers.Web3Provider(connection)

    const web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      // providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });
    console.log("Web3Modal instance is", web3Modal);
    console.log("Opening a dialog", web3Modal);
    try {
      provider = await web3Modal.connect();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

  // Get a Web3 instance for the wallet
  // const web3 = new Web3(provider);
  // const web3 = await web3Modal.connect()
  // const web3 = new ethers.providers.Web3Provider(provider)
  const web3 = new Web3(provider);
  console.log("Web3 instance is", web3);
  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  // const chainData = evmChains.getChain(chainId);
  // console.log("chainData is", chainData);
  console.log("chainId is", chainId);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  if(accounts.length > 0) {
   setethAccount(accounts[0])
   setLogined(true);
   console.log("Got ethAccount", accounts[0]);

    // useEffect(function() {
    //     // console.log(window.localStorate);
    //     localStorage.setItem("ethAccount", accounts[0])
    // },[]);

    if (typeof window !== "undefined") {
      localStorage.setItem("ethAccount", accounts[0])
    }

  }
}

async function DisconnectWallet() {
  console.log("Killing the wallet connection", provider);
  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();
    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  if (typeof window !== "undefined") {
     localStorage.removeItem("ethAccount")
  }
  setLogined(false);
  setethAccount(null);

}

function getBrief(astr) {
  if(!astr) return ""
  return astr.substring(0,6)+'...'+astr.substr(astr.length - 4)
}

  return (
    <div>
      <Head>
        <title>Creative Comomons NFT Playground</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Creative Comomons NFT Playground</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create">
            <a className="mr-4 text-pink-500">
              +Create
            </a>
          </Link>
          <Link href="/articles-my">
            <a className="mr-4 text-pink-500">
              My Articles
            </a>
          </Link>
          <Link href="/articles-all">
            <a className="mr-4 text-pink-500">
              All Articles
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-4 text-pink-500">
              My NFTs
            </a>
          </Link>
          <Link href="/my-collections">
            <a className="mr-4 text-pink-500">
              My Collections
            </a>
          </Link>
          <Link href="/nft-market">
            <a className="mr-4 text-pink-500">
              NFT Market
            </a>
          </Link>
        </div>
        <button style={{display: Logined?"none": "block"}} onClick={ConnectWallet}  className="font-bold mt-2 bg-pink-500 rounded p-2">
          ConnectWallet
        </button>

    <div style={{display: Logined?"block": "none"}} className="absolute top-8 right-8 text-right fixed ">
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
                      active ? 'bg-blue-500 text-gray-300' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    id: {getBrief(ethAccount)}
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button onClick={DisconnectWallet}
                    className={`${
                      active ? 'bg-blue-500 text-gray-300' : 'text-gray-900'
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
    </div>


  )
}

export default Marketplace