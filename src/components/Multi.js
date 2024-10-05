import React, { useState, useEffect } from 'react';
import {  Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Enregistre les composants nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MultiplicationGame = () => {
    const [table, setTable] = useState(1);
    const [question, setQuestion] = useState(generateQuestion(1));
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [clicked, setClicked] = useState(false);
    const [results, setResults] = useState([]);
    const [timePerQuestion, setTimePerQuestion] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [totalTime, setTotalTime] = useState(0);
    
    // Tableaux pour les résultats
    const [scores, setScores] = useState(Array(10).fill(0));
    const [times, setTimes] = useState(Array(10).fill(0));
    const [attempts, setAttempts] = useState(Array(10).fill(0));

    // Génère une nouvelle question
    function generateQuestion(table) {
        const factor2 = Math.floor(Math.random() * 10) + 1;
        return { factor1: table, factor2 };
    }

    useEffect(() => {
        setStartTime(Date.now());
    }, [question]);

    const handleTableChange = (e) => {
        const selectedTable = parseInt(e.target.value);
        setTable(selectedTable);
        resetGame(selectedTable);
    };

    const resetGame = (selectedTable) => {
        setQuestion(generateQuestion(selectedTable));
        setAnswer('');
        setFeedback('');
        setScore(0);
        setCurrentQuestion(1);
        setClicked(false);
        setResults([]);
        setTimePerQuestion([]);
        setTotalTime(0);
    };

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    const verifyAnswer = () => {
        if (!clicked) {
            const correctAnswer = question.factor1 * question.factor2;
            const timeTaken = (Date.now() - startTime) / 1000;

            // Met à jour les scores et les temps
            const currentTableIndex = table - 1;
            const updatedScores = [...scores];
            const updatedTimes = [...times];
            const updatedAttempts = [...attempts];

            if (parseInt(answer) === correctAnswer) {
                setFeedback("✅ Bonne réponse !");
                updatedScores[currentTableIndex] += 1;
            } else {
                setFeedback("❌ Mauvaise réponse");
            }
            updatedTimes[currentTableIndex] += timeTaken;
            updatedAttempts[currentTableIndex] += 1;

            setScores(updatedScores);
            setTimes(updatedTimes);
            setAttempts(updatedAttempts);
            setTotalTime(totalTime + timeTaken);
            setTimePerQuestion([...timePerQuestion, timeTaken]);
            setClicked(true);

            if (currentQuestion < 10) {
                setTimeout(() => {
                    setQuestion(generateQuestion(table));
                    setAnswer('');
                    setFeedback('');
                    setCurrentQuestion(currentQuestion + 1);
                    setClicked(false);
                }, 2000);
            } else {
                setTimeout(() => {
                    giveAdvice();
                }, 2000);
            }
        }
    };

    const giveAdvice = () => {
        // ... conseils (identique à votre code précédent)
    };

    // Calculs pour les tableaux
    const averageScores = scores.map((score, index) => attempts[index] > 0 ? (score / attempts[index]) * 10 : 0);
    const averageTimes = times.map((time, index) => attempts[index] > 0 ? (time / attempts[index]) : 0);

    // Préparation des données pour les graphiques
    const scoreData = {
        labels: [...Array(10).keys()].map(i => `Table ${i + 1}`),
        datasets: [
            {
                label: 'Score moyen',
                data: averageScores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const timeData = {
        labels: [...Array(10).keys()].map(i => `Table ${i + 1}`),
        datasets: [
            {
                label: 'Temps moyen (s)',
                data: averageTimes,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="game-container">
            <h1>MathAventure : L'odyssée des multiplications</h1>

            <div className="table-selector">
                <label>Choisis la table à maîtriser : </label>
                <select onChange={handleTableChange} value={table}>
                    {[...Array(10).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                            Table de {n + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="question-box">
                <h2>{question.factor1} × {question.factor2} = ?</h2>
            </div>

            <div className="answer-section">
                <input
                    type="number"
                    value={answer}
                    onChange={handleAnswerChange}
                    placeholder="Ta réponse"
                    disabled={clicked}
                />
                <button onClick={verifyAnswer} disabled={clicked}>
                    Vérifier
                </button>
                <button onClick={() => resetGame(table)}>Réinitialiser</button>
            </div>

            <div className="feedback">{feedback}</div>

            <div className="results">
                {results.map((color, index) => (
                    <span
                        key={index}
                        style={{
                            display: 'inline-block',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            margin: '5px',
                        }}
                    ></span>
                ))}
            </div>

            <div className="progress">
                <p>Question {currentQuestion} / 10</p>
                <p>Score: {score}</p>
            </div>

            {/* Tableau récapitulatif des scores et temps */}
            <div className="recap-table">
                <h3>Récapitulatif des résultats</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Table</th>
                            <th>Score total / 10</th>
                            <th>Temps total (s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={index}>
                                <td>Table de {index + 1}</td>
                                <td>{score} / 10</td>
                                <td>{times[index].toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="recap-table">
                <h3>Statistiques moyennes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Table</th>
                            <th>Score moyen</th>
                            <th>Temps moyen (s)</th>
                            <th>Nombre de tentatives</th>
                        </tr>
                    </thead>
                    <tbody>
                        {averageScores.map((avgScore, index) => (
                            <tr key={index}>
                                <td>Table de {index + 1}</td>
                                <td>{avgScore.toFixed(2)}</td>
                                <td>{averageTimes[index].toFixed(2)}</td>
                                <td>{attempts[index]/10}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Graphiques séparés pour le score et le temps moyen */}
            <div className="section chart-container">
                <h3>Comparaison des scores moyens</h3>
                <Bar data={scoreData} options={chartOptions} />
            </div>

            <div className="section chart-container">
                <h3>Comparaison des temps moyens</h3>
                <Bar data={timeData} options={chartOptions} />
            </div>
        </div>
    );
};

export default MultiplicationGame;
