const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/", async (req, res) => {
    let authName = "";
    if (req.cookies.AuthCookie !== undefined) authName = req.cookies.AuthCookie.name;

    if (req.cookies.AuthCookie) {
        let userInfo = req.cookies.AuthCookie;

        const currUser = await users.getUserById(userInfo._id);
        const history = currUser.FileHistory;

        userInfo.FileHistory = history;

        res.cookie("AuthCookie", userInfo);

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