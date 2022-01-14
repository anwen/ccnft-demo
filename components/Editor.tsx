import { Fragment, memo, useEffect, useState } from "react"
import { Tiptap } from "./Tiptap"
import TextareaAutosize from 'react-textarea-autosize'
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { OnChangeValue } from "react-select"
import CreatableSelect from "react-select/creatable"
import { useLocalStorageValue } from "@react-hookz/web"
import {
  ARTICLE_LICENSE,
  ARTICLE_LICENSE_URL,
  CREATE_CACHE,
  CREATE_USED_AUTHORS,
  CREATE_USED_TAGS,
  STORAGE_KEY_ACCOUNT_SIG
} from "../constants"
import { addToIPFS } from "../services/IPFSHttpClient"
import { addNFTToNFTStorage } from "../services/NFTStorage"
import axios from "axios"
import router from "next/router"
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ExclamationIcon } from "@heroicons/react/outline"
import { getBrief } from "../web3/utils"
import { Article } from "../types"

interface EditorProps {
  publishLink: string
  account: string
  cid?: string
  article?: Article
}

interface IFormInputs {
  price: string
  name: string
  description: string
  s_tags: string
  author: string
  files: FileList | string
}
const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    width: '200px',
    borderBottom: '1px dotted pink',
    color: state.selectProps.menuColor,
    padding: '5px 10px',
  }),
  control: (provided, state) => ({
    ...provided,
    border: 'none',
    boxShadow: 'none'
  }),
  valueContainer: (provided, state) => ({
    ...provided,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    display: 'none'
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    display: 'none'
  }),
  multiValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = 'opacity 300ms'

    return {
      ...provided,
      opacity,
      transition,
      background: 'transparent',
      borderRadius: '100px',
      '& > div': {
        color: 'rgb(107 114 128 / var(--tw-text-opacity))',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
      }
    }
  }
}


const schema = yup.object({
  price: yup.string(),
  name: yup.string().required('Title is not optional'),
  description: yup.string().required("Content is not optional"),
  s_tags: yup.string().required("Tags is not optional"),
  author: yup.string().required("Authors Name is not optional"),
  files: yup.mixed().test({ test: (value) => value.length, message: "Feature Image is not optional" }),
}).required()

