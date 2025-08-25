import { theBoiler } from "./_boilerplate";
import { consoleTrace } from "./_builder";
import { hasClass, toggleClass } from "./_classUtil";
import { cacheLogin, getLogin, TryParseJson } from "./_storage";

export enum EventSyncActivity {
  Open = "Open",
  Edit = "Edit",
  Attempt = "Attempt",
  Unlock = "Unlock",
  Solve = "Solve",
}

// Support testing against a local Sync server.
// Note: test environment does not define 'window'
const localSync = (typeof window !== 'undefined') ? (window.location.href.substring(0,5) == 'file:') : true;
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

  const data = {
    eventName: _eventName,
    player: _playerName,
    avatar: _emojiAvatar,
    team: _teamName,
    puzzle: theBoiler().title,
    activity: activity,
    data: guess || ''
  };

  await callSyncApi("PuzzlePing", data);
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
 * @param emoji The player's emoji avatar (optional)
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
 * @param isModal If true, helper functions are called on parent. Else, called in local frame.
 * @param deletePlayer If true, tell the server to forget the player. This is async. Else, do nothing async.
 */
async function doLogout(isModal:boolean, deletePlayer?:boolean) {
  if (deletePlayer) {
    const data = {
      eventName: _eventName,
      player: _playerName,
      avatar: _emojiAvatar,
      team: _teamName,
    };
    let callback:SyncCallback|undefined = undefined;
    try {
      callback = !isModal ? autoLogin
        : 'autoLogin' in parent ? (parent['autoLogin'] as SyncCallback)
        : undefined;
    }
    catch {
      // Will fail when running on local file: protocol
    }
    await callSyncApi("DeletePlayer", data, undefined, callback);
  }

  cacheLogin(_eventName, undefined);
  _playerName = _teamName = _emojiAvatar = undefined;
  updateLoginUI();
}

/**
 * Try to join an existing log-in
 * @param event The current event
 */
function autoLogin() {
  if (!canSyncEvents) {
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
function promptLogin(evt:MouseEvent) {
  evt.stopPropagation();
  dismissLogin(null);
  let modal = document.getElementById('modal-login') as HTMLDivElement;
  let iframe = document.getElementById('modal-iframe') as HTMLIFrameElement;
  if (modal && iframe) {
    iframe.src = `LoginUI.xhtml?iframe&modal&${theBoiler().safari}`;
    toggleClass(modal, 'hidden', false);
  }
  else {
    modal = document.createElement('div');
    const content = document.createElement('div');
    const close = document.createElement('span');
    iframe = document.createElement('iframe');
    modal.id = 'modal-login';
    iframe.id = 'modal-iframe';
    toggleClass(content, 'modal-content', true);
    toggleClass(close, 'modal-close', true);
    close.appendChild(document.createTextNode("×"));
    close.title = 'Close';
    close.onclick = function(e) {dismissLogin(e)};
    iframe.src = `LoginUI.xhtml?iframe&modal&${theBoiler().safari}`;
    content.appendChild(close);
    content.appendChild(iframe);
    modal.appendChild(content);
  
    document.getElementById('pageBody')?.appendChild(modal);  // first child of <body>
    document.getElementById('pageBody')?.addEventListener('click', function(event) {dismissLogin(event)});  
  }
}

function dismissLogin(evt:MouseEvent|null) {
  var modal = document.getElementById('modal-login');
  if (modal) {
    if (!hasClass(modal, 'hidden')) {
      toggleClass(modal, 'hidden', true);
      autoLogin();
      refreshTeamHomePage();
    }
  }
  if (evt) {
    evt.stopPropagation();
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
    div.onclick = function(e) { promptLogin(e);};
    div.title = "Log out?";
  }
  else {
    // Logged out
    img.src = '../Icons/logged-out.png';
    avatar.innerHTML = '';
    span.innerText = "Login?";
    div.onclick = function(e) { promptLogin(e);};
    div.title = "Log in?";
  }
}

type SyncCallback = (any) => void;

async function callSyncApi(apiName:string, data:object, jsonCallback?:SyncCallback, textCallback?:SyncCallback) {
  try {
      var xhr = new XMLHttpRequest();
      var url = (localSync ? "http://localhost:7071/api/"
          : "https://puzzyleventsync.azurewebsites.net/api/")
          + apiName;

      xhr.open("POST", url, true /*async*/);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 /*DONE*/) {
          consoleTrace(xhr.responseText);
          let response:any = xhr.responseText;
          let isText = true;
          try {
              var obj = TryParseJson(response, false);
              isText = false;  // it's json
              if (jsonCallback) {
                  jsonCallback(obj);
              }
          }
          catch {
            // Most likely problem is that xhr.responseText isn't JSON
            response = xhr.responseText || xhr.statusText;
          }
          if (isText && textCallback) {
            textCallback(response);
          }
      }
      };
      var strData = JSON.stringify(data);
      consoleTrace(`Calling ${apiName} with data=${strData}`);
      xhr.send(strData);
  }
  catch (ex) {
    console.error(ex);
  }
}

export async function refreshTeamHomePage(callback?:SimpleCallback) {
  if (!canSyncEvents || !_teamName) {
    _teammates = [];
    _teamSolves = {};
    _remoteUnlocked = [];
    if (callback) {
      callback();
    }
    else if (_onTeamHomePageRefresh) {
      _onTeamHomePageRefresh();
    }
    return;
  }

  const data = {
    eventName: _eventName,
    team: _teamName,
  };

  if (callback) {
    _onTeamHomePageRefresh = callback;
  }
  else {
    callback = _onTeamHomePageRefresh;
  }
  if (_onTeamHomePageRefresh) {
    await callSyncApi('TeamHomePage', data, onRefreshTeamHomePage);
  }
}

export type PlayerInfo = {
  Player: string;
  Avatar: string;
  Team?: string;
}

export type PlayerInfoPlus = {
  Player: string;
  Avatar: string;
  Team?: string;
  Presence?: string;
}

let _teammates:PlayerInfo[];

export interface SolveSummary {
  [key: string]: PlayerInfo[]
}

let _teamSolves:SolveSummary;

export type UnlockedPiece = {
  Piece: string;
  Url: string;
}

let _remoteUnlocked: UnlockedPiece[] = [];

type SimpleCallback = () => void;

let _onTeamHomePageRefresh:SimpleCallback|undefined = undefined;


function onRefreshTeamHomePage(json:object) {
  if ('teammates' in json) {
    _teammates = json['teammates'] as PlayerInfo[];
  }

  if ('solves' in json) {
    _teamSolves = json['solves'] as SolveSummary;
  }

  if ('unlocked' in json) {
    _remoteUnlocked = json['unlocked'] as UnlockedPiece[];
  }

  if (_onTeamHomePageRefresh) {
    _onTeamHomePageRefresh();
  }
}

/**
 * Ping server when a meta feeder has been unlocked.
 * Called directly by the file in question, when it is first loaded.
 * @param metaFeeder "[meta]-[index]"
 * @param url The file's actual window.location.href
 */
export async function syncUnlockedFile(metaFeeder:string, url:string) {
  if (!canSyncEvents || !_teamName) {
    return;
  }
  const data = {
    eventName: _eventName,
    player: _playerName,
    avatar: _emojiAvatar,
    team: _teamName,
    puzzle: metaFeeder,
    activity: EventSyncActivity.Unlock,
    data: url
  };

  await callSyncApi("PuzzlePing", data);
}