function createBattleshipGrid(elementID) {
    const gridContainer = document.getElementById(elementID);
    if (!gridContainer) return;

    // Clear any existing content
    gridContainer.innerHTML = '';

    // Create a 10x10 grid
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell'; // Add a class for styling
            cell.dataset.row = row;
            cell.dataset.col = col;
            gridContainer.appendChild(cell);
        }
    }
}
function visualGame(elementID) {
    createBattleshipGrid(elementID);
}


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
            const cellIndex = (row + 1) * 11 + col; // Adjust for a 10x10 grid
            const cell = gridContainer.children[cellIndex];
            if (cell) {
                cell.style.backgroundColor = "blue"; // Indicate ship presence
                cell.classList.add('ship'); // Add ship class for styling
                const span = document.createElement('span');
                span.textContent = ship.name.charAt(0); // Display first letter of ship name
                cell.appendChild(span);

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
            for (const shipName in player1Ships) {
                const shipCoordinates = player1Ships[shipName];
                shipCoordinates.forEach(coord => {
                    if (coord.row === row && coord.col === col) {
                        isShip = true; // Coordinate has a ship
                    }
                });
            }

            if (!isShip && !isCellAttacked(row, col)) {
                emptyCells.push({ row, col });
            }
        }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const selectedCell = emptyCells[randomIndex];

    attackedCells.push(selectedCell);

    return [selectedCell.row, selectedCell.col];
}

// Function to check if Player 2's attack hits, misses, or sinks a ship
function checkHitOrSink([row, col]) {
    for (const shipName in player1Ships) {
        const shipCoordinates = player1Ships[shipName];
        for (let coord of shipCoordinates) {
            if (coord.row === row && coord.col === col) {
                coord.hit = true;
                
                // Check if all parts of the ship are hit (sunk)
                const isSunk = shipCoordinates.every(c => c.hit);
                return { sink: isSunk, ship: shipName };
            }
        }
    }
    return { sink: false }; // No ship at the coordinates
}

// Function to update the board after a hit, sink, or miss
function updateBoardAfterAttack(gridID, row, col, sink, isPlayer2 = true) {
    const gridContainer = document.getElementById(gridID);
    const cellIndex = (row + 1) * 11 + col;
    const cell = gridContainer.children[cellIndex];

    if (!sink) {
        cell.style.backgroundColor = "grey"; // Grey indicates no sink
        if (isPlayer2) {
            const span = document.createElement('span');
            span.textContent = "N"; // Mark no sink
            span.style.color = "white";
            cell.appendChild(span);
        }
    } else {
        cell.style.backgroundColor = "black"; // Black indicates a sink
        if (isPlayer2) {
            const span = document.createElement('span');
            span.textContent = "S"; // Mark sink
            span.style.color = "white";
            cell.appendChild(span);
        }
    }
}

// Function to initiate the attack when the button is clicked
function initiateAttack() {
    const [row, col] = player2Attack();
    const result = checkHitOrSink([row, col]);

    updateBoardAfterAttack('player1', row, col, result.sink); // Update Player 1's board

    // Update Player 2's pin grid with hit/sink
    updateBoardAfterAttack('player2', row, col, result.sink, true);
}

// Function to visualize Player 2's pin grid
function visualPin(elementID) {
    createBattleshipGrid(elementID);
}

// Set up Player 1's board and Player 2's pin grid
function sinkScenarioP1() {
    visualGame("player1");
}
sinkScenarioP1();

function sinkScenarioP2() {
    visualPin("player2");
}
sinkScenarioP2();

const attackButton = document.createElement('button');
attackButton.id = "attackButton";
attackButton.className = "small-button";
attackButton.textContent = "Player 2 Attack";
attackButton.addEventListener('click', initiateAttack);
document.getElementById('players').appendChild(attackButton);
