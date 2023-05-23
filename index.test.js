const { createGameboard, createShip } = require("./gameboard");

test("placeShip should correctly place a ship on the gameboard", () => {
  const gameboard = createGameboard();
  const ship = createShip(3);

  gameboard.placeShip(ship, 2, 3, true);

  expect(gameboard.board[2][3]).toBe(ship);
  expect(gameboard.board[2][4]).toBe(ship);
  expect(gameboard.board[2][5]).toBe(ship);
});

test('receiveAttack should return "miss" if the attack misses', () => {
  const gameboard = createGameboard();

  const result = gameboard.receiveAttack(4, 6);

  expect(result).toBe("miss");
  expect(gameboard.missedAttacks.length).toBe(1);
  expect(gameboard.missedAttacks[0]).toEqual({ row: 4, col: 6 });
});

test('receiveAttack should return "hit" if the attack hits a ship', () => {
  const gameboard = createGameboard();
  const ship = createShip(3);
  gameboard.placeShip(ship, 2, 3, true);

  const result = gameboard.receiveAttack(2, 4);

  expect(result).toBe("hit");
  expect(ship.hits).toBe(1);
  expect(gameboard.board[2][4]).toBe("O");
});

test('receiveAttack should return "sunk" if the attack sinks a ship', () => {
  const gameboard = createGameboard();
  const ship = createShip(2);
  gameboard.placeShip(ship, 5, 6, false);

  gameboard.receiveAttack(5, 6);
  gameboard.receiveAttack(6, 6);

  const result = gameboard.receiveAttack(7, 6);

  expect(result).toBe("sunk");
  expect(ship.hits).toBe(2);
  expect(ship.isSunk()).toBe(true);
});

test("allShipsSunk should return true if all ships have been sunk", () => {
  const gameboard = createGameboard();
  const ship1 = createShip(2);
  const ship2 = createShip(3);
  gameboard.placeShip(ship1, 2, 3, true);
  gameboard.placeShip(ship2, 5, 6, false);

  gameboard.receiveAttack(2, 3);
  gameboard.receiveAttack(2, 4);
  gameboard.receiveAttack(5, 6);
  gameboard.receiveAttack(6, 6);
  gameboard.receiveAttack(7, 6);

  const result = gameboard.allShipsSunk();

  expect(result).toBe(true);
});
