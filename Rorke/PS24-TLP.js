function spanIdAt(x, y) {
  return 'm' + y + '_' + x;
}

function spanAt(x, y) {
  if (y >= 0 && y < mazeHeight && x >= 0 && x < mazeWidth) {
    return document.getElementById(spanIdAt(x, y));
  }
  return null;
}

var exits = [ spanIdAt(0, 1), spanIdAt(21, 16) ];
var start = {x:4, y:2};
var playerPos = {x:start.x, y:start.y};
var playerSpan = undefined;
var playerChar = undefined;
var playerHP = 0;  // dead
var monstersFought = [];
var twistColor = '*';
var nextTwistColor = {r:'g', g:'b', b:'y', y:'r'};


function reset() {
  if (playerChar && playerChar.parentNode) {
    playerChar.parentNode.removeChild(playerChar);
    playerChar = undefined;
  }
  playerSpan = undefined;

  var cleared = document.getElementsByClassName('cleared-span');
  for (var i = cleared.length - 1; i >= 0; i--) {
    toggleClass(cleared[i], 'cleared-span', false);
  }
  // Move At back to start
  playerPos = {x:start.x, y:start.y};
  twistColor = '*';
  
  // Reset stats
  playerHP = 10;
  document.getElementById('health').innerText = playerHP + ' ❤️';
  document.getElementById('lastTwist').innerText = '';
  document.getElementById('loot').innerText = '';
  monstersKilled = [];
  document.getElementById('beaten').innerText = '';
  toggleClass(document.getElementById('beaten'), 'victory', false);

  // Erase the built-in @
  playerSpan = spanAt(playerPos.x, playerPos.y);
  toggleClass(playerSpan, 'cleared-span', true);
  // Replace with animated @
  playerChar = document.createElement('img');
  playerChar.id = 'player';
  playerChar.src = "Images/TLP/At.png";
  playerChar.title = 'Click horizontally or vertically to move';
  playerSpan.appendChild(playerChar);
}

function startGame() {
  reset();
  document.getElementById('game-status').style.display = 'inline-block';
  document.getElementById('game-help').style.display = 'block';
  mapReachable();
}

function mapReachable() {
  var reachable = document.getElementsByClassName('reachable');
  for (var i = reachable.length - 1; i >= 0; i--) {
    toggleClass(reachable[i], 'reachable', false);
    clearAllClasses(reachable[i], 'move-west move-north move-east move-south');
  }

  if (!checkVictory() && playerHP > 0) {
    mapRay(-1, playerPos.y, -1, 0, 'move-west');
    mapRay(playerPos.x, -1, 0, -1, 'move-north');
    mapRay(mazeWidth, playerPos.y, 1, 0, 'move-east');
    mapRay(playerPos.x, mazeHeight, 0, 1, 'move-south');
  }
}

function mapRay(endX, endY, dx, dy, moveDir) {
  var x = playerPos.x + dx;
  var y = playerPos.y + dy;
  while (x != endX || y != endY) {
    var span = spanAt(x, y);
    var ch = mazeColors[y][x];
    if (ch == 'w') {
      return;  // Wall
    }
    if (ch != ' ' && twistColor != '*' && ch != nextTwistColor[twistColor]) {
      return;  // Impassable color
    }
    toggleClass(span, 'reachable', true);
    toggleClass(span, moveDir, true);
    if (!hasClass(span, 'cleared-span')) {
      var ch = mazeText[y][x];
      if (ch != ' ') {
        return;
      }
    }
    x += dx;
    y += dy;
  }
}

function canWalkTo(dest) {
  // Can't go to walls
  return hasClass(dest, 'reachable');
}

function walkTo(span) {
  if (!playerChar) {
    return;
  }
  // TODO: can we get here without crossing anything else?
  if (!canWalkTo(span)) {
    return;
  }

  var yx = span.id.substring(1).split('_').map(n => parseInt(n));

  // Lift At out of previous location
  playerSpan.removeChild(playerChar);

  // Clear destination
  playerPos = {x:yx[1], y:yx[0]};
  playerSpan = span;

  if (!hasClass(playerSpan, 'cleared-span')) {
    // Object has not been previously cleared
    var obj = mazeText[playerPos.y][playerPos.x];
    if (obj >= 'A' && obj <= 'Z') {
      fightMonster(obj);
    }
    else if (obj >= '1' && obj <= '9') {
      pickupHealth(obj);
    }
    else if (obj == '$') {
      pickupLoot(obj);
    }
  }

  toggleClass(playerSpan, 'cleared-span', true);
  
  playerSpan.appendChild(playerChar);

  var color = colorAt(playerPos.x, playerPos.y);
  if (color != ' ') {
    updateTwist(color);
  }

  mapReachable();
}

function colorAt(x, y) {
  var c = mazeColors[y][x];
  return c == 'w' ? ' ' : c;
}

function fightMonster(ch) {
  var monster = monsters[ch];
  playerHP -= monster.hp;
  monstersFought.push(monster.name);

  var list = document.getElementById('beaten');
  var span = document.createElement('span');
  span.innerText = ((list.childNodes.length > 0) ? ', ' : '') + monster.name;
  list.appendChild(span);

  document.getElementById('health').innerText = playerHP + (playerHP > 0 ? ' ❤️' : ' 🪦');

  if (playerHP <= 0) {
    playerChar.src = "Images/TLP/Tomb.png";
    playerChar.title = 'Dead. Play again to restart.';
  }
}

function pickupHealth(ch) {
  playerHP += parseInt(ch);
  document.getElementById('health').innerText = playerHP + ' ❤️';
}

function pickupLoot(ch) {
  document.getElementById('loot').innerText += '$ ';
}

function updateTwist(ch) {
  twistColor = ch;
  var colorNames = {r:'RED', g:'GREEN', b:'BLUE', y:'YELLOW'};
  var span = document.createElement('span');
  span.innerText = colorNames[ch];
  toggleClass(span, 'maze-color-' + ch, true);
  document.getElementById('lastTwist').innerHTML = span.outerHTML;
}

function checkVictory() {
  var victory = exits.indexOf(spanIdAt(playerPos.x, playerPos.y)) >= 0;
  toggleClass(document.getElementById('beaten'), 'victory', victory);
  toggleClass(playerChar, 'victory', victory);
  return victory;
}

function onArrowKey(evt) {
  var dest = null;
  if (playerChar && playerHP > 0) {
    if (evt.code == 'ArrowLeft' || evt.code == 'keyA') {
      dest = spanAt(playerPos.x - 1, playerPos.y);
    }
    else if (evt.code == 'ArrowRight' || evt.code == 'keyD') {
      dest = spanAt(playerPos.x + 1, playerPos.y);
    }
    else if (evt.code == 'ArrowUp' || evt.code == 'keyW') {
      dest = spanAt(playerPos.x, playerPos.y - 1);
    }
    else if (evt.code == 'ArrowDown' || evt.code == 'keyS') {
      dest = spanAt(playerPos.x, playerPos.y + 1);
    }
    if (dest) {
      walkTo(dest);
      return;
    }
  }
  if ((playerHP <= 0 || evt.shiftKey) && (evt.code == 'Enter' || evt.code == 'Space')) {
    startGame();
  }
}

document.addEventListener("keydown", (event) => {
  onArrowKey(event);
});
