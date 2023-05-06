const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

async function main() {
  io.on("connect", (socket) => {
    console.log("user connected", socket.id);

    socket.on("keys", (keys) => {
      // do something with keys object
      console.log(keys);
    });
  });

  app.use(express.static("public"));

  httpServer.listen(3000);
}

main();
