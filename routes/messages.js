const router = require("express").Router();

const {
   addMessage,
   getMessages,
   removeMessage,
   clearChat,
} = require("../controllers/messages");

router.route("/").post(addMessage);
router.route("/:conversationId").get(getMessages);
router.route("/:messageId/delete").delete(removeMessage);
router.route("/:conversationId/deleteall").delete(clearChat);

module.exports = router;
