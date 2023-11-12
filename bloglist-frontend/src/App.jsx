import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Button from './components/Button'
import Toggable from './components/Toggable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)

      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
    } catch (e) {
      setShowMessage(true)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage('')
        setShowMessage(false)
      }, 3000)
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser('')
  }

  const handleAddNewBlog = async (blogObject) => {
    try {
      blogFormRef.current.handleVisibility()
      await blogService.create(blogObject)

      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      setShowMessage(true)
      setConfirmMessage(`A new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setConfirmMessage('')
        setShowMessage(false)
      }, 3000)
    } catch (e) {
      console.log('error while creating a blog', e)
    }
  }

  const handleDeleteBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.deleteById(blog.id)

        const updatedBlogs = await blogService.getAll()
        setBlogs(updatedBlogs)

        setShowMessage(true)
        setConfirmMessage('Blog deleted')
        setTimeout(() => {
          setConfirmMessage('')
          setShowMessage(false)
        }, 3000)
      }
    } catch (e) {
      console.log('error while deleteing a blog', e)
    }
  }

  const handleIncrementUpvotes = async (id) => {
    try {
      const blog = blogs.find(b => b.id === id)
      const updatedBlog = {
        ...blog,
        upvotes: blog.upvotes + 1
      }

      const updatedBlogs = [...blogs]
      const index = updatedBlogs.findIndex(b => b.id === id)
      updatedBlogs[index] = updatedBlog
      setBlogs(updatedBlogs)

      await blogService.updateById(id, updatedBlog)

      setShowMessage(true)
      setConfirmMessage('Blog likes updated')
      setTimeout(() => {
        setConfirmMessage('')
        setShowMessage(false)
      }, 3000)
      await blogService.updateById(id, updatedBlog)
    } catch (e) {
      console.log('Error while incrementing blog upvotes', e)
    }
  }

  const popupMessage = () => (
    showMessage && (
      <div className={errorMessage ? 'error' : 'confirm'}>{errorMessage ? errorMessage : confirmMessage}</div>
    )
  )

  const blogsRendering = () => {
    const sortedBlogs = blogs.sort((a, b) => b.upvotes - a.upvotes)
    return (
      sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          user={user}
          blog={blog}
          handleDeleteBlog={() => handleDeleteBlog(blog)}
          handleIncrementUpvotes={() => handleIncrementUpvotes(blog.id)} />
      )
    )
  }

  return (
    <div>

      {user
        ? <div>
          <h2>blogs</h2>
          {popupMessage()}
          <h4>{user.name} logged in</h4>
          <Button type='submit' label='Logout' handler={handleLogout} /><br /><br />

          <Toggable ref={blogFormRef}>
            <BlogForm createBlog={handleAddNewBlog} />
          </Toggable>

          {blogsRendering()}

        </div>
        : <div>
          <h2>Log in to application</h2>
          {popupMessage()}
          <LoginForm loginUser={handleLogin} />
        </div>
      }

    </div>
  )
}

export default App