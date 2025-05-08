// WebSocketService.js
class WebSocketService {
  constructor() {
    this.socket = null;
    this.events = {};
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
  }

  // Connect to the WebSocket server
  // WebSocketService.js - update connect method
connect(token) {
  return new Promise((resolve, reject) => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      resolve();
      return;
    }

    // Clear any existing reconnection attempts
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Log the exact URL we're connecting to
    const url = `ws://127.0.0.1:8000/ws/messages/?token=${token}`;
    console.log("Attempting to connect to WebSocket at:", url);
    
    this.socket = new WebSocket(url);

    // Add a connection timeout
    const connectionTimeout = setTimeout(() => {
      console.log("WebSocket connection timeout");
      this.socket.close();
      reject(new Error("Connection timeout"));
    }, 5000);

    this.socket.onopen = () => {
      clearTimeout(connectionTimeout);
      console.log("WebSocket connection established");
      this.connected = true;
      this.reconnectAttempts = 0;
      this.startPingInterval();
      resolve();
    };



      this.socket.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}`);
        this.connected = false;
        this.stopPingInterval();
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && event.code !== 1001) {
          this.attemptReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);
          
          // Dispatch event to all registered handlers
          if (data.type && this.events[data.type]) {
            this.events[data.type].forEach(callback => callback(data));
          }
          
          // Also dispatch to 'message' event handlers
          if (this.events['message']) {
            this.events['message'].forEach(callback => callback(data));
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    });
  }

  // Attempt to reconnect with exponential backoff
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts));
    console.log(`Attempting to reconnect in ${delay}ms`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      const token = localStorage.getItem('token');
      if (token) {
        this.connect(token).catch(() => {
          // Connection failed, will retry
        });
      }
    }, delay);
  }

  // Add event listener
  addEventListener(type, callback) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(callback);
  }

  // Remove event listener
  removeEventListener(type, callback) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(cb => cb !== callback);
    }
  }

  // Send a message through the WebSocket
  send(data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return false;
    }

    try {
      this.socket.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      return false;
    }
  }

  // Disconnect the WebSocket
  disconnect() {
    this.stopPingInterval();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close(1000, "Normal closure");
      this.socket = null;
    }
    
    this.connected = false;
  }

  // Ping to keep connection alive
  startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, 30000); // Send ping every 30 seconds
  }

  stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Check if WebSocket is connected
  isConnected() {
    return this.connected && this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;