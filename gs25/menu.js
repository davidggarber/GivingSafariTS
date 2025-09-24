function setupSolvables() {
  document.addEventListener('visibilitychange', function (event) { syncProgress(); });
  var body = document.getElementsByTagName('body')[0];
  body.addEventListener('focus', function (event) { syncProgress(); } );
  // Then run it now.
  syncProgress();
}

var _unlocked_feeders = {};
var _refresh_interval = undefined;
var _stopRefreshing = new Date().getTime();
var _refreshEvery = 15 * 1000;  // 15 seconds


function syncProgress() {
  if (document.hidden) {
    return;
  }
  for (var i = 0; i < puzzles.length; i++) {
    var puz = puzzles[i];
    updateSolves(puz.file);
  }
  
  syncUnlockedMetas();

  // Once we start syncing, check every 15 seconds for 3 hours
  _stopRefreshing = new Date().getTime() + 3 * 60 * 60 * 1000;  // 1 hour of refreshes
  _refresh_interval = setInterval(timeToRefreshTeam, _refreshEvery);
  timeToRefreshTeam();  // With an initial call immediately
}

function syncUnlockedMetas() {
  var metaKeys = Object.keys(metas);
  for (var m = 0; m < metaKeys.length; m++) {
    var metaInfo = metas[metaKeys[m]];
    for (var i = 0; i <= metaInfo.count; i++) {
      updateUnlocked(metaInfo.store, i);
    }
  }
}

function timeToRefreshTeam() {
  if (new Date().getTime() >= _stopRefreshing) {
    clearInterval(_refresh_interval);
  }
  console.log(`${document.title} is ${document.visibilityState}`);
  if (document.visibilityState == 'visible') {
    refreshTeamHomePage(refreshTeamProgress);
  }
}

function updateSolves(puzFile) {
  var pStatus = getPuzzleStatus(puzFile);
  var tr = document.getElementById(puzFile);
  if (tr) {
    toggleClass(tr, 'solved', pStatus == 'solved');
  }
}

/**
 * Check to see if a meta material we know by title, has new local data.
 * That would mean it has been unlocked - either locally or by team sync.
 * For each, change their UI to unlocked, and hook up their link to that URL.
 * @param {*} meta 
 * @param {*} i 
 */
function updateUnlocked(meta, i) {
  var puzFile = `${meta}-${i}`;
  if (!(puzFile in _unlocked_feeders)) {
    var pStatus = getPuzzleStatus(puzFile);
    if (pStatus) {
      var mat = loadMetaMaterials(meta, 0, i);
      if (mat) {
        _unlocked_feeders[puzFile] = true;
        var links = document.getElementsByClassName(puzFile);
        for (var a = 0; a < links.length; a++) {
          toggleClass(links[a], 'unlocked', true);
          links[a].href = mat.src + _urlEventArguments;
          if (links[a].title.endsWith(' (locked)')) {
            links[a].title = links[a].title.substring(0, links[a].title.length - 9);
          }
        }
      }
    }
  }
}

function refreshTeamProgress() {
  var overwrite = false;  // Prefer to merge where possible
  if (JSON.stringify(_teammates) != JSON.stringify(boiler.lookup.teammates)) {
    overwrite = boiler.lookup.teammates.length > _teammates.length;  // when we drop a team member
    boiler.lookup.teammates = _teammates;
    boiler.lookup.teamname = _teamName;
    refillFromTemplate(document.getElementById('team-roster'), 'teammate-list');
    updatePresence()
  }

  if (mergeSolves(overwrite)) {
    for (var puz of puzzles) {
      var tr = document.getElementById(puz.file);
      if (tr) {
        var span = tr.getElementsByClassName('teammate-solves')[0];
        if (span) {
          var solvers = boiler.lookup.solves[tr.getAttribute('name')] || [];
          var args = {solvers: solvers};
          refillFromTemplate(span, 'teammate-solves', args);
        }
      }
    }
  }

  if (_remoteUnlocked.length > 0) {
    var foundNew = false;
    var newlyUnlocked = [];
    for (var ru of _remoteUnlocked) {
      if (!ru.PuzzleName) {
        continue;  // bad data. Don't load, since we'll never be able to acknowledge the load
      }
      if (!(ru.PuzzleName in _unlocked_feeders)) {
        newlyUnlocked.push(ru.Url);
        // Don't add to _unlocked_feeders. That happens once it's confirmed.
        foundNew = true;
      }
    }
    if (foundNew) {
      loadViaIframe(newlyUnlocked);
    }
  }
}

