import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const jwtToken = Cookies.get('jwtToken')
  if (jwtToken === undefined) {
    return <Navigate to="/login" />
  }
  return children
}

export default ProtectedRoute