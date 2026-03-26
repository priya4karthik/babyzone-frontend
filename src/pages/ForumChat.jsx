import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiSend, FiHome, FiMessageCircle, FiBell, FiLogOut, FiMoreVertical } from 'react-icons/fi'
import { useAuthStore } from '../store'

const GROUPS = [
  { id: '1', name: 'Pregnancy',       users: 500, img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&q=80' },
  { id: '2', name: 'Parenting',       users: 500, img: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=100&q=80' },
  { id: '3', name: 'Child care',      users: 500, img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=100&q=80' },
  { id: '4', name: 'Product reviews', users: 500, img: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=100&q=80' },
]

// Mock messages per group
const MOCK_MSGS = {
  '1': [
    { id: 1, user: 'Priya',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc',  text: 'Hi everyone !', time: '12:00 AM, 25/08/2025', isMine: false },
    { id: 2, user: 'Meena',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meena&backgroundColor=c0aede',  text: 'Hi everyone !', time: '1:00 PM, 25/08/2025',  isMine: false },
    { id: 3, user: 'Kavya',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya&backgroundColor=b6e3f4',  text: 'Hi everyone !', time: '12:00 AM, 25/08/2025', isMine: false },
    { id: 4, user: 'Benny',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benny&backgroundColor=d1f4cc',  text: 'Hi everyone !', time: '12:00 AM, 25/08/2025', isMine: true  },
  ],
}

export default function ForumChat() {
  const { groupId }         = useParams()
  const navigate            = useNavigate()
  const { user }            = useAuthStore()
  const [activeGroup, setActiveGroup] = useState(groupId || '1')
  const [messages, setMessages]       = useState(MOCK_MSGS[activeGroup] || [])
  const [input, setInput]             = useState('')
  const messagesEndRef                = useRef(null)
  const wsRef                         = useRef(null)

  // Switch group
  const switchGroup = (id) => {
    setActiveGroup(id)
    setMessages(MOCK_MSGS[id] || [])
    navigate(`/forum/${id}/chat`, { replace: true })
  }

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/forum/${activeGroup}/`)
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        setMessages(prev => [...prev, {
          id: Date.now(), user: data.username, text: data.message,
          time: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' + new Date().toLocaleDateString('en-IN'),
          isMine: data.username === user?.username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        }])
      } catch {}
    }
    wsRef.current = ws
    return () => ws.close()
  }, [activeGroup])

  const sendMessage = () => {
    if (!input.trim()) return
    const msg = {
      id: Date.now(), user: user?.username || 'You',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'You'}`,
      text: input.trim(),
      time: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' + new Date().toLocaleDateString('en-IN'),
      isMine: true,
    }
    // Send via WS if connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: input.trim() }))
    } else {
      // Fallback: show locally
      setMessages(prev => [...prev, msg])
    }
    setInput('')
  }

  const currentGroup = GROUPS.find(g => g.id === activeGroup)

  return (
    <div className="container-fluid px-3 px-md-4 py-3">
      <div className="chat-container">

        {/* ── Col 1: Icon sidebar ── */}
        <div className="chat-sidebar">
          {/* User avatar */}
          <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', marginBottom: 8 }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}&backgroundColor=ffd5dc`}
              alt="" style={{ width: '100%', height: '100%' }}
            />
          </div>
          <button className="btn btn-link p-0" onClick={() => navigate('/')} title="Home">
            <FiHome size={20} color="#555" />
          </button>
          <button className="btn btn-link p-0" title="Chat">
            <FiMessageCircle size={20} color="var(--bz-red)" />
          </button>
          <button className="btn btn-link p-0" title="Notifications">
            <FiBell size={20} color="#555" />
          </button>
          {/* Spacer */}
          <div style={{ flex: 1 }} />
          <button className="btn btn-link p-0" onClick={() => navigate('/forum')} title="Leave">
            <FiLogOut size={18} color="#555" />
          </button>
          <span style={{ fontSize: 10, color: '#888' }}>Leave</span>
        </div>

        {/* ── Col 2: Groups list ── */}
        <div className="chat-groups">
          <div className="p-3 border-bottom">
            <h6 className="fw-700 mb-0" style={{ fontSize: 15 }}>Groups</h6>
          </div>
          {GROUPS.map(group => (
            <div
              key={group.id}
              className={`group-item ${activeGroup === group.id ? 'active' : ''}`}
              onClick={() => switchGroup(group.id)}
            >
              <img src={group.img} alt={group.name} />
              <div style={{ flex: 1 }}>
                <p className="group-name mb-0">{group.name}</p>
                <p className="group-count mb-0">{group.users} Users</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Col 3: Chat window ── */}
        <div className="chat-window">
          {/* Chat header */}
          <div className="chat-header">
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
              <img src={currentGroup?.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p className="fw-700 mb-0" style={{ fontSize: 14 }}>{currentGroup?.name}</p>
              <p style={{ fontSize: 12, color: '#22c55e', margin: 0 }}>Active</p>
            </div>
            <button className="btn btn-link p-0"><FiMoreVertical size={18} color="#555" /></button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id}
                className={`d-flex align-items-end gap-2 ${msg.isMine ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={msg.avatar} alt={msg.user} style={{ width: '100%', height: '100%' }} />
                </div>
                {/* Bubble + time */}
                <div style={{ maxWidth: '60%' }}>
                  <div style={{
                    background: msg.isMine ? 'var(--bz-yellow)' : '#f0f0f0',
                    borderRadius: msg.isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '8px 14px', fontSize: 13,
                  }}>
                    {msg.text}
                  </div>
                  <p style={{ fontSize: 11, color: '#aaa', margin: '3px 4px 0',
                    textAlign: msg.isMine ? 'right' : 'left' }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type Message"
            />
            <button className="chat-send-btn" onClick={sendMessage}>
              <FiSend size={16} color="#1a1a2e" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}