import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import './App.css'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route exact path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route exact path="/jobs/:id" element={<ProtectedRoute><JobItemDetails /></ProtectedRoute>} />
      <Route exact path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  </BrowserRouter>
)

export default App