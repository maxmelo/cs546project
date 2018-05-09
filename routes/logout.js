const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/", (req, res) => {
    res.clearCookie("AuthCookie");
    res.render("main/login", {failure: "Successfully logged out."});
})

module.exports = router;