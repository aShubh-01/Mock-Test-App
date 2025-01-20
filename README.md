# Mock Test App - First Bench.ai Assignment

## Description
    - An collection of API endpoints that lets you create and submit mock tests
    - Key features 
        1. Every mock test that user can give has unique/non-repeated questions from the database.
        2. Users can see their score after submitting every test.

## Requirement
    - Node.js
    - MongoDB (optionally MongoDB compass)

## Steps to setup and run the project
    1. Have a mongodb database running.
    2. Simply clone the github directory/download the zip file.
    3. Create a .env file inside the root directory, there create a env var called 'DATABASE_URL' and paste the connection string to your mongodb database
    4. Open a terminal inside your project and run 'npm run build'. This will install all dependencies and add some dummy data in the database.
    5. Then run 'npm run dev' for running the project in development mode.
    6. Look around different endpoints, controllers and schemas to further understand the project.

## Brief API description
    There are total 4 endpoints in this app viz :- signup, addQuestions, generate & submit -
        1. signup - add a user to database using name & email.
        2. addQuestions - you can add questions in bulk, each question has fields 'text', 'options' and 'correctOption'.
        3. generate - this endpoint generates a mock test using new questions every time and returns the questions, their options and the id of the mock test
        4. submit - this endpoint needs the mock test id and an array of answers where each element is the number of option you chose & corresponds to the question you are attempting.  
