class SudokuSolver {

  // Convert a letter to a number
  letterToNumber(letter) {
    return letter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
  }

  // Check if the puzzle string is valid
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (!/^[0-9.]*$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  // Convert the puzzle string into a 2D board array
  convertToBoard(puzzleString) {
    return puzzleString.split('').map((val, i) => {
      return i % 9 === 0 ? puzzleString.slice(i, i + 9).split('') : null;
    }).filter(val => val);
  }

  isValid(board, row, col, value) {
    const boxSize = 3;
    const size = 9;

    for (let i = 0; i < size; i++) {
      const boxRow = Math.floor(row / boxSize) * boxSize + Math.floor(i / boxSize);
      const boxCol = Math.floor(col / boxSize) * boxSize + i % boxSize;
      if (board[row][i] == value || board[i][col] == value || board[boxRow][boxCol] == value) {
        return false;
      }
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, col, value) {
    let grid = this.convertToBoard(puzzleString);
    const rowIndex = this.letterToNumber(row);

    console.log(`Checking row: ${row}, col: ${col}, value: ${value}, rowIndex: ${rowIndex}`);

    // Check if the value exists in the row
    if (grid[rowIndex].includes(value.toString())) {
      console.log('Conflict in row detected.');
      return { valid: false, conflict: ['row'] }; // Return conflict details
    }

    console.log('No conflict in row.');
    return { valid: true }; // Return true if placement is valid
  }


  checkColPlacement(puzzleString, col, value) {
    let grid = this.convertToBoard(puzzleString);
    const colIndex = parseInt(col) - 1; // Convert column to 0-based index

    // Check if the value already exists in the column
    for (let row of grid) {
        if (row[colIndex] === value.toString()) {
            return { valid: false, conflict: ['column'] }; // Conflict found
        }
    }
    return { valid: true }; // No conflict found
}
    

  checkRegionPlacement(puzzleString, row, col, value) {
    let grid = this.convertToBoard(puzzleString);
    row = this.letterToNumber(row);
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    // Check the 3x3 box
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === value.toString()) {
                return { valid: false, conflict: ['region'] }; // Return conflict details
            }
        }
    }
    return { valid: true }; // Return true if no conflict is found
}


  // Solve the puzzle recursively
  solvePuzzle(board) {
    const size = 9;
    const boxSize = 3;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === '.') {
          for (let value = 1; value <= size; value++) {
            if (this.isValid(board, row, col, value)) {
              board[row][col] = value.toString();
              if (this.solvePuzzle(board)) {
                return board;
              } else {
                board[row][col] = '.';
              }
            }
          }
          return false;
        }
      }
    }
    return board;
  }

  // Solve the puzzle and return the solution
  solve(puzzleString) {
    const validationResult = this.validate(puzzleString);
    if (validationResult.error) { // Check for error in validation
      return validationResult;
    }

    const board = this.convertToBoard(puzzleString);
    const solution = this.solvePuzzle(board);
    if (solution) {
      return solution.flat().join('');
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  };
};

module.exports = SudokuSolver;
