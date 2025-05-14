import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            rewuired: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
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
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);