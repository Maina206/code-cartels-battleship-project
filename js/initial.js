//general create function
function createSpan(r, c) {
    const span = document.createElement("span");
    span.style.width = "20px";
    span.style.height = "20px";
    span.style.borderRadius = "10000px";
    span.style.backgroundColor = "red";
    span.id = `${r},${c},step1,span1`;
  
    return span;
  }
  

     // Function to create the Battleship grid
     function createBattleshipGrid(elementID) {
        const gridContainer = document.getElementById(elementID);
        const rows = 10;
        const cols = 10;
        const rowLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

        // Create the top-left corner cell (empty)
        const emptyCell = document.createElement("div");
        emptyCell.className = "cell label";
        gridContainer.appendChild(emptyCell);

        // Create the column labels (1 to 10)
        for (let col = 1; col <= cols; col++) {
          const colLabel = document.createElement("div");
          colLabel.className = "cell label";
          colLabel.textContent = col;
          gridContainer.appendChild(colLabel);
        }

        // Create the grid with row labels and cells
        for (let row = 0; row < rows; row++) {
          // Create the row label (A to J)
          const rowLabel = document.createElement("div");
          rowLabel.className = "cell label";
          rowLabel.textContent = rowLabels[row];
          gridContainer.appendChild(rowLabel);

          // Create the grid cells for each row
          for (let col = 1; col <= cols; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.setAttribute("data-coordinate", `${rowLabels[row]}-${col}`);
            // cell.textContent = `${rowLabels[row]}-${col}`; // Optional: show the coordinates
            gridContainer.appendChild(cell);
          }
        }
      }


//placing and displaying the ships
function placeShip(gridID, ship, startCoordinate, orientation) {
    const gridContainer = document.getElementById(gridID);
    const [startRow, startCol] = convertCoordinate(startCoordinate);
    
    for (let i = 0; i < ship.length; i++) {
        let row, col;

        if (orientation === 'horizontal') {
            row = startRow;
            col = startCol + i;
        } else { // vertical
            row = startRow + i;
            col = startCol;
        }

        // Check if within bounds
        if (row >= 0 && row < 10 && col > 0 && col <= 10) {
            const cellIndex = (row + 1) * 11 + col; // Calculate index based on grid structure
            const cell = gridContainer.children[cellIndex];
            cell.style.backgroundColor = "blue";

            if (cell) {
                cell.classList.add('ship'); // Add ship class for styling
                const span = document.createElement('span');
                span.textContent = `${ship.name.charAt(0)}*`;
                // Display first letter of ship name
                cell.appendChild(span); // Append span to indicate ship presence
            }
        }
    }
}

// Helper function to convert coordinate from string to array
function convertCoordinate(coordinate) {
    const rowLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const rowIndex = rowLabels.indexOf(coordinate[0]);
    const colIndex = parseInt(coordinate[2]); // Convert column from string to index
    return [rowIndex, colIndex];
}

// Function to visualize game with ships placed
function visualGame(elementID) {
    createBattleshipGrid(elementID);

    // Define ships with lengths and names
    const ships = [
        { name: 'Aircraft Carrier', length: 5 },
        { name: 'Battleship', length: 4 },
        { name: 'Cruiser', length: 3 },
        { name: 'Submarine', length: 3 },
        { name: 'Destroyer', length: 2 }
    ];

    // Place ships on the board (hardcoded for demonstration)
    placeShip('gameBoard', ships[0], 'C-3', 'horizontal'); 
    placeShip('gameBoard', ships[1], 'E-5', 'vertical');   
    placeShip('gameBoard', ships[2], 'F-9', 'vertical');
    placeShip('gameBoard', ships[3], 'I-2', 'horizontal');   
    placeShip('gameBoard', ships[4], 'A-1', 'horizontal');
   
}

// Initialize game visualization
visualGame('gameBoard');
