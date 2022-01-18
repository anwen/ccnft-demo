import Link from "next/link"
import { useRouter } from "next/router"

const config = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: '+Create',
    path: '/create'
  },
  {
    name: 'My Articles',
    path: '/articles-my'
  },
  {
    name: 'All Articles',
    path: '/articles-all'
  },
  {
    name: 'My NFTs',
    path: '/my-nfts'
  },
  {
    name: 'My Collections',
    path: '/my-collections'
  },
  {
    name: 'NFT Market',
    path: '/nft-market'
  },
]

export const Navigation = () => {
  const router = useRouter()
  const isActivePath = (path: string) => router.asPath === path
  return (
    <div className="flex mt-4 grow flex-wrap">
      { config.map((item) => {
        return (
          <Link key={item.path}
            href={item.path}>
            <a className={`mr-4 text-pink-500 _nav ${ isActivePath(item.path) && 'current'}`}
              id="_home">
              {item.name}
            </a>
          </Link>
        )
      })}
    </div>
  )
}
