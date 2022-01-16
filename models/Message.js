const mongoose = require("mongoose");

const BodySchema = new mongoose.Schema({
   body: {
      text: {
         type: String,
      },
      files: {
         type: [String],
      },
   },
   reaction: {
      body: {
         type: String,
      },
      reactOwner: {
         type: String,
      },
   },
});

const MessageSchema = new mongoose.Schema(
   {
      conversationId: {
         type: String,
      },
      sender: {
         type: String,
      },
      text: {
         type: String,
      },
      body: BodySchema,
   },
   { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
