
/*----- CLASS -----*/
class Sudoku {
    constructor(board) {
        this.board = board;
        this.possible = [];
        this.findPossible();
    }

    async solve() {
        // check if current known numbers are valid first
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (!'123456789'.includes(this.board[row][col].value)) {
                    alert("Error! There is an invalid character in the board.")
                    return;
                }

                if (this.board[row][col].value != '' && !this.isValid(row, col)) {
                    alert("Error! Board with initial known numbers is unsolvable.");
                    return;
                } 

                this.board[row][col].style.color = 
                    (this.board[row][col].value == '')
                    ? "blue"
                    : "black";
            }
        }

        this.updateOne();

        // find the first unknown cell
        var row;
        var col;
        for (let i = 0; i < 81; i++) {
            if (this.board[Math.floor(i / 9)][i % 9].value == '') {
                row = Math.floor(i / 9);
                col = i % 9;
                break;
            }
        }

        if (row == undefined) return;
        let possible = await this.recurse(row, col);
        if (!possible) alert("Error! Board with initial known numbers is unsolvable.");


    }

    async recurse(r, c) {
        //await pause(20);
        if (c == 9) {
            c = 0;
            r += 1;
        }
        if (r == 9) return true;
        if (this.board[r][c].value != '') {
            if (!this.isValid(r, c)) {
                return false;
            } else {
                return await this.recurse(r, c + 1);
            }
        }

        for (let i = 0; i < this.possible[r][c].length; i++) {
            this.board[r][c].value = this.possible[r][c][i];
            if (this.isValid(r, c) && await this.recurse(r, c + 1)) {
                return true;
            }
        }

        this.board[r][c].value = '';
        //await pause(20);
        return false;
    }

    findPossible() {
        for (let r = 0; r < 9; r++) {
            this.possible[r] = [];
            for (let c = 0; c < 9; c++) {
                this.possible[r][c] = [1,2,3,4,5,6,7,8,9];
            }
        }
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.board[r][c].value != '') {
                    this.possible[r][c] = [];
                    this.updatePossible(r, c);
                }
            }
        }
    }

    updateOne() {
        var change = true;

        while (change) {
            change = false;
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (this.board[r][c].value == '' && this.possible[r][c].length == 1) {
                        this.board[r][c].value = this.possible[r][c].pop();
                        this.updatePossible(r, c);
                        change = true;
                    }
                }
            }
        }

    }

    updatePossible(r, c) {
        const num = this.board[r][c].value;
        
        //check row
        for (let col = 0; col < 9; col++) {
            this.possible[r][col] = this.possible[r][col].filter(x => x != num);
        }
        //check col
        for (let row = 0; row < 9; row++) {
            this.possible[row][c] = this.possible[row][c].filter(x => x != num);
        }
        //check grid
        const row = 3 * Math.floor(r / 3);
        const col = 3 * Math.floor(c / 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.possible[row + i][col + j] = this.possible[row + i][col + j].filter(x => x != num);
            }
        }
    }

    isValid(r, c) {
        const num = this.board[r][c].value;
        var count = 0;

        for (let i = 0; i < 9; i++) {
            if (this.board[r][i].value == num) {
                count++;
            }
        }

        for (let i = 0; i < 9; i++) {
            if (this.board[i][c].value == num) {
                count++;
            }
        }
        
        const row = 3 * Math.floor(r / 3);
        const col = 3 * Math.floor(c / 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[row + i][col + j].value == num) {
                    count++;
                }
            }
        }
            
        return count == 3;
    }
}



/*----- VARIABLES & FUNCTIONS -----*/
const pause = ms => new Promise(x => setTimeout(x, ms));
const cells = document.getElementsByClassName("cell");

document.addEventListener('keydown', event => {
    var row;
    var col;
    for (let i = 0; i < 81; i++) {
        if (cells[i] === document.activeElement) {
            row = Math.floor(i / 9);
            col = i % 9;
            break;
        }
    }

    switch (event.key) {
        case "ArrowLeft":
            col--;
            if (col == -1) {
                row--;
                col = 8;
            }
            break;

        case "ArrowRight":
            col++
            if (col == 9) {
                row++;
                col = 0;
            }
            break;

        case "ArrowUp":
            row--; 
            break;

        case "ArrowDown":
            row++;
            break;

        default: return;    
    }

    if (row >= 0 && row < 9) {
        console.log(event.key);
        cells[row*9 + col].select();
    }

})

function readBoard() {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board[i] = [];
    }

    for (let i = 0; i < 81; i++) {
        board[Math.floor(i / 9)][i % 9] = cells[i];
    }

    return board;
}

function clearBoard() {
    for (let i = 0; i < 81; i++) {
        cells[i].value = '';
        cells[i].style.color = "black";
    }
}

function validate(event) {
    if ('123456789'.includes(event.key)) {
        document.activeElement.select();
        return true;
    }
    return false;
}