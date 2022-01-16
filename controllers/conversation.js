const Conversation = require("../models/Conversation");

// new Conversation
const createConversation = async (req, res) => {
   req.body.senderId = req.user.userId;
   const { senderId, reciverId } = req.body;
   const newConversation = new Conversation({
      members: [senderId, reciverId],
   });
   try {
      const savedConversation = await newConversation.save();
      res.status(200).json({ conversation: savedConversation });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

// get Conversation of user
const getConversation = async (req, res) => {
   const { userId } = req.user;
   try {
      const conversations = await Conversation.find({
         members: { $in: [userId] },
      });
      res.status(200).json({ conversations });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

module.exports = { getConversation, createConversation };
