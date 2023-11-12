import { useState, useEffect } from 'react'
import Button from './Button'

const Blog = ({ user, blog, handleDeleteBlog, handleIncrementUpvotes }) => {
  const [visibility, setVisiblity] = useState(false)

  const handleVisibility = () => {
    setVisiblity(!visibility)
  }

  const checkAuthorization = blog?.user?.name === user?.name

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      <div className='main'>
        {blog.title}&nbsp;
        {blog.author}
        <Button className='toggle-btn' handler={handleVisibility} label={visibility ? 'Hide details' : 'Show details'} />
        {checkAuthorization && <Button id='delete-btn' handler={handleDeleteBlog} label='Delete blog' />}
      </div>
      <div className='more' style={{ display: visibility ? '' : 'none' }}>
        <div>{blog.url}</div>
        <div>Likes: <span className="upvotes">{blog.upvotes}</span>&nbsp; <Button id='like-btn' label='Like' handler={handleIncrementUpvotes} /></div>
        <div>{blog?.user?.name}</div>
      </div>

    </div>
  )
}

export default Blog