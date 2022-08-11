const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    Sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
MessageSchema.methods.toJSONFor = function (userID) {
  return {
    id: this._id,
    Sender: this.Sender,
    Reciever: this.Reciever,
    message: this.message,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isSent: this.Sender.toString() === userID.toString() ? true : false,
  };
};

module.exports = mongoose.model("Message", MessageSchema);
