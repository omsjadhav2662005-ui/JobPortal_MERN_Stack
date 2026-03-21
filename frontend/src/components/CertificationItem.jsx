export default function CertificationItem({ cert, index, onRemove }) {
  return (
    <div className="bg-white rounded-3xl p-3 flex justify-between items-center mb-2 shadow-sm">
      <div>
        <strong>{cert.name}</strong> - {cert.issuer} ({cert.year})
      </div>
      <button onClick={() => onRemove(index)} className="text-gray-500 hover:text-red-600">
        <i className="fas fa-trash"></i>
      </button>
    </div>
  )
}