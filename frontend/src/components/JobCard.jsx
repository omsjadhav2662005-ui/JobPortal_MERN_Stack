import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getCompanyLogo, getCategoryImage, daysAgo, statusColor, typeColor } from '../utils/helpers';

export default function JobCard({ job }) {
  const { user, saveJob, unsaveJob } = useAuth();
  const { applyToJob, myApplications } = useData();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);

  const isSaved   = user?.savedJobs?.includes(job._id);
  const appRecord = myApplications?.find(a => (a.job?._id||a.job) === job._id);
  const applied   = !!appRecord;

  const handleApply = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { navigate('/signin'); return; }
    if (!user.resume) { navigate('/dashboard'); return; }
    setApplying(true);
    try { await applyToJob(job._id); }
    catch (err) { alert(err.message); }
    finally { setApplying(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { navigate('/signin'); return; }
    isSaved ? await unsaveJob(job._id) : await saveJob(job._id);
  };

  return (
    <Link to={`/job/${job._id}`} className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden">
      {/* Category banner image */}
      <div className="relative h-28 overflow-hidden">
        <img
          src={getCategoryImage(job.category)}
          alt={job.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.style.display='none'; e.target.parentElement.style.background='#EEF2FF'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        {/* Category badge overlaid on image */}
        <span className="absolute bottom-2 left-3 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          {job.category}
        </span>
        {/* Type badge top-right */}
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-lg ${typeColor(job.type)} backdrop-blur-sm`}>
          {job.type}
        </span>
        {/* Applied badge */}
        {applied && (
          <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-lg ${statusColor(appRecord.status)} backdrop-blur-sm`}>
            {appRecord.status}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-2">
          <img
            src={getCompanyLogo(job.company)}
            alt={job.company}
            className="-mt-7 w-11 h-11 rounded-xl border-2 border-white shadow-md flex-shrink-0 relative z-10"
          />
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition leading-tight text-sm">{job.title}</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{job.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap mb-2">
          <span><i className="fas fa-map-pin mr-1"></i>{job.location}</span>
          {job.experienceLevel && <span><i className="fas fa-layer-group mr-1"></i>{job.experienceLevel}</span>}
        </div>

        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 flex-1">
            {job.skills.slice(0,3).map(s=><span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{s}</span>)}
            {job.skills.length>3 && <span className="text-xs text-gray-400">+{job.skills.length-3}</span>}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
          <div>
            <p className="text-sm font-bold text-gray-900">{job.salary||'Negotiable'}</p>
            <p className="text-xs text-gray-400">{daysAgo(job.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition text-sm ${isSaved?'bg-amber-500 text-white border-amber-500':'border-gray-200 text-gray-400 hover:border-amber-400 hover:text-amber-500'}`}>
              <i className="fas fa-bookmark text-xs"></i>
            </button>
            <button onClick={handleApply} disabled={applying||applied} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${applied?'bg-green-100 text-green-700 cursor-default':'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60'}`}>
              {applying ? <i className="fas fa-spinner fa-spin"></i> : applied ? '✓ Applied' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
