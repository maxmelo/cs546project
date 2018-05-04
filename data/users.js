const mongoCollections = require("../config/mongoCollections");
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const users = mongoCollections.users;


module.exports = {

    createUser : async (username, password, name, bio) => {
        if(!username || password) throw "Please provide a username and password";
        const userCollection = await users();
        
        if(await userCollection.findOne({username: username})){
            throw "Error: username already exists";
        }

        const hashed = await bcrypt.hash(password, 16);
        const newUser = {
            _id: uuid(),
            sId: null,
            username: username,
            password: password,
            hashedPassword: hashed,
            name: name,
            bio: bio,
            FileHistory: {
                comparisonId: null,
                fileName1: null,
                fileName2: null,
                similarity: null,
                wordMatch: null,
                lineMatch: null
            }
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
        
    }

}
    




