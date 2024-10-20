
// Function to convert coordinate notation (e.g., 'A-1') to row and column indices
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
    'Destroyer': []
};

// Function to create the game grid
function createBattleshipGrid(gridID) {
    const gridContainer = document.getElementById(gridID);
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
function placehitShip(gridID, ship, startCoordinate, orientation) {
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
            const cellIndex = (row + 1) * 11 + col; // Adjusted for a 10x10 grid
            const cell = gridContainer.children[cellIndex];
            cell.style.backgroundColor = "blue"; // Change to blue to indicate ship presence

            if (cell) {
                cell.classList.add('ship'); // Add ship class for styling
                const span = document.createElement('span');
                span.textContent = `${ship.name.charAt(0)}**`; // Display first letter of ship name
                cell.appendChild(span); // Append span to indicate ship presence
                
                // Track the ship's coordinates
                player1Ships[ship.name].push({ row, col, hit: false });
            }
        }
    }
}

// Function to randomly select coordinates for Player 2's attack
function player2Attack() {
    const possibleHits = [];
    for (const shipName in player1Ships) {
        const shipCoordinates = player1Ships[shipName];
        shipCoordinates.forEach(coord => {
            if (!coord.hit) { // Only target un-hit parts
                possibleHits.push([coord.row, coord.col]);
            }
        });
    }

    // Randomly select one of the possible hit coordinates
    const randomIndex = Math.floor(Math.random() * possibleHits.length);
    return possibleHits[randomIndex];
}

// Function to check if Player 2's attack hits or misses
function checkHitOrMiss([row, col]) {
    for (const shipName in player1Ships) {
        const shipCoordinates = player1Ships[shipName];
        for (let coord of shipCoordinates) {
            if (coord.row === row && coord.col === col) {
                coord.hit = true; // Mark the hit
                return { hit: true, ship: shipName };
            }
        }
    }
    return { hit: false };
}

// Function to update the board after a hit or miss
function updateBoardAfterAttack(gridID, row, col, hit, isPlayer2 = false) {
    const gridContainer = document.getElementById(gridID);
    const cellIndex = (row + 1) * 11 + col; // Adjusted for axes
    const cell = gridContainer.children[cellIndex];

    if (hit) {
        cell.style.backgroundColor = "red"; // Red indicates a hit
        if (isPlayer2) {
            const span = document.createElement('span');
            span.textContent = "H"; // Mark hit
            span.style.color = "white"; // Better contrast for visibility
            cell.appendChild(span);
        }
    } else {
        cell.style.backgroundColor = "gray"; // Gray indicates a miss
        if (isPlayer2) {
            const span = document.createElement('span');
            span.textContent = "M"; // Mark miss
            span.style.color = "white"; // Better contrast for visibility
            cell.appendChild(span);
        }
    }
}

// Function to initiate the attack when the button is clicked
function initiateAttack() {
    const [row, col] = player2Attack();
    const result = checkHitOrMiss([row, col]);

    updateBoardAfterAttack('player1', row, col, result.hit); // Update Player 1's board

    // Update Player 2's pin grid with hit/miss
    updateBoardAfterAttack('player2', row, col, result.hit, true); 

    // if (result.hit) {
    //     alert(`${result.ship} has been hit!`);
    // }

    // Check if Player 2 has won by sinking all of Player 1's ships
    if (Object.values(player1Ships).every(ship => ship.every(coord => coord.hit))) {
        alert("Player 2 wins! Player 1 loses.");
    }
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
    placehitShip(elementID, ships[0], 'C-6', 'horizontal'); 
    placehitShip(elementID, ships[1], 'E-5', 'vertical');   
    placehitShip(elementID, ships[2], 'F-9', 'vertical');
    placehitShip(elementID, ships[3], 'J-2', 'horizontal');   
    placehitShip(elementID, ships[4], 'A-4', 'horizontal');
}

// Function to visualize Player 2's pin grid
function visualPin(elementID) {
    createBattleshipGrid(elementID);
}

// Set up Player 1's board and Player 2's pin grid
function hitScenarioP1() {
    visualGame("player1");
}
hitScenarioP1();

function hitScenarioP2() {
    visualPin("player2");
}
hitScenarioP2();


const attackButton = document.createElement('button');
attackButton.id = "attackButton"; // Add an ID
attackButton.className = "small-button"; // Add the small-button class
attackButton.textContent = "Player 2 Attack";
attackButton.addEventListener('click', initiateAttack);
document.getElementById('players').appendChild(attackButton);
