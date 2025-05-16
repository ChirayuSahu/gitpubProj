import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        xpPoints: {
            type: Number,
            default:0,
        },
        challenges: {
            type: [Schema.Types.ObjectId],
            ref: "Challenges",
            default: [],
        },
        streak: {
            type: Number,
            default: 0,
        },
        matchHistory:{
            type: [Schema.Types.ObjectId],
            ref: "Match",
            default: [],
        },
        isPlaying: {
            type: Boolean,
            default: false,
        },
        isOnline: {
            type: Boolean,
            default: false,
        },


    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;