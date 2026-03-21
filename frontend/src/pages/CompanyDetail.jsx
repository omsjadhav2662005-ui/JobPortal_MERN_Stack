import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { getCompanyLogo, getCompanyCover } from '../utils/helpers';
import Modal from '../components/Modal';
import JobCard from '../components/JobCard';

export default function CompanyDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { jobs, getCompanyByName, addReview } = useData();
  const { user } = useAuth();

  const [company, setCompany]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview]         = useState({ rating:5, title:'', comment:'', pros:'', cons:'', anonymous:false, recommend:true });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab]   = useState('overview');

  const companyName = decodeURIComponent(name);
  const companyJobs = jobs.filter(j => j.company === companyName && j.isActive !== false);

  useEffect(() => {
    getCompanyByName(companyName).then(c => {
      setCompany(c || { name:companyName, reviews:[], benefits:[] });
      setLoading(false);
    });
  }, [companyName]);

  if (loading) return <div className="flex justify-center items-center py-32"><i className="fas fa-spinner fa-spin text-blue-600 text-3xl"></i></div>;

  const avg = company.reviews?.length ? (company.reviews.reduce((s,r)=>s+r.rating,0)/company.reviews.length).toFixed(1) : null;
  const recommend = company.reviews?.length ? Math.round((company.reviews.filter(r=>r.recommend).length/company.reviews.length)*100) : null;

  const handleReviewSubmit = async () => {
    if (!review.comment.trim()) return;
    setSubmitting(true);
    try {
      const updated = await addReview(companyName, { ...review, reviewerName:user.name });
      setCompany(updated);
      setShowReview(false);
      setReview({ rating:5, title:'', comment:'', pros:'', cons:'', anonymous:false, recommend:true });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      {/* Full-width cover image hero */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-64">
        <img
          src={getCompanyCover(companyName)}
          alt={companyName}
          className="w-full h-full object-cover"
          onError={e=>{e.target.style.background='#1e3a5f';e.target.style.display='none';}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Overlaid company info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-5">
          <img src={getCompanyLogo(companyName)} className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl flex-shrink-0" alt="" />
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white drop-shadow">{companyName}</h1>
            {company.tagline && <p className="text-white/80 italic mt-1">{company.tagline}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {company.industry    && <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg font-medium">{company.industry}</span>}
              {company.employees   && <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg font-medium"><i className="fas fa-users mr-1"></i>{company.employees}</span>}
              {company.founded     && <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg font-medium"><i className="fas fa-calendar mr-1"></i>Est. {company.founded}</span>}
              {company.headquarters && <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg font-medium"><i className="fas fa-map-pin mr-1"></i>{company.headquarters}</span>}
            </div>
          </div>
          {avg && (
            <div className="text-center flex-shrink-0">
              <div className="text-4xl font-black text-white">{avg}</div>
              <div className="text-yellow-300 text-lg">{'★'.repeat(Math.round(+avg))}{'☆'.repeat(5-Math.round(+avg))}</div>
              <div className="text-white/70 text-xs mt-1">{company.reviews?.length||0} reviews</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[['fa-briefcase text-blue-600',companyJobs.length,'Open Positions'],['fa-star text-amber-500',avg||'–','Avg Rating'],['fa-heart text-red-500',recommend?`${recommend}%`:'–','Recommend'],['fa-comment text-purple-500',company.reviews?.length||0,'Reviews']].map(([ic,val,lbl])=>(
          <div key={lbl} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm hover:shadow-md transition">
            <i className={`fas ${ic} text-2xl mb-1 block`}></i>
            <div className="text-2xl font-black text-gray-900">{val}</div>
            <div className="text-xs text-gray-500 mt-0.5">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
        {['overview','jobs','reviews'].map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition ${activeTab===t?'bg-blue-600 text-white':'text-gray-600 hover:bg-gray-50'}`}>{t}{t==='jobs'&&` (${companyJobs.length})`}</button>
        ))}
      </div>

      {activeTab==='overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {company.about && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-lg mb-3">About {companyName}</h2>
                <p className="text-gray-700 leading-relaxed">{company.about}</p>
              </div>
            )}
            {company.benefits?.length>0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-lg mb-4"><i className="fas fa-gift text-blue-600 mr-2"></i>Benefits & Perks</h2>
                <div className="grid grid-cols-2 gap-2">
                  {company.benefits.map((b,i)=>(
                    <div key={i} className="flex items-center gap-2 bg-green-50 text-green-800 rounded-xl px-3 py-2.5">
                      <i className="fas fa-check-circle text-green-500 text-sm flex-shrink-0"></i>
                      <span className="text-sm font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Photo gallery placeholder — office life images */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-lg mb-4"><i className="fas fa-images text-blue-600 mr-2"></i>Life at {companyName}</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'photo-1497366811353-6870744d04b2',
                  'photo-1522071820081-009f0129c71c',
                  'photo-1556761175-b413da4baf72',
                  'photo-1542744173-8e7e53415bb0',
                  'photo-1600880292203-757bb62b4baf',
                  'photo-1573164713714-d95e436ab8d6',
                ].map((id,i)=>(
                  <div key={i} className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${id}?w=300&q=80`}
                      alt="office"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={e=>{e.target.parentElement.style.background='#EEF2FF';e.target.style.display='none';}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            {company.website && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold mb-3">Links</h3>
                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm py-1"><i className="fas fa-globe w-5 text-center"></i>Company Website</a>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold mb-3">Open Positions ({companyJobs.length})</h3>
              {companyJobs.length===0 ? <p className="text-gray-400 text-sm">No open positions now.</p>
               : companyJobs.slice(0,3).map(j=>(
                <div key={j._id} className="flex items-center justify-between py-2.5 border-b last:border-0 border-gray-50">
                  <div><p className="text-sm font-semibold">{j.title}</p><p className="text-xs text-gray-500">{j.type} · {j.salary||'Negotiable'}</p></div>
                  <button onClick={()=>navigate(`/job/${j._id}`)} className="text-xs text-blue-600 hover:underline font-medium flex-shrink-0 ml-2">View →</button>
                </div>
              ))}
              {companyJobs.length>3 && <button onClick={()=>setActiveTab('jobs')} className="text-sm text-blue-600 hover:underline mt-2">View all {companyJobs.length} →</button>}
            </div>
          </div>
        </div>
      )}

      {activeTab==='jobs' && (
        <div>
          <h2 className="font-bold text-lg mb-4">Open Positions ({companyJobs.length})</h2>
          {companyJobs.length===0
            ? <div className="text-center py-16 bg-white rounded-2xl border border-gray-100"><i className="fas fa-briefcase text-gray-200 text-4xl mb-3 block"></i><p className="text-gray-400">No open positions.</p></div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{companyJobs.map(j=><JobCard key={j._id} job={j} />)}</div>
          }
        </div>
      )}

      {activeTab==='reviews' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Reviews ({company.reviews?.length||0})</h2>
            {user && <button onClick={()=>setShowReview(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"><i className="fas fa-pen mr-2"></i>Write Review</button>}
          </div>
          {!company.reviews?.length
            ? <div className="text-center py-16 bg-white rounded-2xl border border-gray-100"><i className="fas fa-star text-gray-200 text-4xl mb-3 block"></i><p className="text-gray-400">No reviews yet — be the first!</p></div>
            : <div className="space-y-4">
                {company.reviews.map((r,i)=>(
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div><span className="font-bold">{r.anonymous?'Anonymous':r.reviewerName}</span>{r.title&&<p className="text-sm font-medium text-gray-700 mt-0.5">{r.title}</p>}</div>
                      <div className="text-right"><div className="text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div><span className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</span></div>
                    </div>
                    <p className="text-gray-700 text-sm mt-3 leading-relaxed">{r.comment}</p>
                    {(r.pros||r.cons)&&<div className="grid grid-cols-2 gap-3 mt-3">{r.pros&&<div className="bg-green-50 rounded-xl p-3"><p className="text-xs font-bold text-green-700 mb-1">👍 Pros</p><p className="text-sm text-green-800">{r.pros}</p></div>}{r.cons&&<div className="bg-red-50 rounded-xl p-3"><p className="text-xs font-bold text-red-700 mb-1">👎 Cons</p><p className="text-sm text-red-800">{r.cons}</p></div>}</div>}
                    {r.recommend!==undefined&&<span className={`mt-2 inline-block text-xs px-2 py-1 rounded-lg font-medium ${r.recommend?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{r.recommend?'✓ Recommends':'✗ Does not recommend'}</span>}
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* Review Modal */}
      <Modal isOpen={showReview} onClose={()=>setShowReview(false)} title="Write a Review" size="lg">
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-2">Overall Rating</label><div className="flex gap-2">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setReview(r=>({...r,rating:n}))} className={`w-10 h-10 text-2xl transition ${review.rating>=n?'text-amber-500':'text-gray-300 hover:text-amber-300'}`}>★</button>)}</div></div>
          {[['Review Title (optional)','title','text'],['Your Review *','comment','textarea']].map(([l,k,t])=>(
            <div key={k}><label className="block text-sm font-semibold mb-1.5">{l}</label>
              {t==='textarea'?<textarea rows={3} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={review[k]} onChange={e=>setReview(r=>({...r,[k]:e.target.value}))} />
              :<input type="text" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={review[k]} onChange={e=>setReview(r=>({...r,[k]:e.target.value}))} />}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[['Pros','pros','What did you like?'],['Cons','cons','What could improve?']].map(([l,k,ph])=>(
              <div key={k}><label className="block text-sm font-semibold mb-1.5">{l}</label><textarea rows={2} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder={ph} value={review[k]} onChange={e=>setReview(r=>({...r,[k]:e.target.value}))} /></div>
            ))}
          </div>
          <div className="flex gap-6">
            {[['recommend','Recommend this company'],['anonymous','Post anonymously']].map(([k,l])=>(
              <label key={k} className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={review[k]} onChange={e=>setReview(r=>({...r,[k]:e.target.checked}))} className="accent-blue-600 w-4 h-4" />{l}</label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={()=>setShowReview(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={handleReviewSubmit} disabled={submitting||!review.comment.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">
              {submitting?<i className="fas fa-spinner fa-spin"></i>:'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
