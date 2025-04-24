import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

function AdminMessage() {
  const [doctors, setDoctors] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [doctorMessage, setDoctorMessage] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messageOfSpecificUser, setMessageOfSpecificUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyingToMessageId, setReplyingToMessageId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch all veterinarians (doctors)
  const getDoctors = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
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
      const filteredData = data.filter(
        (user) => user.role_display === "Veterinarian"
      );
      setDoctors(filteredData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all messages
  const getMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
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
      setAllMessages(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Filter messages for a selected doctor
  const filterDoctorMessage = (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedUserId(null);

    const filteredData = allMessages.filter(
      (message) => message.sender === doctorId || message.recipient === doctorId
    );
    setDoctorMessage(filteredData);
    setMessageOfSpecificUser([]);
  };

  const filterMessageForSpecificUser = (userId) => {
    setSelectedUserId(userId);
    const messages = doctorMessage.filter((item) => {
      return item.sender === userId || item.recipient === userId;
    });
    setMessageOfSpecificUser(messages);
  };

  // Handle reply submission
  const handleReply = async (recipientId, message) => {
    console.log("message>>>", message);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      setError("Authentication information is missing");
      return;
    }

    if (!replyContent.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    setLoading(true);
    console.log("MY",{
      reply: replyContent,
      sender: userId,
      recipient: message.sender,
    });
    try {
      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: Number(userId),
          recipient: message.sender,
          content: replyContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      await getMessages();

      if (selectedUserId) {
        filterMessageForSpecificUser(selectedUserId);
      }

      setReplyContent("");
      setReplyingToMessageId(null);
    } catch (error) {
      console.error("Error sending reply:", error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
    getMessages();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Doctors</h1>
      <ul className="flex flex-wrap gap-2 mb-8">
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            <button
              onClick={() => filterDoctorMessage(doctor.id)}
              className={`px-4 py-2 rounded-md text-white ${
                selectedDoctor === doctor.id ? "bg-green-500" : "bg-blue-500"
              } hover:opacity-90 transition-opacity`}
            >
              {doctor.username}
            </button>
          </li>
        ))}
      </ul>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>

        {selectedDoctor ? (
          doctorMessage.length > 0 ? (
            <div className="space-y-4">
              {doctorMessage
                .filter(
                  (message) =>
                    !selectedUserId ||
                    message.sender === selectedUserId ||
                    message.recipient === selectedUserId
                )
                .map((message) => (
                  <div
                    key={message.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="mb-3">
                      <button
                        onClick={() => {
                          const userId =
                            message.sender === selectedDoctor
                              ? message.recipient
                              : message.sender;
                          filterMessageForSpecificUser(userId);
                        }}
                        className="text-blue-500 hover:underline cursor-pointer"
                      >
                        {message.sender === selectedDoctor
                          ? message.recipient_name
                          : message.sender_name}
                      </button>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">From:</span>{" "}
                        {message.sender_name}
                      </p>
                      <p>
                        <span className="font-medium">To:</span>{" "}
                        {message.recipient_name}
                      </p>
                      <p className="my-2 p-2 bg-gray-50 rounded">
                        {message.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {replyingToMessageId === message.id && (
                      <div className="mt-4">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Type your reply here..."
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="3"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleReply(
                                message.sender === selectedDoctor
                                  ? message.recipient
                                  : message.sender,
                                message
                              )
                            }
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Send Reply
                          </button>
                          <button
                            onClick={() => setReplyingToMessageId(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {replyingToMessageId !== message.id && (
                      <button
                        onClick={() => setReplyingToMessageId(message.id)}
                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No messages found for this doctor.</p>
          )
        ) : (
          <p className="text-gray-500">
            Please select a doctor to view messages.
          </p>
        )}
      </div>
    </div>
  );
}

// Optional: PropTypes for runtime type checking
AdminMessage.propTypes = {
  // Add prop type validations if needed
};

export default AdminMessage;
