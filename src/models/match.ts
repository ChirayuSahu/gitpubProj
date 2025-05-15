import mongoose, { Schema } from "mongoose";

const matchSchema = new Schema(
    {
        player1: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        player2: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        winner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        player1XP: {
            type: Number,
            required: true,
        },
        player2XP: {
            type: Number,
            required: true,
        },
        timeStarted: {
            type: Date,
            default: Date.now,
        },
        timeEnded: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

const Match = mongoose.models.Match || mongoose.model("Match", matchSchema);

export default Match;