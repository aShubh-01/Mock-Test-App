import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './databaseCon';
import { addQuestions, addUser, generateTest, submitTest } from './controllers';

dotenv.config({ path: path.join(__dirname, '../.env')});

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(cors());

app.post('/signup', addUser);
app.post('/add-questions', addQuestions);
app.post('/generate', generateTest);
app.post('/submit', submitTest);

connectDatabase();

app.listen(port, () => console.log(`Running on port ${port}`));