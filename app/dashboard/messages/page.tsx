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
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [lastMessageTimes, setLastMessageTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
      fetchUnreadCounts();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      // Refresh unread counts periodically
      const interval = setInterval(() => fetchUnreadCounts(), 5000);
      return () => clearInterval(interval);
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
      // Fetch users based on current user role
      let url = '/api/users';
      
      // For non-SUPER_ADMIN users, add role filter to bypass permission check
      if (currentUser?.role !== 'SUPER_ADMIN') {
        // Fetch all roles for messaging
        url = '/api/users?role=SUPER_ADMIN,ADMIN,USER';
      }
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await res.json();
      
      // Filter out current user from the list
      const filteredUsers = (data.users || []).filter((u: any) => u.id !== currentUser?.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      
      // Calculate unread counts and last message times per user
      const counts: Record<string, number> = {};
      const lastTimes: Record<string, string> = {};
      
      (data.messages || []).forEach((msg: any) => {
        const otherUserId = msg.senderId === currentUser?.id ? msg.receiverId : msg.senderId;
        
        // Track unread counts
        if (msg.receiverId === currentUser?.id && !msg.isRead) {
          counts[otherUserId] = (counts[otherUserId] || 0) + 1;
        }
        
        // Track last message time (most recent)
        if (!lastTimes[otherUserId] || new Date(msg.createdAt) > new Date(lastTimes[otherUserId])) {
          lastTimes[otherUserId] = msg.createdAt;
        }
      });
      
      setUnreadCounts(counts);
      setLastMessageTimes(lastTimes);
    } catch (error) {
      console.error('Failed to fetch unread counts');
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setMessages(data.messages || []);
      
      // Mark messages as read
      const unreadMessages = data.messages?.filter(
        (msg: any) => msg.receiverId === currentUser?.id && !msg.isRead
      );
      
      if (unreadMessages && unreadMessages.length > 0) {
        // Mark each unread message as read
        await Promise.all(
          unreadMessages.map((msg: any) =>
            fetch(`/api/messages/${msg.id}/read`, { method: 'PATCH' })
          )
        );
        
        // Trigger sidebar refresh
        window.dispatchEvent(new Event('refreshSidebarCounts'));
        
        // Refresh unread counts
        fetchUnreadCounts();
      }
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
            {users
              .sort((a, b) => {
                const aUnread = unreadCounts[a.id] || 0;
                const bUnread = unreadCounts[b.id] || 0;
                const aTime = lastMessageTimes[a.id];
                const bTime = lastMessageTimes[b.id];
                
                // First, sort by unread status (unread conversations on top)
                if (aUnread > 0 && bUnread === 0) return -1;
                if (aUnread === 0 && bUnread > 0) return 1;
                
                // Then sort by last message time (most recent first)
                if (aTime && bTime) {
                  return new Date(bTime).getTime() - new Date(aTime).getTime();
                }
                if (aTime) return -1;
                if (bTime) return 1;
                
                // Finally, sort by user name
                return a.name.localeCompare(b.name);
              })
              .map((user) => {
                const unreadCount = unreadCounts[user.id] || 0;
                const hasUnread = unreadCount > 0;
                
                return (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-left p-3 rounded-lg transition-colors relative ${
                      selectedUser?.id === user.id
                        ? 'bg-green-100 border-2 border-green-500'
                        : hasUnread
                        ? 'bg-blue-50 border-2 border-blue-400 hover:bg-blue-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`font-medium ${hasUnread ? 'text-gray-900 font-bold' : 'text-gray-900'}`}>
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600">{user.role.replace('_', ' ')}</p>
                      </div>
                      {hasUnread && (
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center">
                            {unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
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
                {messages.map((msg) => {
                  const isUnread = msg.receiverId === currentUser?.id && !msg.isRead;
                  const isSentByMe = msg.senderId === currentUser?.id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isSentByMe ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isSentByMe
                            ? 'bg-green-600 text-white'
                            : isUnread
                            ? 'bg-blue-100 border-2 border-blue-500 text-gray-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm flex-1">{msg.message}</p>
                          {isUnread && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 flex-shrink-0">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${
                          isSentByMe ? 'justify-end' : 'justify-start'
                        }`}>
                          <p
                            className={`text-xs ${
                              isSentByMe
                                ? 'text-green-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatDateTime(msg.createdAt)}
                          </p>
                          {isSentByMe && (
                            <span className="text-xs">
                              {msg.isRead ? (
                                // Double tick for read messages
                                <svg className="w-4 h-4 text-green-100" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" transform="translate(5, 0)" />
                                </svg>
                              ) : (
                                // Single tick for sent but unread messages
                                <svg className="w-4 h-4 text-green-100" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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
