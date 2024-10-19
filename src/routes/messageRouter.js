const express = require("express");
const messageRoute = express.Router();



const messageController = require("../controllers/messageController");
const middleware = require("../middlewares/authMiddleware");

messageRoute.delete("/delete/:id", messageController.deleteMessage);


module.exports = messageRoute;