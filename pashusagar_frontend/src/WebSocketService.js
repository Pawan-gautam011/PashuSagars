// WebSocketService.js
class WebSocketService {
    constructor(url) {
      this.baseUrl = url;
      this.socket = null;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectTimeout = 2000; // Start with 2 seconds
      this.isConnecting = false;
      this.connectionPromise = null;
      this.callbacks = {
        onConnect: () => {},
        onDisconnect: () => {},
        onMessage: () => {},
        onError: () => {}
      };
      
      // Ping interval to keep connection alive
      this.pingInterval = null;
      this.pingIntervalTime = 30000; // 30 seconds
      
      // Event listeners
      this.eventListeners = {
        'connection_established': [],
        'new_message': [],
        'message_sent': [],
        'message_status_update': [],
        'error': []
      };
    }
  
    /**
     * Connect to WebSocket server with authentication token
     * @param {string} token - JWT token for authentication
     * @returns {Promise} - Resolves when connection is established, rejects on error
     */
    connect(token) {
        // Return existing connection promise if already connecting
        if (this.connectionPromise) {
          return this.connectionPromise;
        }
        
        // Return immediately if already connected
        if (this.isConnected()) {
          return Promise.resolve();
        }
        
        this.isConnecting = true;
        this.connectionPromise = new Promise((resolve, reject) => {
          const wsUrl = `${this.baseUrl}?token=${token}`;
          console.log("Attempting WebSocket connection:", wsUrl);
          
          try {
            this.socket = new WebSocket(wsUrl);
            
            this.socket.onopen = () => {
              console.log("WebSocket connection established");
              this.isConnecting = false;
              this.reconnectAttempts = 0;
              this.startPingInterval();
              this.callbacks.onConnect();
              resolve();
            };
            
            this.socket.onerror = (error) => {
              console.error("WebSocket error:", error);
              this.isConnecting = false;
              this.triggerError("WebSocket connection error");
              reject(error);
            };
            
            this.socket.onclose = (event) => {
              console.log(`WebSocket connection closed: ${event.code}`);
              this.isConnecting = false;
              this.stopPingInterval();
              this.connectionPromise = null;
              
              // Only attempt reconnect if not explicitly closed
              if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.attemptReconnect(token);
              }
              
              this.callbacks.onDisconnect(event);
            };
            
        } catch (error) {
          console.error("Error creating WebSocket:", error);
          this.isConnecting = false;
          this.triggerError("Failed to create WebSocket connection");
          reject(error);
        }
      });
    }
  
    /**
     * Attempt to reconnect to the WebSocket server
     * @param {string} token - JWT token for authentication
     */
    attemptReconnect(token) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log(`Maximum reconnect attempts (${this.maxReconnectAttempts}) reached`);
        this.triggerError("Failed to reconnect after multiple attempts");
        return;
      }
      
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      // Exponential backoff
      const timeout = this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        this.connect(token).catch(() => {
          // Connection attempt failed, the onclose handler will try again
        });
      }, timeout);
    }
  
    /**
     * Disconnect from the WebSocket server
     */
    disconnect() {
      this.stopPingInterval();
      
      if (this.socket) {
        // Prevent reconnection attempts
        this.reconnectAttempts = this.maxReconnectAttempts;
        
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.close(1000); // Normal closure
        }
        
        this.socket = null;
      }
    }
  
    /**
     * Send data through the WebSocket connection
     * @param {Object} data - Data to send
     * @returns {boolean} - True if sent successfully, false otherwise
     */
    send(data) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error("Cannot send message: WebSocket is not connected");
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
  
    /**
     * Send a message to another user
     * @param {number} recipientId - Recipient user ID
     * @param {string} content - Message content
     * @returns {boolean} - True if sent successfully, false otherwise
     */
    sendMessage(recipientId, content) {
      return this.send({
        type: 'message',
        recipient: recipientId,
        content: content
      });
    }
  
    /**
     * Start ping interval to keep connection alive
     */
    startPingInterval() {
      this.stopPingInterval(); // Clear any existing interval
      
      this.pingInterval = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.send({ type: 'ping' });
        }
      }, this.pingIntervalTime);
    }
  
    /**
     * Stop ping interval
     */
    stopPingInterval() {
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
    }
  
    /**
     * Register event callbacks
     * @param {Object} callbacks - Object with callback functions
     */
    registerCallbacks(callbacks) {
      if (callbacks.onConnect) this.callbacks.onConnect = callbacks.onConnect;
      if (callbacks.onDisconnect) this.callbacks.onDisconnect = callbacks.onDisconnect;
      if (callbacks.onMessage) this.callbacks.onMessage = callbacks.onMessage;
      if (callbacks.onError) this.callbacks.onError = callbacks.onError;
    }
  
    /**
     * Add event listener for specific message types
     * @param {string} event - Event type to listen for
     * @param {Function} callback - Function to call when event is received
     */
    addEventListener(event, callback) {
      if (!this.eventListeners[event]) {
        this.eventListeners[event] = [];
      }
      
      this.eventListeners[event].push(callback);
    }
  
    /**
     * Remove event listener
     * @param {string} event - Event type
     * @param {Function} callback - Function to remove
     */
    removeEventListener(event, callback) {
      if (this.eventListeners[event]) {
        this.eventListeners[event] = this.eventListeners[event].filter(
          listener => listener !== callback
        );
      }
    }
  
    /**
     * Trigger error callback and event listeners
     * @param {string} message - Error message
     */
    triggerError(message) {
      const error = { type: 'error', message };
      this.callbacks.onError(error);
      
      if (this.eventListeners.error) {
        this.eventListeners.error.forEach(listener => {
          listener(error);
        });
      }
    }
  
    /**
     * Check if the WebSocket is connected
     * @returns {boolean} - True if connected, false otherwise
     */
    isConnected() {
      return this.socket && this.socket.readyState === WebSocket.OPEN;
    }
  }
  
  // Create singleton instance
  const webSocketService = new WebSocketService('ws://127.0.0.1:8000/ws/messages/');
  
  export default webSocketService;