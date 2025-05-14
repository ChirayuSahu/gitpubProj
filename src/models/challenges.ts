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
    },
    {
        timestamps: true,
    },
)

const Challenges = mongoose.models.Challenges || mongoose.model("Challenges", challengesSchema);

export default Challenges;