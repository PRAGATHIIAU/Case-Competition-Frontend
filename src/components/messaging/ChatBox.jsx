import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, X, User, Clock } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'

export default function ChatBox() {
  const { currentUser, getMyContacts, getMessages, sendMessage } = useMockData()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [conversation, setConversation] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [contacts, setContacts] = useState([])
  const messagesEndRef = useRef(null)
  const pollingIntervalRef = useRef(null)

  // Load contacts
  useEffect(() => {
    const loadContacts = () => {
      try {
        const myContacts = getMyContacts ? getMyContacts() : []
        setContacts(myContacts)
        
        // Auto-select first contact if none selected
        if (!selectedContact && myContacts.length > 0) {
          setSelectedContact(myContacts[0])
        }
      } catch (error) {
        console.error('Error loading contacts:', error)
        setContacts([])
      }
    }

    loadContacts()
    
    // Refresh contacts every 5 seconds
    const contactsInterval = setInterval(loadContacts, 5000)
    
    return () => clearInterval(contactsInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMyContacts])

  // Load conversation when contact is selected
  useEffect(() => {
    if (selectedContact) {
      loadConversation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact?.userId])

  // Polling for new messages
  useEffect(() => {
    if (isOpen && selectedContact) {
      // Poll every 3 seconds
      pollingIntervalRef.current = setInterval(() => {
        loadConversation()
      }, 3000)

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedContact?.userId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const loadConversation = async () => {
    if (!selectedContact) return

    try {
      const result = await getMessages(selectedContact.userId)
      if (result.success) {
        setConversation(result.messages)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!messageInput.trim() || !selectedContact || isSending) return

    setIsSending(true)

    try {
      const result = await sendMessage(selectedContact.userId, messageInput)
      if (result.success) {
        setMessageInput('')
        // Reload conversation to show new message
        await loadConversation()
        // Refresh contacts to update last message
        setContacts(getMyContacts())
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert(error.message || 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const unreadTotal = contacts.reduce((sum, contact) => sum + contact.unreadCount, 0)

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-tamu-maroon text-white p-4 rounded-full shadow-2xl hover:bg-tamu-maroon-light transition-colors z-[9999] flex items-center justify-center gap-2 min-w-[56px] min-h-[56px]"
        style={{ position: 'fixed' }}
        aria-label="Open messages"
      >
        <MessageSquare className="w-6 h-6" />
        {unreadTotal > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-[10000]">
            {unreadTotal > 9 ? '9+' : unreadTotal}
          </span>
        )}
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-[9999] border border-gray-200"
      style={{ position: 'fixed' }}
    >
      {/* Header */}
      <div className="bg-tamu-maroon text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-semibold">Messages</h3>
          {unreadTotal > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadTotal} new
            </span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded p-1 transition-colors"
          aria-label="Close messages"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
          {contacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No contacts yet</p>
              <p className="text-xs mt-1">Connect with mentors to start messaging</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <button
                  key={contact.userId}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-3 text-left hover:bg-gray-100 transition-colors ${
                    selectedContact?.userId === contact.userId ? 'bg-white border-r-2 border-tamu-maroon' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-tamu-maroon/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-tamu-maroon" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.role === 'mentor' ? 'Mentor' : 'Student'}</p>
                    </div>
                    {contact.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
                      </span>
                    )}
                  </div>
                  {contact.lastMessage && (
                    <p className="text-xs text-gray-600 truncate ml-10">
                      {contact.lastMessage.isFromMe ? 'You: ' : ''}
                      {contact.lastMessage.content}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-tamu-maroon/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-tamu-maroon" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{selectedContact.name}</p>
                    <p className="text-xs text-gray-500">{selectedContact.role === 'mentor' ? 'Mentor' : 'Student'}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {conversation.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No messages yet</p>
                    <p className="text-xs mt-1">Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversation.map((msg) => {
                      const isFromMe = msg.senderId === currentUser.id
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-lg px-3 py-2 ${
                              isFromMe
                                ? 'bg-tamu-maroon text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isFromMe ? 'text-white/70' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent text-sm"
                    disabled={isSending}
                  />
                  <motion.button
                    type="submit"
                    disabled={!messageInput.trim() || isSending}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 bg-tamu-maroon text-white rounded-lg font-medium transition-all ${
                      !messageInput.trim() || isSending
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-tamu-maroon-light'
                    }`}
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

