type Player = { x: string, o: string }
type Score = { x: number, o: number }

class TicTacToe {
    board: Array<Array<string>>
    players: Player
    delay: number
    waiting: boolean
    score: Score
    currentPlayer: string
    typeOfGame: 'with friend' | 'with computer'

    constructor() {
        this.board = [['', '', ''], ['', '', ''], ['', '', '']]
        this.players = { x: 'x', o: 'o' }
        this.delay = 1500
        this.waiting = false
        this.score = { x: 0, o: 0 }
        this.currentPlayer = this.players.x
        this.typeOfGame = 'with friend'
        this.bindHandler(this.clickCell)
        this.startGame()
    }
    bindHandler(clickHandler: (row: number, col: number) => void): void {
        document.addEventListener('click', (event: Event) => {
            const clicked = <HTMLElement>event.target
            const isColumn = clicked.className === 'col'

            if (isColumn) {
                const cell = clicked
                const row = +cell.parentElement!.dataset.row!
                const col = +cell.dataset.col!

                clickHandler(row, col)
            }
        })
    }
    clickCell = (row: number, col: number) => {
        const canContinue = this.board[row][col] === ''

        if (canContinue && !this.waiting) {
            this.board[row][col] = this.currentPlayer
            this.updateBoard(row, col, this.currentPlayer)
            const win = this.checkWin(row, col)
            const stalemate = this.board
                .map(row => row.filter(col => col === ''))
                .filter(row => row.length > 0)
            if (!this.waiting) {
                if (win) {
                    this.score[this.currentPlayer] += 1
                    this.updateScore(this.score, this.currentPlayer)
                    this.gameOver(this.currentPlayer)
                    this.currentPlayer = this.players.x
                } else if (stalemate.length < 1) {
                    this.gameOver()
                } else {
                    this.currentPlayer = this.currentPlayer === this.players.x ? this.players.o : this.players.x
                    if (this.typeOfGame === 'with computer' && this.currentPlayer == "o") {
                        let row: number;
                        let col: number;
                        do {
                            row = Math.floor(Math.random() * this.board.length);
                            col = Math.floor(Math.random() * this.board.length);
                        } while (this.board[row][col] !== '');
                        this.clickCell(row, col)
                    }
                }
            }
        }
    }

    startGame(): void {
        this.printScoreBoard(this.score)
        this.printGameBoard(this.board)
        this.createChoice()
    }

    printScoreBoard = (scoreData: Score): void => {
        const game = <HTMLElement>document.querySelector('#game')
        const scoreBoard = this.createElement('div', 'score')

        game.append(scoreBoard)

        const playerOneScore = this.createElement('div', 'x')
        playerOneScore.textContent = `Игрок 1: ${scoreData.x}`
        playerOneScore.id = 'score-x'

        const playerTwoScore = this.createElement('div', 'o')
        playerTwoScore.textContent = `Игрок 2: ${scoreData.o}`
        playerTwoScore.id = 'score-o'

        scoreBoard.append(playerOneScore, playerTwoScore)
    }

    printGameBoard = (boardData: Array<Array<string>>): void => {
        const game = <HTMLElement>document.querySelector('#game')
        const gameBoard = this.createElement('div', 'board', undefined)

        game.append(gameBoard)

        boardData.forEach((row, i) => {
            const boardRow = this.createElement('div', 'row', ['row', i])
            gameBoard.append(boardRow)

            row.forEach((col, j) => {
                const boardCol = this.createElement('div', 'col', ['col', j])
                boardRow.append(boardCol)
            })
        })
    }

    createChoice = (): void => {
        const game = <HTMLElement>document.querySelector('#game')
        const modeSelectionDiv = this.createElement('div', 'mode-selection');

        const withFriendLabel = this.createElement('label');
        const withFriendInput = this.createElement('input');
        withFriendInput.setAttribute('type', 'radio');
        withFriendInput.setAttribute('name', 'game_mode');
        withFriendInput.setAttribute('value', 'with friend');
        withFriendInput.setAttribute('checked', 'checked');
        withFriendInput.addEventListener('change', this.handleModeChange);
        withFriendLabel.append(withFriendInput);
        withFriendLabel.append(document.createTextNode('Игрок'));

        const withComputerLabel = this.createElement('label');
        const withComputerInput = this.createElement('input');
        withComputerInput.setAttribute('type', 'radio');
        withComputerInput.setAttribute('name', 'game_mode');
        withComputerInput.setAttribute('value', 'with computer');
        withComputerInput.addEventListener('change', this.handleModeChange);
        withComputerLabel.append(withComputerInput);
        withComputerLabel.append(document.createTextNode('Компьютер'));

        modeSelectionDiv.append(withFriendLabel);
        modeSelectionDiv.append(withComputerLabel);

        game.append(modeSelectionDiv)
    }

    handleModeChange = (event: Event): void => {
        this.typeOfGame = (event.target as HTMLInputElement).value as 'with friend' | 'with computer';
        this.score = { x: 0, o: 0 }
        this.updateScore(this.score, this.players.x)
        this.updateScore(this.score, this.players.o)
        this.currentPlayer = this.players.x
        this.clearBoard()
    }

    updateBoard = (row: number, col: number, currentPlayer: string): void => {
        const playerToken = this.createElement('span', currentPlayer, undefined)
        playerToken.textContent = currentPlayer

        const boardRow = <HTMLElement>document.querySelector(`[data-row="${row}"]`)
        const cell = <HTMLElement>boardRow.querySelector(`[data-col="${col}"]`)

        cell.append(playerToken)
    }

    gameOver = (winner?: string) => {
        this.waiting = true
        this.printMessage(winner)

        setTimeout(() => {
            const message = <HTMLElement>document.querySelector('.message')
            message.remove()
            this.clearBoard()
            this.waiting = false
        }, this.delay)
    }
    checkWin = (row: number, col: number): boolean => {
        return (this.board[row][0] === this.currentPlayer && this.board[row][1] === this.currentPlayer &&  this.board[row][2] === this.currentPlayer) ||
               (this.board[0][col] === this.currentPlayer && this.board[1][col] === this.currentPlayer && this.board[2][col] === this.currentPlayer) ||
               ((this.board[0][0] === this.currentPlayer && this.board[1][1] === this.currentPlayer && this.board[2][2] === this.currentPlayer) ||
               (this.board[2][0] === this.currentPlayer && this.board[1][1] === this.currentPlayer && this.board[0][2] === this.currentPlayer))
    }

    createElement = (tag: string, className?: string, dataset?: Array<any>): HTMLElement => {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
        if (dataset) element.dataset[dataset[0]] = dataset[1]

        return element
    }

    clearBoard = (): void => {
        const cells =<NodeList>document.querySelectorAll('.col')

        cells.forEach(cell => {
            cell.textContent = ''
        })

        this.board = [['', '', ''], ['', '', ''], ['', '', '']]
    }

    updateScore = (currentScore: Score, currentPlayer: string): void => {
        const currentPlayerScore = <HTMLElement>document.querySelector(`#score-${currentPlayer}`)
        const player = currentPlayer === 'x' ? 'Игрок 1' : 'Игрок 2'
        const d: number = currentScore[currentPlayer]
        currentPlayerScore.textContent = `${player}: ${d}`
    }

    printMessage = (winner: string): void => {
        const message = this.createElement('div', 'message')
        const player = winner === 'x' ? 'Игрок 1' : 'Игрок 2'

        message.textContent = winner ? `${player} выиграл!` : 'Никто не выиграл!'

        const game = <HTMLElement>document.querySelector('#game')
        game.append(message)
    }
}

new TicTacToe()