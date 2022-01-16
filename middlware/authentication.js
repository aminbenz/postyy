const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Authorization invalid" });
   }
   const token = authHeader.split(" ")[1];
   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: payload.userId };

      next();
   } catch (error) {
      res.status(500).json({ msg: error });
   }
};
module.exports = auth;
