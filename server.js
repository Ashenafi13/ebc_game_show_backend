const app = require('./app');
require('dotenv').config();
const http = require('http');
// const socketIo = require('socket.io');

const server = http.createServer(app); // Attach Express to HTTP server
const PORT = process.env.PORT || 3000;

// Initialize Socket.IO with CORS
// const io = socketIo(server, {
//   cors: {
//     origin: '*', // Allow all origins (Adjust this for production)
//     methods: ['GET', 'POST'],
//   },
// });

// Handle Socket.IO connections
// io.on('connection', (socket) => {
//   console.log('Socket connected:', socket.id);

//   // Store userId associated with socket
//   socket.on('register-user', (userId) => {
//     socket.userId = userId; // Attach userId to socket instance
//     console.log(`User registered: ${userId}`);
//   });

//   socket.on('send-image', (data) => {
//     const { userId, image } = data;
//     const targetSocket = Array.from(io.sockets.sockets.values()).find(s => s.userId === userId);

//     if (targetSocket) {
//       targetSocket.emit('image', image); // Send image only to the specific user
//     } else {
//       console.log(`User with ID ${userId} not found`);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Socket disconnected:', socket.id);
//   });
// });

// Start the server using 'server.listen'
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
