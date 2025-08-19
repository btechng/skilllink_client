import React, { useEffect, useState } from 'react'
import api from '../components/api'

export default function Admin() {
  const [users, setUsers] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [tx, setTx] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/users'),
      api.get('/api/admin/jobs'),
      api.get('/api/admin/transactions')
    ]).then(([u, j, t]) => { setUsers(u.data); setJobs(j.data); setTx(t.data) })
    .catch(e => setError(e.response?.data?.message || 'Admin auth required'))
  }, [])

  async function ban(id: string) {
    await api.delete('/api/admin/users/' + id)
    setUsers(arr => arr.filter(u => u._id !== id))
  }

  if (error) return <div style={{ maxWidth:900, margin:'20px auto' }}><p>{error}</p></div>

  return (
    <div style={{ maxWidth: 1100, margin:'20px auto', display:'grid', gap:20 }}>
      <h2>Admin Dashboard</h2>
      <section>
        <h3>Users</h3>
        <ul>
          {users.map(u => (
            <li key={u._id}>
              {u.name} — {u.email} — {u.role}
              <button style={{ marginLeft:10 }} onClick={()=>ban(u._id)}>Ban</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Jobs</h3>
        <ul>
          {jobs.map(j => <li key={j._id}>{j.title} — {j.status}</li>)}
        </ul>
      </section>
      <section>
        <h3>Transactions</h3>
        <ul>
          {tx.map(t => <li key={t._id}>{t.job?.title} — ₦{t.amount} — {t.status}</li>)}
        </ul>
      </section>
    </div>
  )
}
