const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/", (req, res) => {
    if (req.cookies.AuthCookie) {
        const userInfo = req.cookies.AuthCookie;
        console.log(userInfo);
        res.render("main/userpage", userInfo)
    } else {
        res.redirect("/login");
        res.render("main/login", {});
    }
})

module.exports = router;