import { useState } from 'react'
import { uploadFile } from '../api'

export default function FileUploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await uploadFile(formData)
      setMessage(response)
      setFile(null)
      onUploadSuccess?.() // újralistázás
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Upload File</h2>
      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
        className="block"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
