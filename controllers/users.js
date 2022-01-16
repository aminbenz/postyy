const User = require("../models/User");
const bcrypt = require("bcrypt");
const { findById } = require("../models/User");

// get users
const getUsersBySearch = async (req, res) => {
   const { username, sort, fields } = req.query;
   const queryObj = {};
   try {
      if (username) {
         queryObj.username = { $regex: username, $options: "i" };
      }

      let result = User.find(queryObj);

      if (sort) {
         const sortList = sort.split(",").join(" ");
         result = result.sort(sortList);
      }

      if (fields) {
         const fieldsList = fields.split(",").join(" ");
         result = result.select(fieldsList);
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      result = result.skip(skip).limit(limit);

      const users = await result;
      res.status(200).json({ users, nbHits: users.length });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

// get user
const getUser = async (req, res) => {
   const { userId, username, fields } = req.query;
   try {
      const user = userId
         ? await User.findById(userId)
         : await User.findOne({ username });

      const { email, password, updateAt, ...other } = user._doc;

      res.status(200).json({ user: other });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

// update user
const updateUser = async (req, res) => {
   req.body.userId = req.user.userId;
   const { userId, password } = req.body;
   const id = req.params.id;
   // const { isAdmin } = req.user;

   if (id === userId) {
      // if user try to update password
      if (password) {
         try {
            const salt = await bcrypt.genSalt(10);

            req.body.password = await bcrypt.hash(
               req.body.password,
               salt
            );
         } catch (error) {
            res.status(400).json({ msg: error });
         }
      }
      // update user
      try {
         const user = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
         });

         res.status(200).json({
            user,
            msg: "account has been updated",
            user,
         });
      } catch (error) {
         res.status(400).json({ msg: error });
      }
   } else {
      return res
         .status(403)
         .json({ msg: "You can't update only youserur account" });
   }
};
// delete user
const deleteUser = async (req, res) => {
   try {
      await User.findByIdAndDelete(req.user.userId);
      res.status(200).json({ msg: "user delete success" });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

// Follow User
const followUser = async (req, res) => {
   const { userId } = req.user;
   const otherUserId = req.params.id;
   if (userId !== otherUserId) {
      try {
         // get currentUser and the other user "to follow"
         const currentUser = await User.findById(userId);
         const otherUser = await User.findById(otherUserId);
         // if currentUser & user exist "do FOLLOW"
         if (otherUser && currentUser) {
            if (!otherUser.followers.includes(userId)) {
               await otherUser.updateOne({
                  $push: { followers: userId },
               });
               await currentUser.updateOne({
                  $push: { followings: otherUserId },
               });
               res.status(200).json({
                  msg: `User has been followed ${otherUser.username}`,
               });
            } else {
               res.status(200).json({
                  msg: `u already follow ${otherUser.username}`,
               });
            }
         } else {
            res.status(400).json({
               msg: "Something wrong in user to follow",
            });
         }
      } catch (error) {
         res.status(500).json({ msg: error });
      }
   } else {
      res.status(400).json({ msg: "u can't follow your self" });
   }
};

// Unfollow User
const unfollowUser = async (req, res) => {
   const { userId } = req.user;
   const otherUserId = req.params.id;

   if (userId !== otherUserId) {
      try {
         // get current user and the other user to follow
         const currentUser = await User.findById(userId);
         const otherUser = await User.findById(otherUserId);
         // if current user and user to follow exist
         if (otherUser && currentUser) {
            if (otherUser.followers.includes(userId)) {
               await otherUser.updateOne({
                  $pull: { followers: userId },
               });
               await currentUser.updateOne({
                  $pull: { followings: otherUserId },
               });
               res.status(200).json({
                  msg: `User has been unfollow ${otherUser.displayName}`,
               });
            } else {
               res.status(200).json({
                  msg: `u already unfollow ${otherUser.displayName}`,
               });
            }
         } else {
            res.status(400).json({
               msg: "some thing wrong in user to follow maybe other user not found",
            });
         }
      } catch (error) {
         res.status(500).json({ msg: error });
      }
   } else {
      res.status(400).json({ msg: "U cant unFollow your self" });
   }
};

const getUserFriends = async (req, res) => {
   const userId = req.params.id;
   try {
      // get current user
      let user = await User.findById(userId);
      // get user friends
      const friends = await Promise.all(
         user.followings.map((friendId) => {
            return User.findById(friendId);
         })
      );

      // map and distacture image and name & send user friend
      const friendsList = [];
      friends.map(({ _id, displayName, profilePicture  ,username}) => {
         friendsList.push({ _id, displayName, profilePicture ,username});
      });
      res.status(200).json(friendsList);
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

const getUserFollowers = async (req, res) => {
   const userId = req.params.id;
   try {
      const user = await User.findById(userId);
      if (!user)
         return res
            .status(400)
            .json({ msg: "Somthing Wrong User not Found" });

      // get user followers
      const followers = await Promise.all(
         user.followers.map((friendId) => {
            return User.findById(friendId);
         })
      );

      // map and distacture image and name & send user followers
      const followersList = [];
      followers.map(({ _id, username, profilePicture, about }) => {
         followersList.push({ _id, username, profilePicture, about });
      });

      res.status(200).json({ followers: followersList });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

const getUserFollowing = async (req, res) => {
   const userId = req.params.id;
   try {
      const user = await User.findById(userId);
      if (!user)
         return res
            .status(400)
            .json({ msg: "Somthing Wrong User not Found" });

      // get user followers
      const following = await Promise.all(
         user.followings.map((friendId) => {
            return User.findById(friendId);
         })
      );

      // map and distacture image and name & send user following
      const followingList = [];
      following.map(({ _id, username, profilePicture, about }) => {
         followingList.push({ _id, username, profilePicture, about });
      });

      res.status(200).json({ following: followingList });
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};

module.exports = {
   getUsersBySearch,
   getUser,
   updateUser,
   deleteUser,
   followUser,
   unfollowUser,
   getUserFriends,
   getUserFollowers,
   getUserFollowing,
};
