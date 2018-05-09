const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/", (req, res) => {
    let authName = "";
    if (req.cookies.AuthCookie !== undefined) authName = req.cookies.AuthCookie.username;

    if (req.cookies.AuthCookie) {
        const userInfo = req.cookies.AuthCookie;
        
        userInfo["hasAuth"] = req.cookies.AuthCookie !== undefined;
        userInfo["authName"] = authName;

        res.render("main/userpage", userInfo)
    } else {
        res.redirect("/login");
        res.render("main/login", {
            hasAuth: req.cookies.AuthCookie !== undefined,
            authName: authName
        });
    }
})

module.exports = router;