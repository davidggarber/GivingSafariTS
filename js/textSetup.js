"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textSetup = void 0;
var classUtil_1 = require("./classUtil");
var textInput_1 = require("./textInput");
var storage_1 = require("./storage");
/**
 * On page load, look for any instances of elements tag with class names we respond to.
 * When found, expand those elements appropriately.
 */
function textSetup() {
    setupLetterPatterns();
    setupExtractPattern();
    setupLetterCells();
    setupLetterInputs();
    setupWordCells();
    (0, storage_1.indexAllInputFields)();
}
exports.textSetup = textSetup;
/**
 * Look for elements of class 'create-from-pattern'.
 * When found, use the pattern, as well as other inputs, to build out a sequence of text inputs inside that element.
 * Secondary attributes:
 *   data-letter-pattern: A string specifying the number of input, and any decorative text.
 *                        Example: "2-2-4" would create _ _ - _ _ - _ _ _ _
 *                        Special case: The character '¤' is reserved for a solid block, like you might see in a crossword.
 *   data-extract-indeces: A string specifying which of these inputs should be auto-extracted.
 *                         The input indeces start at 1. To use more than one, separate by spaces.
 *                         Example: "1 8" would auto-extract the first and last characters from the above pattern.
 *   data-number-assignments: An alternate way of specifying which inputs to auto-extract.
 *                            Use this when the destination of the extracted characters is not in reading order.
 *                            Example: "1=4 8=5" would auto-extract the first and last characters from the above pattern,
 *                            and those characters would become the 4th and 5th characters in the extracted answer.
 *   data-input-style: Specifies the look of each input field (not those tagged for extraction).
 *                     Values implemented so far:
 *                     - underline (the default): renders each input as an underline, with padding between inputs
 *                     - box: renders each input as a box, with padding between inputs
 *                     - grid: renders each input as a box in a contiguous grid of boxes (no padding)
 *   data-literal-style: Specifies the look of characters that are mixed among the inputs (such as the dashes the in pattern above)
 *                       Values implemented so far:
 *                       - none (the default): no special decoration. The spacing will still stay even with inputs.
 *                       - box: renders each character in a box that is sized equal to a simple underline input.
 *   data-extract-style: Specifies the look of those input field that are tagged for extraction.
 *                       Values implemented so far:
 *                       - box: renders each input as a box, using the same spacing as underlines
 *   data-extract-image: Specifies an image to be rendered behind extractable inputs.
 *                       Example: "Icons/Circle.png" will render a circle behind the input, in addition to any other extract styles
 *   NOTE: the -style and -image fields can be placed on the affected pattern tag, or on any parent below the <BODY>.
 */
function setupLetterPatterns() {
    var patterns = document.getElementsByClassName('create-from-pattern');
    for (var i = 0; i < patterns.length; i++) {
        var parent = patterns[i];
        var pattern = parseNumberPattern(parent, 'data-letter-pattern');
        var extractPattern = parsePattern(parent, 'data-extract-indeces');
        var numberedPattern = parsePattern2(parent, 'data-number-assignments');
        var vertical = (0, classUtil_1.hasClass)(parent, 'vertical');
        var numeric = (0, classUtil_1.hasClass)(parent, 'numeric');
        var styles = getLetterStyles(parent, 'underline', null, numberedPattern == null ? 'box' : 'numbered');
        if (pattern != null) { //if (parent.classList.contains('letter-cell-block')) {
            var prevCount = 0;
            for (var pi = 0; pi < pattern.length; pi++) {
                if (pattern[pi]['type'] == 'number') {
                    var count = pattern[pi]['count'];
                    for (var ci = 1; ci <= count; ci++) {
                        var span = document.createElement('span');
                        (0, classUtil_1.toggleClass)(span, 'letter-cell', true);
                        (0, classUtil_1.applyAllClasses)(span, styles.letter);
                        (0, classUtil_1.toggleClass)(span, 'numeric', numeric);
                        var index = prevCount + ci;
                        //Highlight and Extract patterns MUST be in ascending order
                        if (extractPattern.indexOf(index) >= 0) {
                            (0, classUtil_1.toggleClass)(span, 'extract', true);
                            (0, classUtil_1.applyAllClasses)(span, styles.extract);
                        }
                        if (numberedPattern[index] !== undefined) {
                            (0, classUtil_1.toggleClass)(span, 'extract', true);
                            (0, classUtil_1.toggleClass)(span, 'numbered', true); // indicates numbers used in extraction
                            (0, classUtil_1.applyAllClasses)(span, styles.extract); // 'extract-numbered' indicates the visual appearance
                            var number = document.createElement('span');
                            (0, classUtil_1.toggleClass)(number, 'under-number');
                            number.innerText = numberedPattern[index];
                            span.setAttribute('data-number', numberedPattern[index]);
                            span.appendChild(number);
                        }
                        parent.appendChild(span);
                        if (vertical && (ci < count || pi < pattern.length - 1)) {
                            parent.appendChild(document.createElement('br'));
                        }
                    }
                    prevCount += count;
                }
                else if (pattern[pi]['type'] == 'text') {
                    var span = createLetterLiteral(pattern[pi]['char']);
                    span.classList.add(styles.literal);
                    parent.appendChild(span);
                    if (vertical && (pi < pattern.length - 1)) {
                        parent.appendChild(document.createElement('br'));
                    }
                }
            }
        }
    }
}
/**
 * Look for the standard styles in the current tag, and all parents
 * @param elmt - A page element
 * @param defLetter - A default letter style
 * @param defLiteral - A default literal style
 * @param defExtract - A default extraction style
 * @returns An object with a style name for each role
 */