type Option = { label: string, value: string, __isNew__: boolean }
export const Editor = memo<EditorProps>(({ account, article, publishLink, cid }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [sigInLocal] = useLocalStorageValue(STORAGE_KEY_ACCOUNT_SIG)
  const [cachedTags, setCachedTags] = useState<Option[]>([])
  const [cachedAuthors, setCachedAuthors] = useState<Option>()
  const [tagsInLocal, setLocalTags] = useLocalStorageValue<Omit<Option, '__isNew__'>[]>(CREATE_USED_TAGS)
  const [authorsInLocal, setLocalAuthors] = useLocalStorageValue<Omit<Option, '__isNew__'>[]>(CREATE_USED_AUTHORS)
  const [preview, setPreview] = useState<string>(article?.image)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
    getValues
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (!article) return
    reset()
    setValue("name", article?.name)
    setValue('description', article?.description)
    setValue('s_tags', article?.tags.join(','))
    setValue('author', article?.authors[0].name)
    setValue('files', article?.image)
    setPreview(article?.image)
  }, [reset, article])

  // update preview image
  const watchedFiles = watch("files", null)
  useEffect(() => {
    if (typeof watchedFiles === 'string') return
    if (!watchedFiles) return
    if (!watchedFiles[0]) return

    const url = URL.createObjectURL(watchedFiles[0])
    setPreview(url)
  }, [watchedFiles])

  const handleAuthorsChange = (
    newValue: Option,
  ) => {
    setValue('author', newValue.value)
    setCachedAuthors(newValue)
  }

  const handleTagsChange = (
    newValue: OnChangeValue<Option, true>,
  ) => {
    setValue('s_tags', newValue.map(x => x.value).join(','))
    setCachedTags([...newValue])
  }

  const onSubmit = async(data: IFormInputs) => {
    let imageURL
    let filesize
    let filename
    let filetype
    if (typeof data.files !== 'string') {
      const file = data.files[0]
      const { type, size, name } = file
      filesize = size
      filename = name
      filetype = type
      const addedImage = await addToIPFS(file)
      imageURL = `https://ipfs.infura.io/ipfs/${addedImage.path}`
    } else {
      imageURL = preview
      filesize = article?.filesize
      filename = article?.filename
      filetype = article?.filetype
    }

    const tags = data.s_tags.split(',')
    const authors = [{
      name: data.author,
      wallet: {
        eth: account,
      },
    }]
    const nftData = JSON.stringify({
      name: data.name,
      description: data.description,
      image: imageURL,
      license: ARTICLE_LICENSE,
      license_url: ARTICLE_LICENSE_URL,
      filesize,
      filename,
      filetype,
      tags,
      authors,
    })

    await addNFTToNFTStorage(nftData)

    const addedNFT = await addToIPFS(nftData)
    // TODO: need fix this url?
    axios.defaults.headers.common['authorization'] = `Bearer ${sigInLocal}`
    axios.defaults.headers.common['address'] = account
    const ret = await axios.post(publishLink, {
      path: addedNFT.path,
      eth: account,
      name: data.name,
      image: imageURL,
      tags: data.s_tags,
      authors: data.author,
      ...(cid ?{ previous_path: cid } : {})
    })
    if (ret.status == 200 && !('error' in ret.data)) {
      updateLocalCache()
      await router.push("/articles-my")
    } else {
      const err = ret.data['error']
      throw new Error(err)
    }
  }

  const updateLocalCache = () => {
    const newTags = [
      ...tagsInLocal ?? [],
      ...cachedTags.filter(x => x.__isNew__)
    ].map(x => ({ label: x.label, value: x.value }))
    const newAuthors = [
      ...authorsInLocal ?? [],
      cachedAuthors?.__isNew__ ? cachedAuthors : undefined
    ].filter(x => x).map(x => ({ label: x.label, value: x.value }))
    setLocalTags(newTags)
    setLocalAuthors(newAuthors)

    localStorage.removeItem(CREATE_CACHE)
  }

  const onError = (error) => {
    if (Object.keys(error)[0]) {
      alert(`Error uploading to dweb-search: ${error[Object.keys(error)[0]].message}`)
    } else {
      alert("Sorry! Publish failed, server error. we are fixing...")
    }
  }

  return (
    <div className='relative w-full flex justify-center p-6'>
      <form style={{ width: '720px' }} onSubmit={handleSubmit(onSubmit, onError)}>
        <div className='inline-flex absolute -top-10 right-2 items-center'>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="px-2 flex items-center">
                <ExclamationIcon
                  className="w-8 h-8"
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
              <Menu.Items
                className="absolute right-0 w-80 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-6 py-8">
                  <Menu.Item>
                    <div className="w-full">
                      <h2>Attention: </h2>
                      <p className="mt-2">
                        - All your published data and metadata is open to public and with{" "}
                        <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA</a>{" "}
                        License.{" "}
                      </p>
                      <p className="mt-2">
                        - They will be on IPFS and Dweb Search Engine too.
                      </p>
                      <p className="mt-2">
                        - It’s forbidden to mint anything which doesn’t belong to you.
                      </p>
                    </div>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <button
            disabled={isSubmitting}
            type="submit"
            className="font-bold bg-pink-500 text-white rounded px-4 py-2 cursor-pointer"
            onClick={() => {
              const cache = JSON.parse(localStorage.getItem(CREATE_CACHE) as any)
              console.log(cache)
              if (cache.length) {
                setValue('description', cache)
                trigger()
              }
            }}
          >
            {`Publish${isSubmitting ? '...' :''}`}
          </button>
        </div>
        <div>
          <label>
            {
              !preview &&
              <div className="inline-flex bg-gray-200 text-gray-500 rounded-full px-2 cursor-pointer">
                <svg viewBox="0 0 24 24" className="w-3">
                  <path
                    d="M12 1.5v21M1.5 12h21"
                    stroke="#343F44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="inline-block p-1 text-sm">
                Add feature image
                </span>
              </div>
            }
            <input type="file" name="Asset" className="hidden" {...register("files")} />
            {
              preview &&
              <img className="lg:h-48 md:h-36 w-full object-cover object-center cursor-pointer" src={preview} />
            }
          </label>
        </div>
        <div className="pt-12">
          <TextareaAutosize
            placeholder="Give a title"
            className="border-0 outline-0 text-5xl w-full resize-none" {...register("name")}
          />
        </div>
        <div className="my-6 mb-4">
          <div className="text-gray-800 flex items-center">
            <div className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span
              className="mx-2 bg-gray-200 text-gray-500 rounded-full inline-block p-1 px-2 text-sm">
              { getBrief(account) }
            </span>
            <CreatableSelect
              id='create-authors'
              styles={customStyles}
              defaultValue={
                article?.authors ? { label: article?.authors[0].name, value: article?.authors[0].name } : undefined
              }
              placeholder="Input Authors"
              onChange={handleAuthorsChange}
              options={authorsInLocal ?? []}
            />
          </div>
          <div className="pt-3 flex justify-start items-center text-gray-500">
            <span>Tags:</span>
            <CreatableSelect
              id='create-tags'
              styles={customStyles}
              defaultValue={article?.tags.map(x => ({ label: x, value: x }))}
              isMulti
              placeholder="Input Post Tags"
              onChange={handleTagsChange}
              // @ts-ignore
              options={tagsInLocal ?? []}
            />
          </div>
        </div>
        <Tiptap initValue={article?.description} />
      </form>
      <Dialog as='div' open={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Overlay />

        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data will
          be permanently removed. This action cannot be undone.
        </p>

        <button onClick={() => setIsOpen(false)}>Deactivate</button>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
      </Dialog>
    </div>
  )
})

Editor.displayName = 'Editor'