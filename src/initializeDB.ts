import { Question } from "./schemas";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env')});

async function addQuestions () {                            // ADD SOME DUMMY QUESTION ON BUILD TIME
    const dummyQuestions = [
        { text: "Question 1", options: ["A", "B", "C"], correctOption: 2},
        { text: "Question 2", options: ["A", "B", "C", "D", "E"], correctOption: 1},
        { text: "Question 3", options: ["A", "B", "C", "D"], correctOption: 4}
    ];

    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        await Question.insertMany(dummyQuestions);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

addQuestions();