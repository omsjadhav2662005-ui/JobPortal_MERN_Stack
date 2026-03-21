import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'jobseeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const r = await signup(form.name, form.email, form.password, form.role);
    setLoading(false);
    if (r.success) navigate('/'); else setError(r.message);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><i className="fas fa-user-plus text-white text-2xl"></i></div>
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1">Join thousands of professionals</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm flex items-center gap-2"><i className="fas fa-exclamation-circle"></i>{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {['jobseeker','employer'].map(r=>(
                  <button key={r} type="button" onClick={()=>setForm(f=>({...f,role:r}))} className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition ${form.role===r ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <i className={`fas ${r==='employer'?'fa-building':'fa-user'} mr-2`}></i>{r==='employer'?'Employer':'Job Seeker'}
                  </button>
                ))}
              </div>
            </div>
            {[['Full name','name','text','John Doe'],['Email','email','email','you@example.com'],['Password (min 6 chars)','password','password','••••••••']].map(([label,key,type,ph])=>(
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <input type={type} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder={ph} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><i className="fas fa-spinner fa-spin"></i>Creating...</> : 'Create account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link to="/signin" className="text-blue-600 font-semibold hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
