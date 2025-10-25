const urlArgs = {};

function debugSetup() {
    var search = window.location.search;
    if (search !== '') {
        search = search.substring(1);  // trim leading ?
        var args = search.split('&');
        for (var i = 0; i < args.length; i++) {
            var toks = args[i].split('=');
            if (toks.length > 1) {
                urlArgs[toks[0].toLowerCase()] = toks[1];
            }
            else {
                urlArgs[toks[0].toLowerCase()] = true;  // e.g. present
            }
        }
    }
}

function isDebug() {
    return urlArgs['debug'] != undefined && urlArgs['debug'] !== false;
}

function isIFrame() {
    return urlArgs['iframe'] != undefined && urlArgs['iframe'] !== false;
}

function simpleSetup(load) {
    debugSetup();
    setupNotes();
    setupDecoderToggle();
    setupCrossOffs();
    setupAbilities();
    
    indexAllNoteFields();
    indexAllCheckFields();

    if (typeof initGuessFunctionality === 'function') {
        initGuessFunctionality();
    }

    if (isIFrame()) {
        var bodies = document.getElementsByTagName('body');
        bodies[0].classList.add('iframe');
    }

    if (load == true) {
        setTimeout(checkLocalStorage, 100);
    }
}

// look for elements tagged with any of the implemented "notes" classes.
// Each of these will end up with a notes input area, near the owning element.
// Note fields are for players to jot down their thoughts, before comitting to an answer.
function setupNotes() {
    var index = 0;
    index = setupNotesCells('notes-above', 'note-above', index);
    index = setupNotesCells('notes-below', 'note-below', index);
    index = setupNotesCells('notes-right', 'note-right', index);
    index = setupNotesCells('notes-left', 'note-left', index);
    index = setupNotesCells('notes', index);
    setupNotesToggle();
}

function setupNotesCells(findClass, tagInput, index) {
    var cells = document.getElementsByClassName(findClass);
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        // Place a small text input field in each cell
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.classList.add('note-input');
        if (tagInput != undefined) {
            inp.classList.add(tagInput);
        }
        inp.onkeyup=function(e){onNoteArrowKey(e)};
        inp.onchange=function(e){onNoteChange(e)};
        cell.appendChild(inp);
    }
    return index;
}

function onNoteArrowKey(event) {
    if (event.isComposing) {
        return;  // Don't interfere with IMEs
    }

    var input = event.currentTarget;

    var code = event.code;
    if (code == 'Enter') {
        code = event.shiftKey ? 'ArrowUp' : 'ArrowDown';
    }
    if (code == 'ArrowUp' || code == 'PageUp') {
        moveFocus(findNextOfClass(input, 'note-input', null, -1));
        return;
    }
    else if (code == 'Enter' || code == 'ArrowDown' || code == 'PageDown') {
        moveFocus(findNextOfClass(input, 'note-input', null));
        return;
    }
}

function onNoteChange(event) {
    if (event.isComposing) {
        return;  // Don't interfere with IMEs
    }

    var note =  findParentOfClass(event.currentTarget, 'note-input');
    saveNoteLocally(note);
}

// Notes can be toggled on or off, and when on, can also be lit up to make them easier to see.
var NoteState = {
    Disabled: 0,
    Visible: 1,
    Subdued: 2,  // Enabled but not highlighted
    MAX: 3,
};

// The note visibility state is tracked by a a class in the body tag.
function getNoteState() {
    var body = document.getElementsByTagName('body')[0];
    if (hasClass(body, 'show-notes')) {
        return NoteState.Visible;
    }
    return hasClass(body, 'enable-notes')
        ? NoteState.Subdued : NoteState.Disabled;
}

// Update the body tag to be the desired visibility state
function setNoteState(state) {
    var body = document.getElementsByTagName('body')[0];
    toggleClass(body, 'show-notes', state == NoteState.Visible);
    toggleClass(body, 'enable-notes', state == NoteState.Subdued);
}

// There is a Notes link in the bottom corner of the page.
// Set it up such that clicking rotates through the 3 visibility states.
function setupNotesToggle() {
    var toggle = document.getElementById('notes-toggle');
    if (toggle == null) {
        return;
    }
    var state = getNoteState();
    if (state == NoteState.Disabled) {
        toggle.innerText = 'Show Notes';
    }
    else if (state == NoteState.Subdued) {
        toggle.innerText = 'Disable Notes';
    }
    else {  // NoteState.Visible
        toggle.innerText = 'Dim Notes';
    }
    toggle.href = 'javascript:toggleNotes()';
}

// Rotate to the next note visibility state.
function toggleNotes() {
    var state = getNoteState();
    setNoteState((state + 1) % NoteState.MAX);
    setupNotesToggle();
}

