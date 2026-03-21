import { useState, useEffect } from 'react'

export default function EntryModal({ isOpen, onClose, onSave, section, editData }) {
  const [field1, setField1] = useState('')
  const [field2, setField2] = useState('')
  const [field3, setField3] = useState('')
  const [field4, setField4] = useState('')

  useEffect(() => {
    if (editData) {
      if (section === 'education') {
        setField1(editData.degree || '')
        setField2(editData.institution || '')
        setField3(editData.year || '')
        setField4(editData.description || '')
      } else {
        setField1(editData.title || '')
        setField2(editData.company || '')
        setField3(editData.duration || '')
        setField4(editData.description || '')
      }
    } else {
      setField1('')
      setField2('')
      setField3('')
      setField4('')
    }
  }, [editData, section])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const entry = section === 'education'
      ? { degree: field1, institution: field2, year: field3, description: field4 }
      : { title: field1, company: field2, duration: field3, description: field4 }
    onSave(entry)
  }

  const title = section === 'education' ? (editData ? 'Edit Education' : 'Add Education') : (editData ? 'Edit Experience' : 'Add Experience')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={section === 'education' ? 'Degree' : 'Job Title'}
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={field1}
            onChange={(e) => setField1(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder={section === 'education' ? 'Institution' : 'Company'}
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={field2}
            onChange={(e) => setField2(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder={section === 'education' ? 'Year' : 'Duration'}
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={field3}
            onChange={(e) => setField3(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            rows="2"
            className="w-full p-3 border border-gray-300 rounded-2xl mb-4"
            value={field4}
            onChange={(e) => setField4(e.target.value)}
          ></textarea>
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