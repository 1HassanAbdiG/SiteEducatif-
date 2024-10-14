import React, { useState, useEffect, useRef } from 'react';
import styles from './PhraseReconstruction.module.css';

const PhraseReconstruction = () => {
    const [phrases, setPhrases] = useState([]); // Store phrase objects
    const [selectedText, setSelectedText] = useState([]);
    const [loading, setLoading] = useState(true);
    const constructionAreaRefs = useRef([]);

    const requireJsonFiles = require.context('./datalecture', false, /\.json$/);

    useEffect(() => {
        const loadPhrases = () => {
            const jsonFiles = requireJsonFiles.keys().map(requireJsonFiles);
            const allPhrases = jsonFiles.map(json => ({
                title: json.text.title, // Extract the title
                content: json.text.content,
            }));
            setPhrases(allPhrases);
            setLoading(false);
        };
    
        loadPhrases();
    }, [requireJsonFiles]); // Add requireJsonFiles here
    

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const handleSelectText = (index) => {
        setSelectedText(phrases[index].content); // Set the content of the selected text
        constructionAreaRefs.current = Array(phrases[index].content.length).fill().map(() => React.createRef());
    };

    const createPhraseArea = (phrase, index) => {
        const words = phrase.split(' ');
        shuffleArray(words);

        return (
            <div className={styles.phraseArea} key={index}>
                <div className={styles.wordBank}>
                    {words.map((word, idx) => (
                        <button
                            key={idx}
                            className={styles.word}
                            onClick={(e) => moveWord(e.target, constructionAreaRefs.current[index].current)}
                        >
                            {word}
                        </button>
                    ))}
                </div>
                <div className={styles.constructionArea} ref={constructionAreaRefs.current[index]}></div>
                <button
                    className={styles.checkButton}
                    onClick={() => checkPhrase(phrase, constructionAreaRefs.current[index].current)}
                >
                    Vérifier
                </button>
                <div className={styles.message}></div>
            </div>
        );
    };

    const moveWord = (wordElement, targetArea) => {
        if (wordElement.parentElement.classList.contains(styles.wordBank)) {
            targetArea.appendChild(wordElement);
        } else {
            wordElement.parentElement.previousElementSibling.appendChild(wordElement);
        }
    };

    const checkPhrase = (correctPhrase, constructionArea) => {
        const constructedPhrase = Array.from(constructionArea.children)
            .map(word => word.textContent)
            .join(' ');

        const messageElement = constructionArea.nextElementSibling;
        if (constructedPhrase === correctPhrase) {
            messageElement.textContent = "Correct !";
            messageElement.style.color = 'green';
        } else {
            messageElement.textContent = "Essaie encore.";
            messageElement.style.color = 'red';
        }
    };

    const checkAllPhrases = () => {
        // Loop through each ref in the constructionAreaRefs
        constructionAreaRefs.current.forEach((ref, index) => {
            // Ensure the ref exists and has a current value (the DOM element)
            if (ref.current && phrases[index] && phrases[index].content) {
                const constructionArea = ref.current;
               // const message = constructionArea.nextElementSibling; //MODIFIER POUR LE BOUILD

                // Ensure phrases[index].content is an array before joining it
                const phraseContent = Array.isArray(phrases[index].content)
                    ? phrases[index].content.join(' ')
                    : '';

                // Check the phrase (assuming checkPhrase is a function that exists)
                checkPhrase(phraseContent, constructionArea);
            } else {
                console.warn(`Phrase or ref at index ${index} is missing.`);
            }
        });
    };


    const readAllPhrases = () => {
        const constructedPhrases = constructionAreaRefs.current.map(ref => {
            if (ref.current) {
                return Array.from(ref.current.children)
                    .map(word => word.textContent)
                    .join(' ');
            }
            return ''; // Return an empty string if ref is not available
        })
            .filter(phrase => phrase.length > 0) // Filter out empty phrases
            .join('. '); // Join phrases with a period

        const utterance = new SpeechSynthesisUtterance(constructedPhrases); // Create the utterance
        utterance.lang = 'fr-FR'; // Set the language for the utterance
        speechSynthesis.speak(utterance); // Speak the utterance
    };

    const initializeGame = () => {
        setSelectedText([]);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.gameContainer}>
            <h1>Remettre les Phrases dans l'ordre</h1>
            <p>
                <strong>Consigne :</strong>
                <ol>
                    <li>Sélectionnez un texte dans le menu déroulant.</li>
                    <li>Cliquez sur les mots dans la zone de mot pour les déplacer dans la zone de construction.</li>
                    <li>Si vous vous êtes trompé, cliquez à nouveau sur le mot pour le remettre à sa place.</li>
                    <li>Cliquez sur "Vérifier" pour vérifier votre réponse.</li>
                </ol>
            </p>

            <div>
                <select onChange={(e) => handleSelectText(e.target.value)}>
                    <option value="" disabled selected>Sélectionner un texte</option>
                    {phrases.map((phraseGroup, index) => (
                        <option key={index} value={index}>
                            {phraseGroup.title} {/* Display the title here */}
                        </option>
                    ))}
                </select>
            </div>
            {selectedText.map((phrase, index) => createPhraseArea(phrase, index))}
            <div className={styles.buttonArea}>
                <button className={styles.actionButton} onClick={checkAllPhrases}>Vérifier Tout</button>
                <button className={styles.actionButton} onClick={readAllPhrases}>Lire Tout</button>
                <button className={styles.actionButton} onClick={initializeGame}>Recommencer</button>
            </div>
        </div>
    );
};

export default PhraseReconstruction;
