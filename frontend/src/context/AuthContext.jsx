import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) API.get('/auth/profile').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
    else setLoading(false);
  }, []);

  const signin = async (email, password) => {
    try { const { data } = await API.post('/auth/login', { email, password }); localStorage.setItem('token', data.token); setUser(data); return { success: true }; }
    catch (e) { return { success: false, message: e.response?.data?.message || 'Login failed' }; }
  };
  const signup = async (name, email, password, role) => {
    try { const { data } = await API.post('/auth/register', { name, email, password, role }); localStorage.setItem('token', data.token); setUser(data); return { success: true }; }
    catch (e) { return { success: false, message: e.response?.data?.message || 'Registration failed' }; }
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const refreshUser = async () => { try { const { data } = await API.get('/auth/profile'); setUser(data); return data; } catch {} };
  const updateUser  = async (d) => { try { const { data } = await API.put('/users/profile', d); setUser(data); return data; } catch (e) { throw e; } };
  const saveJob   = async (id) => { if (!user?.savedJobs?.includes(id)) await updateUser({ savedJobs: [...(user.savedJobs||[]), id] }); };
  const unsaveJob = async (id) => { await updateUser({ savedJobs: (user.savedJobs||[]).filter(x => x !== id) }); };
  const addNotification    = async (message, type='info', link='') => { try { await API.post('/users/notification', { message, type, link }); await refreshUser(); } catch {} };
  const markNotificationRead = async (id) => { try { await API.put(`/users/notification/${id}/read`); await refreshUser(); } catch {} };
  const markAllRead = async () => { try { await API.put('/users/notification/all/read'); await refreshUser(); } catch {} };

  return <AuthContext.Provider value={{ user, loading, signin, signup, logout, refreshUser, updateUser, saveJob, unsaveJob, addNotification, markNotificationRead, markAllRead }}>{children}</AuthContext.Provider>;
};
