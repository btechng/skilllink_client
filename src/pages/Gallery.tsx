import React, { useEffect, useState } from 'react'
import api from '../components/api'

type Work = {
  _id: string
  title: string
  description?: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  user?: { name: string, profileImage?: string, title?: string }
}

export default function Gallery() {
  const [items, setItems] = useState<Work[]>([])

  useEffect(() => {
    api.get('/api/works').then(res => setItems(res.data))
  }, [])

  return (
    <div style={{ maxWidth: 1100, margin:'20px auto', fontFamily:'Inter, system-ui' }}>
      <h2>Public Gallery</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:12 }}>
        {items.map(x => (
          <div key={x._id} style={{ border:'1px solid #eee', padding:8, borderRadius:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <img src={x.user?.profileImage || 'https://via.placeholder.com/32'} width={32} height={32} style={{ borderRadius: 6 }} />
              <div>
                <strong>{x.title}</strong>
                <div style={{ fontSize:12, opacity:0.7 }}>{x.user?.name} {x.user?.title ? '• ' + x.user.title : ''}</div>
              </div>
            </div>
            {x.mediaType === 'image'
              ? <img src={x.mediaUrl} style={{ width:'100%', borderRadius:6, marginTop:6 }} />
              : <video src={x.mediaUrl} controls style={{ width:'100%', borderRadius:6, marginTop:6 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
