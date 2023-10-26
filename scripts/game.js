const EMPTY = 'sixteen';

class Game extends Grid {
  constructor() {
    const rows = 4;
    const columns = 4;

    super(rows, columns);

    // bind context variable to the current Game() object
    // for each of these global handlers/interval
    const grid = document.querySelector('#grid');

    grid.addEventListener('click', this.onClick.bind(this));

    // randomly populate the grid
    let nextState = this.currentState;
    let tiles = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];

    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.columns; x += 1) {
        const randomIndex = Math.floor(Math.random() * tiles.length);
        nextState[x][y] = tiles.splice(randomIndex, 1)[0];
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

    let nextState = this.currentState;
    let neighbors = this.getNeighbors(clicked.x, clicked.y);

    // check each neighboring cell
    for (let i = 0; i < neighbors.length; i += 1) {
      let point = neighbors[i];

      // if one is empty...
      if (nextState[point.x][point.y] === EMPTY) {
        // swap it with the one that was clicked
        nextState[point.x][point.y] = nextState[clicked.x][clicked.y];
        nextState[clicked.x][clicked.y] = EMPTY;

        sona.play('click');

        break;
      }
    }

    this.render(nextState);

    this.checkWinCondition();
  }

  getNeighbors(x, y) {
    return [
        // previous row
        { x: x, y: y - 1 },
        // current row
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        // next row
        { x: x, y: y + 1 },
    ].filter(point => this.withinBounds(point));
  }

  checkWinCondition() {
    let index = 0;
    let state = this.currentState;
    let tiles = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];

    // iterate through the rows/columns and expect the
    // value of each cell to match the ordered `tiles` list
    // nest the x loop inside the y loop, so the grid can be traversed like this:
    // [ 1][ 2][ 3][ 4]
    // [ 5][ 6][ 7][ 8]
    // [ 9][10][11][12]
    // [13][14][15][16]
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.columns; x += 1) {
        if (state[x][y] !== tiles[index]) {
          console.log(`${tiles[index]} is not in the right position`);
          return false;
        }

        index += 1;
      }
    }

    sona.play('tada');
    this.gameOver = true;
  }
}
