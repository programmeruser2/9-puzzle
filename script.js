"use strict";
const game = document.getElementById('game');
const headerMsg = document.getElementById('header-message');
const movesMsg = document.getElementById('moves');
let start = false;
let moves = 0;
let row, cell;
let board = [
  1,2,3,
  4,5,6,
  7,8,null
];
for(let i=1;i<=3;++i) {
  row = document.createElement('tr')
  game.appendChild(row)
  for(let j=1;j<=3;++j) {
    cell = document.createElement('td')
    cell.innerHTML = board[((i-1)*3+j)-1]
    cell.setAttribute('id',`square-${(i-1)*3+j}`)
    cell.onclick = e => {
      move((i-1)*3+j)
    }
    row.appendChild(cell)
  }
}
const update = () => {
  let currentSq;
  for(let row=1; row<=3; ++row) {
    for(let col=1; col<=3; ++col) {
      currentSq = (row-1)*3+col;
      document.getElementById(`square-${currentSq}`).innerHTML = board[currentSq - 1];
    }
  }
  movesMsg.innerHTML = `Moves: ${moves}`
}
const arrayCompare = (a,b) => {
  //https://masteringjs.io/tutorials/fundamentals/compare-arrays
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
  return a.every((item,index) => item === b[index])
}
const test = (row,col, vh, dir) => {
  //vh: ud (up down) or lr (left right), dir: up or down, left or right, 1 or -1
  if(vh==='ud') {
    const index = ((row-1)*3+col)-(3*dir)-1
    const val = board[index]
    if(val===null && (((row-1)*3+col)-(3*dir))<10 && ((row-1)*3+col)-(3*dir)>0) {
      return {status: true, emptyIndex: index}
    } else {
      return {status: false, emptyIndex: null};
    }
  } else if(vh==='lr') {
    const index = ((row-1)*3+(col+dir))-1
    const val = board[index]
    if(val===null && (col+dir<4 && col+dir>0)) {
      return {status: true, emptyIndex: index}
    } else {
      return {status: false, emptyIndex: null};
    }
  }
}
const move = sq => {
  //returns a boolean indicating whether the move succeeded
  if(board[sq-1]===null) {
    return;
  }
  let column;
  if(sq%3===0) {
    column = 3
  } else {
    column = sq % 3
  }
  let row = ((sq - column) / 3) + 1
  // console.log(row,column)
  const tests = {
    'ud1': 1,
    'ud2': -1,
    'lr1': 1,
    'lr2': -1
  };
  let testLog = []
  Object.keys(tests).forEach(item => {
    const currentTest = test(row,column,item.slice(0,-1),tests[item])
    testLog.push(currentTest.status)
    if(currentTest.status) {
      board[currentTest.emptyIndex] = board[sq-1]
      board[sq-1] = null
    }
  });
  update();
  headerMsg.innerHTML = null
  if(start===true && arrayCompare(board,[1,2,3,4,5,6,7,8,null])) {
    headerMsg.innerHTML = 'Solved!'
    start = false
    moves = 0
    return true
  }
  if(testLog.some(item=>item)) {
    start = true
    ++moves;
    update();
    return true;
  } else {
    return false;
  }
}
const random = (min,max) => {
  //https://www.w3schools.com/js/js_random.asp
  //Inclusive random function
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 
const shuffle = depth => {
  //note that this will auto-abort if the stack fills up to the maximum
  try {
    let cMove = move(random(1,9))
    if(cMove) {
      shuffle(depth-1)
    } else {
      shuffle(depth)
    }
  } catch(err) {
    moves = 0
    update();
    return;
  }
  moves = 0
  update();
}
//function to solve and reset board and game
const solveReset = () => {
  board = [
  1,2,3,
  4,5,6,
  7,8,null
  ]
  start = false
  headerMsg.innerHTML = null
  moves = 0
  update();
}
window.onload = (e) => {
  shuffle(10);
  moves = 0;
  update();
  headerMsg.innerHTML = 'Finished loading';
  setTimeout(() => {
    headerMsg.innerHTML = null;
  },800);
}

// service workers section
//Thanks to https://css-tricks.com/serviceworker-for-offline/
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    console.log('Service workers successfuly registered :)')
  }, () => {
    console.log('Something went wrong while registering service workers :(');
  })
} else {
  console.log('Your browser doesn\'t support service workers (they let you download web apps) :(\nTry using a newer browser e.g. Chrome, Firefox, Edge, etc.');
}