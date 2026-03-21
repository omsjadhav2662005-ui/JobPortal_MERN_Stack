import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { imgUrl, getAvatar, statusColor, fmtDate, daysAgo } from '../utils/helpers';
import Modal from '../components/Modal';
import API from '../api';

const TABS = ['Overview','My Applications','Saved Jobs','Posted Jobs','Profile'];
const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function Dashboard() {
  const { user, updateUser, refreshUser } = useAuth();
  const { jobs, myApplications, fetchMyApplications, getJobApps, updateStatus, deleteJob, withdrawApp } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [selectedJobId, setSelectedJobId]     = useState(null);
  const [appsLoading, setAppsLoading] = useState(false);

  // Profile edit state
  const [editSection, setEditSection] = useState(null);
  const [editIdx, setEditIdx] = useState(-1);
  const [formData, setFormData] = useState({});

  // Upload states
  const [uploadingPic, setUploadingPic] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => { if(tab==='My Applications') fetchMyApplications(); if(tab==='Posted Jobs') fetchMyJobs(); }, [tab]);

  const fetchMyJobs = async () => { try { const {data} = await API.get('/jobs/myjobs'); setMyJobs(data); } catch {} };

  const handleViewApps = async (jobId) => {
    setAppsLoading(true); setSelectedJobId(jobId);
    try { setSelectedJobApps(await getJobApps(jobId)); } finally { setAppsLoading(false); }
  };

  const handleStatusChange = async (appId, status) => {
    await updateStatus(appId, status);
    setSelectedJobApps(await getJobApps(selectedJobId));
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job? All applications will be removed.')) return;
    await deleteJob(jobId);
    setMyJobs(p=>p.filter(j=>j._id!==jobId));
    if (selectedJobId===jobId) { setSelectedJobApps(null); setSelectedJobId(null); }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Withdraw this application?')) return;
    await withdrawApp(appId);
  };

  const uploadProfilePic = async (file) => {
    setUploadingPic(true);
    const fd = new FormData(); fd.append('image', file);
    try { const {data} = await API.post('/upload/profile-pic', fd); await updateUser({ profilePicture: data.profilePicture }); }
    catch { alert('Upload failed'); } finally { setUploadingPic(false); }
  };

  const uploadResume = async (file) => {
    setUploadingResume(true);
    const fd = new FormData(); fd.append('file', file);
    try { await API.post('/upload/resume', fd); await refreshUser(); }
    catch { alert('Upload failed'); } finally { setUploadingResume(false); }
  };

  // Profile section helpers
  const openEdit = (section, idx=-1, data={}) => { setEditSection(section); setEditIdx(idx); setFormData(data); };
  const closeEdit = () => { setEditSection(null); setEditIdx(-1); setFormData({}); };

  const saveEntry = async (key, arr) => { await updateUser({ [key]: arr }); closeEdit(); };

  const saveEdItem = async (key) => {
    const arr = [...(user[key]||[])];
    if (editIdx===-1) arr.push(formData); else arr[editIdx]=formData;
    await saveEntry(key, arr);
  };

  const deleteItem = async (key, idx) => {
    const arr = [...(user[key]||[])]; arr.splice(idx,1); await updateUser({ [key]: arr });
  };

  if (!user) return null;

  const savedJobsData = jobs.filter(j => user.savedJobs?.includes(j._id));
  const strength = Math.min(100,
    (user.resume?20:0)+(user.profilePicture?10:0)+(user.headline?10:0)+(user.about?10:0)+
    Math.min(15,(user.education?.length||0)*5)+Math.min(15,(user.experience?.length||0)*5)+
    Math.min(10,(user.skills?.length||0)*2)+Math.min(10,(user.certifications?.length||0)*3)
  );
  const avatar = user.profilePicture ? imgUrl(user.profilePicture) : getAvatar(user.name);
  const statusBadge = { Applied:'bg-blue-100 text-blue-800', Shortlisted:'bg-yellow-100 text-yellow-800', Interview:'bg-purple-100 text-purple-800', Rejected:'bg-red-100 text-red-800', Hired:'bg-green-100 text-green-800' };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative group cursor-pointer" onClick={()=>{ const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=e=>uploadProfilePic(e.target.files[0]);i.click(); }}>
            <img src={avatar} className="w-20 h-20 rounded-2xl object-cover border-4 border-blue-100" alt="" />
            {uploadingPic ? (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center"><i className="fas fa-spinner fa-spin text-white"></i></div>
            ) : (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <i className="fas fa-camera text-white text-lg"></i>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${user.role==='employer'?'bg-purple-100 text-purple-700':user.role==='admin'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{user.role}</span>
            </div>
            {user.headline && <p className="text-blue-600 font-medium text-sm mt-0.5">{user.headline}</p>}
            <p className="text-gray-400 text-sm mt-0.5">{user.email}{user.location&&` · ${user.location}`}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {user.role!=='jobseeker' && <button onClick={()=>navigate('/postjob')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"><i className="fas fa-plus mr-1"></i>Post Job</button>}
            <button onClick={()=>{setTab('Profile');openEdit('headline',0,{headline:user.headline||'',about:user.about||'',phone:user.phone||'',location:user.location||'',name:user.name||''}); }} className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-semibold transition"><i className="fas fa-pen mr-1"></i>Edit Profile</button>
          </div>
        </div>

        {/* Profile strength */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Profile strength</span>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${strength<40?'bg-red-500':strength<70?'bg-amber-500':'bg-green-500'}`} style={{width:`${strength}%`}}></div>
            </div>
            <span className="text-sm font-bold text-gray-900">{strength}%</span>
          </div>
          {strength<100 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {[['Resume',!user.resume],['Photo',!user.profilePicture],['Headline',!user.headline],['About',!user.about],['Skills',(user.skills?.length||0)<2],['Education',(user.education?.length||0)<1]].filter(([,missing])=>missing).slice(0,4).map(([l])=>(
                <span key={l} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg">Add {l}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl font-semibold text-sm transition relative ${tab===t?'bg-blue-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t}
            {t==='My Applications'&&myApplications.length>0&&<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{myApplications.length}</span>}
          </button>
        ))}
      </div>

      {/* ─ OVERVIEW ─ */}
      {tab==='Overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[['fa-paper-plane','bg-blue-50 text-blue-600',myApplications.length,'Applied'],['fa-bookmark','bg-amber-50 text-amber-600',user.savedJobs?.length||0,'Saved'],['fa-users','bg-green-50 text-green-600',user.connections?.length||0,'Connections'],['fa-briefcase','bg-purple-50 text-purple-600',myJobs.length,'Posted']].map(([ic,cls,val,lbl])=>(
              <div key={lbl} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition cursor-pointer" onClick={()=>setTab(lbl==='Applied'?'My Applications':lbl==='Saved'?'Saved Jobs':lbl==='Posted'?'Posted Jobs':'Overview')}>
                <div className={`w-12 h-12 rounded-2xl ${cls} flex items-center justify-center mx-auto mb-2`}><i className={`fas ${ic} text-xl`}></i></div>
                <div className="text-2xl font-black">{val}</div>
                <div className="text-gray-500 text-sm">{lbl}</div>
              </div>
            ))}
          </div>

          {/* Resume */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center"><i className="fas fa-file-pdf text-red-500 text-xl"></i></div>
              <div>
                <p className="font-bold text-sm">{user.resume?.name||'No resume uploaded'}</p>
                <p className="text-xs text-gray-400">{user.resume?'Ready for applications':'Required to apply for jobs'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {user.resume && <a href={imgUrl(user.resume.path)} target="_blank" rel="noreferrer" className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"><i className="fas fa-eye mr-1"></i>View</a>}
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition flex items-center gap-1">
                {uploadingResume?<><i className="fas fa-spinner fa-spin"></i>Uploading...</>:<><i className="fas fa-upload"></i>{user.resume?'Update Resume':'Upload Resume'}</>}
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e=>e.target.files[0]&&uploadResume(e.target.files[0])} disabled={uploadingResume} />
              </label>
            </div>
          </div>

          {/* Recent applications */}
          {myApplications.length>0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex justify-between items-center mb-3"><h3 className="font-bold">Recent Applications</h3><button onClick={()=>setTab('My Applications')} className="text-sm text-blue-600 hover:underline">View all</button></div>
              {myApplications.slice(0,3).map(app=>(
                <div key={app._id} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-50">
                  <div><p className="font-semibold text-sm">{app.job?.title}</p><p className="text-xs text-gray-500">{app.job?.company} · {daysAgo(app.createdAt)}</p></div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg ${statusBadge[app.status]}`}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─ MY APPLICATIONS ─ */}
      {tab==='My Applications' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">My Applications <span className="text-gray-400 font-normal text-base">({myApplications.length})</span></h2>
          {myApplications.length===0 ? (
            <div className="text-center py-16"><i className="fas fa-paper-plane text-gray-200 text-5xl mb-3 block"></i><p className="text-gray-500 mb-3">No applications yet</p><button onClick={()=>navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition text-sm">Browse Jobs</button></div>
          ) : (
            <div className="space-y-3">
              {myApplications.map(app=>(
                <div key={app._id} className="border border-gray-100 rounded-2xl p-4 hover:border-blue-200 transition-all">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 cursor-pointer hover:text-blue-600" onClick={()=>navigate(`/job/${app.job?._id}`)}>{app.job?.title}</p>
                      <p className="text-sm text-gray-600">{app.job?.company} · {app.job?.location}</p>
                      <p className="text-xs text-gray-400 mt-1"><i className="far fa-calendar mr-1"></i>Applied {fmtDate(app.createdAt)}{app.coverNote&&<span className="ml-3 text-blue-500"><i className="fas fa-sticky-note mr-1"></i>Has cover note</span>}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${statusBadge[app.status]}`}>{app.status}</span>
                      {app.status==='Applied'&&<button onClick={()=>handleWithdraw(app._id)} className="text-xs text-red-500 hover:text-red-700 hover:underline">Withdraw</button>}
                    </div>
                  </div>
                  {app.statusHistory?.length>1&&(
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {app.statusHistory.map((h,i)=><span key={i} className={`text-xs px-2 py-0.5 rounded-md ${statusColor(h.status)}`}>{h.status}</span>)}
                    </div>
                  )}
                  {app.interviewDate&&<div className="mt-2 bg-purple-50 text-purple-800 rounded-xl px-3 py-2 text-sm"><i className="fas fa-calendar-check mr-2"></i>Interview scheduled: {fmtDate(app.interviewDate)}</div>}
                  {app.employerNote&&<div className="mt-2 bg-gray-50 text-gray-700 rounded-xl px-3 py-2 text-sm"><i className="fas fa-comment mr-2"></i>{app.employerNote}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─ SAVED JOBS ─ */}
      {tab==='Saved Jobs' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">Saved Jobs <span className="text-gray-400 font-normal text-base">({savedJobsData.length})</span></h2>
          {savedJobsData.length===0 ? (
            <div className="text-center py-16"><i className="fas fa-bookmark text-gray-200 text-5xl mb-3 block"></i><p className="text-gray-500 mb-3">No saved jobs yet</p><button onClick={()=>navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition text-sm">Browse Jobs</button></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobsData.map(job=>(
                <div key={job._id} onClick={()=>navigate(`/job/${job._id}`)} className="border border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex justify-between"><p className="font-bold">{job.title}</p><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{job.type}</span></div>
                  <p className="text-sm text-gray-600 mt-1">{job.company} · {job.location}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-2">{job.salary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─ POSTED JOBS ─ */}
      {tab==='Posted Jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-lg">My Job Postings</h2><button onClick={()=>navigate('/postjob')} className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">+ New Job</button></div>
            {myJobs.length===0 ? (
              <div className="text-center py-10"><i className="fas fa-briefcase text-gray-200 text-3xl mb-2 block"></i><p className="text-gray-400 text-sm">No jobs posted yet</p></div>
            ) : myJobs.map(job=>(
              <div key={job._id} onClick={()=>handleViewApps(job._id)} className={`border rounded-2xl p-4 mb-3 cursor-pointer transition ${selectedJobId===job._id?'border-blue-500 bg-blue-50':'border-gray-100 hover:border-blue-200'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1"><p className="font-bold text-sm">{job.title}</p><p className="text-xs text-gray-500">{job.company} · {job.location}</p><p className="text-xs text-gray-400 mt-1">{fmtDate(job.createdAt)} · {job.applicationCount||0} applicants</p></div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={e=>{e.stopPropagation();navigate(`/job/${job._id}`);}} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-100 text-blue-500 text-xs"><i className="fas fa-eye"></i></button>
                    <button onClick={e=>{e.stopPropagation();handleDeleteJob(job._id);}} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-red-400 text-xs"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-lg mb-4">{selectedJobId ? 'Applicants' : 'Select a job to view applicants'}</h2>
            {appsLoading ? <div className="flex justify-center py-10"><i className="fas fa-spinner fa-spin text-blue-600 text-2xl"></i></div>
            : !selectedJobApps ? <div className="text-center py-12"><i className="fas fa-users text-gray-200 text-4xl mb-2 block"></i><p className="text-gray-400 text-sm">Click a job to view applicants</p></div>
            : selectedJobApps.length===0 ? <div className="text-center py-12"><i className="fas fa-inbox text-gray-200 text-3xl mb-2 block"></i><p className="text-gray-500 text-sm">No applicants yet</p></div>
            : <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {selectedJobApps.map(app=>(
                  <div key={app._id} className="border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <img src={app.applicant?.profilePicture ? imgUrl(app.applicant.profilePicture) : getAvatar(app.applicant?.name)} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{app.applicant?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{app.applicant?.headline||app.applicant?.email}</p>
                        {app.applicant?.skills?.length>0 && <div className="flex flex-wrap gap-1 mt-1">{app.applicant.skills.slice(0,3).map(s=><span key={s} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{s}</span>)}</div>}
                        {app.coverNote && <p className="text-xs text-gray-400 mt-1 italic">"{app.coverNote.slice(0,80)}{app.coverNote.length>80?'…':''}"</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {app.applicant?.resume && <a href={imgUrl(app.applicant.resume.path)} target="_blank" rel="noreferrer" className="text-xs border border-blue-200 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50"><i className="fas fa-file-pdf mr-1"></i>Resume</a>}
                      <select value={app.status} onChange={e=>handleStatusChange(app._id,e.target.value)} className={`text-xs font-bold px-3 py-1.5 rounded-xl border-0 cursor-pointer focus:outline-none ${statusBadge[app.status]}`}>
                        {['Applied','Shortlisted','Interview','Rejected','Hired'].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      )}

      {/* ─ PROFILE ─ */}
      {tab==='Profile' && (
        <div className="space-y-5">
          {/* Skills */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-3"><h3 className="font-bold"><i className="fas fa-code mr-2 text-blue-500"></i>Skills</h3><button onClick={()=>openEdit('skill')} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition">+ Add Skill</button></div>
            <div className="flex flex-wrap gap-2">
              {user.skills?.length ? user.skills.map(s=>(
                <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-2">{s}<button onClick={()=>updateUser({skills:user.skills.filter(x=>x!==s)})} className="text-blue-400 hover:text-blue-700">✕</button></span>
              )) : <p className="text-gray-400 text-sm">No skills added yet</p>}
            </div>
          </div>

          {/* Education */}
          <Section title="Education" icon="fa-graduation-cap text-green-500" onAdd={()=>openEdit('education')}>
            {(user.education||[]).map((e,i)=>(
              <Item key={i} onEdit={()=>openEdit('education',i,e)} onDelete={()=>deleteItem('education',i)}>
                <p className="font-semibold text-sm">{e.degree}</p><p className="text-xs text-gray-500">{e.institution} · {e.year}</p>{e.description&&<p className="text-xs text-gray-400 mt-0.5">{e.description}</p>}
              </Item>
            ))}
          </Section>

          {/* Experience */}
          <Section title="Work Experience" icon="fa-briefcase text-blue-500" onAdd={()=>openEdit('experience')}>
            {(user.experience||[]).map((e,i)=>(
              <Item key={i} onEdit={()=>openEdit('experience',i,e)} onDelete={()=>deleteItem('experience',i)}>
                <p className="font-semibold text-sm">{e.title}</p><p className="text-xs text-gray-500">{e.company} · {e.duration}</p>{e.description&&<p className="text-xs text-gray-400 mt-0.5">{e.description}</p>}
              </Item>
            ))}
          </Section>

          {/* Certifications */}
          <Section title="Certifications" icon="fa-certificate text-amber-500" onAdd={()=>openEdit('certification')}>
            {(user.certifications||[]).map((c,i)=>(
              <Item key={i} onDelete={()=>deleteItem('certifications',i)}>
                <p className="font-semibold text-sm">{c.name}</p><p className="text-xs text-gray-500">{c.issuer} · {c.year}</p>{c.credentialUrl&&<a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">View credential</a>}
              </Item>
            ))}
          </Section>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-3"><h3 className="font-bold"><i className="fas fa-link mr-2 text-purple-500"></i>Social Links</h3><button onClick={()=>openEdit('social',0,user.socialLinks||{})} className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl hover:bg-gray-200 transition"><i className="fas fa-pen mr-1"></i>Edit</button></div>
            <div className="flex flex-wrap gap-2">
              {[['portfolio','fa-globe','bg-green-100 text-green-700'],['linkedin','fab fa-linkedin','bg-blue-100 text-blue-700'],['github','fab fa-github','bg-gray-200 text-gray-700'],['twitter','fab fa-twitter','bg-sky-100 text-sky-700']].map(([k,ic,cls])=>
                user.socialLinks?.[k] ? (
                  <a key={k} href={user.socialLinks[k]} target="_blank" rel="noreferrer" className={`${cls} px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-80`}><i className={`fas ${ic}`}></i>{k.charAt(0).toUpperCase()+k.slice(1)}</a>
                ) : null
              )}
              {!Object.values(user.socialLinks||{}).some(Boolean) && <p className="text-gray-400 text-sm">No social links added</p>}
            </div>
          </div>
        </div>
      )}

      {/* ─ EDIT MODALS ─ */}
      <Modal isOpen={editSection==='headline'} onClose={closeEdit} title="Edit Profile Info">
        <div className="space-y-3">
          {[['Full Name','name','text'],['Headline','headline','text'],['Location','location','text'],['Phone','phone','tel']].map(([l,k,t])=>(
            <div key={k}><label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label><input type={t} className={inputCls} value={formData[k]||''} onChange={e=>setFormData(p=>({...p,[k]:e.target.value}))} /></div>
          ))}
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">About</label><textarea rows={3} className={inputCls+' resize-none'} value={formData.about||''} onChange={e=>setFormData(p=>({...p,about:e.target.value}))} placeholder="Tell employers about yourself..." /></div>
          <div className="flex gap-2 pt-1">
            <button onClick={closeEdit} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={async()=>{await updateUser({name:formData.name,headline:formData.headline,about:formData.about,phone:formData.phone,location:formData.location});closeEdit();}} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 text-sm">Save</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={editSection==='skill'} onClose={closeEdit} title="Add Skill" size="sm">
        <div className="space-y-3">
          <input className={inputCls} placeholder="e.g. React, Python, Figma" value={formData.skill||''} onChange={e=>setFormData({skill:e.target.value})} onKeyDown={e=>e.key==='Enter'&&formData.skill?.trim()&&(updateUser({skills:[...(user.skills||[]),formData.skill.trim()]}),closeEdit())} autoFocus />
          <div className="flex gap-2">
            <button onClick={closeEdit} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={()=>formData.skill?.trim()&&(updateUser({skills:[...(user.skills||[]),formData.skill.trim()]}),closeEdit())} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 text-sm">Add</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={editSection==='education'} onClose={closeEdit} title={editIdx===-1?'Add Education':'Edit Education'}>
        <div className="space-y-3">
          {[['Degree / Qualification','degree','text','e.g. B.Tech Computer Science'],['Institution','institution','text','e.g. Mumbai University'],['Year','year','text','e.g. 2020-2024'],['Description (optional)','description','text','']].map(([l,k,t,ph])=>(
            <div key={k}><label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label><input type={t} className={inputCls} placeholder={ph} value={formData[k]||''} onChange={e=>setFormData(p=>({...p,[k]:e.target.value}))} /></div>
          ))}
          <div className="flex gap-2 pt-1"><button onClick={closeEdit} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancel</button><button onClick={()=>saveEdItem('education')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 text-sm">Save</button></div>
        </div>
      </Modal>

      <Modal isOpen={editSection==='experience'} onClose={closeEdit} title={editIdx===-1?'Add Experience':'Edit Experience'}>
        <div className="space-y-3">
          {[['Job Title','title','e.g. Software Engineer'],['Company','company','e.g. Tech Corp'],['Duration','duration','e.g. Jan 2022 – Present'],['Description (optional)','description','Describe your responsibilities...']].map(([l,k,ph])=>(
            <div key={k}><label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label><input className={inputCls} placeholder={ph} value={formData[k]||''} onChange={e=>setFormData(p=>({...p,[k]:e.target.value}))} /></div>
          ))}
          <div className="flex gap-2 pt-1"><button onClick={closeEdit} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancel</button><button onClick={()=>saveEdItem('experience')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 text-sm">Save</button></div>
        </div>
      </Modal>

      <Modal isOpen={editSection==='certification'} onClose={closeEdit} title="Add Certification">
        <div className="space-y-3">
          {[['Certification Name','name','e.g. AWS Solutions Architect'],['Issuer','issuer','e.g. Amazon Web Services'],['Year','year','e.g. 2023'],['Credential URL (optional)','credentialUrl','https://...']].map(([l,k,ph])=>(
            <div key={k}><label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label><input className={inputCls} placeholder={ph} value={formData[k]||''} onChange={e=>setFormData(p=>({...p,[k]:e.target.value}))} /></div>
          ))}
          <div className="flex gap-2 pt-1"><button onClick={closeEdit} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancel</button><button onClick={()=>saveEdItem('certifications')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 text-sm">Save</button></div>
        </div>
      </Modal>

      <Modal isOpen={editSection==='social'} onClose={closeEdit} title="Edit Social Links">
        <div className="space-y-3">
          {[['Portfolio','portfolio','https://yoursite.com'],['LinkedIn','linkedin','https://linkedin.com/in/...'],['GitHub','github','https://github.com/...'],['Twitter','twitter','https://twitter.com/...']].map(([l,k,ph])=>(
            <div key={k}><label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label><input type="url" className={inputCls} placeholder={ph} value={formData[k]||''} onChange={e=>setFormData(p=>({...p,[k]:e.target.value}))} /></div>
          ))}
          <div className="flex gap-2 pt-1"><button onClick={closeEdit} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancel</button><button onClick={async()=>{await updateUser({socialLinks:formData});closeEdit();}} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 text-sm">Save</button></div>
        </div>
      </Modal>
    </div>
  );
}

function Section({ title, icon, onAdd, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex justify-between items-center mb-3"><h3 className="font-bold"><i className={`fas ${icon} mr-2`}></i>{title}</h3><button onClick={onAdd} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition">+ Add</button></div>
      <div className="space-y-2">{children}</div>
      {!children?.length && <p className="text-gray-400 text-sm">Nothing added yet</p>}
    </div>
  );
}

function Item({ children, onEdit, onDelete }) {
  return (
    <div className="flex items-start justify-between border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition">
      <div className="flex-1">{children}</div>
      <div className="flex gap-1 ml-2 flex-shrink-0">
        {onEdit && <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 text-xs"><i className="fas fa-pen"></i></button>}
        <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 text-xs"><i className="fas fa-trash"></i></button>
      </div>
    </div>
  );
}
