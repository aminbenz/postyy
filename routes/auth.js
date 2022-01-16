const router = require("express").Router();

const { register, login, follow } = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);

// hard code
router.route("/follow").put(follow);

module.exports = router;
