'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      const interval = setInterval(() => fetchMessages(selectedUser.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error('Failed to fetch current user');
    }
  };

  const fetchUsers = async () => {
    try {
      // For regular users, fetch admins. For admins, fetch all users
      let endpoint = '/api/users';
      if (currentUser?.role === 'USER') {
        endpoint = '/api/users?role=ADMIN,SUPER_ADMIN';
      }
      
      const res = await fetch(endpoint);
      const data = await res.json();
      
      // Filter out current user from the list
      const filteredUsers = (data.users || []).filter((u: any) => u.id !== currentUser?.id);
      setUsers(filteredUsers);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setMessages(data.messages || []);
      
      // Mark messages as read
      data.messages?.forEach((msg: any) => {
        if (msg.receiverId === currentUser?.id && !msg.isRead) {
          fetch(`/api/messages/${msg.id}/read`, { method: 'PATCH' });
        }
      });
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          message: newMessage,
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setNewMessage('');
      fetchMessages(selectedUser.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">💬 Messages</h1>

      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Users List */}
        <div className="col-span-4 card overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Conversations</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedUser?.id === user.id
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.role.replace('_', ' ')}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-8 card flex flex-col">
          {selectedUser ? (
            <>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg font-bold text-gray-900">{selectedUser.name}</h2>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.senderId === currentUser?.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === currentUser?.id
                            ? 'text-green-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatDateTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <button onClick={sendMessage} className="btn btn-primary">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
