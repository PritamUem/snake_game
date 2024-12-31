// Game Constants & Variables
let inputDir = {x: 0, y: 0}; // Initialize the direction of the snake's movement (x and y)
const foodSound = new Audio('music/food.mp3'); // Create an audio object for the food sound
const gameOverSound = new Audio('music/gameover.mp3'); // Create an audio object for the game over sound
const moveSound = new Audio('music/move.mp3'); // Create an audio object for the move sound
const musicSound = new Audio('music/music.mp3'); // Create an audio object for the background music
let speed = 19; // Set the speed of the game
let score = 0; // Initialize the player's score
let lastPaintTime = 0; // Initialize the last time the game was painted
let snakeArr = [ // Initialize the snake's starting position
    {x: 13, y: 15} // The snake starts at coordinates (13, 15)
];

food = {x: 6, y: 7}; // Set the initial position of the food

// Game Functions

// Animation Frame Request: It uses window.requestAnimationFrame(main) to repeatedly call itself, creating a loop that updates the game state and renders the game at the browser's refresh rate.

// Time Check: It checks if enough time has passed since the last frame was rendered (lastPaintTime). This is done to control the game's speed. If not enough time has passed, it exits the function early.

// Update Last Paint Time: If enough time has passed, it updates lastPaintTime to the current time (ctime).

// Game Engine Call: Finally, it calls the gameEngine() function, which contains the logic for updating the game state (like moving the snake, checking for collisions, and rendering the snake and food).


function main(ctime) { // Main game loop function
    window.requestAnimationFrame(main); // Request the next animation frame
    // console.log(ctime) // Uncomment to log the current time
    if((ctime - lastPaintTime)/1000 < 1/speed){ // Check if enough time has passed for the next frame
        return; // If not enough time has passed, exit the function
    }
    lastPaintTime = ctime; // Update the last paint time to the current time
    gameEngine(); // Call the game engine to update the game state
}

function isCollide(snake) { // Function to check for collisions
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) { // Loop through the snake's body starting from the second segment
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){ // Check if the head collides with any part of the body
            return true; // Return true if there is a collision
        }
    }
    // If you bump into the wall
    if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0){ // Check if the head is out of bounds
        return true; // Return true if there is a collision with the wall
    }
        
    return false; // Return false if no collisions
}

function gameEngine(){ // Function to update the game state
    // Part 1: Updating the snake array & Food
    if(isCollide(snakeArr)){ // Check for collisions
        gameOverSound.play(); // Play the game over sound
        musicSound.pause(); // Pause the background music
        inputDir =  {x: 0, y: 0}; // Stop the snake's movement
        alert("Game Over. Press any key to play again!"); // Alert the player that the game is over
        snakeArr = [{x: 13, y: 15}]; // Reset the snake's position to the starting point
        musicSound.play(); // Play the background music again
        score = 0; // Reset the score to 0
    }

    // If you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){ // Check if the snake's head is on the food
        foodSound.play(); // Play the food sound
        score += 1; // Increment the score by 1
        if(score > hiscoreval){ // Check if the current score is greater than the high score
            hiscoreval = score; // Update the high score
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval)); // Save the high score in local storage
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval; // Update the high score display
        }
        scoreBox.innerHTML = "Score: " + score; // Update the score display
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y}); // Add a new head to the snake
        let a = 2; // Minimum x and y value for food
        let b = 16; // Maximum x and y value for food
        food = {x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random())}; // Generate a new random position for the food
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) { // Loop through the snake's body from the second last segment to the first
        snakeArr[i + 1] = {...snakeArr[i]}; // Move each segment to the position of the segment in front of it
    }

    snakeArr[0].x += inputDir.x; // Update the head's x position based on the input direction
    snakeArr[0].y += inputDir.y; // Update the head's y position based on the input direction

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = ""; // Clear the board before rendering the snake
    snakeArr.forEach((e, index) => { // Loop through each segment of the snake
        snakeElement = document.createElement('div'); // Create a new div element for the snake segment
        snakeElement.style.gridRowStart = e.y; // Set the grid row for the snake segment
        snakeElement.style.gridColumnStart = e.x; // Set the grid column for the snake segment

        if(index === 0){ // Check if it's the head of the snake
            snakeElement.classList.add('head'); // Add the 'head' class to the head segment
        }
        else{
            snakeElement.classList.add('snake'); // Add the 'snake' class to the body segments
        }
        board.appendChild(snakeElement); // Append the snake segment to the board
    });
    // Display the food
    foodElement = document.createElement('div'); // Create a new div element for the food
    foodElement.style.gridRowStart = food.y; // Set the grid row for the food
    foodElement.style.gridColumnStart = food.x; // Set the grid column for the food
    foodElement.classList.add('food'); // Add the 'food' class to the food element
    board.appendChild(foodElement); // Append the food element to the board
}

// Main logic starts here
musicSound.play(); // Start playing the background music
let hiscore = localStorage.getItem("hiscore"); // Retrieve the high score from local storage
if(hiscore === null){ // Check if there is no high score saved
    hiscoreval = 0; // Initialize the high score to 0
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval)); // Save the high score in local storage
}
else{
    hiscoreval = JSON.parse(hiscore); // Parse the high score from local storage
    hiscoreBox.innerHTML = "HiScore: " + hiscore; // Update the high score display
}

window.requestAnimationFrame(main); // Start the main game loop
window.addEventListener('keydown', e => { // Add an event listener for keydown events
    inputDir = {x: 0, y: 1}; // Start the game by setting the initial direction downwards
    moveSound.play(); // Play the move sound
    switch (e.key) { // Check which key was pressed
        case "ArrowUp": // If the up arrow key is pressed
            console.log("ArrowUp"); // Log the key press
            inputDir.x = 0; // Set the x direction to 0
            inputDir.y = -1; // Set the y direction to -1 (up)
            break;

        case "ArrowDown": // If the down arrow key is pressed
            console.log("ArrowDown"); // Log the key press
            inputDir.x = 0; // Set the x direction to 0
            inputDir.y = 1; // Set the y direction to 1 (down)
            break;

        case "ArrowLeft": // If the left arrow key is pressed
            console.log("ArrowLeft"); // Log the key press
            inputDir.x = -1; // Set the x direction to -1 (left)
            inputDir.y = 0; // Set the y direction to 0
            break;

        case "ArrowRight": // If the right arrow key is pressed
            console.log("ArrowRight"); // Log the key press
            inputDir.x = 1; // Set the x direction to 1 (right)
            inputDir.y = 0; // Set the y direction to 0
            break;
        default: // If any other key is pressed
            break; // Do nothing
    }
});