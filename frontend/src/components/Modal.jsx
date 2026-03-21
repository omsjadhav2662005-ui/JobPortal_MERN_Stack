export default function Modal({ isOpen, onClose, title, children, size='md' }) {
  if (!isOpen) return null;
  const sizes = { sm:'max-w-sm', md:'max-w-md', lg:'max-w-2xl', xl:'max-w-4xl' };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target===e.currentTarget && onClose()}>
      <div className={`bg-white rounded-2xl w-full ${sizes[size]} shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"><i className="fas fa-times"></i></button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
