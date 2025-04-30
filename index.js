const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: http });

// Serve the frontend
app.use(express.static('public'));

// WebSocket Signaling
let clients = [];
wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('message', (msg) => {
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

http.listen(3000, () => {
  console.log("Server running on port 3000");
});
