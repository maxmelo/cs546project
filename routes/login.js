const express = require("express");
const router = express.Router();
const users = require("../data/users");
const bcrypt = require("bcrypt");
const saltRounds = 16;


async function authenticate(username, password) {
    console.log("Entered authenticate function. Username: ", username);
    try {
        const validation = await users.validatePassword(username, password);
    } catch (e) {
        console.log(e);
        throw "Validation error.";
    }

    if (validation) {
        return true;
    } else {
        return false;
    }
}



router.get("/", (req, res) => {
    if (req.cookies.AuthCookie) {
        res.redirect("/userpage");
    } else {
        res.render("main/login", {});
    }
});



router.post("/", async (req, res) => {
    let authenticated = false;
    const username = req.body['login-username'];
    const password = req.body['login-password'];

    try {
        authenticated = await users.validatePassword(username, password);
    } catch(e) {
        console.log(e);
    }    
    if (authenticated) {
        let userInfo;
        try {
            userInfo = await users.getUserByUsername(username);
        } catch (e) {
            console.log(e);
        }
        delete userInfo.hashedPassword;
        res.cookie("AuthCookie", userInfo);
        res.redirect("/userpage");
    } else {
        res.render("main/login", {failureText: "Invalid username/password provided."})
    }
})


module.exports = router;