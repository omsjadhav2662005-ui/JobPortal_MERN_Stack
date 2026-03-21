import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const CATS  = ['Technology','Design','Marketing','Finance','Operations','Sales','HR','Other'];
const LEVELS= ['Entry Level','Mid Level','Senior Level','Lead','Manager'];

export default function PostJob() {
  const { addJob } = useData();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm] = useState({ title:'', company:'', location:'', type:'Full Time', salary:'', salaryMin:'', salaryMax:'', description:'', companyDesc:'', category:'Technology', experienceLevel:'Mid Level', deadline:'' });
  const [requirements, setRequirements]       = useState(['']);
  const [responsibilities, setResponsibilities] = useState(['']);
  const [skills, setSkills] = useState(['']);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep]     = useState(1);

  const set = f => e => setForm(p=>({...p,[f]:e.target.value}));
  const updateList = (list, setList, i, val) => { const n=[...list]; n[i]=val; setList(n); };
  const addItem    = (list, setList) => setList([...list, '']);
  const removeItem = (list, setList, i) => setList(list.filter((_,idx)=>idx!==i));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const job = await addJob({
        ...form,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
        requirements: requirements.filter(Boolean),
        responsibilities: responsibilities.filter(Boolean),
        skills: skills.filter(Boolean),
      });
      navigate(`/job/${job._id}`);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const ListEditor = ({ label, list, setList }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {list.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input className={inputCls} value={item} onChange={e=>updateList(list,setList,i,e.target.value)} placeholder={`${label} ${i+1}`} />
          {list.length > 1 && <button type="button" onClick={()=>removeItem(list,setList,i)} className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg"><i className="fas fa-times"></i></button>}
        </div>
      ))}
      <button type="button" onClick={()=>addItem(list,setList)} className="text-sm text-blue-600 hover:underline"><i className="fas fa-plus mr-1"></i>Add {label}</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Post a Job</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to attract the right candidates</p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {[1,2,3].map(s=>(
          <div key={s} className="flex items-center gap-2">
            <button onClick={()=>setStep(s)} className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center transition ${step===s?'bg-blue-600 text-white':step>s?'bg-green-500 text-white':'bg-gray-200 text-gray-500'}`}>
              {step>s ? <i className="fas fa-check text-xs"></i> : s}
            </button>
            <span className="text-xs font-medium text-gray-500 hidden sm:inline">{['Basic Info','Details','Requirements'][s-1]}</span>
            {s<3 && <div className="w-8 h-0.5 bg-gray-200"></div>}
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm"><i className="fas fa-exclamation-circle mr-2"></i>{error}</div>}

      <form onSubmit={handleSubmit}>
        {step===1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-lg text-gray-900">Basic Information</h2>
            {[['Job Title *','title','text','e.g. Senior React Developer'],['Company Name *','company','text','e.g. Tech Corp'],['Location *','location','text','e.g. Mumbai, India or Remote']].map(([l,k,t,ph])=>(
              <div key={k}><label className="block text-sm font-semibold text-gray-700 mb-1.5">{l}</label><input type={t} className={inputCls} placeholder={ph} value={form[k]} onChange={set(k)} required /></div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Type</label>
                <select className={inputCls} value={form.type} onChange={set('type')}>{['Full Time','Part Time','Remote','Internship','Contract'].map(o=><option key={o}>{o}</option>)}</select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select className={inputCls} value={form.category} onChange={set('category')}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Level</label>
                <select className={inputCls} value={form.experienceLevel} onChange={set('experienceLevel')}>{LEVELS.map(l=><option key={l}>{l}</option>)}</select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Application Deadline</label>
                <input type="date" className={inputCls} value={form.deadline} onChange={set('deadline')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Salary Range</label>
              <div className="flex gap-3 items-center">
                <input type="text" className={inputCls} placeholder="e.g. $80k-$100k or ₹8-12 LPA" value={form.salary} onChange={set('salary')} />
              </div>
            </div>
            <button type="button" onClick={()=>{ if(!form.title||!form.company||!form.location){setError('Title, company and location required');return;} setError(''); setStep(2); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition">Next: Job Details →</button>
          </div>
        )}

        {step===2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-lg text-gray-900">Job Details</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Description *</label>
              <textarea rows={6} className={inputCls.replace('py-3','py-3') + ' resize-none'} placeholder="Describe the role, work environment, day-to-day activities..." value={form.description} onChange={set('description')} required></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Description</label>
              <textarea rows={3} className={inputCls + ' resize-none'} placeholder="Tell candidates about your company culture and mission..." value={form.companyDesc} onChange={set('companyDesc')}></textarea>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={()=>setStep(1)} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition">← Back</button>
              <button type="button" onClick={()=>{ if(!form.description){setError('Description required');return;} setError(''); setStep(3); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition">Next: Requirements →</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="font-bold text-lg text-gray-900">Requirements & Skills</h2>
            <ListEditor label="Responsibility" list={responsibilities} setList={setResponsibilities} />
            <ListEditor label="Requirement"    list={requirements}    setList={setRequirements} />
            <ListEditor label="Required Skill" list={skills}          setList={setSkills} />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={()=>setStep(2)} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition">← Back</button>
              <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><i className="fas fa-spinner fa-spin"></i>Publishing...</> : <><i className="fas fa-paper-plane"></i>Publish Job</>}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
