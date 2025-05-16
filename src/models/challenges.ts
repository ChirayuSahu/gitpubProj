import mongoose, {Schema} from "mongoose";

const challengesSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },
        winXP: {
            type: Number,
            required: true,
        },
        loseXP: {
            type: Number,
            required: true,
        },
        timeLimit:{
            type: Number,
            required: true,
        },

    },
    {
        timestamps: true,
    },
)

const Challenges = mongoose.models.Challenges || mongoose.model("Challenges", challengesSchema);

export default Challenges;