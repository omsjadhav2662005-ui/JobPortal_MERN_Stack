export default function EducationItem({ edu, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-3xl p-4 flex justify-between items-center mb-2 shadow-sm">
      <div>
        <strong>{edu.degree}</strong> at {edu.institution} ({edu.year})
        {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="text-gray-500 hover:text-blue-600"><i className="fas fa-edit"></i></button>
        <button onClick={onDelete} className="text-gray-500 hover:text-red-600"><i className="fas fa-trash"></i></button>
      </div>
    </div>
  )
}