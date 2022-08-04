const router = require("express").Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const httpResponse = require("express-http-response");

router.post("/signup", async (req, res, next) => {
  const pass = req.body.password;
  delete req.body.password;
  let data = new User(req.body);
  data.setPassword(pass);
  data
    .save()
    .then(() => {
      next(new httpResponse.OkResponse("success!"));
    })
    .catch((err) => {
      next(new httpResponse.BadRequestResponse(err));
    });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && user.validPassword(password, user.password)) {
      console.log(user.toJSON());
      res.status(200).send(user.toAuthJSON());
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

//---------Getting a user--------------//
router.get("/getUser", auth.isToken, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    //console.log(user);
    res.status(200).send(user.toAuthJSON());
  } catch {
    res.status(400).send("Something Went Wrong");
  }
});

//-----------Updating User--------//

router.put("/updateUser", auth.isToken, auth.isUser, async (req, res, next) => {
  try {
    const name = req.body.name;
    if (!name) {
      //res.status(400).send("All input is required");
      return next(new httpResponse.BadRequestResponse("All input is required"));
    }
    console.log(req.user.email);
    const oldUser = await User.findOne({ email: req.user.email });
    //console.log(oldUser);

    if (oldUser) {
      oldUser.name = name;
      oldUser.save().then(() => res.status(200).send(oldUser));
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (err) {
    console.log(err);
  }
});

//-----------update Password-------------//
router.post("/changePassword", auth.isToken, async function (req, res) {
  try {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    if (!(oldPassword && newPassword)) {
      res.status(404).send("All input fields are required!");
    }
    const olduser = await User.findOne({ email: req.user.email });
    if (olduser) {
      if (olduser.validPassword(oldPassword)) {
        olduser.setPassword(newPassword);
        olduser.save();
        res.send(olduser);
      } else {
        res
          .status(403)
          .send("password dosen't match! Please enter correct password!");
      }
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (err) {
    console.log(err);
  }
});

//-----------------Search User---------------//
router.get(
  "/searchUser/:username",
  auth.isToken,
  auth.isUser,
  async (req, res, next) => {
    try {
      if (req.user.username === req.params.username)
        return next(new httpResponse.OkResponse("It's Your own ID"));
      const user = await User.findOne({ username: req.params.username });
      if (!user)
        return next(new httpResponse.BadRequestResponse("No user Found"));
      next(new httpResponse.OkResponse(user.toJSONFor(req.user)));
    } catch (err) {
      return next(new httpResponse.BadRequestResponse(err));
    }
  }
);

//------------Add Friend---------------//
router.post(
  "/addFriend/:email",
  auth.isToken,
  auth.isUser,
  async (req, res, next) => {
    try {
      //console.log(req.params.email);
      const friend = await User.findOne({ email: req.params.email });
      // console.log(friend);
      const user = await User.findOne({ email: req.user.email });
      user.friendList.push(friend._id);
      friend.friendList.push(req.user._id);
      //console.log(req.user._id);
      user
        .save()
        .then((res) => {
          return next(new httpResponse.OkResponse("success"));
        })
        .catch((err) => {
          return next(new httpResponse.BadRequestResponse(err));
        });
      //console.log(user.friendList);
      friend
        .save()
        .then((res) => {
          return next(new httpResponse.OkResponse("success"));
        })
        .catch((err) => {
          return next(new httpResponse.BadRequestResponse(err));
        });

      return next(new httpResponse.OkResponse("success!"));
    } catch (err) {
      return next(new httpResponse.BadRequestResponse(err));
    }
  }
);

//--------------Show Friends------------//
router.get("/show/friends", auth.isToken, async (req, res, next) => {
  try {
    User.findOne({ email: req.user.email })
      .populate("friendList")
      .exec((err, data) => {
        if (!err && data) {
          res.send(data);
        } else {
          next(new httpResponse.BadRequestResponse(err));
          // res.send("No Friend found!");
        }
      });
  } catch (err) {
    next(new httpResponse.BadRequestResponse(err));
  }
});

//----------Delete User----------------//
router.delete(
  "/deleteUser/:id",
  auth.isToken,
  auth.isAdmin,
  async (req, res) => {
    try {
      const olduser = await User.findOne({ email: req.params.id });
      if (olduser) {
        olduser.remove();
        res.send("User deleted successfully!");
      } else {
        res.status(404).send("User not found!");
      }
    } catch (err) {
      console.log(err);
    }
  }
);
//----------View All Users----------------// -->For Admin
router.get("/allUsers", auth.isToken, auth.isAdmin, async (req, res) => {
  try {
    const list = await User.find();
    res.status(200).send(list);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
