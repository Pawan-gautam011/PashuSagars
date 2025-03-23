import { useState, useEffect } from "react";
import { useLocation } from "react-router";

function Message() {
  const location = useLocation();
  const doctor_id = location.state?.doctor_id; // Safely access doctor_id
  console.log(doctor_id);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  // Fetch all veterinarians (doctors)
  const getDoctors = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      // Filter users with role_display === "Veterinarian" and exclude the current user
      const filteredData = data.filter(
        (user) => user.role_display === "Veterinarian" && user.id !== Number(user_id)
      );
      console.log("Filtered Veterinarians id:", filteredData);
      setDoctor(filteredData);
      console.log("Not Filtered Veterinarians id:", data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // Fetch all messages for the user
  const getMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("All Messages", data);
      setAllMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  // Filter messages for the selected doctor
  const filteredMessages = allMessages.filter(
    (message) =>
      (message.sender === Number(user_id) && message.recipient === selectedDoctor?.id) ||
      (message.sender === selectedDoctor?.id && message.recipient === Number(user_id))
  );

  // Send message to the selected doctor
  const sendMessage = async () => {
    if (!userMessage.trim() || !selectedDoctor) return;

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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Message sent:", data);
      setUserMessage("");
      getMessages(); // Refresh messages after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Chat</h1>

      <div className="flex gap-6">
        {/* Doctor List */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Doctors</h2>
          {doctor?.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedDoctor(item)}
              className={`p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
                selectedDoctor?.id === item.id ? "bg-blue-100" : ""
              }`}
            >
              <p className="text-lg">{item.username}</p>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Messages with {selectedDoctor?.username}
          </h2>
          <div className="h-96 overflow-y-auto mb-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-3 mb-2 rounded-lg ${
                  message.sender === Number(user_id)
                    ? "bg-blue-100 ml-auto w-3/4"
                    : "bg-gray-100 mr-auto w-3/4"
                }`}
              >
                <strong className="block text-sm font-medium">
                  {message.sender_name}:
                </strong>
                <p className="text-gray-700">{message.content}</p>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;