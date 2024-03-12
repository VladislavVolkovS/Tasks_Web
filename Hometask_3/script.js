var TicTacToe = /** @class */ (function () {
    function TicTacToe() {
        var _this = this;
        this.clickCell = function (row, col) {
            var canContinue = _this.board[row][col] === '';
            if (canContinue && !_this.waiting) {
                _this.board[row][col] = _this.currentPlayer;
                _this.updateBoard(row, col, _this.currentPlayer);
                var win = _this.checkWin(row, col);
                var stalemate = _this.board
                    .map(function (row) { return row.filter(function (col) { return col === ''; }); })
                    .filter(function (row) { return row.length > 0; });
                if (!_this.waiting) {
                    if (win) {
                        _this.score[_this.currentPlayer] += 1;
                        _this.updateScore(_this.score, _this.currentPlayer);
                        _this.gameOver(_this.currentPlayer);
                        _this.currentPlayer = _this.players.x;
                    }
                    else if (stalemate.length < 1) {
                        _this.gameOver();
                    }
                    else {
                        _this.currentPlayer = _this.currentPlayer === _this.players.x ? _this.players.o : _this.players.x;
                        if (_this.typeOfGame === 'with computer' && _this.currentPlayer == "o") {
                            var row_1;
                            var col_1;
                            do {
                                row_1 = Math.floor(Math.random() * _this.board.length);
                                col_1 = Math.floor(Math.random() * _this.board.length);
                            } while (_this.board[row_1][col_1] !== '');
                            _this.clickCell(row_1, col_1);
                        }
                    }
                }
            }
        };
        this.printScoreBoard = function (scoreData) {
            var game = document.querySelector('#game');
            var scoreBoard = _this.createElement('div', 'score');
            game.append(scoreBoard);
            var playerOneScore = _this.createElement('div', 'x');
            playerOneScore.textContent = "\u0418\u0433\u0440\u043E\u043A 1: ".concat(scoreData.x);
            playerOneScore.id = 'score-x';
            var playerTwoScore = _this.createElement('div', 'o');
            playerTwoScore.textContent = "\u0418\u0433\u0440\u043E\u043A 2: ".concat(scoreData.o);
            playerTwoScore.id = 'score-o';
            scoreBoard.append(playerOneScore, playerTwoScore);
        };
        this.printGameBoard = function (boardData) {
            var game = document.querySelector('#game');
            var gameBoard = _this.createElement('div', 'board', undefined);
            game.append(gameBoard);
            boardData.forEach(function (row, i) {
                var boardRow = _this.createElement('div', 'row', ['row', i]);
                gameBoard.append(boardRow);
                row.forEach(function (col, j) {
                    var boardCol = _this.createElement('div', 'col', ['col', j]);
                    boardRow.append(boardCol);
                });
            });
        };
        this.createChoice = function () {
            var game = document.querySelector('#game');
            var modeSelectionDiv = _this.createElement('div', 'mode-selection');
            var withFriendLabel = _this.createElement('label');
            var withFriendInput = _this.createElement('input');
            withFriendInput.setAttribute('type', 'radio');
            withFriendInput.setAttribute('name', 'game_mode');
            withFriendInput.setAttribute('value', 'with friend');
            withFriendInput.setAttribute('checked', 'checked');
            withFriendInput.addEventListener('change', _this.handleModeChange);
            withFriendLabel.append(withFriendInput);
            withFriendLabel.append(document.createTextNode('Игрок'));
            var withComputerLabel = _this.createElement('label');
            var withComputerInput = _this.createElement('input');
            withComputerInput.setAttribute('type', 'radio');
            withComputerInput.setAttribute('name', 'game_mode');
            withComputerInput.setAttribute('value', 'with computer');
            withComputerInput.addEventListener('change', _this.handleModeChange);
            withComputerLabel.append(withComputerInput);
            withComputerLabel.append(document.createTextNode('Компьютер'));
            modeSelectionDiv.append(withFriendLabel);
            modeSelectionDiv.append(withComputerLabel);
            game.append(modeSelectionDiv);
        };
        this.handleModeChange = function (event) {
            _this.typeOfGame = event.target.value;
            _this.score = { x: 0, o: 0 };
            _this.updateScore(_this.score, _this.players.x);
            _this.updateScore(_this.score, _this.players.o);
            _this.currentPlayer = _this.players.x;
            _this.clearBoard();
        };
        this.updateBoard = function (row, col, currentPlayer) {
            var playerToken = _this.createElement('span', currentPlayer, undefined);
            playerToken.textContent = currentPlayer;
            var boardRow = document.querySelector("[data-row=\"".concat(row, "\"]"));
            var cell = boardRow.querySelector("[data-col=\"".concat(col, "\"]"));
            cell.append(playerToken);
        };
        this.gameOver = function (winner) {
            _this.waiting = true;
            _this.printMessage(winner);
            setTimeout(function () {
                var message = document.querySelector('.message');
                message.remove();
                _this.clearBoard();
                _this.waiting = false;
            }, _this.delay);
        };
        this.checkWin = function (row, col) {
            return (_this.board[row][0] === _this.currentPlayer && _this.board[row][1] === _this.currentPlayer && _this.board[row][2] === _this.currentPlayer) ||
                (_this.board[0][col] === _this.currentPlayer && _this.board[1][col] === _this.currentPlayer && _this.board[2][col] === _this.currentPlayer) ||
                ((_this.board[0][0] === _this.currentPlayer && _this.board[1][1] === _this.currentPlayer && _this.board[2][2] === _this.currentPlayer) ||
                    (_this.board[2][0] === _this.currentPlayer && _this.board[1][1] === _this.currentPlayer && _this.board[0][2] === _this.currentPlayer));
        };
        this.createElement = function (tag, className, dataset) {
            var element = document.createElement(tag);
            if (className)
                element.classList.add(className);
            if (dataset)
                element.dataset[dataset[0]] = dataset[1];
            return element;
        };
        this.clearBoard = function () {
            var cells = document.querySelectorAll('.col');
            cells.forEach(function (cell) {
                cell.textContent = '';
            });
            _this.board = [['', '', ''], ['', '', ''], ['', '', '']];
        };
        this.updateScore = function (currentScore, currentPlayer) {
            var currentPlayerScore = document.querySelector("#score-".concat(currentPlayer));
            var player = currentPlayer === 'x' ? 'Игрок 1' : 'Игрок 2';
            var d = currentScore[currentPlayer];
            currentPlayerScore.textContent = "".concat(player, ": ").concat(d);
        };
        this.printMessage = function (winner) {
            var message = _this.createElement('div', 'message');
            var player = winner === 'x' ? 'Игрок 1' : 'Игрок 2';
            message.textContent = winner ? "".concat(player, " \u0432\u044B\u0438\u0433\u0440\u0430\u043B!") : 'Никто не выиграл!';
            var game = document.querySelector('#game');
            game.append(message);
        };
        this.board = [['', '', ''], ['', '', ''], ['', '', '']];
        this.players = { x: 'x', o: 'o' };
        this.delay = 1500;
        this.waiting = false;
        this.score = { x: 0, o: 0 };
        this.currentPlayer = this.players.x;
        this.typeOfGame = 'with friend';
        this.bindHandler(this.clickCell);
        this.startGame();
    }
    TicTacToe.prototype.bindHandler = function (clickHandler) {
        document.addEventListener('click', function (event) {
            var clicked = event.target;
            var isColumn = clicked.className === 'col';
            if (isColumn) {
                var cell = clicked;
                var row = +cell.parentElement.dataset.row;
                var col = +cell.dataset.col;
                clickHandler(row, col);
            }
        });
    };
    TicTacToe.prototype.startGame = function () {
        this.printScoreBoard(this.score);
        this.printGameBoard(this.board);
        this.createChoice();
    };
    return TicTacToe;
}());
new TicTacToe();
