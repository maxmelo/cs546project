const express = require("express");
const router = express.Router();
const users = require("../data/users");
const compare = require("../func/compare");

router.get("/", (req, res) => {
    let authName = "";
    if (req.cookies.AuthCookie !== undefined) authName = req.cookies.AuthCookie.username;

    res.render("main/index", {
        hasAuth: req.cookies.AuthCookie !== undefined,
        authName: authName
    });
});

router.post("/results", async (req, res) => {
    let authName = "";
    if (req.cookies.AuthCookie !== undefined) authName = req.cookies.AuthCookie.username;

    const json = req.body;

    if (!("file1text" in json) || !("file2text" in json)) res.redirect("error");

    const file1 = json["file1text"];
    const file2 = json["file2text"];
    
    const metricSimilarity = compare.getSimilarity(file1, file2) * 100;
    const metricSharedWords = compare.getNumCommonWords(file1, file2);
    const metricTotalWords = Math.max(compare.countWords(file1), compare.countWords(file2));
    const metricSharedChars = compare.getNumCommonChars(file1, file2);
    const metricTotalChars = Math.max(compare.countChars(file1), compare.countChars(file2));

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