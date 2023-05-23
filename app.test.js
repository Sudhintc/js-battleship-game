const {createShip} = require('./app.js')

describe('ship',()=>{
    let ship1;
    beforeEach(()=>{
        ship1 = createShip(3);
    })

    test('should increment hits when hit() called',()=>{
        ship1.hit();
        expect(ship1.hits).toBe(1);
    });

    test('should mark ship as sunk when hits equals length',()=>{
        ship1.hit();
        expect(ship1.isSunk()).toBe(false);
        ship1.hit();
        expect(ship1.isSunk()).toBe(false);
        ship1.hit();
        expect(ship1.isSunk()).toBe(true);
        
    })
});