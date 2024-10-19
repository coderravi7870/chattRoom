const User = require("../model/userModel");
const Message = require("../model/chatModel");
const bcrypt = require("bcrypt");
const app_constants = require("../constants/app.json");




exports.deleteMessage = async (data) => {
    
    const message_data = await Message.findById(data?.id);
    if (!message_data) {
        return {
          success: 0,
          status: app_constants.NOT_FOUND,
          message: "Message not found",
          result: {},
        };
      }
  
      await Message.findByIdAndDelete(data?.id);

      return {
        success: 1,
        status: app_constants.SUCCESS,
        message: "Message deleted successfully",
      };
};