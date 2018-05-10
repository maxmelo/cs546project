const mongoCollections = require("../config/mongoCollections");
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const users = mongoCollections.users;

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

        const newComparison = {
            fileName1: fileName1,
            fileName2: fileName2,
            similarity: similarity
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
    




