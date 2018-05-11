const express = require("express");
const router = express.Router();
const users = require("../data/users");
const compare = require("../func/compare");
const xss = require("xss");

router.get("/", (req, res) => {
    let authName = "";
    if (req.cookies.AuthCookie !== undefined) authName = req.cookies.AuthCookie.name;

    res.render("main/index", {
        hasAuth: req.cookies.AuthCookie !== undefined,
        authName: authName
    });
});

router.get("/error", (req, res) => {
    res.status(400).send("Missing field");
    res.redirect("/");
});

router.post("/results", async (req, res) => {
    console.log("results post");
    let authName = "";
    if (req.cookies.AuthCookie !== undefined) authName = req.cookies.AuthCookie.name;

    const json = xss(req.body);
    const file1name = xss(req.body.file1name);
    const file2name = xss(req.body.file2name);
    const file1 = xss(req.body.file1text);
    const file2 = xss(req.body.file2text);

    if (
        !(file1name.length > 0) 
        || !(file2name.length > 0)
        || !(file1.length > 0) 
        || !(file2.length > 0)) {
            res.render("main/index", {failureText: "Please make sure you have provided text in all 4 boxes above."});
            return;
    }    

    const metricSimilarity = Math.round(compare.getSimilarity(file1, file2) * 10000) / 100;
    const metricSharedWords = compare.getNumCommonWords(file1, file2);
    const metricTotalWords = Math.max(compare.countWords(file1), compare.countWords(file2));
    const metricSharedChars = compare.getNumCommonChars(file1, file2);
    const metricTotalChars = Math.max(compare.countChars(file1), compare.countChars(file2));


    let userInfo = req.cookies.AuthCookie;
    const similarity = {
        similarityPercent: metricSimilarity,
        sharedWords: metricSharedWords,
        sharedChars: metricSharedChars,
        totalWords: metricTotalWords,
        totalChars: metricTotalChars
    }


    try {
        await users.updateUserHistory(userInfo._id, file1name, file2name, similarity);
        console.log("Update successful.");
    } catch (e) {
        console.log(e);
    }

    //Sample values, fill these in with the result of comparison
    res.render("partials/results", { 
        layout: null,
        hasAuth: req.cookies.AuthCookie !== undefined,
        authName: authName,
        similarity: metricSimilarity,
        sharedWords: metricSharedWords,
        totalWords: metricTotalWords,
        sharedChars: metricSharedChars,
        totalChars: metricTotalChars,
        successText: "Comparison successful! Results have been saved and appear above."
    });
});


module.exports = router;