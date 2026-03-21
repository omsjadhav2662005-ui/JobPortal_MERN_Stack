import { useState } from 'react'

export default function SkillModal({ isOpen, onClose, onSave }) {
  const [skill, setSkill] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (skill.trim()) {
      onSave(skill.trim())
      setSkill('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Add Skill</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g. React, Python, Figma"
            className="w-full p-3 border border-gray-300 rounded-full mb-4"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            autoFocus
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