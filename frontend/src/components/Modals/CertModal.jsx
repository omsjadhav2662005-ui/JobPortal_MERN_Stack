import { useState } from 'react'

export default function CertModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('')
  const [issuer, setIssuer] = useState('')
  const [year, setYear] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name && issuer && year) {
      onSave({ name, issuer, year })
      setName('')
      setIssuer('')
      setYear('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Add Certification</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Certification name"
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Issuing organization"
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Year"
            className="w-full p-3 border border-gray-300 rounded-full mb-4"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700">
              Add
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