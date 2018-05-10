const express = require("express");
const router = express.Router();
const users = require("../data/users");
const compare = require("../func/compare");

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
    let authName = "";
    if (req.cookies.AuthCookie !== undefined) authName = req.cookies.AuthCookie.name;

    const json = req.body;

    if (
        !("file1text" in json && json["file1text"].length > 0) 
        || !("file2text" in json && json["file2text"].length > 0)
        || !("filename-right" in json && json["filename-right"].length > 0) 
        || !("filename-left" in json && json["filename-left"].length > 0)) {
            res.render("/", {failureText: "Please make sure you have provided text in all 4 boxes above."});
            return;
    }

    const file1 = json["file1text"];
    const file2 = json["file2text"];
    
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
        await users.updateUserHistory(userInfo._id, json["filename-left"], json["filename-right"], similarity);
        console.log("Update successful.");
    } catch (e) {
        console.log(e);
    }

    //Sample values, fill these in with the result of comparison
    res.render("main/results", { 
        hasAuth: req.cookies.AuthCookie !== undefined,
        authName: authName,
        similarity: metricSimilarity,
        sharedWords: metricSharedWords,
        totalWords: metricTotalWords,
        sharedChars: metricSharedChars,
        totalChars: metricTotalChars
    });
});


module.exports = router;