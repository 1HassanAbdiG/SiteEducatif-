import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle menu

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle menu open/close state
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <img src='/imag/logo1.png' alt="Logo de l'école" className={styles.logo} />
          <div className={styles.textContent}>
            <h1>Ibn Batouta</h1>
            <p>Your online educational resource</p>
          </div>
        </div>
        <div className={styles.hamburger} onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </div>
        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li><Link to="/lecture">Lecture</Link></li>
            <li><Link to="/dictée">Dictée</Link></li>
            <li><Link to="/histoire">Jeu Histoire</Link></li>
            <li><Link to="/multiplication">Jeu Multiplication</Link></li>
            <li><Link to="/construction">Jeu Construction de Phrases</Link></li>
            <li><Link to="/sudoku">Jeu Sudoku</Link></li>
          
            <li><Link to="/associe">associe</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
