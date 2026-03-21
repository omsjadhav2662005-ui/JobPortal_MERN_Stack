export default function SocialLinks({ links }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.portfolio && (
        <a href={links.portfolio} target="_blank" rel="noopener noreferrer" className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <i className="fas fa-link"></i> Portfolio
        </a>
      )}
      {links.linkedin && (
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <i className="fab fa-linkedin"></i> LinkedIn
        </a>
      )}
      {links.github && (
        <a href={links.github} target="_blank" rel="noopener noreferrer" className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <i className="fab fa-github"></i> GitHub
        </a>
      )}
      {links.twitter && (
        <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <i className="fab fa-twitter"></i> Twitter
        </a>
      )}
    </div>
  )
}