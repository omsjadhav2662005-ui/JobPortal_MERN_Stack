import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function ChatModal({ isOpen, onClose, conversation, otherUser }) {
  const { user } = useAuth();
  const { sendMessage, markMsgsRead } = useData();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages);
      markMsgsRead(conversation._id);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation) return;
    const updatedConv = await sendMessage(conversation._id, newMessage);
    if (updatedConv) {
      setMessages(updatedConv.messages);
      setNewMessage('');
    }
  };

  if (!isOpen || !conversation) return null;

  const otherName = otherUser?.name || 'User';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6">
        <h3 className="text-xl font-bold mb-4">Chat with {otherName}</h3>

        <div className="bg-gray-50 rounded-3xl p-4 h-96 overflow-y-auto mb-4">
          {messages.map((msg, idx) => {
            const isSent = msg.from._id === user._id;
            return (
              <div key={idx} className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
                <div className={`max-w-[70%] p-3 rounded-3xl ${isSent ? 'bg-blue-600 text-white' : 'bg-white shadow-sm'}`}>
                  {msg.text}
                  <div className={`text-xs mt-1 ${isSent ? 'text-blue-200' : 'text-gray-500'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-3 border border-gray-300 rounded-full"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700">
            Send
          </button>
        </div>

        <button onClick={onClose} className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200">
          Close
        </button>
      </div>
    </div>
  );
}