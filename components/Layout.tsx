import { memo } from "react"
import { Footer } from "./Footer"

export const Layout =memo( ({ children }) => {
  return (
    <main>
      { children }
      <Footer />
    </main>
  )
})

Layout.displayName = 'Layout'