function getLetterStyles(elmt, defLetter, defLiteral, defExtract) {
    var letter = (0, classUtil_1.getOptionalStyle)(elmt, 'data-input-style', defLetter, 'letter-');
    var literal = (0, classUtil_1.getOptionalStyle)(elmt, 'data-literal-style', defLiteral);
    literal = (literal != null) ? ('literal-' + literal) : letter;
    var extract = (0, classUtil_1.getOptionalStyle)(elmt, 'data-extract-style', defExtract, 'extract-');
    return {
        'letter': letter,
        'extract': extract,
        'literal': literal
    };
}
/**
 * Create a span block for a literal character, which can be a sibling of text input fields.
 * It should occupy the same space, although may not have the same decorations such as underline.
 * The trick is to create an empty, disabled input (to hold the size), and then render plain text in front of it.
 * @param char - Literal text for a single character. Special case the paragraphs as <br>
 * @returns The generated <span> element
 */
function createLetterLiteral(char) {
    if (char == '¶') {
        // Paragraph markers could be formatting, but just as likely are really spaces
        var br = document.createElement('br');
        br.classList.add('letter-input');
        br.classList.add('letter-non-input');
        br.setAttributeNS(null, 'data-literal', '¶');
        return br;
    }
    var span = document.createElement('span');
    span.classList.add('letter-cell');
    span.classList.add('literal');
    initLiteralLetter(span, char);
    return span;
}
/**
 * Helper for createLetterLiteral
 * @param span - The span being created
 * @param char - A character to show. Spaces are converted to nbsp
 */
function initLiteralLetter(span, char) {
    if (char == ' ') {
        span.innerText = '\xa0';
    }
    else if (char == '¤') {
        span.innerText = '\xa0';
        span.classList.add('block');
    }
    else {
        span.innerText = char;
    }
}
/**
 * Parse a pattern with numbers embedded in arbitrary text.
 * Each number can be multiple digits.
 * @example '$3.2' would return a list with 4 elements:
 *    {'type':'text', 'char':'$'}
 *    {'type':'number', 'count':'3'}
 *    {'type':'text', 'char':'.'}
 *    {'type':'number', 'count':'2'}
 * @param elmt - An element which may contain a pattern attribute
 * @param patternAttr - The pattern attribute
 * @returns An array of pattern tokens
 */
function parseNumberPattern(elmt, patternAttr) {
    var pattern = elmt.getAttributeNS('', patternAttr);
    if (pattern == null) {
        return null;
    }
    var list = [];
    for (var pi = 0; pi < pattern.length; pi++) {
        var count = 0;
        while (pi < pattern.length && pattern[pi] >= '0' && pattern[pi] <= '9') {
            count = count * 10 + (pattern.charCodeAt(pi) - 48);
            pi++;
        }
        if (count > 0) {
            list.push({ count: count });
        }
        if (pi < pattern.length) {
            list.push({ char: pattern[pi] });
        }
    }
    return list;
}
/**
 * Parse a pattern with numbers separated by spaces.
 * @example '12 3' would return a list with 2 elements: [12, 3]
 * If offset is specified, each number is shifted accordingly
 * @example '12 3' with offset -1 would return a list : [11, 2]
 * @param elmt - An element which may contain a pattern attribute
 * @param patternAttr - The pattern attribute
 * @param offset - (optional) An offset to apply to each number
 * @returns An array of numbers
 */
