import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { AiFillHome } from 'react-icons/ai'
import { BsBriefcaseFill } from 'react-icons/bs'
import { FiLogOut } from 'react-icons/fi'
import './index.css'

const Header = () => {
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwtToken')
    navigate('/login', { replace: true })
  }

  return (
    <nav className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <ul className="header-nav-links">
        <li><Link to="/" className="header-link">Home</Link></li>
        <li><Link to="/jobs" className="header-link">Jobs</Link></li>
      </ul>
      <button type="button" className="logout-button" onClick={onClickLogout}>
        Logout
      </button>

      {/* Mobile nav */}
      <ul className="mobile-nav-links">
        <li><Link to="/"><AiFillHome className="nav-icon" /></Link></li>
        <li><Link to="/jobs"><BsBriefcaseFill className="nav-icon" /></Link></li>
        <li>
          <button type="button" className="logout-icon-button" onClick={onClickLogout}>
            <FiLogOut className="nav-icon" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Header