var exits = [ {x:0, y:1}, {x:21, y:16} ];
var start = {x:4, y:2};
var playerPos = {x:start.x, y:start.y};
var playerSpan = undefined;
var playerChar = undefined;
var tombStone = undefined;
var playerHP = 0;  // dead
var monstersFought = [];
var twistColor = '*';
var nextTwistColor = {r:'g', g:'b', b:'y', y:'r'};

function spanAt(x, y) {
  return document.getElementById('m' + y + '_' + x);
}

function reset() {
  if (playerChar && playerChar.parentNode) {
    playerChar.parentNode.removeChild(playerChar);
    playerChar = undefined;
  }
  if (tombStone && tombStone.parentNode) {
    tombStone.parentNode.removeChild(tombStone);
    tombStone = undefined;
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
  document.getElementById('health').innerText = playerHP;
  document.getElementById('lastTwist').innerText = '';
  document.getElementById('loot').innerText = '';
  monstersKilled = [];
  document.getElementById('beaten').innerText = '';

  // Erase the built-in @
  playerSpan = spanAt(playerPos.x, playerPos.y);
  toggleClass(playerSpan, 'cleared-span', true);
  // Replace with animated @
  playerChar = document.createElement('img');
  playerChar.id = 'player';
  playerChar.src = "../24/Images/TLP/At.png";
  playerChar.title = 'Click horizontally or vertically to move';
  playerSpan.appendChild(playerChar);
}

function startGame() {
  reset();
  document.getElementById('game-status').style.display = 'inline-block';
  mapReachable();
}

function playerDeath() {
  if (playerChar && playerSpan) {
    playerSpan.removeChild(playerChar);
    playerChar = undefined;

    // Replace with tombstone
    tombStone = document.createElement('img');
    tombStone.id = 'tombstone';
    tombStone.src = "../24/Images/TLP/Tomb.png";
    playerSpan.appendChild(tombStone);
  }
}

function mapReachable() {
  var reachable = document.getElementsByClassName('reachable');
  for (var i = reachable.length - 1; i >= 0; i--) {
    toggleClass(reachable[i], 'reachable', false);
  }

  if (playerHP > 0) {
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

  var color = mazeColors[playerPos.y][playerPos.x];
  if (color != ' ') {
    twistColor = color;
  }

  mapReachable();
}

function fightMonster(ch) {
  var monster = monsters[ch];
  playerHP -= monster.hp;
  monstersFought.push(monster.name);

  var list = document.getElementById('beaten');
  var span = document.createElement('span');
  span.innerText = ((list.childNodes.length > 0) ? ', ' : '') + monster.name;
  list.appendChild(span);

  document.getElementById('health').innerText = playerHP;

  if (playerHP <= 0) {
    playerChar.src = "../24/Images/TLP/Tomb.png";
    playerChar.title = 'Dead. Play again to restart.';
  }
}

function pickupHealth(ch) {
  playerHP += parseInt(ch);
  document.getElementById('health').innerText = playerHP;
}

function pickupLoot(ch) {
  document.getElementById('loot').innerText += '$ ';
}
