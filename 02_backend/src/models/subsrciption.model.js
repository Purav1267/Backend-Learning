import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subsriber:{
        type: mongoose.Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, // one who to whom 'subscriber' is subscribing
        ref: "User"
    }

},{timestamps: true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)