var localCache = { letters: {}, words: {}, notes: {}, checks: {}, containers: {}, positions: {}, drawings: {}, highlights: {}, time: null };

////////////////////////////////////////////////////////////////////////
// User interface
//

var checkStorage = null;

function checkLocalStorage() {
  if(window.location.href in localStorage){
    checkStorage = JSON.parse(localStorage.getItem(window.location.href));
    var empty = true;
    for (let key in checkStorage) {
      if (checkStorage[key] != null && checkStorage[key] != '') {
        empty = false;
      }
    }
    if (!empty) {
      createReloadUI(checkStorage.time);
    }
  }
}

var reloadButton = null;
var restartButton = null;

function createReloadUI(time) {
  var div = document.createElement('div');
  div.id = 'reloadLocalStorage';
  var img = document.createElement('img');
  img.classList.add('icon');
  img.src = './images-start_again_charlie_brown.png';
  var title = document.createElement('span');
  title.classList.add('title-font');
  title.innerText = document.getElementById('title').innerText;
  var p1 = document.createElement('p');
  p1.appendChild(document.createTextNode('Would you like to reload your progress on '));
  p1.appendChild(title);
  p1.appendChild(document.createTextNode(' from earlier?'));
  var now = new Date();
  var delta = now - new Date(time);
  var seconds = Math.ceil(delta / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var ago = 'The last change was ';
  if (days >= 2) {
    ago += days + ' days ago.';
  }
  else if (hours >= 2) {
    ago += hours + ' hours ago.';
  }
  else if (minutes >= 2) {
    ago += minutes + ' minutes ago.';
  }
  else {
    ago += seconds + ' seconds ago.';
  }
  var p2 = document.createElement('p');
  p2.innerText = ago;
  reloadButton = document.createElement('button');
  reloadButton.innerText = 'Reload';
  reloadButton.onclick = function(){doLocalReload(true)};
  reloadButton.onkeydown = function(e){onkeyReload(e)}
  restartButton = document.createElement('button');
  restartButton.innerText = 'Start over';
  restartButton.onclick = function(){cancelLocalReload(true)};
  restartButton.onkeydown = function(e){onkeyRestart(e)};
  var p3 = document.createElement('p');
  p3.appendChild(reloadButton);
  p3.appendChild(restartButton);
  div.appendChild(img);
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(p3);
  var page = document.getElementById('page');
  if (page == null) {
    if (confirm("Continue where you left off?")) {
      doLocalReload(false);
    }
    else {
      cancelLocalReload(false);
    }
  }
  else {
    page.appendChild(div);
    reloadButton.focus();
  }
}

function onkeyReload(e) {
  if (e.code=='Escape'){cancelLocalReload(true)}
  if (e.code.startsWith('Arrow')) {
    restartButton.focus();
  }
}

function onkeyRestart(e) {
  if (e.code=='Escape'){cancelLocalReload(true)}
  if (e.code.startsWith('Arrow')) {
    reloadButton.focus();
  }  
}

function doLocalReload(hide) {
  if (hide) {
    document.getElementById('reloadLocalStorage').style.display = 'none';
  }
  loadLocalStorage(checkStorage);
}

function cancelLocalReload(hide) {
  if (hide) {
    document.getElementById('reloadLocalStorage').style.display = 'none';
  }
  checkStorage = null;
  localStorage.removeItem(window.location.href);
}

//////////////////////////////////////////////////////////
// Utilities for saving to local cache
//

function saveCache() {
  if (!reloading) {
      localCache.time = new Date(); 
      localStorage.setItem(window.location.href, JSON.stringify(localCache));
  }
}

function saveLetterLocally(input) {
  if (input != null) {
    var index = getGlobalIndex(input);
    if (index != null && index != undefined) {
      localCache.letters[index] = input.value;
      saveCache();  
    }  
  }
}

function saveWordLocally(input) {
  if (input != null) {
    var index = getGlobalIndex(input);
    if (index != null && index != undefined) {
      localCache.words[index] = input.value;
      saveCache();  
    }  
  }
}

function saveNoteLocally(input) {
  if (input != null) {
    var index = getGlobalIndex(input);
    if (index != null && index != undefined) {
      localCache.notes[index] = input.value;
      saveCache();  
    }  
  }
}

function saveCheckLocally(element, value) {
  if (element != null) {
    var index = getGlobalIndex(element);
    if (index != null) {
      localCache.checks[index] = value;
      saveCache();
    }
  }
}

function saveContainerLocally(element, container) {
  if (element != null && container != null) {
    var elemIndex = getGlobalIndex(element);
    var destIndex = getGlobalIndex(container);
    if (elemIndex != null && destIndex != null) {
      localCache.containers[elemIndex] = destIndex;
      saveCache();
    }
  }
}

function savePositionLocally(element) {
  if (element != null) {
    var index = getGlobalIndex(element);
    if (index != null) {
      var pos = { x: parseInt(element.style.left), y: parseInt(element.style.top) };
      localCache.positions[index] = pos;
      saveCache();
    }
  }
}

// element is the container
function saveDrawingLocally(element) {
  if (element != null) {
    var index = getGlobalIndex(element);
    if (index != null) {
      var drawn = findFirstChildOfClass(element, 'drawnObject');
      if (drawn != null) {
        localCache.drawings[index] = drawn.getAttributeNS('', 'data-template-id');
      }
      else {
        delete localCache.drawings[index];
      }
      saveCache();
    }
  }
}

function saveHighlightLocally(element) {
  if (element != null) {
    var index = getGlobalIndex(element, 'ch');
    if (index != null) {
      localCache.highlights[index] = hasClass(element, 'highlighted');
      saveCache();
    }
  }
}

////////////////////////////////////////////////////////////////////////
// Utilities for applying global indeces for saving and loading
//

function applyGlobalIndeces(elements, suffix) {
  var attr = 'data-globalIndex';
  if (suffix != undefined) {
    attr += '-' + suffix;
  }
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttributeNS('', attr, i);
  }
}

