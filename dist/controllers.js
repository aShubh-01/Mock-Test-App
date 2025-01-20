"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.addQuestions = exports.submitTest = exports.generateTest = void 0;
const schemas_1 = require("./schemas");
const generateTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, questionCount } = req.body; // GET USER ID & NO OF QUESTIONS THE USER WANTS IN THEIR TEST
    try {
        const previousTests = yield schemas_1.MockTest.find({ userId });
        const answeredQuestions = previousTests.flatMap((test) => test.questions);
        const questions = yield schemas_1.Question.find({
            _id: { $nin: answeredQuestions },
        }).limit(questionCount);
        if (questions.length < questionCount) { // RESPOND WITH NUMBER OF AVAILABLE QUESTIONS IF THERE ARE NOT ENOUGH QUESTION THE USER ORIGINALLY WANTED
            res.status(400).json({
                message: 'Not enough new questions available',
                newQuestionsAvailableCount: questions.length
            });
            return;
        }
        const mockTest = yield schemas_1.MockTest.create({
            userId,
            questions: questions.map((question) => question._id)
        });
        res.status(200).json({
            message: 'New questions fetched',
            questions: questions.map((q) => {
                return { question: q.text, options: q.options };
            }),
            mockTestId: mockTest._id
        });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Unable to generate mock test'
        });
    }
});
exports.generateTest = generateTest;
const submitTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mockTestId, answers } = req.body; // EXPECT THE MOCK TEST ID & AN ARRAY OF ANSWERS WHERE EACH ELEMENT IS THE OPTION NUMBER THE USER SELECTED
    try {
        const mockTest = yield schemas_1.MockTest.findById(mockTestId);
        if (!mockTest) {
            res.status(404).json({
                message: "Mock test not found"
            });
            return;
        }
        mockTest.submittedAt = new Date();
        const questions = yield schemas_1.Question.find({ _id: { $in: mockTest.questions } }); // FIND THE QUESTIONS BY USING THE ID's OF THE ONES IN OUR MOCK TEST DOCUMENT
        const score = questions.reduce((acc, question, index) => {
            return acc + (question.correctOption === answers[index] ? 1 : 0);
        }, 0);
        mockTest.score = score;
        yield mockTest.save(); // SAVE THE SCORE AND SUBMISSION TIME
        res.status(200).json({
            message: 'Test Submitted',
            score
        });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to submit test"
        });
    }
});
exports.submitTest = submitTest;
const addQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questions } = req.body;
    try {
        yield schemas_1.Question.insertMany(questions); // ADD NEW QUESTIONS
        res.status(200).json({
            message: 'Questions added'
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Unable to add new questions'
        });
    }
});
exports.addQuestions = addQuestions;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        const newUser = yield schemas_1.User.create({ name, email }); // CREATE USER
        res.status(200).json({
            message: 'New user created',
            userId: newUser._id
        });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Unable to create user'
        });
    }
});
exports.addUser = addUser;
