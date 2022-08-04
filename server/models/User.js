const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
//const mongoosePaginate = require("mongoose-paginate-v2");

//require("dotenv").config();
//const saltRounds = parseInt(process.env.SALT_ROUNDS);

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: null, required: true },
    lastName: { type: String, default: null, required: true },
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
    },
    hash: { type: String },
    salt: { type: String },
    friendList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamp: true }
);
UserSchema.plugin(uniqueValidator, { message: "is already taken." });
//UserSchema.plugin(mongoosePaginate);

UserSchema.methods.validPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  console.log(this.salt);
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};
UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    { user_id: this._id, email: this.email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "72h",
    }
  );
};

UserSchema.methods.toJSON = function () {
  return {
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    friendList: this.friendList,
  };
};

UserSchema.methods.toAuthJSON = function () {
  return {
    token: this.generateJWT(),
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    friendList: this.friendList,
    role: this.role,
  };
};

UserSchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    friendList: this.friendList,
    isFriend: user.friendList.find((u) => this._id.toString() === u.toString())
      ? true
      : false,
  };
};
module.exports = mongoose.model("User", UserSchema);
