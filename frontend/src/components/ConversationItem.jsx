export default function ConversationItem({ conversation, currentUser, onClick }) {
  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
  const lastMsg = conversation.messages.length ? conversation.messages[conversation.messages.length-1] : null;
  const unreadCount = conversation.messages.filter(m => m.from._id !== currentUser._id && !m.read).length;
  const avatarUrl = otherParticipant?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.name)}&background=2563eb&color=fff&length=1&size=50`;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-3xl mb-2 cursor-pointer transition hover:bg-white hover:shadow-md ${unreadCount ? 'bg-blue-50' : 'bg-gray-50'}`}
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img src={avatarUrl} alt={otherParticipant?.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{otherParticipant?.name}</h4>
        <p className="text-sm text-gray-500 truncate max-w-xs">{lastMsg ? lastMsg.text : 'No messages yet'}</p>
      </div>
      {unreadCount > 0 && (
        <span className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
          {unreadCount}
        </span>
      )}
    </div>
  );
}