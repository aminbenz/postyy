const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
   createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide User"],
   },
   body: { type: String, required: true },
   username: { type: String },
   images: String,
   videosUrl: String,
   createdAt: {
      type: Date,
      required: true,
      default: () => Date.now(),
   },
});

const PostSchema = new mongoose.Schema(
   {
      createdBy: {
         type: mongoose.Types.ObjectId,
         ref: "User",
         required: [true, "Please provide user"],
      },
      caption: {
         type: String,
         max: 500,
      },
      tags: {
         type: [String],
         max: 5,
      },
      images: {
         type: [Object],
      },
      Videos: {
         type: [Object],   
      },
      likes: {
         type: [String],
         default: [],
      },
      saves: {
         type: [String],
         default: [],
      },
      comments: [CommentSchema],
   },
   { timestamps: true }
);

module.exports = mongoose.model("Posts", PostSchema);
