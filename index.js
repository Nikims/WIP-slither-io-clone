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
sockets=[]
function text2Number(string) {
    return parseInt(string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' '),2)
}
app.use("/", express.static(__dirname + "/public"));
io.on("connection", (socket) => {
  sockets.push(socket)

  
   socket.on('disconnect',()=>{
     for(let i=0;i<players.length;i++){
       if(players[i]!=null){
       if(players[i].id==text2Number(socket.id)){
         console.log(players[i])
         players.splice(i,1)
       }
     }
     }
   })

  socket.emit("id",text2Number(socket.id))
  setInterval(() => {
    socket.emit("otherPos", players);
  }, 20);
  socket.on("myPos",(pos)=>{
         for(let i=0;i<players.length;i++){
           if(players[i].id==pos.id){
             players[i]=pos
           }
         }
  })

  players.push({ x: 300, y: 300, id:text2Number(socket.id)});
});
app.use("/static", express.static(path.join(__dirname, "public")));
app.listen(8000, function () {});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
io.on("connection", (socket) => {
  console.log("a user connected");
});
