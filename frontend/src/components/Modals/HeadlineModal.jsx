import { useState, useEffect } from 'react'

export default function HeadlineModal({ isOpen, onClose, onSave, initialHeadline }) {
  const [headline, setHeadline] = useState('')

  useEffect(() => {
    setHeadline(initialHeadline || '')
  }, [initialHeadline])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(headline)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Edit Profile Headline</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g. Frontend Developer | React Specialist"
            className="w-full p-3 border border-gray-300 rounded-full mb-4"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700">
              Save
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}