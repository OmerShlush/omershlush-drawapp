const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const drawRoutes = require("./routes/draws");
const fs = require("fs").promises;

const http = require("http");
const app = express();

const server = http.createServer(app);
const { Server } = require("socket.io");

const HighScore = require("./models/HighScore");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["application/xml", "application/json"],
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.setHeader("Access-Control-Allow-Headers", "content-type"); // If needed
  next();
});

app.use("/api", drawRoutes);

// Base Settings
let users = [];
let whoIsPlaying;
let room;
let score;
let diff;
let canvas;
let word;
let PlayerA;
let PlayerB;

mongoose
  .connect(
    `mongodb+srv://omershlush:Q7mmQPbP7yKXQRe2@omerdevs.gr7hs.mongodb.net/drawdb?retryWrites=true&w=majority`
  )
  .then(() => {
    server.listen(3000);


    io.on("connection", function (socket) {
      if (users.length < 3) {
        const userId = socket.id;
        io.to(userId).emit("getId", socket.id);
        users.push(socket.id);
        if (users[1]) {
          room = users[0];
          socket.join(users[0]);
          io.to(users[0]).emit("startSession", users[0]);
          users.push("");
          io.to(room).emit("whoIsPlaying", whoIsPlaying);
        }
      } else {
        io.to(socket.id).emit("busy");
      }

      socket.on("updateName", (socket) => {
        if (!users[1]) {
          PlayerA = socket;
          whoIsPlaying = socket;
        } else if (users[1] && socket !== PlayerA) {
          PlayerB = socket;
        }
      });

      socket.on("updateScore", () => {
        score = score + diff;
        io.emit('nextGame', whoIsPlaying, diff);
      });

      socket.on("updateDiff", async (data) => {
        if ( data === 'easy') {
          diff = 1;
          io.emit('setDiff', diff);
        } else if ( data === 'medium') {
          diff = 3;
          io.emit('setDiff', diff);
        } else {
          diff = 5;
          io.emit('setDiff', diff);
        };
      });

      socket.on('getDiff', () => {
        io.emit('setDiff', diff);
      });

      socket.on("updateWord", async (data) => {
        word = await data;
        io.emit("wordUpdated", await data);
      });

      socket.on("getWord", () => {
        io.emit("wordUpdated", word);
      });

      socket.on("updateCanvas", async (data) => {
        canvas = await data;
        // const imgUrl = await data.replace(/^data:image\/\w+;base64,/, "");
        const buf = Buffer.from(canvas, "base64");
        await fs.writeFile("images/lastcanvas.png", buf);
      });

      socket.on("drawSent", () => {
        io.emit("drawSent", whoIsPlaying);
      });

      socket.on("changePlayer", () => {
        if (whoIsPlaying === PlayerA) {
          whoIsPlaying = PlayerB;
        } else {
          whoIsPlaying = PlayerA;
        }
      });

      socket.on("whoIsPlaying", () => {
        io.emit("whoIsPlaying", whoIsPlaying);
      });

      socket.on("disconnect", () => {
        if(score > 0) {
          const highScore = new HighScore({
            playerA: PlayerA,
            playerB: PlayerB,
            score: score
          });
          highScore.save();
        }
        if (users[1]) {
          users = [];
          whoIsPlaying = null;
          room = null;
          score = 0;
        }
      });
    });
  });
