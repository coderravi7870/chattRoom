const userServices = require("../services/userServices");
const validationHelper = require("../halper/validation");
const app_constants = require("../constants/app.json");

exports.userSignUp = async (req, res) => {
  try {
    const required_fields = ["username", "email", "password"];

    const validation = validationHelper.validation(required_fields, req.body);
    if (Object.keys(validation).length) {
      return res.json({
        success: 0,
        status_code: app_constants.BAD_REQUEST,
        message: validation,
      });
    }
    const valid_username = await validationHelper.validUser(req.body.username);
    if (!valid_username) {
      return res.json({
        success: 0,
        status_code: app_constants.BAD_REQUEST,
        message: "username Should not contain number",
        result: {},
      });
    }
    const valid_email = await validationHelper.validEmail(req.body.email);

    if (!valid_email) {
      return res.json({
        success: 0,
        status_code: app_constants.BAD_REQUEST,
        message: "Invalid email!",
        result: {},
      });
    }

    const add_user = await userServices.userSignUp(req.body);
    return res.json(add_user);
  } catch (err) {
    return res.json({
      success: 0,
      status_code: app_constants.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};


exports.userLogIn = async (req, res) => {
  try {
    const required_fields = ["email", "password"];
    const validation = validationHelper.validation(required_fields, req.body);
    if (Object.keys(validation).length) {
      return res.json({
        success: 0,
        status_code: app_constants.BAD_REQUEST,
        message: validation,
      });
    }

    const valid_username = await validationHelper.validUser(req.body.username);
    if (!valid_username) {
      return res.json({
        success: 0,
        status_code: app_constants.BAD_REQUEST,
        message: "username Should not contain number",
        result: {},
      });
    }
    const valid_email = await validationHelper.validEmail(req.body.email);
    if (!valid_email) {
      return res.json({
        success: 0,
        status_code: app_constants.BAD_REQUEST,
        message: "Invalid email!",
        result: {},
      });
    }

    const login_user = await userServices.userLogIn(req.body,res);
    return res.json(login_user);
  } catch (err) {
    return res.json({
      success: 0,
      status_code: app_constants.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

exports.updateAvatar = async (req, res) => {
    try {
      const login_user = await userServices.updateAvatar(req);
      return res.json(login_user);
    } catch (err) {
      return res.json({
        success: 0,
        status_code: app_constants.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
};

exports.getUser = async (req, res) => {
  try {
    const login_user = await userServices.getUser(req.user);
    return res.json(login_user);
  } catch (err) {
    return res.json({
      success: 0,
      status_code: app_constants.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const unfollow_user = await userServices.logoutUser(req,res);
    return res.json(unfollow_user);
  } catch (err) {
    return res.json({
      success: 0,
      status_code: app_constants.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};