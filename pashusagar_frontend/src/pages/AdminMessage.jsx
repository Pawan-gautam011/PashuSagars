import { useEffect, useState } from "react";

function AdminMessage() {
  const [doctors, setDoctors] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorMessages, setDoctorMessages] = useState([]);
  const [replyContent, setReplyContent] = useState(""); // State for reply input

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

      // Filter users with role_display === "Veterinarian"
      const filteredData = data.filter(
        (user) => user.role_display === "Veterinarian"
      );
      setDoctors(filteredData);
      console.log("Filtered Veterinarians:", filteredData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Fetch all messages for the user
  const getMessages = async () => {
    const token = localStorage.getItem("token");
    console.log("token", token);
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
      console.log("Messages>>>>>>>",data)
      setAllMessages(data);
      console.log("All Messages", data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Filter messages for the selected doctor
  useEffect(() => {
    if (selectedDoctor) {
      const filteredMessages = allMessages.filter(
        (message) =>
          message.sender === selectedDoctor.id || message.recipient === selectedDoctor.id
      );
      setDoctorMessages(filteredMessages);
    }
  }, [selectedDoctor, allMessages]);

  // Function to send a reply
  const sendReply = async () => {
    if (!replyContent.trim() || !selectedDoctor) return; // Ensure there's content and a selected doctor

    const token = localStorage.getItem("token");
    const newMessage = {
      sender: selectedDoctor.id, // Assuming the doctor is the sender
      recipient: selectedDoctor.id, // Assuming the recipient is the same doctor (adjust as needed)
      content: replyContent,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Reply sent:", data);

      // Update the message list with the new reply
      setAllMessages([...allMessages, data]);
      setReplyContent(""); // Clear the reply input
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  useEffect(() => {
    getMessages();
    getDoctors();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Doctors List */}
      <div className="w-1/4 border-r border-gray-200 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold mb-4">Doctors</h3>
        <ul>
          {doctors.map((doctor) => (
            <li
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
              className={`p-3 cursor-pointer rounded-lg ${
                selectedDoctor?.id === doctor.id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              {doctor.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Messages Section */}
      <div className="w-3/4 p-4 bg-white">
        <h3 className="text-lg font-semibold mb-4">Messages</h3>
        {selectedDoctor ? (
          <div className="flex flex-col h-full">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto mb-4">
              <h4 className="text-md font-medium mb-4">
                Messages with {selectedDoctor.username}
              </h4>
              <div className="space-y-4">
                {doctorMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === selectedDoctor.id
                        ? "justify-end" // Your sent messages on the right
                        : "justify-start" // Received messages on the left
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === selectedDoctor.id
                          ? "bg-blue-500 text-white" // Your sent messages
                          : "bg-gray-200 text-gray-800" // Received messages
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Input Field */}
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <button
                onClick={sendReply}
                className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send Reply
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a doctor to view messages</p>
        )}
      </div>
    </div>
  );
}

export default AdminMessage;