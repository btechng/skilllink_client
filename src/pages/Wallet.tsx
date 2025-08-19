import React, { useEffect, useState } from 'react'
import api from '../components/api'

export default function Wallet() {
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [authUrl, setAuthUrl] = useState<string>('')
  const [tx, setTx] = useState<any[]>([])

  useEffect(() => {
    api.get('/api/jobs').then(r => setJobs(r.data))
    api.get('/api/transactions/me').then(r => setTx(r.data)).catch(()=>{})
  }, [])

  async function fund(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await api.post('/api/transactions/fund', { jobId: selectedJob, amount })
    setAuthUrl(data.authorization_url)
    window.location.href = data.authorization_url // redirect to Paystack
  }

  return (
    <div style={{ maxWidth: 800, margin:'20px auto' }}>
      <h2>Escrow Wallet</h2>
      <form onSubmit={fund} style={{ display:'grid', gap:8 }}>
        <select value={selectedJob} onChange={e=>setSelectedJob(e.target.value)}>
          <option value="">Select Job with accepted proposal</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
        <button type="submit">Fund via Paystack</button>
      </form>

      <h3 style={{ marginTop:20 }}>My Transactions</h3>
      <ul>
        {tx.map(t => <li key={t._id}>{t.job?.title} — ₦{t.amount} — {t.status}</li>)}
      </ul>
    </div>
  )
}
