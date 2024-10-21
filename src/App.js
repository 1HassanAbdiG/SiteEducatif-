import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import JeuHistoire from './components/jeuHistoire';
import PhraseBuilder from './components/PhraseBuilder';
import MultiplicationGame from './components/Multi';
import Sudoku from './components/sudoku';
import Lecture from './components/lectrure/lecture';
import Dictation from './components/dictée/Dictation';
import Game from './components/game';




const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Fixed header */}
        <Header />
        
        {/* Main content area */}
        <div className="main-content">
          
          <Routes>
            <Route path="/histoire" element={<JeuHistoire />} />
            <Route path="/construction" element={<PhraseBuilder />} />
            <Route path="/multiplication" element={<MultiplicationGame />} />
            <Route path="/sudoku" element={<Sudoku />} />
            <Route path="/lecture" element={<Lecture />} />
            <Route path="/dictée" element={<Dictation />} />
            <Route path="/associe" element={<Game />} />
         
            {/* Add more routes here */}
          </Routes>
        </div>

        {/* Fixed footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
