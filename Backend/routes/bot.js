const express = require("express");
const { askAI } = require("../ai/groq");
const axios = require("axios");


const botRouter = express.Router();

botRouter.post("/", async (req, res) => {
  try {
    
     const { message } = req.body;
  if(!message){
    return res.status(400).json({ error: "Message is required" });
  }

  const aiReply = await askAI(message);

  res.json({ reply: aiReply });
  } catch (error) {
     console.log("could not chat with both",error);
    res.status(500).json({ error: "Something went wrong" })
  }
});

module.exports = botRouter;





