import React from 'react'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>Freelance Marketplace</h1>
      <p>Demo: Auth, Upload portfolio to Cloudinary (unsigned), store URLs in MongoDB, and public gallery.</p>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>
    </div>
  )
}