// The decoder frame is either visible (true), hidden (false), or not present (null)
function getDecoderState() {
    var frame = document.getElementById('decoder-frame');
    if (frame != null) {
        var style = window.getComputedStyle(frame);
        return style.display != 'none';
    }
    return null;
}

// Update the body tag to be the desired visibility state
function setDecoderState(state) {
    var frame = document.getElementById('decoder-frame');
    if (frame != null) {
        var src = '../Decoders/index.html';
        var mode = frame.getAttributeNS('', 'data-decoder-mode');
        if (mode != null) {
            src = '../Decoders/' + mode + '.html';
        }
        frame.style.display = state ? 'block' : 'none';
        if (frame.src === '' || !state) {
            frame.src = src;
        }
    }
}

// There is a Decoders link in the bottom corner of the page.
// Set it up such that clicking rotates through the 3 visibility states.
function setupDecoderToggle() {
    var toggle = document.getElementById('decoder-toggle');
    if (toggle == null) {
        return;
    }
    var visible = getDecoderState();
    if (visible) {
        toggle.innerText = 'Hide Decoders';
    }
    else {
        toggle.innerText = 'Show Decoders';
    }
    toggle.href = 'javascript:toggleDecoder()';
}

// Rotate to the next note visibility state.
function toggleDecoder() {
    var visible = getDecoderState();
    setDecoderState(!visible);
    setupDecoderToggle();
}

// Elements tagged with class = 'cross-off' are for puzzles clues that don't indicate where to use it.
// Any such elements are clickable. When clicked, a check mark is toggled on and off, allowed players to mark some clues as done.
function setupCrossOffs() {
    var cells = document.getElementsByClassName('cross-off');
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        // Place a small text input field in each cell
        cell.onclick=function(e){OnCrossOff(e)};

        var check = document.createElement('span');
        check.classList.add('check');
        check.innerHTML = '&#x2714;&#xFE0F;' // ✔️;
        cell.appendChild(check);
    }
}

function OnCrossOff(event) {
    var obj = event.srcElement;
    if (obj.tagName == 'A' || hasClass(obj, 'note-input') || hasClass(obj, 'letter-input') || hasClass(obj, 'word-input')) {
        return;  // Clicking on lines, notes, or inputs should not check anything
    }
    obj = findParentOfClass(obj, 'cross-off');
    if (obj != null) {
        var newVal = !hasClass(obj, 'crossed-off');
        toggleClass(obj, 'crossed-off', newVal);
        saveCheckLocally(obj, newVal);
    }
}

function ToggleHighlight(elmt) {
    if (elmt == null) {
        elmt = document.activeElement;  // will be body if no inputs have focus
    }
    var highlight = findParentOfClass(elmt, 'can-highlight');
    if (highlight) {
        toggleClass(highlight, 'highlighted');
        saveHighlightLocally(highlight);
    }
}

function setupAbilities() {
    var ability = document.getElementById('ability');
    if (ability == null) {
        return;
    }
    var text = ability.innerText;
    var fancy = '';
    var count = 0;
    while (text.length > 0) {
        if (text.startsWith('✔️')) {
            fancy += '<span id="check-ability" title="Click items to check them off">✔️</span>';
            text = text.substring('✔️'.length);
            count++;
        }
        else if (text.startsWith('💡')) {
            fancy += '<span id="highlight-ability" title="Ctrl+` to highlight cells" style="text-shadow: 0 0 3px black;">💡</span>';
            indexAllHighlightableFields();
            text = text.substring('💡'.length);
            count++;
        }
        else if (text.startsWith('👈')) {
            fancy += '<span id="drag-ability" title="Drag & drop enabled" style="text-shadow: 0 0 3px black;">👈</span>';
            indexAllHighlightableFields();
            text = text.substring('👈'.length);
            count++;
        }
        else {
            fancy += text.substring(0, 1);
            text = text.substring(1);
        }
    }
    ability.innerHTML = fancy;
    if (count == 2) {
        ability.style.right = '0.1in';
    }

    var highlight = document.getElementById('highlight-ability');
    if (highlight != null) {
        highlight.onmousedown = function() {ToggleHighlight()};
    }
}

function getMetaContent(name) {
    var metas = document.getElementsByTagName('meta');
    name = name.toLowerCase();
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].name.toLowerCase() === name) {
            return metas[i].content;
        }
    }
    return null;
}

function getPuzzleName() {
    return getMetaContent('puzzle-name');
}

function getPuzzleKey() {
    return getMetaContent('puzzle-key');
}

function getPuzzleSaveKey() {
    return getOtherFileHref(getPuzzleKey());
}