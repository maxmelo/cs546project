const mongoCollections = require("../config/mongoCollections");
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const users = mongoCollections.users;
const compare = require("../func/compare.js");

module.exports = {

    createUser : async (username, password, name, bio) => {
        if(!username || !password) throw "Please provide a username and password";
        const userCollection = await users();
        
        if(await userCollection.findOne({username: username})){
            throw "Error: username already exists";
        }

        const hashed = await bcrypt.hash(password, 16);

        const newUser = {
            _id: uuid(),
            sId: null,
            username: username,
            // password: password,
            hashedPassword: hashed,
            name: name,
            bio: bio,
            FileHistory: []        
        };

        const userData = await userCollection.insertOne(newUser);
        if (userData.insertedCount === 0)
            throw "Could not add user";
        return newUser;
    },

    getUserByUsername : async (username) => {
        const userCollection = await users();
        const user = await userCollection.findOne({username: username});
        if(user) return user;
        else throw "Error: could not find user with this username";
    },

    getUserByUsernameBool : async (username) => {
        const userCollection = await users();
        const user = await userCollection.findOne({username: username});
        if(user) return true;
        else return false;
    },

    getUserById : async (_id) => {
        const userCollection = await users();
        const user = await userCollection.findOne({_id: _id});
        if(user) return user;
        else throw "Error: could not find user with this id";
    },

    getAllUsers : async () => {
        const userCollection = await users();
        const get= await userCollection.find({}).toArray();
        return get;
    },  

    validatePassword : async (username, password) => {
        const userCollection = await users();
        const user = await userCollection.findOne({username : username});
        if(user){
            const validate = await bcrypt.compare(password, user.hashedPassword);
            return validate;
        }
        else throw "Error: could not find User";  
    },

    //Add user's past comparisons to Userpage
    updateUserHistory : async (_id, fileName1, fileName2, similarity) => {
        const userCollection = await users();
        const user = await userCollection.findOne({_id: _id});

        if (!user) throw "could not find user with this id";

        const d = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


        const newComparison = {
            fileName1: fileName1,
            fileName2: fileName2,
            similarityPercent: similarity.similarityPercent,
            sharedWords: similarity.sharedWords,
            sharedChars: similarity.sharedChars,
            totalWords: similarity.totalWords,
            totalChars: similarity.totalChars,
            timestamp: d.getDay() + " " + months[d.getMonth()] + " " + d.getFullYear() + " (" + d.getHours() + ":" + d.getMinutes() + ")"
        }

        const update = await userCollection.updateOne(
            { _id: _id}, 
            { $push: {
                FileHistory: newComparison
            },
        });
        return newComparison;
    },

    updateUserHistorySeed : async (_id, file1name, file2name, file1, file2) => {
        const userCollection = await users();
        const user = await userCollection.findOne({_id: _id});

        const metricSimilarity = Math.round(compare.getSimilarity(file1, file2) * 10000) / 100;
        const metricSharedWords = compare.getNumCommonWords(file1, file2);
        const metricTotalWords = Math.max(compare.countWords(file1), compare.countWords(file2));
        const metricSharedChars = compare.getNumCommonChars(file1, file2);
        const metricTotalChars = Math.max(compare.countChars(file1), compare.countChars(file2));

        const similarity = {
            similarityPercent: metricSimilarity,
            sharedWords: metricSharedWords,
            sharedChars: metricSharedChars,
            totalWords: metricTotalWords,
            totalChars: metricTotalChars
        };

        const d = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


        const newComparison = {
            fileName1: file1name,
            fileName2: file2name,
            similarityPercent: similarity.similarityPercent,
            sharedWords: similarity.sharedWords,
            sharedChars: similarity.sharedChars,
            totalWords: similarity.totalWords,
            totalChars: similarity.totalChars,
            timestamp: d.getDay() + " " + months[d.getMonth()] + " " + d.getFullYear() + " (" + d.getHours() + ":" + d.getMinutes() + ")"
        }

        const update = await userCollection.updateOne(
            { _id: _id}, 
            { $push: {
                FileHistory: newComparison
            },
        });

        return newComparison;
    }



}
    




