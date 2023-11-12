import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls the event handler with the right details when a new blog is created', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const title = screen.getByLabelText('Title:')
    const author = screen.getByLabelText('Author:')
    const url = screen.getByLabelText('URL:')
    const createBtn = screen.getByText('Create')

    await user.type(title, 'Goalkeeper')
    await user.type(author, 'Mike Maignan')
    await user.type(url, 'www.mikemike.it')

    await user.click(createBtn)

    expect(createBlog.mock.calls[0][0].title).toBe('Goalkeeper')
    expect(createBlog.mock.calls[0][0].author).toBe('Mike Maignan')
    expect(createBlog.mock.calls[0][0].url).toBe('www.mikemike.it')

  })
})
