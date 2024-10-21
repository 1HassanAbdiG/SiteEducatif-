import React, { useState, useEffect } from 'react';
import questionsData from './associe.json'; // The JSON containing questions
import styles from './associe.module.css';   // Your CSS module

const Game = () => {
  const [currentSet, setCurrentSet] = useState(questionsData.sets[0]); // Default to Set 1
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [clicked, setClicked] = useState(false); // To track if the user has already clicked

  // Initialize start time
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Load the image dynamically
  const loadImage = (imagePath) => require(`${imagePath}`);

  // Check the answer and provide feedback
  const checkAnswer = (selectedImage) => {
    if (!clicked) {  // Prevent multiple clicks
      const correctImage = currentSet.questions[currentQuestionIndex].correctImage;
      if (selectedImage === correctImage) {
        setFeedback("Bravo ! C'est la bonne réponse !");
        setIsCorrect(true);
        setScore(score + 1);
      } else {
        setFeedback("Désolé, ce n'est pas la bonne image. Essaie encore !");
        setIsCorrect(false);
        setErrors(errors + 1);
      }
      setClicked(true); // Mark that the user has clicked
      setTimeout(goToNextQuestion, 2000); // Wait for 2 seconds before moving to the next question
    }
  };

  // Go to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentSet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback('');
      setIsCorrect(false);
      setClicked(false);  // Reset clicked state for the next question
    } else {
      setEndTime(Date.now());
      setGameFinished(true);
    }
  };

  // Reset the game
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setFeedback('');
    setIsCorrect(false);
    setScore(0);
    setErrors(0);
    setStartTime(Date.now());
    setGameFinished(false);
    setClicked(false); // Reset clicked state when game restarts
  };

  // Calculate total time taken
  const getTotalTime = () => {
    const timeTaken = endTime - startTime;
    const seconds = Math.floor((timeTaken / 1000) % 60);
    const minutes = Math.floor((timeTaken / 1000 / 60) % 60);
    return `${minutes} minute(s) et ${seconds} seconde(s)`;
  };

  // Shuffle function to randomize image positions
  const shuffleImages = (images) => {
    return images.sort(() => Math.random() - 0.5);
  };

  // Change question set
  const handleSetChange = (e) => {
    const selectedSet = questionsData.sets.find(set => set.title === e.target.value);
    setCurrentSet(selectedSet);
    resetGame();
  };

  // If all questions are finished, show summary
  if (gameFinished) {
    return (
      <div className={styles.summaryContainer}>
        <h2>Résumé du jeu</h2>
        <table className={styles.summaryTable}>
          <thead>
            <tr>
              <th>Score</th>
              <th>Temps écoulé</th>
              <th>Nombre d'erreurs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{score} / {currentSet.questions.length}</td>
              <td>{getTotalTime()}</td>
              <td>{errors}</td>
            </tr>
          </tbody>
        </table>
        <button className={styles.restartButton} onClick={resetGame}>Recommencer le jeu</button>
      </div>
    );
  }

  const currentQuestion = currentSet.questions[currentQuestionIndex];

  return (
    <div className={styles.gameContainer}>
      {/* Instructions for the game */}
      <div className={styles.instructions}>
        <h2>Instructions du jeu</h2>
        <p>
          Bienvenue dans le jeu ! Votre objectif est de choisir l'image correcte en fonction de la phrase affichée.
          Cliquez sur l'image que vous pensez être la bonne réponse.
          Après chaque réponse, vous recevrez un retour immédiat et la question suivante s'affichera après 2 secondes.
          Amusez-vous bien !
        </p>
      </div>

      {/* Question set selector */}
      <label htmlFor="set-select">Sélectionnez un set de questions :</label>
      <select
        id="set-select"
        value={currentSet.title}
        onChange={handleSetChange}
        className={styles.selectSet}
      >
        {questionsData.sets.map((set, index) => (
          <option key={index} value={set.title}>
            {set.title}
          </option>
        ))}
      </select>

      {/* Display the phrase */}
      <div className={styles.phrase}>{currentQuestion.phrase}</div>


      {/* Display images, shuffled */}
      <div className={styles.imageContainer}>
        {shuffleImages([...currentQuestion.images]).map((image, index) => (
          <img
            key={index}
            src={loadImage(image)}
            alt={`Option ${index + 1}`}
            className={styles.imageOption}
            onClick={() => checkAnswer(image)}
          />
        ))}
      </div>



      {/* Feedback visual */}
      <div className={isCorrect ? styles.correctFeedback : styles.incorrectFeedback}>
        {feedback}
      </div>

      {/* Score and errors */}
      <div className={styles.score}>
        Score: {score}/{currentSet.questions.length}
      </div>
      <div className={styles.errors}>
        Erreurs: {errors}
      </div>

      {/* Educational Tip or Explanation */}
      {isCorrect ? (
        <div className={styles.educationalTip}>
          {/* Replace this with actual educational content related to the question */}
          <p>Voici un fait amusant sur ce sujet !</p>
        </div>
      ) : null}
    </div>
  );
};

export default Game;
