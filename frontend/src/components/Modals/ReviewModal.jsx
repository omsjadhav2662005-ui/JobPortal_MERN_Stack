import { useState } from 'react'

export default function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    onSubmit({ rating: parseInt(rating), comment, anonymous })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <select
            className="w-full p-3 border border-gray-300 rounded-full mb-3"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
          <textarea
            rows="3"
            placeholder="Your review..."
            className="w-full p-3 border border-gray-300 rounded-2xl mb-3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
            <span>Post anonymously</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700">
              Submit Review
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