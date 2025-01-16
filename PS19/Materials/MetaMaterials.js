function onLoadAssembly(page) {
  textSetup();

  var relHref = getRelFileHref(2);

  var materials = {
    href: relHref,
    images: [],
    alts: []
  }

  var body = document.getElementById('pageBody');
  var imgs = body.getElementsByTagName('img');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    var src = img.getAttribute('src');
    src = getOtherFileHref(src, 0, 2);
    var alt = img.getAttribute('alt');
    materials.images.push(src);
    materials.alts.push(alt);
  }

  // Store that we have discovered these materials.
  // This way, they will become visible from the meta puzzle.
  saveMetaMaterials('AssemblyLine', 1, page, materials);
}

// Clear the local cache
function forgetAssemblyMaterials() {
  for (var page = 1; page <= 4; page++) {
    saveMetaMaterials('AssemblyLine', 1, page, null);
  }
}

var exit_directions = ['north', 'south', 'east', 'west'];

function onLoadSeven(page) {
  textSetup();
  var squares = document.getElementsByClassName('square');
  for (var i = 0; i < squares.length; i++) {
    var square = squares[i];
    var index = parseInt(square.id.substring(6));
    var doors = [];
    for (var d = 0; d < exit_directions.length; d++) {
      var dir = exit_directions[d];
      if (square.getElementsByClassName(dir).length > 0) {
        doors.push(dir);
      }
    }

    var relHref = getRelFileHref(2);

    var materials = {
      href: relHref,
      page: '7' + page,
      title: square.getElementsByClassName('title')[0].innerText,
      description: square.getElementsByClassName('description')[0].innerText,
      exits: square.getElementsByClassName('exits')[0].innerText,
      doors: doors
    }
    saveMetaMaterials('Seven', 1, index, materials);
  }
}

// Clear the local cache
function forgetSevenWondersMaterials() {
  for (var index = 1; index <= 16; index++) {
    saveMetaMaterials('Seven', 1, index, null);
  }
}
