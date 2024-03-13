function spanIdAt(x, y) {
  return 'm' + y + '_' + x;
}

function spanAt(x, y) {
  if (y >= 0 && y < mazeHeight && x >= 0 && x < mazeWidth) {
    return document.getElementById(spanIdAt(x, y));
  }
  return null;
}

var allowUndo = true;
var exits = [ spanIdAt(0, 1), spanIdAt(21, 16) ];
var start = {x:4, y:2};
var startHealth = 10;
var playerPos = {x:start.x, y:start.y};
var playerSpan = undefined;
var playerChar = undefined;
var playerWiggle = undefined;
var playerHP = 0;  // dead
var playerCash = 0;
var monstersFought = [];
var twistColor = '*';
var nextTwistColor = {r:'g', g:'b', b:'y', y:'r'};
var twistShadows = {r:'#ff0000', g:'#8aea23', b:'#45c4f3', y:'#FFFF00'};

function reset() {
  undoBuffer = [];
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
  playerHP = startHealth;
  document.getElementById('health').innerText = playerHP + ' ❤️';
  document.getElementById('lastTwist').innerText = '';
  document.getElementById('loot').innerText = '';
  document.getElementById('beaten').innerText = '';
  toggleClass(document.getElementById('beaten'), 'victory', false);

  // Erase the built-in @
  playerSpan = spanAt(playerPos.x, playerPos.y);
  toggleClass(playerSpan, 'cleared-span', true);
  // Replace with animated @
  updatePlayer(true, undefined);
  playerSpan.appendChild(playerChar);
}

function updatePlayerImg(alive, color) {
  if (!playerChar) {
    playerChar = document.createElement('img');
    playerChar.id = 'player';
    playerSpan.appendChild(playerChar);
  }
  playerChar.src = alive ? "Images/TLP/At.png" : "Images/TLP/Tomb.png";
  playerChar.title = alive ? 'Click horizontally or vertically to move' : 'Dead. Play again to restart.';

  if (color) {
    // Color the player with the twist they can do next
    var nextColor = twistShadows[nextTwistColor[color]];
    var filter = 'drop-shadow(0 0 2px ' + nextColor + ') ';
    //playerChar.style.filter = filter + filter;
  }
}

function updatePlayerChar(alive, color) {
  if (!playerChar) {
    playerChar = document.createElement('div');
    playerChar.id = 'player';
    playerWiggle = document.createElement('div');
    playerWiggle.id = 'playerWiggle';
    playerChar.appendChild(playerWiggle);
    // playerChar.innerText = '@';
    playerSpan.appendChild(playerChar);
  }
  toggleClass(playerChar, 'dead', playerHP <= 0);
  playerWiggle.innerText = alive ? '@' : '💀';
  playerChar.title = alive ? 'Click horizontally or vertically to move' : 'Dead. Play again to restart.';

  if (color == '*') {
    playerChar.style.textShadow = '';
  }
  else if (color) {
    // Color the player with the twist they can do next
    var nextColor = twistShadows[nextTwistColor[color]];
    var shadow = '0 0 2px ' + nextColor + ', 0 0 3px ' + nextColor + ', 0 0 4px ' + nextColor;
    playerChar.style.textShadow = shadow;
  }
}

function updatePlayer(alive, color) {
  // updatePlayerImg(alive, color);  
  updatePlayerChar(alive, color);
}

function startGame() {
  reset();
  playAudio(sound.start);
  document.getElementById('game-status').style.display = 'inline-block';
  document.getElementById('game-help').style.display = 'block';
  mapReachable();
}

function mapReachable() {
  var reachable = document.getElementsByClassName('reachable');
  for (var i = reachable.length - 1; i >= 0; i--) {
    clearAllClasses(reachable[i], 'reachable move-west move-north move-east move-south');
  }

  if (!checkVictory() && playerHP > 0) {
    mapRay(-1, playerPos.y, -1, 0, 'move-west');
    mapRay(playerPos.x, -1, 0, -1, 'move-north');
    mapRay(mazeWidth, playerPos.y, 1, 0, 'move-east');
    mapRay(playerPos.x, mazeHeight, 0, 1, 'move-south');
  }
  else if (playerHP > 0) {
    playAudio(sound.exit);
  }
}

