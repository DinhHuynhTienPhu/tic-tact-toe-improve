import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

var NUMBER_OF_ROWS = 20;


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, currentRow, currentCol, winnerCal) {

    if (winnerCal?.winLine.includes(i) && (winnerCal?.winner === 'X' || winnerCal?.winner === 'O')) {
      return (
        <b className='bold-me red' key={i + "b"}>
          <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        </b>
      );
    }
    else if (currentRow === Math.floor(i / NUMBER_OF_ROWS) && currentCol === i % NUMBER_OF_ROWS) {
      return (
        <b className='bold-me ' key={i + "b"}>
          <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        </b>
      );
    }
    else {
      return (
        <Square
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  }

  render() {
    return (
      <div>
        {/* <div className="board-row">
          {this.renderSquare(0, this.props.currentRow, this.props.currentCol)}
          {this.renderSquare(1, this.props.currentRow, this.props.currentCol)}
          {this.renderSquare(2, this.props.currentRow, this.props.currentCol)}
        </div>
        <div className="board-row">
          {this.renderSquare(3, this.props.currentRow, this.props.currentCol)}
          {this.renderSquare(4, this.props.currentRow, this.props.currentCol)}
          {this.renderSquare(5, this.props.currentRow, this.props.currentCol)}
        </div>
        <div className="board-row">
          {this.renderSquare(6, this.props.currentRow, this.props.currentCol)}
          {this.renderSquare(7, this.props.currentRow, this.props.currentCol)}
          {this.renderSquare(8, this.props.currentRow, this.props.currentCol)}
        </div> */}
        {Array(NUMBER_OF_ROWS).fill(null).map((row, i) => {
          return (
            <div className="board-row" key={Math.random()} >
              {Array(NUMBER_OF_ROWS).fill(null).map((col, j) => {
                return this.renderSquare(i * NUMBER_OF_ROWS + j, this.props.currentRow, this.props.currentCol, this.props.winnerCal);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: null,
          col: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      currentRow: 0,
      currentCol: 0,
      isHistoryReverse: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, this.state.currentRow, this.state.currentCol)?.winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: Math.floor(i / NUMBER_OF_ROWS),
          col: i % NUMBER_OF_ROWS
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      currentRow: Math.floor(i / NUMBER_OF_ROWS),
      currentCol: i % NUMBER_OF_ROWS,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerCal = calculateWinner(current.squares, this.state.currentRow, this.state.currentCol);
    const winner = winnerCal ? winnerCal.winner : null;
    const winLine = winnerCal ? winnerCal.winLine : null;
    let moves = "";
    if (this.state.isHistoryReverse === false) {
      moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' (' + step.row + ', ' + step.col + ')' :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
    }
    else {
      moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' (' + step.row + ', ' + step.col + ')' :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
      ).reverse();
    }


    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      if (checkDraw(current.squares)) {
        status = "Draw";
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            currentRow={this.state.currentRow}
            currentCol={this.state.currentCol}
            winnerCal={winnerCal}
          />
        </div>
        <div className="game-info">
          <label className="switch">
            <input type="checkbox" onChange={() => {
              this.setState({
                isHistoryReverse: !this.state.isHistoryReverse
              });
            }} />
            <span className="slider round"></span>
          </label>
          click to sort history ascending/descending
          <br />
          <br />
          <br />
          <br />
          <br />

          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares, currentRow, currentCol) {
  let result = {
    winner: null,
    winLine: []
  };



  //5 in a row or 5 in a column or 5 in a diagonal
  //check row
  let count = 0;
  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    if (squares[currentRow * NUMBER_OF_ROWS + i] === squares[currentRow * NUMBER_OF_ROWS + currentCol]) {
      count++;
    }
    else {
      count = 0;
    }
    if (count === 5) {
      result.winner = squares[currentRow * NUMBER_OF_ROWS + currentCol];
      for (let j = 0; j < 5; j++) {
        result.winLine.push(currentRow * NUMBER_OF_ROWS + currentCol - j);
      }
      return result;
    }
  }
  //check column
  count = 0;
  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    if (squares[i * NUMBER_OF_ROWS + currentCol] === squares[currentRow * NUMBER_OF_ROWS + currentCol]) {
      count++;
    }
    else {
      count = 0;
    }
    if (count === 5) {
      result.winner = squares[currentRow * NUMBER_OF_ROWS + currentCol];
      for (let j = 0; j < 5; j++) {
        result.winLine.push((currentRow - j) * NUMBER_OF_ROWS + currentCol);
      }
      return result;
    }
  }
  //check diagonal
  count = 0;
  let row = currentRow;
  let col = currentCol;
  while (row > 0 && col > 0) {
    row--;
    col--;
  }
  while (row < NUMBER_OF_ROWS && col < NUMBER_OF_ROWS) {
    if (squares[row * NUMBER_OF_ROWS + col] === squares[currentRow * NUMBER_OF_ROWS + currentCol]) {
      count++;
    }
    else {
      count = 0;
    }
    if (count === 5) {
      result.winner = squares[currentRow * NUMBER_OF_ROWS + currentCol];
      for (let j = 0; j < 5; j++) {
        result.winLine.push((currentRow - j) * NUMBER_OF_ROWS + currentCol - j);
      }
      return result;
    }
    row++;
    col++;
  }
  count = 0;
  row = currentRow;
  col = currentCol;
  while (row > 0 && col < 19) {
    row--;
    col++;
  }
  while (row < NUMBER_OF_ROWS && col >= 0) {
    if (squares[row * NUMBER_OF_ROWS + col] === squares[currentRow * NUMBER_OF_ROWS + currentCol]) {
      count++;
    }
    else {
      count = 0;
    }
    if (count === 5) {
      result.winner = squares[currentRow * NUMBER_OF_ROWS + currentCol];
      for (let j = 0; j < 5; j++) {
        result.winLine.push((currentRow - j) * NUMBER_OF_ROWS + currentCol + j);
      }
      return result;
    }
    row++;
    col--;
  }
  return null;
}
function checkDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] !== 'X' && squares[i] !== 'O') {
      return false;
    }
  }
  return true;
}


