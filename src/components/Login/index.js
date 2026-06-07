import { Component } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import './index.css'

// Wrapper to inject navigate into class component
const LoginWrapper = () => {
  const navigate = useNavigate()
  return <Login navigate={navigate} />
}

class Login extends Component {
  state = { username: '', password: '', showErrorMsg: false, errorMsg: '' }

  onChangeUsername = event => this.setState({ username: event.target.value })
  onChangePassword = event => this.setState({ password: event.target.value })

  onSubmitSuccess = jwtToken => {
    const { navigate } = this.props
    Cookies.set('jwtToken', jwtToken, { expires: 30 })
    navigate('/', { replace: true })
  }

  onSubmitFailure = errorMsg => {
    this.setState({ showErrorMsg: true, errorMsg })
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const { username, password } = this.state
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const { username, password, showErrorMsg, errorMsg } = this.state
    return (
      <div className="login-container">
        <div className="login-container2">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-image"
          />
          <form onSubmit={this.onSubmitForm}>
            <div className="inputs-container">
              <div className="username-container">
                <label htmlFor="username" className="label-name">USERNAME</label>
                <input type="text" placeholder="Username" className="input"
                  id="username" onChange={this.onChangeUsername} value={username} />
              </div>
              <div className="username-container">
                <label htmlFor="password" className="label-name">PASSWORD</label>
                <input type="password" placeholder="Password" className="input"
                  id="password" onChange={this.onChangePassword} value={password} />
              </div>
              <button className="login-button" type="submit">Login</button>
              {showErrorMsg && <p className="error-message">*{errorMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginWrapper