const Popup = require("../models/Popup");

exports.createPopup = async (req, res) => {
  try {
    const { name, email, phoneNumber, college, batch } = req.body;

    if (!name || !email || !phoneNumber || !college || !batch) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const popupData = await Popup.create({
      name,
      email,
      phoneNumber,
      college,
      batch,
    });

    return res.status(200).json({
      success: true,
      data: popupData,
      message: "Popup data created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating popup data",
    });
  }
};