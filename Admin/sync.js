const localApi = window.location.href.substring(0,5) == 'file:';

async function queryServer(api, data, callback) {
  try {
      var xhr = new XMLHttpRequest();
      var url = (localApi ? "http://localhost:7071/api/"
          : "https://puzzyleventsync.azurewebsites.net/api/")
          + api;

      console.log(url);
      console.log(prettyJson(data));

      xhr.open("POST", url, true /*async*/);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 /*DONE*/) {
              console.log(xhr.responseText);
              callback(xhr.responseText);
          }
      };
      xhr.send(JSON.stringify(data));
  }
  catch (ex) {
      console.error(ex);
  }
}

function prettyJson(obj) {
  var pretty = JSON.stringify(obj);
  pretty = pretty.replaceAll("\\\"", "\'");
  pretty = pretty.replaceAll(",", ",\n ");
  return pretty.substring(1, pretty.length-1);
}

function rowIdSet(table, def) {
  return childIdSet(table, 'tr', def);
}

function childIdSet(parent, tag, def) {
  var existing = Array.from(parent.getElementsByTagName(tag));
  existing = existing.map(e => e.id);
  existing = Object.assign({}, ...existing.map(id => ({ [id]: def })));
  return existing;
}

function createRow(id, row, colKeys) {
  var tr = document.createElement('tr');
  tr.id = id;
  for (var key of colKeys) {
    tr.appendChild(createCell(row[key] || '', key));
  }
  return tr;
}

function refreshRow(tr, row, colKeys) {
  var i = 0;
  for (var key of colKeys) {
    if (i < tr.childNodes.length) {
      var td = tr.childNodes[i];
      if (td.innerText == (row[key] || "")) {
        toggleClass(td, 'new', false);
      }
      else {
        while (td.childNodes.length > 0) {
          td.removeChild(td.childNodes[0]);
        }
        td.appendChild(document.createTextNode(row[key]));
        toggleClass(td, 'new', true);
      }
    }
    else {
      tr.appendChild(createCell(row[key] || '', key));
      toggleClass(tr, 'new', true);
    }
    i++;
  }
  return tr;
}

function createRow1(id, text, cls) {
  var tr = document.createElement('tr');
  tr.id = id;
  tr.appendChild(createCell(text, cls));
  return tr;
}

function createCell(text, cls) {
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(text));
  if (safeClassName(cls)) {
    toggleClass(td, safeClassName(cls), true);
  }
  return td;
}

function safeClassName(cls) {
  return cls.replaceAll(' ', '');
}

function createLinkCell(text, url, cls) {
  var td = document.createElement('td');
  var a = document.createElement('a');
  a.appendChild(document.createTextNode(text));
  a.href = url;
  td.appendChild(a);
  if (cls) {
    toggleClass(td, cls, true);
  }
  return td;
}

function markAsMissing(ids) {
  for (var id of ids) {
    var elmt = document.getElementById(id);
    toggleClass(elmt, 'missing', true);
    toggleClass(elmt, 'new', false);
  }
}

function refreshPicker(response) {
  var list = JSON.parse(response);
  var select = document.getElementById('picker');
  if (!select) { return; }

  var current = select.getAttribute('value');
  while (select.childNodes.length > 0) {
    select.removeChild(select.childNodes[0]);
  }

  for (var item of list) {
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(item));
    select.appendChild(opt);
  }
  select.value = current;
}

// 1, 2, ... means that column index is sorted ascending
// -1, -2, ... means that (abs) column index is sorted descenind
var sortOrder = 0;  // Unsorted

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

  var sortNumeric = hasClass(th, 'sort-numeric');
  var table = findParentOfTag(th, 'table');
  var tbody = table.getElementsByTagName('tbody')[0];
  var rows = tbody.getElementsByTagName('tr');
  var lookup = {};
  var order = [];
  for (var i = rows.length - 1; i >= 0; i--) {
      var row = rows[i];
      var cols = row.getElementsByTagName('td');
      var cell = cols[col - 1];
      var prevOrder = String(i).padStart(2, '0');
      var val = cell.innerHTML.toUpperCase() + ' ' + prevOrder;
      if (sortNumeric) {
        // A column that is tagged as numerically sortable promises to only have
        // numeric cell contents. 
        val = parseFloat(cell.innerText);
        // There can still be ties, so the previous order is an additional fraction
        val += (val >= 0) ? (i / (100 * rows.length)) : ((i - rows.length) / (100 * rows.length));
      }
      order.push(val);
      lookup[val] = row;
      tbody.removeChild(row);
  }
  if (sortNumeric) {
    order.sort((a,b) => { return parseFloat(a) - parseFloat(b) });
  }
  else {
    order.sort();
  }
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
