

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
            gridContainer.appendChild(cell);
        }
    }
}

// Function to place a ship on the grid
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
            const cellIndex = (row + 1) * 11 + col;
            const cell = gridContainer.children[cellIndex];
            if (cell) {
                cell.style.backgroundColor = "blue";
                cell.classList.add('ship');
                const span = document.createElement('span');
                span.textContent = `${ship.name.charAt(0)}*`;
                cell.appendChild(span);
            }
        }
    }
}

// Helper function to convert coordinate
function convertCoordinate(coordinate) {
    const rowLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const rowIndex = rowLabels.indexOf(coordinate[0]);
    const colIndex = parseInt(coordinate.substring(2)); // Handle multi-digit columns
    return [rowIndex, colIndex];
}

// Function to create and visualize the game with two grids
function visualGame(mainGridID, sinkGridID) {
    createBattleshipGrid(mainGridID);
    createBattleshipGrid(sinkGridID);

    // Define ships with lengths and names
    const ships = [
        { name: 'Aircraft Carrier', length: 5 },
        { name: 'Battleship', length: 4 },
        { name: 'Cruiser', length: 3 },
        { name: 'Submarine', length: 3 },
        { name: 'Destroyer', length: 2 }
    ];

    // Place ships on the main grid for demonstration
    placeShip(mainGridID, ships[0], 'C-3', 'horizontal'); 
    placeShip(mainGridID, ships[1], 'E-5', 'vertical');   
    placeShip(mainGridID, ships[2], 'F-9', 'vertical');
    placeShip(mainGridID, ships[3], 'I-2', 'horizontal');   
    placeShip(mainGridID, ships[4], 'A-2', 'horizontal');

    // For demonstration, place a ship on the sink grid
    placeShip(sinkGridID, ships[0], 'B-5', 'horizontal');
}

// Initialize and visualize the game
function visualizeGame() {
    visualGame('gameBoard', 'sinkBoard');
}

// Call the visualizeGame function to set up the game
visualizeGame();



function convertCoordinate(coordinate) {
    const rowLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const rowIndex = rowLabels.indexOf(coordinate[0]);
    const colIndex = parseInt(coordinate.split('-')[1], 10) - 1; // Adjust for 0-indexing
    return [rowIndex, colIndex];
}

// Global object to track Player 1's ships and their positions
const player1Ships = {
    'Aircraft Carrier': [],
    'Battleship': [],
    'Cruiser': [],
    'Submarine': [],
    'Destroyer': [],
};

// Function to create the game grid
function createBattleshipGrid(gridID) {
    const gridContainer = document.getElementById(gridID);
    gridContainer.innerHTML = ''; // Clear any previous content
    for (let i = 0; i <= 10; i++) {
        for (let j = 0; j <= 10; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.border = '1px solid black';
            cell.style.width = '40px';
            cell.style.height = '40px';
            cell.style.position = 'relative';
            cell.dataset.row = i;
            cell.dataset.col = j;
            gridContainer.appendChild(cell);
        }
    }
}

// Function to place ships on the grid
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
        if (row >= 0 && row < 10 && col >= 0 && col < 10) {
            const cellIndex = (row + 1) * 11 + col; // Corrected index for a 10x10 grid
            const cell = gridContainer.children[cellIndex];
            if (cell) {
                cell.style.backgroundColor = "blue"; // Change to blue to indicate ship presence
                cell.classList.add('ship'); // Add ship class for styling
                const span = document.createElement('span');
                span.textContent = ship.name.charAt(0); // Display first letter of ship name
                cell.appendChild(span); // Append span to indicate ship presence
                
                // Track the ship's coordinates
                player1Ships[ship.name].push({ row, col, hit: false });
            }
        }
    }
}

// Function to randomly select coordinates for Player 2's attack
function player2Attack() {
    const emptyCells = [];
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            let isShip = false;
            // Check if cell is occupied by any ship
            for (const shipName in player1Ships) {
                const shipCoordinates = player1Ships[shipName];
                shipCoordinates.forEach(coord => {
                    if (coord.row === row && coord.col === col)
                        isShip = true; // This coordinate has a ship
                });
            }
            // If the cell is empty (no ship), add it to the list of possible miss targets
            if (!isShip) {
                emptyCells.push([row, col]);
            }
        }
    }

    // Randomly select one of the possible empty cells (guaranteed miss)
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

