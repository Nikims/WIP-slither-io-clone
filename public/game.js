coords = [];
foods = [];
mypos = { x: 300, y: 300, coords: [] };
length = 10;
updates = 0;
id = 0;
players = [];
socket.on("id", (idlol) => {
  mypos.id = idlol.id;
  id = idlol.id;
  mypos.color = idlol.color;
});
socket.on("otherPos", (inp) => {
  players = inp;
});

for (i = 0; i < 400; i++) {
  foods.push({ x: Math.random() * 100, y: Math.random() * 100 });
}
function update() {
  socket.emit("myPos", mypos);
  for (i = 0; i < foods.length; i++) {
    if (
      areColliding(
        300,
        300,
        40,
        40,
        foods[i].x - mypos.x + 300,
        foods[i].x - mypos.y + 300,
        10,
        10
      )
    ) {
      length++;
      foods.splice(i, 1);
      break;
    }
  }
  updates++;
  if (isKeyPressed[32]) {
    mypos.x += Math.cos(Math.atan2(mouseY - 300, mouseX - 300));
    mypos.y += Math.sin(Math.atan2(mouseY - 300, mouseX - 300));
  }
  if (updates % 10 == 0) {
    if (mypos.coords.length < length) {
      mypos.coords.push({ x: mypos.x, y: mypos.y });
    } else {
      if (
        Math.sqrt(
          Math.pow(mypos.coords[mypos.coords.length - 1].x - mouseX, 2) +
            Math.pow(mypos.coords[mypos.coords.length - 1].y - mouseY, 2)
        ) > 20
      ) {
        mypos.coords.push({ x: mypos.x, y: mypos.y });
        mypos.coords.splice(0, 1);
      }
    }
  }
}
function draw() {
  try {
    for (i = 0; i < players.length; i++) {
      if (players[i] != null) {
        for (j = 0; j < players[i].coords.length; j++) {
          context.fillStyle = `hsl(${players[i].color}, 100%, 50%)`;
          context.fillRect(
            players[i].coords[j].x - mypos.x + 300,
            players[i].coords[j].y - mypos.y + 300,
            40,
            40
          );
        }
      }
    }
  } catch {}
  for (i = 0; i < foods.length; i++) {
    context.fillStyle = `black`;

    context.fillRect(
      foods[i].x - mypos.x + 300,
      foods[i].y - mypos.y + 300,
      10,
      10
    );
  }
  for (i = 0; i < mypos.coords.length; i++) {
    context.fillStyle = `hsl(${mypos.color}, 100%, 50%)`;

    context.fillRect(
      mypos.coords[i].x - mypos.x + 300,
      mypos.coords[i].y - mypos.y + 300,
      40,
      40
    );
  }
  context.fillRect(300, 300, 40, 40);
}
