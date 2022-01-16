const router = require("express").Router();

const {
   getUsersBySearch,
   getUser,
   updateUser,
   deleteUser,
   followUser,
   unfollowUser,
   getUserFriends,
   getUserFollowers,
   getUserFollowing,
} = require("../controllers/users");

const authentication = require("../middlware/authentication");

router.route("/").get(getUser);
router.route("/search").get(getUsersBySearch);
router
   .route("/:id")
   .patch(authentication, updateUser)
   .delete(deleteUser);
router.route("/friends/:id").get(getUserFriends);
router.route("/:id/follow").put(followUser);
router.route("/:id/unfollow").put(unfollowUser);
router.route("/followers/:id").get(getUserFollowers);
router.route("/following/:id").get(getUserFollowing);

module.exports = router;
