'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    let puzzle = req.body.puzzle;
    let coordinate = req.body.coordinate;
    let value = req.body.value;

    // Check if required fields are missing
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    // Validate the puzzle
    const validationResult = solver.validate(puzzle);
    if (validationResult.error) {
      return res.json(validationResult);
    }

    const row = coordinate[0];  // e.g., 'A'
    const col = coordinate[1];  // e.g., '1'

    // Validate coordinate format
    if (coordinate.length !== 2 || !/[A-I]/.test(row) || !/[1-9]/.test(col)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // Validate value
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    // Check if the value is already correct in the puzzle
    let index = (solver.letterToNumber(row)) * 9 + parseInt(col) - 1;
    if (puzzle[index] === value) {
      return res.json({ valid: true });
    }

    // Perform placement checks
    const rowCheck = solver.checkRowPlacement(puzzle, row, col, value);
    const colCheck = solver.checkColPlacement(puzzle, col, value);
    const regionCheck = solver.checkRegionPlacement(puzzle, row, col, value);

    // Collect conflicts if any
    let conflicts = [];
    if (!rowCheck.valid) conflicts.push('row');
    if (!colCheck.valid) conflicts.push('column');
    if (!regionCheck.valid) conflicts.push('region');

    // Determine validity
    const isValid = conflicts.length === 0;

    // Return the response
    return res.json({ valid: isValid, conflict: isValid ? [] : conflicts });
  });


  // Solve the puzzle
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;

      // Validate the puzzle
      const validationResult = solver.validate(puzzle);
      if (validationResult.error) {
        return res.json(validationResult);
      }

      // Solve the puzzle
      const solution = solver.solve(puzzle);
      if (solution.error) {
        return res.json(solution);
      }

      return res.json({ solution });
    });
};
