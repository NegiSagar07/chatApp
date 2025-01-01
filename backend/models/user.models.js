import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"]
        },
        profilePic: {
            type: String,
            default: ""
        },
        friends: {
            type: [mongoose.Schema.Types.ObjectId], // Array of strings for storing usernames of friends
            ref: 'User',
            default: []     // Default to an empty array
        }
    }
);

const User = mongoose.model('User', userSchema);

export default User;
