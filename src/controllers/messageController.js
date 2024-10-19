const messageServices = require("../services/messageServices.js");
const validationHelper = require("../halper/validation");
const app_constants = require("../constants/app.json");

exports.deleteMessage = async (req, res) => {
  try {
    const add_user = await messageServices.deleteMessage(req.params);
    return res.json(add_user);
  } catch (err) {
    return res.json({
      success: 0,
      status_code: app_constants.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
