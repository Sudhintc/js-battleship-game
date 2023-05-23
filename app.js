function createShip(length) {
  return {
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
const destroyer = createShip(2);
const submarine = createShip(3);
const battleship = createShip(3);
const carrier = createShip(4);

const ships = [destroyer, submarine, battleship, carrier];

function createGameBoard() {
  const board = [];
  const width = 10;
  for (let row = 0; row < 10; row++) {
    board[row] = [];
    for (let col = 0; col < 10; col++) {
      board[row][col] = "";
    }
  }

  console.log(board);

  function placeShips(ship) {
    const shipLength = ship.length;
    const row = Math.floor(Math.random() * width);
    const col = Math.floor(Math.random() * width);
    const randomBoolean = Math.random() < 0.5;
    const isHorizontal = true;

    if (isHorizontal && col + shipLength > 10) {
      // throw new Error("Ship placement out of bounds");
      // placeShips(ship);
      return false
    } else if (!isHorizontal && row + shipLength > 10) {
      // throw new Error("Ship placement out of bounds");
      // placeShips(ship);
      return false
    }

    for (let i = 0; i < shipLength; i++) {
      if (isHorizontal && board[row][col + i] !== "") {
        // throw new Error("Invalid ship placement");
        // placeShips(ship);
        return false
      } else if (!isHorizontal && board[row + i][col] !== "") {
        // throw new Error("Invalid ship placement");
        // placeShips(ship);
        return false
      }
    }

    for (let i = 0; i < shipLength; i++) {
      if (isHorizontal) {
        board[row][col + i] = ship;
      } else {
        board[row + i][col] = ship;
      }
    }
    return true
  }

  ships.forEach((ship) => {
    placeShips(ship);
  });
}
createGameBoard();

// module.exports = {
//     createShip,
// }
