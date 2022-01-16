const router = require("express").Router();

const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePosts,
  getUserPosts,
  commentPost,
  removeComment,
  savePost,
} = require("../controllers/posts");

router.route("/").post(createPost);
router.route("/:id").patch(updatePost).delete(deletePost);
router.route("/:id/like").put(likePost);
router.route("/profile/:username").get(getUserPosts);
router.route("/timeline/:userId").get(getTimelinePosts);
router.route("/:postId/commentPost").post(commentPost);
router.route("/:postId/comments/:commentId/deleteComment").patch(removeComment);
router.route("/:postId/save").post(savePost);

module.exports = router;
