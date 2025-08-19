import React, { useEffect, useState } from 'react'
import api from '../components/api'
import CloudinaryUpload from '../components/CloudinaryUpload'

type Work = {
  _id: string
  title: string
  description?: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  createdAt: string
}

export default function Dashboard() {
  const [me, setMe] = useState<any>(null)
  const [works, setWorks] = useState<Work[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    api.get('/api/auth/me').then(res => setMe(res.data)).catch(() => setMe(null))
    api.get('/api/works/me').then(res => setWorks(res.data)).catch(()=>{})
  }, [])

  async function createWork(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      const { data } = await api.post('/api/works', { title, description, mediaUrl, mediaType })
      setWorks(w => [data, ...w])
      setTitle(''); setDescription(''); setMediaUrl('')
      setMsg('Work created')
    } catch (e:any) {
      setMsg(e.response?.data?.message || 'Error')
    }
  }

  return (
    <div style={{ maxWidth: 900, margin:'20px auto', fontFamily:'Inter, system-ui' }}>
      <h2>Dashboard</h2>
      {!me && <p>Please login.</p>}
      {me && (
        <div style={{ display:'grid', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <img src={me.profileImage || 'https://via.placeholder.com/64'} width={64} height={64} style={{ borderRadius: 8 }} />
            <div>
              <div>{me.name}</div>
              <small>{me.role} {me.title ? '• ' + me.title : ''}</small>
            </div>
          </div>

          <div style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
            <h3>Upload media to Cloudinary</h3>
            <CloudinaryUpload onUploaded={(url, type) => { setMediaUrl(url); setMediaType(type || 'image') }} />
            {mediaUrl && (
              <div style={{ marginTop: 8 }}>
                <span>Uploaded URL:</span>
                <code style={{ display:'block', overflow:'auto' }}>{mediaUrl}</code>
              </div>
            )}
          </div>

          <form onSubmit={createWork} style={{ display:'grid', gap:10 }}>
            <h3>Create Work</h3>
            <div><label>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} required /></div>
            <div><label>Description</label><textarea value={description} onChange={e=>setDescription(e.target.value)} /></div>
            <div><label>Media URL</label><input value={mediaUrl} onChange={e=>setMediaUrl(e.target.value)} placeholder="Use the URL from the upload above" required /></div>
            <div><label>Media Type</label>
              <select value={mediaType} onChange={e=>setMediaType(e.target.value as any)}>
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
            </div>
            <button type="submit">Save Work</button>
          </form>
          {msg && <p>{msg}</p>}

          <h3>My Works</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:12 }}>
            {works.map(w => (
              <div key={w._id} style={{ border:'1px solid #eee', padding:8, borderRadius:8 }}>
                <strong>{w.title}</strong>
                {w.mediaType === 'image'
                  ? <img src={w.mediaUrl} style={{ width:'100%', borderRadius:6, marginTop:6 }} />
                  : <video src={w.mediaUrl} controls style={{ width:'100%', borderRadius:6, marginTop:6 }} />}
                <small style={{ display:'block', opacity:0.7 }}>{new Date(w.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
