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

        // Check if within bounds
        if (row >= 0 && row < 10 && col > 0 && col <= 10) {
            const cellIndex = (row + 1) * 11 + col; // Calculate index based on grid structure
            const cell = gridContainer.children[cellIndex];
            cell.style.backgroundColor = "red";

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

function visualPin(elementID) {
    createBattleshipPinGrid(elementID);

    // Define ships with lengths and names
    const ships = [
        { name: 'Aircraft Carrier', length: 5 },
        { name: 'Battleship', length: 4 },
        { name: 'Cruiser', length: 3 },
        { name: 'Submarine', length: 3 },
        { name: 'Destroyer', length: 2 }
    ];

    // Place ships on the board (hardcoded for demonstration)
    // placeLostShip(elementID, ships[0], 'C-3', 'horizontal'); 
    // placeLostShip(elementID, ships[1], 'E-5', 'vertical');   
    // placeLostShip(elementID, ships[2], 'F-9', 'vertical');
    // placeLostShip(elementID, ships[3], 'I-2', 'horizontal');   
    // placeLostShip(elementID, ships[4], 'A-2', 'horizontal');
   
}

function p1lostScenario () {
    visualGame('lostP1');
}

p1lostScenario();

function p2WinScenario () {
    visualPin('winP2');
}

p2WinScenario();
