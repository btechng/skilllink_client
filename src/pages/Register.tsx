import React, { useState } from 'react'
import api from '../components/api'

export default function Register() {
  const [form, setForm] = useState({
    name:'', email:'', password:'',
    role: 'freelancer',
    phone:'', country:'', city:'', profileImage:'',
    title:'', bio:'', skills:'', experienceLevel:'beginner', hourlyRate:0,
    portfolioLinks:'', languages:'',
    companyName:'', companyWebsite:'', industry:'', teamSize:''
  })
  const [msg, setMsg] = useState<string| null>(null)

  function update<K extends keyof typeof form>(key: K, val: any) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
        portfolioLinks: form.portfolioLinks ? form.portfolioLinks.split(',').map(s => s.trim()) : [],
        languages: form.languages ? form.languages.split(',').map(s => s.trim()) : []
      }
      const { data } = await api.post('/api/auth/register', payload)
      localStorage.setItem('token', data.token)
      setMsg('Registered! You can go to Dashboard.')
    } catch (e:any) {
      setMsg(e.response?.data?.message || 'Error')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'Inter, system-ui' }}>
      <h2>Register</h2>
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <div><label>Name</label><input value={form.name} onChange={e=>update('name', e.target.value)} /></div>
        <div><label>Email</label><input value={form.email} onChange={e=>update('email', e.target.value)} /></div>
        <div><label>Password</label><input type="password" value={form.password} onChange={e=>update('password', e.target.value)} /></div>
        <div>
          <label>Role</label>
          <select value={form.role} onChange={e=>update('role', e.target.value)}>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          <div><label>Phone</label><input value={form.phone} onChange={e=>update('phone', e.target.value)} /></div>
          <div><label>Country</label><input value={form.country} onChange={e=>update('country', e.target.value)} /></div>
          <div><label>City</label><input value={form.city} onChange={e=>update('city', e.target.value)} /></div>
        </div>
        <div><label>Profile Image URL</label><input value={form.profileImage} onChange={e=>update('profileImage', e.target.value)} placeholder="Paste Cloudinary URL after upload"/></div>

        {form.role === 'freelancer' && (
          <>
            <div><label>Title</label><input value={form.title} onChange={e=>update('title', e.target.value)} /></div>
            <div><label>Bio</label><textarea value={form.bio} onChange={e=>update('bio', e.target.value)} /></div>
            <div><label>Skills (comma separated)</label><input value={form.skills} onChange={e=>update('skills', e.target.value)} /></div>
            <div><label>Experience Level</label>
              <select value={form.experienceLevel} onChange={e=>update('experienceLevel', e.target.value)}>
                <option>beginner</option><option>intermediate</option><option>expert</option>
              </select>
            </div>
            <div><label>Hourly Rate</label><input type="number" value={form.hourlyRate} onChange={e=>update('hourlyRate', Number(e.target.value))} /></div>
            <div><label>Portfolio Links (comma separated)</label><input value={form.portfolioLinks} onChange={e=>update('portfolioLinks', e.target.value)} /></div>
            <div><label>Languages (comma separated)</label><input value={form.languages} onChange={e=>update('languages', e.target.value)} /></div>
          </>
        )}

        {form.role === 'client' && (
          <>
            <div><label>Company Name</label><input value={form.companyName} onChange={e=>update('companyName', e.target.value)} /></div>
            <div><label>Company Website</label><input value={form.companyWebsite} onChange={e=>update('companyWebsite', e.target.value)} /></div>
            <div><label>Industry</label><input value={form.industry} onChange={e=>update('industry', e.target.value)} /></div>
            <div><label>Team Size</label><input value={form.teamSize} onChange={e=>update('teamSize', e.target.value)} /></div>
          </>
        )}

        <button type="submit">Create account</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
