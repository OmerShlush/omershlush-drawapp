// INIT EXPRESS & MONGOOSE
const express = require("express");
const mongoose = require("mongoose");
const fs = require('fs').promises;

// SETTING DRAW ROUTES
const drawRoutes = require("./routes/draws");

const http = require("http");
const app = express();

// bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// HIGH SCORE MODEL
const HighScore = require("./models/HighScore");


// SETTINGS SERVER WITH SOCKET IO
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["application/xml", "application/json"],
  },
});

// SETTING HEADERS FOR EVERY PATH
app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); 
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  next();
});

// SETTING /API ROUTES
app.use("/api", drawRoutes);

// DEFAULT 404 PAGE
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found.');
});

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

// SERVER LISTEN && MONGODB ATLAS CONNECT
mongoose
  .connect(
    `mongodb+srv://USERNAME:PASSWORD@omerdevs.gr7hs.mongodb.net/drawdb?retryWrites=true&w=majority`
  )
  .then(() => {
    server.listen(3001);


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
      };

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

      socket.on('getDiff', () => io.emit('setDiff', diff));

      socket.on("updateWord", async (data) => {
        word = await data;
        io.emit("wordUpdated", await data)
      });

      socket.on("getWord", () => io.emit("wordUpdated", word));

      socket.on("updateCanvas", async (data) => {
        canvas = await data;
        const buf = Buffer.from(canvas, "base64");
        await fs.writeFile("images/lastcanvas.png", buf);
      });

      socket.on("drawSent", () => io.emit("drawSent", whoIsPlaying));

      socket.on("changePlayer", () => {
        if (whoIsPlaying === PlayerA) {
          whoIsPlaying = PlayerB;
        } else {
          whoIsPlaying = PlayerA;
        }
      });

      socket.on("whoIsPlaying", () => io.emit("whoIsPlaying", whoIsPlaying));

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
