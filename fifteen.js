// Initialize game start time and moves count
let gameStartTime = new Date();
let totalMoves = 0;

// Array of tile element IDs
let tileElementIds = [
    "tile-one", "tile-two", "tile-three", "tile-four",
    "tile-five", "tile-six", "tile-seven", "tile-eight",
    "tile-nine", "tile-ten", "tile-eleven", "tile-twelve",
    "tile-thirteen", "tile-fourteen", "tile-fifteen", ""
];

// Create a copy of the original tile order
let initialTileOrder = tileElementIds.slice();

// Numeric values associated with each tile
let tileNumericValues = {
    "tile-one": 1, "tile-two": 2, "tile-three": 3, "tile-four": 4,
    "tile-five": 5, "tile-six": 6, "tile-seven": 7, "tile-eight": 8,
    "tile-nine": 9, "tile-ten": 10, "tile-eleven": 11, "tile-twelve": 12,
    "tile-thirteen": 13, "tile-fourteen": 14, "tile-fifteen": 15, "tile-sixteen": 16
};

// Variable to store the selected background
let selectedBackground;

// Matrix defining valid tile movements
let tileMoveOptions = [
    [0, 1, 1, 0], [0, 1, 1, 1], [0, 1, 1, 1], [0, 0, 1, 1],
    [1, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 1],
    [1, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 1],
    [1, 1, 0, 0], [1, 1, 0, 1], [1, 1, 0, 1], [1, 0, 0, 1]
];

// Available background options
let availableBackgrounds = ["spider-man", "batman", "joker", "green-goblin", "wolverine", "venom"];

// Function to initialize the game
function initializeGame() {
    // Randomly select a background
    let backgroundIndex = Math.floor(Math.random() * 4);
    selectedBackground = availableBackgrounds[backgroundIndex];
    document.getElementById(availableBackgrounds[backgroundIndex]).selected = true;

    // Set the selected background for each tile
    for (let i = 0; i < tileElementIds.length - 1; i++) {
        document.getElementById(tileElementIds[i]).className = "tile " + availableBackgrounds[backgroundIndex];
    }
}

// Function to change the background
function changeBackground() {
    // Get the selected background from the dropdown
    let selectedClassName = document.getElementById("characters").value;

    // Check if the selected background is valid
    if (availableBackgrounds.indexOf(selectedClassName) < 0) {
        return;
    }

    // Update the selected background and redraw the board
    selectedBackground = selectedClassName;
    document.getElementById("main").innerHTML = "";

    for (let i = 0; i < tileElementIds.length; i++) {
        if (tileElementIds[i] == "") {
            document.getElementById("main").innerHTML += '<div id="tile-sixteen" class="tile"></div>';
        } else {
            let idName = tileElementIds[i];
            document.getElementById("main").innerHTML += '<div id="' + tileElementIds[i] + '" class="tile' + " " + selectedBackground + '">' + tileNumericValues[idName] + '</div>';
        }
    }
}

// Function to shuffle the board
function shuffleBoard() {
    // Reset the tile order to the initial state
    initialTileOrder = tileElementIds.slice();
    let emptyTileIndex = 15;

    // Perform 500 random tile movements
    for (let i = 0; i < 500; i++) {
        let movementId = Math.floor(Math.random() * 4);

        // Choose a valid movement
        while (tileMoveOptions[emptyTileIndex][movementId] !== 1) {
            movementId = Math.floor(Math.random() * 4);
        }

        // Determine the destination index based on the movement
        let moveTo;
        switch (movementId) {
            case 0:
                moveTo = emptyTileIndex - 4;
                break;
            case 1:
                moveTo = emptyTileIndex + 1;
                break;
            case 2:
                moveTo = emptyTileIndex + 4;
                break;
            case 3:
                moveTo = emptyTileIndex - 1;
                break;
        }

        // Swap the empty tile with the chosen tile
        let temp = initialTileOrder[emptyTileIndex];
        initialTileOrder[emptyTileIndex] = initialTileOrder[moveTo];
        initialTileOrder[moveTo] = temp;

        // Update the empty tile index
        emptyTileIndex = moveTo;
    }

    // Display the shuffled board
    displayBoard();
}

// Function to display the current board state
function displayBoard() {
    document.getElementById("main").innerHTML = "";

    // Iterate through the tile order and draw each tile
    for (let i = 0; i < initialTileOrder.length; i++) {
        if (initialTileOrder[i] == "") {
            document.getElementById("main").innerHTML += '<div id="sixteen" class="tile"></div>';
        } else {
            let idName = initialTileOrder[i];
            document.getElementById("main").innerHTML += '<div id="' + initialTileOrder[i] + '" class="tile' + " " + selectedBackground + '">' + tileNumericValues[idName] + '</div>';
        }
    }

    // Determine which tile is clickable based on the current state
    let clickableId;

    for (let j = 0; j < 4; j++) {
        if (tileMoveOptions[initialTileOrder.indexOf("")][j] === 1) {
            clickableId = initialTileOrder.indexOf("") + (j === 0 ? -4 : (j === 1 ? 1 : (j === 2 ? 4 : -1)));
            document.getElementById(initialTileOrder[clickableId]).className += " clickable";
            document.getElementById(initialTileOrder[clickableId]).setAttribute("onclick", "swapPieces(" + clickableId + ", " + initialTileOrder.indexOf("") + ")");
        }
    }
}

// Function to animate tile movement
function swapPieces(clickableId, emptyId) {
    animateMovement(clickableId, emptyId);
	
	// Play the click sound
    playClickSound();

    // Perform the tile swap after a delay for animation
    setTimeout(() => {
        let temp = initialTileOrder[emptyId];
        initialTileOrder[emptyId] = initialTileOrder[clickableId];
        initialTileOrder[clickableId] = temp;

        // Increment the moves count
        totalMoves++;

        // Redraw the board and check if the player has won
        displayBoard();
        checkIfWon();
    }, 600);
}

// Function to animate the movement of a tile
function animateMovement(clickableId, emptyId) {
    if (clickableId - 4 === emptyId) {
        document.getElementById(initialTileOrder[clickableId]).className += " animate-up";
    } else if (clickableId + 1 === emptyId) {
        document.getElementById(initialTileOrder[clickableId]).className += " animate-right";
    } else if (clickableId + 4 === emptyId) {
        document.getElementById(initialTileOrder[clickableId]).className += " animate-down";
    } else if (clickableId - 1 === emptyId) {
        document.getElementById(initialTileOrder[clickableId]).className += " animate-left";
    }
}

// Function to check if the player has won
function checkIfWon() {
    if (tileElementIds.toString() === initialTileOrder.toString()) {
        let gameEndTime = new Date();
        let elapsedMs = gameEndTime - gameStartTime;
        let seconds = Math.round(elapsedMs / 1000);

        // Display winning message with time and moves
        let html = "";
        html += "<img src='win.gif' alt='You win' />";
        html += "<p>Total time it took you to solve this puzzle (in seconds): " + seconds + "</p>";
        html += "<p>Total number of moves it took you to solve this puzzle: " + totalMoves + "</p>";

        document.getElementById("win").innerHTML = html;
    }
}

function playClickSound() {
    var clickSound = document.getElementById("clickSound");
    clickSound.currentTime = 0; // Rewind the sound to the beginning
    clickSound.play();
}
