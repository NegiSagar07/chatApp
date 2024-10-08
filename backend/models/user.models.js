import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        gender : {
            type : String,
            required: true,
            enum : ["male", "female"]
        },
        profilePic : {
            type : String,
            default : ""
        }

    }
)

const User = mongoose.model('User', userSchema);

export default User;