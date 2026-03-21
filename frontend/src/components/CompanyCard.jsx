import { useNavigate } from 'react-router-dom'
import { getCompanyLogo } from '../utils/helpers'

export default function CompanyCard({ name, jobCount, tagline, avgRating }) {
  const navigate = useNavigate()
  const logoUrl = getCompanyLogo(name)

  return (
    <div
      className="bg-white rounded-3xl p-6 text-center shadow-sm border border-gray-100 cursor-pointer hover:scale-105 hover:border-blue-600 transition-all"
      onClick={() => navigate(`/company/${encodeURIComponent(name)}`)}
    >
      <img src={logoUrl} alt={name} className="w-20 h-20 mx-auto rounded-2xl object-cover mb-4" />
      <h3 className="text-xl font-semibold">{name}</h3>
      <div className="text-amber-500 my-2">⭐ {avgRating}</div>
      <p className="text-gray-500 italic text-sm">{tagline}</p>
      <p className="mt-2 text-gray-700">{jobCount} open jobs</p>
    </div>
  )
}