function getGlobalIndex(elmt, suffix) {
  var attr = 'data-globalIndex';
  if (suffix != undefined) {
    attr += '-' + suffix;
  }
  return elmt.getAttributeNS('', attr);
}

// Add as gloablIndex attribute to every input field
function indexAllInputFields() {
  var inputs = document.getElementsByClassName('letter-input');
  applyGlobalIndeces(inputs);
  var inputs = document.getElementsByClassName('word-input');
  applyGlobalIndeces(inputs);
}

function indexAllNoteFields() {
  var inputs = document.getElementsByClassName('note-input');
  applyGlobalIndeces(inputs);
}

function indexAllCheckFields() {
  var inputs = document.getElementsByClassName('cross-off');
  applyGlobalIndeces(inputs);
}

function indexAllDragDropFields() {
  var inputs = document.getElementsByClassName('moveable');
  applyGlobalIndeces(inputs);
  inputs = document.getElementsByClassName('drop-target');
  applyGlobalIndeces(inputs);
}

function indexAllDrawableFields() {
  var inputs = document.getElementsByClassName('drawable');
  applyGlobalIndeces(inputs);
}

function indexAllHighlightableFields() {
  var inputs = document.getElementsByClassName('can-highlight');
  applyGlobalIndeces(inputs, 'ch');
}

////////////////////////////////////////////////////////////////////////
// Load from local storage
//

var reloading = false;
function loadLocalStorage(storage) {
  reloading = true;
  restoreLetters(storage.letters);
  restoreWords(storage.words);
  restoreNotes(storage.notes);
  restoreCrossOffs(storage.checks);
  restoreContainers(storage.containers);
  restorePositions(storage.positions);
  restoreDrawings(storage.drawings);
  restoreHighlights(storage.highlights);
  reloading = false;
}

function restoreLetters(values) {
  localCache.letters = values;
  var inputs = document.getElementsByClassName('letter-input');
  for (var i = 0; i < inputs.length; i++) {
      var value = values[i];
      if(value != null && value != undefined){
          inputs[i].value = value;
          afterInputUpdate(inputs[i]);
      }
  }
}

