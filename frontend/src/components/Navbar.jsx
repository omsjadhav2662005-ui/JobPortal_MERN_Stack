import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { imgUrl, getAvatar } from '../utils/helpers';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = (p) => pathname===p ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';
  const avatar = user?.profilePicture ? imgUrl(user.profilePicture) : getAvatar(user?.name);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-black text-gray-900">Job<span className="text-blue-600">Portal</span></Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium transition ${active('/')}`}>Jobs</Link>
          <Link to="/companies" className={`text-sm font-medium transition ${active('/companies')}`}>Companies</Link>
          <Link to="/network" className={`text-sm font-medium transition ${active('/network')}`}>Network</Link>
          {user && <Link to="/inbox" className={`text-sm font-medium transition ${active('/inbox')}`}>Inbox</Link>}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <button onClick={()=>navigate('/dashboard')} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition">
                <img src={avatar} className="w-8 h-8 rounded-full object-cover border-2 border-blue-100" alt="" />
                <span className="text-sm font-semibold text-gray-700">{user.name.split(' ')[0]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role==='employer'?'bg-purple-100 text-purple-700':user.role==='admin'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{user.role}</span>
              </button>
              {user.role !== 'jobseeker' && <Link to="/postjob" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">+ Post Job</Link>}
              <button onClick={()=>{logout();navigate('/');}} className="text-sm text-gray-500 hover:text-gray-700 transition px-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">Sign in</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={()=>setMenuOpen(!menuOpen)}>
          <i className={`fas ${menuOpen?'fa-times':'fa-bars'} text-gray-600`}></i>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          {[['/',<><i className="fas fa-briefcase w-5"></i>Jobs</>],['/companies',<><i className="fas fa-building w-5"></i>Companies</>],['/network',<><i className="fas fa-users w-5"></i>Network</>]].map(([p,label])=>(
            <Link key={p} to={p} onClick={()=>setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">{label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/inbox" onClick={()=>setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"><i className="fas fa-inbox w-5"></i>Inbox</Link>
              <Link to="/dashboard" onClick={()=>setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"><i className="fas fa-tachometer-alt w-5"></i>Dashboard</Link>
              {user.role!=='jobseeker' && <Link to="/postjob" onClick={()=>setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold"><i className="fas fa-plus w-5"></i>Post Job</Link>}
              <button onClick={()=>{logout();navigate('/');setMenuOpen(false);}} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-medium w-full"><i className="fas fa-sign-out-alt w-5"></i>Logout</button>
            </>
          ) : (
            <Link to="/signin" onClick={()=>setMenuOpen(false)} className="block bg-blue-600 text-white text-center px-4 py-2 rounded-xl font-semibold">Sign in</Link>
          )}
        </div>
      )}
    </nav>
  );
}
