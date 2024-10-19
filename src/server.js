const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const socketIO = require("socket.io");
const connectinDatabase = require("./halper/db");
const ChatMessage = require("./model/chatModel");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://sparkling-sunflower-b052d2.netlify.app",
    credentials: true,
  })
);

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow CORS
  },
});

// data base
connectinDatabase();

// Handle socket connections
io.on("connection", (socket) => {
  // Send chat history to the new user when they connect
  ChatMessage.find()
    .sort({ timestamp: 1 }) // Sort by oldest message first
    .limit(100) // Limit to 100 messages
    .then((messages) => {
      socket.emit("chatHistory", messages); // Emit history to the new client
    })
    .catch((err) => {
      console.log("Error fetching chat history: ", err);
    });

  // When a new message is received
  socket.on("chat", (payload) => {
    const newMessage = new ChatMessage(payload);

    // Save the new message to the database
    newMessage
      .save()
      .then(() => {
        io.emit("chat", payload);
      })
      .catch((err) => {
        console.log("Error saving message: ", err);
      });
  });

  
});

const userRoute = require("./routes/userRouter");
const messageRoute = require("./routes/messageRouter");

app.use("/user", userRoute);
app.use("/message", messageRoute);
// Start server and listen on port 5000
server.listen(process.env.PORT, async () => {
  try {
    console.log(`Running on server ${process.env.PORT}`);
  } catch (ex) {
    console.log(ex);
  }
});
