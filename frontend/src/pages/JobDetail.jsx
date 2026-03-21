import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { getCompanyLogo, getCompanyCover, getCategoryImage, daysAgo, fmtDate, statusColor, imgUrl, getAvatar, typeColor } from '../utils/helpers';
import API from '../api';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, applyToJob, myApplications, withdrawApp } = useData();
  const { user, saveJob, unsaveJob } = useAuth();

  const [job, setJob]           = useState(null);
  const [similar, setSimilar]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverNote, setCover]   = useState('');
  const [showCover, setShowCover] = useState(false);
  const [msg, setMsg]           = useState({ type:'', text:'' });
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const cached = jobs.find(j => j._id === id);
    if (cached) { setJob(cached); setLoading(false); }
    API.get(`/jobs/${id}`).then(r=>{ setJob(r.data); setLoading(false); }).catch(()=>setLoading(false));
    API.get(`/jobs/${id}/similar`).then(r=>setSimilar(r.data)).catch(()=>{});
  }, [id]);

  if (loading) return <div className="flex justify-center items-center py-32"><i className="fas fa-spinner fa-spin text-blue-600 text-3xl"></i></div>;
  if (!job) return <div className="max-w-2xl mx-auto my-16 text-center"><i className="fas fa-exclamation-circle text-gray-200 text-5xl mb-4 block"></i><p className="text-gray-500 text-lg">Job not found or removed.</p><Link to="/" className="text-blue-600 hover:underline mt-2 block">Browse all jobs</Link></div>;

  const appRecord = myApplications?.find(a => (a.job?._id||a.job)===job._id);
  const applied   = !!appRecord;
  const isSaved   = user?.savedJobs?.includes(job._id);

  const handleApply = async () => {
    if (!user) { navigate('/signin', { state:{ from:`/job/${id}` } }); return; }
    if (!user.resume) { setMsg({ type:'warn', text:'Please upload your resume in Dashboard first.' }); return; }
    if (applied) return;
    setApplying(true); setMsg({ type:'', text:'' });
    try { await applyToJob(job._id, coverNote); setMsg({ type:'success', text:`Applied successfully with ${user.resume.name}!` }); setShowCover(false); }
    catch (e) { setMsg({ type:'error', text:e.message }); }
    finally { setApplying(false); }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('Withdraw this application?')) return;
    setWithdrawing(true);
    try { await withdrawApp(appRecord._id); setMsg({ type:'success', text:'Application withdrawn.' }); }
    catch (e) { setMsg({ type:'error', text:e.message }); }
    finally { setWithdrawing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      {/* Full-width category banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-52">
        <img src={getCategoryImage(job.category)} alt={job.category} className="w-full h-full object-cover" onError={e=>{e.target.style.background='#1e3a5f';e.target.style.display='none';}} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
          <img src={getCompanyLogo(job.company)} className="w-16 h-16 rounded-2xl border-3 border-white shadow-lg flex-shrink-0" alt="" style={{borderWidth:'3px',borderColor:'white'}} />
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white drop-shadow leading-tight">{job.title}</h1>
            <button onClick={()=>navigate(`/company/${encodeURIComponent(job.company)}`)} className="text-white/80 hover:text-white text-sm font-medium hover:underline">{job.company}</button>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${typeColor(job.type)} backdrop-blur-sm`}>{job.type}</span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/30 text-white backdrop-blur-sm">{job.category}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[['fa-map-pin',job.location],['fa-money-bill-wave',job.salary||'Negotiable'],['fa-eye',`${job.views||0} views`],['fa-clock',daysAgo(job.createdAt)]].map(([ic,val])=>(
                <div key={ic} className="bg-gray-50 rounded-xl p-3 text-center">
                  <i className={`fas ${ic} text-blue-600 mb-1 block`}></i>
                  <span className="text-xs font-semibold text-gray-700">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-semibold">{job.experienceLevel}</span>
                {job.deadline && <span className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-lg font-semibold"><i className="fas fa-calendar mr-1"></i>Deadline: {fmtDate(job.deadline)}</span>}
              </div>
              <button onClick={()=>isSaved?unsaveJob(job._id):saveJob(job._id)} className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition ${isSaved?'bg-amber-500 text-white border-amber-500':'border-gray-200 text-gray-400 hover:border-amber-400 hover:text-amber-500'}`}>
                <i className="fas fa-bookmark text-sm"></i>
              </button>
            </div>
            {job.skills?.length>0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">{job.skills.map(s=><span key={s} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-medium">{s}</span>)}</div>
              </div>
            )}

            {/* Apply area */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              {msg.text && <div className={`rounded-xl p-3 mb-3 text-sm flex items-center gap-2 ${msg.type==='success'?'bg-green-50 text-green-800 border border-green-200':msg.type==='warn'?'bg-yellow-50 text-yellow-800 border border-yellow-200':'bg-red-50 text-red-700 border border-red-200'}`}><i className={`fas ${msg.type==='success'?'fa-check-circle':msg.type==='warn'?'fa-exclamation-triangle':'fa-times-circle'}`}></i>{msg.text}</div>}
              {!user ? (
                <Link to="/signin" state={{ from:`/job/${id}` }} className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-center transition">Sign in to Apply</Link>
              ) : applied ? (
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className={`font-bold px-4 py-2 rounded-xl text-sm ${statusColor(appRecord.status)}`}><i className="fas fa-check-circle mr-2"></i>Status: {appRecord.status}</span>
                  {appRecord.status==='Applied' && <button onClick={handleWithdraw} disabled={withdrawing} className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition">{withdrawing?<i className="fas fa-spinner fa-spin"></i>:'Withdraw'}</button>}
                </div>
              ) : !user.resume ? (
                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <i className="fas fa-exclamation-triangle text-yellow-600"></i>
                  <span className="text-sm text-yellow-800 flex-1">Upload a resume in <Link to="/dashboard" className="underline font-semibold">Dashboard</Link> first.</span>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-3"><i className="fas fa-file-pdf text-red-500 mr-2"></i>Resume: <strong>{user.resume.name}</strong></p>
                  {showCover && <textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Add a short cover note (optional)..." value={coverNote} onChange={e=>setCover(e.target.value)} />}
                  <div className="flex gap-3">
                    <button onClick={handleApply} disabled={applying} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-60 flex items-center justify-center gap-2">
                      {applying?<><i className="fas fa-spinner fa-spin"></i>Applying...</>:<><i className="fas fa-paper-plane"></i>Apply Now</>}
                    </button>
                    <button onClick={()=>setShowCover(!showCover)} className="px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 transition">{showCover?'Hide':'+ Cover Note'}</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
            {job.responsibilities?.length>0 && <div className="mt-5"><h3 className="font-bold mb-2">Responsibilities</h3><ul className="space-y-1.5">{job.responsibilities.map((r,i)=><li key={i} className="flex items-start gap-2 text-sm text-gray-700"><i className="fas fa-check-circle text-blue-500 mt-0.5 flex-shrink-0"></i>{r}</li>)}</ul></div>}
            {job.requirements?.length>0 && <div className="mt-5"><h3 className="font-bold mb-2">Requirements</h3><ul className="space-y-1.5">{job.requirements.map((r,i)=><li key={i} className="flex items-start gap-2 text-sm text-gray-700"><i className="fas fa-arrow-right text-gray-400 mt-0.5 flex-shrink-0"></i>{r}</li>)}</ul></div>}
          </div>

          {/* Application timeline */}
          {appRecord?.statusHistory?.length>1 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold mb-3">Application Timeline</h2>
              <div className="space-y-3">
                {appRecord.statusHistory.map((h,i)=>(
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i===appRecord.statusHistory.length-1?'bg-blue-600':'bg-gray-300'}`}></div>
                    <div><span className={`text-xs font-bold px-2 py-0.5 rounded-md ${statusColor(h.status)}`}>{h.status}</span>{h.note&&<span className="text-xs text-gray-500 ml-2">{h.note}</span>}<div className="text-xs text-gray-400 mt-0.5">{fmtDate(h.changedAt)}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <img src={getCompanyCover(job.company)} alt="" className="w-full h-24 object-cover" onError={e=>{e.target.style.display='none';}} />
            <div className="p-5">
              <h2 className="font-bold mb-2">About {job.company}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{job.companyDesc||`${job.company} is hiring talented professionals.`}</p>
              {job.postedBy && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <img src={job.postedBy.profilePicture?imgUrl(job.postedBy.profilePicture):getAvatar(job.postedBy.name)} className="w-8 h-8 rounded-full object-cover" alt="" />
                  <div><p className="text-xs font-semibold">{job.postedBy.name}</p><p className="text-xs text-gray-400">Posted {fmtDate(job.createdAt)}</p></div>
                </div>
              )}
              <button onClick={()=>navigate(`/company/${encodeURIComponent(job.company)}`)} className="mt-4 w-full border border-blue-200 text-blue-600 hover:bg-blue-50 py-2 rounded-xl text-sm font-semibold transition">View Company Profile</button>
            </div>
          </div>

          {similar.length>0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold mb-3">Similar Jobs</h2>
              <div className="space-y-3">
                {similar.map(j=>(
                  <Link key={j._id} to={`/job/${j._id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition">
                    <img src={getCompanyLogo(j.company)} className="w-9 h-9 rounded-lg flex-shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{j.title}</p>
                      <p className="text-xs text-gray-500">{j.company} · {j.type}</p>
                      {j.salary && <p className="text-xs text-gray-400">{j.salary}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
