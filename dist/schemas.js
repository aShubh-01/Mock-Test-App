"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTest = exports.Question = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});
const questionSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    options: { type: [String], require: true },
    correctOption: { type: Number, required: true }
});
const mockTestSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: 'Question', required: true },
    score: { type: Number, require: true },
    submittedAt: { type: Date, default: Date.now() }
});
exports.User = mongoose_1.default.model('User', userSchema);
exports.Question = mongoose_1.default.model('Question', questionSchema);
exports.MockTest = mongoose_1.default.model('MockTest', mockTestSchema);
