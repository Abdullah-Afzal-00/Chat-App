var router = require("express").Router();

router.use("/user", require("./user"));
router.use("/chat", require("./chat"));
//router.use("/floor", require("./floor"));
//router.use("/booking", require("./booking"));

module.exports = router;
