import React from 'react';

const FinalEvaluation = ({ score, totalPhrases }) => {
  const advice = score === totalPhrases ? 
    "Super travail, tu as tout mémorisé !" : 
    "Bon travail, mais il reste des erreurs. N'oublie pas de t'entraîner davantage.";
  
  return (
    <div className="final-evaluation">
      <h2>Évaluation finale</h2>
      <p>Score: {score} / {totalPhrases}</p>
      <p>{advice}</p>
      <p>Tu es prêt pour la prochaine dictée. Continue à t'améliorer !</p>
    </div>
  );
};

export default FinalEvaluation;
