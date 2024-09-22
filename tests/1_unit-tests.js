const chai = require("chai");
const Solver = require("../controllers/sudoku-solver.js");

const assert = chai.assert;
let solver = new Solver();
let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite("Unit Tests", () => {

    suite("Solver tests", function () {

        setup(function () {
            solver = new Solver(); // Reinitialize before each test
        });

        test("Logic handles a valid puzzle string of 81 characters", function () {
            assert.equal(solver.solve(validPuzzle), solvedPuzzle);
        });

        test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
            const puzzle = "12345678912345678912345678912345678912345678912345678912345678912345678912345678X";
            assert.deepEqual(solver.solve(puzzle), { error: 'Invalid characters in puzzle' });
        });

        test("Logic handles a puzzle string that is not 81 characters in length", function () {
            const puzzle = "123";
            assert.deepEqual(solver.validate(puzzle), { error: "Expected puzzle to be 81 characters long" });
        });

        test("Logic handles a valid row placement", function () {
            const puzzle = validPuzzle;
            const coordinate = "A2";
            const value = 3;
            assert.deepEqual(solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value), { valid: true });
        });

        test("Logic handles an invalid row placement", function () {
            const coordinate = "A3"; // valid coordinate
            const value = 5; // conflicting value in the row
            const result = solver.checkRowPlacement(validPuzzle, coordinate[0], coordinate[1], value);
            assert.equal(result.valid, false); // Expecting false since 5 is already in the row
            assert.include(result.conflict, 'row'); // Check if 'row' is included in conflicts
        });

        test("Logic handles a valid column placement", function () {
            const coordinate = "A2"; // Example coordinate
            const value = 3; // Value to check that is not in column A
            assert.deepEqual(solver.checkColPlacement(validPuzzle, coordinate[1], value), { valid: true });
        });
        
        test("Logic handles an invalid column placement", function () {
            const coordinate = "A2"; // Example coordinate that has a conflict
            const value = 2; // Value that conflicts with an existing value in column A
            assert.deepEqual(solver.checkColPlacement(validPuzzle, coordinate[1], value), { valid: false, conflict: ['column'] });
        });

        test("Logic handles a valid region (3x3 grid) placement", function () {
            const coordinate = "B1";
            const value = 9;
            assert.deepEqual(solver.checkRegionPlacement(validPuzzle, coordinate[0], coordinate[1], value), { valid: true });
        });

        test("Logic handles an invalid region (3x3 grid) placement", function () {
            const coordinate = "A1"; // valid coordinate
            const value = 2; // conflicting value in the region
            const result = solver.checkRegionPlacement(validPuzzle, coordinate[0], coordinate[1], value);
            assert.deepEqual(result, { valid: false, conflict: ['region'] }); // Check for conflict structure
        });

        test("valid puzzle strings pass the solver", function () {
            assert.equal(solver.solve(validPuzzle), solvedPuzzle);
        });

        test("Invalid puzzle strings fail the solver", function () {
            const puzzle = "12345678912345678912345678912345678912345678912345678912345678912345678912345678X";
            assert.deepEqual(solver.solve(puzzle), { error: 'Invalid characters in puzzle' });
        });

        test("Solver returns the expected solution for an incomplete puzzle", function () {
            assert.equal(solver.solve(validPuzzle), solvedPuzzle);
        });
    });
});
