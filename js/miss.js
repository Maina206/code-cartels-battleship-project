// Global object to track Player 1's ships and their positions
const player1Ships = {
    'Aircraft Carrier': [],
    'Battleship': [],
    'Cruiser': [],
    'Submarine': [],
    'Destroyer': [],
};
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
        if (row >= 1 && row < 11 && col >= 1 && col < 11) {
            const cellIndex =  (row + 1) * 11 + col; // Adjust for a for a 10x10 grid
            const cell = gridContainer.children[cellIndex];
            if (cell) {
                cell.style.backgroundColor = "blue"; // Change to blue to indicate ship presence
                cell.classList.add('ship'); // Add ship class for styling
                const span = document.createElement('span');
                span.textContent = `${ship.name.charAt(0)}`; // Display first letter of ship name
                cell.appendChild(span); // Append span to indicate ship presence

                // Track the ship's coordinates
                player1Ships[ship.name].push({ row, col, hit: false });
            }
        }
    }
}
// Array to track attacked cells
const attackedCells = [];

// Function to check if a cell has been attacked
function isCellAttacked(row, col) {
    return attackedCells.some(coord => coord.row === row && coord.col === col);
}

// Function to randomly select coordinates for Player 2's attack
function player2Attack() {
    const emptyCells = [];
    for (let row = 0; row < 11; row++) {
        for (let col = 0; col < 11; col++) {
            let isShip = false;
            // Check if cell is occupied by any ship
            for (const shipName in player1Ships) {
                const shipCoordinates = player1Ships[shipName];
                shipCoordinates.forEach(coord => {
                    if (coord.row === row && coord.col === col) {
                        isShip = true; // This coordinate has a ship
                    }
                });
            }

            // If the cell is empty (no ship) and hasn't been attacked, add it to the list of possible miss targets
            if (!isShip && !isCellAttacked(row, col)) {
                emptyCells.push({ row, col });
            }
        }
    }

    // Randomly select one of the possible empty cells (guaranteed miss)
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const selectedCell = emptyCells[randomIndex];

    // Add the attacked cell to the attackedCells array
    attackedCells.push(selectedCell);

    return [selectedCell.row, selectedCell.col];
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

// Function to update the board after a hit or miss
function updateBoardAfterAttack(gridID, row, col, miss, isPlayer2 = true) {
    const gridContainer = document.getElementById(gridID);
    const cellIndex =  (row + 1) * 11 + col; // Corrected index for 10x10 grid
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
    }
}

// Function to initiate the attack when the button is clicked
function initiateAttack() {
    const [row, col] = player2Attack();
    const result = checkHitOrMiss([row, col]);

    updateBoardAfterAttack('player1', row, col, result.miss); // Update Player 1's board

    // Update Player 2's pin grid with hit/miss
    updateBoardAfterAttack('player2', row, col, result.miss, true);
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
