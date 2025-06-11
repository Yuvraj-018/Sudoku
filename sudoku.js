    // Puzzle shown to the user 
    let puzzleBoard = [];

    // Full correct solution to check against
    let solutionBoard = [];

    // Generate a puzzle when the button is clicked
    function generatePuzzle() {

      document.querySelector('#check').disabled = false;
      clearInterval(timeId);
      time = 600;

      const solved = generateSolvedBoard(); // Create a full valid board
      solutionBoard = JSON.parse(JSON.stringify(solved)); // Copy for solution
      removeCells(solved, 50); // Remove 50 cells to create puzzle
      puzzleBoard = JSON.parse(JSON.stringify(solved)); // Save puzzle
      renderGrid(solved, true); // Render grid with editable cells

      startTimer();
    }

    // Render the 9x9 grid with inputs
    function renderGrid(board, allowInput) {
      const grid = document.getElementById("sudoku-grid");
      grid.innerHTML = ""; // Clear existing grid

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const input = document.createElement("input");
          input.type = "number";
          input.min = 1;
          input.max = 9;
          input.dataset.row = row;
          input.dataset.col = col;

          const val = board[row][col];
          input.value = val !== 0 ? val : "";

          // Disable input for prefilled cells or if it's solution view
          if (val !== 0 || !allowInput) input.disabled = true;
          else{
            input.addEventListener("input", (e) => {
                const value = Number(e.target.value);
                const r = Number(e.target.dataset.row);
                const c = Number(e.target.dataset.col);
                
                // Clear or reject invalid inputs
                if (isNaN(value) || value < 1 || value > 9) {
                  e.target.value = "";
                  e.target.style.backgroundColor = "white";
                  puzzleBoard[r][c] = 0;
                  return;
                }
              
                // Temporarily set value to test validity
                puzzleBoard[r][c] = 0;
              
                if (isValid(puzzleBoard, r, c, value)) {
                  e.target.style.backgroundColor = "#c8f7c5"; // ✅ valid move
                } else {
                  e.target.style.backgroundColor = "#f7c5c5"; // ❌ invalid move
                }

                puzzleBoard[r][c] = value;
            });
          }

          grid.appendChild(input);
        }
      }
    }

    // Check if the user's input matches the correct solution
    function checkUserSolution() {
      const inputs = document.querySelectorAll("#sudoku-grid input");
      let correct = true;

      inputs.forEach(input => {
        const row = Number(input.dataset.row);
        const col = Number(input.dataset.col);
        const userVal = Number(input.value);
        const correctVal = solutionBoard[row][col];

        // Compare user's value with correct value
        if (userVal !== correctVal) {
          input.style.backgroundColor = "#fdd"; // Red if wrong
          correct = false;
        } else {
          input.style.backgroundColor = "#dfd"; // Green if right
        }
      });

      // Show result message
      alert(correct ? "✅ Correct! Well done!" : "❌ Some values are incorrect.");
    }

    // Show the correct solution in the same grid
    function solvePuzzle() {
      document.querySelector('#check').disabled = true;
      renderGrid(solutionBoard, false); // Show full solution, no edits
    }

    // ----------- SUDOKU SOLVER LOGIC -----------

    // Create a new completely filled and valid Sudoku board
    function generateSolvedBoard() {
      const board = Array.from({ length: 9 }, () => Array(9).fill(0));
      fillSudokuRandomly(board); // Fill board randomly and completely
      return board;
    }

    // Fill diagonal 3x3 boxes randomly, then solve entire board
    function fillSudokuRandomly(board) {
      for (let i = 0; i < 9; i += 3) {
        fillBox(board, i, i); // Fill 3x3 box at (i,i)
      }
      solve(board); // Solve rest of the board
    }

    // Fill a 3x3 box with shuffled unique numbers
    function fillBox(board, row, col) {
      let nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          board[row + i][col + j] = nums.pop();
        }
      }
    }

    // Fisher-Yates shuffle to randomize array
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // Remove "count" number of cells to create a puzzle
    function removeCells(board, count) {
      let removed = 0;
      while (removed < count) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
          board[row][col] = 0;
          removed++;
        }
      }
    }

    // Check if a number can be placed at a specific cell
    function isValid(board, row, col, num) {
     for (let i = 0; i < 9; i++) {
       if (
         board[row][i] === num ||
         board[i][col] === num ||
         board[3 * Math.floor(row / 3) + Math.floor(i / 3)][
           3 * Math.floor(col / 3) + (i % 3)
         ] === num) return false;
     }
     return true;
   }
    // Backtracking algorithm to solve Sudoku
    function solve(board) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve(board)) return true; // Continue solving
                board[row][col] = 0; // Backtrack
              }
            }
            return false; // No valid number found
          }
        }
      }
      return true; // Solved!
    }


    const timer = document.getElementById('timer');
    let time 
    let timeId;
    function startTimer(){
        timeId = setInterval(()=>{
            time--;
            updateTimer();
    
            if(time === 0){
                clearInterval(timeId);
                solvePuzzle();
            }
        },1000)
    }
function updateTimer(){
    timer.textContent = `Time Left: ${time}s`
}