export interface Article {
  authors: { name: string }[]
  description: string
  image: string
  name: string
  tags: string[]
  filename: string
  filesize: number
  filetype: string
}