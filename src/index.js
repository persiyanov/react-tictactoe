import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  if (props.isWinnerSquare) {
    return (
      <button className="win-square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    let isWinnerSquare = false;
    if (this.props.winnerSquareIds && this.props.winnerSquareIds.includes(i)) {
      isWinnerSquare = true;
    }
    return (
      <Square
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        isWinnerSquare={isWinnerSquare}
      />
    );
  }

  render() {
    const board = [];
    for (let i = 0; i < 3; ++i) {
      const row = [];
      for (let j = 0; j < 3; ++j) {
        row.push(this.renderSquare(i*3+j));
      }
      board.push(<div className="board-row">{row}</div>);
    }
    return board;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: null,
        col: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      reverseHistory: false,
    };

    this.reverseHistory = this.reverseHistory.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const [row, col] = getRowColById(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        row: row,
        col: col,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  reverseHistory() {
    this.setState({
      reverseHistory: !this.state.reverseHistory,
    });
  }

  restartGame() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        row: null,
        col: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      reverseHistory: false,
    });
  }

  render() {
    const reverseHistory = this.state.reverseHistory;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winnerSquares = getWinnerSquares(current.squares);

    const steps = reverseHistory ? history.slice().reverse() : history;
    const moves = steps.map((step, index, array) => {
      const move = this.state.reverseHistory ? (array.length - index - 1) : index;
      let desc = move ? `Go to move #${move}, (${step.row+1}, ${step.col+1})` : 'Go to game start';
      if (this.state.stepNumber === move) {
        desc = <b>{desc}</b>;
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
      
    }, this);

    const noFreeSquares = current.squares.every((val) => (val !== null));
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (noFreeSquares) {
      status = 'No winner. Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerSquareIds={winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={this.reverseHistory}>
              Reverse History
            </button>
          </div>
          <div><button onClick={this.restartGame}>Restart Game</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function getWinnerSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function getRowColById(i) {
  const row = Math.floor(i / 3);
  const col = i % 3;
  return [row, col];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
