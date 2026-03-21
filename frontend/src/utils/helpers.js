export const getCompanyLogo = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&bold=true&length=1&size=128`;

export const getAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name||'U')}&background=6366f1&color=fff&length=2&size=80`;

export const imgUrl = (path) =>
  path ? (path.startsWith('http') ? path : `http://localhost:5000${path}`) : '';

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '';

export const daysAgo = (d) => {
  if (!d) return '';
  const n = Math.floor((new Date()-new Date(d))/86400000);
  return n===0?'Today':n===1?'1d ago':`${n}d ago`;
};

export const statusColor = (s) => ({
  Applied:'bg-blue-100 text-blue-800',
  Shortlisted:'bg-yellow-100 text-yellow-800',
  Interview:'bg-purple-100 text-purple-800',
  Rejected:'bg-red-100 text-red-800',
  Hired:'bg-green-100 text-green-800'
}[s] || 'bg-gray-100 text-gray-700');

// Unsplash-based category cover images (reliable, free)
const CATEGORY_IMAGES = {
  Technology: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  Design:     'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  Marketing:  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
  Finance:    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  Operations: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  Sales:      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
  HR:         'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
  Other:      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
};

export const getCategoryImage = (cat) =>
  CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Other;

// Company cover photos by name seed (consistent per company)
const COMPANY_COVERS = {
  'Tech Corp':    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80',
  'Innovate Ltd': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
  'Design Studio':'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80',
  'ProductHub':   'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80',
  'CloudNet':     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80',
  'DataWorks':    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
  'BrandBoost':   'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80',
  'Supportify':   'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80',
  'MobileFirst':  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80',
};

export const getCompanyCover = (name) =>
  COMPANY_COVERS[name] || `https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80`;

// Job type badge colors
export const typeColor = (type) => ({
  'Full Time':  'bg-green-100 text-green-800',
  'Part Time':  'bg-yellow-100 text-yellow-800',
  Remote:       'bg-purple-100 text-purple-800',
  Internship:   'bg-orange-100 text-orange-800',
  Contract:     'bg-blue-100 text-blue-800',
}[type] || 'bg-gray-100 text-gray-700');

export const categoryIcon = (c) => ({
  Technology:'fa-laptop-code', Design:'fa-palette', Marketing:'fa-bullhorn',
  Finance:'fa-chart-line', Operations:'fa-cogs', Sales:'fa-handshake',
  HR:'fa-users', Other:'fa-briefcase'
}[c] || 'fa-briefcase');
