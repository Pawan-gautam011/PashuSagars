import React, { useState, useEffect } from "react";
import {
  User,
  Search,
  Mail,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Clock
} from "lucide-react";

const VeterinarinanMessage = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  // Fetch all messages
  const fetchMessages = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(data);
      setFilteredMessages(data);
      
      // Organize messages into conversations
      organizeConversations(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Organize messages into conversations by users
  const organizeConversations = (allMessages) => {
    // Get messages where the vet is either sender or recipient
    const relevantMessages = allMessages.filter(
      msg => msg.sender == user_id || msg.recipient == user_id
    );
    
    // Create a map of conversations by user
    const conversationMap = new Map();
    
    relevantMessages.forEach(msg => {
      // Determine the other user in the conversation
      const otherUserId = msg.sender == user_id ? msg.recipient : msg.sender;
      const otherUserName = msg.sender == user_id ? msg.recipient_name : msg.sender_name;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          username: otherUserName,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        });
      }
      
      const conversation = conversationMap.get(otherUserId);
      conversation.messages.push(msg);
      
      // Count unread messages where vet is recipient
      if (msg.recipient == user_id && !msg.is_read) {
        conversation.unreadCount++;
      }
      
      // Update last message
      if (!conversation.lastMessage || new Date(msg.timestamp) > new Date(conversation.lastMessage.timestamp)) {
        conversation.lastMessage = msg;
      }
    });
    
    // Convert map to array and sort by last message timestamp (newest first)
    const conversationsArray = Array.from(conversationMap.values())
      .sort((a, b) => {
        return new Date(b.lastMessage?.timestamp) - new Date(a.lastMessage?.timestamp);
      });
    
    setConversations(conversationsArray);
  };

  // In VeterinarinanMessage.jsx
  const [localReadMessages, setLocalReadMessages] = useState(() => {
    return JSON.parse(localStorage.getItem('readMessages') || '{}');
  });

  // Update the handleSelectConversation function
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    const sortedMessages = [...conversation.messages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    setConversationMessages(sortedMessages);
    
    // Update local storage to mark these messages as read
    const updatedReadMessages = {
      ...localReadMessages,
      [conversation.userId]: Date.now()
    };
    setLocalReadMessages(updatedReadMessages);
    localStorage.setItem('readMessages', JSON.stringify(updatedReadMessages));
  };

  // Modify the conversation display to use local read state
  const getUnreadCount = (conversation) => {
    const lastReadTime = localReadMessages[conversation.userId] || 0;
    return conversation.messages.filter(msg => 
      msg.recipient == user_id && 
      !msg.is_read &&
      new Date(msg.timestamp) > new Date(lastReadTime)
    ).length;
  };

  // Send a reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim() || !selectedConversation) {
      setError("Please enter a message");
      return;
    }
    
    setIsSending(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sender: parseInt(user_id),
          recipient: selectedConversation.userId,
          content: replyContent
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      const newMessage = await response.json();
      
      // Update local state immediately with "delivered" status
      const deliveredMessage = {
        ...newMessage,
        is_read: false
      };
      
      setMessages(prevMessages => [...prevMessages, deliveredMessage]);
      setConversationMessages(prevMessages => [...prevMessages, deliveredMessage]);
      
      // Update conversations
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.userId === selectedConversation.userId) {
            return {
              ...conv,
              messages: [...conv.messages, deliveredMessage],
              lastMessage: deliveredMessage
            };
          }
          return conv;
        })
      );
      
      setReplyContent("");
      setSuccess("Message sent successfully");
   
      
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredMessages(messages);
      return;
    }
    
    const filtered = conversations.filter(
      conv => conv.username.toLowerCase().includes(query)
    );
    
    setConversations(filtered);
  };
  
  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    
    // Set up polling for new messages every 30 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="flex flex-col md:flex-row h-[75vh]">
        {/* Conversations sidebar */}
        <div className="w-full md:w-1/3 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#55DD4A] focus:outline-none"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </div>
          
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <button
              onClick={fetchMessages}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          
          {/* Conversations list */}
          <div className="overflow-y-auto h-[calc(75vh-130px)]">
            {isLoading && conversations.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="animate-spin mr-2 text-[#55DD4A]" size={24} />
                <span className="text-gray-500">Loading conversations...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Mail className="mx-auto mb-2 text-gray-300" size={32} />
                <p>No messages found</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 flex items-start ${
                    selectedConversation?.userId === conversation.userId
                      ? "bg-[#e8f5e9]"
                      : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#55DD4A] text-white flex items-center justify-center flex-shrink-0 mr-3">
                    <User size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.username}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage
                          ? new Date(conversation.lastMessage.timestamp).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="flex items-center text-xs text-gray-500">
                        {conversation.lastMessage?.sender == user_id ? (
                          <>
                            <span>You: </span>
                            <Clock size={12} className="ml-1 mr-1" />
                            <span>
                              {conversation.lastMessage
                                ? new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })
                                : ""}
                            </span>
                          </>
                        ) : (
                          <span>
                            {new Date(conversation.lastMessage?.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        )}
                      </span>
                      
                      {conversation.unreadCount > 0 && (
                        <span className="bg-[#55DD4A] text-white text-xs font-medium px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Conversation detail */}
        <div className="w-full md:w-2/3 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#55DD4A] text-white flex items-center justify-center mr-3">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {selectedConversation.username}
                    </h2>
                  </div>
                </div>
              </div>
              
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {conversationMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Mail className="text-gray-300 mb-2" size={48} />
                    <p>No messages in this conversation</p>
                  </div>
                ) : (
                  <>
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 max-w-[80%] ${
                          message.sender == user_id
                            ? "ml-auto bg-[#e8f5e9] rounded-lg rounded-tr-none"
                            : "mr-auto bg-white rounded-lg rounded-tl-none shadow-sm"
                        }`}
                      >
                        <div className="p-3">
                          <p className="text-gray-800">{message.content}</p>
                          <div className="mt-1 flex items-center justify-end space-x-1">
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                            {message.sender == user_id && (
                              <span className="flex items-center">
                                {message.is_read ? (
                                  <span className="text-xs text-[#55DD4A]">Seen</span>
                                ) : (
                                  <span className="text-xs text-gray-400">Delivered</span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              
              {/* Reply form */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {error && (
                  <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm flex items-center">
                    <AlertCircle className="mr-2" size={16} />
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-3 p-2 bg-green-100 text-green-700 rounded text-sm flex items-center">
                    <CheckCircle2 className="mr-2" size={16} />
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleSendReply} className="flex items-end gap-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#55DD4A] focus:outline-none min-h-[80px] resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSending || !replyContent.trim()}
                    className="bg-[#55DD4A] text-white px-4 py-3 rounded-lg hover:bg-[#45BB3A] transition-colors disabled:bg-[#A5E99A] disabled:cursor-not-allowed flex items-center"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={18} />
                        Send
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Mail className="text-gray-300 mb-4" size={64} />
              <p className="text-xl">Select a conversation</p>
              <p className="text-sm mt-2">Choose a conversation from the list to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VeterinarinanMessage;