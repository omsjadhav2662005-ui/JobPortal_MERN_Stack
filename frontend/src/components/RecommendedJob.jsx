export default function RecommendedJob({ job, onApply }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h4 className="font-semibold">{job.title}</h4>
      <p className="text-sm text-gray-600">{job.company}</p>
      <button
        onClick={() => onApply(job._id)}
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded-full text-sm font-semibold hover:bg-blue-700"
      >
        Apply
      </button>
    </div>
  );
}