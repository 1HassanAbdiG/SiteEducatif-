import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <h1>Jeux Éducatifs</h1>
      <nav>
        <ul>
          <li><Link to="/histoire">Jeu de Histoire</Link></li>
          <li><Link to="/multiplication">Jeu Multiplication</Link></li>
          <li><Link to="/construction">Jeu Construction de Phrases</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
