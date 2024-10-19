const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const app_constants = require("../constants/app.json");
const sendEmail = require("../halper/sendEmail");
const sendToken = require("../halper/userToken");
const cloudinary = require("../halper/cloudinary");
const fs = require("fs");


exports.userSignUp = async (data) => {
  const user_data = await User.findOne({ email: data.email });
  if (user_data) {
    return {
      success: 0,
      status: app_constants.BAD_REQUEST,
      message: "Email already exists",
      result: {},
    };
  }
  const salt = await bcrypt.genSalt(10);
  const hash_password = await bcrypt.hash(data.password, salt);

  const add_user = await User.create({ ...data, password: hash_password });
  //to send email

  const subject = "Welcome to Our APP!";
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  </head>
  <body> <h2>Hi ${data.username}</h2> <p>Welcome to our application</p> <p>Thanks for sign up with us.</p> <br> <img src="https://st2.depositphotos.com/3591429/6308/i/950/depositphotos_63081591-stock-photo-hands-holding-word-welcome.jpg" alt="" height="200px" width="250px"> <br> <p>Best Regards,</p> <p>Gramify Tream</p></body></html>`;

  await sendEmail(data.email, subject, html);
  return {
    success: 1,
    status: app_constants.SUCCESS,
    message: "user added successfully",
    result: add_user,
  };
};

exports.userLogIn = async (data, res) => {
  try {
    const { email, password } = data;
    const user_data = await User.findOne({ email });
    if (!user_data) {
      return {
        success: 0,
        status: app_constants.BAD_REQUEST,
        message: "Eamil does not exist",
        result: {},
      };
    }

    const password_check = await bcrypt.compare(password, user_data.password);

    if (!password_check) {
      return {
        success: 0,
        status: app_constants.BAD_REQUEST,
        message: "Invalid credentials",
        result: {},
      };
    }
    sendToken(user_data, res);
  } catch (error) {
    return {
      success: 0,
      status: app_constants.INTERNAL_SERVER_ERROR,
      message: "An error occurred during login",
      result: { error: error.message },
    };
  }
};


exports.updateAvatar = async (req) => {
  
    const userData = req.user;

  
    if (!req.file) {
      return {
        success: 0,
        status: app_constants.BAD_REQUEST,
        message: "Avatar not found!",
        result: {},
      };
    }
  
    if (userData?.profile_pic?.public_id) {
      await cloudinary.uploader.destroy(userData?.profile_pic?.public_id);
    }
  
    const response = await cloudinary.uploader.upload(req.file.path, {
      folder: "Social-Avatar",
    });
  
    userData.profile_pic.public_id = response.public_id;
    userData.profile_pic.url = response.secure_url;
  
    const result = await userData.save();
  
    if (result) {
      fs.unlink(req.file.path, async (err) => {
        if (err) console.error("Error deleting file:", err);
      });
      return {
        success: 1,
        status: app_constants.SUCCESS,
        message: "Avatar successfully uploaded!",
        result: {},
      };
    }
  
    return {
      success: 0,
      status: app_constants.SUCCESS,
      message: "internal server error",
      result: {},
    };
};

exports.getUser = async (data) => {
    if (!data) {
      return {
        success: 0,
        status: app_constants.BAD_REQUEST,
        message: "User not found!",
        result: {},
      };
    }
  
    return {
      success: 1,
      status: app_constants.SUCCESS,
      message: "User found!",
      data,
    };
};

exports.logoutUser = async (req, res) => {
  res.cookie("social_token", null, {
    httpOnly: true,
    expires: new Date(Date.now()), // Setting cookie expiry to current time
  });

  // console.log("User logged out")

  return {
    success: 1,
    status: app_constants.SUCCESS,
    message: "user logout successfully!",
    result: {},
  };
};