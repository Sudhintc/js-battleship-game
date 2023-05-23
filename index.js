const gamesBoardContainer = document.querySelector("#gamesboard-container");
const optionContainer = document.querySelector(".option-container");
const flipButton = document.querySelector("#flip-button");
const startButton = document.querySelector("#start-button");
const infoDisplay = document.querySelector("#info");
const turnDisplay = document.querySelector("#turn-display");
let angle = 0;

flipButton.addEventListener("click", flip);
function flip() {
  const optionShips = Array.from(optionContainer.children);
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach(
    (optionShip) => (optionShip.style.transform = `rotate(${angle}deg)`)
  );
}

//creating board
const width = 10;

function createBoard(color, user) {
  const gameBoard = document.createElement("div");
  gameBoard.classList.add("game-board");
  gameBoard.style.backgroundColor = color;
  gameBoard.id = user;

  for (let i = 0; i < width * width; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = i;
    gameBoard.append(block);
  }
  gamesBoardContainer.append(gameBoard);
}

createBoard("pink", "player");
createBoard("yellow", "computer");

//create ship
function createShip(name, length) {
  return {
    name: name,
    length: length,
    hits: 0,
    hit() {
      this.hits++;
    },
    isSunk() {
      return this.hits === this.length;
    },
  };
}

const destroyer = createShip("destroyer", 2);
const submarine = createShip("submarine", 3);
const cruiser = createShip("cruiser", 3);
const battleship = createShip("battleship", 4);
const carrier = createShip("carrier", 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];
ships.forEach((ship) => {
  placeShip("computer", ship);
});
let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  let validStart = isHorizontal
    ? startIndex <= width * width - ship.length
      ? startIndex
      : width * width - ship.length
    : //vertical
    startIndex <= width * width - width * ship.length
    ? startIndex
    : startIndex - ship.length * width + width;

  let shipBlocks = [];
  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + width * i]);
    }
  }

  let valid;
  if (isHorizontal) {
    shipBlocks.every(
      (_shipBlock, index) =>
        (valid =
          shipBlocks[0].id % width !==
          width - (shipBlocks.length - (index + 1)))
    );
  } else {
    shipBlocks.every(
      (_shipBlock, index) =>
        (valid = shipBlocks[0].id < 90 + (width * index + 1))
    );
  }

  const notTaken = shipBlocks.every(
    (shipBlock) => !shipBlock.classList.contains("taken")
  );

  return { shipBlocks, valid, notTaken };
}

function placeShip(user, ship, startId) {
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);
  const randomBoolean = Math.random() < 0.5;
  let isHorizontal = user === "player" ? angle === 0 : randomBoolean;
  let randomStartIndex = Math.floor(Math.random() * width * width);

  let startIndex = startId ? startId : randomStartIndex;

  const { shipBlocks, valid, notTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
    });
  } else {
    if (user === "computer") placeShip(user, ship, startId);
    if (user === "player") notDropped = true;
  }
}

//drag player ships
let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach((optionShip) =>
  optionShip.addEventListener("dragstart", dragStart)
);

const allPlayerBlocks = document.querySelectorAll("#player div");
allPlayerBlocks.forEach((playerBlock) => {
  playerBlock.addEventListener("dragover", dragOver);
  playerBlock.addEventListener("drop", dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
  const ship = ships[draggedShip.id];
  highlightArea(e.target.id, ship);
}

function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  placeShip("player", ship, startId);
  if (!notDropped) {
    draggedShip.remove();
  }
}

//Add highlight
function highlightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll("#player div");
  let isHorizontal = angle === 0;
  const { shipBlocks, valid, notTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add("hover");
      setTimeout(() => shipBlock.classList.remove("hover", 500));
    });
  }
}

let gameOver = false;
let playerTurn;

//Start Game
function startGame() {
  if (playerTurn === undefined) {
    if (optionContainer.children.length != 0) {
      infoDisplay.textContent = "please place all your ships first";
    } else {
      const allBoardBlocks = document.querySelectorAll("#computer div");
      allBoardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
      playerTurn = true;
      turnDisplay.textContent = "Your Turn";
      infoDisplay.textContent = "The game has started!";
    }
  }
}
startButton.addEventListener("click", startGame);

let playerHits = [];
let computerHits = [];
let playerSunkShips = [];
let computerSunkShips = [];

function handleClick(e) {
  if (!gameOver) {
    if (e.target.classList.contains("taken")) {
      e.target.classList.add("boom");
      infoDisplay.textContent = "you hit computer ship!";
      let classes = Array.from(e.target.classList);
      classes = classes.filter((className) => className != "block");
      classes = classes.filter((className) => className != "boom");
      classes = classes.filter((className) => className != "taken");
      playerHits.push(...classes);
      checkScore("player", playerHits, playerSunkShips);
    }
    if (!e.target.classList.contains("taken")) {
      infoDisplay.textContent = "nothing hit this time";
      e.target.classList.add("empty");
    }
    playerTurn = false;
    const allBoardBlocks = document.querySelectorAll("#computer div");
    allBoardBlocks.forEach((block) => block.replaceWith(block.cloneNode(true)));
    setTimeout(computerGo, 500);
  }
}

//define computers Go
function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = "computer Go";
    infoDisplay.textContent = "Computer is thinking";

    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width);
      const allBoardBlocks = document.querySelectorAll("#player div");

      if (
        allBoardBlocks[randomGo].classList.contains("taken") &&
        allBoardBlocks[randomGo].classList.contains("boom")
      ) {
        computerGo();
        return;
      } else if (
        allBoardBlocks[randomGo].classList.contains("taken") &&
        !allBoardBlocks[randomGo].classList.contains("boom")
      ) {
        allBoardBlocks[randomGo].classList.add("boom");
        infoDisplay.textContent = "Computer hit your ship!";
        let classes = Array.from(allBoardBlocks[randomGo].classList);
        classes = classes.filter((className) => className != "block");
        classes = classes.filter((className) => className != "boom");
        classes = classes.filter((className) => className != "taken");
        computerHits.push(...classes);
        checkScore("computer", computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = "Nothing hit this time";
        allBoardBlocks[randomGo].classList.add("empty");
      }
    }, 500);

    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Your turn";
      infoDisplay.textContent = "please take your go";
      const allBoardBlocks = document.querySelectorAll("#computer div");
      allBoardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
    }, 500);
  }
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((storedShipName) => storedShipName === shipName)
        .length === shipLength
    ) {
      if (user === "player") {
        infoDisplay.textContent = `you sunk the computer's ${shipName}`;
        playerHits = userHits.filter(
          (storedShipName) => storedShipName !== shipName
        );
      }
      if (user === "computer") {
        infoDisplay.textContent = `computer sunk your ${shipName}`;
        computerHits = userHits.filter(
          (storedShipName) => storedShipName !== shipName
        );
      }
      userSunkShips.push(shipName);
    }
  }
  checkShip("destroyer", 2);
  checkShip("submarine", 3);
  checkShip("cruiser", 3);
  checkShip("battleship", 4);
  checkShip("carrier", 5);

  console.log("playerHits", playerHits);
  console.log("playerSunkShips", playerSunkShips);

  if (playerSunkShips.length === 5) {
    infoDisplay.textContent = "You sunk all the computers ship . YOU WON!";
    gameOver = true;
  }
  if (computerSunkShips.length === 5) {
    infoDisplay.textContent = "Computer has sunk all of your ship . YOU LOST!";
    gameOver = true;
  }
}
