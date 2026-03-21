const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");




exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("token in auth bhai token he ", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      console.log("decoded token", decoded);
      req.user = decoded;
      // console.log("decoded in auth", decoded);
      // console.log("req.user in auth", req.user);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Access token expired or invalid",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error validating token",
    });
  }
};



//isStudent
exports.isStudent = async (req, res, next) => {
  console.log("req.user in isstudent middleware", req.user)
  try {
    if (req.user.accountType !== "Student") {
      // console.log("req.user in isstudent middleware", req.user.accountType)
      return res.status(401).json({
        success: false,
        message: 'This is a protected route for Students only',
      });
    }
    next();
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User role cannot be verified, please try again'
    })
  }
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    console.log("req.user in isAdmin middleware", req.user)
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: 'This is a protected route for Admin only',
      });
    }
    //  console.log("req.user in isAdmin middleware", req.user)
    next();
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User role cannot be verified, please try again'
    })
  }
}


//isEmployee
exports.isEmployee = async (req, res, next) => {
  try {
    console.log("req.user in isEmployee middleware", req.user)
    if (req.user.accountType !== "Employee") {
      return res.status(401).json({
        success: false,
        message: 'This is a protected route for Employee only',
      });
    }
    next();
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User role cannot be verified, please try again'
    })
  }
}


//isManager
exports.isManager = async (req, res, next) => {
  try {
    console.log("req.user in isManager middleware", req.user)
    if (req.user.accountType !== "Manager") {
      return res.status(401).json({
        success: false,
        message: 'This is a protected route for Manager only',
      });
    }
    next();
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User role cannot be verified, please try again'
    })
  }
}


//isSuperAdmin
exports.isSuperAdmin = async (req, res, next) => {
  try {
    console.log("req.user in isSuperAdmin middleware", req.user)
    if (req.user.accountType !== "Super Admin") {
      return res.status(401).json({
        success: false,
        message: 'This is a protected route for Super Admin only',
      });
    }
    next();
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User role cannot be verified, please try again'
    })
  }
}