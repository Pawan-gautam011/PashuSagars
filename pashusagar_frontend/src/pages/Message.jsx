import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { MessageCircle, Star, Clock, User, Search, Home, ChevronRight, Send } from "lucide-react";
import Navbar from "../Components/Navbar";
import webSocketService from "../WebSocketService"; 

function Message() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Online Consultation", path: "/online-consultation" },
    { label: "Messages", path: "/message" },
  ];

  

  // Enhanced breadcrumbs component
  const EnhancedBreadcrumbs = ({ items }) => {
    return (
      <nav className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-6">
        <ol className="flex flex-wrap items-center">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center">
                {index === 0 && <Home size={16} className="text-white mr-2" />}
                
                {isLast ? (
                  <span className="font-medium text-[#55DD4A]">{item.label}</span>
                ) : (
                  <>
                    <a 
                      href={item.path} 
                      className="text-white hover:text-[#ADE1B0] transition-colors"
                    >
                      {item.label}
                    </a>
                    <ChevronRight size={16} className="mx-2 text-white/60" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };

  // Fetch all veterinarians (doctors)
  const fetchDoctors = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch doctors: ${response.status}`);
      }
      const data = await response.json();
      const filteredDoctors = data.filter(
        (user) => user.role_display === "Veterinarian" && user.id !== Number(user_id)
      );
      setDoctors(filteredDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Could not load doctors. Please try again later.");
    }
  }, [token, user_id]);

  // Fetch all messages for the user
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
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
      const sortedMessages = data.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      setAllMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Could not load messages. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Initial data fetching
  useEffect(() => {
    fetchDoctors();
    fetchMessages();
  }, [fetchDoctors, fetchMessages]);

  // Filter messages for the selected doctor
  const filteredMessages = selectedDoctor 
    ? allMessages.filter(message => 
        (message.sender === Number(user_id) && message.recipient === selectedDoctor.id) ||
        (message.recipient === Number(user_id) && message.sender === selectedDoctor.id)
      )
    : [];

  // Set up WebSocket connection and listeners
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const connectWebSocket = async () => {
      try {
        await webSocketService.connect(token);
        
        const handleNewMessage = (data) => {
          if (data.type === 'new_message') {
            setAllMessages(prev => [...prev, data.message]);
          }
        };
        
        webSocketService.addEventListener('new_message', handleNewMessage);
        
        return () => {
          webSocketService.removeEventListener('new_message', handleNewMessage);
        };
      } catch (error) {
        console.error("WebSocket connection failed:", error);
        setError("Failed to connect to chat service. Please refresh the page.");
      }
    };
    
    connectWebSocket();
    
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  // Modify your sendMessage function to use WebSocket
  const sendMessage = async () => {
    if (!userMessage.trim() || !selectedDoctor) {
      setError("Please select a doctor and type a message.");
      return;
    }

    try {
      // Send via WebSocket
      const success = webSocketService.send({
        type: 'new_message',
        message: {
          sender: Number(user_id),
          recipient: selectedDoctor.id,
          content: userMessage,
          timestamp: new Date().toISOString()
        }
      });

      if (success) {
        // Optimistically update UI
        const newMessage = {
          id: Date.now(), // Temporary ID
          sender: Number(user_id),
          recipient: selectedDoctor.id,
          content: userMessage,
          timestamp: new Date().toISOString()
        };
        setAllMessages(prev => [...prev, newMessage]);
        setUserMessage("");
        setError(null);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  

    try {
      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: Number(user_id),
          recipient: selectedDoctor.id,
          content: userMessage,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const newMessage = await response.json();
      setAllMessages([...allMessages, newMessage]);
      setUserMessage("");
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] pt-16 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <EnhancedBreadcrumbs items={breadcrumbItems} />
        
        <div className="text-center mb-8">
          <h2 className="text-[#55DD4A] text-3xl md:text-4xl font-bold mb-2">
            Veterinary Messages
          </h2>
          <p className="text-[#ADE1B0]">
            Connect with veterinarians for expert advice about your pets
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 bg-white/10 backdrop-blur-md rounded-xl p-4">
          {/* Doctor List */}
          <div className="w-full lg:w-1/4 bg-white/5 rounded-lg p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search doctors..."
                className="w-full bg-white/20 text-white border border-[#ADE1B0] rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] placeholder-white/60"
              />
              <Search className="absolute left-3 top-2.5 text-white/60" size={18} />
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-4">Available Veterinarians</h2>
            {doctors.length === 0 ? (
              <p className="text-white/70">No veterinarians available</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 flex items-center ${
                      selectedDoctor?.id === doctor.id 
                        ? "bg-[#55DD4A]/30 border border-[#55DD4A]" 
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="bg-gradient-to-br from-[#00796B] to-[#00695C] h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {doctor.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{doctor.username}</p>
                      <p className="text-white/60 text-sm">Veterinarian</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Window */}
          <div className="flex-1 bg-white/5 rounded-lg p-6 flex flex-col">
            {selectedDoctor ? (
              <>
                <div className="flex items-center mb-6 pb-4 border-b border-white/10">
                  <div className="bg-gradient-to-br from-[#00796B] to-[#00695C] h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {selectedDoctor.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Dr. {selectedDoctor.username}
                    </h2>
                    <p className="text-[#ADE1B0] text-sm">Veterinarian</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                  {filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/50">
                      <MessageCircle size={48} className="mb-4" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation with {selectedDoctor.username}</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === Number(user_id) ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.sender === Number(user_id)
                              ? "bg-[#55DD4A]/20 rounded-tr-none"
                              : "bg-white/10 rounded-tl-none"
                          }`}
                        >
                          <p className="text-white">{message.content}</p>
                          <p className="text-xs mt-1 text-white/50">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="mt-auto">
                  {error && (
                    <div className="mb-3 p-3 bg-red-500/20 text-red-100 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <textarea
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-1 p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] placeholder-white/50 resize-none"
                      rows="2"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!userMessage.trim() || !selectedDoctor}
                      className="self-end h-[52px] px-4 bg-[#55DD4A] text-white rounded-lg hover:bg-[#4BC940] focus:outline-none focus:ring-2 focus:ring-[#55DD4A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Send size={18} className="mr-2" />
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/50">
                <MessageCircle size={64} className="mb-4" />
                <h3 className="text-xl text-white mb-2">Select a veterinarian</h3>
                <p>Choose a veterinarian from the list to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Message;