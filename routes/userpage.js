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

        var temp = {};

        temp.FileHistory = history;
        temp.hasauth

        temp["hasAuth"] = req.cookies.AuthCookie !== undefined;
        temp["authName"] = authName;

        res.render("main/userpage", temp);
    } else {
        res.redirect("/login");
        res.render("main/login", {
            hasAuth: req.cookies.AuthCookie !== undefined,
            authName: authName
        });
    }
})

module.exports = router;