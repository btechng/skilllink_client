import React from 'react'
import CloudinaryUpload from '../components/CloudinaryUpload'
import api from '../components/api'

export default function ProfilePicUploader() {
  async function onUploaded(url: string) {
    await api.put('/api/auth/me', { profileImage: url })
    alert('Profile image updated!')
  }
  return <CloudinaryUpload onUploaded={(url) => onUploaded(url)} />
}