function restoreWords(values) {
  localCache.words = values;
  var inputs = document.getElementsByClassName('word-input');
  for (var i = 0; i < inputs.length; i++) {
      var value = values[i];
      if(value != null && value != undefined){
          inputs[i].value = value;
          var extractId = getOptionalStyle(inputs[i], 'data-extracted-id', null, 'extracted-');
          if (extractId != null) {
            UpdateWordExtraction(extractId);
          }            
      }
  }
  if (inputs.length > 0) {
    UpdateWordExtraction(null);
  }
}

function restoreNotes(values) {
  localCache.notes = values;
  var elements = document.getElementsByClassName('note-input');
  for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var globalIndex = getGlobalIndex(element);
      var value = values[globalIndex];
      if(value != undefined){
          element.value = value;
      }
  }  
}

function restoreCrossOffs(values) {
  localCache.checks = values;
  var elements = document.getElementsByClassName('cross-off');
  for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var globalIndex = getGlobalIndex(element);
      var value = values[globalIndex];
      if(value != undefined){
          toggleClass(element, 'crossed-off', value);
      }
  }  
}

function restoreContainers(containers) {
  localCache.containers = containers;
  var movers = document.getElementsByClassName('moveable');
  var targets = document.getElementsByClassName('drop-target');
  for (var i = 0; i < movers.length; i++) {
      var j = containers[i];
      if (j != null && j != undefined) {
          quickMove(movers[i], targets[j]);
      }
  }
}

function restorePositions(positions) {
  localCache.positions = positions;
  var movers = document.getElementsByClassName('moveable');
  for (var i = 0; i < movers.length; i++) {
      var pos = positions[i];
      if (pos != null && pos != undefined) {
          quickFreeMove(movers[i], pos);
      }
  }
}

function restoreDrawings(drawings) {
  localCache.drawings = drawings;
  var targets = document.getElementsByClassName('drawable');
  for (var i = 0; i < targets.length; i++) {
      var tool = drawings[i];
      if (tool != null && tool != undefined) {
          doDraw(targets[i], tool);
      }
  }
}

function restoreHighlights(highlights) {
  localCache.highlights = highlights == undefined ? {} : highlights;
  var elements = document.getElementsByClassName('can-highlight');
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var globalIndex = getGlobalIndex(element, 'ch');
    var value = highlights[globalIndex];
    if (value != undefined){
        toggleClass(element, 'highlighted', value);
    }
  }
}

////////////////////////////////////////////////////////////////////////
// Utils for sharing data between puzzles
//

function saveMetaMaterials(puzzle, up, page, obj) {
  var key = getOtherFileHref(puzzle, up) + "-" + page;
  localStorage.setItem(key, JSON.stringify(obj));
}

function loadMetaMaterials(puzzle, up, page) {
  var key = getOtherFileHref(puzzle, up) + "-" + page;
  if (key in localStorage) {
    return JSON.parse(localStorage.getItem(key));
  }
  return null;
}

// Convert the absolute href of the current window to a relative href
// levels: 1=just this file, 2=parent folder + fiole, etc.
function getRelFileHref(levels) {
  var bslash = window.location.href.lastIndexOf('\\');
  var fslash = window.location.href.lastIndexOf('/');
  var delim = '/';
  if (fslash < 0 || bslash > fslash) {
    delim = '\\';
  }

  var parts = window.location.href.split(delim);
  parts.splice(0, parts.length - levels)
  return parts.join(delim);
}

// Convert the absolute href of the current window to an absolute href of another file
// up: the number of steps up. 0=same folder. 1=parent folder, etc.
// file: name of other file
// rel: if set, only return the last N terms of the relative path
function getOtherFileHref(file, up, rel) {
  var bslash = window.location.href.lastIndexOf('\\');
  var fslash = window.location.href.lastIndexOf('/');
  var delim = '/';
  if (fslash < 0 || bslash > fslash) {
    delim = '\\';
  }

  // We'll replace the current filename and potentially some parent folders
  if (up == undefined) {
    up = 1
  }
  else {
    up += 1;
  }
  var parts = window.location.href.split(delim);
  parts.splice(parts.length - up, up, file)

  if (rel != undefined) {
    parts.splice(0, parts.length - rel)
  }

  return parts.join(delim);
}