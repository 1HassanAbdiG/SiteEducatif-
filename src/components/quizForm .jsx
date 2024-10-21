import React, { useState } from 'react';
import quizData from './facteur.json';

const QuizForm = () => {
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);

    const handleOptionChange = (questionId, selectedOption) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let calculatedScore = 0;

        Object.entries(answers).forEach(([questionId, selectedOption]) => {
            const question = findQuestionById(questionId);
            if (question && selectedOption === question.CorrectAnswer) {
                calculatedScore += 1;
            }
        });

        setScore(calculatedScore);
    };

    const findQuestionById = (questionId) => {
        for (const section of Object.values(quizData.QCM)) {
            const question = section.Questions.find(q => q.id === questionId);
            if (question) {
                return question;
            }
        }
        return null;
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.entries(quizData.QCM).map(([part, section], sectionIndex) => (
                <div key={sectionIndex}>
                    <h2>{section.Titre}</h2>
                    {section.Questions.map((question) => (
                        <div key={question.id}>
                            <h3>{question.Question}</h3>
                            {question.Options.map((option) => (
                                <div key={option}>
                                    <label>
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={option}
                                            checked={answers[question.id] === option}
                                            onChange={() => handleOptionChange(question.id, option)}
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            <button type="submit">Submit</button>
            <h3>Your score: {score}</h3>
        </form>
    );
};

export default QuizForm;
