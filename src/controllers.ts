import { User, Question, MockTest } from './schemas';
import { Request, Response } from 'express';

export const generateTest = async (req: Request, res: Response) => {
    const { userId, questionCount } = req.body;             // GET USER ID & NO OF QUESTIONS THE USER WANTS IN THEIR TEST
    
    try {
        const previousTests = await MockTest.find({ userId });
        const answeredQuestions = previousTests.flatMap((test : any) => test.questions);
        
        const questions = await Question.find({                 // GET ONLY LIMITED QUESTION AND IGNORE THE ONES ALREADY ANSWERED
            _id: { $nin: answeredQuestions },
        }).limit(questionCount);

        if(questions.length < questionCount) {              // RESPOND WITH NUMBER OF AVAILABLE QUESTIONS IF THERE ARE NOT ENOUGH QUESTION THE USER ORIGINALLY WANTED
            res.status(400).json({
                message: 'Not enough new questions available',
                newQuestionsAvailableCount: questions.length
            })
            return
        }

        const mockTest = await MockTest.create({                    // CREATE A MOCK TEST
            userId,
            questions: questions.map((question) => question._id)
        });

        res.status(200).json({
            message: 'New questions fetched',
            questions: questions.map((q) => {
                return { question: q.text, options: q.options}
            }),
            mockTestId: mockTest._id
        })
        return;

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Unable to generate mock test'
        })
    }
}

export const submitTest = async (req: Request, res: Response) => {
    const { mockTestId, answers } = req.body;                       // EXPECT THE MOCK TEST ID & AN ARRAY OF ANSWERS WHERE EACH ELEMENT IS THE OPTION NUMBER THE USER SELECTED

    try {
        const mockTest = await MockTest.findById(mockTestId);
    
        if(!mockTest) {
            res.status(404).json({
                message: "Mock test not found"
            })
            return
        }

        mockTest.submittedAt = new Date();

        const questions = await Question.find({_id: { $in: mockTest.questions }});      // FIND THE QUESTIONS BY USING THE ID's OF THE ONES IN OUR MOCK TEST DOCUMENT

        const score = questions.reduce((acc, question, index) => {                  // CALCULATE THE SCORE OF THE MOCK TEST
            return acc + (question.correctOption === answers[index] ? 1 : 0);
        }, 0);

        mockTest.score = score;

        await mockTest.save();                  // SAVE THE SCORE AND SUBMISSION TIME

        res.status(200).json({
            message: 'Test Submitted',
            score
        })
        return

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to submit test"
        })
    }
} 

export const addQuestions = async (req: Request, res: Response) => {
    const { questions } = req.body;
    try {
        await Question.insertMany(questions);               // ADD NEW QUESTIONS
        res.status(200).json({
            message: 'Questions added'
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Unable to add new questions'
        })
    }
}

export const addUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const newUser = await User.create({ name, email });             // CREATE USER
        res.status(200).json({
            message: 'New user created',
            userId: newUser._id
        })
        return
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Unable to create user'
        })
    }
}