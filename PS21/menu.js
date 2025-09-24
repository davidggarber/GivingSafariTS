boiler.postSetup = setupSolvables;

function setupSolvables() {
  document.addEventListener('visibilitychange', function (event) { syncProgress(); });
  var body = document.getElementsByTagName('body')[0];
  body.addEventListener('focus', function (event) { syncProgress(); } );
  // Then run it now.
  syncProgress();
}

var unlocked_feeders = {};
var _refresh_interval = undefined;
var _stopRefreshing = new Date().getTime();
var _refreshEvery = 15 * 1000;  // 15 seconds


function syncProgress() {
  // if (document.hidden) {
  //   return;
  // }
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
  refreshTeamHomePage(refreshTeamProgress);
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
  if (!(puzFile in unlocked_feeders)) {
    var pStatus = getPuzzleStatus(puzFile);
    if (pStatus) {
      var mat = loadMetaMaterials(meta, 0, i);
      if (mat) {
        unlocked_feeders[puzFile] = true;
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

  if (JSON.stringify(_teamSolves) != JSON.stringify(boiler.lookup.solves)) {
    mergeSolves(overwrite);  // Merge new solve info with previous cache
    for (var puz of puzzles) {
      var tr = document.getElementById(puz.file);
      var span = tr.getElementsByClassName('teammate-solves')[0];
      if (span) {
        var args = {puz:puz.title};
        refillFromTemplate(span, 'teammate-solves', args);
      }
    }
  }

  if (_remoteUnlocked.length > 0) {
    var foundNew = false;
    var newlyUnlocked = [];
    for (var ru of _remoteUnlocked) {
      if (!ru.Piece) {
        continue;  // bad data. Don't load, since we'll never be able to acknowledge the load
      }
      if (!(ru.Piece in unlocked_feeders)) {
        newlyUnlocked.push(ru.Url);
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
        td.appendChild(span);
      }
    }
  }
}

function mergeSolves(overwrite)
{
  if (overwrite || Object.keys(_teamSolves).length == 0) {
    boiler.lookup.solves = {};
    return;  // Special case: clear all
  }

  var keys = Object.keys(_teamSolves);
  for (var i = 0; i < keys.length; i++) {
    var puz = keys[i];
    var update = _teamSolves[puz];
    var keep = boiler.lookup.solves[puz] || [];
    for (var u = 0; u < update.length; u++) {
      var plyr = update[u];
      if (!keep.find(p => p.Player==plyr.Player && p.Avatar == plyr.Avatar)) {
        keep.push(update[u]);
      }
    }
    boiler.lookup.solves[puz] = keep;
  }
}

function loadViaIframe(urls) {
  var div = document.getElementById('iframe-loader');
  for (var url of urls) {
    // Create a bunch of single-use iframes
    var url = urls.pop();
    const iframe = document.createElement('iframe');
    // Let the material know that this comes from syncing, rather than locally-unlocked.
    iframe.src = url + _urlEventArguments + '&from=sync';
    iframe.onload = function(){setTimeout(() => syncUnlockedMetas(), 500)};
    div.appendChild(iframe);
  }
}
