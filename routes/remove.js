
const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/:id", (req, res) => {
    users.removeComparisonHistory(req.params.id);
    res.redirect("/");
});


router.get("/:id/:cId", (req, res) => {
    users.removeComparison(req.params.id, req.params.cId);
    res.redirect("/userpage");
});

router.delete("/:id", (req, res) => {
    users.removeComparisonHistory(id);
    res.redirect("/userpage");
});


router.delete("/:id/:cId", (req, res) => {
    users.removeComparison(id, cID);
    res.redirect("/userpage");
});

module.exports = router;