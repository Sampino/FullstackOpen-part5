import { useState, forwardRef, useImperativeHandle } from 'react'
import Button from './Button'

const Toggable = forwardRef((props, refs) => {
  const [visibility, setVisiblity] = useState(false)

  const handleVisibility = () => {
    setVisiblity(!visibility)
  }

  const hideWhenVisible = { display: visibility ? 'none' : '' }
  const showWhenVisible = { display: visibility ? '' : 'none' }

  useImperativeHandle(refs, () => {
    return {
      handleVisibility
    }
  })

  return (
    <>
      <div>
        <Button id="create-toggle" style={hideWhenVisible} handler={handleVisibility} label="Create blog" />
        <div style={showWhenVisible}>
          {props.children}
        </div>
        <Button style={showWhenVisible} handler={handleVisibility} label="Hide form" />
      </div>
    </>
  )
})

Toggable.displayName = 'Toggable'

export default Toggable