function updatePresence() {
  var presences = document.getElementsByClassName('presence-avatar');
  for (var i = presences.length - 1; i >= 0; i--) {
    var pres = presences[i];
    pres.parentNode.removeChild(pres);
  }

  for (var pp of boiler.lookup.teammates) {
    if (pp.Presence) {
      var tr = document.getElementsByName(pp.Presence)[0];
      if (tr) {
        var td = tr.getElementsByClassName('presence')[0];
        var span = document.createElement('span');
        toggleClass(span, 'presence-avatar', true);
        span.appendChild(document.createTextNode(pp.Avatar));
        span.setAttribute('title', pp.PlayerName);
        td.appendChild(span);
      }
    }
  }
}

function mergeSolves(overwrite)
{
  if (overwrite || _teamSolves.length == 0) {
    boiler.lookup.solves = {};
    return true;  // Special case: clear all
  }

  // _teamSolves is a list of tuples: PuzzleName and a list of players (PlayerName + Avatar)
  // boiler.lookup.solves is a dictionary of puzzle names to the list of players
  var changes = false;
  for (var i = 0; i < _teamSolves.length; i++) {
    var puz = _teamSolves[i].PuzzleName;
    var update = _teamSolves[i].Solvers;
    var keep = boiler.lookup.solves[puz] || [];
    // Make sure that new solvers are appended to existing ones
    for (var u = 0; u < update.length; u++) {
      var plyr = update[u];
      if (!keep.find(p => p.Player==plyr.Player && p.Avatar == plyr.Avatar)) {
        keep.push(update[u]);
        changes = true;
      }
    }
    boiler.lookup.solves[puz] = keep;
  }
  return changes;
}

function loadViaIframe(urls) {
  var div = document.getElementById('iframe-loader');
  for (var url of urls) {
    // Create a bunch of single-use iframes
    var url = urls.pop();
    const iframe = document.createElement('iframe');
    iframe.src = url;
    // Once we have confirmation of the iframe's load, scan for new data
    iframe.onload = function(){setTimeout(() => syncUnlockedMetas(), 500)};
    div.appendChild(iframe);
  }
}

/**
 * What round are we in currently?
 * Could be triggered by the current date & time, or by a URL argument.
 * @returns The index of the round.
 */
function roundFromDate() {
  var search = window.location.search.toLowerCase();
  var now = new Date();
  for (var r = rounds.length - 1; r >= 0; r--) {
    var rd = localReleaseTime(r);
    if (now >= rd) {
      return r;
    }
    var code = 'round=' + rounds[r].filename.toLowerCase();
    if (code && search.includes(code)) {
      return r;
    }
  }
  return 0;
}

/**
 * Name of the current round.
 * Used during sync, but not part of UI.
 * @returns round name, as titleSync.
 */
function roundName() {
  var round = roundFromDate();
  return rounds[round].filename;
}

/**
 * Get the date and time that round R will release puzzles.
 * @param {int} round 
 * @returns 
 */
function localReleaseTime(round) {
  var date = new Date(rounds[round].release);

  // Offset to round release time, UTC
  var time = new Date(date);
  time.setMinutes(time.getMinutes() + releaseHourUTC * 60);

  // Offset to local time
  const tzMinutes = new Date().getTimezoneOffset();
  time.setMinutes(time.getMinutes() - tzMinutes);
 
  return time;
}

/**
 * Construct a friendly date+time, for dates in the future.
 * Or simply time for today.
 * Or empty for times in the past.
 * @param {Date} date 
 * @returns A string like "Mar-3 at 14:05" or "14:05" or "" if in the past
 */
function timeToNextRound() {
  var round = roundFromDate();
  if (round + 1 >= rounds.length) {
    return '';
  }

  var date = localReleaseTime(round + 1);
  const hh = date.getHours();
  const mm = date.getMinutes();

  var wait = date - new Date();
  var days = Math.floor(wait / (1000 * 60 * 60 * 24));
  if (days >= 1) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mon = monthNames[date.getMonth()];
    const day = date.getDate();
    return `on ${mon}-${day} at ${hh}:${mm.toString().padStart(2, '0')}`;
  }
  if (days >= 0) {
    return `at ${hh}:${mm.toString().padStart(2, '0')}`;
  }
  return '';
}

