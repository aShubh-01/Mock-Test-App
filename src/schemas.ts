import mongoose from "mongoose";

const userSchema = new mongoose.Schema({         //SCHEMAS FOR TABLES IN OUR MONGO DATABASE
    name: { type: String, required: true },
    email: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: { type: [String], require: true },
    correctOption: { type: Number, required: true }
})

const mockTestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: { type: [mongoose.Schema.Types.ObjectId], ref: 'Question', required: true },
    score: { type: Number, require: true },
    submittedAt: { type: Date, default: Date.now() }
})

export const User = mongoose.model('User', userSchema);
export const Question = mongoose.model('Question', questionSchema);
export const MockTest = mongoose.model('MockTest', mockTestSchema);