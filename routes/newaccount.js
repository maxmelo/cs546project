const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/", (req, res) => {
    res.render("main/newaccount", {});
})

router.post("/", async (req, res) => {
    const username = req.body['new-username'];
    const password = req.body['new-password'];
    const passwordConfirm = req.body['new-password-confirm'];
    const bio = req.body['new-bio'];
    const name = req.body['new-name'];

    if (username.length === 0 || username.length === null) {
        res.render("main/newaccount", {failureText: "No username entered. Please try again."});
        return;
    }

    if (password.length === 0 || password === null) {
        res.render("main/newaccount", {failureText: "No password was entered. Please try again."});        
        return;
    }

    if (bio.length === 0 || bio === null) {
        res.render("main/newaccount", {failureText: "Bio password was entered. Please try again."});
        return;
    }

    if (password !== passwordConfirm) {
        res.render("main/newaccount", {failureText: "Your passwords do not match. Please try again."});
        return;
    }

    usernameTaken = await users.getUserByUsernameBool(username);

    if (usernameTaken) {
        res.render("main/newaccount", {failureText: "Username already exists. Please try again."});        
        return;
    }

    else {
        try {
            const newUser = await users.createUser(username, password, name, bio);
            console.log(newUser);
            res.render("main/login", {successText: "Account creation successful! Try logging in."});
            return newUser;
        } catch (e) {
            res.render("main/login", {failureText: "Uh-oh. Something went wrong while creating your account. Please try again."});
            return;
        }
    }
})

module.exports = router;