function parsePattern(elmt, patternAttr, offset) {
    if (offset === void 0) { offset = 0; }
    var pattern = elmt.getAttributeNS('', patternAttr);
    offset = offset || 0;
    var set = [];
    if (pattern != null) {
        var array = pattern.split(' ');
        for (var i = 0; i < array.length; i++) {
            set.push(parseInt(array[i]) + offset);
        }
    }
    return set;
}
/**
 * Parse a pattern with assignments separated by spaces.
 * Each assignment is in turn a number and a value, separated by an equal sign.
 * @example '2=abc 34=5' would return a dictionary with 2 elements: {'2':'abc', '34':'5'}
 * If offset is specified, each key number is shifted accordingly. But values are not shifted.
 * @example '2=abc 34=5' with offset -1 would return {'1':'abc', '33':'5'}
 * @param elmt - An element which may contain a pattern attribute
 * @param patternAttr - The pattern attribute
 * @param offset - (optional) An offset to apply to each number
 * @returns A generic object of names and values
 */
function parsePattern2(elmt, patternAttr, offset) {
    if (offset === void 0) { offset = 0; }
    var pattern = elmt.getAttributeNS('', patternAttr);
    offset = offset || 0;
    var set = {};
    if (pattern != null) {
        var array = pattern.split(' ');
        for (var i = 0; i < array.length; i++) {
            var equals = array[i].split('=');
            set[parseInt(equals[0]) + offset] = equals[1];
        }
    }
    return set;
}
/**
 * Once elements are created and tagged with letter-cell,
 * (which happens automatically when containers are tagged with create-from-pattern)
 * add input areas inside each cell.
 * If the cell is tagged for extraction, or numbering, add appropriate tags and other child nodes.
 * @example <div class="letter-cell"/> becomes:
 *   <div><input type='text' class="letter-input" /></div>  // for simple text input
 * If the cell had other attributes, those are either mirrored to the text input,
 * or trigger secondary attributes.
 * For example, letter-cells that also have class:
 *   "numeric" - format the input for numbers only
 *   "numbered" - label that cell for re-ordered extraction to a final answer
 *   "extract" - format that cell for in-order extraction to a final answer
 *   "extractor" - format that cell as the destination of extraction
 *   "literal" - format that cell as read-only, and overlay the literal text or whitespace
 */
function setupLetterCells() {
    var cells = document.getElementsByClassName('letter-cell');
    var extracteeIndex = 1;
    var extractorIndex = 1;
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        // Place a small text input field in each cell
        var inp = document.createElement('input');
        inp.type = 'text';
        if ((0, classUtil_1.hasClass)(cell, 'numeric')) {
            // We never submit, so this doesn't have to be exact. But it should trigger the mobile numeric keyboard
            inp.pattern = '[0-9]*'; // iOS
            inp.inputMode = 'numeric'; // Android
        }
        (0, classUtil_1.toggleClass)(inp, 'letter-input');
        if ((0, classUtil_1.hasClass)(cell, 'extract')) {
            (0, classUtil_1.toggleClass)(inp, 'extract-input');
            var extractImg = (0, classUtil_1.getOptionalStyle)(cell, 'data-extract-image', null);
            if (extractImg != null) {
                var img = document.createElement('img');
                img.src = extractImg;
                img.classList.add('extract-image');
                cell.appendChild(img);
            }
            if ((0, classUtil_1.hasClass)(cell, 'numbered')) {
                (0, classUtil_1.toggleClass)(inp, 'numbered-input');
                inp.setAttribute('data-number', cell.getAttribute('data-number'));
            }
            else {
                // Implicit number based on reading order
                inp.setAttribute('data-number', "" + extracteeIndex++);
            }
        }
        if ((0, classUtil_1.hasClass)(cell, 'extractor')) {
            (0, classUtil_1.toggleClass)(inp, 'extractor-input');
            inp.id = 'extractor-' + extractorIndex++;
        }
        if ((0, classUtil_1.hasClass)(cell, 'literal')) {
            inp.setAttribute('disabled', '');
            (0, classUtil_1.toggleClass)(inp, 'letter-non-input');
            inp.setAttribute('data-literal', cell.innerText == '\xa0' ? ' ' : cell.innerText);
            var span = document.createElement('span');
            (0, classUtil_1.toggleClass)(span, 'letter-literal');
            span.innerText = cell.innerText;
            cell.innerHTML = '';
            cell.appendChild(span);
        }
        cell.appendChild(inp);
    }
}
/**
 * Every input tagged as a letter-input should be hooked up to our all-purpose text input handler
 * @example, each <input type="text" class="letter-input" />
 *   has keyup/down/change event handlers added.
 */
