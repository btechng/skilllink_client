import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './pages/App'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Gallery from './pages/Gallery'
import Jobs from './pages/Jobs'
import PostJob from './pages/PostJob'
import JobDetails from './pages/JobDetails'
import Proposals from './pages/Proposals'
import Wallet from './pages/Wallet'
import Admin from './pages/Admin'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/gallery', element: <Gallery /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/jobs/new', element: <PostJob /> },
  { path: '/jobs/:id', element: <JobDetails /> },
  { path: '/jobs/:id/proposals', element: <Proposals /> },
  { path: '/wallet', element: <Wallet /> },
  { path: '/admin', element: <Admin /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