function mapRay(endX, endY, dx, dy, moveDir) {
  var x = playerPos.x + dx;
  var y = playerPos.y + dy;
  var mc = ' ';
  while (mc == ' ' && (x != endX || y != endY)) {
    var span = spanAt(x, y);
    mc = mazeColors[y][x];
    if (mc == 'w') {
      return;  // Wall
    }
    if (mc != ' ' && twistColor != '*' && mc != nextTwistColor[twistColor]) {
      return;  // Impassable color
    }
    toggleClass(span, 'reachable', true);
    toggleClass(span, moveDir, true);
    if (!hasClass(span, 'cleared-span')) {
      var mt = mazeText[y][x];
      if (mt != ' ') {
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
    return false;
  }
  // TODO: can we get here without crossing anything else?
  if (!canWalkTo(span)) {
    return false;
  }

  var yx = span.id.substring(1).split('_').map(n => parseInt(n));
  var undoRec = summarizeGameState(yx[1], yx[0]);

  // Lift At out of previous location
  playerSpan.removeChild(playerChar);

  // Clear destination
  var mx = yx[1] - playerPos.x;
  var my = yx[0] - playerPos.y;
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
  animateMove(mx, my);

  var color = colorAt(playerPos.x, playerPos.y);
  if (color != ' ') {
    updateTwist(color);
  }

  pushUndo(undoRec);

  mapReachable();
  return true;
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
  span.innerHTML = ((list.childNodes.length > 0) ? ', ' : '') 
    + '<b>' + monster.name[0] + '</b>' + monster.name.substring(1);
  list.appendChild(span);

  document.getElementById('health').innerText = playerHP + (playerHP > 0 ? ' ❤️' : ' 🪦');

  if (playerHP <= 0) {
    playAudio(sound.dead);
    updatePlayer(false, twistColor);
  }
  else {
    playAudio(sound.fight);
  }
}

function pickupHealth(ch) {
  playAudio(sound.health);
  playerHP += parseInt(ch);
  document.getElementById('health').innerText = playerHP + ' ❤️';
}

function pickupLoot(ch) {
  playerCash++;
  document.getElementById('loot').innerText += '$ ';
  // Switch loot sounds, so we can play more rapidly
  var count = document.getElementById('loot').innerText.length;
  playAudio(lootSounds[count % lootSounds.length]);
}

function updateTwist(ch) {
  playAudio(sound.color);
  var colorNames = {r:'RED', g:'GREEN', b:'BLUE', y:'YELLOW'};
  var span = document.createElement('span');
  toggleClass(span, 'maze-color-' + twistColor, false);
  twistColor = ch;
  span.innerText = ch == '*' ? '' : colorNames[ch];
  toggleClass(span, 'maze-color-' + ch, true);
  document.getElementById('lastTwist').innerHTML = span.outerHTML;

  updatePlayer(playerHP > 0, ch)  
}

function checkVictory() {
  var victory = exits.indexOf(spanIdAt(playerPos.x, playerPos.y)) >= 0;
  toggleClass(document.getElementById('beaten'), 'victory', victory);
  toggleClass(playerChar, 'victory', victory);
  if (victory) {
    playerChar.style.textShadow = '';  // Allow victory style to add shadow
  }
  return victory;
}

function onArrowKey(evt) {
  var dest = null;
  if (evt.code == 'KeyZ' && evt.ctrlKey) {
    undoStep();
    return;
  }
  if (playerChar && playerHP > 0) {
    if (evt.code == 'ArrowLeft' || evt.code == 'KeyA') {
      dest = spanAt(playerPos.x - 1, playerPos.y);
    }
    else if (evt.code == 'ArrowRight' || evt.code == 'KeyD') {
      dest = spanAt(playerPos.x + 1, playerPos.y);
    }
    else if (evt.code == 'ArrowUp' || evt.code == 'KeyW') {
      dest = spanAt(playerPos.x, playerPos.y - 1);
    }
    else if (evt.code == 'ArrowDown' || evt.code == 'KeyS') {
      dest = spanAt(playerPos.x, playerPos.y + 1);
    }
    if (dest) {
      if (!walkTo(dest)) {
        playAudio(sound.bump);
      }
      evt.preventDefault();
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

var anims = {};  // List of existing keyframe animations
var cellSize = undefined;  // size of a single cell
var animationSheet = undefined;

function animateMove(dx, dy) {
  var animId = 'a' + dx + '_' + dy;
  if (!(animId in anims)) {
    if (!animationSheet) {
      animationSheet = document.getElementById('animations').sheet;
      var spanSize = document.getElementById('m0_0').getBoundingClientRect();
      cellSize = {x:Math.floor(spanSize.width), y:Math.floor(spanSize.height)};
    }
    var px = (-dx * cellSize.x) + 'px';
    var py = (-dy * cellSize.y) + 'px';
    var keyframe = '@keyframes ' + animId 
      + '{ 0% { transform:translate(' + px + ',' + py + '); }'
      + ' 100% { transform:translate(0px,0px); } }';
    animationSheet.insertRule(keyframe, animationSheet.length);
    anims[animId] = keyframe;
  }
  var dur = (Math.floor(Math.sqrt(Math.abs(dx + dy))) * 0.1) + 's linear ';
  playerChar.style.animation = dur + animId;
}

var sound = {
  start: new Audio('Sounds/TLP/start.mp3'),
  color: new Audio('Sounds/TLP/color.mp3'),
  bump: new Audio('Sounds/TLP/bump.mp3'),
  fight: new Audio('Sounds/TLP/fight.mp3'),
  health: new Audio('Sounds/TLP/health.mp3'),
  loot: new Audio('Sounds/TLP/loot.mp3'),
  dead: new Audio('Sounds/TLP/dead.mp3'),
  exit: new Audio('Sounds/TLP/exit.mp3'),
}
var lootSounds = [
  new Audio('Sounds/TLP/loot1.mp3'),
  new Audio('Sounds/TLP/loot2.mp3'),
  new Audio('Sounds/TLP/loot3.mp3'),
];

function playAudio(aud) {
  // TODO: have a global mute button
  aud.play();
}

var undoBuffer = [];
function summarizeGameState(xDest, yDest) {
  // Summarize the player state and the state of the destination, prior to moving to x,y
  var span = spanAt(xDest, yDest);
  return {
    from:{x:playerPos.x, y:playerPos.y}, 
    to:{x:xDest, y:yDest}, 
    cleared:hasClass(span, 'cleared-span'), 
    color:twistColor,
    hp:playerHP, 
    loot:playerCash,
    monsters:monstersFought.length
  };
}

function pushUndo(gameState) {
  if (allowUndo) {
    undoBuffer.push(gameState);
    // Enable undo button
    toggleClass(document.getElementById('undo-button'), 'no-undo', false);
  }
}

function undoStep() {
  if (undoBuffer.length > 0) {
    var rec = undoBuffer.pop();

    playerSpan = spanAt(rec.to.x, rec.to.y);
    playerSpan.removeChild(playerChar);

    playerHP = rec.hp;
    playerCash = rec.loot;
    if (twistColor != rec.color) {
      updateTwist(rec.color);
    }
    // Update console
    document.getElementById('health').innerText = playerHP + ' ❤️';
    document.getElementById('loot').innerText = Array(playerCash + 1).join('$');

    if (!rec.cleared) {
      toggleClass(playerSpan, 'cleared-span', false);

      if (rec.monsters < monstersFought.length) {
        monstersFought.pop();
        var list = document.getElementById('beaten');
        var spans = list.getElementsByTagName('span');
        list.removeChild(spans[spans.length - 1]);
      }
    }

    playerChar.style.animation = '';
    updatePlayer(true, twistColor);
    playerPos = rec.from;
    playerSpan = spanAt(rec.from.x, rec.from.y);
    playerSpan.appendChild(playerChar);
    mapReachable();
  }

  if (undoBuffer.length == 0) {
    // Disable undo button
    toggleClass(document.getElementById('undo-button'), 'no-undo', true);
  }
}
