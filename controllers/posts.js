const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const newPost = new Post(req.body);
  try {
    const post = await newPost.save();
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updatePost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ msg: `No post with this id ${postId}` });
    if (post.userId === req.body.userId) {
      // if new values empty
      if (!req.body.caption && !req.body.images)
        return res
          .status(401)
          .json({ msg: "you can update post with empty value" });
      const updatePost = await Post.findByIdAndUpdate(postId, req.body, {
        new: true,
      });
      res.status(200).json({
        msg: "Post has been Successful",
        post: updatePost,
      });
    } else {
      res.status(403).json({
        msg: "you can update only your posts",
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const deletePost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({ msg: "post deleted success" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const likePost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const postId = req.params.id;
  const userId = req.body.userId;
  try {
    const post = await Post.findById(postId);
    //    if(!post) return  res.status(404).json({ `No post with this id ${postId}`})
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json({ msg: "post has been liked", post });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json({
        msg: "post has been disliked",
        post,
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const commentPost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post)
      return res.status(401).json({ msg: "Somthing Wrong Post Not Found" });
    post.comments.push(req.body);

    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });

    res.status(200).json({ updatedPost });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// remove Comment from post
const removeComment = async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const post = await Post.findById(postId);
    // if(!post){
    //    return res.status(404).json({ `No post with this id ${postId}`})
    // }
    await post.updateOne({
      $pull: {
        comments: { _id: commentId },
      },
    });
    res.status(200).json({
      msg: "post has been disliked",
      post,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// get timeline posts
const getTimelinePosts = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const userId = req.params.userId;
  try {
    const currentUser = await User.findById(userId);
    const userPosts = await Post.find({ createdBy: userId }).sort("-createdAt");

    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ createdBy: friendId }).sort("-createdAt");
      })
    );

    // get timeline with cuurent user
    // res.status(200).json({
    //    posts: userPosts.concat(...friendPosts),
    // });
    // get timeline "without" cuurent user
    const arr = [];
    res.status(200).json({
      posts: arr.concat(...friendPosts),
    });
  } catch (error) {
    // res.status(500).json({ msg: error });
  }
};
// get users all posts
const getUserPosts = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const username = req.params.username;
  try {
    const user = await User.findOne({ username });
    const posts = await Post.find({ createdBy: user._id }).sort("-createdAt");

    res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const savePost = (req, res) => {
  res.send("save post");
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePosts,
  getUserPosts,
  commentPost,
  removeComment,
  savePost,
};
