const EMPTY = 16;

class Game extends Grid {
  constructor() {
    const rows = 4;
    const columns = 4;

    super(rows, columns);

    // our grid contains simple integers to represent game objects;
    // this map translates the numbers to a string, that can then be used as
    // human-readable reference or CSS class (for display purposes)
    this.cssClassMap = {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'eight',
        9: 'nine',
        10: 'ten',
        11: 'eleven',
        12: 'twelve',
        13: 'thirteen',
        14: 'fourteen',
        15: 'fifteen',
        16: 'sixteen'
    };

    // bind context variable to the current Game() object
    // for each of these global handlers/interval
    const grid = document.querySelector('#grid');

    grid.addEventListener('click', this.onClick.bind(this));

    // randomly populate the grid
    let nextState = this.displayStateCopy();
    let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.columns; x += 1) {
        const randomIndex = Math.floor(Math.random() * values.length);
        nextState[x][y] = values.splice(randomIndex, 1)[0];
      }
    }

    this.render(nextState);
  }

  onClick(event) {
    if (this.gameOver) {
      return;
    }

    // if one of the cells north/south/east/west is empty, swap places
    const clicked = {
        x: parseInt(event.target.dataset.x, 10),
        y: parseInt(event.target.dataset.y, 10)
    };

    let state = this.displayStateCopy();
    let neighbors = this.getNeighbors(clicked.x, clicked.y);

    // check each neighboring cell
    for (let i = 0; i < neighbors.length; i += 1) {
      let point = neighbors[i];

      // if one is empty...
      if (state[point.x][point.y] === EMPTY) {
        // swap it with the one that was clicked
        state[point.x][point.y] = state[clicked.x][clicked.y];
        state[clicked.x][clicked.y] = EMPTY;

        sona.play('click');

        break;
      }
    }

    this.render(state);

    this.checkWinCondition();
  }

  getNeighbors(x, y) {
    // function to ensure that (x, y) coords are within our data structure
    const withinBounds = ({ x, y }) => x >= 0 && x < this.columns && y >= 0 && y < this.rows;

    return [
        // previous row
        { x: x, y: y - 1 },
        // current row
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        // next row
        { x: x, y: y + 1 },
    ].filter(withinBounds);
  }

  checkWinCondition() {
    let won = true;
    let expected = 1;
    let state = this.displayStateCopy();

    // basically go through the rows/columns and expect the
    // value of each cell to be sequential, 1 -> 16
    for (let y = 0; y < this.rows; y += 1) {
      if (!won) {
        break;
      }

      for (let x = 0; x < this.columns; x += 1) {
        if (state[x][y] === expected) {
          expected += 1;
        } else {
          won = false;
          break;
        }
      }
    }

    if (won) {
      sona.play('tada');

      this.gameOver = true;
    } else {
      console.log(`${expected} is not in the right position`);
    }
  }
}
