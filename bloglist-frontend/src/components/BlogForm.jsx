import { useState } from 'react'
import Button from './Button'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = ({ target }) => {
    setTitle(target.value)
  }

  const handleAuthorChange = ({ target }) => {
    setAuthor(target.value)
  }

  const handleUrlChange = ({ target }) => {
    setUrl(target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <label htmlFor="title">Title:</label>
      <input type="text" id="title" value={title} onChange={handleTitleChange} placeholder='type the title here...' /><br /><br />
      <label htmlFor="author">Author:</label>
      <input type="text" id="author" value={author} onChange={handleAuthorChange} placeholder='type the author here...' /><br /><br />
      <label htmlFor="url">URL:</label>
      <input type="text" id="url" value={url} onChange={handleUrlChange} placeholder='type the url here...' /><br /><br />
      <Button id="create" type="submit" label="Create" />
    </form>
  )
}

export default BlogForm