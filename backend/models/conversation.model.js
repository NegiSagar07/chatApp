import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants : [{type : mongoose.Schema.Types.ObjectId, ref : "User"}],

        messages : [{
            sender : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
            text : String,
            timestamp : {type : Date, default : Date.now}
        }]
    }
)

const Conversation = mongoose.model('conversation', conversationSchema);

export default Conversation;