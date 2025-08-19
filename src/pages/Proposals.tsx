import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../components/api'

export default function Proposals() {
  const { id } = useParams() // jobId
  const [role, setRole] = useState<string>('')
  const [coverLetter, setCoverLetter] = useState('')
  const [bidAmount, setBidAmount] = useState<number>(0)
  const [list, setList] = useState<any[]>([])
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    api.get('/api/auth/me').then(r => setRole(r.data.role)).catch(()=>{})
    // Try load proposals (if client)
    api.get('/api/proposals/job/' + id).then(r => setList(r.data)).catch(()=>{})
  }, [id])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      await api.post('/api/proposals', { jobId: id, coverLetter, bidAmount })
      setMsg('Proposal sent!')
    } catch (e:any) { setMsg(e.response?.data?.message || 'Error') }
  }

  async function accept(pid: string) {
    await api.post('/api/proposals/' + pid + '/accept')
    setList(list => list.map(x => x._id === pid ? { ...x, status: 'accepted' } : x))
  }
  async function reject(pid: string) {
    await api.post('/api/proposals/' + pid + '/reject')
    setList(list => list.map(x => x._id === pid ? { ...x, status: 'rejected' } : x))
  }

  return (
    <div style={{ maxWidth: 900, margin:'20px auto' }}>
      <h3>Proposals</h3>
      {role === 'freelancer' && (
        <form onSubmit={send} style={{ display:'grid', gap:8, border:'1px solid #eee', padding:10, borderRadius:8 }}>
          <textarea placeholder="Cover letter" value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} />
          <input type="number" placeholder="Bid amount" value={bidAmount} onChange={e=>setBidAmount(Number(e.target.value))} />
          <button type="submit">Send Proposal</button>
        </form>
      )}

      {role === 'client' && (
        <div style={{ display:'grid', gap:8, marginTop:12 }}>
          {list.map(p => (
            <div key={p._id} style={{ border:'1px solid #eee', padding:8, borderRadius:8 }}>
              <div><b>{p.freelancer?.name}</b> — ₦{p.bidAmount} — {p.status}</div>
              <div>{p.coverLetter}</div>
              {p.status === 'pending' && (
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>accept(p._id)}>Accept</button>
                  <button onClick={()=>reject(p._id)}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {msg && <p>{msg}</p>}
    </div>
  )
}
