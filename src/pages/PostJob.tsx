import React, { useState } from 'react'
import api from '../components/api'

export default function PostJob() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState(0)
  const [category, setCategory] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      await api.post('/api/jobs', { title, description, budget, category })
      setMsg('Job posted!')
      setTitle(''); setDescription(''); setBudget(0); setCategory('')
    } catch (e:any) { setMsg(e.response?.data?.message || 'Error') }
  }

  return (
    <div style={{ maxWidth: 700, margin:'20px auto' }}>
      <h2>Post a Job (Client)</h2>
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input type="number" placeholder="Budget" value={budget} onChange={e=>setBudget(Number(e.target.value))} required />
        <input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
