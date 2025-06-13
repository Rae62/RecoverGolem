const router = require("express").Router();

// const apiUsers = require("./user.route");
const apiAuth = require("./auth.route");

// router.use("/user", apiUsers);
router.use("/auth", apiAuth);

module.exports = router;
