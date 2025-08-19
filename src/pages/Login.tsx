import React, { useState } from 'react'
import api from '../components/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      setMsg('Logged in!')
    } catch (e:any) {
      setMsg(e.response?.data?.message || 'Error')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'Inter, system-ui' }}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">Login</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
