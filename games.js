(function () {
  "use strict";

  /* ---------- Modal + tabs ---------- */
  var fab = document.getElementById("play-fab");
  var backdrop = document.getElementById("game-modal-backdrop");
  var closeBtn = document.getElementById("game-modal-close");
  var tabs = document.querySelectorAll(".game-tab");
  var panels = document.querySelectorAll(".game-panel");
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var activePanel = document.querySelector('.game-panel[data-panel="game2048"]');
    if (activePanel) {
      var board = document.getElementById("game2048-board");
      if (board) board.focus();
    }
  }

  function closeModal() {
    backdrop.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  if (fab) fab.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) {
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && backdrop && !backdrop.hidden) closeModal();
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      panels.forEach(function (p) {
        p.hidden = p.dataset.panel !== tab.dataset.game;
      });
      if (tab.dataset.game === "game2048") {
        var board = document.getElementById("game2048-board");
        if (board) board.focus();
      }
    });
  });

  /* ---------- 2048 ---------- */
  (function () {
    var SIZE = 4;
    var board = document.getElementById("game2048-board");
    var scoreEl = document.getElementById("game2048-score");
    var bestEl = document.getElementById("game2048-best");
    var newBtn = document.getElementById("game2048-new");
    if (!board) return;

    var grid;
    var score;
    var best = parseInt(localStorage.getItem("game2048-best") || "0", 10);
    bestEl.textContent = best;

    function emptyGrid() {
      var g = [];
      for (var r = 0; r < SIZE; r++) g.push(new Array(SIZE).fill(0));
      return g;
    }

    function addRandomTile() {
      var empties = [];
      for (var r = 0; r < SIZE; r++) {
        for (var c = 0; c < SIZE; c++) {
          if (grid[r][c] === 0) empties.push([r, c]);
        }
      }
      if (empties.length === 0) return;
      var pick = empties[Math.floor(Math.random() * empties.length)];
      grid[pick[0]][pick[1]] = Math.random() < 0.9 ? 2 : 4;
    }

    function render() {
      board.innerHTML = "";
      for (var r = 0; r < SIZE; r++) {
        for (var c = 0; c < SIZE; c++) {
          var cell = document.createElement("div");
          cell.className = "game2048-cell";
          var val = grid[r][c];
          cell.dataset.value = String(val);
          cell.textContent = val === 0 ? "" : String(val);
          board.appendChild(cell);
        }
      }
      scoreEl.textContent = score;
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        localStorage.setItem("game2048-best", String(best));
      }
    }

    function slideRowLeft(row) {
      var vals = row.filter(function (v) { return v !== 0; });
      var result = [];
      var gained = 0;
      for (var i = 0; i < vals.length; i++) {
        if (vals[i] === vals[i + 1]) {
          var merged = vals[i] * 2;
          result.push(merged);
          gained += merged;
          i++;
        } else {
          result.push(vals[i]);
        }
      }
      while (result.length < SIZE) result.push(0);
      var changed = row.some(function (v, i) { return v !== result[i]; });
      return { row: result, gained: gained, changed: changed };
    }

    function reverse(row) { return row.slice().reverse(); }

    function getColumn(g, c) {
      var col = [];
      for (var r = 0; r < SIZE; r++) col.push(g[r][c]);
      return col;
    }

    function setColumn(g, c, col) {
      for (var r = 0; r < SIZE; r++) g[r][c] = col[r];
    }

    function move(direction) {
      var changedAny = false;
      var gainedTotal = 0;
      var newGrid = grid.map(function (row) { return row.slice(); });

      if (direction === "left" || direction === "right") {
        for (var r = 0; r < SIZE; r++) {
          var row = newGrid[r];
          var working = direction === "right" ? reverse(row) : row;
          var res = slideRowLeft(working);
          var finalRow = direction === "right" ? reverse(res.row) : res.row;
          if (res.changed) changedAny = true;
          gainedTotal += res.gained;
          newGrid[r] = finalRow;
        }
      } else {
        for (var c = 0; c < SIZE; c++) {
          var col = getColumn(newGrid, c);
          var workingCol = direction === "down" ? reverse(col) : col;
          var resCol = slideRowLeft(workingCol);
          var finalCol = direction === "down" ? reverse(resCol.row) : resCol.row;
          if (resCol.changed) changedAny = true;
          gainedTotal += resCol.gained;
          setColumn(newGrid, c, finalCol);
        }
      }

      if (changedAny) {
        grid = newGrid;
        score += gainedTotal;
        addRandomTile();
        render();
        checkGameOver();
      }
    }

    function canMove() {
      for (var r = 0; r < SIZE; r++) {
        for (var c = 0; c < SIZE; c++) {
          if (grid[r][c] === 0) return true;
          if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
          if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
        }
      }
      return false;
    }

    function checkGameOver() {
      if (!canMove()) {
        setTimeout(function () {
          alert("Game over! Score: " + score);
        }, 100);
      }
    }

    function newGame() {
      grid = emptyGrid();
      score = 0;
      addRandomTile();
      addRandomTile();
      render();
    }

    var KEY_MAP = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down"
    };

    board.addEventListener("keydown", function (e) {
      var dir = KEY_MAP[e.key];
      if (!dir) return;
      e.preventDefault();
      move(dir);
    });

    var touchStartX = 0;
    var touchStartY = 0;
    board.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    });
    board.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      var absX = Math.abs(dx);
      var absY = Math.abs(dy);
      if (Math.max(absX, absY) < 24) return;
      if (absX > absY) {
        move(dx > 0 ? "right" : "left");
      } else {
        move(dy > 0 ? "down" : "up");
      }
    });

    document.querySelectorAll(".game2048-dpad-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        move(btn.dataset.dir);
        board.focus();
      });
    });

    if (newBtn) newBtn.addEventListener("click", newGame);

    newGame();
  })();

  /* ---------- Tic-tac-toe ---------- */
  (function () {
    var boardEl = document.getElementById("ttt-board");
    var statusEl = document.getElementById("ttt-status");
    var resetBtn = document.getElementById("ttt-reset");
    var firstBtns = document.querySelectorAll(".ttt-first-btn");
    if (!boardEl) return;

    var WIN_LINES = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    var THINK_DELAY_MS = 400;

    // X always opens; who that is depends on who's set to go first.
    var humanFirst = true;
    var humanSymbol;
    var computerSymbol;

    var cells;
    var current;
    var over;
    var thinking;

    function emptyIndexes(arr) {
      var out = [];
      arr.forEach(function (v, i) { if (!v) out.push(i); });
      return out;
    }

    function getWinner(arr) {
      for (var i = 0; i < WIN_LINES.length; i++) {
        var line = WIN_LINES[i];
        var a = arr[line[0]], b = arr[line[1]], c = arr[line[2]];
        if (a && a === b && a === c) return a;
      }
      if (arr.every(function (v) { return v; })) return "draw";
      return null;
    }

    // Full minimax game-tree search. Tic-tac-toe's tree is tiny (<= 9!
    // nodes), so exhaustive lookahead is instant and guarantees the
    // computer never loses -- the well-known optimal-play algorithm for
    // solved games like this one, rather than a hand-tuned rule set.
    function minimax(arr, turn, depth) {
      var winner = getWinner(arr);
      if (winner === computerSymbol) return 10 - depth;
      if (winner === humanSymbol) return depth - 10;
      if (winner === "draw") return 0;

      var empties = emptyIndexes(arr);
      var scores = empties.map(function (idx) {
        var copy = arr.slice();
        copy[idx] = turn;
        return minimax(copy, turn === computerSymbol ? humanSymbol : computerSymbol, depth + 1);
      });
      return turn === computerSymbol ? Math.max.apply(null, scores) : Math.min.apply(null, scores);
    }

    function chooseComputerMove(arr) {
      var empties = emptyIndexes(arr);
      if (empties.length === 0) return null;
      var bestScore = -Infinity;
      var bestMove = empties[0];
      empties.forEach(function (idx) {
        var copy = arr.slice();
        copy[idx] = computerSymbol;
        var score = minimax(copy, humanSymbol, 1);
        if (score > bestScore) {
          bestScore = score;
          bestMove = idx;
        }
      });
      return bestMove;
    }

    function checkWinner() {
      return getWinner(cells);
    }

    function statusText() {
      return current === humanSymbol ? "Your turn (" + humanSymbol + ")" : "Computer is thinking…";
    }

    function render() {
      boardEl.innerHTML = "";
      cells.forEach(function (val, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ttt-cell";
        btn.textContent = val || "";
        btn.disabled = !!val || over || thinking;
        btn.setAttribute("aria-label", "Cell " + (i + 1) + (val ? ", " + val : ", empty"));
        btn.addEventListener("click", function () { handleMove(i); });
        boardEl.appendChild(btn);
      });
    }

    function finish(winner) {
      over = true;
      if (winner === "draw") {
        statusEl.textContent = "It's a draw";
      } else {
        statusEl.textContent = winner === humanSymbol ? "You win!" : "Computer wins!";
      }
    }

    function triggerComputerMove() {
      thinking = true;
      render();
      setTimeout(function () {
        thinking = false;
        var move = chooseComputerMove(cells);
        if (move === null) { render(); return; }
        cells[move] = computerSymbol;
        var compWinner = checkWinner();
        if (compWinner) {
          finish(compWinner);
        } else {
          current = humanSymbol;
          statusEl.textContent = statusText();
        }
        render();
      }, THINK_DELAY_MS);
    }

    function handleMove(i) {
      if (cells[i] || over || thinking || current !== humanSymbol) return;
      cells[i] = humanSymbol;
      var winner = checkWinner();
      if (winner) {
        finish(winner);
        render();
        return;
      }

      current = computerSymbol;
      statusEl.textContent = statusText();
      triggerComputerMove();
    }

    function reset() {
      humanSymbol = humanFirst ? "X" : "O";
      computerSymbol = humanFirst ? "O" : "X";
      cells = new Array(9).fill(null);
      current = "X";
      over = false;
      thinking = false;
      statusEl.textContent = statusText();
      render();
      if (current === computerSymbol) triggerComputerMove();
    }

    firstBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        humanFirst = btn.dataset.first === "human";
        firstBtns.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        reset();
      });
    });

    if (resetBtn) resetBtn.addEventListener("click", reset);

    reset();
  })();
})();
