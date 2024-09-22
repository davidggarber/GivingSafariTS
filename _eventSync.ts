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
let _emojiAvatar:string|undefined = undefined;

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
  if (!canSyncEvents || !_playerName) {
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
    };
    xhr.send(data);
  }
  catch (ex) {
    console.error(ex);
  }
}

export async function getTeamStatus(activity:EventSyncActivity, guess?:string) {
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
    var url = localSync ? "http://localhost:7071/api/TeamStatus"
      : "https://puzzyleventsync.azurewebsites.net/api/TeamStatus";

    xhr.open("POST", url, true /*async*/);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 /*DONE*/) {
        consoleTrace('Response: ' + xhr.responseText);
        

        
        // TODO: update team UI



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
  emoji: string,
}

/**
 * Log in to an event
 * @param player The name of the player (required)
 * @param team The player's team name (optional)
 * @param team The player's emoji avatar (optional)
 */
function doLogin(player:string, team?:string, emoji?:string) {
  _playerName = player;
  _teamName = team;
  _emojiAvatar = emoji;
  const info:LoginInfo = {
      player: player,
      team: team || '',
      emoji: emoji || '',  // IDEA: initials
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
  _playerName = _teamName = _emojiAvatar = undefined;
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
    _emojiAvatar = info.emoji || '';
    pingEventServer(EventSyncActivity.Open);
  }
  else if (!info || !info.player) {
    _playerName = _teamName = _emojiAvatar = undefined;
  }
  updateLoginUI();
}

/**
 * Ask the user for their username, and optionally team name (via @ suffix)
 * If they provide them, log them in.
 */
function promptLogin(evt:MouseEvent, login:boolean) {
  evt.stopPropagation();
  dismissLogin(null);
  const modal = document.createElement('div');
  const content = document.createElement('div');
  const close = document.createElement('span');
  const iframe = document.createElement('iframe');
  modal.id = 'modal-login';
  toggleClass(content, 'modal-content', true);
  toggleClass(close, 'modal-close', true);
  close.appendChild(document.createTextNode("×"));
  close.title = 'Close';
  close.onclick = function(e) {dismissLogin(e)};
  iframe.src = login ? 'LoginUI.xhtml?iframe&modal' : 'LoginUI.xhtml?iframe&modal&logout';
  content.appendChild(close);
  content.appendChild(iframe);
  modal.appendChild(content);

  document.getElementById('pageBody')?.appendChild(modal);  // first child of <body>
  document.getElementById('pageBody')?.addEventListener('click', function(event) {dismissLogin(event)});
}

function dismissLogin(evt:MouseEvent|null) {
  var modal = document.getElementById('modal-login');
  if (modal) {
    document.getElementById('pageBody')?.removeChild(modal);
    autoLogin();
  }
  if (evt) {
    evt.stopPropagation();
  }
}

/**
 * Ask the user if they want to log out. If they confirm, clear their cached login.
 */
function promptLogout(evt:MouseEvent) {
  evt.stopPropagation();
  var ask = confirm('Log out?')
  if (ask) {
    doLogout();
  }
}

/**
 * The caller has a generic function, not knowing if we're currently logged in our out.
 * Whichever we are, this prompts with an invitation to switch modes.
 */
export function promptLogInOrOut(evt:MouseEvent) {
  if (_playerName) {
    promptLogout(evt);
  }
  else {
    promptLogin(evt, true);
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
  let avatar = document.getElementById('Login-avatar');
  if (!avatar) {
    avatar = document.createElement('span');
    avatar.id = 'Login-avatar';
    div.appendChild(avatar);
  }
  let span = document.getElementById('Login-player');
  if (!span) {
    span = document.createElement('span');
    span.id = 'Login-player';
    div.appendChild(span);
  }

  toggleClass(div, 'logged-in', !!_playerName);
  toggleClass(div, 'avatar', !!_emojiAvatar);
  if (_playerName) {
    // Logged in
    if (_emojiAvatar) {
      avatar.innerText = _emojiAvatar;
    }
    else {
      img.src = _teamName ? '../Icons/logged-in-team.png' : '../Icons/logged-in.png';
      avatar.innerHTML = '';
    }
    span.innerText = _teamName ? (_playerName + ' @ ' + _teamName) : _playerName;
    div.onclick = function(e) { promptLogout(e);};
    div.title = "Log out?";
  }
  else {
    // Logged oit
    img.src = '../Icons/logged-out.png';
    avatar.innerHTML = '';
    span.innerText = "Login?";
    div.onclick = function(e) { promptLogin(e, true);};
    div.title = "Log in?";
  }
}