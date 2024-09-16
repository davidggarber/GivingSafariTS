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
  var existing = Array.from(table.getElementsByTagName('tr'));
  existing = existing.map(e => e.id);
  existing = Object.assign({}, ...existing.map(id => ({ [id]: def })));
  return existing;
}

function createRow(id, row, colKeys) {
  var tr = document.createElement('tr');
  tr.id = id;
  for (var key of colKeys) {
    tr.appendChild(createCell(row[key], key));
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
  if (cls) {
    toggleClass(td, cls, true);
  }
  return td;
}