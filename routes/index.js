const mainRoutes = require("./main");
const loginRoutes = require('./login');
const logoutRoutes = require('./logout');
const newaccountRoutes = require('./newaccount');
const userpageRoutes = require('./userpage');
const path = require("path");

const constructorMethod = app => {
    app.use("/", mainRoutes);
    app.use("/login", loginRoutes);
    app.use("/logout", logoutRoutes);
    app.use("/newaccount", newaccountRoutes);
    app.use("/userpage", userpageRoutes);

    app.use("*", (req, res) => { res.redirect("/"); });

    // app.use("/", (req, res) => {
    //     console.log(req.cookies);
    //     if (req.cookies.AuthCookie) {
    //         console.log("AUTHCOOKIE FOUND!");
    //         res.redirect("/private");
    //     } else {
    //         console.log("NO AUTHCOOKIE FOUND!");
    //     }
    // })

}

module.exports = constructorMethod;