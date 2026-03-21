import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getAvatar } from '../utils/helpers';

export default function UserCard({ user: otherUser }) {
  const { user: currentUser } = useAuth();
  const { getOrCreateConv } = useData();
  const [connected, setConnected] = useState(currentUser?.connections?.includes(otherUser._id) || false);

  const avatarUrl = getAvatar(otherUser.name);

  const handleConnect = async () => {
    if (!currentUser) return;
    if (connected) {
      await import('../api').then(m => m.default.delete(`/users/connections/${otherUser._id}`));
      setConnected(false);
    } else {
      await import('../api').then(m => m.default.post(`/users/${otherUser._id}/connect`));
      setConnected(true);
    }
  };

  const handleMessage = async () => {
    const conv = await getOrCreateConv(otherUser._id);
    // Dispatch event to open chat modal
    const event = new CustomEvent('openChat', {
      detail: {
        conversationId: conv._id,
        otherUser: { _id: otherUser._id, name: otherUser.name },
      },
    });
    window.dispatchEvent(event);
  };

  // Use headline or generate a description
  const description = otherUser.headline || 'Professional';

  // Use skills as icons or generate some
  const icons = (otherUser.skills || []).slice(0, 3).map(skill => {
    // Map skill names to Font Awesome icon classes (simplified)
    const iconMap = {
      react: 'fa-react',
      node: 'fa-node',
      python: 'fa-python',
      django: 'fa-python',
      figma: 'fa-figma',
      ux: 'fa-paint-brush',
      default: 'fa-code',
    };
    const key = skill.toLowerCase();
    return iconMap[key] || iconMap.default;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600">
          <img src={otherUser.profilePicture || avatarUrl} alt={otherUser.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{otherUser.name}</h3>
          <p className="text-sm text-blue-600">{otherUser.email}</p>
        </div>
      </div>

      <p className="mt-3 text-gray-600 text-sm">{description}</p>

      {icons.length > 0 && (
        <div className="flex gap-3 mt-3">
          {icons.map((ic, i) => (
            <i key={i} className={`fab ${ic} text-blue-600 text-xl bg-blue-50 p-2 rounded-xl`}></i>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleConnect}
          className={`flex-1 py-2 rounded-full font-semibold transition ${
            connected ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {connected ? 'Connected' : 'Connect'}
        </button>
        <button
          onClick={handleMessage}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-full font-semibold hover:bg-gray-200"
        >
          Message
        </button>
      </div>
    </div>
  );
}