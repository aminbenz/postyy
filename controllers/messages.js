const Message = require("../models/Message");

// new Conversation
const addMessage = async (req, res) => {
   const newMessage = new Message(req.body);
   try {
      const saveMessage = await newMessage.save();
      res.status(201).json({ message: saveMessage });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
   // res.send(newMessage);
};

// get Conversation of user
const getMessages = async (req, res) => {
   const { conversationId } = req.params;
   try {
      const messages = await Message.find({
         conversationId: conversationId,
      });
      res.status(200).json({ messages });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

const removeMessage = async (req, res) => {
   req.body.userId = req.user.userId;
   const { messageId } = req.params;
   try {
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
         return res
            .status(401)
            .json({ msg: "message Not Found To Delete" });
      }
      res.status(200).json({ msg: "message deleted successfully" });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

const clearChat = async (req, res) => {
   const { conversationId } = req.params;
   try {
      const messages = await Message.deleteMany({
         conversationId,
      });
      res.status(200).json({ msg: "clear chat successful." });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

// 61bfb623d76b91f168eced15

module.exports = {
   addMessage,
   getMessages,
   removeMessage,
   clearChat,
};
