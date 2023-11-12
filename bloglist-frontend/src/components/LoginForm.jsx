import { useState } from 'react'
import propTypes from 'prop-types'
import Button from './Button'

const LoginForm = ({ loginUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value)
  }

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    loginUser({
      username,
      password
    })

    setUsername('')
    setPassword('')
  }
  return (
    <form onSubmit={handleLogin}>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" value={username} onChange={handleUsernameChange} /><br /><br />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" value={password} onChange={handlePasswordChange} /><br /><br />
      <Button id="login-button" type="submit" label="Login" />
    </form>
  )
}

LoginForm.propTypes = {
  loginUser: propTypes.func.isRequired
}

export default LoginForm