// Function to check if Player 2's attack hits or misses
function checkHitOrMiss([row, col]) {
    for (const shipName in player1Ships) {
        const shipCoordinates = player1Ships[shipName];
        for (let coord of shipCoordinates) {
            if (coord.row === row && coord.col === col) {
                coord.hit = true; // Mark as hit
                return { miss: false, ship: shipName };
            }
        }
    }
    return { miss: true }; // Miss if no ships found at the coordinates
}

// Function to check if a ship is sunk
function isShipSunk(shipName) {
    const shipCoordinates = player1Ships[shipName];
    return shipCoordinates.every(coord => coord.hit);
}

// Function to update the board after a hit or miss
function updateBoardAfterAttack(gridID, row, col, miss, shipName = null, isPlayer2 = true) {
    const gridContainer = document.getElementById(gridID);
    const cellIndex = row * 10 + col; // Corrected index for 10x10 grid
    const cell = gridContainer.children[cellIndex];

    if (miss) {
        cell.style.backgroundColor = "grey"; // Grey indicates a miss
        if (isPlayer2) {
            const span = document.createElement('span');
            span.textContent = "M"; // Mark miss
            span.style.color = "white"; // Better contrast for visibility
            cell.appendChild(span);
        }
    } else {
        cell.style.backgroundColor = "red"; // Red indicates a hit
        if (isPlayer2) {
            const span = document.createElement('span');
            span.textContent = "H"; // Mark hit
            span.style.color = "white"; // Better contrast for visibility
            cell.appendChild(span);
        }
        
        // Check if the hit sunk the ship
        if (shipName && isShipSunk(shipName)) {
            alert(`${shipName} has been sunk!`);
            // Optionally update all ship cells to a different color to indicate sinking
            player1Ships[shipName].forEach(coord => {
                const sinkCellIndex = coord.row * 10 + coord.col;
                const sinkCell = gridContainer.children[sinkCellIndex];
                sinkCell.style.backgroundColor = "black"; // Black indicates a sunk ship
            });
        }
    }
}

// Function to initiate the attack when the button is clicked
function initiateAttack() {
    const [row, col] = player2Attack();
    const result = checkHitOrMiss([row, col]);

    updateBoardAfterAttack('player1', row, col, result.miss, result.ship); // Update Player 1's board

    // Update Player 2's pin grid with hit/miss
    updateBoardAfterAttack('player2', row, col, result.miss, result.ship, true); 
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

    // Place ships on the main board
    placeShip(elementID, ships[0], 'C-6', 'horizontal'); 
    placeShip(elementID, ships[1], 'E-5', 'vertical');   
    placeShip(elementID, ships[2], 'F-9', 'vertical');
    placeShip(elementID, ships[3], 'J-2', 'horizontal');   
    placeShip(elementID, ships[4], 'A-4', 'horizontal');
}

// Function to visualize Player 2's pin grid
function visualPin(elementID) {
    createBattleshipGrid(elementID);
}

// Set up Player 1's board and Player 2's pin grid
function missScenarioP1() {
    visualGame("player1");
}
missScenarioP1();

function missScenarioP2() {
    visualPin("player2");
}
missScenarioP2();

const attackButton = document.createElement('button');
attackButton.id = "attackButton"; // Add an ID
attackButton.className = "small-button"; // Add the small-button class
attackButton.textContent = "Player 2 Attack";
attackButton.addEventListener('click', initiateAttack);
document.getElementById('players').appendChild(attackButton);
// Function to reveal all ships for Player 1
function revealShips(gridID) {
    const gridContainer = document.getElementById(gridID);
    for (const shipName in player1Ships) {
        const shipCoordinates = player1Ships[shipName];
        shipCoordinates.forEach(coord => {
            const cell = getCell(gridContainer, coord.row, coord.col);
            if (cell) {
                cell.style.backgroundColor = "blue"; // Indicate ship presence
                cell.classList.add('revealed'); // Optional class for styling
            }
        });
    }
}

// Add event listener to the "Sink" button to reveal ships when clicked
function setupSinkButton() {
    const sinkButton = document.getElementById("sink"); // Assuming the Sink button has the ID "sink"
    if (sinkButton) {
        sinkButton.addEventListener('click', () => revealShips('player1'));
    }
}

// Call the function to set up the Sink button event listener
setupSinkButton();



