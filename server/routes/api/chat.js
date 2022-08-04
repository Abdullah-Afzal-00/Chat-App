const router = require("express").Router();
const User = require("../../models/User");
const Message = require("../../models/Message");
const auth = require("../../middleware/auth");

const httpResponse = require("express-http-response");

router.post("/send", auth.isToken, async (req, res, next) => {
  const { message, recieverEmail } = req.body;

  const reciever = await User.findOne({ email: recieverEmail });
  if (!reciever) return res.status(404).send("No such reciever is Found");

  let data = new Message({
    Sender: req.user.user_id,
    Reciever: reciever._id,
    message: message,
  });
  data
    .save()
    .then(() => {
      return next(new httpResponse.OkResponse("sent!"));
    })
    .catch((err) => {
      return next(new httpResponse.BadRequestResponse(err));
    });
});

router.get("/recieve/:senderEmail", auth.isToken, async (req, res, next) => {
  //console.log(req.user.user_id);
  const sender = await User.findOne({ email: req.params.senderEmail });
  console.log(sender._id);
  const messages = await Message.find({
    Reciever: req.user.user_id,
    Sender: sender._id,
  });
  if (!messages) res.status(500).send("Some Error Happened");
  if (messages.length === 0) res.send("No Message Found");
  res.send(messages);
});

module.exports = router;
