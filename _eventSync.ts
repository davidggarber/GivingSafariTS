import { theBoiler } from "./_boilerplate";
import { consoleTrace } from "./_builder";
import { toggleClass } from "./_classUtil";
import { cacheLogin, getLogin } from "./_storage";

export enum EventSyncActivity {
  Open = "Open",
  Edit = "Edit",
  Attempt = "Attempt",
  Solve = "Solve",
}

const localSync = window.location.href.substring(0,5) == 'file:';
let canSyncEvents = false;

let _eventName:string|undefined = undefined;
let _playerName:string|undefined = undefined;
let _teamName:string|undefined = undefined;

export function setupEventSync(syncKey?:string) {
  canSyncEvents = !!syncKey;
  if (canSyncEvents) {
    _eventName = syncKey;

    document.addEventListener('visibilitychange', function (event) { autoLogin(); });
    var body = document.getElementsByTagName('body')[0];
    body?.addEventListener('focus', function (event) { autoLogin(); });

    // Run immediately
    autoLogin();
  }
}

export async function pingEventServer(activity:EventSyncActivity, guess?:string) {
  if (!canSyncEvents && _playerName) {
    return;
  }

  const data = JSON.stringify({
    eventName: _eventName,
    player: _playerName,
    team: _teamName,
    puzzle: theBoiler().title,
    status: activity,
    data: guess || ''
  });

  try {
    const xhr = new XMLHttpRequest();
    var url = localSync ? "http://localhost:7071/api/PuzzlePing"
      : "https://puzzyleventsync.azurewebsites.net/api/PuzzlePing";

    xhr.open("POST", url, true /*async*/);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 /*DONE*/) {
        consoleTrace('Response: ' + xhr.responseText);
      }
      else {
        consoleTrace(`readyState=${xhr.readyState}, status=${xhr.status}`);
      }
    };
    xhr.send(data);
  }
  catch (ex) {
    console.error(ex);
  }
}

/**
 * A login requires a player name, and optionally a team name
 */
export type LoginInfo = {
  team: string,
  player: string,
}

/**
 * Log in to an event
 * @param player The name of the player (required)
 * @param team The player's team name (optional)
 */
function doLogin(player:string, team?:string) {
  _playerName = player;
  _teamName = team;
  const info:LoginInfo = {
      player: player,
      team: team || ''
  };
  cacheLogin(_eventName, info);
  pingEventServer(EventSyncActivity.Open);
  updateLoginUI();
}

/**
 * Clear any cached login info
 */
function doLogout() {
  cacheLogin(_eventName, undefined);
  _playerName = _teamName = undefined;
  updateLoginUI();
}

/**
 * Try to join an existing log-in
 * @param event The current event
 */
function autoLogin() {
  if (document.hidden) {
    return;
  }
  const info = getLogin(_eventName);
  if (info && (_playerName != info.player || _teamName != info?.team)) {
    _playerName = info.player;
    _teamName = info.team || '';  // if missing, player is solo
    pingEventServer(EventSyncActivity.Open);
  }
  else if (!info || !info.player) {
    _playerName = _teamName = undefined;
  }
  updateLoginUI();
}

/**
 * Ask the user for their username, and optionally team name (via @ suffix)
 * If they provide them, log them in.
 */
function promptLogin() {
  var text = 'Welcome to ' + _eventName + '.\n'
    + 'Enter your name to login.\n'
    + 'If you are on a team, enter as <your-name>@<team-name>\n'
    + 'If not on a team, please try to pick a unique name';
  var login = prompt(text)?.trim();
  if (login) {
    var splt = login.split('@').map(s => s.trim());
    doLogin(splt[0], splt[1]);
  }
}

/**
 * Ask the user if they want to log out. If they confirm, clear their cached login.
 */
function promptLogout() {
  var ask = confirm('Log out?')
  if (ask) {
    doLogout();
  }
}

function updateLoginUI() {
  let div = document.getElementById('Login-bar');
  if (!div) {
    div = document.createElement('div');
    div.id = 'Login-bar';
    document.getElementsByTagName('body')[0].appendChild(div);
  }
  let img:HTMLImageElement = document.getElementById('Login-icon') as HTMLImageElement;
  if (!img) {
    img = document.createElement('img');
    img.id = 'Login-icon';
    div.appendChild(img);
  }
  let span = document.getElementById('Login-player');
  if (!span) {
    span = document.createElement('span');
    span.id = 'Login-player';
    div.appendChild(span);
  }

  toggleClass(div, 'logged-in', !!_playerName);
  if (_playerName) {
    // Logged in
    img.src = _teamName ? '../Icons/logged-in-team.png' : '../Icons/logged-in.png';
    span.innerText = _teamName ? (_playerName + ' @ ' + _teamName) : _playerName;
    div.onclick = function(e) { promptLogout();};
    div.title = "Log out?";
  }
  else {
    // Logged pit
    img.src = '../Icons/logged-out.png';
    span.innerText = "Login?";
    div.onclick = function(e) { promptLogin();};
    div.title = "Log in?";
  }
}