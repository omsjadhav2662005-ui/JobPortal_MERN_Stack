import { useState, useEffect } from 'react'

export default function SocialModal({ isOpen, onClose, onSave, initialLinks }) {
  const [portfolio, setPortfolio] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [twitter, setTwitter] = useState('')

  useEffect(() => {
    if (initialLinks) {
      setPortfolio(initialLinks.portfolio || '')
      setLinkedin(initialLinks.linkedin || '')
      setGithub(initialLinks.github || '')
      setTwitter(initialLinks.twitter || '')
    }
  }, [initialLinks])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ portfolio, linkedin, github, twitter })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Edit Social Links</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Portfolio URL"
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
          />
          <input
            type="url"
            placeholder="LinkedIn URL"
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
          <input
            type="url"
            placeholder="GitHub URL"
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          <input
            type="url"
            placeholder="Twitter URL"
            className="w-full p-3 border border-gray-300 rounded-full mb-4"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
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