const router = require("express").Router();

const {
   createConversation,
   getConversation,
} = require("../controllers/conversation");

router
   .route("/:userId")
   .post(createConversation)
   .get(getConversation);

module.exports = router;
