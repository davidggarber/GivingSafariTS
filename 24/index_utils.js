function expandPuzzles() {
  toggleClass(document.getElementById('table'), 'no-solver', !theSafariDetails.solverSite);
  var list = document.getElementById('puzzle_list');
  var metas = document.getElementById('meta_list');
  for (var i = 0; i < puzzles.length; i++) {
      var puz = puzzles[i];
      if (puz.group == group.puzzle) {
          var tr = document.createElement('tr');
          var thIcon = document.createElement('td');
          var tdTitle = document.createElement('td');
          var tdAuthor = document.createElement('td');
          var tdFeeder = document.createElement('td');
          var tdSubmit = document.createElement('td');
          tr.id = puzzleFile(puz);
          tr.classList.add('sortable');
          thIcon.classList.add('icons');
          tdTitle.classList.add('html');
          tdAuthor.classList.add('author');
          tdFeeder.classList.add('feeders');
          tdSubmit.classList.add('submital')

          var imgIcon = document.createElement('img');
          var aTitle = document.createElement('a');
          if (puz.icon) {
              imgIcon.src = 'Icons/' + puz.icon + '.png';
          }
          else {
              imgIcon.src = 'Icons/' + puz.type.icon + '.png';
              imgIcon.title = puz.type.alt;
          }
          if (puz.group != group.pending) {
              aTitle.href = puzzleHref(puz);
          }
          aTitle.target = '_blank';
          aTitle.innerText = puz.title;
          aTitle.classList.add('hover');
          tdAuthor.innerText = puz.author;
          var imgThumb = document.createElement('img');
          imgThumb.classList.add('thumb');
          imgThumb.src = 'Thumbs/' + puz.thumb + '.png';
          aTitle.appendChild(imgThumb);

          if (puz.feeder) {
              tdFeeder.appendChild(createFeeder(puz.feeder, false));
          }

          tr.appendChild(thIcon);
          tr.appendChild(tdTitle);
          tr.appendChild(tdFeeder);
          tr.appendChild(tdAuthor);
          tr.appendChild(tdSubmit);
          thIcon.appendChild(imgIcon);
          tdTitle.appendChild(aTitle);

          if (puz.group == group.meta) {
              metas.appendChild(tr);
          }
          else {
              list.appendChild(tr);
          }
      }
      addSolverLink(puz);
      markAsSolved(puzzleFile(puz));
  }

  var hovers = document.getElementsByClassName('hover');
  for (var i = 0; i < hovers.length; i++) {
      var aTitle = hovers[i];
      var td = findParentOfTag(aTitle, 'td');
      td.onmouseover=function(e){bigThumb(e)};
      td.onmouseout=function(e){littleThumb(e)};
  }
}

function addSolverLink(puz) {
  var tr = document.getElementById(puzzleFile(puz));
  if (tr) {
      var td = tr.getElementsByClassName('submital')[0];
      if (theSafariDetails.solverSite) {
          var aSubmit = document.createElement('a');
          aSubmit.href = theSafariDetails.solverSite + '/Solve?id=' + puzzleSolveId(puz);
          aSubmit.target = '_blank';
          aSubmit.appendChild(document.createTextNode('submit'));
          td.appendChild(aSubmit);
      }
  }
}

function markAsSolved(puzFile) {
  var tr = document.getElementById(puzFile);
  if (tr && !hasClass(tr, 'solved')) {
      var pStatus = getPuzzleStatus(puzFile);
      if (pStatus == 'solved') {
          var check = document.createElement('img');
          check.src = '../Icons/Check.png';
          toggleClass(check, 'solve-check', true);

          var td = tr.getElementsByClassName('submital')[0];
          td.appendChild(check);
          toggleClass(tr, 'solved', true);
      }
  }
}

// feed is a struct: [0] is the feeder name, [1] is the index (or 0 if indexes are used)
function createFeeder(feed, unlocked, altImg) {
  var spanFeed = document.createElement(unlocked ? 'a' : 'span');
  spanFeed.classList.add(feed[0]);
  spanFeed.title = feeders[feed[0]].tooltip;
  var imgFeed = document.createElement('img');
  imgFeed.classList.add(feed[0] + '-' + feed[1]);

  if (unlocked) {
      imgFeed.src = feeders[feed[0]].unlocked;
      spanFeed.classList.add('unlocked');
      spanFeed.target = '_blank';
      spanFeed.href = feeders[feed[0]].materials[feed[1]];
  }
  else {
      imgFeed.src = feeders[feed[0]].locked;
      spanFeed.classList.add('locked');
  }
  if (altImg) {
      imgFeed.src = altImg;
  }
  spanFeed.appendChild(imgFeed);
  var subFeed = document.createElement('sub');
  if (feed.length > 1 && feed[1] > 0) {
      subFeed.innerText = feed[1];
  }
  else {
      subFeed.innerText = ' ';  // need something, or else rows with subs will be taller
  }
  spanFeed.appendChild(subFeed);
  return spanFeed;
}

