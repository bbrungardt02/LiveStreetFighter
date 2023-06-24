const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const { player, enemy } = require("../public/index");

function determineWinner({ player, enemy }) {
  if (player.health === enemy.health) {
    io.emit("winner", "Tie");
  } else if (player.health > enemy.health) {
    io.emit("winner", "Player 1 Wins!");
  } else if (enemy.health > player.health) {
    io.emit("winner", "Player 2 Wins!");
  }
}

let timer = 60; // Initial timer value
let timerId; // Timer ID

// Function to decrease the timer
function decreaseTimer() {
  if (timer > 0) {
    timer--;
    io.emit("timerUpdate", timer); // Emit the updated timer value to all connected clients
  }
  if (timer === 0) {
    clearTimeout(timerId);
    determineWinner({ player, enemy });
  }
}

// Function to start the timer
function startTimer() {
  timerId = setInterval(decreaseTimer, 1000);
}

async function main() {
  io.on("connect", (socket) => {
    console.log("user connected", socket.id);

    // Serve the client-side HTML file
    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });

    // Handle keydown event
    socket.on("keydown", (event) => {
      io.emit("keydown", event); // Emit the keydown event to all connected clients
    });

    // Handle keyup event
    socket.on("keyup", (event) => {
      io.emit("keyup", event); // Emit the keyup event to all connected clients
    });

    // Start the timer when a client connects
    startTimer();

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
  app.use(express.static("public"));

  httpServer.listen(3000);
}

main();
