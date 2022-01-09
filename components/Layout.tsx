import { memo } from "react"
import { Footer } from "./Footer"

export const Layout =memo( ({ children }) => {
  return (
    <main style={{ minHeight: 'calc(100vh - 140px)' }} className='flex flex-col justify-between'>
      { children }
      <Footer />
    </main>
  )
})

Layout.displayName = 'Layout'
