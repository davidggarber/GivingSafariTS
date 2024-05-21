const answer_hashes = {
  'billdingsight': 'd85b40105dd0b9cdbe46a1ee1b96abdf1474ae96fb86bd28ca701f44f017ac3b',
  'bricklaying': 'eb91358b7f294b221b56617e87dc5f9a11b577844a124612351a1a3046bbeb0b',
};

// A list of all partials, disconnected from their parent puzzles
// 'hash' is the SHA256 hash of '<puzzle>=<guess>'
// (both in canonical form: all lower-case, no whitespace or punctuation)
// 'code-encrypted-phrase' is an encryption which, when combined with an alternate hash,
// yields an ASCII phrase up to ~63 characters long.
const partial_hashes = {
  'hash':'code-encrypted-phrase',  
};

// CSS class for a different types of responses
var ResponseClass = {
  Correct: 'correct',
  Incorrect: 'incorrect',
  Partial: 'partial',
}

// When a page is loaded, initialize answer functionality
// Any submit buttons should get activated
// If the puzzle is already answered, show the answer
// If guesses have been made, show them
function initGuessFunctionality() {
  var btns = document.getElementsByClassName('submit-button');
  for (var i = 0; i < btns.length; i++) {
    btns[i].onclick = function(e){onSubmitButton(e)};
  }

  if (hasGuessHistory(getPuzzleKey())) {
    var hist = loadGuessHistory(getPuzzleKey());
    for (var i = 0; i < hist.guesses.length; i++) {
      var result = hist.guesses[i];
      result.time = new Date(result.time);  // convert back to a time object, for consistency
      showGuessResults(result, hist.answer);
    }
  }
}

function onSubmitButton(event) {
  var btn = event.srcElement;
  var extract = getOptionalStyle(btn, 'data-extract');
  if (extract != null) {
    var div = document.getElementById(extract);
    var chars = div.getElementsByClassName('extractor-input');
    var guess = '';
    for (var i = 0; i < chars.length; i++) {
      guess += chars[i].value;
    }
    checkAnswer(getPuzzleKey(), guess);
  }
}

// Convert any string to its SHA-256 encoding
async function sha256(source) {
  const sourceBytes = new TextEncoder().encode(source);
  const digest = await window.crypto.subtle.digest("SHA-256", sourceBytes);
  const resultBytes = [...new Uint8Array(digest)];
  return resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");
}

// Accepts an answer guess
function checkAnswer(puzzle, guess) {
  var canonical = normalizeGuess(guess);
  sha256(canonical).then(
      function (hash) {
          checkAnswerHash(puzzle, guess, hash);
      }
  );  
}

// A normalized guess is all lower case, with no spaces or punctuation
function normalizeGuess(guess) {
  guess = guess.toLowerCase();
  var normal = '';
  for (var i = 0; i < guess.length; i++) {
    if (guess[i] >= 'a' && guess[i] <= 'z') {
      normal += guess[i];
    }
  }
  return normal;
}

// Check to see if an answer hash maps to the correct answer
function checkAnswerHash(puzzle, guess, hash) {
  var hist = loadGuessHistory(puzzle);
  var result = {
    time: new Date(),
    guess: guess,  // Save the actual guess - not the normalized one
    response: null,
    cls: '',
  };
  if (hash === answer_hashes[puzzle]) {
    result.response = 'Correct!';
    result.cls = ResponseClass.Correct;
    hist.answer = guess.toUpperCase();
  }
  else {
    // TODO: look for partial credit
    result.response = 'incorrect';
    result.cls = ResponseClass.Incorrect;
//    var parts = partial_hashes[puzzle];
//    if (hash in parts) {
//      var resp = parts[hash];
//    }
//    for (var i = 0; i < parts.length; i++) {
//      if ()
//    }
      // result.cls = ResponseClass.Partial;
  }
  hist['lastGuess'] = result.time;
  hist['guesses'].push(result);
  saveGuessHistory(puzzle, hist);
  showGuessResults(result, hist.answer);
}

// Have any guesses been recorded
function hasGuessHistory(puzzle) {
  var key = getOtherFileHref(puzzle) + "-guesses";
  return key in localStorage;
}

// Each puzzle's guess history is saved separate from its other save state
// (since you can guess a puzzle answer after working on its paper copy)
function loadGuessHistory(puzzle) {
  var key = getOtherFileHref(puzzle) + "-guesses";
  var load = {};
  if (key in localStorage) {
    load = JSON.parse(localStorage.getItem(key));
  }

  var hist = {  //blank
    lastGuess: null,
    guesses: [],
    answer: null,
    unlocked: [],
  };
  // Try to future-proof this system by copying only the fields from the storage we recognize
  if ('lastGuess' in load) {
    hist.lastGuess = load['lastGuess'];
  }
  if ('guesses' in load) {
    hist.guesses = load['guesses']
  }
  if ('answer' in load) {
    hist.answer = load['answer'];
  }
  if ('unlocked' in load) {
    hist.unlocked = load['unlocked'];
  }
  return hist;
}

// Save a puzzle's guess history
function saveGuessHistory(puzzle, history) {
  var key = getOtherFileHref(puzzle) + "-guesses";
  if (history == null || history == undefined) {
    history = {};
  }
  localStorage.setItem(key, JSON.stringify(history));
}

// Get the correct answer, if it has been found, or null if not
function getAnswerIfFound(puzzle) {
  var hist = loadGuessHistory(puzzle);
  return hist.answer;
}

// Update the UI to show the results of the user's guess
// results: a struct from checkAnswerHash()
// answer: the answer, if found (even if found earlier), else null
function showGuessResults(results, answer) {
  var answerArea = document.getElementById('answer-area');
  var guessArea = document.getElementById('guess-area');
  var guessRows = document.getElementById('guess-rows');
  var body = document.getElementsByTagName('body')[0];

  if (answerArea !== null) {
    answerArea.innerText = answer || '';
  }
  toggleClass(body, 'solved', answer != null);

  var guessId = 'guess-' + normalizeGuess(results.guess);
  var pastGuess = document.getElementById(guessId);
  if (pastGuess != null) {
    pastGuess.scrollIntoView();
    toggleClass(pastGuess, 'repeat-guess');
  }
  else if (guessRows !== null) {
    var tr = document.createElement('tr');
    tr.id = guessId;
    tr.classList.add(results.cls);
    var tdT = document.createElement('td');
    tdT.classList.add('time');
    tdT.innerText = results.time.toTimeString().substring(0, 8);  // hh:MM:ss
    var tdG = document.createElement('td');
    tdG.classList.add('guess');
    tdG.innerText = results.guess;
    var tdR = document.createElement('td');
    tdR.classList.add('response');
    tdR.innerText = results.response;
    tr.appendChild(tdT);
    tr.appendChild(tdG);
    tr.appendChild(tdR);
    guessRows.appendChild(tr);
    toggleClass(guessArea, 'show', true);
    tr.scrollIntoView();
  }
}

function clearGuessHistory() {
  saveGuessHistory(getPuzzleKey(), null);
  var guessArea = document.getElementById('guess-area');
  var guessRows = document.getElementById('guess-rows');
  var body = document.getElementsByTagName('body')[0];
  guessRows.innerHTML = '';
  toggleClass(body, 'solved', false);
  toggleClass(guessArea, 'show', false);
}