function setupLetterInputs() {
    var inputs = document.getElementsByClassName('letter-input');
    for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        inp.onkeydown = function (e) { (0, textInput_1.onLetterKeyDown)(e); };
        inp.onkeyup = function (e) { (0, textInput_1.onLetterKey)(e); };
        inp.onchange = function (e) { (0, textInput_1.onLetterChange)(e); };
    }
}
/**
 * Once elements are created and tagged with word-cell, add input areas inside each cell.
 * @example <div class="word-cell"/> becomes:
 *   <div><input type='text' class="word-input" /></div>  // for simple multi-letter text input
 */
function setupWordCells() {
    var cells = document.getElementsByClassName('word-cell');
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var inpStyle = (0, classUtil_1.getOptionalStyle)(cell, 'data-word-style', 'underline', 'word-');
        // Place a small text input field in each cell
        var inp = document.createElement('input');
        inp.type = 'text';
        (0, classUtil_1.toggleClass)(inp, 'word-input');
        if (inpStyle != null) {
            (0, classUtil_1.toggleClass)(inp, inpStyle);
        }
        if ((0, classUtil_1.hasClass)(cell, 'literal')) {
            inp.setAttribute('disabled', '');
            (0, classUtil_1.toggleClass)(inp, 'word-non-input');
            var span = document.createElement('span');
            (0, classUtil_1.toggleClass)(span, 'word-literal');
            span.innerText = cell.innerText;
            cell.innerHTML = '';
            cell.appendChild(span);
        }
        else {
            inp.onkeydown = function (e) { (0, textInput_1.onLetterKeyDown)(e); };
            inp.onkeyup = function (e) { (0, textInput_1.onWordKey)(e); };
            inp.onchange = function (e) { (0, textInput_1.onWordChange)(e); };
        }
        cell.appendChild(inp);
    }
}
/**
 * Expand any tag with class="extracted" to create the landing point for extracted answers
 * The area may be further annotated with data-number-pattern="..." and optionally
 * data-indexed-by-letter="true" to create sequences of numbered/lettered destination points.
 *
 * @todo: clarify the difference between "extracted" and "extractor"
 */
function setupExtractPattern() {
    var extracted = document.getElementById('extracted');
    if (extracted === null) {
        return;
    }
    var numbered = true;
    // Special case: if extracted root is tagged data-indexed-by-letter, 
    // then the indeces that lead here are letters rather than the usual numbers.
    var lettered = extracted.getAttributeNS('', 'data-indexed-by-letter') != null;
    // Get the style to use for each extracted value. Default: "letter-underline"
    var extractorStyle = (0, classUtil_1.getOptionalStyle)(extracted, 'data-extractor-style', 'underline', 'letter-');
    var numPattern = parseNumberPattern(extracted, 'data-number-pattern');
    if (numPattern === null) {
        numbered = false;
        numPattern = parseNumberPattern(extracted, 'data-letter-pattern');
    }
    if (numPattern != null) {
        var nextNumber = 1;
        for (var pi = 0; pi < numPattern.length; pi++) {
            if (numPattern[pi]['count'] !== null) {
                var count = numPattern[pi]['count'];
                for (var ci = 1; ci <= count; ci++) {
                    var span_1 = document.createElement('span');
                    (0, classUtil_1.toggleClass)(span_1, 'letter-cell');
                    (0, classUtil_1.toggleClass)(span_1, 'extractor');
                    (0, classUtil_1.toggleClass)(span_1, extractorStyle);
                    extracted.appendChild(span_1);
                    if (numbered) {
                        (0, classUtil_1.toggleClass)(span_1, 'numbered');
                        var number = document.createElement('span');
                        (0, classUtil_1.toggleClass)(number, 'under-number');
                        number.innerText = lettered ? String.fromCharCode(64 + nextNumber) : ("" + nextNumber);
                        span_1.setAttribute('data-number', "" + nextNumber);
                        span_1.appendChild(number);
                        nextNumber++;
                    }
                }
            }
            else if (numPattern[pi]['char'] !== null) {
                var span = createLetterLiteral(numPattern[pi]['char']);
                extracted.appendChild(span);
            }
        }
    }
}
/**
 * Has the user started inputing an answer?
 * @param event - Any user action that led here
 * @returns true if any letter-input or word-input fields have user values
 */
function hasProgress(event) {
    var inputs = document.getElementsByClassName('letter-input');
    for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        if (inp.value != '') {
            return true;
        }
    }
    inputs = document.getElementsByClassName('word-input');
    for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        if (inp.value != '') {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=textSetup.js.map