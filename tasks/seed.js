const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;

const fs = require("fs");

var hamlet = "";
var macbeth = "";
var mosaicOriginal = "";
var mosaicPlagiarism = "";
var directOriginal = "";
var directPlagiarism = "";


fs.readFile("tasks/hamlet.txt", "utf8", function(err, data) {
    if (err) throw err;
    hamlet = data;
})
fs.readFile("tasks/macbeth.txt", "utf8", function(err, data) {
    if (err) throw err;
    macbeth = data;
})
fs.readFile("tasks/mosaicOriginal.txt", "utf8", function(err, data) {
    if (err) throw err;
    mosaicOriginal = data;
})
fs.readFile("tasks/mosaicPlagiarism.txt", "utf8", function(err, data) {
    if (err) throw err;
    mosaicPlagiarism = data;
})
fs.readFile("tasks/directOriginal.txt", "utf8", function(err, data) {
    if (err) throw err;
    directOriginal = data;
})
fs.readFile("tasks/directPlagiarism.txt", "utf8", function(err, data) {
    if (err) throw err;
    directPlagiarism = data;
})

let id;

dbConnection().then(db => {


    return db.dropDatabase().then(() => {
        return dbConnection;
    }).then((db) => {
        return users.createUser("testUsername", "testPassword", "Joe Smith", "Hi! I am a test account!");

            
    }).then((user) => {
        id = user._id
        return users.updateUserHistorySeed(id, "Hamlet", "Macbeth", hamlet, macbeth)
    }).then((update) => {
        return users.updateUserHistorySeed(id, "Hamlet", "Hamlet Again", hamlet, hamlet);
    }).then((update) => {
        return users.updateUserHistorySeed(id, "Direct Plagiarism", "Direct Original", directPlagiarism, directOriginal);
    }).then((update) => {
        return users.updateUserHistorySeed(id, "Mosaic Plagiarism", "Mosaic Original", mosaicPlagiarism, mosaicOriginal);
    }).then(() => {
        db.close();
        console.log("Done seeding database");
    });
}, (error) => {
    console.error(error);
});
