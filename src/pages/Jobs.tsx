import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../components/api'

type Job = { _id: string, title: string, budget: number, status: string }

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  useEffect(() => { api.get('/api/jobs').then(r => setJobs(r.data)) }, [])
  return (
    <div style={{ maxWidth: 900, margin:'20px auto' }}>
      <h2>Jobs</h2>
      <Link to="/jobs/new">Post a Job</Link>
      <ul>
        {jobs.map(j => (
          <li key={j._id}>
            <Link to={`/jobs/${j._id}`}>{j.title}</Link> — ₦{j.budget} — {j.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
