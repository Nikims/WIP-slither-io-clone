const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});
players = [];

app.use("/", express.static(__dirname + "/public"));
io.on("connection", (socket) => {
  socket.emit("id",players.length)
  setInterval(() => {
    socket.emit("otherPos", players);
  }, 20);
  socket.on("myPos",(pos)=>{
    players[pos.id]=pos
  })

  players.push({ x: 300, y: 300, id: players.length });
});
app.use("/static", express.static(path.join(__dirname, "public")));
app.listen(8000, function () {});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
io.on("connection", (socket) => {
  console.log("a user connected");
});
