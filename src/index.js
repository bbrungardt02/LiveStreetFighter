const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let timer = 60;
let timerId;

async function main() {
  io.on("connect", (socket) => {
    console.log("user connected", socket.id);

    // Serve the client-side HTML file
    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });

    // Handle keydown event
    socket.on("keydown", (event) => {
      console.log("Keydown:", event);
      io.emit("keydown", event); // Emit the keydown event to all connected clients
    });

    // Handle keyup event
    socket.on("keyup", (event) => {
      console.log("Keyup:", event);
      io.emit("keyup", event); // Emit the keyup event to all connected clients
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
  app.use(express.static("public"));

  httpServer.listen(3000);

  // Timer function
  function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000);
    if (timer > 0) {
      timer--;
      io.emit("timer", timer); // Emit the updated timer value to all connected clients
    }
    if (timer === 0) {
      clearTimeout(timerId);
      io.emit("timerEnd"); // Emit the timer end event to all connected clients
    }
  }

  decreaseTimer();
}

main();