function updateProgress() {
  var feederKeys = Object.keys(feeders);
  for (var f = 0; f < feederKeys.length; f++) {
      var key = feederKeys[f];
      var feed = feeders[key];
      if (feed.type == 'meta') {
          var store = feed.store;
          var td = document.getElementById(key + '-unlocked');
          for (var i = 1; i <= feed.count; i++) {
              if (i in feed.materials) {
                  continue;
              }
              var materials = loadMetaMaterials(store, 0, i);
              if (materials != null) {
                  feed.materials[i] = materials['src'];
                  td.appendChild(createFeeder([key, i], true));

                  var imgs = document.getElementsByClassName(key + '-' + i);
                  for (var m = 0; m < imgs.length; m++) {
                      var img = imgs[m];
                      img.src = feeders[key].unlocked;
                      var span = img.parentNode;
                      span.classList.remove('locked');  // span
                      span.classList.add('unlocked');  // span
                  }
              }
          }
      }
      else {  // feed.type == 'challenge'
          td = document.getElementById(key + '-unlocked');
          if (!td || Object.keys(feed.materials).length > 0) {
              continue;
          }
          var materials = loadMetaMaterials(chal, 0, 1);
          if (materials != null) {
              feed.materials[0] = materials['src'];
              td.appendChild(createFeeder([chal, 0], true, 'Icons/ticket.png'));
          }
      }
  }

  var solved = listPuzzlesOfStatus('solved');
  for (var i = 0; i < solved.length; i++) {
      var name = solved[i];
      markAsSolved(name);
  }
}

// 1, 2, ... means that column index is sorted ascending
// -1, -2, ... means that (abs) column index is sorted descenind
var sortOrder = 2;  // Puzzle name

function sortTable(th) {
  var tr = th.parentNode;
  var allThs = tr.getElementsByTagName('th');
  var col = 0;
  for (var c of allThs) {
    col++;
    if (c == th) {
      break;
    }
  }

  var tbody = document.getElementById('puzzle_list');
  var rows = document.getElementsByClassName('sortable');
  var lookup = {};
  var order = [];
  for (var i = rows.length - 1; i >= 0; i--) {
      var row = rows[i];
      if (row.parentNode != tbody) {
          continue;
      }
      var cols = row.getElementsByTagName('td');
      var cell = cols[col - 1];
      var prevOrder = String(i).padStart(2, '0');
      var val = cell.innerHTML + ' ' + prevOrder;
      if (hasClass(th, 'completed') && hasClass(cell.parentNode, 'solved')) {
        val = '✔️' + val;
      }
      order.push(val);
      lookup[val] = row;
      tbody.removeChild(row);
  }
  order.sort();
  sortOrder = (sortOrder == col) ? -col : col;
  if (sortOrder < 0) {
      order.reverse();
  }
  for (var i = 0; i < order.length; i++) {
      var row = lookup[order[i]];
      tbody.appendChild(row);
  }
  // update header with arrow indicating sort order
  for (var t of allThs) {  // Clear previous sort state from all columns
    toggleClass(t, 'sortedAsc', false);
    toggleClass(t, 'sortedDesc', false);
  }
  toggleClass(th, 'sortedAsc', sortOrder > 0);
  toggleClass(th, 'sortedDesc', sortOrder < 0);
}

function bigThumb(evt) {
  var td = evt.target;
  if (td.tagName != 'A') {
      td = td.parentNode;
  }
  td.classList.add('big');
  td.classList.remove('little');
  var tr = findParentOfTag(td, 'tr');
  tr.classList.add('big');
}
function littleThumb(evt) {
  var td = evt.target;
  if (td.tagName != 'A') {
      td = td.parentNode;
  }
  td.classList.remove('big');
  td.classList.add('little');
  var tr = findParentOfTag(td, 'tr');
  tr.classList.remove('big');
}
