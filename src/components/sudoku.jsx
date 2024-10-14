import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import styles from './sudoku.module.css'; // Import du module CSS

const Sudoku = () => {
  const [currentGrid, setCurrentGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [completedSudokus, setCompletedSudokus] = useState([]);
  const [difficulty, setDifficulty] = useState('basic');
  const [message, setMessage] = useState(''); // Pour afficher les messages

  // Define startNewGame with useCallback to memoize it
  const startNewGame = useCallback(() => {
    const grid = generateSudoku(difficulty);
    // Initialize grid with objects having `value` and `incorrect` properties
    setCurrentGrid(grid.map(row => row.map(cell => ({ value: cell, incorrect: false }))));
    setHistory([]);
    setMessage(''); // Réinitialiser le message
  }, [difficulty]); // Include difficulty in the dependencies

  useEffect(() => {
    startNewGame();
  }, [difficulty, startNewGame]); // Add startNewGame as a dependency

  const generateSudoku = (difficulty) => {
    const size = difficulty === 'basic' ? 4 : 9;
    const grid = Array(size).fill().map(() => Array(size).fill(0));
    const nums = Array.from({ length: size }, (_, i) => i + 1);

    const isValid = (num, row, col) => {
      for (let x = 0; x < size; x++) {
        if (grid[row][x] === num || grid[x][col] === num) return false;
      }

      const boxSize = Math.sqrt(size);
      const boxRow = Math.floor(row / boxSize) * boxSize;
      const boxCol = Math.floor(col / boxSize) * boxSize;

      for (let i = 0; i < boxSize; i++) {
        for (let j = 0; j < boxSize; j++) {
          if (grid[boxRow + i][boxCol + j] === num) return false;
        }
      }
      return true;
    };

    const solve = (row = 0, col = 0) => {
      if (col === size) {
        col = 0;
        row++;
        if (row === size) return true;
      }
      if (grid[row][col] !== 0) return solve(row, col + 1);
      nums.sort(() => Math.random() - 0.5);
      for (const num of nums) {
        if (isValid(num, row, col)) {
          grid[row][col] = num;
          if (solve(row, col + 1)) return true;
          grid[row][col] = 0;
        }
      }
      return false;
    };

    solve();
    setSolution(grid.map(row => [...row])); // Store the solution

    const numToRemove = {
      basic: 8,
      intermediate: 40,
      expert: 55,
    }[difficulty];

    let removed = 0;
    while (removed < numToRemove) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (grid[row][col] !== 0) {
        grid[row][col] = 0;
        removed++;
      }
    }
    return grid;
  };

  const renderGrid = () => {
    return currentGrid.map((row, i) =>
      row.map((cell, j) => (
        <div
          key={`${i}-${j}`}
          className={`${styles.cell} ${cell.incorrect ? styles.incorrect : ''} ${cell.given ? styles.given : ''}`}
          onClick={() => selectCell(i, j)}
        >
          {cell.value !== 0 ? cell.value : ''}
        </div>
      ))
    );
  };

  const renderNumberPad = () => {
    return [7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
      <button
        key={num}
        className={`${styles.numberButton} ${num === 0 ? styles.delete : ''}`}
        onClick={() => setNumber(num)}
      >
        {num === 0 ? 'Effacer' : num}
      </button>
    ));
  };

  const selectCell = (row, col) => {
    setSelectedCell({ row, col });
  };

  const setNumber = (num) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const newGrid = [...currentGrid];
      const oldValue = newGrid[row][col]; // Store the old value for history
      newGrid[row][col] = { value: num === 0 ? 0 : num, incorrect: false }; // Update cell value
      setCurrentGrid(newGrid);
      setHistory([...history, { row, col, oldValue }]); // Update history
    }
  };

  const checkSolution = () => {
    const updatedGrid = currentGrid.map((row, i) => 
      row.map((cell, j) => {
        const isCorrect = cell.value === solution[i][j];
        return { ...cell, incorrect: !isCorrect }; // Mark as incorrect if not matching
      })
    );

    setCurrentGrid(updatedGrid); 

    // Check if the entire grid is correct
    if (updatedGrid.every((row, i) => row.every((cell, j) => cell.value === solution[i][j]))) {
      setMessage('Félicitations ! Vous avez résolu le Sudoku correctement.');
      addCompletedSudoku();
    } else {
      setMessage('Désolé, la solution est incorrecte. Essayez à nouveau.');
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const lastMove = history.pop();
      const newGrid = [...currentGrid];
      newGrid[lastMove.row][lastMove.col] = lastMove.oldValue; // Restore old value
      setCurrentGrid(newGrid);
      setHistory([...history]); // Update history
    }
  };

  const addCompletedSudoku = () => {
    const newCompleted = [
      ...completedSudokus,
      { difficulty, date: new Date().toLocaleString() },
    ];
    setCompletedSudokus(newCompleted);
  };

  return (
    <div className={styles.sudokuApp}>
      <h1>Sudoku</h1>
      <div className={styles.difficultySelector}>
        <label htmlFor="difficulty">Difficulté :</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="basic">Basic (4x4)</option>
          <option value="intermediate">Intermédiaire (9x9)</option>
          <option value="expert">Expert (9x9)</option>
        </select>
      </div>
      <div className={styles.gameContainer}>
        <div className={`${styles.sudokuGrid} ${styles[difficulty]}`}>
          {renderGrid()}
        </div>
        <div className={styles.numberPad}>{renderNumberPad()}</div>
      </div>
      <div className={styles.controls}>
        <button onClick={startNewGame}>Nouveau Jeu</button>
        <button onClick={checkSolution}>Vérifier la solution</button>
        <button onClick={undo}>Annuler</button>
      </div>
      <div className={styles.message}>{message}</div>
      <div className={styles.completedSudokus}>
        <h2>Sudokus Complétés</h2>
        <ul>
          {completedSudokus.map((sudoku, index) => (
            <li key={index}>
              {`${index + 1}. ${sudoku.difficulty} - ${sudoku.date}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sudoku;
