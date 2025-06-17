const express = require("express");

const router = express.Router({ mergeParams: true }); // mergeParams is needed to pass in parameters from a subrouter.
const convoController = require("../controllers/conversationController");
const authController = require("../controllers/authController");
const messageRouter = require("./messageRoutes");
const userConvoRouter = require("./userConversationRoutes");

router.use("/:convoId/message", messageRouter);
router.use(authController.protect);

router.use("/userConvo", userConvoRouter);

router
  .route("/member/:convoId")
  .post(convoController.addMember)
  .delete(convoController.removeMember);

router.post("/add-many/:convoId", convoController.addMultipleMembers);

router
  .route("/")
  .get(convoController.getAllConversation)
  .post(convoController.createConversation);

router
  .route("/:id")
  .get(convoController.getConversation)
  .patch(convoController.updateConversation)
  .delete(convoController.deleteConversation);

router.get("/find-convo-with-user/:userId", convoController.checkConvoExists);

router.route("/");
module.exports = router;
