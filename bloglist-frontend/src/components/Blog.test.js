import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  const blog = {
    title: 'Un mio blog',
    author: 'Marcello della Fiore',
    url: 'www.mipiacitu.com',
    upvotes: 12
  }

  test('Render title and author but not url or number of likes by default', async () => {
    const { container } = render(<Blog blog={blog} />)

    const mainDiv = container.querySelector('.main')
    expect(mainDiv).toHaveTextContent(
      'Un mio blog'
    )
    expect(mainDiv).toHaveTextContent(
      'Marcello della Fiore'
    )

    const moreDiv = container.querySelector('.more')
    expect(moreDiv).toHaveStyle('display: none')
    expect(moreDiv).toHaveTextContent(
      'www.mipiacitu.com'
    )

  })


  test('Display url and upvotes information after Show details button click', async () => {
    const { container } = render(<Blog blog={blog} />)

    const button = screen.getByText('Show details')
    await userEvent.click(button)

    expect(button).toHaveTextContent('Hide details')

    const moreDiv = container.querySelector('.more')
    expect(moreDiv).toHaveStyle('display: block')
  })


  test('like button clicked twice, event handler called twice', async () => {
    const mockHandlerLike = jest.fn()

    render(<Blog blog={blog} handleIncrementUpvotes={mockHandlerLike} />)

    const likeButton = screen.getByText('Like')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(mockHandlerLike.mock.calls).toHaveLength(2)
  })


})