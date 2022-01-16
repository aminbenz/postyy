const User = require("../models/User");

// Register User
const register = async (req, res) => {
   const { firstName, lastName, email, password } = req.body;
   try {
      if (!firstName || !lastName || !email || !password)
         return res
            .status(400)
            .json({ msg: "Please Provide name, Email password" });

      const isUserExist = await User.findOne({ email });
      isUserExist &&
         res.status(404).json({ msg: "User already Exist" });
      req.body.username = `${firstName}${lastName}`;
      req.body.displayName = `${firstName} ${lastName}`;
      const user = await User.create(req.body);
      const token = user.createJWT();

      res.status(201).json({ user, token });
   } catch (error) {
      console.log("error", error);
   }
};
// Login User
const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      // if email or password not existing
      if (!email || !password)
         return res
            .status(400)
            .json({ msg: "Please Provide email and password" });

      const user = await User.findOne({ email });

      // if user not exist
      if (!user)
         return res.status(401).json({ msg: "User Not Found" });

      // compare password
      const isCorrectPassword = await user.comparePassword(password);

      // if password wrong
      !isCorrectPassword &&
         res.status(400).json({ msg: "Email or password wrong" });

      // success create token =>
      const token = user.createJWT();

      res.status(201).json({ user, token });
   } catch (error) {
      console.log("error ", error);
   }
};

// hard code follow admin when user create account
const follow = async (req, res) => {
   const { userId, otherUserId } = req.body;
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
                  msg: `User has been followed ${otherUser.displayName}`,
               });
            } else {
               res.status(200).json({
                  msg: `u already follow ${otherUser.displayName}`,
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

module.exports = {
   register,
   login,
   follow,
};
