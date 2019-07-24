class Board {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.squares = [...Array(this.height)].map(() => Array(this.width).fill('_'));
        this.apple;
        this.snake;
        this.getSquare = (x, y) => {
            return this.squares[y] && this.squares[y][x];
        }
        this.setSquare = (x, y, val) => {
            this.squares[y][x] = val;
        }
        this.getNext = (dir) => {
            let { 0:dirX, 1:dirY } = dir;
            return this.getSquare(this.snake.x + dirX, this.snake.y + dirY);
        }

        this.moveApple = () => {
            let newX, newY;
            do {
                newX = Math.floor(Math.random() * this.height);
                newY = Math.floor(Math.random() * this.width);
            } while (this.getSquare(newX, newY) != '_');
            this.apple = [newX, newY];
            this.setSquare(newX, newY, 'A');
        }
        this.print = () => {
            //console.log(this.squares);
            console.log();
            if (this.gameOver) {
                console.log("Game Over!");
            } else {
                for (let row of this.squares){
                    console.log(row.reduce((t, s) => (s instanceof Segment) ? t + 'S' : t + s , ''));
                }
            }
        }
        this.gameOver;
        this.newGame = () => {
            this.gameOver = false;
            this.snake = new Snake(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height), this);
            this.moveApple();
        }
        this.newGame();
    }
}
class Snake {
    constructor(x, y, board) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.length = 3;
        this.head = new Segment(this.x, this.y, this.board, this.length);
        this.move = (dir) => {
            let { 0:dirX, 1:dirY } = dir;
            this.x += dirX;
            this.y += dirY;
            let nextSquare = this.board.getSquare(this.x, this.y);
            if (!nextSquare || nextSquare instanceof Segment) {
                this.board.gameOver = true;
                return;
            }
            else if (nextSquare == 'A') {
                this.length++;
                this.board.moveApple();
            }
            else {
                this.head.step();
            }
            this.head = new Segment(this.x, this.y, this.board, this.length, this.head);
            this.board.setSquare(this.x, this.y, this.head);
        }
    }
}
class Segment {
    constructor(x, y, board, length, next = null) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.board.setSquare(x, y, this);
        this.next = next;
        this.lifetime = length;
        //removes segment from board
        this.delete = () => {
            this.board.setSquare(x, y, '_');
        }
        //decrement time to live by one recursively and delete the last segement if it times out
        this.step = () => {
            this.lifetime--;
            if (this.next && !this.next.step()){
                this.next.delete();
                this.next = null;
            }
            return this.lifetime;
        }
        this.grow = () => {
            this.lifetime++;
            this.next && this.next.grow();
        }
    }
}
const DIRS = [[1,0], [0, 1], [-1, 0], [0, -1]]
class AI {
    constructor() {
        this.board = new Board(8, 8);
        while (this.board.gameOver == false) {
            let nextDir, altDir;
            let {0:aX, 1:aY} = this.board.apple;
            let dX = aX - this.board.snake.x;
            let dY = aY - this.board.snake.y;
            if (Math.abs(dX) > Math.abs(dY)) {
                nextDir = dX > 0 ? 0 : 2;
                altDir = dY > 0 ? 1 : 3;
            } else {
                nextDir = dY > 0 ? 1 : 3;
                altDir = dX > 0 ? 0 : 2;

            }
            let next = this.board.getNext(DIRS[nextDir]);
            if (!next || next instanceof Segment){
                this.board.snake.move(DIRS[altDir]);
            } else {
                this.board.snake.move(DIRS[nextDir]);
            }

            this.board.print();
        }
    }
}
let ai = new AI();