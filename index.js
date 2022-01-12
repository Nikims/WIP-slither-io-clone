const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
    transports: ["websocket"],
    credentials: true,
  },
  allowEIO3: true,
});
players = [];
sockets = [];
function text2Number(string) {
  return parseInt(
    string
      .split("")
      .map(function (char) {
        return char.charCodeAt(0).toString(2);
      })
      .join(" "),
    2
  );
}
app.use("/", express.static(__dirname + "/public"));
io.on("connection", (socket) => {
  sockets.push(socket);

  socket.on("disconnect", () => {
    for (let i = 0; i < players.length; i++) {
      if (players[i] != null) {
        if (players[i].id == text2Number(socket.id)) {
          console.log(players[i]);
          players.splice(i, 1);
        }
      }
    }
  });

  setInterval(() => {
    socket.emit("otherPos", players);
  }, 200);
  socket.on("myPos", (pos) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id == pos.id) {
        players[i] = pos;
      }
    }
  });

  players.push({
    x: 300,
    y: 300,
    id: text2Number(socket.id),
    color: Math.round(Math.random() * 360),
  });
  socket.emit("id", {
    id: text2Number(socket.id),
    color: players[players.length - 1].color,
  });

  console.log(players[players.length - 1].color);
});
app.use("/static", express.static(path.join(__dirname, "public")));
server.listen(6952, () => {
  console.log("listening on *:3000");
});
io.on("connection", (socket) => {
  console.log("a user connected");
});
