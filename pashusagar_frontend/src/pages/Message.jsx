import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
function Message() {
  const location = useLocation();
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
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
      // Sort messages by timestamp to ensure chronological order
      const sortedMessages = data.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      setAllMessages(sortedMessages);
      console.log(data)
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

  // Comprehensive message filtering
  const filteredMessages = allMessages.filter((message) => {
    // Check if the message involves the selected doctor and current user
    return message
  });

  // Send message to the selected doctor
  const sendMessage = async () => {
    if (!userMessage.trim() || !selectedDoctor) {
      setError("Please select a doctor and type a message.");
      return;
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Veterinary Chat</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="flex gap-6">
        {/* Doctor List */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
          {doctors.length === 0 ? (
            <p className="text-gray-500">No doctors available</p>
          ) : (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200 ${
                  selectedDoctor?.id === doctor.id ? "bg-blue-100" : ""
                }`}
              >
                <p className="text-lg">{doctor.username}</p>
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          {selectedDoctor ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Messages with  {selectedDoctor.username}
              </h2>
              <div className="h-96 overflow-y-auto mb-4">
                {filteredMessages.length === 0 ? (
                  <p className="text-center text-gray-500">No messages yet</p>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 mb-2 rounded-lg flex flex-col ${
                        message.sender === Number(user_id)
                          ? "bg-blue-100 items-end"
                          : "bg-gray-100 items-start"
                      }`}
                    >
                      {
                        console.log(filteredMessages)
                      }
                      <strong className="text-sm font-medium mb-1">
                        {message.sender_name}
                      </strong>
                      <p className="text-gray-700 max-w-full break-words">
                        {message.content}
                      </p>
                      <small className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <button
                  onClick={sendMessage}
                  disabled={!userMessage.trim() || !selectedDoctor}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              Select a doctor to start chatting
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;