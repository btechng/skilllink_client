import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../components/api'

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState<any>(null)
  useEffect(() => { api.get('/api/jobs/' + id).then(r => setJob(r.data)) }, [id])
  if (!job) return <div>Loading...</div>
  return (
    <div style={{ maxWidth: 800, margin:'20px auto' }}>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p><b>Budget:</b> ₦{job.budget}</p>
      <p><b>Status:</b> {job.status}</p>
      <Link to={`/jobs/${id}/proposals`}>View/Send Proposals</Link>
    </div>
  )
}
