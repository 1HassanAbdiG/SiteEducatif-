import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import JeuHistoire from './components/jeuHistoire';
import PhraseBuilder from './components/PhraseBuilder';
import MultiplicationGame from './components/Multi';
// Import other components...

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
