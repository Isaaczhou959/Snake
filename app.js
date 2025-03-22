const canvas = document.getElementById("myCanvas");
const drawCanvas = canvas.getContext("2d");
//getContext() method will send back a canvas drawing context;
const snakeUnit = 20;
const row = canvas.height / snakeUnit; // 320 / 20
const colomn = canvas.width / snakeUnit; // 320 / 20

//Initial setup.
//Create snake
let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}
createSnake();

//Initial Score
let score = 0;
let highestScore;
loadScore();
document.getElementById("yourScore").innerHTML = "Game Score: " + score;
document.getElementById("yourScore2").innerHTML =
  "Highest Score : " + highestScore;

// Create fruit
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * colomn) * snakeUnit;
    this.y = Math.floor(Math.random() * row) * snakeUnit;
  }

  drawFruit() {
    drawCanvas.fillStyle = "pink";
    drawCanvas.fillRect(this.x, this.y, snakeUnit, snakeUnit);
  }

  newLocation() {
    let overlap = false;
    let newX;
    let newY;

    function checkoverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          overlap = true;
          return;
        } else {
          overlap = false;
        }
      }
    }

    do {
      newX = Math.floor(Math.random() * colomn) * snakeUnit;
      newY = Math.floor(Math.random() * row) * snakeUnit;
      checkoverlap(newX, newY);
    } while (overlap);

    this.x = newX;
    this.y = newY;
  }
}

let gameFruit = new Fruit();

//Set the initial direction.
let direction = "right";
window.addEventListener("keydown", setDirection);

function setDirection(e) {
  if (e.key == "ArrowRight" && direction != "left") {
    direction = "right";
    // console.log(direction);
  } else if (e.key == "ArrowLeft" && direction != "right") {
    direction = "left";
    // console.log(direction);
  } else if (e.key == "ArrowDown" && direction != "up") {
    direction = "down";
    // console.log(direction);
  } else if (e.key == "ArrowUp" && direction != "down") {
    direction = "up";
    // console.log(direction);
  }
  //Prevent accidental self-collision due to fast user input.
  window.removeEventListener("keydown", setDirection);
}

function draw() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(game);
      alert("Game over!");
      return;
    }
  }

  drawCanvas.fillStyle = "black";
  drawCanvas.fillRect(0, 0, canvas.width, canvas.height);
  gameFruit.drawFruit();
  for (let i = 0; i < snake.length; i++) {
    // Set the fill color to snake unit
    if (i == 0) {
      // Set the color of snake head
      drawCanvas.fillStyle = "lightgreen";
    } else {
      drawCanvas.fillStyle = "lightblue";
    }
    drawCanvas.strokeStyle = "white";

    // fillrect(para1,para2,para3,para4) = Fills the entire area of the snake.
    // para1 = X-axis coordinates para2 = Y-axis coordinates para3 = width para4 = height
    drawCanvas.fillRect(snake[i].x, snake[i].y, snakeUnit, snakeUnit);
    //Draws only the border of the snake unit.
    drawCanvas.strokeRect(snake[i].x, snake[i].y, snakeUnit, snakeUnit);
  }

  //Get the X and Y coordinate of the snake head
  snakeHeadX = snake[0].x;
  snakeHeadY = snake[0].y;
  if (direction == "right") {
    // Correct the snake's head if it goes out of bounds.
    if (snakeHeadX < canvas.width - snakeUnit) {
      snakeHeadX += snakeUnit;
    } else {
      snakeHeadX = 0;
    }
  } else if (direction == "down") {
    // Correct the snake's head if it goes out of bounds.
    if (snakeHeadY < canvas.height - snakeUnit) {
      snakeHeadY += snakeUnit;
    } else {
      snakeHeadY = 0;
    }
  } else if (direction == "left") {
    // Correct the snake's head if it goes out of bounds.
    if (snakeHeadX > 0) {
      snakeHeadX -= snakeUnit;
    } else {
      snakeHeadX = canvas.width - snakeUnit;
    }
  } else {
    // Correct the snake's head if it goes out of bounds.
    if (snakeHeadY > 0) {
      snakeHeadY -= snakeUnit;
    } else {
      snakeHeadY = canvas.height - snakeUnit;
    }
  }

  let newHead = {
    x: snakeHeadX,
    y: snakeHeadY,
  };
  // Check if the snake has eaten the fruit.
  if (snake[0].x == gameFruit.x && snake[0].y == gameFruit.y) {
    score++;
    setHighestScore(score);
    document.getElementById("yourScore").innerHTML = "Game score: " + score;
    document.getElementById("yourScore2").innerHTML =
      "Highest Score : " + highestScore;
    gameFruit.newLocation();
  } else {
    // Remove last unit of the snake
    snake.pop();
  }

  // Create a new head
  console.log(snake.length);
  snake.unshift(newHead);

  //Prevent accidental self-collision due to fast user input.
  window.addEventListener("keydown", setDirection);
}

let game = setInterval(draw, 100);

function loadScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
