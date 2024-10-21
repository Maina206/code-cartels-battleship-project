// Global object to track Player 1's ships and their positions
const player1Ships = {
    'Aircraft Carrier': [],
    'Battleship': [],
    'Cruiser': [],
    'Submarine': [],
    'Destroyer': []
};

// Function to place a ship and store its coordinates for tracking
function placeLostShip(gridID, ship, startCoordinate, orientation) {
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

        // Check if within bounds and not placing on the axes
        if (row >= 0 && row < 10 && col >= 0 && col < 10) {
            const cellIndex = (row + 1) * 11 + col; // Adjusted for a 10x10 grid (including axes)
            const cell = gridContainer.children[cellIndex];
            if (cell) {
                cell.style.backgroundColor = "blue"; // Indicate ship presence
                cell.classList.add('ship'); 

                // Track the ship's coordinates in the global player1Ships object
                player1Ships[ship.name].push({ row, col, hit: false });
                
                // Display first letter of ship name
                const span = document.createElement('span');
                span.textContent = `${ship.name.charAt(0)}*`; // Show first letter of the ship
                cell.appendChild(span); 
            }
        }
    }
}

// Function to randomly select coordinates for Player 2's attack
function player2Attack() {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10) +1;
    return [row, col];
}

// Function to check if Player 2's attack hits or misses
function checkHitOrMiss([row, col]) {
    let hitShip = null;
    for (const shipName in player1Ships) {
        const shipCoordinates = player1Ships[shipName];

        // Find if Player 2's attack matches any ship's coordinates
        for (let i = 0; i < shipCoordinates.length; i++) {
            const coord = shipCoordinates[i];
            if (coord.row === row && coord.col === col) {
                // Mark the hit
                coord.hit = true;
                hitShip = shipName;
                break;
            }
        }
    }

    if (hitShip) {
        return { hit: true, ship: hitShip };
    } else {
        return { hit: false };
    }
}

// Function to update the board after a hit or miss
function updateBoardAfterAttack(gridID, row, col, hit, isPlayer2Grid = false) {
    const gridContainer = document.getElementById(gridID);
    const cellIndex = (row +1) * 11 + col; // Adjusted for axes
    const cell = gridContainer.children[cellIndex];

    if (hit) {
        cell.style.backgroundColor = "red"; // Red indicates a hit
    } else {
        cell.style.backgroundColor = "gray"; // Gray indicates a miss
    }

    // If updating Player 2's pin grid, we should also highlight the cell
    if (isPlayer2Grid) {
        cell.style.backgroundColor = hit ? "red" : "gray"; // Update pin grid accordingly
    }
}

// Function to check if all ships of a specific type have been sunk
function checkIfSunk(shipName) {
    const shipCoordinates = player1Ships[shipName];
    return shipCoordinates.every(coord => coord.hit); // Returns true if all parts are hit
}

// Function to simulate Player 2's attack loop, using setTimeout for delays
function simulatePlayer2Attacks() {
    const interval = setInterval(() => {
        const [row, col] = player2Attack();
        const result = checkHitOrMiss([row, col]);

        updateBoardAfterAttack('lostP1', row, col, result.hit); // Update Player 1's board

        // Update Player 2's pin grid
        updateBoardAfterAttack('winP2', row, col, result.hit, true); // Update Player 2's pin board

        if (result.hit && checkIfSunk(result.ship)) {
            // alert(`${result.ship} has been sunk!`);
        }

        // Check if Player 2 has won by sinking all of Player 1's ships
        if (Object.values(player1Ships).every(ship => ship.every(coord => coord.hit))) {
            alert("Player 2 wins! Player 1 loses.");
            clearInterval(interval); // Stop the attacks once Player 2 wins
        }
    }, 500); // Attack every 1 second
}

// Function to set up the initial game board with Player 1's ships
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
    placeLostShip(elementID, ships[0], 'C-3', 'horizontal'); 
    placeLostShip(elementID, ships[1], 'E-5', 'vertical');   
    placeLostShip(elementID, ships[2], 'F-9', 'vertical');
    placeLostShip(elementID, ships[3], 'I-2', 'horizontal');   
    placeLostShip(elementID, ships[4], 'A-2', 'horizontal');
}

// Function to visualize Player 2's pin grid
function visualPin(elementID) {
    createBattleshipPinGrid(elementID);
}

// Set up Player 1's board and Player 2's pin grid
function p1lostScenario() {
    visualGame('lostP1');
    visualPin('winP2');
    
    document.getElementById('simulateGame').addEventListener('click', function() {
        simulatePlayer2Attacks();
    });
}

p1lostScenario();


