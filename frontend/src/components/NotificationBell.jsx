import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const { user, markNotificationRead, markAllRead } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const unread = user?.notifications?.filter(n=>!n.read).length || 0;
  const notifs = user?.notifications?.slice(0,10) || [];
  const icons = { connection:'fa-user-plus', application:'fa-paper-plane', message:'fa-comment', job:'fa-briefcase', info:'fa-bell' };

  useEffect(() => {
    const h = (e) => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleClick = (n) => {
    markNotificationRead(n._id);
    if (n.link) { navigate(n.link); setOpen(false); }
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(!open)} className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-gray-600 hover:text-blue-600">
        <i className="fas fa-bell text-lg"></i>
        {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread>9?'9+':unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <span className="font-bold text-sm">Notifications {unread>0 && <span className="ml-1 text-xs text-blue-600">({unread} new)</span>}</span>
            {unread > 0 && <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifs.length === 0 ? (
              <div className="py-10 text-center text-gray-400"><i className="fas fa-bell-slash text-3xl mb-2 block"></i><span className="text-sm">No notifications yet</span></div>
            ) : notifs.map(n => (
              <div key={n._id} onClick={()=>handleClick(n)} className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${!n.read?'bg-blue-50/50':''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read?'bg-blue-100 text-blue-600':'bg-gray-100 text-gray-500'}`}>
                  <i className={`fas ${icons[n.type]||'fa-bell'} text-xs`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                  <span className="text-xs text-gray-400">{new Date(n.time).toLocaleDateString()}</span>
                </div>
                {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
