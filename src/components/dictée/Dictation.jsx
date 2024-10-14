import React, { useState, useRef, useEffect } from 'react';
import dictationsData from './dictations.json'; // Ajustez le chemin si nécessaire

const Dictation = () => {
  const [selectedDictation, setSelectedDictation] = useState(null);
  const [dictationWords, setDictationWords] = useState([]);
  const [result, setResult] = useState(null);
  const [showReference, setShowReference] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [openTime, setOpenTime] = useState(0);
  const [dictationStartTime, setDictationStartTime] = useState(null);
  const [speakingWord, setSpeakingWord] = useState(null);
  const [dictationTime, setDictationTime] = useState(0); // Temps total passé sur la dictée
  const [timeStarted, setTimeStarted] = useState(false); // Indicateur pour savoir si le minuteur a démarré
  const synth = useRef(window.speechSynthesis);
  const utterances = useRef({});

  // Effet pour le minuteur d'affichage de la référence
  useEffect(() => {
    let interval = null;
    if (showReference) {
      interval = setInterval(() => {
        setOpenTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showReference]);

  // Effet pour chronométrer le temps de la dictée
  useEffect(() => {
    let timer;
    if (selectedDictation && !timeStarted) {
      setDictationStartTime(Date.now());
      setTimeStarted(true);
      timer = setInterval(() => {
        setDictationTime(Math.floor((Date.now() - dictationStartTime) / 1000));
      }, 1000);
    } else if (!selectedDictation) {
      clearInterval(timer);
      setTimeStarted(false);
    }
    return () => clearInterval(timer);
  }, [selectedDictation, dictationStartTime, timeStarted]);

  // Précharger les énoncés vocaux
  useEffect(() => {
    if (selectedDictation) {
      selectedDictation.words.forEach(word => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'fr-FR';
        utterance.onstart = () => setSpeakingWord(word);
        utterance.onend = () => setSpeakingWord(null);
        utterances.current[word] = utterance;
      });
    }
  }, [selectedDictation]);

  // Sélectionner une dictée et réinitialiser les états
  const handleSelectDictation = (dictation) => {
    setSelectedDictation(dictation);
    setDictationWords(Array(dictation.words.length).fill(''));
    setResult(null);
    setOpenCount(0);
    setOpenTime(0);
    setSpeakingWord(null);
    setDictationTime(0);
    setTimeStarted(false);
    synth.current.cancel();
  };

  // Soumettre la dictée et calculer les résultats
  const handleSubmit = (e) => {
    e.preventDefault();
    if (dictationWords.some(word => word === '')) {
      alert("Tous les champs doivent être complétés avant de soumettre.");
      return;
    }

    const errors = [];
    const referenceWords = selectedDictation.words;

    dictationWords.forEach((word, index) => {
      if (word.replace(/[.,!?]/g, '') !== referenceWords[index].replace(/[.,!?]/g, '')) {
        errors.push({ incorrectWord: word, correctWord: referenceWords[index] });
      }
    });

    setResult({
      correctedText: dictationWords.join(' '),
      errors: errors,
      errorCount: errors.length,
      score: (1 - errors.length / referenceWords.length) * 100,
    });
  };

  // Basculer l'affichage de la référence
  const toggleReference = () => {
    setShowReference(!showReference);
    if (!showReference) {
      setOpenCount(openCount + 1);
      setOpenTime(0);
    }
  };

  // Lire un mot à l'aide de la synthèse vocale
  const handleSpeakWord = (word) => {
    const utterance = utterances.current[word];
    if (utterance) {
      synth.current.speak(utterance);
    }
  };

  // Mettre à jour les mots dictés
  const handleWordChange = (index, value) => {
    const newWords = [...dictationWords];
    newWords[index] = value;
    setDictationWords(newWords);
  };

  // Formater le temps écoulé en minutes et secondes
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  return (
    <div>
      <h1>Dictée</h1>
      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f8ff' }}>
        
        {/* Colonne gauche: Boutons pour sélectionner les dictées */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          {dictationsData.dictations.map((dictation) => (
            <button
              key={dictation.id}
              onClick={() => handleSelectDictation(dictation)}
              style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px 20px' }}
            >
              {dictation.title}
            </button>
          ))}
        </div>

        {/* Colonne centrale: Formulaire et boutons de mot */}
        <div style={{ flex: 2, marginRight: '20px' }}>
          {selectedDictation && (
            <>
              <form onSubmit={handleSubmit}>
                <div>
                  {selectedDictation.words.map((word, index) => (
                    <span key={index} style={{ display: 'inline-block', margin: '5px' }}>
                      <button
                        type="button"
                        onClick={() => handleSpeakWord(word)}
                        style={{
                          backgroundColor: speakingWord === word ? 'green' : '#d3d3d3',
                          border: 'none',
                          cursor: 'pointer',
                          marginRight: '10px',
                        }}
                      >
                        {' ▶'}
                      </button>
                      <input
                        type="text"
                        value={dictationWords[index] || ''}
                        onChange={(e) => handleWordChange(index, e.target.value)}
                        style={{ width: '100px', padding: '5px' }}
                      />
                    </span>
                  ))}
                </div>
                <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>
                  Soumettre
                </button>
              </form>

              {result && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Résultats</h3>
                  <p>Texte corrigé : {result.correctedText}</p>
                  <p>Erreurs : {result.errorCount}</p>
                  <p>Score : {result.score.toFixed(2)}%</p>
                  <ul>
                    {result.errors.map((error, index) => (
                      <li key={index}>
                        Mot incorrect : {error.incorrectWord}, Correct : {error.correctWord}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Colonne droite: Bouton pour afficher la référence */}
        <div style={{ flex: 1 }}>
          {selectedDictation && (
            <>
              <button
                onClick={toggleReference}
                style={{ padding: '10px 20px', marginBottom: '10px', backgroundColor: showReference ? '#ffeb3b' : '#4CAF50' }}
              >
                {showReference ? 'Masquer la référence' : 'Afficher la référence'}
              </button>

              {showReference && (
                <div style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '10px' }}>
                  <h3>Texte de Référence</h3>
                  <p>{selectedDictation.words.join(' ')}</p>
                </div>
              )}

              <p>Nombre d'affichages : {openCount}</p>
              <p>Temps d'affichage : {formatTime(openTime)}</p>
              <p>Temps écoulé pour la dictée : {formatTime(dictationTime)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dictation;
