const WebSocket = require("ws");
const generateV4ID = require("uuid").v4;

const wsClient = new WebSocket.Server({ port: 8088 });
const clients = {};

const candidates = {
  yorme: 0,
  pacman: 0,
  ping: 0,
};

wsClient.on("connection", (ws) => {
  const id = generateV4ID();
  clients[id] = ws;

  console.log(`User with ID ${id} has connected`);

  ws.on("message", (voteJSON) => {
    const vote = JSON.parse(voteJSON);

    candidates[vote.name] = candidates[vote.name] + vote.count;

    Object.keys(clients).forEach((clientId) => {
      clients[clientId].send(JSON.stringify(candidates));
    });
  });
});

wsClient.on("close", () => {
  console.log("CLOSING HERE");
});

console.log("Websocket server running at port 8088");
