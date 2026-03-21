import { statusColor } from '../utils/helpers'

export default function ApplicationItem({ job, status }) {
  return (
    <div className="bg-white rounded-3xl p-4 flex justify-between items-center shadow-sm">
      <div>
        <span className="font-semibold">{job.title}</span> at {job.company}
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(status)}`}>
        {status}
      </span>
    </div>
  )
}