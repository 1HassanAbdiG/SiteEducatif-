import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/PhraseBuilder.module.css';
import phrasesData from '../data/ConstructionPhrase.json';
import ExerciseSummary from './Advice';
import RecopyTask from './RecopyTask';
import DictationTask from './DictationTask';
//import FinalEvaluation from './FinalEvaluation';

const PhraseBuilder = () => {
  // State variables for controlling phrases, feedback, and progress
  const [sujet, setSujet] = useState('');
  const [verbe, setVerbe] = useState('');
  const [complement, setComplement] = useState('');
  const [feedback, setFeedback] = useState('');
  const [phrase, setPhrase] = useState('');
  const [correctPhrases, setCorrectPhrases] = useState([]);
  const [incorrectPhrases, setIncorrectPhrases] = useState([]);
  const [progress, setProgress] = useState(0);

  // State for different stages of the game
  const [showSummary, setShowSummary] = useState(false);
  const [showRecopy, setShowRecopy] = useState(false);
  const [showDictation, setShowDictation] = useState(false);
  const [showFinalEvaluation, setShowFinalEvaluation] = useState(false);

  // Data arrays for subjects, verbs, and complements
  const subjectsList = [
    "Le chien", "Le cheval", "Le chat", "Maman", "Les enfants", "Nous", 
    "Vous", "Tu", "Mon frère", "Papa"
  ];
  const verbsList = [
    "aboie", "saute", "se cache", "coud", "dessinent", "planifions", 
    "jouez", "écris", "bricole", "lave"
  ];
  const complementsList = [
    "contre les passants", "au-dessus des obstacles", "sous le lit", 
    "un vêtement pour l'hiver", "des animaux sur le tableau", 
    "nos vacances d'été", "au tennis sur le court", 
    "une lettre à ton ami", "un avion miniature", 
    "la voiture dans le garage"
  ];

  const [subjects, setSubjects] = useState(subjectsList);
  const [verbs, setVerbs] = useState(verbsList);
  const [complements, setComplements] = useState(complementsList);

  // Predefined correct phrases
  const correctPhrasesList = phrasesData.phrasesCorrectes;

  // Function to shuffle an array
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Function to reset and shuffle dropdown options wrapped in useCallback
  const initialiserSelects = useCallback(() => {
    setSujet('');
    setVerbe('');
    setComplement('');
    setSubjects(shuffleArray(subjectsList));
    setVerbs(shuffleArray(verbsList));
    setComplements(shuffleArray(complementsList));
  }, []);

  // Ensure selects are initialized when component mounts
  useEffect(() => {
    initialiserSelects();
  }, [initialiserSelects]);

  // Verifies if the constructed phrase is correct
  const verifierPhrase = () => {
    if (sujet && verbe && complement) {
      const constructedPhrase = `${sujet} ${verbe} ${complement}.`;
      setPhrase(constructedPhrase);

      if (correctPhrases.includes(constructedPhrase) || incorrectPhrases.includes(constructedPhrase)) {
        setFeedback("Vous avez déjà dit cette phrase. 😅");
      } else {
        const isCorrect = correctPhrasesList.includes(constructedPhrase);
        if (isCorrect) {
          setFeedback("Correct ! 🎉");
          setCorrectPhrases(prev => [...prev, constructedPhrase]);
          setProgress(prev => Math.min(prev + 10, 100));
        } else {
          setFeedback("Demandez à l'enseignant. 🤔");
          setIncorrectPhrases(prev => [...prev, constructedPhrase]);
        }
      }

      // Reset selections after verification
      setSujet('');
      setVerbe('');
      setComplement('');

      // Show recopy phase after 3 correct phrases (for testing purposes)
      if (correctPhrases.length + 1 === 3) {
        setShowRecopy(true);
      }
    } else {
      setFeedback("Veuillez sélectionner tous les éléments de la phrase. ⚠️");
    }
  };

  // Function to reset the game
  const reinitialiserJeu = () => {
    setPhrase('');
    setFeedback('');
    setCorrectPhrases([]);
    setIncorrectPhrases([]);
    setProgress(0);
    initialiserSelects();
  };

  // Function to move between phases
  const handleNextStep = () => {
    setShowRecopy(true);
    setShowSummary(false);
  };

  const handleDictation = () => {
    setShowDictation(true);
    setShowRecopy(false);
  };

  const handleFinalEvaluation = () => {
    setShowFinalEvaluation(true);
    setShowDictation(false);
  };

  // Automatically show the summary after 10 correct phrases
  useEffect(() => {
    if (correctPhrases.length === 10) {
      setShowSummary(true);
    }
  }, [correctPhrases]);

  return (
    <div className={styles.container}>
      <h1>Jeu de Construction de Phrases</h1>

      {/* Conditionally render based on progress */}
      {showSummary && <ExerciseSummary onNext={handleNextStep} />}
      {showRecopy && <RecopyTask phrases={correctPhrases} onNext={handleDictation} incorrecPhase={incorrectPhrases} />}
      {showDictation && <DictationTask phrases={correctPhrases} onNext={handleFinalEvaluation} />}
      
      {!showSummary && !showRecopy && !showDictation && !showFinalEvaluation && (
        <>
          <div className={styles.instructions}>
            <p>Construisez des phrases correctes en sélectionnant un sujet, un verbe et un complément. Trouvez les 10 phrases cachées pour gagner !</p>
          </div>

          <div className={styles.container1}>
            <select onChange={(e) => setSujet(e.target.value)} value={sujet}>
              <option value="">Choisir un sujet</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select onChange={(e) => setVerbe(e.target.value)} value={verbe}>
              <option value="">Choisir un verbe</option>
              {verbs.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            <select onChange={(e) => setComplement(e.target.value)} value={complement}>
              <option value="">Choisir un complément</option>
              {complements.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div id="phrase">{phrase}</div>
          <div id="feedback">{feedback}</div>

          <div id="progress">Phrases correctes trouvées : {correctPhrases.length} / 10</div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>

          <div>
            <button onClick={verifierPhrase}>Vérifier la phrase</button>
            <button onClick={reinitialiserJeu}>Réinitialiser</button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.phraseTable}>
              <thead>
                <tr>
                  <th>Phrases Correctes</th>
                  <th>Phrases Incorrectes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ul>
                      {correctPhrases.map((p, index) => (
                        <li key={index}>{p}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {incorrectPhrases.map((p, index) => (
                        <li key={index}>{p}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PhraseBuilder;
