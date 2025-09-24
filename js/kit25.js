"use strict";
/************************************************************
 * Puzzyl.net puzzle-building web kit                       *
 ************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePositionLocally = exports.saveContainerLocally = exports.saveCheckLocally = exports.saveNoteLocally = exports.saveWordLocally = exports.saveLetterLocally = exports.TryParseJson = exports.checkLocalStorage = exports.storageKey = exports.showDecoder = exports.toggleDecoder = exports.setupDecoderToggle = exports.toggleHighlight = exports.setupHighlights = exports.setupCrossOffs = exports.toggleNotes = exports.setupNotes = exports.constructSvgStampable = exports.constructSvgImageCell = exports.constructSvgTextCell = exports.svg_xmlns = exports.constructTable = exports.newTR = exports.matrixFromElement = exports.isArrowKeyElement = exports.isTextInputElement = exports.getElementsByClassOrId = exports.SortElements = exports.moveFocus = exports.getAllElementsWithAttribute = exports.getOptionalComplex = exports.getOptionalStyle = exports.siblingIndexOfClass = exports.findNthChildOfClass = exports.findFirstChildOfClass = exports.findParentOfTag = exports.isSelfOrParent = exports.findParentOfClass = exports.isTag = exports.findEndInContainer = exports.findInNextContainer = exports.childAtIndex = exports.indexInContainer = exports.findNextOfClass = exports.clearAllClasses = exports.getAllClasses = exports.applyAllClasses = exports.hasClass = exports.removeClassGlobally = exports.toggleClass = void 0;
exports.setupSubways = exports.clicksFindInputs = exports.getLetterStyles = exports.textSetup = exports.getValueFromTextContainer = exports.hasInputGroup = exports.arrowFromInputGroup = exports.setCurrentInputGroup = exports.autoCompleteWord = exports.onWordChange = exports.onLetterChange = exports.extractWordIndex = exports.updateWordExtraction = exports.onWordKey = exports.onWordInput = exports.afterInputUpdate = exports.onLetterKey = exports.onLetterInput = exports.onLetterKeyUp = exports.onButtonKeyDown = exports.onLetterKeyDown = exports.onInputEvent = exports.cacheLogin = exports.getLogin = exports.forgetChildrenOf = exports.getCurFileName = exports.loadMetaPiece = exports.loadMetaMaterials = exports.resetPuzzleProgress = exports.resetAllPuzzleStatus = exports.listPuzzlesOfStatus = exports.getPuzzleStatus = exports.updatePuzzleList = exports.PuzzleStatus = exports.indexAllVertices = exports.indexAllHighlightableFields = exports.indexAllDrawableFields = exports.indexAllDragDropFields = exports.indexAllCheckFields = exports.indexAllNoteFields = exports.indexAllInputFields = exports.mapGlobalIndeces = exports.findGlobalIndex = exports.getGlobalIndex = exports.saveStates = exports.saveScratches = exports.saveGuessHistory = exports.saveStraightEdge = exports.saveHighlightLocally = exports.saveStampingLocally = void 0;
exports.validateInputReady = exports.setupValidation = exports.testBoilerplate = exports.theBoiler = exports.linkCss = exports.addLink = exports.forceReload = exports.isRestart = exports.isIcon = exports.isPrint = exports.isIFrame = exports.isBodyDebug = exports.isTrace = exports.isDebug = exports.urlArgExists = exports._rawHtmlSource = exports.showRatingUI = exports.createRatingUI = exports.sendFeedback = exports.sendRating = exports.syncUnlockedFile = exports.urlSansArgs = exports.refreshTeamHomePage = exports.pingEventServer = exports.setupEventSync = exports.EventSyncActivity = exports.lookupSafari = exports.enableValidation = exports.backlinkFromUrl = exports.getSafariDetails = exports.initSafariDetails = exports.clearAllStraightEdges = exports.createFromVertexList = exports.EdgeTypes = exports.getStraightEdgeType = exports.preprocessRulerFunctions = exports.distance2 = exports.distance2Mouse = exports.positionFromCenter = exports.doStamp = exports.getStampParent = exports.getCurrentStampToolId = exports.preprocessStampObjects = exports.preprocessSvgDragFunctions = exports.quickFreeMove = exports.quickMove = exports.initFreeDropZorder = exports.postprocessDragFunctions = exports.preprocessDragFunctions = exports.positionFromStyle = void 0;
exports.tokenizeText = exports.makeString = exports.makeInt = exports.makeFloat = exports.evaluateAttribute = exports.evaluateFormula = exports.treeifyFormula = exports.FormulaNode = exports.tokenizeFormula = exports.complexAttribute = exports.cloneText = exports.cloneTextNode = exports.cloneSomeAttributes = exports.cloneAttributes = exports.valueFromGlobalContext = exports.valueFromContext = exports.popBuilderContext = exports.pushBuilderContext = exports.testBuilderContext = exports.getBuilderContext = exports.theBoilerContext = exports.consoleComment = exports.consoleTrace = exports.splitEmoji = exports.normalizeName = exports.expandContents = exports.appendRange = exports.pushRange = exports.expandControlTags = exports.inSvgNamespace = exports.getParentIf = exports.getBuilderParentIf = exports.shouldThrow = exports.getTrimMode = exports.TrimMode = exports.popBuilderElement = exports.pushBuilderElement = exports.initElementStack = exports.hasBuilderElements = exports.traceTagComment = exports.debugTagAttrs = exports.CodeError = exports.elementSourceOffseter = exports.elementSourceOffset = exports.nodeSourceOffset = exports.wrapContextError = exports.isContextError = exports.ContextError = exports.theValidation = exports.decodeAndValidate = void 0;
exports.renderDiffs = exports.diffSummarys = exports.summarizePageLayout = exports.scanMetaMaterials = exports.setupMetaSync = exports.scratchCreate = exports.scratchClear = exports.textFromScratchDiv = exports.setupScratch = exports.builtInTemplate = exports.getTemplate = exports.appendFromTemplate = exports.refillFromTemplate = exports.useTemplate = exports.startInputArea = exports.inputAreaTagNames = exports.startIfBlock = exports.startForLoop = exports.textFromContext = exports.keyExistsInContext = void 0;
/*-----------------------------------------------------------
 * _classUtil.ts
 *-----------------------------------------------------------*/
/**
 * Add or remove a class from a classlist, based on a boolean test.
 * @param obj - A page element, or id of an element
 * @param cls - A class name to toggle (unless null)
 * @param bool - If omitted, cls is toggled in the classList; if true, cls is added; if false, cls is removed
 */
function toggleClass(obj, cls, bool) {
    const elmt = getElement(obj);
    if (!elmt || !cls) {
        return;
    }
    if (elmt !== null && elmt.classList !== null) {
        if (bool === undefined) {
            bool = !elmt.classList.contains(cls);
        }
        if (bool) {
            elmt.classList.add(cls);
        }
        else {
            elmt.classList.remove(cls);
            if (elmt.classList.length == 0) {
                elmt.removeAttribute('class');
            }
        }
    }
}
exports.toggleClass = toggleClass;
/**
 * Find all elements with this class, and remove from each.
 * @param cls A class name
 */
function removeClassGlobally(cls) {
    const elmts = document.getElementsByClassName(cls);
    for (let i = elmts.length - 1; i >= 0; i--) { // Backwards
        elmts[i].classList.remove(cls);
    }
}
exports.removeClassGlobally = removeClassGlobally;
/**
 * Several utilities allow an element to be passed as either a pointer,
 * or by its ID, or omitted completely.
 * Resolve to the actual pointer, if possible.
 * @param obj An element pointer, ID (string), or null/undefined
 * @returns The actual element, or else null
 */
function getElement(obj) {
    if (!obj) {
        return null;
    }
    if ('string' === typeof obj) {
        return document.getElementById(obj);
    }
    return obj;
}
/**
 * Check if an HTML element is tagged with a given CSS class
 * @param obj - A page element, or id of an element
 * @param cls - A class name to test
 * @returns true iff the class is in the classList
 */
function hasClass(obj, cls) {
    const elmt = getElement(obj);
    if (!elmt || !cls) {
        return false;
    }
    return elmt !== null
        && elmt.classList
        && elmt.classList.contains(cls);
}
exports.hasClass = hasClass;
/**
 * Apply all classes in a list of classes.
 * @param obj - A page element, or id of an element
 * @param classes - A list of class names, delimited by spaces
 */
function applyAllClasses(obj, classes) {
    var list = classes.split(' ');
    for (let cls of list) {
        toggleClass(obj, cls, true);
    }
}
exports.applyAllClasses = applyAllClasses;
/**
 * Convert the classList to a simple array of strings
 * @param obj A page element, or id of an element
 * @returns a string[]
 */
function getAllClasses(obj) {
    const elmt = getElement(obj);
    const list = [];
    elmt.classList.forEach((s, n) => list.push(s));
    return list;
}
exports.getAllClasses = getAllClasses;
/**
 * Apply all classes in a list of classes.
 * @param obj - A page element, or id of an element
 * @param classes - A list of class names, delimited by spaces
 */
function clearAllClasses(obj, classes) {
    const elmt = getElement(obj);
    let list = [];
    if (!classes) {
        elmt.classList.forEach((s, n) => list.push(s));
    }
    else if (typeof (classes) == 'string') {
        list = classes.split(' ');
    }
    else {
        list = classes;
    }
    for (let cls of list) {
        toggleClass(obj, cls, false);
    }
}
exports.clearAllClasses = clearAllClasses;
/**
 * Given one element, find the next one in the document that matches the desired class
 * @param current - An existing element
 * @param matchClass - A class that this element has
 * @param skipClass - [optional] A class of siblings to be skipped
 * @param dir - 1 (default) finds the next sibling, else -1 finds the previous
 * @returns A sibling element, or null if none is found
 */
function findNextOfClass(current, matchClass, skipClass, dir = 1) {
    var inputs = document.getElementsByClassName(matchClass);
    var found = false;
    for (let i = dir == 1 ? 0 : inputs.length - 1; i >= 0 && i < inputs.length; i += dir) {
        if (skipClass != undefined && hasClass(inputs[i], skipClass)) {
            continue;
        }
        if (found) {
            return inputs[i];
        }
        found = inputs[i] == current;
    }
    return null;
}
exports.findNextOfClass = findNextOfClass;
/**
 * Find the index of the current element among the siblings under its parent
 * @param current - An existing element
 * @param parentObj - A parent element (or the class of a parent)
 * @param sibClass - A class name shared by current and siblings
 * @returns - The index, or -1 if current is not found in the specified parent
 */
function indexInContainer(current, parentObj, sibClass) {
    let parent;
    if (typeof (parentObj) == 'string') {
        parent = findParentOfClass(current, parentObj);
    }
    else {
        parent = parentObj;
    }
    var sibs = parent.getElementsByClassName(sibClass);
    for (let i = 0; i < sibs.length; i++) {
        if (sibs[i] === current) {
            return i;
        }
    }
    return -1;
}
exports.indexInContainer = indexInContainer;
/**
 * Get the index'ed child element within this parent
 * @param parent - An existing element
 * @param childClass - A class of children under parent
 * @param index - The index of the desired child. A negative value counts back from the end
 * @returns The child element, or null if no children
 */
function childAtIndex(parent, childClass, index) {
    var sibs = parent.getElementsByClassName(childClass);
    if (index < 0) {
        index = sibs.length + index;
    }
    else if (index >= sibs.length) {
        index = sibs.length - 1;
    }
    if (index < 0) {
        return null;
    }
    return sibs[index];
}
exports.childAtIndex = childAtIndex;
/**
 * Given an input in one container, find an input in the next container
* @param current - the reference element
* @param matchClass - the class we're looking for
* @param skipClass - a class we're avoiding
* @param containerClass - the parent level to go up to, before coming back down
* @param dir - 1 (default) to go forward, -1 to go back
*/
function findInNextContainer(current, matchClass, skipClass, containerClass, dir = 1) {
    var container = findParentOfClass(current, containerClass);
    if (container == null) {
        return null;
    }
    var nextContainer = findNextOfClass(container, containerClass, undefined, dir);
    while (nextContainer != null) {
        var child = findFirstChildOfClass(nextContainer, matchClass, skipClass);
        if (child != null) {
            return child;
        }
        // Look further ahead
        nextContainer = findNextOfClass(nextContainer, containerClass, undefined, dir);
    }
    return null;
}
exports.findInNextContainer = findInNextContainer;
/**
 * Find either the first or last sibling element under a parent
* @param current - the reference element
* @param matchClass - the class we're looking for
* @param skipClass - a class we're avoiding
* @param containerClass - the parent level to go up to, before coming back down
* @param dir - 1 (default) to go forward, -1 to go back
* @returns The first or last sibling element, or null if no matches
 */
function findEndInContainer(current, matchClass, skipClass, containerClass, dir = 1) {
    var container = findParentOfClass(current, containerClass);
    if (container == null) {
        return null;
    }
    return findFirstChildOfClass(container, matchClass, skipClass, dir);
}
exports.findEndInContainer = findEndInContainer;
/**
 * Determine the tag type, based on the tag name (case-insenstive)
 * @param elmt An HTML element
 * @param tag a tag name, or array of names
 */
function isTag(elmt, tag) {
    if (!elmt) {
        return false;
    }
    const tagName = elmt.tagName.toUpperCase();
    if (typeof (tag) == 'string') {
        return tagName == tag.toUpperCase();
    }
    const tags = tag;
    for (let i = 0; i < tags.length; i++) {
        if (tagName == tags[i].toUpperCase()) {
            return true;
        }
    }
    return false;
}
exports.isTag = isTag;
/**
 * Find the nearest containing node that contains the desired class.
 * @param elmt - An existing element
 * @param parentClass - A class name of a parent element
 * @returns The nearest matching parent element, up to but not including the body
 */
function findParentOfClass(elmt, parentClass) {
    if (parentClass == null || parentClass == undefined) {
        return null;
    }
    while (elmt !== null && !isTag(elmt, 'body')) {
        if (hasClass(elmt, parentClass)) {
            return elmt;
        }
        if (elmt.parentNode === document) {
            return null;
        }
        elmt = elmt.parentNode;
    }
    return null;
}
exports.findParentOfClass = findParentOfClass;
/**
 * Is the element anywhere underneath parent (including itself)
 * @param elmt An element
 * @param parent An element
 * @returns true if parent is anywhere in elmt's parent chain
 */
function isSelfOrParent(elmt, parent) {
    while (elmt !== null && !isTag(elmt, 'body')) {
        if (elmt === parent) {
            return true;
        }
        if (elmt.parentNode === document) {
            return null;
        }
        elmt = elmt.parentNode;
    }
    return false;
}
exports.isSelfOrParent = isSelfOrParent;
/**
 * Find the nearest containing node of the specified tag type.
 * @param elmt - An existing element
 * @param parentTag - A tag name of a parent element
 * @returns The nearest matching parent element, up to and including the body
 */
function findParentOfTag(elmt, parentTag) {
    if (parentTag == null || parentTag == undefined) {
        return null;
    }
    parentTag = parentTag.toUpperCase();
    while (elmt !== null) {
        const name = elmt.tagName.toUpperCase();
        if (name === parentTag) {
            return elmt;
        }
        if (name === 'BODY') {
            break;
        }
        if (elmt.parentNode === document) {
            return null;
        }
        elmt = elmt.parentNode;
    }
    return null;
}
exports.findParentOfTag = findParentOfTag;
/**
 * Find the first child/descendent of the current element which matches a desired class
 * @param elmt - A parent element
 * @param childClass - A class name of the desired child
 * @param skipClass - [optional] A class name to avoid
 * @param dir - If positive (default), search forward; else search backward
 * @returns A child element, if a match is found, else null
 */
function findFirstChildOfClass(elmt, childClass, skipClass = undefined, dir = 1) {
    var children = elmt.getElementsByClassName(childClass);
    for (let i = dir == 1 ? 0 : children.length - 1; i >= 0 && i < children.length; i += dir) {
        if (skipClass !== null && hasClass(children[i], skipClass)) {
            continue;
        }
        return children[i];
    }
    return null;
}
exports.findFirstChildOfClass = findFirstChildOfClass;
/**
 * Find the first child/descendent of the current element which matches a desired class
 * @param parent - A parent element
 * @param childClass - A class name of the desired child
 * @param index - Which child to find. If negative, count from the end
 * @returns A child element, if a match is found, else null
 */
function findNthChildOfClass(parent, childClass, index) {
    var children = parent.getElementsByClassName(childClass);
    if (index >= 0) {
        return (index < children.length) ? children[index] : null;
    }
    else {
        index = children.length + index;
        return (index >= 0) ? children[index] : null;
    }
}
exports.findNthChildOfClass = findNthChildOfClass;
/**
 * Get the index of an element among its siblings.
 * @param parent A parent/ancestor of the child
 * @param child Any element of type childClass
 * @param childClass A class that defines the group of siblings
 * @returns The index, or -1 if there's an error (the child is not in fact inside the specified parent)
 */
function siblingIndexOfClass(parent, child, childClass) {
    var children = parent.getElementsByClassName(childClass);
    for (let i = 0; i < children.length; i++) {
        if (children[i] == child) {
            return i;
        }
    }
    return -1;
}
exports.siblingIndexOfClass = siblingIndexOfClass;
/**
 * Look for any attribute in the current tag, and all parents (up to, but not including, body)
 * @param elmt - A page element
 * @param attrName - An attribute name
 * @param defaultStyle - (optional) The default value, if no tag is found with the attribute. Null if omitted.
 * @param prefix - (optional) - A prefix to apply to the answer
 * @returns The found or default style, optional with prefix added
 */
function getOptionalStyle(elmt, attrName, defaultStyle, prefix) {
    if (!elmt) {
        return null;
    }
    const e = getParentIf(elmt, (e) => e.getAttribute(attrName) !== null && cloneText(e.getAttribute(attrName)) !== '');
    let val = e ? e.getAttribute(attrName) : null;
    val = val !== null ? cloneText(val) : (defaultStyle || null);
    return (val === null || prefix === undefined) ? val : (prefix + val);
}
exports.getOptionalStyle = getOptionalStyle;
/**
 * Look for any attribute in the current tag, and all parents (up to, but not including, body)
 * @param elmt - A page element
 * @param attrName - An attribute name
 * @returns The found data, parsed as a complext attribute
 */
function getOptionalComplex(elmt, attrName) {
    if (!elmt) {
        return null;
    }
    const e = getParentIf(elmt, (e) => e.getAttribute(attrName) !== null);
    const val = e ? e.getAttribute(attrName) : null;
    return val !== null ? complexAttribute(val) : null;
}
exports.getOptionalComplex = getOptionalComplex;
/**
 * Loop through all elements in a DOM sub-tree, looking for any elements with an optional tag.
 * Recurse as needed. But once found, don't recurse within the find.
 * @param root The node to look through. Can also be 'document'
 * @param attr The name of an attribute. It must be present and non-empty to count
 * @returns A list of zero or more elements
 */
function getAllElementsWithAttribute(root, attr) {
    const list = [];
    for (let i = 0; i < root.childNodes.length; i++) {
        const child = root.childNodes[i];
        if (child.nodeType == Node.ELEMENT_NODE) {
            const elmt = child;
            if (elmt.getAttribute(attr)) {
                list.push(elmt);
                // once found, don't recurse
            }
            else {
                const recurse = getAllElementsWithAttribute(elmt, attr);
                for (let r = 0; r < recurse.length; r++) {
                    list.push(recurse[r]);
                }
            }
        }
    }
    return list;
}
exports.getAllElementsWithAttribute = getAllElementsWithAttribute;
/**
 * Move focus to the given field (if not null), and select the entire contents.
 * If field is of type number, do nothing.
 * @param field - A form field element
 * @param caret - The character index where the caret should go
 * @returns true if the field element and caret position are valid, else false
 */
function moveFocus(field, caret) {
    if (field !== null) {
        field.focus();
        if (isTag(field, 'input') || isTag(field, 'textarea')) {
            const input = field;
            if (input.type !== 'number') {
                if (caret === undefined) {
                    input.setSelectionRange(0, input.value.length);
                }
                else {
                    input.setSelectionRange(caret, caret);
                }
            }
        }
        if (isArrowKeyElement(field) && hasInputGroup(field)) {
            setCurrentInputGroup(field);
        }
        return true;
    }
    return false;
}
exports.moveFocus = moveFocus;
/**
 * Sort a collection of elements into an array
 * @param src A collection of elements, as from document.getElementsByClassName
 * @param sort_attr The name of the optional attribute, by which we'll sort. Attribute values must be numbers.
 * @returns An array of the same elements, either sorted, or else in original document order
 */
function SortElements(src, sort_attr = 'data-extract-order') {
    const lookup = {};
    const indeces = [];
    const sorted = [];
    for (let i = 0; i < src.length; i++) {
        const elmt = src[i];
        const order = getOptionalStyle(elmt, sort_attr);
        if (order) {
            // track order values we've seen
            if (!(order in lookup)) {
                indeces.push(parseInt(order));
                lookup[order] = [];
            }
            // make elements findable by their order
            lookup[order].push(elmt);
        }
        else {
            // elements without an explicit order go document order
            sorted.push(elmt);
        }
    }
    // Sort indeces, then build array from them
    indeces.sort((a, b) => a < b ? -1 : 1);
    for (let i = 0; i < indeces.length; i++) {
        const order = '' + indeces[i];
        const peers = lookup[order];
        for (let p = 0; p < peers.length; p++) {
            sorted.push(peers[p]);
        }
    }
    return sorted;
}
exports.SortElements = SortElements;
/**
 * Some abilities are hooked to either a single element with a predefined ID,
 * or a set of elements with a prefined class.
 * Usually, this is a v1 and v2, where the ID is supported as backwards compat.
 * @param cls An element class
 * @param id An element ID, unique in the document
 * @param parent If present, constrain class search to that parent,
 * else look document-wide. The ID is always documet-wide.
 * @returns A list of matching elements. The ID, if found, is first.
 */
function getElementsByClassOrId(cls, id, parent) {
    const list = [];
    let byId = null;
    if (id) {
        byId = document.getElementById(id);
        if (byId) {
            list.push(byId);
        }
    }
    if (parent && hasClass(parent, cls)) {
        list.push(parent);
    }
    const byClass = parent ? parent.getElementsByClassName(cls)
        : document.getElementsByClassName(cls);
    for (let i = 0; i < byClass.length; i++) {
        const elmt = byClass[i];
        if (elmt != byId) {
            list.push(elmt);
        }
    }
    return list;
}
exports.getElementsByClassOrId = getElementsByClassOrId;
function isTextInputElement(elmt) {
    return elmt ? (isTag(elmt, 'input') || isTag(elmt, 'textarea')) : false;
}
exports.isTextInputElement = isTextInputElement;
function isArrowKeyElement(elmt) {
    return elmt ? (isTextInputElement(elmt) || isTag(elmt, 'select') || isTag(elmt, 'button')) : false;
}
exports.isArrowKeyElement = isArrowKeyElement;
/**
 * Retrieve the local transform from an element.
 * This ignores any chain of additional transforms above the element.
 * @param element Any element.
 * @returns A matrix. Will be the identity if no transform applied.
 */
function matrixFromElement(element) {
    const computed = getComputedStyle(element).transform;
    if (computed == 'none') {
        return new DOMMatrix(); // Identity matrix
    }
    return new DOMMatrix(computed);
}
exports.matrixFromElement = matrixFromElement;
/**
 * Create a generic TR tag for each row in a table.
 * Available for TableDetails.onRow where that is all that's needed
 */
function newTR(y) {
    return document.createElement('tr');
}
exports.newTR = newTR;
/**
 * Create a table from details
 * @param details A TableDetails, which can exist in several permutations with optional fields
 */
function constructTable(details) {
    const root = document.getElementById(details.rootId);
    if (details.onRoot) {
        details.onRoot(root);
    }
    const height = (details.data) ? details.data.length : details.height;
    for (let y = 0; y < height; y++) {
        let row = root;
        if (details.onRow) {
            const rr = details.onRow(y);
            if (!rr) {
                continue;
            }
            root?.appendChild(rr);
            row = rr;
        }
        const width = (details.data) ? details.data[y].length : details.width;
        for (let x = 0; x < width; x++) {
            const val = (details.data) ? details.data[y][x] : '';
            const cc = details.onCell(val, x, y);
            if (cc) {
                row?.appendChild(cc);
            }
        }
    }
}
exports.constructTable = constructTable;
exports.svg_xmlns = 'http://www.w3.org/2000/svg';
const html_xmlns = 'http://www.w3.org/2000/xmlns';
function constructSvgTextCell(val, dx, dy, cls, stampable) {
    if (val == ' ') {
        return null;
    }
    var vg = document.createElementNS(exports.svg_xmlns, 'g');
    vg.classList.add('vertex-g');
    if (cls) {
        applyAllClasses(vg, cls);
    }
    vg.setAttributeNS('', 'transform', 'translate(' + dx + ', ' + dy + ')');
    var r = document.createElementNS(exports.svg_xmlns, 'rect');
    r.classList.add('vertex');
    var t = document.createElementNS(exports.svg_xmlns, 'text');
    t.appendChild(document.createTextNode(val));
    vg.appendChild(r);
    vg.appendChild(t);
    if (stampable) {
        var fog = document.createElementNS(exports.svg_xmlns, 'g');
        fog.classList.add('fo-stampable');
        var fo = document.createElementNS(exports.svg_xmlns, 'foreignObject');
        var fod = document.createElement('div');
        fod.setAttribute('xmlns', html_xmlns);
        fod.classList.add('stampable');
        fo.appendChild(fod);
        fog.appendChild(fo);
        vg.appendChild(fog);
    }
    return vg;
}
exports.constructSvgTextCell = constructSvgTextCell;
function constructSvgImageCell(img, dx, dy, id, cls) {
    var vg = document.createElementNS(exports.svg_xmlns, 'g');
    if (id) {
        vg.id = id;
    }
    vg.classList.add('vertex-g');
    if (cls) {
        applyAllClasses(vg, cls);
    }
    vg.setAttributeNS('', 'transform', 'translate(' + dx + ', ' + dy + ')');
    var r = document.createElementNS(exports.svg_xmlns, 'rect');
    r.classList.add('vertex');
    var i = document.createElementNS(exports.svg_xmlns, 'image');
    i.setAttributeNS('', 'href', img);
    vg.appendChild(r);
    vg.appendChild(i);
    return vg;
}
exports.constructSvgImageCell = constructSvgImageCell;
function constructSvgStampable() {
    var fo = document.createElementNS(exports.svg_xmlns, 'foreignObject');
    fo.classList.add('fo-stampable');
    var fod = document.createElement('div');
    fod.setAttribute('xmlns', html_xmlns);
    fod.classList.add('stampable');
    fo.appendChild(fod);
    return fo;
}
exports.constructSvgStampable = constructSvgStampable;
/*-----------------------------------------------------------
 * _notes.ts
 *-----------------------------------------------------------*/
/***********************************************************
 * NOTES.TS
 * Utilities for multiple kinds of annotations on a puzzle
 *  - Text fields near objects, to take notes
 *  - Check marks near objects, to show they've been used
 *  - Highlighting of objects
 * Each kind of annotation is optional. It can be turned on
 * in a puzzle's metadata.
 */
/**
 * Define an optional callback.
 * A puzzle document may define a function with this name, and will get called at the end of setup.
 */
let initGuessFunctionality;
function simpleSetup(load) {
    if (typeof initGuessFunctionality === 'function') {
        initGuessFunctionality();
    }
}
/**
 * Look for elements tagged with any of the implemented "notes" classes.
 * Each of these will end up with a notes input area, near the owning element.
 * Note fields are for players to jot down their thoughts, before comitting to an answer.
 */
function setupNotes(margins) {
    let index = 0;
    index = setupNotesCells('notes-above', 'note-above', index);
    index = setupNotesCells('notes-below', 'note-below', index);
    index = setupNotesCells('notes-right', 'note-right', index);
    index = setupNotesCells('notes-left', 'note-left', index);
    // Puzzles can use the generic 'notes' class if they have their own .note-input style
    index = setupNotesCells('notes', undefined, index);
    index = setupNotesCells('notes-abs', undefined, index);
    setupNotesToggle(margins);
    indexAllNoteFields();
    if (isPrint()) {
        setNoteState(NoteState.Disabled);
    }
    else if (isBodyDebug()) {
        setNoteState(NoteState.Visible);
    }
}
exports.setupNotes = setupNotes;
/**
 * Find all objects tagged as needing notes, then create a note cell adjacent.
 * @param findClass The class of the puzzle element that wants notes
 * @param tagInput The class of note to create
 * @param index The inde of the first note
 * @returns The index after the last note
 */
function setupNotesCells(findClass, tagInput, index) {
    var cells = document.getElementsByClassName(findClass);
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        // Place a small text input field in each cell
        let inp = document.createElement('input');
        inp.type = 'text';
        inp.classList.add('note-input');
        if (hasClass(cell, 'numeric')) {
            // Trigger the mobile numeric keyboard
            inp.pattern = '[0-9]*'; // iOS
            inp.inputMode = 'numeric'; // Android
        }
        if (tagInput != undefined) {
            inp.classList.add(tagInput);
        }
        inp.onkeyup = function (e) { onNoteArrowKey(e); };
        inp.onchange = function (e) { onNoteChange(e); };
        cell.appendChild(inp);
    }
    return index;
}
/**
 * Custom nabigation key controls from within notes
 * @param event The key event
 */
function onNoteArrowKey(event) {
    if (event.isComposing || event.currentTarget == null) {
        return; // Don't interfere with IMEs
    }
    const input = event.currentTarget;
    let code = event.code;
    if (code == 'Enter') {
        code = event.shiftKey ? 'ArrowUp' : 'ArrowDown';
    }
    if (code == 'ArrowUp' || code == 'PageUp') {
        moveFocus(findNextOfClass(input, 'note-input', undefined, -1));
        return;
    }
    else if (code == 'Enter' || code == 'ArrowDown' || code == 'PageDown') {
        moveFocus(findNextOfClass(input, 'note-input'));
        return;
    }
    noteChangeCallback(input);
}
/**
 * Each time a note is modified, save
 * @param event The change event
 */
function onNoteChange(event) {
    if (event.target == null || (event.type == 'KeyboardEvent' && event.isComposing)) {
        return; // Don't interfere with IMEs
    }
    const input = event.currentTarget;
    const note = findParentOfClass(input, 'note-input');
    saveNoteLocally(note);
    noteChangeCallback(note);
}
/**
 * Anytime any note changes, inform any custom callback
 * @param inp The affected input
 */
function noteChangeCallback(inp) {
    const fn = theBoiler().onNoteChange;
    if (fn) {
        fn(inp);
    }
}
/**
 * Notes can be toggled on or off, and when on, can also be lit up to make them easier to see.
 */
var NoteState = {
    Disabled: -1,
    Unmarked: 0,
    Visible: 1,
    Subdued: 2,
    MOD: 3,
};
/**
 * The note visibility state is tracked by a a class in the body tag.
 * @returns a NoteState enum value
 */
function getNoteState() {
    var body = document.getElementsByTagName('body')[0];
    if (hasClass(body, 'show-notes')) {
        return NoteState.Visible;
    }
    if (hasClass(body, 'enable-notes')) {
        return NoteState.Subdued;
    }
    return hasClass(body, 'disabled-notes') ? NoteState.Disabled : NoteState.Unmarked;
}
/**
 * Update the body tag to be the desired visibility state
 * @param state A NoteState enum value
 */
function setNoteState(state) {
    var body = document.getElementsByTagName('body')[0];
    toggleClass(body, 'show-notes', state == NoteState.Visible);
    toggleClass(body, 'enable-notes', state == NoteState.Subdued);
    toggleClass(body, 'disable-notes', state == NoteState.Disabled);
}
/**
 * There is a Notes link in the bottom corner of the page.
 * Set it up such that clicking rotates through the 3 visibility states.
 * @param margins the parent of the toggle UI
 */
function setupNotesToggle(margins) {
    let toggle = document.getElementById('notes-toggle');
    if (toggle == null && margins != null) {
        toggle = document.createElement('a');
        toggle.id = 'notes-toggle';
        margins.appendChild(toggle);
    }
    const state = getNoteState();
    if (state == NoteState.Disabled || state == NoteState.Unmarked) {
        toggle.innerText = 'Show Notes';
    }
    else if (state == NoteState.Visible) {
        toggle.innerText = 'Dim Notes';
    }
    else { // state == NoteState.Subdued
        // toggle.innerText = 'Disable Notes';
        toggle.innerText = 'Un-mark Notes';
    }
    toggle.href = 'javascript:toggleNotes()';
}
/**
 * Rotate to the next note visibility state.
 */
function toggleNotes() {
    const state = getNoteState();
    setNoteState((state + 1) % NoteState.MOD);
    setupNotesToggle(null);
}
exports.toggleNotes = toggleNotes;
/**
 * Elements tagged with class = 'cross-off' are for puzzles clues that don't indicate where to use it.
 * Any such elements are clickable. When clicked, a check mark is toggled on and off, allowed players to mark some clues as done.
 */
function setupCrossOffs() {
    const cells = document.getElementsByClassName('cross-off');
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        // Place a small text input field in each cell
        cell.onclick = function (e) { onCrossOff(e); };
        var check = document.createElement('span');
        check.classList.add('check');
        //check.innerHTML = '&#x2714;&#xFE0F;' // ✔️;
        cell.appendChild(check);
    }
    indexAllCheckFields();
}
exports.setupCrossOffs = setupCrossOffs;
/**
 * Handler for when an object that can be crossed off is clicked
 * @param event The mouse event
 */
function onCrossOff(event) {
    if (event.ctrlKey || event.shiftKey || event.altKey) {
        return; // Do nothing in shift states
    }
    let obj = event.target;
    if (obj.tagName == 'A' || hasClass(obj, 'note-input') || hasClass(obj, 'letter-input') || hasClass(obj, 'word-input')) {
        return; // Clicking on lines, notes, or inputs should not check anything
    }
    let parent = findParentOfClass(obj, 'cross-off');
    if (parent != null) {
        const newVal = !hasClass(parent, 'crossed-off');
        toggleClass(parent, 'crossed-off', newVal);
        saveCheckLocally(parent, newVal);
    }
}
function setupHighlights() {
    const highlight = document.getElementById('highlight-ability');
    if (highlight != null) {
        highlight.onmousedown = function () { toggleHighlight(); };
    }
    const containers = document.getElementsByClassName('highlight-container');
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const rules = getOptionalStyle(container, 'data-highlight-rules');
        if (rules) {
            const list = rules.split(' ');
            for (let r = 0; r < list.length; r++) {
                const rule = list[r];
                if (rule[0] == '.') {
                    const children = container.getElementsByClassName(rule.substring(1));
                    for (let i = 0; i < children.length; i++) {
                        toggleClass(children[i], 'can-highlight', true);
                    }
                }
                else if (rule[0] == '#') {
                    const child = document.getElementById(rule.substring(1));
                    toggleClass(child, 'can-highlight', true);
                }
                else {
                    const children = container.getElementsByTagName(rule.toLowerCase());
                    for (let i = 0; i < children.length; i++) {
                        toggleClass(children[i], 'can-highlight', true);
                    }
                }
            }
        }
    }
    const cans = document.getElementsByClassName('can-highlight');
    for (let i = 0; i < cans.length; i++) {
        const can = cans[i];
        can.onclick = function (e) { onClickHighlight(e); };
    }
    // Index will now include all children from above expansion rules
    indexAllHighlightableFields();
}
exports.setupHighlights = setupHighlights;
/**
 * If an element can be highlighted, toggle that highlight on or off
 * @param elmt The element to highlight
 */
function toggleHighlight(elmt) {
    if (elmt == undefined) {
        elmt = document.activeElement; // will be body if no inputs have focus
    }
    const highlight = findParentOfClass(elmt, 'can-highlight');
    if (highlight) {
        toggleClass(highlight, 'highlighted');
        saveHighlightLocally(highlight);
    }
}
exports.toggleHighlight = toggleHighlight;
/**
 * Clicking on highlightable elements can toggle their highlighting.
 * If they are not input elements, a simple click works.
 * If they are inputs, user must ctrl+click.
 * @param evt The mouse event from the click
 */
function onClickHighlight(evt) {
    const elem = document.elementFromPoint(evt.clientX, evt.clientY);
    if (elem) {
        if (elem.tagName != 'INPUT' || evt.ctrlKey) {
            toggleHighlight(elem);
        }
    }
}
/*-----------------------------------------------------------
 * _decoders.ts
 *-----------------------------------------------------------*/
/**
 * The decoder frame is either visible (true), hidden (false), or not present (null)
 * @returns true, false, or null
 */
function getDecoderState() {
    const frame = document.getElementById('decoder-frame');
    if (frame != null) {
        const style = window.getComputedStyle(frame);
        return style.display != 'none';
    }
    return null;
}
/**
 * Update the iframe tag to be the desired visibility state.
 * Also ensure that it points at the correct URL
 * @param state true to show, false to hide
 */
function setDecoderState(state) {
    const frame = document.getElementById('decoder-frame');
    if (frame != null) {
        let src = 'https://www.decrypt.fun/index.html';
        const mode = frame.getAttributeNS('', 'data-decoder-mode');
        if (mode != null) {
            src = 'https://www.decrypt.fun/' + mode + '.html';
        }
        frame.style.display = state ? 'block' : 'none';
        if (frame.src === '' || state) {
            frame.src = src;
        }
    }
}
/**
 * There is a Decoders link in the bottom corner of the page.
 * Set it up such that clicking rotates through the 3 visibility states.
 * @param margins the parent node of the toggle UI
 * @param mode the default decoder mode, if specified
 */
function setupDecoderToggle(margins, mode) {
    let iframe = document.getElementById('decoder-frame');
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = 'decoder-frame';
        iframe.style.display = 'none';
        if (mode !== undefined && mode !== true) {
            iframe.setAttributeNS(null, 'data-decoder-mode', mode);
        }
        document.getElementsByTagName('body')[0]?.appendChild(iframe);
    }
    let toggle = document.getElementById('decoder-toggle');
    if (toggle == null && margins != null) {
        toggle = document.createElement('span');
        toggle.id = 'decoder-toggle';
        margins.appendChild(toggle);
    }
    if (toggle) {
        const visible = getDecoderState();
        if (visible) {
            toggle.innerText = 'Hide Decoders';
        }
        else {
            toggle.innerText = 'Show Decoders';
        }
        toggle.addEventListener('click', toggleDecoder);
    }
}
exports.setupDecoderToggle = setupDecoderToggle;
/**
 * Alternate between showing and hiding the decoder iframe
 */
function toggleDecoder(evt) {
    var visible = getDecoderState();
    if (visible === null) {
        setupDecoderToggle(null);
    }
    setDecoderState(!visible);
}
exports.toggleDecoder = toggleDecoder;
/**
 * Explicitly show or hide the decoder iframe
 */
function showDecoder(show) {
    var visible = getDecoderState();
    if (visible === null) {
        setupDecoderToggle(null);
    }
    setDecoderState(show);
}
exports.showDecoder = showDecoder;
var localCache = {
    letters: {},
    words: {},
    notes: {},
    checks: {},
    containers: {},
    positions: {},
    stamps: {},
    highlights: {},
    controls: {},
    scratch: {},
    edges: [],
    guesses: [],
    // started: null, 
    // latest: null ,
    time: null,
};
////////////////////////////////////////////////////////////////////////
// User interface
//
/**
 * Set to false to disable saving (and restoring)
 */
let CacheChangesInLocalStorage = true;
let checkStorage = null;
/**
 * Saved state uses local storage, keyed off this page's URL
 * minus any parameters
 */
function storageKey() {
    return window.location.origin + window.location.pathname;
}
exports.storageKey = storageKey;
/**
 * If storage exists from a previous visit to this puzzle, offer to reload.
 */
function checkLocalStorage() {
    if (!CacheChangesInLocalStorage) {
        return;
    }
    // Each puzzle is cached within localStorage by its URL
    const key = storageKey();
    if (!isIFrame() && !isRestart() && key in localStorage) {
        const item = localStorage.getItem(key);
        if (item != null) {
            try {
                checkStorage = TryParseJson(item);
            }
            catch {
                checkStorage = {};
            }
            let empty = true; // It's possible to cache all blanks, which are uninteresting
            for (let key in checkStorage) {
                if (checkStorage[key] != null && checkStorage[key] != '') {
                    empty = false;
                    break;
                }
            }
            if (!empty) {
                const force = forceReload();
                if (force === undefined) {
                    createReloadUI(checkStorage.time);
                }
                else if (force) {
                    doLocalReload(false);
                }
                else {
                    cancelLocalReload(false);
                }
            }
        }
    }
}
exports.checkLocalStorage = checkLocalStorage;
/**
 * Strings we parse as JSON could come from anywhere.
 * JSON.parse will throw if the JSON is not well-formed.
 * Instead, return null.
 * @param str A string we expect to be JSON
 * @returns An object, or null
 */
function TryParseJson(str, errorIfNot = true) {
    try {
        var obj = JSON.parse(str);
        return obj;
    }
    catch (ex) {
        if (errorIfNot) {
            console.error(ex);
        }
        return null;
    }
}
exports.TryParseJson = TryParseJson;
/**
 * Globals for reload UI elements
 */
let reloadDialog;
let reloadButton;
let restartButton;
/**
 * Create a modal dialog, asking the user if they want to reload.
 * @param time The time the cached data was saved (as a string)
 *
 * If a page object can be found, compose a dialog:
 *   +-------------------------------------------+
 *   | Would you like to reload your progress on |
 *   | [title] from earlier? The last change was |
 *   | [## time-units ago].                      |
 *   |                                           |
 *   |       [Reload]     [Start over]           |
 *   +-------------------------------------------+
 * else use the generic javascript confirm prompt.
 */
function createReloadUI(time) {
    reloadDialog = document.createElement('div');
    reloadDialog.id = 'reloadLocalStorage';
    let img = null;
    if (getSafariDetails().icon) {
        img = document.createElement('img');
        img.classList.add('icon');
        img.src = getSafariDetails().icon;
    }
    const title = document.createElement('span');
    title.classList.add('title-font');
    title.innerText = document.title;
    const p1 = document.createElement('p');
    p1.appendChild(document.createTextNode('Would you like to reload auto-saved progress on '));
    p1.appendChild(title);
    p1.appendChild(document.createTextNode(' from earlier?'));
    const now = new Date();
    const dateTime = new Date(time);
    const delta = now.getTime() - dateTime.getTime();
    const seconds = Math.ceil(delta / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    let ago = 'The last change was ';
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
    reloadButton.onclick = function () { doLocalReload(true); };
    reloadButton.onkeydown = function (e) { onkeyReload(e); };
    restartButton = document.createElement('button');
    restartButton.innerText = 'Start over';
    restartButton.onclick = function () { cancelLocalReload(true); };
    restartButton.onkeydown = function (e) { onkeyReload(e); };
    var p3 = document.createElement('p');
    p3.appendChild(reloadButton);
    p3.appendChild(restartButton);
    if (img) {
        reloadDialog.appendChild(img);
    }
    reloadDialog.appendChild(p1);
    reloadDialog.appendChild(p2);
    reloadDialog.appendChild(p3);
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
        page.appendChild(reloadDialog);
        reloadButton.focus();
    }
}
/**
 * Handle keyboard accelerators while focus is on either reload button
 */
function onkeyReload(e) {
    if (e.code == 'Escape') {
        cancelLocalReload(true);
    }
    else if (e.code.search('Arrow') == 0) {
        if (e.target == reloadButton) {
            restartButton.focus();
        }
        else {
            reloadButton.focus();
        }
    }
}
/**
 * User has confirmed they want to reload
 * @param hide true if called from reloadDialog
 */
function doLocalReload(hide) {
    if (hide) {
        reloadDialog.style.display = 'none';
    }
    loadLocalStorage(checkStorage);
}
/**
 * User has confirmed they want to start over
 * @param hide true if called from reloadDialog
 */
function cancelLocalReload(hide) {
    if (hide) {
        reloadDialog.style.display = 'none';
    }
    // Clear cached storage
    checkStorage = null;
    localStorage.removeItem(storageKey());
}
//////////////////////////////////////////////////////////
// Utilities for managing multiple save-points
//
//////////////////////////////////////////////////////////
// Utilities for saving to local cache
//
/**
 * Overwrite the localStorage with the current cache structure
 */
function saveCache(pingEdit) {
    if (!reloading && CacheChangesInLocalStorage) {
        localCache.time = new Date();
        localStorage.setItem(storageKey(), JSON.stringify(localCache));
        if (pingEdit && !isEmptyCache()) {
            pingEventServer(EventSyncActivity.Edit);
        }
    }
}
function isEmptyCache() {
    if (Object.values(localCache.letters).find(x => x != '') != null) {
        return false;
    }
    if (Object.values(localCache.words).find(x => x != '') != null) {
        return false;
    }
    if (Object.values(localCache.positions).find(x => x != '') != null) {
        return false;
    }
    if (Object.keys(localCache.stamps).length > 0) {
        return false;
    }
    if (localCache.edges.length > 0) {
        return false;
    }
    if (Object.keys(localCache.scratch).length > 0) {
        return false;
    }
    if (Object.values(localCache.checks).find(x => x === true)) {
        return false;
    }
    return true;
}
/**
 * Update the saved letters object
 * @param element an letter-input element
 */
function saveLetterLocally(input) {
    if (input && input != currently_restoring) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.letters[index] = input.value;
            saveCache(true);
        }
    }
}
exports.saveLetterLocally = saveLetterLocally;
/**
 * Update the saved words object
 * @param element an word-input element
 */
function saveWordLocally(input) {
    if (input && input != currently_restoring) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.words[index] = input.value;
            saveCache(true);
        }
    }
}
exports.saveWordLocally = saveWordLocally;
/**
 * Update the saved notes object
 * @param element an note-input element
 */
function saveNoteLocally(input) {
    if (input) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.notes[index] = input.value;
            saveCache(true);
        }
    }
}
exports.saveNoteLocally = saveNoteLocally;
/**
 * Update the saved checkmark object
 * @param element an element which might contain a checkmark
 */
function saveCheckLocally(element, value) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            localCache.checks[index] = value;
            saveCache(true);
        }
    }
}
exports.saveCheckLocally = saveCheckLocally;
/**
 * Update the saved containers objects
 * @param element an element which can move between containers
 */
function saveContainerLocally(element, container) {
    if (element && container) {
        var elemIndex = getGlobalIndex(element);
        var destIndex = getGlobalIndex(container);
        if (elemIndex >= 0 && destIndex >= 0) {
            localCache.containers[elemIndex] = destIndex;
            saveCache(true);
        }
    }
}
exports.saveContainerLocally = saveContainerLocally;
/**
 * Update the saved positions object
 * @param element a moveable element which can free-move in its container
 */
function savePositionLocally(element) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            var pos = positionFromStyle(element);
            localCache.positions[index] = pos;
            saveCache(true);
        }
    }
}
exports.savePositionLocally = savePositionLocally;
/**
 * Update the saved drawings object
 * @param element an element which might contain a drawn object
 */
function saveStampingLocally(element) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            const parent = getStampParent(element);
            const stampId = parent.getAttributeNS('', 'data-stamp-id');
            if (stampId) {
                localCache.stamps[index] = stampId;
            }
            else {
                delete localCache.stamps[index];
            }
            saveCache(true);
        }
    }
}
exports.saveStampingLocally = saveStampingLocally;
/**
 * Update the saved highlights object
 * @param element a highlightable object
 */
function saveHighlightLocally(element) {
    if (element) {
        var index = getGlobalIndex(element, 'ch');
        if (index >= 0) {
            localCache.highlights[index] = hasClass(element, 'highlighted');
            saveCache(true);
        }
    }
}
exports.saveHighlightLocally = saveHighlightLocally;
/**
 * Update the local cache with this vertex list.
 * @param vertexList A list of vertex global indeces
 * @param add If true, this edge is added to the saved state. If false, it is removed.
 */
function saveStraightEdge(vertexList, add) {
    if (add) {
        localCache.edges.push(vertexList);
    }
    else {
        const i = localCache.edges.indexOf(vertexList);
        if (i >= 0) {
            localCache.edges.splice(i, 1);
        }
    }
    saveCache(true);
}
exports.saveStraightEdge = saveStraightEdge;
/**
 * Update the local cache with the full set of guesses for this puzzle
 * @param guesses An array of guesses, in time order
 */
function saveGuessHistory(guesses) {
    localCache.guesses = guesses;
    saveCache(false); // Doesn't count as an edit
}
exports.saveGuessHistory = saveGuessHistory;
/**
 * Update the local cache with the latest notes, and where they're placed.
 * NOTE: only call this once any active note has been flattened.
 * @param scratchPad The parent div of all notes
 */
function saveScratches(scratchPad) {
    const map = {};
    const rectSP = scratchPad.getBoundingClientRect();
    const divs = scratchPad.getElementsByClassName('scratch-div');
    for (let i = 0; i < divs.length; i++) {
        const div = divs[i];
        const rect = div.getBoundingClientRect();
        const pos = [
            Math.ceil(rect.left - rectSP.left),
            Math.ceil(rect.top - rectSP.top),
            rect.width,
            rect.height
        ].join(',');
        const text = textFromScratchDiv(div);
        map[pos] = text;
    }
    localCache.scratch = map;
    saveCache(true);
}
exports.saveScratches = saveScratches;
/**
 * Save one attribute from any element that is tagged with the class 'save-state'
 * The attribute to save is named in the optional attribute 'data-save-state'.
 * If omitted, the default is the value of an form field.
 */
function saveStates() {
    const map = {};
    const savers = document.getElementsByClassName('save-state');
    for (let i = 0; i < savers.length; i++) {
        const elmt = savers[i];
        const id = elmt.id;
        if (id) {
            const attr = getOptionalStyle(elmt, 'data-save-state');
            let val = '';
            if (!attr && isTag(elmt, ['input', 'select', 'textarea', 'button'])) {
                // Since form-field values are not normal attributes, don't specify them in data-save-state
                const val = elmt.value;
                if (val) {
                    map[id] = val;
                }
                // if (isTag(elmt, 'input')) {
                //     val = (elmt as HTMLInputElement).value
                // }
                // else if (isTag(elmt, 'select')) {
                //     val = (elmt as HTMLSelectElement).value
                // }
                // else if (isTag(elmt, 'textarea')) {
                //     val = (elmt as HTMLTextAreaElement).value
                // }
                // else if (isTag(elmt, 'button')) {
                //     val = (elmt as HTMLButtonElement).value
                // }
            }
            else if (attr == 'class') {
                const classes = [];
                elmt.classList.forEach((s, n) => classes.push(s));
                if (classes.length > 0) {
                    map[id] = classes.join(' ');
                }
            }
            else if (attr) {
                const val = elmt.getAttributeNS('', attr);
                if (val) {
                    map[id] = val;
                }
            }
        }
    }
    if (Object.keys(map).length > 0) {
        localCache.controls = map;
        saveCache(true);
    }
}
exports.saveStates = saveStates;
////////////////////////////////////////////////////////////////////////
// Utilities for applying global indeces for saving and loading
//
/**
 * Assign indeces to all of the elements in a group
 * @param elements A list of elements
 * @param suffix A variant name of the index (optional)
 * @param offset A number to shift all indeces (optional) - used when two collections share an index space
 */
function applyGlobalIndeces(elements, suffix, offset) {
    let attr = 'data-globalIndex';
    if (suffix != undefined) {
        attr += '-' + suffix;
    }
    if (!offset) {
        offset = 0;
    }
    for (let i = 0; i < elements.length; i++) {
        elements[i].setAttributeNS('', attr, String(i));
    }
}
/**
 * At page initialization, every element that can be cached gets an index attached to it.
 * Possibly more than one, if it can cache multiple traits.
 * Now retrieve that index.
 * @param elmt The element with the index
 * @param suffix The name of the index (optional)
 * @returns The index, or -1 if invalid
 */
function getGlobalIndex(elmt, suffix) {
    if (elmt) {
        let attr = 'data-globalIndex';
        if (suffix != undefined) {
            attr += '-' + suffix;
        }
        const index = elmt.getAttributeNS('', attr);
        if (index) { // not null or empty
            return Number(index);
        }
    }
    return -1;
}
exports.getGlobalIndex = getGlobalIndex;
/**
 * At page initialization, every element that can be cached gets an index attached to it.
 * Possibly more than one, if it can cache multiple traits.
 * Find the element with the desired global index.
 * @param cls A class, to narrow down the set of possible elements
 * @param index The index
 * @param suffix The name of the index (optional)
 * @returns The element
 */
function findGlobalIndex(cls, index, suffix) {
    const elements = document.getElementsByClassName(cls);
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i];
        if (index == getGlobalIndex(elmt, suffix)) {
            return elmt;
        }
    }
    return null;
}
exports.findGlobalIndex = findGlobalIndex;
/**
 * Create a dictionary, mapping global indeces to the corresponding elements
 * @param cls the class tag on all applicable elements
 * @param suffix the optional suffix of the global indeces
 */
function mapGlobalIndeces(cls, suffix) {
    const map = {};
    const elements = document.getElementsByClassName(cls);
    for (let i = 0; i < elements.length; i++) {
        const index = getGlobalIndex(elements[i], suffix);
        if (index >= 0) {
            map[index] = elements[String(i)];
        }
    }
    return map;
}
exports.mapGlobalIndeces = mapGlobalIndeces;
/**
 * Assign globalIndeces to every letter- or word- input field
 */
function indexAllInputFields() {
    let inputs = document.getElementsByClassName('letter-input');
    applyGlobalIndeces(inputs);
    inputs = document.getElementsByClassName('word-input');
    applyGlobalIndeces(inputs);
}
exports.indexAllInputFields = indexAllInputFields;
/**
 * Assign globalIndeces to every note field
 */
function indexAllNoteFields() {
    const inputs = document.getElementsByClassName('note-input');
    applyGlobalIndeces(inputs);
}
exports.indexAllNoteFields = indexAllNoteFields;
/**
 * Assign globalIndeces to every check mark
 */
function indexAllCheckFields() {
    const checks = document.getElementsByClassName('cross-off');
    applyGlobalIndeces(checks);
}
exports.indexAllCheckFields = indexAllCheckFields;
/**
 * Assign globalIndeces to every moveable element and drop target
 */
function indexAllDragDropFields() {
    let inputs = document.getElementsByClassName('moveable');
    applyGlobalIndeces(inputs);
    inputs = document.getElementsByClassName('drop-target');
    applyGlobalIndeces(inputs);
}
exports.indexAllDragDropFields = indexAllDragDropFields;
/**
 * Assign globalIndeces to every stampable element
 */
function indexAllDrawableFields() {
    const inputs = document.getElementsByClassName('stampable');
    applyGlobalIndeces(inputs);
}
exports.indexAllDrawableFields = indexAllDrawableFields;
/**
 * Assign globalIndeces to every highlightable element
 */
function indexAllHighlightableFields() {
    const inputs = document.getElementsByClassName('can-highlight');
    applyGlobalIndeces(inputs, 'ch');
}
exports.indexAllHighlightableFields = indexAllHighlightableFields;
/**
 * Assign globalIndeces to every vertex
 */
function indexAllVertices() {
    const inputs = document.getElementsByClassName('vertex');
    applyGlobalIndeces(inputs, 'vx');
}
exports.indexAllVertices = indexAllVertices;
////////////////////////////////////////////////////////////////////////
// Load from local storage
//
/**
 * Avoid re-entrancy. Track if we're mid-reload
 */
let reloading = false;
/**
 * Load all structure types from storage
 */
function loadLocalStorage(storage) {
    reloading = true;
    restoreLetters(storage.letters);
    restoreWords(storage.words);
    restoreNotes(storage.notes);
    restoreCrossOffs(storage.checks);
    restoreContainers(storage.containers);
    restorePositions(storage.positions);
    restoreStamps(storage.stamps);
    restoreHighlights(storage.highlights);
    restoreEdges(storage.edges);
    restoreGuesses(storage.guesses);
    restoreScratches(storage.scratch);
    restoreStates(storage.controls);
    reloading = false;
    const fn = theBoiler().onRestore;
    if (fn) {
        fn();
    }
}
let currently_restoring = null;
/**
 * Restore any saved letter input values
 * @param values A dictionary of index=>string
 */
function restoreLetters(values) {
    localCache.letters = values;
    var inputs = document.getElementsByClassName('letter-input');
    for (let i = 0; i < inputs.length; i++) {
        currently_restoring = inputs[i];
        var input = inputs[i];
        var value = values[i];
        if (value != undefined) {
            input.value = value;
            afterInputUpdate(input, values[i]);
        }
    }
    currently_restoring = null;
}
/**
 * Restore any saved word input values
 * @param values A dictionary of index=>string
 */
function restoreWords(values) {
    localCache.words = values;
    var inputs = document.getElementsByClassName('word-input');
    for (let i = 0; i < inputs.length; i++) {
        currently_restoring = inputs[i];
        var input = inputs[i];
        var value = values[i];
        if (value != undefined) {
            input.value = value;
            if (value.length > 0) {
                afterInputUpdate(input, value.substring(value.length - 1));
            }
            var extractId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
            if (extractId != null) {
                updateWordExtraction(extractId);
            }
        }
    }
    currently_restoring = null;
    if (inputs.length > 0) {
        updateWordExtraction(null);
    }
}
/**
 * Restore any saved note input values
 * @param values A dictionary of index=>string
 */
function restoreNotes(values) {
    localCache.notes = values;
    var elements = document.getElementsByClassName('note-input');
    for (let i = 0; i < elements.length; i++) {
        var element = elements[i];
        var globalIndex = getGlobalIndex(element);
        var value = values[globalIndex];
        if (value != undefined) {
            element.value = value;
        }
    }
}
/**
 * Restore any saved note input values
 * @param values A dictionary of index=>boolean
 */
function restoreCrossOffs(values) {
    localCache.checks = values;
    let elements = document.getElementsByClassName('cross-off');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const globalIndex = getGlobalIndex(element);
        const value = values[globalIndex];
        if (value != undefined) {
            toggleClass(element, 'crossed-off', value);
        }
    }
}
/**
 * Restore any saved moveable objects to drop targets
 * @param containers A dictionary of moveable-index=>target-index
 */
function restoreContainers(containers) {
    localCache.containers = containers;
    var movers = document.getElementsByClassName('moveable');
    var targets = document.getElementsByClassName('drop-target');
    // Each time an element is moved, the containers structure changes out from under us. So pre-fetch.
    const moving = [];
    for (let key in containers) {
        moving[parseInt(key)] = parseInt(containers[key]);
    }
    for (let key in moving) {
        const mover = findGlobalIndex('moveable', parseInt(key));
        const target = findGlobalIndex('drop-target', moving[key]);
        if (mover && target) {
            quickMove(mover, target);
        }
    }
}
/**
 * Restore any saved moveable objects to free-positions within their targets
 * @param positions A dictionary of index=>Position
 */
function restorePositions(positions) {
    localCache.positions = positions;
    var movers = document.getElementsByClassName('moveable');
    for (let i = 0; i < movers.length; i++) {
        var pos = positions[i];
        if (pos != undefined) {
            quickFreeMove(movers[i], pos);
        }
    }
}
/**
 * Restore any saved note input values
 * @param values A dictionary of index=>string
 */
function restoreStamps(drawings) {
    localCache.stamps = drawings;
    var targets = document.getElementsByClassName('stampable');
    for (let i = 0; i < targets.length; i++) {
        var tool = drawings[i];
        if (tool != undefined) {
            const stamp = document.getElementById(tool);
            if (stamp) {
                doStamp(undefined, targets[i], stamp);
            }
        }
    }
}
/**
 * Restore any saved highlight toggle
 * @param highlights A dictionary of index=>boolean
 */
function restoreHighlights(highlights) {
    localCache.highlights = highlights == undefined ? {} : highlights;
    var elements = document.getElementsByClassName('can-highlight');
    for (let i = 0; i < elements.length; i++) {
        var element = elements[i];
        var globalIndex = getGlobalIndex(element, 'ch');
        var value = highlights[globalIndex];
        if (value != undefined) {
            toggleClass(element, 'highlighted', value);
        }
    }
}
/**
 * Recreate any saved straight-edges and word-selections
 * @param vertexLists A list of strings, where each string is a comma-separated-list of vertices
 */
function restoreEdges(vertexLists) {
    if (!vertexLists) {
        vertexLists = [];
    }
    localCache.edges = vertexLists;
    for (let i = 0; i < vertexLists.length; i++) {
        createFromVertexList(vertexLists[i]);
    }
}
/**
 * Recreate any saved guesses and their responses
 * @param guesses A list of guess structures
 */
function restoreGuesses(guesses) {
    if (!guesses) {
        guesses = [];
    }
    for (let i = 0; i < guesses.length; i++) {
        const src = guesses[i];
        // Rebuild the GuessLog, to convert the string back to a DateTime
        const gl = { field: src.field, guess: src.guess, time: new Date(String(src.time)) };
        decodeAndValidate(gl);
        // Decoding will rebuild the localCache
    }
}
/**
 * Update the local cache with the latest notes, and where they're placed.
 * NOTE: only call this once any active note has been flattened.
 */
function restoreScratches(scratch) {
    localCache.scratch = scratch;
    scratchClear();
    const points = Object.keys(scratch);
    for (let i = 0; i < points.length; i++) {
        const pos = points[i];
        const xywh = pos.split(',').map(n => parseInt(n));
        const text = scratch[pos];
        scratchCreate(xywh[0], xywh[1], xywh[2], xywh[3], text);
    }
}
/**
 * Restore any elements tagged as save-state.
 * They must each have a unique ID. One attribute may be saved for each.
 * @param controls
 */
function restoreStates(controls) {
    localCache.controls = controls;
    const savers = document.getElementsByClassName('save-state');
    for (let i = 0; i < savers.length; i++) {
        const elmt = savers[i];
        const id = elmt.id;
        if (id && controls[id] !== undefined) {
            const attr = getOptionalStyle(elmt, 'data-save-state');
            if (!attr && isTag(elmt, ['input', 'select', 'textarea', 'button'])) {
                elmt.value = controls[id];
            }
            else if (attr === 'class') {
                const oldClasses = getAllClasses(elmt).filter((v) => v !== 'save-state');
                clearAllClasses(elmt, oldClasses);
                const classes = controls[id].split(' ');
                for (let c = 0; c < classes.length; c++) {
                    toggleClass(elmt, classes[c], true);
                }
            }
            else if (attr) {
                elmt.setAttributeNS('', attr, controls[id]);
            }
            else {
                continue;
            }
            // If we've set anything, give the element a chance to reload
            const load = new Event("load");
            elmt.dispatchEvent(load);
        }
    }
}
////////////////////////////////////////////////////////////////////////
// Utils for working with the shared puzzle list
//
/**
 * A limited list of meaningful puzzle statuses
 */
exports.PuzzleStatus = {
    Hidden: 'hidden',
    Locked: 'locked',
    Unlocked: 'unlocked',
    Loaded: 'loaded',
    Solved: 'solved', // A puzzle which is fully solved
};
/**
 * Update the master list of puzzles for this event
 * @param puzzle The name of this puzzle (not the filename)
 * @param status One of the statuses in PuzzleStatus
 * @returns true if the new status is different than the old
 */
function updatePuzzleList(puzzle, status) {
    if (!puzzle) {
        puzzle = getCurFileName();
    }
    var key = getOtherFileHref('puzzle_list', 0);
    let pList = {};
    if (key in localStorage) {
        const item = localStorage.getItem(key);
        if (item) {
            pList = TryParseJson(item);
        }
    }
    if (!pList) {
        pList = {};
    }
    const prev = pList[puzzle];
    pList[puzzle] = status;
    localStorage.setItem(key, JSON.stringify(pList));
    return status !== prev;
}
exports.updatePuzzleList = updatePuzzleList;
/**
 * Lookup the status of a puzzle
 * @param puzzle The name of a puzzle
 * @param defaultStatus The initial status, before a player updates it
 * @returns The saved status
 */
function getPuzzleStatus(puzzle, defaultStatus) {
    if (!puzzle) {
        puzzle = getCurFileName();
    }
    var key = getOtherFileHref('puzzle_list', 0);
    let pList = {};
    if (key in localStorage) {
        const item = localStorage.getItem(key);
        if (item) {
            pList = TryParseJson(item);
            if (pList && puzzle in pList) {
                return pList[puzzle];
            }
        }
    }
    return defaultStatus;
}
exports.getPuzzleStatus = getPuzzleStatus;
/**
 * Return a list of puzzles we are tracking, which currently have the indicated status
 * @param status one of the valid status strings
 */
function listPuzzlesOfStatus(status) {
    const list = [];
    var key = getOtherFileHref('puzzle_list', 0);
    if (key in localStorage) {
        const item = localStorage.getItem(key);
        if (item) {
            const pList = TryParseJson(item);
            if (pList) {
                const names = Object.keys(pList);
                for (let i = 0; i < names.length; i++) {
                    const name = names[i];
                    if (pList[name] === status) {
                        list.push(name);
                    }
                }
            }
        }
    }
    return list;
}
exports.listPuzzlesOfStatus = listPuzzlesOfStatus;
/**
 * Clear the list of which puzzles have been saved, unlocked, etc.
 */
function resetAllPuzzleStatus() {
    var key = getOtherFileHref('puzzle_list', 0);
    localStorage.setItem(key, JSON.stringify(null));
}
exports.resetAllPuzzleStatus = resetAllPuzzleStatus;
/**
 * Clear any saved progress on this puzzle
 * @param puzzleFile a puzzle filename
 */
function resetPuzzleProgress(puzzleFile) {
    var key = getOtherFileHref(puzzleFile, 0);
    localStorage.setItem(key, JSON.stringify(null));
}
exports.resetPuzzleProgress = resetPuzzleProgress;
////////////////////////////////////////////////////////////////////////
// Utils for sharing data between puzzles
//
/**
 * Save when meta materials have been acquired.
 * @param puzzle The meta-puzzle name
 * @param up Steps up from current folder where meta puzzle is found
 * @param page The meta-clue label (i.e. part 1 or B)
 * @param obj Any meta object structure
 */
function saveMetaMaterials(puzzle, up, page, obj) {
    var key = getOtherFileHref(puzzle, up) + "-" + page;
    localStorage.setItem(key, JSON.stringify(obj));
}
/**
 * Load cached meta materials, if they have been acquired.
 * @param puzzle The meta-puzzle name
 * @param up Steps up from current folder where meta puzzle is found
 * @param page The meta-clue label (i.e. part 1 or B)
 * @returns An object - can be different for each meta type, or undefined if not unlocked
 */
function loadMetaMaterials(puzzle, up, page) {
    var key = getOtherFileHref(puzzle, up) + "-" + page;
    return loadMetaPiece(key);
}
exports.loadMetaMaterials = loadMetaMaterials;
/**
 * Load cached meta materials, if they have been acquired.
 * @param key The meta-piece name. Often a concatenation of the meta puzzle and a piece #
 * @returns An object - can be different for each meta type, or undefined if not unlocked
 */
function loadMetaPiece(key) {
    if (key in localStorage) {
        const item = localStorage.getItem(key);
        if (item) {
            return TryParseJson(item);
        }
    }
    return undefined;
}
exports.loadMetaPiece = loadMetaPiece;
/**
 * Get the last level of the URL's pathname
 */
function getCurFileName(no_extension = true) {
    const key = window.location.pathname;
    const bslash = key.lastIndexOf('\\');
    const fslash = key.lastIndexOf('/');
    const parts = key.split(fslash >= bslash ? '/' : '\\');
    let name = parts[parts.length - 1];
    if (no_extension) {
        const dot = name.split('.');
        if (dot.length > 1) {
            name = name.substring(0, name.length - 1 - dot[dot.length - 1].length);
        }
    }
    return name;
}
exports.getCurFileName = getCurFileName;
// Convert the absolute href of the current window to a relative href
// levels: 1=just this file, 2=parent folder + file, etc.
function getRelFileHref(levels) {
    const key = storageKey();
    const bslash = key.lastIndexOf('\\');
    const fslash = key.lastIndexOf('/');
    let delim = '/';
    if (fslash < 0 || bslash > fslash) {
        delim = '\\';
    }
    const parts = key.split(delim);
    parts.splice(0, parts.length - levels);
    return parts.join(delim);
}
/**
 * Convert the absolute href of the current window to an absolute href of another file
 * @param file name of another file
 * @param up the number of steps up. 0=same folder. 1=parent folder, etc.
 * @param rel if set, only return the last N terms of the relative path
 * @returns a path to the other file
 */
function getOtherFileHref(file, up, rel) {
    const key = storageKey();
    const bslash = key.lastIndexOf('\\');
    const fslash = key.lastIndexOf('/');
    let delim = '/';
    if (fslash < 0 || bslash > fslash) {
        delim = '\\';
    }
    // We'll replace the current filename and potentially some parent folders
    if (!up) {
        up = 1;
    }
    else {
        up += 1;
    }
    var parts = key.split(delim);
    parts.splice(parts.length - up, up, file);
    if (rel) {
        parts.splice(0, parts.length - rel);
    }
    return parts.join(delim);
}
////////////////////////////////////////////////////////////////////////
// Utils for forgetting
//
/**
 * Utility for backdoor event reset pages
 * @param path A prefix to search for across all stored keys.
 * Because the storage pattern we use is to key off filenames,
 * specifying a folder will clear one event without clearing a second.
 */
function forgetChildrenOf(path) {
    if (!path) {
        const count = localStorage.length;
        localStorage.clear();
        return count;
    }
    let count = 0;
    const keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(path) == 0) {
            localStorage.removeItem(keys[i]);
            count++;
        }
    }
    return count;
}
exports.forgetChildrenOf = forgetChildrenOf;
////////////////////////////////////////////////////////////////////////
// Utils for login
//
/**
 * Read any cached login-info. Logins are per-event
 * @param event The current event
 * @returns A login info, or null if not logged in
 */
function getLogin(event) {
    if (!event) {
        return null;
    }
    const key = getOtherFileHref('login-' + event, 0);
    const val = localStorage.getItem(key);
    if (val) {
        const login = TryParseJson(val);
        if (login && login.player) { // Ensure valid
            return login;
        }
    }
    return null;
}
exports.getLogin = getLogin;
/**
 * Save the login (or logged-out) info
 * @param event The current event
 * @param data What to save. Null means logged out.
 */
function cacheLogin(event, data) {
    if (event) {
        const key = getOtherFileHref('login-' + event, 0);
        if (data) {
            localStorage.setItem(key, JSON.stringify(data));
        }
        else {
            localStorage.removeItem(key);
        }
    }
}
exports.cacheLogin = cacheLogin;
/*-----------------------------------------------------------
 * _textInput.ts
 *-----------------------------------------------------------*/
/**
 * Any event stemming from key in this list should be ignored
 */
const ignoreKeys = [
    'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'OptionLeft', 'OptionRight', 'CapsLock', 'Backspace', 'Escape', 'Delete', 'Insert', 'NumLock', 'ScrollLock', 'Pause', 'PrintScreen',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16',
];
/**
 * The names of the back and forward arrow keys.
 * If RTL, swap these
 */
var ArrowPrior = 'ArrowLeft';
var ArrowNext = 'ArrowRight';
/**
 * The change in horizontal index that happens after a right arrow
 * If RTL, this should be -1
 */
var plusX = 1;
/**
 * todo: DOCUMENT THIS
 */
var priorInputValue = '';
/**
 * The input
 */
let keyDownTarget = null;
/**
 * The name of the currently highlighted input group
 */
let inputGroupElement = null;
let currentInputGroup = null;
/**
 * Workaround for keydown/up on mobile
 */
let keyDownUnidentified = true;
function onInputEvent(event) {
    console.log(event);
}
exports.onInputEvent = onInputEvent;
/**
 * Callback when a user pressed a keyboard key from any letter-input or word-input text field
 * @param event - A keyboard event
 */
function onLetterKeyDown(event) {
    keyDownUnidentified = event.which == 229;
    var input = event.currentTarget;
    keyDownTarget = input;
    priorInputValue = input.value;
    var code = event.code;
    if (code == undefined || code == '') {
        code = event.key; // Mobile doesn't use code
    }
    var inpClass = hasClass(input, 'word-input') ? 'word-input' : 'letter-input';
    let skipClass;
    if (!findParentOfClass(input, 'navigate-literals')) {
        skipClass = hasClass(input, 'word-input') ? 'word-non-input' : 'letter-non-input';
    }
    let prior = null;
    if (hasClass(input.parentNode, 'multiple-letter') || hasClass(input, 'word-input')) {
        // Multi-character fields still want the ability to arrow between cells.
        // We need to look at the selection prior to the arrow's effect, 
        // to see if we're already at the edge.
        if ((code == 'Enter' || code == 'NumpadEnter') && getOptionalStyle(input, 'data-show-ready')) {
            // Don't move to next field
        }
        else if (code == ArrowNext || code == 'Enter') {
            var s = input.selectionStart;
            var e = input.selectionEnd;
            if (s == e && e == input.value.length) {
                const next = findNextGroupInput(input, true, true, inpClass)
                    || findNextInput(input, plusX, 0, inpClass, skipClass);
                if (next != null) {
                    moveFocus(next, 0);
                }
                event.preventDefault();
            }
        }
        else if (code == ArrowPrior) {
            var s = input.selectionStart;
            var e = input.selectionEnd;
            if (s == e && e == 0) {
                const prior = findNextGroupInput(input, false, true, inpClass)
                    || findNextInput(input, -plusX, 0, inpClass, skipClass);
                if (prior != null) {
                    moveFocus(prior, prior.value.length);
                }
                event.preventDefault();
            }
        }
    }
    else {
        if (code == 'Backspace' || code == 'Space') {
            spaceOverNextInput(input, code);
            event.preventDefault();
            return;
        }
        if (event.key.length == 1) {
            if (event.key == '`') {
                toggleHighlight(input);
            }
            else if (matchInputRules(input, event)) {
                input.value = event.key;
                afterInputUpdate(input, event.key);
                event.preventDefault();
                return;
            }
        }
        // Single-character fields always go to the next field
        if (processArrowKeys(input, event)) {
            return;
        }
    }
    if (processArrowKeys(input, event, true)) {
        return;
    }
    // if (code == 'CapsLock') {
    //     // CapsLock toggles directions
    //     setCurrentInputGroup(input);
    //     return;
    // }
    if (findParentOfClass(input, 'digit-only')) {
        if (event.key.length == 1 && !event.ctrlKey && !event.altKey
            && (event.key >= 'A' && event.key < 'Z' || event.key > 'a' && event.key < 'z')) {
            // Completely disallow (English) alpha characters. Punctuation still ok.
            event.preventDefault();
        }
    }
}
exports.onLetterKeyDown = onLetterKeyDown;
/**
 * Callback when a user pressed a keyboard key from any letter-input or word-input text field
 * @param event - A keyboard event
 */
function onButtonKeyDown(event) {
    var current = event.currentTarget;
    if (processArrowKeys(current, event)) {
        keyDownTarget = current;
    }
}
exports.onButtonKeyDown = onButtonKeyDown;
const arrowKeyCodes = [
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End', 'PageUp', 'PageDown'
];
/**
 * Is this key an arrow key?
 * @param code A key code
 * @returns True, if any of the usual arrow keys
 */
function isArrowKey(code) {
    return arrowKeyCodes.indexOf(code) >= 0;
}
/**
 * Standard handlers for arrow keys and similar: home/end, page-up/down,
 * including ctrl+ variants.
 * @param start Element that currently has the keyboard focused
 * @param event The key event that *might* be an arrow key
 * @param verticalOnly If set, only up/down keys are considered, else left/right keys are too (default).
 * @returns true if the arrow key was processed, and the focus moved.
 * False if any other key.
 */
function processArrowKeys(start, event, verticalOnly = false) {
    var code = event.code;
    if (code == undefined || code == '') {
        code = event.key; // Mobile doesn't use code
    }
    if (arrowFromInputGroup(start, code)) {
        event.preventDefault(); // Don't cause cursor movement within the cell
        return true;
    }
    var inpClass = 'word-input letter-input';
    let skipClass;
    if (!findParentOfClass(start, 'navigate-literals')) {
        skipClass = 'word-non-input letter-non-input';
    }
    // Consider vertical movement keys
    if (code == 'ArrowUp' || code == 'PageUp') {
        moveFocus(findNextInput(start, 0, -1, inpClass, skipClass));
        event.preventDefault();
        return true;
    }
    else if (code == 'ArrowDown' || code == 'PageDown') {
        moveFocus(findNextInput(start, 0, 1, inpClass, skipClass));
        event.preventDefault();
        return true;
    }
    else if (verticalOnly) {
        return false;
    }
    // If !verticalOnly, consider horizontal movement keys
    else if (code == ArrowNext) {
        const next = event.ctrlKey ? findNextWordGroup2d(start, plusX)
            : findNextInput(start, plusX, 0, inpClass, skipClass);
        moveFocus(next);
        event.preventDefault();
        return true;
    }
    else if (code == ArrowPrior) {
        const prior = event.ctrlKey ? findNextWordGroup2d(start, -plusX)
            : findNextInput(start, -plusX, 0, inpClass, skipClass);
        moveFocus(prior);
        event.preventDefault();
        return true;
    }
    else if (code == 'Home') {
        moveFocus(findRowEndInput(start, -plusX, event.ctrlKey));
        return true;
    }
    else if (code == 'End') {
        moveFocus(findRowEndInput(start, plusX, event.ctrlKey));
        return true;
    }
    return false;
}
/**
 * Does a typed character match the input rules?
 * @param input
 * @param evt
 * @returns
 */
function matchInputRules(input, evt) {
    if (input.readOnly) {
        return false;
    }
    if (evt.key.length != 1 || evt.ctrlKey || evt.altKey) {
        return false;
    }
    return (input.inputMode === 'numeric')
        ? evt.key.match(/[0-9]/) : evt.key.match(/[a-z0-9]/i);
}
/**
 * Callback when a user releases a keyboard key from any letter-input or word-input text field
 * @param event - A keyboard event
 */
function onLetterKeyUp(event) {
    if (event.isComposing) {
        return; // Don't interfere with IMEs
    }
    var post = onLetterKey(event);
    if (post) {
        var input = event.currentTarget;
        inputChangeCallback(input, event.key);
    }
}
exports.onLetterKeyUp = onLetterKeyUp;
const mapInputEventTypes = {
    'deleteContentBackward': 'Backspace',
    'deleteContentForward': 'Delete',
    'insertParagraph': 'Enter'
};
/**
 * Convert an event from onInput to an equivalent key event.
 * Note: only happens when contents actually change, so no arrow keys,
 * nor backspace in empty cell :(
 * @param event event from OnImput
 * @returns Stub Keyboard event with a few key fields
 */
function fakeKeyboardEvent(event) {
    const fake = {
        code: '',
        shiftKey: false,
        ctrlKey: false,
        altKey: false,
        key: event.data,
        target: event.target,
        currentTarget: event.currentTarget,
    };
    if (event.inputType in mapInputEventTypes) {
        fake.code = mapInputEventTypes[event.inputType];
    }
    return fake;
}
/**
 * oninput callback, which is the only usable one we get on Android.
 * It should ALWAYS follow the key-down event
 * @param event - An input event, where .data holds the key
 */
function onLetterInput(event) {
    // REVIEW: ignoring isComposing, since it is often true
    if (keyDownUnidentified) {
        const fake = fakeKeyboardEvent(event);
        onLetterKeyDown(fake);
        var post = onLetterKey(fake);
        if (post) {
            var input = event.currentTarget;
            inputChangeCallback(input, event.data || '');
        }
    }
}
exports.onLetterInput = onLetterInput;
/**
 * Process the end of a keystroke
 * @param evt - A keyboard event
 * @return true if some post-processing is still needed
 */
function onLetterKey(evt) {
    if (!evt) {
        return false;
    }
    if (isDebug()) {
        alert('code:' + evt.code + ', key:' + evt.key);
    }
    var input = evt.currentTarget;
    if (input != keyDownTarget) {
        keyDownTarget = null;
        // key-down likely caused a navigation
        if (evt.code == 'Tab' && document.activeElement == input && isArrowKeyElement(document.activeElement)) {
            // Ensure we got the focus change
            setCurrentInputGroup(document.activeElement);
        }
        return true;
    }
    keyDownTarget = null;
    var code = evt.code;
    if (code == undefined || code == '') {
        code = evt.key; // Mobile doesn't use code
    }
    if (code == 'Enter') {
        code = evt.shiftKey ? 'ArrowUp' : 'ArrowDown';
    }
    if (code == 'Tab') { // includes shift-Tab
        // Do nothing. User is just passing through
        // TODO: Add special-case exception to wrap around from end back to start
        return true;
    }
    // if (code == 'CapsLock') {
    //     // Do nothing. User hasn't typed
    //     return true;
    // }
    if (isArrowKey(code)) {
        // Do nothing. Navigation happened on key down.
        return true;
    }
    else if (code == 'Backquote') {
        return true; // Highlight already handled in key down
    }
    if (input.value.length == 0 || ignoreKeys.indexOf(code) >= 0) {
        var multiLetter = hasClass(input.parentNode, 'multiple-letter');
        // Don't move focus if nothing was typed
        if (!multiLetter) {
            afterInputUpdate(input, evt.key);
            return false; // we just did the post-processing
        }
    }
    else if (input.value.length === 1 && !input.value.match(/[a-z0-9]/i)) {
        // Spaces and punctuation might be intentional, but if they follow a matching literal, they probably aren't.
        // NOTE: this tends to fail when the punctuation is stylized like smart quotes or minus instead of dash.
        var prior = findNextOfClass(input, 'letter-input', undefined, -1);
        if (prior != null && hasClass(prior, 'letter-non-input') && findNextOfClass(prior, 'letter-input') == input) {
            if (prior.getAttribute('data-literal') == input.value) {
                input.value = ''; // abort this space
                return true;
            }
        }
    }
    afterInputUpdate(input, evt.key);
    return false;
}
exports.onLetterKey = onLetterKey;
/**
 * Re-scan for extractions
 * @param input The input which just changed
 * @param key The key from the event that led here
 */
function afterInputUpdate(input, key) {
    var text = input.value;
    if (hasClass(input.parentNode, 'lower-case')) {
        text = text.toLocaleLowerCase();
    }
    else if (!hasClass(input.parentNode, 'any-case')) {
        text = text.toUpperCase();
    }
    var overflow = '';
    var nextInput = findParentOfClass(input, 'vertical')
        ? findNextInput(input, 0, 1, 'letter-input', 'letter-non-input')
        : (findNextGroupInput(input, true, true, 'letter-input', 'letter-non-input')
            || findNextInput(input, plusX, 0, 'letter-input', 'letter-non-input'));
    var multiLetter = hasClass(input.parentNode, 'multiple-letter');
    var word = multiLetter || hasClass(input.parentNode, 'word-cell') || hasClass(input, 'word-input');
    if (!word && text.length > 1) {
        const glyphs = splitEmoji(text);
        text = glyphs.splice(0, 1)[0];
        overflow = glyphs.join('');
    }
    input.value = text;
    ExtractFromInput(input);
    CheckValidationReady(input, key);
    if (!multiLetter) {
        if (isTextInputElement(nextInput) && overflow.length > 0 && nextInput.value.length == 0) {
            // Insert our overflow into the next cell
            nextInput.value = overflow;
            moveFocus(nextInput);
            // Then do the same post-processing as this cell
            afterInputUpdate(nextInput, key);
        }
        else if (isArrowKeyElement(nextInput) && text.length > 0) {
            // Just move the focus
            moveFocus(nextInput);
        }
    }
    else if (!hasClass(input.parentNode, 'getElementsByClassName')) {
        // What is our capacity before compressing?
        var rc = input.getBoundingClientRect();
        var ratio = input.inputMode == "numeric" ? 2 : 1.8;
        var cap = Math.floor(rc.width * ratio / rc.height);
        // Once we've exceeded our capacity, comress more for each character
        var spacing = (text.length <= cap) ? 0 : ((text.length - cap) * 0.05);
        input.style.letterSpacing = -spacing + 'em';
    }
    if (word) {
        saveWordLocally(input);
    }
    else {
        saveLetterLocally(input);
    }
    if (isTag(input, 'input')) {
        inputChangeCallback(input, key);
    }
}
exports.afterInputUpdate = afterInputUpdate;
/**
 * If this input is hooked up to a validation button, see if it's now ready.
 * @param input The input that just changed.
 * @param key The most recent key that was typed
 */
function CheckValidationReady(input, key) {
    const showReady = getOptionalStyle(input.parentElement, 'data-show-ready');
    if (showReady) {
        const btn = document.getElementById(showReady);
        if (btn) {
            validateInputReady(btn, key);
        }
    }
}
/**
 * Extract contents of an extract-flagged input
 * @param input an input field
 */
function ExtractFromInput(input) {
    var extractedId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
    if (findParentOfClass(input, 'extract')) {
        UpdateExtraction(extractedId);
    }
    else if (findParentOfClass(input, 'extractor')) { // can also be numbered
        UpdateExtractionSource(input);
    }
    else if (findParentOfClass(input, 'numbered')) {
        UpdateNumbered(extractedId);
    }
    else {
        const btnId = getOptionalStyle(input, 'data-show-ready');
        if (btnId) {
            // This is not a named extract field, but it still has a button
            const btn = document.getElementById(btnId);
            if (btn) {
                validateInputReady(btn, input.value);
            }
        }
    }
    if (findParentOfClass(input, 'copy-extractee')) {
        updateCopyExtractions();
    }
}
/**
 * Ensure that two extraction sources are pointing at the same target.
 * Either or both could leave that undefined, in which case it is id=='extracted'.
 * @param extractedId The extractedId we're trying to match.
 * @param input Another input
 * @return true if they are effectively the same
 */
function sameExtractedTarget(extractedId, input) {
    const id2 = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
    return (extractedId || 'extracted') === (id2 || 'extracted');
}
/**
 * Update an extraction destination
 * @param extractedId The id of an element that collects extractions
 */
function UpdateExtraction(extractedId) {
    const extracted = document.getElementById(extractedId || 'extracted');
    if (extracted == null) {
        return;
    }
    const join = getOptionalStyle(extracted, 'data-extract-join') || '';
    if (extracted.getAttribute('data-extraction-source') != 'data'
        && (extracted.getAttribute('data-number-pattern') != null || extracted.getAttribute('data-letter-pattern') != null)) {
        UpdateNumbered(extractedId);
        return;
    }
    const inputs = document.getElementsByClassName('extract-input');
    const sorted_inputs = SortElements(inputs);
    const parts = [];
    let hiddens = false;
    let ready = true;
    for (let i = 0; i < sorted_inputs.length; i++) {
        const input = sorted_inputs[i];
        if (!sameExtractedTarget(extractedId, input)) {
            continue;
        }
        if (hasClass(input, 'extract-literal') || hasClass(input, 'letter-non-input')) {
            parts.push(HiddenExtract(input, false));
            hiddens = true;
        }
        else {
            const inp = input;
            let letter = inp.value || '';
            letter = letter.trim();
            ready = ready && letter.length > 0;
            parts.push(letter || '_');
        }
    }
    if (hiddens) {
        let p = 0;
        for (let i = 0; i < sorted_inputs.length; i++) {
            const input = sorted_inputs[i];
            if (!sameExtractedTarget(extractedId, input)) {
                continue;
            }
            if (hasClass(input, 'extract-literal')) {
                parts[p] = HiddenExtract(input, ready, parts);
            }
            p++;
        }
    }
    let extraction = parts.join(join);
    ApplyExtraction(extraction, extracted, ready);
}
/**
 * Cause a value to be extracted directly from data- attributes, rather than from inputs.
 * @param elmt Any element - probably not an input
 * @param value Any text, or null to revert
 * @param extractedId The id of an element that collects extractions
 */
function ExtractViaData(elmt, value, extractedId) {
    if (value == null) {
        elmt.removeAttribute('data-extract-value');
        toggleClass(elmt, 'extract-input', false);
        toggleClass(elmt, 'extract-literal', false);
    }
    else {
        elmt.setAttribute('data-extract-value', value);
        toggleClass(elmt, 'extract-literal', true);
        toggleClass(elmt, 'extract-input', true);
    }
    UpdateExtraction(extractedId);
}
/**
 * Hidden literal extracts often have rules for when they are applied.
 * @param span The (hidden) span that contains the literal value and possible rules
 * @param ready Whether the non-hidden inputs are now complete
 * @param extraction Either undefined, if still building, or a list of all extracted elements, of which this is one part.
 * @returns A letter to extract right now
 */
function HiddenExtract(span, ready, extraction) {
    // Several ways to extract literals.
    // Old-style used data-* optional styles.
    // New style uses simpler names, only on current span.
    const de = span.hasAttributeNS('', 'delay') !== null // placeholder value to extract, until player has finished other work
        ? span.getAttributeNS('', 'delay') // empty is ok
        : getOptionalStyle(span, 'data-extract-delay');
    const ev = span.getAttributeNS('', 'value') // eventual extraction (unless a copy)
        || getOptionalStyle(span, 'data-extract-value');
    const ec = getOptionalStyle(span, 'data-extract-copy'); // this extraction is a copy of another
    const dl = getOptionalStyle(span, 'data-literal'); // this is a literal which is also an extraction
    if (!ready && de != null) {
        return de;
    }
    else if (ec) {
        // On the first pass, extraction may be undefined, so return ''. Later, copy another cell.
        return extraction ? extraction[parseInt(ec) - 1] : '';
    }
    else {
        return ev || dl || '';
    }
}
/**
 * Check whether a collection of extracted text is more than blanks and underlines
 * @param text Generated extraction, which may still contain underlines for missing parts
 * @returns true if text contains anything other than spaces and underlines
 */
function ExtractionIsInteresting(text) {
    if (text == undefined) {
        return false;
    }
    return text.length > 0 && text.match(/[^_\u00A0\u0020]/) != null;
}
/**
 * Update an extraction area with new text
 * @param text The current extraction
 * @param dest The container for the extraction. Can be a div or an input
 * @param ready True if all contributing inputs have contributed
 */
function ApplyExtraction(text, dest, ready) {
    if (hasClass(dest, 'create-from-pattern')) {
        ApplyExtractionToPattern(text, dest, ready);
        return;
    }
    if (hasClass(dest, 'lower-case')) {
        text = text.toLocaleLowerCase();
    }
    else if (hasClass(dest, 'all-caps')) {
        text = text.toLocaleUpperCase();
    }
    const destInp = isTag(dest, 'INPUT') ? dest : null;
    const destText = isTag(dest, 'TEXT') ? dest : null;
    const destFwd = hasClass(dest, 'extract-literal') ? dest : null;
    var current = (destInp !== null) ? destInp.value : (destText !== null) ? destText.innerHTML : dest.innerText;
    if (!ExtractionIsInteresting(text) && !ExtractionIsInteresting(current)) {
        return;
    }
    if (!ExtractionIsInteresting(text) && ExtractionIsInteresting(current)) {
        text = '';
    }
    if (destFwd) {
        destFwd.setAttributeNS('', 'value', text);
    }
    else if (destInp) {
        destInp.value = text;
    }
    else if (destText) {
        destText.innerHTML = '';
        destText.appendChild(document.createTextNode(text));
    }
    else if (!hasClass(dest, 'create-from-pattern')) {
        dest.innerText = text;
    }
    updateExtractionData(dest, text, ready);
    if (isTag(dest, 'input')) {
        // It's possible that the destination is itself an extract source
        ExtractFromInput(dest);
    }
    else if (destFwd) {
        // Or a hidden extract source
        var extractedId = getOptionalStyle(destFwd, 'data-extracted-id', undefined, 'extracted-');
        UpdateExtraction(extractedId);
    }
}
/**
 * Update an pattern-generated extraction area with new text
 * @param text The current extraction
 * @param extracted The container for the extraction.
 * @param ready True if all contributing inputs have contributed
 */
function ApplyExtractionToPattern(text, extracted, ready) {
    const inps = extracted.getElementsByClassName('extractor-input');
    if (inps.length > text.length) {
        text += Array(1 + inps.length - text.length).join('_');
    }
    for (let i = 0; i < inps.length; i++) {
        const inp = inps[i];
        if (text[i] != '_') {
            inp.value = text.substring(i, i + 1);
        }
        else {
            inp.value = '';
            ready = false;
        }
        // Save the extracted letter, just like the original, because typing into them directly would do that
        saveLetterLocally(inp);
    }
    updateExtractionData(extracted, text, ready);
}
/**
 * Update an extraction that uses numbered indicators
 * @param extractedId The id of an extraction area
 */
function UpdateNumbered(extractedId) {
    const div = document.getElementById(extractedId || 'extracted');
    var outputs = div?.getElementsByTagName('input');
    var inputs = document.getElementsByClassName('extract-input');
    const sorted_inputs = SortElements(inputs);
    let concat = '';
    for (let i = 0; i < sorted_inputs.length; i++) {
        const input = sorted_inputs[i];
        const inp = input;
        const index = input.getAttribute('data-number');
        let output = document.getElementById('extractor-' + index);
        if (!output && outputs) {
            output = outputs[i];
        }
        let letter = inp.value || '';
        letter = letter.trim();
        if (letter.length > 0 || output.value.length > 0) {
            output.value = letter;
        }
        concat += letter;
    }
    if (div) {
        updateExtractionData(div, concat, concat.length == inputs.length);
    }
}
/**
 *
 * @param input
 * @returns
 */
function UpdateExtractionSource(input) {
    var extractedId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
    var extractors = document.getElementsByClassName('extractor-input');
    var index = getOptionalStyle(input.parentNode, 'data-number');
    if (index === null) {
        for (let i = 0; i < extractors.length; i++) {
            if (extractors[i] == input) {
                index = "" + (i + 1); // start at 1
                break;
            }
        }
    }
    if (index === null) {
        return;
    }
    var sources = document.getElementsByClassName('extract-input');
    let extractId;
    const extraction = [];
    for (let i = 0; i < sources.length; i++) {
        var src = sources[i];
        if (!sameExtractedTarget(extractedId, src)) {
            continue;
        }
        var dataNumber = getOptionalStyle(src, 'data-number');
        if (dataNumber != null) {
            if (dataNumber == index) {
                src.value = input.value;
                saveLetterLocally(src);
                extractId = getOptionalStyle(src, 'data-extracted-id', undefined, 'extracted-');
            }
            extraction[parseInt(dataNumber)] = src.value;
        }
    }
    // Update data-extraction when the user type directly into an extraction element
    const extractionText = extraction.join('');
    updateExtractionData(extractId, extractionText, extractionText.length == sources.length);
}
/**
 * An extraction field has been updated.
 * See if there are further side-effects.
 * @param extracted The extracted field, or the ID of one.
 * @param value The value that has been extracted.
 * @param ready True if all contributors appear to be used (i.e. no blanks)
 */
function updateExtractionData(extracted, value, ready) {
    const container = !extracted
        ? document.getElementById('extracted')
        : (typeof extracted === "string")
            ? document.getElementById(extracted)
            : extracted;
    if (container) {
        container.setAttribute('data-extraction', value);
        const btnId = getOptionalStyle(container, 'data-show-ready');
        if (btnId) {
            const btn = document.getElementById(btnId);
            validateInputReady(btn, value);
        }
        if (btnId && isTrace()) {
            console.log('Extraction is ' + (ready ? 'ready:' : 'NOT ready:') + value);
        }
    }
}
/**
 * oninput callback, which is the only usable one we get on Android.
 * It should ALWAYS follow the key-down event
 * @param event - An input event, where .data holds the key
 */
function onWordInput(event) {
    // REVIEW: ignoring isComposing, since it is often true
    if (keyDownUnidentified) {
        onWordKey(fakeKeyboardEvent(event));
    }
}
exports.onWordInput = onWordInput;
/**
 * User has typed in a word-entry field
 * @param event A Keyboard event
 */
function onWordKey(event) {
    if (event.isComposing) {
        return; // Don't interfere with IMEs
    }
    const input = event.currentTarget;
    inputChangeCallback(input, event.key);
    if (getOptionalStyle(input, 'data-extract-index') != null) {
        var extractId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
        updateWordExtraction(extractId);
    }
    if (findParentOfClass(input, 'copy-extractee')) {
        updateCopyExtractions();
    }
    CheckValidationReady(input, event.key);
    var code = event.code;
    if ((code == 'Enter' || code == 'NumpadEnter') && getOptionalStyle(input, 'data-show-ready')) {
        // do nothing
    }
    else if (code == 'PageUp') {
        moveFocus(findNextOfClass(input, 'word-input', undefined, -1));
        return;
    }
    else if (code == 'Enter' || code == 'NumpadEnter' || code == 'PageDown') {
        moveFocus(findNextOfClass(input, 'word-input'));
        return;
    }
    saveWordLocally(input);
}
exports.onWordKey = onWordKey;
/**
 * Update extractions that come from word input
 * @param extractedId The ID of an extraction area
 */
function updateWordExtraction(extractedId) {
    var extracted = document.getElementById(extractedId || 'extracted');
    if (extracted == null) {
        return;
    }
    let inputs = document.getElementsByClassName('word-input');
    const sorted_inputs = SortElements(inputs);
    const parts = [];
    let hasWordExtraction = false;
    let partial = false;
    let ready = true;
    let hiddens = false;
    for (let i = 0; i < sorted_inputs.length; i++) {
        const input = sorted_inputs[i];
        if (!sameExtractedTarget(extractedId, input)) {
            continue;
        }
        if (hasClass(input, 'extract-literal') || hasClass(input, 'word-literal')) {
            parts.push(HiddenExtract(input, false));
            hiddens = true;
            continue;
        }
        var index = getOptionalStyle(input, 'data-extract-index', '');
        if (index === null) {
            continue;
        }
        hasWordExtraction = true;
        const indeces = index.split(' ');
        let letters = '';
        for (let j = 0; j < indeces.length; j++) {
            const inp = input;
            let letter = inp.value;
            if (indeces[j] !== '*') {
                const i2 = indeces[j].split('.').map((s) => parseInt(s, 10));
                letter = extractWordIndex(inp.value, i2[0], i2.length > 1 ? i2[1] : 0, '_', '');
            }
            if (letter) {
                letters += letter.toUpperCase();
                ;
                partial = partial || (letter != '_');
                ready = ready && (letter != '_');
            }
        }
        parts.push(letters);
    }
    if (hiddens) {
        let p = 0;
        for (let i = 0; i < sorted_inputs.length; i++) {
            const input = sorted_inputs[i];
            if (!sameExtractedTarget(extractedId, input)) {
                continue;
            }
            if (hasClass(input, 'extract-literal')) {
                parts[p] = HiddenExtract(input, ready, parts);
            }
            p++;
        }
    }
    let extraction = parts.join('');
    if (hasWordExtraction) {
        ApplyExtraction(extraction, extracted, ready);
    }
}
exports.updateWordExtraction = updateWordExtraction;
/**
 * Extract a single letter from an input.
 * Can have a simple or two-part index.
 * Simple: an absolute index, starting at 1, ignoring whitespace
 * Two-part: word# and letter#, both starting at 1
 * @param input User's input string
 * @param index The primary index (starting at 1)
 * @param subIndex The secondary index (starting at 1), or 0 to only use the primary index
 * @param ifBlank What to return from blank inputs
 * @param ifOver What to return if the index is out of bounds
 * @returns The extracted letter, or else the blank or over fallbacks
 */
function extractWordIndex(input, index, subIndex, ifBlank, ifOver) {
    if (!input.trim()) {
        return ifBlank;
    }
    else {
        input = input.toUpperCase();
    }
    let letter_index = index;
    if (subIndex > 0) {
        letter_index = subIndex;
        // Reduce input to just the desired word
        const words = input.split(' ');
        input = '';
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (words[i].length > 0) {
                if (--index == 0) {
                    input = word;
                    break;
                }
            }
        }
    }
    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch.trim()) {
            if (--letter_index == 0) {
                return ch;
            }
        }
    }
    // Index not reached
    return ifOver;
}
exports.extractWordIndex = extractWordIndex;
/**
 * Find all elements tagged as copy-extracters.
 * Read their copy-id rules, and fetch the data.
 * Extracting from an empty input, or an invalid index within an input, will yield a blank.
 * Extracters can have multiple source extractees, in which case missing partial data will generate spaces.
 *
 * Unlike push-extracters, which work in both directions, these copy-extracters only work in one direction.
 * Changing the destination will not be reflected back into the source,
 * since the primary intended use is indexes into longer entries.
 */
function updateCopyExtractions() {
    const extracters = document.getElementsByClassName('copy-extracter');
    for (let i = 0; i < extracters.length; i++) {
        let extracter = extracters[i];
        const ifBlank = getOptionalStyle(extracter, 'data-copy-blank', '') || '';
        let buf = '';
        let spaces = '';
        const copyIds = (getOptionalStyle(extracter, 'data-copy-id', '') || '').split(' ');
        for (let s = 0; s < copyIds.length; s++) {
            const copyId = copyIds[s].split('.');
            if (copyId[0]) {
                let extractee = document.getElementById(copyId[0]);
                let value = getValueFromTextContainer(extractee, '');
                if (copyId.length == 2) {
                    value = extractWordIndex(value, parseInt(copyId[1]), 0, '', '');
                }
                else if (copyId.length > 2) {
                    value = extractWordIndex(value, parseInt(copyId[1]), parseInt(copyId[2]), ifBlank, ifBlank);
                }
                if (!value) {
                    spaces += ' ';
                }
                else {
                    buf += spaces + value;
                    spaces = '';
                }
            }
        }
        if (!isTextInputElement(extracter)) {
            let extracters = extracter?.getElementsByTagName('input');
            if (!extracters || extracters.length == 0) {
                throw new Error(`Element with copy-id=${copyIds} must be an input element, or a letter-/word-cell parent of one`);
            }
            else if (extracters.length > 1) {
                throw new Error(`Element with copy-id=${copyIds} appears to be a container of multiple input elements`);
            }
            extracter = extracters[0];
            if (!isTextInputElement(extracter)) {
                throw new Error(`Element with copy-id=${copyIds} must be an input element, or a letter-/word-cell parent of one`);
            }
        }
        extracter.value = buf.trim();
    }
}
/**
 * Callback when user has changed the text in a letter-input
 * @param event A keyboard event
 */
function onLetterChange(event) {
    if (event.isComposing) {
        return; // Don't interfere with IMEs
    }
    const input = findParentOfClass(event.currentTarget, 'letter-input');
    saveLetterLocally(input);
    inputChangeCallback(input, event.key);
}
exports.onLetterChange = onLetterChange;
/**
 * Callback when user has changed the text in a word-input
 * @param event A keyboard event
 */
function onWordChange(event) {
    if (event.isComposing) {
        return; // Don't interfere with IMEs
    }
    const input = findParentOfClass(event.currentTarget, 'word-input');
    inputChangeCallback(input, event.key);
    saveWordLocally(input);
}
exports.onWordChange = onWordChange;
/**
 * Anytime any note changes, inform any custom callback
 * @param inp The affected input
 * @param key The key from the event that led here
 */
function inputChangeCallback(inp, key) {
    const fn = theBoiler().onInputChange;
    if (fn) {
        fn(inp);
    }
    const doc = getOptionalStyle(inp, 'data-onchange');
    if (doc) {
        const func = window[doc];
        if (func) {
            func(inp, key);
        }
    }
}
/**
 * Standardize on letter-grid-2d navigation rules.
 * If defined, then the grid may have a narrowed scope.
 * If undefined, the entire page should follow these rules.
 * @param start
 * @returns
 */
function GetArrowKeyRoot(start) {
    const root2d = findParentOfClass(start, 'letter-grid-2d');
    // TODO: someday, support a non-2d style when I have a real example
    return root2d ?? document.getElementById('pageBody');
}
/**
 * Find the input that the user likely means when navigating from start in a given x,y direction
 * @param start - The current input
 * @param dx - A horizontal direction to look
 * @param dy - A vertical direction to look
 * @param cls - a class to look for
 * @param clsSkip - a class to skip
 * @returns
 */
function findNextInput(start, dx, dy, cls, clsSkip) {
    const root2d = GetArrowKeyRoot(start);
    const loop = findParentOfClass(start, 'loop-navigation');
    let find = null;
    if (root2d != null) {
        // Ignore the class constraint for 2d and discover
        find = findNext2dInput(root2d, start, dx, dy, undefined, clsSkip);
        if (find != null) {
            return find;
        }
    }
    const discoverRoot = findParentOfClass(start, 'letter-grid-discover');
    if (discoverRoot != null) {
        find = findNextDiscover(discoverRoot, start, dx, dy, undefined, clsSkip);
        if (find != null) {
            return find;
        }
        find = findNextByPosition(discoverRoot, start, dx, dy, undefined, clsSkip);
        if (find != null) {
            return find;
        }
    }
    if (dy < 0) {
        find = findInNextContainer(start, cls, clsSkip, 'letter-cell-block', -1);
        if (find != null) {
            return find;
        }
    }
    if (dy > 0) {
        find = findInNextContainer(start, cls, clsSkip, 'letter-cell-block');
        if (find != null) {
            return find;
        }
    }
    const back = dx == -plusX || dy < 0;
    let next = findNextOfClassGroup(start, cls, clsSkip, 'text-input-group', back ? -1 : 1);
    while (next != null && next.disabled) {
        next = findNextOfClassGroup(next, cls, clsSkip, 'text-input-group', back ? -1 : 1);
    }
    if (loop != null && findParentOfClass(next, 'loop-navigation') != loop) {
        find = findFirstChildOfClass(loop, cls, clsSkip, back ? -1 : 1);
        if (find) {
            return find;
        }
    }
    return next;
}
/**
 * Helper for home/end movement
 * @param start The current input
 * @param dx Home=-1, End=1
 * @param global true for ctrl+home/end, going to begining or end of whole range
 * @returns An element on this row
 */
function findRowEndInput(start, dx, global) {
    if (!global && currentInputGroup) {
        // Go to start or end of group
        let row = getInputGroupMembers(currentInputGroup);
        if ((plusX * dxFromGroup(currentInputGroup) < 0) || (dyFromGroup(currentInputGroup) < 0)) {
            // Group goes backward
            dx = -dx;
        }
        return (dx > 0 ? row[row.length - 1] : row[0]);
    }
    const root2d = GetArrowKeyRoot(start);
    if (root2d) {
        let row;
        if (global) {
            row = findRowOfInputs(root2d, undefined, -dx, undefined, 'letter-non-input');
        }
        else {
            row = findRowOfInputs(root2d, start, 0, undefined, 'letter-non-input');
        }
        return (dx > 0 ? row[row.length - 1] : row[0]);
    }
    return findEndInContainer(start, 'letter-input', 'letter-non-input', 'letter-cell-block', -dx);
}
/**
 * Space and Backspace are both ways to clear input fields.
 * Space clears forwards. Backspace clears backwards.
 * Both will first clear the current cell. If already empty, then move.
 * Edge cases:
 *  - In multi-letter cells, backspace removes just one letter until empty. Then moves.
 *  - Space within a pattern that contains spaces at that point are ignored.
 * @param input The input where the user typed
 * @param code Either 'Space' or 'Backspace'
 * @returns True if position moved. False if treated as a no-op.
 */
function spaceOverNextInput(input, code) {
    let prior = null;
    if (code == 'Space') {
        // Make sure user isn't just typing a space between words
        prior = findNextOfClass(input, 'letter-input', undefined, -1);
        if (prior != null && hasClass(prior, 'letter-non-input') && findNextOfClass(prior, 'letter-input') == input) {
            var lit = prior.getAttribute('data-literal');
            if (lit == ' ' || lit == '¶') { // match any space-like things  (lit == '¤'?)
                prior = findNextOfClass(prior, 'letter-input', 'literal', -1);
                if (prior != null && prior.value != '') {
                    // This looks much more like a simple space between words
                    return false;
                }
            }
        }
    }
    if (input != null && currentInputGroup) {
        // Space and backspace at the end of a group no longer need to obey the group.
        let row = getInputGroupMembers(currentInputGroup);
        let index = row.indexOf(input);
        if (index >= 0) {
            if (code == 'Backspace') {
                // Clear current if not empty, else move back and clear that
                if (input.value.length == 0 && index > 0) {
                    input = row[index - 1];
                    moveFocus(input);
                }
            }
            else {
                // Clear current if not empty, else move forward and clear that
                if (input.value.length == 0 && index < row.length - 1) {
                    input = row[index + 1];
                    moveFocus(input);
                }
            }
            if (input.value.length > 0) {
                // Clear current if not empty
                input.value = '';
                afterInputUpdate(input, code);
            }
            return true;
        }
        return false;
    }
    // Delete only deletes the current cell
    // Space deletes and moves forward
    prior = null;
    var dxDel = code == 'Backspace' ? -plusX : plusX;
    var dyDel = code == 'Backspace' ? -1 : 1;
    if (priorInputValue.length == 0) {
        var discoverRoot = findParentOfClass(input, 'letter-grid-discover');
        if (discoverRoot != null) {
            prior = findParentOfClass(input, 'vertical')
                ? findNextByPosition(discoverRoot, input, 0, dyDel, 'letter-input', 'letter-non-input')
                : findNextByPosition(discoverRoot, input, dxDel, 0, 'letter-input', 'letter-non-input');
        }
        else {
            prior = findNextOfClassGroup(input, 'letter-input', 'letter-non-input', 'text-input-group', dxDel);
            if (!prior) {
                const loop = findParentOfClass(input, 'loop-navigation');
                if (loop) {
                    prior = findFirstChildOfClass(loop, 'letter-input', 'letter-non-input', dxDel);
                }
            }
        }
        ExtractFromInput(input);
        if (prior !== null) {
            moveFocus(prior);
            input = prior; // fall through
        }
    }
    if (input != null && input.value.length > 0) {
        if (!hasClass(input.parentNode, 'multiple-letter')) {
            // Backspace should clear most cells
            input.value = '';
        }
        else if (prior != null) {
            // If backspacing across cells, into a multiple-letter cell, just remove the last character
            // REVIEW: should this behavior also apply when starting in multi-letter cells?
            if (dyDel < 0) {
                input.value = input.value.substring(0, input.value.length - 1);
            }
            else {
                input.value = input.value.substring(1);
            }
        }
    }
    afterInputUpdate(input, code);
    return true;
}
/**
 * Achieve ctrl+left/right functionality, attempting to jump past any inputs left in the current group.
 *
 * @param start
 * @param dx
 */
function findNextWordGroup2d(start, dx) {
    const root2d = GetArrowKeyRoot(start);
    const row = findRowOfInputs(root2d || undefined, start, 0, undefined, 'letter-non-input');
    if (row.length == 1) {
        // If we're alone in the current row, the ctrl+arrow is the same as arrow
        return findNextInput(start, dx, 0, 'letter-input', 'letter-non-input');
    }
    // Measure the average distance between elements;
    let avgGap = 0;
    const rects = [row[0].getBoundingClientRect()];
    let iCur = 0;
    for (let i = 1; i < row.length; i++) {
        if (row[i] === start) {
            iCur = i;
        }
        const rc = row[i].getBoundingClientRect();
        avgGap += rc.left - rects[i - 1].right;
        rects.push(rc);
    }
    avgGap /= row.length - 1;
    avgGap *= 1.01; // Don't let tiny margins of error confuse us
    // Move forward/back past any consecutive cells whose gap <= the average
    if (dx > 0) {
        for (let i = iCur + 1; i < row.length; i++) {
            const gap = rects[i].left - rects[i - 1].right;
            if (gap > avgGap) {
                return row[i];
            }
        }
        // None found. Move to first item on the next line
        return findNextInput(row[row.length - 1], 1, 0, 'letter-input', 'letter-non-input');
    }
    else {
        for (let i = iCur - 1; i >= 0; i--) {
            const gap = rects[i + 1].left - rects[i].right;
            if (gap > avgGap) {
                return row[i];
            }
        }
        // None found. Move to first item on the next line
        return findNextInput(row[0], -1, 0, 'letter-input', 'letter-non-input');
    }
}
/**
 * Find the next element with a desired class, within a parent defined by its class.
 * @param start - The current element
 * @param cls - The class of siblings
 * @param clsSkip - (optional) Another class to avoid
 * @param clsGroup - The class of the containing ancestor
 * @param dir - 1 (default) to look forward, or -1 to look backward
 * @returns Another element, or null if none
 */
function findNextOfClassGroup(start, cls, clsSkip, clsGroup, dir = 1) {
    var group = findParentOfClass(start, clsGroup);
    var next = findNextOfClass(start, cls, clsSkip, dir);
    if (group != null && (next == null || findParentOfClass(next, clsGroup) != group)) {
        next = findFirstChildOfClass(group, cls, clsSkip, dir);
    }
    return next;
}
/**
 * Compare the two elements' vertical rectangles.
 * @param a One element
 * @param b Another element that is even with, above, or below.
 * @returns 0 if they appear to be on the same row;
 * -1 if cur is higher; 1 if cur is lower.
 */
function compareVertical(a, b) {
    const rcA = a.getBoundingClientRect();
    const rcB = b.getBoundingClientRect();
    if (rcA.top >= rcB.bottom) {
        return 1;
    }
    if (rcA.bottom <= rcB.top) {
        return -1;
    }
    return 0; // Some amount of vertical overlap
}
/**
 * Compare the two elements' horizontal rectangles.
 * @param cur One element
 * @param test Another element that is even with, left, or right.
 * @returns 0 if they appear to be on the same column;
 * -1 if cur is more left; 1 if cur is more right.
 * @remarks Don't let tiny overlaps confuse the math.
 * These are especially likely when slightly rotated.
 */
function compareHorizontal(a, b) {
    const rcA = scaleDOMRect(a.getBoundingClientRect(), 0.9);
    const rcB = scaleDOMRect(b.getBoundingClientRect(), 0.9);
    if (rcA.left >= rcB.right) {
        return 1;
    }
    if (rcA.right <= rcB.left) {
        return -1;
    }
    return 0; // Some amount of horizontal overlap
}
/**
 * Inflate or shrink a rectangle around its center.
 * @param rect The original rectangle
 * @param scale Size of the returned rect, relative to the original.
 * @returns the original rect if scale==1.
 * Or a smaller rect if scale<1. Or a larger rect if scale>1.
 */
function scaleDOMRect(rect, scale) {
    return new DOMRect((rect.x + rect.width / 2) - (rect.width * scale / 2), (rect.y + rect.height / 2) - (rect.height * scale / 2), rect.width * scale, rect.height * scale);
}
/**
 * Get all of the input-type fields that can hold text focus.
 * These include <input>, <textarea>, <select>
 * @param container The container to search. If unset, use the document.
 * @param cls A list of classes to filter for. If unset/blank, don't filter.
 * If multiple classes (separated by spaces), use OR logic (REVIEW).
 * @param clsSkip A list of classes to filter out.
 * If a list, presence of any will cause it to be skipped.
 */
function getAllFormFields(container, cls, clsSkip) {
    const all = [];
    const tags = ['input', 'textarea', 'select', 'button'];
    const classes = cls ? cls.split(' ') : undefined;
    const skips = clsSkip ? clsSkip.split(' ') : undefined;
    if (!container) {
        container = document;
    }
    for (let t = 0; t < tags.length; t++) {
        const list = container.getElementsByTagName(tags[t]);
        for (let i = 0; i < list.length; i++) {
            const elmt = list[i];
            let match = !classes;
            if (classes) {
                for (let c = 0; c < classes.length; c++) {
                    if (hasClass(elmt, classes[c])) {
                        match = true;
                        break; // any class is enough
                    }
                }
            }
            if (match && skips) {
                for (let c = 0; c < skips.length; c++) {
                    if (hasClass(elmt, skips[c])) {
                        match = false;
                        break; // any class is enough
                    }
                }
            }
            if (match) {
                all.push(elmt);
            }
        }
    }
    return all;
}
/**
 * Find a row's worth of elements. This assumes rigid row-wise layout.
 * @param container The container to stay within
 * @param current The current element, or undefined to find the first/last row
 * @param dy 0 to find the rest of the current row;
 * -1 to find the row prior to current; 1 to find the next row.
 * When current is omitted, dy<0 means find the last overall row; dy>0 means find the first.
 * @param cls The class of elements to consider
 * @param clsSkip A sub-class of elements to leave out
 * @returns A list of elements, all of whom are on one vertical row.
 * The list will be sorted.
 */
function findRowOfInputs(container, current, dy, cls, clsSkip) {
    const all = getAllFormFields(container, cls, clsSkip);
    let ref = dy == 0 ? current : undefined;
    if (!current && dy == 0) {
        throw new Error("Can't search for the current row, without a current reference");
    }
    let row = [];
    for (let i = 0; i < all.length; i++) {
        const elmt = all[i];
        let rel = dy;
        if (current) {
            rel = compareVertical(elmt, current);
            if (rel == 0 && dy == 0) {
                row.push(elmt);
            }
        }
        if (rel * dy > 0) {
            // Correct direction, relative to current
            if (!ref) {
                ref = elmt; // This is the first element we've found in the desired direction
                row = [elmt];
            }
            else {
                const rel2 = compareVertical(elmt, ref);
                if (rel2 == 0) {
                    row.push(elmt);
                }
                else if (rel2 * dy < 0) {
                    ref = elmt; // Found a better reference, nearer in the desired direction
                    row = [elmt];
                }
            }
        }
    }
    // Sort the row from left to right
    row.sort((a, b) => compareHorizontal(a, b));
    return row;
}
/**
 * Find the input that the user likely means when navigating through a well-formed 2d grid
 * @param root - The root ancestor of the entire grid
 * @param start - The current input
 * @param dx - A horizontal direction to look
 * @param dy - A vertical direction to look
 * @param cls - a class to look for
 * @param clsSkip - a class to skip
 * @returns Another input within the grid
 */
function findNext2dInput(root, start, dx, dy, cls, clsSkip) {
    // Find one row of elements
    let row = findRowOfInputs(root, start, dy, cls, clsSkip);
    if (row.length == 0) {
        if (dy == 0) {
            return start || null; // Very confusing
        }
        // Wrap around
        const col = findNext2dColumn(root, dy);
        row = findRowOfInputs(col, undefined, dy, cls, clsSkip);
    }
    if (!start || (dy != 0 && dx != 0)) {
        // When changing rows, we want the first or last
        if (dx >= 0) {
            return row[0];
        }
        return row[row.length - 1];
    }
    let last;
    for (let i = 0; i < row.length; i++) {
        const elmt = row[i];
        const relX = compareHorizontal(elmt, start);
        if ((dx == 0 && relX == 0) || (dx >= 0 && relX > 0)) {
            return elmt; // The first item that matches the qualification
        }
        else if (dx <= 0 && relX < 0) {
            last = elmt; // A candidate. Let's see if we find a closer one.
        }
    }
    if (!last && dy == 0) {
        // Wrap to next/previous line
        return findNext2dInput(root, start, dx, dx * plusX, cls, clsSkip);
    }
    return last || null;
}
/**
 * If there are multile root elements of class letter-grid-2d, then reaching
 * the end of one should find the next.
 * @param root The current letter-grid-2d
 * @param dir +1 for forward, -1 for prev, where direction is HTML order, not rectangles
 * @returns A root to restart from
 */
function findNext2dColumn(root, dir) {
    if (!hasClass(root, 'letter-grid-2d')) {
        return root; // We aren't in columns - this is the pageBody
    }
    const cols = document.getElementsByClassName('letter-grid-2d');
    if (cols) {
        for (let i = 0; i < cols.length; i++) {
            if (cols[i] == root) {
                let n = (i + cols.length + dir) % cols.length;
                return cols[n];
            }
        }
    }
    return document.getElementById('pageBody');
}
/**
 * Find the input that the user likely means when navigating through a jumbled 2d grid
 * @param root - The root ancestor of the entire grid
 * @param start - The current input
 * @param dx - A horizontal direction to look
 * @param dy - A vertical direction to look
 * @param cls - a class to look for
 * @param clsSkip - a class to skip
 * @returns Another input within the grid
 */
function findNextByPosition(root, start, dx, dy, cls, clsSkip) {
    let rect = start.getBoundingClientRect();
    let pos = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    const elements = getAllFormFields(document, cls);
    let distance = 0;
    let nearest = null;
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i];
        if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
            continue;
        }
        if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
            continue;
        }
        rect = elmt.getBoundingClientRect();
        if (dx != 0) {
            // Look for inputs in the same row
            if (pos.y >= rect.y && pos.y < rect.y + rect.height) {
                // Measure distance in the dx direction
                const d = (rect.x + rect.width / 2 - pos.x) / dx;
                // Keep the nearest
                if (d > 0 && (nearest == null || d < distance)) {
                    distance = d;
                    nearest = elmt;
                }
            }
        }
        else if (dy != 0) {
            // Look for inputs in the same column
            if (pos.x >= rect.x && pos.x < rect.x + rect.width) {
                // Measure distance in the dy direction
                const d = (rect.y + rect.height / 2 - pos.y) / dy;
                if (d > 0 && (nearest == null || d < distance)) {
                    // Keep the nearest
                    distance = d;
                    nearest = elmt;
                }
            }
        }
    }
    if (nearest != null) {
        return nearest;
    }
    // Try again, but look in the next row/column
    rect = start.getBoundingClientRect();
    pos = plusX > 0 ? { x: rect.x + (dy > 0 ? rect.width - 1 : 1), y: rect.y + (dx > 0 ? rect.height - 1 : 1) }
        : { x: rect.x + (dy < 0 ? rect.width - 1 : 1), y: rect.y + (dx < 0 ? rect.height - 1 : 1) };
    let distance2 = 0;
    let wrap = null;
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i];
        if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
            continue;
        }
        if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
            continue;
        }
        // Remember the first element (if dx/dy is positive), or else the last
        if (wrap == null || (dx < 0 || dy < 0)) {
            wrap = elmt;
        }
        rect = elmt.getBoundingClientRect();
        // d measures direction in continuing perpendicular direction
        // d2 measures relative position within original direction
        let d = 0, d2 = 0;
        if (dx != 0) {
            // Look for inputs in the next row, using dx as a dy
            d = (rect.y + rect.height / 2 - pos.y) / (dx * plusX);
            d2 = rect.x / dx;
        }
        else if (dy != 0) {
            // Look for inputs in the next row, using dx as a dy
            d = (rect.x + rect.width / 2 - pos.x) / (dy * plusX);
            d2 = rect.y / dy;
        }
        // Remember the earliest (d2) element in nearest next row (d)
        if (d > 0 && (nearest == null || d < distance || (d == distance && d2 < distance2))) {
            distance = d;
            distance2 = d2;
            nearest = elmt;
        }
    }
    return nearest != null ? nearest : wrap;
}
/**
 * Smallest rectangle that bounds both inputs
 */
function union(rect1, rect2) {
    const left = Math.min(rect1.left, rect2.left);
    const right = Math.max(rect1.right, rect2.right);
    const top = Math.min(rect1.top, rect2.top);
    const bottom = Math.max(rect1.bottom, rect2.bottom);
    return new DOMRect(left, top, right - left, bottom - top);
}
/**
 * Distort a distance by a sympathetic factor
 * @param delta An actual distance (either horizontal or vertical)
 * @param bias A desired direction of travel, within that axis
 * @returns Shrinks delta, when it aligns with bias, stretches when orthogonal, and -1 when in the wrong direction
 */
function bias(delta, bias) {
    if (bias != 0) {
        if (delta * bias > 0) {
            return Math.abs(delta * 0.8); // sympathetic bias shrinks distance
        }
        else {
            return -1; // anti-bias invalidates distance
        }
    }
    return Math.abs(delta) * 1.2; // orthogonal bias stretches distance
}
/**
 * Measure the distance from one point to another, given a biased travel direction
 * @param from the starting point
 * @param toward the destination point
 * @param bx the desired x movement
 * @param by the desired y movement
 * @returns a skewed distance, where some objects seem nearer and some farther.
 * A negative distance indicates an object in the wrong direction.
 */
function biasedDistance(from, toward, bx, by) {
    let dx = bias(toward.x - from.x, bx);
    let dy = bias(toward.y - from.y, by);
    if (dx < 0 || dy < 0) {
        return -1; // Invalid target
    }
    return Math.sqrt(dx * dx + dy * dy);
}
/**
 * When moving off the edge of a world, what is a position on the far side, where we might resume?
 * @param world the boundary rectangle of the world
 * @param pos the starting point
 * @param dx the movement of x travel
 * @param dy the movement of y travel
 * @returns A position aligned with pos, but on the side away from dx,dy
 */
function wrapAround(world, pos, dx, dy) {
    if (dx > 0) { // wrap around right to far left
        return new DOMPoint(world.left - dx, pos.y);
    }
    if (dx < 0) { // wrap around left to far right
        return new DOMPoint(world.right - dx, pos.y);
    }
    if (dy > 0) { // wrap around bottom to far top
        return new DOMPoint(pos.x, world.top - dy);
    }
    if (dy < 0) { // wrap around top to far bottom
        return new DOMPoint(pos.x, world.bottom - dy);
    }
    return pos;
}
/**
 * Find the input that the user likely means when navigating through a jumbled 2d grid
 * @param root - The root ancestor of the entire grid
 * @param start - The current input
 * @param dx - A horizontal direction to look
 * @param dy - A vertical direction to look
 * @param cls - a class to look for
 * @param clsSkip - a class to skip
 * @returns Another input within the grid
 */
function findNextDiscover(root, start, dx, dy, cls, clsSkip) {
    let rect = start.getBoundingClientRect();
    let bounds = rect;
    let pos = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const elements = getAllFormFields(document, cls);
    let distance = -1;
    let nearest = null;
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i];
        if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
            continue;
        }
        if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
            continue;
        }
        rect = elmt.getBoundingClientRect();
        bounds = union(bounds, rect);
        let center = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        let d2 = biasedDistance(pos, center, dx, dy);
        if (d2 > 0 && (nearest == null || d2 < distance)) {
            nearest = elmt;
            distance = d2;
        }
    }
    if (nearest == null) {
        // Wrap around
        pos = wrapAround(bounds, pos, dx, dy);
        for (let i = 0; i < elements.length; i++) {
            const elmt = elements[i];
            if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
                continue;
            }
            if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
                continue;
            }
            rect = elmt.getBoundingClientRect();
            let center = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
            let d2 = biasedDistance(pos, center, dx, dy);
            if (d2 > 0 && (nearest == null || d2 < distance)) {
                nearest = elmt;
                distance = d2;
            }
        }
    }
    return nearest;
}
/**
 * Autocomplete the contents of a multi-letter input from a restricted list of options.
 * Existing text must match the beginning of exactly one option (case-insensitive).
 * @param input a text <input> or <textarea>
 * @param list a list of potential values to complete to
 * @returns true if a single match was found, else false for 0 or multiple matches
 */
function autoCompleteWord(input, list) {
    var value = input.value.toLowerCase();
    var match = null;
    for (let i of list) {
        if (i.toLowerCase().indexOf(value) == 0) {
            if (match) {
                return false; // multiple matches
            }
            match = i;
        }
    }
    if (match) {
        var len = input.value.length;
        input.value = match;
        input.setSelectionRange(len, match.length); // Select the remainder of the word
        return true;
    }
    return false; // no matches
}
exports.autoCompleteWord = autoCompleteWord;
/**
 * What group, if any, is this element active in?
 * If more than one, continue with the current group if possible.
 * @param elmt An element
 * @returns The name of a group, or null
 */
function getCurrentInputGroup(elmt) {
    const inputGroups = getOptionalStyle(elmt, 'data-input-groups');
    if (!inputGroups) {
        return null;
    }
    const groups = inputGroups.split(' ');
    if (currentInputGroup) {
        if (groups.indexOf(currentInputGroup) >= 0) {
            return currentInputGroup;
        }
        let prevPrefix = currentInputGroup.split(':')[0];
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].split(':')[0] == prevPrefix) {
                return groups[i];
            }
        }
    }
    return groups[0];
}
/**
 * Set which element group the user is inputting into.
 * An element can be part of multiple groups. Usually, associated with differing directions.
 * If the same element is selected repeatedly, rotate among the associated groups.
 * @param elmt The element with the selection
 */
function setCurrentInputGroup(elmt) {
    let newGroup = null;
    if (inputGroupElement != elmt) {
        // Moving group focus to this element
        newGroup = getCurrentInputGroup(elmt);
    }
    else {
        // Repeat focus this element
        const inputGroups = getOptionalStyle(elmt, 'data-input-groups');
        if (inputGroups) {
            const groups = inputGroups.split(' ');
            let index = groups.indexOf(currentInputGroup || '');
            index = (index + 1) % groups.length;
            newGroup = groups[index];
        }
    }
    if (newGroup != currentInputGroup) {
        removeClassGlobally('input-group');
        if (newGroup) {
            const members = getInputGroupMembers(newGroup);
            for (let i = 0; i < members.length; i++) {
                toggleClass(members[i], 'input-group', true);
            }
        }
        currentInputGroup = newGroup;
    }
    inputGroupElement = newGroup ? elmt : null;
}
exports.setCurrentInputGroup = setCurrentInputGroup;
const oppositeDirectionPrefix = {
    'u': 'd',
    'd': 'u',
    'l': 'r',
    'r': 'l'
};
/**
 * When in an element group, arrow keys have additional meanings.
 * Arrow keys aligned with the group direction move within the group.
 * Arrow keys aligned with an alternate direction can indicate a different group.
 * In that case, switch groups, but do not move.
 * If the arrow does not match an alternate direction, simply move.
 * @param elmt The element with the selection
 * @param key The key that was pressed from within that element
 * @returns True if the arrow only switches group. False if it moves the selection.
 */
function arrowFromInputGroup(elmt, code) {
    if (!currentInputGroup) {
        return false;
    }
    let prevPrefix = currentInputGroup.split(':')[0];
    if (!prevPrefix) {
        return false; // Current group doesn't use directions
    }
    if (!code.startsWith('Arrow')) {
        return false;
    }
    let dirPrefix = code.substring(5, 6).toLowerCase();
    if (!(dirPrefix in oppositeDirectionPrefix)) {
        return false; // ?!
    }
    if (prevPrefix[0] == dirPrefix) {
        // Arrow is consistent with group direction
        return false; // Let normal movement do its thing
    }
    if (prevPrefix[0] == oppositeDirectionPrefix[dirPrefix]) {
        // Arrow is consistent with group direction
        return false; // Let normal movement do its thing
    }
    // Look for an alternate group
    const inputGroups = getOptionalStyle(elmt, 'data-input-groups') || '';
    const groups = inputGroups.split(' ');
    for (let i = 0; i < groups.length; i++) {
        const groupName = groups[i];
        let parts = groupName.split(':');
        if (parts.length > 1) {
            if (parts[0][0] == dirPrefix) {
                // TODO: switch groups, don't move
                removeClassGlobally('input-group');
                const members = getInputGroupMembers(groupName);
                for (let i = 0; i < members.length; i++) {
                    toggleClass(members[i], 'input-group', true);
                }
                currentInputGroup = groupName;
                return true;
            }
        }
    }
    return false;
}
exports.arrowFromInputGroup = arrowFromInputGroup;
/**
 * Get the part of an input group name that should be consistent for all members of the group.
 * @param group An input group name
 * @returns That string, or a substring.
 */
function comparableGroupName(group) {
    let parts = group.split(':');
    if (parts.length > 2) {
        // A group name can have a trailing index, which will differ
        group = `${parts[0]}:${parts[1]}`;
    }
    return group;
}
/**
 * Does a given element consider itself to be part of this named input group?
 * @param elmt An element to test, which may be in 0, 1, or more groups.
 * @param groupName An input group name to match, or if omitted, any group
 * @returns true if any of this elements groups matches the target group
 */
function hasInputGroup(elmt, groupName = undefined) {
    const inputGroups = getOptionalStyle(elmt, 'data-input-groups');
    if (inputGroups) {
        if (!groupName) {
            return true;
        }
        groupName = comparableGroupName(groupName);
        const groups = inputGroups.split(' ');
        for (let i = 0; i < groups.length; i++) {
            if (comparableGroupName(groups[i]) == groupName) {
                return true;
            }
        }
    }
    return false;
}
exports.hasInputGroup = hasInputGroup;
/**
 * Find all members of a given input group, anywhere on the page.
 * @param group The name of an input group
 * @param cls A class to constrain to, or undefined to search all ArrowKeyElements
 * @returns A list of elements.
 */
function getInputGroupMembers(group, cls = undefined, clsSkip = undefined) {
    const members = [];
    if (cls) {
        const elmts = document.getElementsByClassName(cls);
        for (let i = 0; i < elmts.length; i++) {
            if (!hasClass(elmts[i], clsSkip) && hasInputGroup(elmts[i], group)) {
                members.push(elmts[i]);
            }
        }
        return members;
    }
    const tagNames = ['input', 'textarea', 'select', 'button'];
    for (let t = 0; t < tagNames.length; t++) {
        const elmts = document.getElementsByTagName(tagNames[t]);
        for (let i = 0; i < elmts.length; i++) {
            if (hasInputGroup(elmts[i], group)) {
                members.push(elmts[i]);
            }
        }
    }
    return members;
}
/**
 * Given the name of an input group, what is the default horizontal movement?
 * @param groupName A string which may contain a direction prefix, i.e. 'x:name'
 * @returns The horizontal component indicated by that prefix.
 * Or if no prefix, the normal text direction of the puzzle.
 * @remarks Valid horizontal prefixes are r|l|h (right|left|horizontal), which can be
 * paired with d|u|v for diagonal.
 */
function dxFromGroup(groupName) {
    const parts = groupName.split(':');
    if (parts.length <= 1) {
        return plusX;
    }
    const pref = parts[0].toLowerCase();
    if (pref.indexOf('r') >= 0) {
        return 1;
    }
    if (pref.indexOf('l') >= 0) {
        return -1;
    }
    if (pref.indexOf('h') >= 0) {
        return plusX;
    }
    return 0;
}
/**
 * Given the name of an input group, what is the default vertical movement?
 * @param groupName A string which may contain a direction prefix, i.e. 'x:name'
 * @returns The vertical component indicated by that prefix.
 * Or if no prefix, the normal text direction of the puzzle (usually horizontal).
 * @remarks Valid vertical prefixes are d|u|v (down|up|vertical), which can be
 * paired with r|l|h for diagonal.
 */
function dyFromGroup(groupName) {
    const parts = groupName.split(':');
    if (parts.length <= 1) {
        return 0;
    }
    const pref = parts[0].toLowerCase();
    if (pref.indexOf('d') >= 0) {
        return 1;
    }
    if (pref.indexOf('u') >= 0) {
        return -1;
    }
    if (pref.indexOf('v') >= 0) {
        return plusX;
    }
    return 0;
}
/**
 * If starting element is in a group, find the next element forward or backward within the group.
 * @param start The current element
 * @param fwd Whether moving forward (by typing) or backwards (backspace)
 * @param wrap If set, and if no element in the desired direction wrap around to other end.
 * @param cls A subset of elements to filter within
 * @returns
 */
function findNextGroupInput(start, fwd, wrap, cls = undefined, clsSkip = undefined) {
    const groupName = getCurrentInputGroup(start);
    if (!groupName) {
        return null;
    }
    let dx = dxFromGroup(groupName);
    let dy = dyFromGroup(groupName);
    if (dx == 0 && dy == 0) {
        // TODO: 0/0 will mean indexed
        // Group names will have an index suffix (i.e. 'grp:1')
        // Forward means climb the index
        console.error(`Input group "${groupName}" has unrecognized direction prefix.`);
        return null;
    }
    if (!fwd) {
        dx = -dx;
        dy = -dy;
    }
    const elements = getInputGroupMembers(groupName, cls, clsSkip);
    let next = null;
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i];
        if (compareHorizontal(elmt, start) == dx && compareVertical(elmt, start) == dy) {
            if (!next || (compareHorizontal(elmt, next) == -dx && compareVertical(elmt, next) == -dy)) {
                next = elmt;
            }
        }
    }
    if (!next && wrap) {
        for (let i = 0; i < elements.length; i++) {
            const elmt = elements[i];
            if (!next || (compareHorizontal(elmt, next) == -dx && compareVertical(elmt, next) == -dy)) {
                next = elmt;
            }
        }
    }
    return next;
}
/**
 * Some functions want to flexibly pull values from various constructs:
 *   - input elements
 *   - containers of multiple input elements
 * Extract an appropriate value to submit
 * @param container The container of the text value.
 * @param eachBlank The value to concatenate for each blank inputs.
 * @returns The value, or concatenation of values.
 */
function getValueFromTextContainer(container, eachBlank) {
    // If the extraction has alredy been cached, use it
    // If container is an input, get its value
    if (isTag(container, 'input')) {
        return container.value;
    }
    if (isTag(container, 'textarea')) {
        return container.value;
    }
    // If we contain multiple inputs, concat them
    let inputs = container.getElementsByClassName('letter-input');
    if (inputs.length == 0) {
        inputs = container.getElementsByClassName('word-input');
    }
    if (inputs.length > 0) {
        let value = '';
        for (let i = 0; i < inputs.length; i++) {
            if (!hasClass(inputs[i], 'letter-non-input')) {
                const ch = inputs[i].value;
                value += ch || eachBlank;
            }
        }
        return value;
    }
    // If we contain multiple other extractions, concat them
    const datas = getAllElementsWithAttribute(container, 'data-extraction');
    if (datas.length > 0) {
        let value = '';
        for (let i = 0; i < datas.length; i++) {
            value += datas[i].getAttribute('data-extraction');
        }
        return value;
    }
    // If we are just a destination div, the value will be cached
    const cached = container.getAttribute('data-extraction');
    if (cached != null) {
        return cached;
    }
    // No recognized combo
    console.error('Unrecognized value container: ' + container);
    return '';
}
exports.getValueFromTextContainer = getValueFromTextContainer;
/*-----------------------------------------------------------
 * _textSetup.ts
 *-----------------------------------------------------------*/
/**
 * On page load, look for any instances of elements tag with class names we respond to.
 * When found, expand those elements appropriately.
 */
function textSetup() {
    setupLetterPatterns();
    setupExtractedPatterns();
    setupLetterCells();
    setupLetterInputs();
    setupWordCells();
    setupCopyExtracters();
    indexAllInputFields();
}
exports.textSetup = textSetup;
/**
 * Look for elements of class 'create-from-pattern'.
 * When found, use the pattern, as well as other inputs, to build out a sequence of text inputs inside that element.
 * Secondary attributes:
 *   letter-cell-table: A table with this class will expect every cell
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
 *
 *   NOTE: the -style and -image fields can be placed on the affected pattern tag, or on any parent below the <BODY>.
 *
 * ---- STYLES ----
 *   letter-grid-2d:       Simple arrow navigation in all directions. At left/right edges, wrap
 *   letter-grid-discover: Subtler arrow navigation, accounts for offsets by finding nearest likely target
 *   loop-navigation:      When set, arrowing off top or bottom loops around
 *   navigate-literals:    A table with this class will allow the cursor to land on literals, but not over-type them.
 */
function setupLetterPatterns() {
    const tables = document.getElementsByClassName('letter-cell-table');
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const navLiterals = findParentOfClass(table, 'navigate-literals') != null;
        const cells = table.getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            const td = cells[j];
            // Skip cells with existing contents
            if (hasClass(td, 'no-cell')) {
                continue;
            }
            if (td.innerHTML == '') {
                toggleClass(td, 'create-from-pattern', true);
                if (!getOptionalStyle(td, 'data-letter-pattern')) {
                    td.setAttributeNS(null, 'data-letter-pattern', '1');
                }
                // Make sure every row that contains any cells with inputs is tagged as a block
                const tr = td.parentNode;
                toggleClass(tr, 'letter-cell-block', true);
                // Any cells tagged extract need to clarify what to extract
                if (hasClass(td, 'extract')) {
                    td.setAttributeNS(null, 'data-extract-indeces', '1');
                }
            }
            else {
                toggleClass(td, 'literal', true);
                // Any cells tagged extract need to clarify what to extract
                if (hasClass(td, 'extract')) {
                    toggleClass(td, 'extract-input', true);
                    toggleClass(td, 'extract-literal', true);
                    td.setAttributeNS(null, 'data-extract-value', td.innerText);
                }
                if (navLiterals) {
                    var span = document.createElement('span');
                    toggleClass(span, 'letter-cell', true);
                    toggleClass(span, 'literal', true);
                    toggleClass(span, 'read-only-overlay', true);
                    // Don't copy contents into span. Only used for cursor position
                    td.appendChild(span);
                }
            }
        }
    }
    const patterns = document.getElementsByClassName('create-from-pattern');
    for (let i = 0; i < patterns.length; i++) {
        var parent = patterns[i];
        if (parent.id === 'extracted' || hasClass(parent, 'extracted')) {
            continue; // This isn't an input pattern. It's a destination pattern
        }
        var pattern = parseNumberPattern(parent, 'data-letter-pattern');
        var extractPattern = parsePattern(parent, 'data-extract-indeces');
        var numberedPattern = parsePattern2(parent, 'data-number-assignments');
        var vertical = hasClass(parent, 'vertical'); // If set, each input and literal needs to be on a separate line
        var numeric = hasClass(parent, 'numeric'); // Forces inputs to be numeric
        var styles = getLetterStyles(parent, 'underline', 'none', Object.keys(numberedPattern).length == 0 ? 'box' : 'numbered');
        if (pattern != null && pattern.length > 0) { //if (parent.classList.contains('letter-cell-block')) {
            var prevCount = 0;
            for (let pi = 0; pi < pattern.length; pi++) {
                if (pattern[pi]['count']) {
                    var count = pattern[pi]['count'];
                    var word = document.createElement('span');
                    if (!vertical) {
                        toggleClass(word, 'letter-cell-set', true); // usually, each number wants to be nobr
                    }
                    for (let ci = 1; ci <= count; ci++) {
                        var span = document.createElement('span');
                        toggleClass(span, 'letter-cell', true);
                        applyAllClasses(span, styles.letter);
                        toggleClass(span, 'numeric', numeric);
                        var index = prevCount + ci;
                        //Highlight and Extract patterns MUST be in ascending order
                        if (extractPattern.indexOf(index) >= 0) {
                            toggleClass(span, 'extract', true);
                            applyAllClasses(span, styles.extract);
                        }
                        if (numberedPattern[index] !== undefined) {
                            span.setAttributeNS('', 'data-extract-order', '' + numberedPattern[index]);
                            toggleClass(span, 'extract', true);
                            toggleClass(span, 'numbered', true); // indicates numbers used in extraction
                            applyAllClasses(span, styles.extract); // 'extract-numbered' indicates the visual appearance
                            var number = document.createElement('span');
                            toggleClass(number, 'under-number');
                            number.innerText = numberedPattern[index];
                            span.setAttribute('data-number', numberedPattern[index]);
                            span.appendChild(number);
                        }
                        word.appendChild(span);
                        if (vertical && (ci < count || pi < pattern.length - 1)) {
                            word.appendChild(document.createElement('br'));
                        }
                    }
                    parent.appendChild(word);
                    prevCount += count;
                }
                else if (pattern[pi]['char'] !== null) {
                    const lit = pattern[pi]['char'];
                    var span = createLetterLiteral(lit);
                    toggleClass(span, styles.literal, true);
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
    let letter = getOptionalStyle(elmt, 'data-letter-style', undefined, 'letter-')
        || getOptionalStyle(elmt, 'data-input-style', defLetter, 'letter-');
    if (letter === 'letter-grid') {
        // Special case: grid overrides other defaults
        defLiteral = 'grid';
        defExtract = 'grid-highlight';
    }
    let literal = getOptionalStyle(elmt, 'data-literal-style', defLiteral);
    literal = (literal != null) ? ('literal-' + literal) : letter;
    let extract = getOptionalStyle(elmt, 'data-extract-style', defExtract, 'extract-');
    let word = getOptionalStyle(elmt, 'data-word-style', 'underline', 'word-');
    return {
        letter: letter,
        extract: extract,
        literal: literal,
        word: word,
        hidden: 'hide-element',
    };
}
exports.getLetterStyles = getLetterStyles;
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
    var list = [];
    var pattern = elmt.getAttributeNS('', patternAttr);
    if (pattern == null) {
        return list;
    }
    for (let pi = 0; pi < pattern.length; pi++) {
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
function parsePattern(elmt, patternAttr, offset = 0) {
    var pattern = elmt.getAttributeNS('', patternAttr);
    offset = offset || 0;
    const set = [];
    if (pattern != null) {
        var array = pattern.split(' ');
        for (let i = 0; i < array.length; i++) {
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
function parsePattern2(elmt, patternAttr, offset = 0) {
    var pattern = elmt.getAttributeNS('', patternAttr);
    offset = offset || 0;
    var set = {};
    if (pattern != null) {
        var array = pattern.split(' ');
        for (let i = 0; i < array.length; i++) {
            var equals = array[i].split('=');
            set[parseInt(equals[0]) + offset] = equals[1];
        }
    }
    return set;
}
// Attributes that authors can place on <letter/> elements
// which we should mirror to the underlying input fields
const inputAttributesToCopy = ['size', 'maxlength', 'inputmode'];
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
    const allCells = document.getElementsByClassName('letter-cell');
    const cells = SortElements(allCells);
    let extracteeIndex = 1;
    let extractorIndex = 1;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const navLiterals = findParentOfClass(cell, 'navigate-literals') != null;
        // Letters can specify under-numbers, separate from extraction patterns.
        // This enables copy-id, or other hinting.
        const underNum = cell.getAttributeNS('', 'under-text');
        if (underNum) {
            // under-text spans go before the <input>
            const under = document.createElement('span');
            toggleClass(under, 'under-number');
            under.innerText = underNum;
            cell.appendChild(under);
        }
        // Place a small text input field in each cell
        const inp = document.createElement('input');
        inp.type = 'text';
        cloneSomeAttributes(cell, inp, inputAttributesToCopy);
        // Allow container to inject ID
        let attr;
        if (attr = cell.getAttributeNS('', 'input-id')) {
            inp.id = attr;
        }
        if (hasClass(cell, 'numeric')) {
            // We never submit, so this doesn't have to be exact. But it should trigger the mobile numeric keyboard
            inp.pattern = '[0-9]*'; // iOS
            inp.inputMode = 'numeric'; // Android
        }
        toggleClass(inp, 'letter-input');
        if (hasClass(cell, 'extract')) {
            toggleClass(inp, 'extract-input');
            var extractImg = getOptionalStyle(cell, 'data-extract-image');
            if (extractImg != null) {
                var img = document.createElement('img');
                img.src = extractImg;
                img.classList.add('extract-image');
                cell.appendChild(img);
            }
            if (hasClass(cell, 'numbered')) {
                toggleClass(inp, 'numbered-input');
                const dataNumber = cell.getAttribute('data-number');
                if (dataNumber != null) {
                    inp.setAttribute('data-number', dataNumber);
                }
            }
            else {
                // Implicit number based on reading order
                inp.setAttribute('data-number', "" + extracteeIndex++);
            }
        }
        if (hasClass(cell, 'extractor')) {
            toggleClass(inp, 'extractor-input');
            inp.id = 'extractor-' + extractorIndex++;
        }
        if (hasClass(cell, 'literal')) {
            toggleClass(inp, 'letter-non-input');
            const val = cell.innerText;
            cell.innerHTML = '';
            inp.setAttribute('data-literal', val == '\xa0' ? ' ' : val);
            if (navLiterals) {
                inp.setAttribute('readonly', '');
                inp.value = val;
            }
            else {
                inp.setAttribute('disabled', '');
                var span = document.createElement('span');
                toggleClass(span, 'letter-literal');
                span.innerText = val;
                cell.appendChild(span);
            }
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
    for (let i = 0; i < inputs.length; i++) {
        const inp = inputs[i];
        inp.onkeydown = function (e) { onLetterKeyDown(e); };
        inp.onkeyup = function (e) { onLetterKeyUp(e); };
        inp.onchange = function (e) { onLetterChange(e); };
        inp.oninput = function (e) { onLetterInput(e); };
    }
    // Buttons get caught up in the arrow navigation of input fields,
    // so make sure players can arrow back out.
    var buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        btn.onkeydown = function (e) { onButtonKeyDown(e); };
        // btn.onkeyup=function(e){onLetterKeyUp(e)};
    }
}
/**
 * Once elements are created and tagged with word-cell, add input areas inside each cell.
 * @example <div class="word-cell"/> becomes:
 *   <div><input type='text' class="word-input" /></div>  // for simple multi-letter text input
 */
function setupWordCells() {
    var cells = document.getElementsByClassName('word-cell');
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        let inpStyle = getOptionalStyle(cell, 'data-word-style', 'underline', 'word-');
        // Place a text input field in each cell
        const inp = document.createElement('input');
        inp.type = 'text';
        toggleClass(inp, 'word-input');
        cloneSomeAttributes(cell, inp, inputAttributesToCopy);
        // Allow container to inject ID
        let attr;
        if (attr = cell.getAttributeNS('', 'input-id')) {
            inp.id = attr;
        }
        if (hasClass(cell, 'literal')) {
            inp.setAttribute('disabled', '');
            toggleClass(inp, 'word-literal');
            // var span:HTMLElement = document.createElement('span');
            // toggleClass(span, 'word-literal');
            inp.value = cell.innerText;
            cell.innerHTML = '';
            // cell.appendChild(span);
            inpStyle = getOptionalStyle(cell, 'data-literal-style', undefined, 'word-') || inpStyle;
        }
        else {
            inp.onkeydown = function (e) { onLetterKeyDown(e); };
            inp.onkeyup = function (e) { onWordKey(e); };
            inp.onchange = function (e) { onWordChange(e); };
            inp.oninput = function (e) { onWordInput(e); };
            if (hasClass(cell, 'numeric')) {
                // We never submit, so this doesn't have to be exact. But it should trigger the mobile numeric keyboard
                inp.pattern = '[0-9]*'; // iOS
                inp.inputMode = 'numeric'; // Android
            }
        }
        cell.appendChild(inp);
        const extractIndex = cell.getAttributeNS('', 'data-extract-index');
        if (extractIndex !== null) {
            const index = document.createElement('span');
            toggleClass(index, 'letter-index');
            index.innerText = extractIndex;
            let indexStyle = getOptionalStyle(cell, 'data-index-style', 'none', 'index-');
            if (indexStyle) {
                applyAllClasses(index, indexStyle);
            }
            cell.appendChild(index);
        }
    }
}
/**
 * Among the patterns (class='create-from-pattern'), process those tagged as
 * extraction destinations. Either id="extracted" or class="extracted".
 *
 * @todo: clarify the difference between "extracted" and "extractor"
 */
function setupExtractedPatterns() {
    var patterns = document.getElementsByClassName('create-from-pattern');
    for (let pat of patterns) {
        if (pat.id === 'extracted' || hasClass(pat, 'extracted')) {
            setupExtractPattern(pat);
        }
    }
}
/**
 * Evaluate one area tagged as an extract destination.
 * The area may be further annotated with data-numbered-pattern="..."
 * and optionally data-indexed-by-letter="true" to create sequences of
 * numbered/lettered destination points.
 *
 * Several styles:
 *   + un-numbered blanks, with optional literals
 *   + numbered blanks
 *   + lettered blanks (handy variant, when data itself is numeric)
 *
 * NOTE: Don't use patterns for the other extracted styles:
 *   + initially hidden, converting to blanks once extraction starts
 *   + initially hidden, converting to simple letters once extraction starts
 *
 * @param extracted The container for the extraction.
 */
function setupExtractPattern(extracted) {
    if (extracted === null) {
        return;
    }
    // All three variants use the same syntax (length list)
    let patternAttr = 'data-letter-pattern'; // If user uses input-style syntax
    let numbered = false;
    let lettered = false;
    if (extracted.hasAttributeNS('', 'data-extract-numbered')) {
        numbered = true;
        patternAttr = 'data-extract-numbered';
    }
    else if (extracted.hasAttributeNS('', 'data-extract-lettered')) {
        numbered = lettered = true;
        patternAttr = 'data-extract-lettered';
    }
    else if (extracted.hasAttributeNS('', 'data-extracted-pattern')) {
        patternAttr = 'data-extracted-pattern';
    }
    var styles = getLetterStyles(extracted, 'underline', 'none', '');
    let numPattern = parseNumberPattern(extracted, patternAttr);
    var nextNumber = 1;
    for (let pi = 0; pi < numPattern.length; pi++) {
        if (numPattern[pi]['count']) {
            var count = numPattern[pi]['count'];
            for (let ci = 1; ci <= count; ci++) {
                const span = document.createElement('span');
                toggleClass(span, 'letter-cell', true);
                toggleClass(span, 'extractor', true);
                applyAllClasses(span, styles.letter); // letter-style, not extract-style
                extracted.appendChild(span);
                if (numbered) {
                    toggleClass(span, 'numbered');
                    const number = document.createElement('span');
                    toggleClass(number, 'under-number');
                    number.innerText = lettered ? String.fromCharCode(64 + nextNumber) : ("" + nextNumber);
                    span.setAttribute('data-number', "" + nextNumber);
                    span.appendChild(number);
                    nextNumber++;
                }
            }
        }
        else if (numPattern[pi]['char'] !== null) {
            var span = createLetterLiteral(numPattern[pi]['char']);
            applyAllClasses(span, styles.literal);
            extracted.appendChild(span);
        }
    }
}
/**
 * An alternative to pushed extractions is pulled "copy" extractions.
 * At setup time, we need to identify any source elements, so they know to extract.
 * All such elements will have the class copy-extractee.
 * The destinations already have the class copy-extracter.
 *
 * Any element of class copy-extracter should also have a data-copy-id attribute.
 * That attribute contains the ID, and possible modifiers, of another input that we will copy from.
 * It can also contain multiple such IDs, separated by spaces.
 * Each ID should have the format: <id>[.index][.sub-index], where
 *   - id is the ID of the source element (or at least its letter-/word-cell parent)
 *   - index, if present is the character index (ignoring whitespace) of any multi-letter inputs.
 *     If omitted, copy the entire contents of the source input.
 *   - sub-index, if present, converts index to a word index (1-based),
 *     and the sub-index is the character index within the word.
 */
function setupCopyExtracters() {
    const elmts = document.getElementsByClassName('copy-extracter');
    for (let i = 0; i < elmts.length; i++) {
        const elmt = elmts[i];
        const copyId = elmt.getAttribute('data-copy-id');
        if (copyId) {
            const copyIds = copyId.split(' ');
            for (let c = 0; c < copyIds.length; c++) {
                const srcId = copyIds[c].split('.')[0];
                const src = document.getElementById(srcId);
                if (src) {
                    toggleClass(src, 'copy-extractee', true);
                }
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
    let inputs = document.getElementsByClassName('letter-input');
    for (let i = 0; i < inputs.length; i++) {
        const inp = inputs[i];
        if (inp.value != '') {
            return true;
        }
    }
    inputs = document.getElementsByClassName('word-input');
    for (let i = 0; i < inputs.length; i++) {
        const inp = inputs[i];
        if (inp.value != '') {
            return true;
        }
    }
    return false;
}
/**
 * Setup a click handler on the page to help sloppy clickers find inputs
 * @param page
 */
function clicksFindInputs(page) {
    page.addEventListener('click', function (e) { focusNearestInput(e); });
}
exports.clicksFindInputs = clicksFindInputs;
/**
 * Move the focus to the nearest input-appropriate element.
 * @param evt A mouse event
 */
function focusNearestInput(evt) {
    // Ignore shift states
    // Ignore fake events (!isTrusted)
    if (!evt.ctrlKey && !evt.shiftKey && !evt.altKey && evt.isTrusted) {
        const targets = document.elementsFromPoint(evt.clientX, evt.clientY);
        let nearest = undefined;
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if ((target.getAttribute('disabled') === null) && (isArrowKeyElement(target) || isTag(target, 'a'))) {
                nearest = target; // Shouldn't need my help
                break;
            }
            if (hasClass(target, 'stampTool') || hasClass(target, 'stampLock')
                || findParentOfClass(target, 'stampable') || findParentOfClass(target, 'cross-off')) {
                return; // Stamping elements don't handle their own clicks; the page does
            }
            if (target.id == 'page' || target.id == 'scratch-pad' || hasClass(target, 'scratch-div')) {
                break; // Found none. Continue below
            }
            if (hasClass(target, 'clickable') || target.id.indexOf('-toggle') >= 0) {
                // Example: #decoder-toggle
                return; // Target has its own handler
            }
        }
        let nearestD = NaN;
        if (nearest) {
            nearestD = 0;
        }
        else {
            const tags = ['input', 'textarea', 'select', 'a', 'clickable', 'stampable'];
            for (let t = 0; t < tags.length; t++) {
                const elements = tags[t] === 'clickable' ? document.getElementsByClassName(tags[t])
                    : document.getElementsByTagName(tags[t]);
                for (let i = 0; i < elements.length; i++) {
                    const elmt = elements[i];
                    if (elmt.style.display !== 'none' && elmt.getAttribute('disabled') === null) {
                        const d = distanceToElement(evt, elmt);
                        if (Number.isNaN(nearestD) || d < nearestD) {
                            nearest = elmt;
                            nearestD = d;
                        }
                    }
                }
            }
        }
        if (nearest) {
            if (isTag(nearest, 'a') && nearestD < 50) { // 1/2 inch max
                nearest.click();
            }
            else if (hasClass(nearest, 'clickable')) {
                if (hasInputGroup(nearest)) {
                    setCurrentInputGroup(nearest);
                }
                nearest.click();
            }
            else {
                moveFocus(nearest);
            }
        }
    }
}
/**
 * Distance between a mouse event and the nearest edge or corner of an element
 * @param evt A mouse event
 * @param elmt A rectangular element
 * @returns A distance in client pixels
 */
function distanceToElement(evt, elmt) {
    const rect = elmt.getBoundingClientRect();
    if (evt.clientX < rect.left) {
        if (evt.clientY < rect.top) {
            return distanceP2P(evt.clientX, evt.clientY, rect.left, rect.top);
        }
        if (evt.clientY < rect.bottom) {
            return distanceP2P(evt.clientX, evt.clientY, rect.left, evt.clientY);
        }
        return distanceP2P(evt.clientX, evt.clientY, rect.left, rect.bottom);
    }
    if (evt.clientX > rect.right) {
        if (evt.clientY < rect.top) {
            return distanceP2P(evt.clientX, evt.clientY, rect.right, rect.top);
        }
        if (evt.clientY < rect.bottom) {
            return distanceP2P(evt.clientX, evt.clientY, rect.right, evt.clientY);
        }
        return distanceP2P(evt.clientX, evt.clientY, rect.right, rect.bottom);
    }
    if (evt.clientY < rect.top) {
        return distanceP2P(evt.clientX, evt.clientY, evt.clientX, rect.top);
    }
    if (evt.clientY < rect.bottom) {
        return 0;
    }
    return distanceP2P(evt.clientX, evt.clientY, evt.clientX, rect.bottom);
}
/**
 * Pythagorean distance, but favor X more than Y
 * @returns A distance in client pixels
 */
function distanceP2P(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) * 3);
}
/*-----------------------------------------------------------
 * _subway.ts
 *-----------------------------------------------------------*/
/**
 * On page load, look for any instances of elements tag with class names we respond to.
 * When found, expand those elements appropriately.
 */
function setupSubways() {
    const subways = document.getElementsByClassName('subway');
    for (let i = 0; i < subways.length; i++) {
        createSubway(subways[i]);
    }
}
exports.setupSubways = setupSubways;
/**
 * Maximum of two numbers, or the second, if current is null
 * @param val A new value
 * @param curr The current max value, which can be null
 * @returns The max
 */
function maxx(val, curr) {
    return (!curr || curr < val) ? val : curr;
}
/**
 * Minimum of two numbers, or the second, if current is null
 * @param val A new value
 * @param curr The current min value, which can be null
 * @returns The min
 */
function minn(val, curr) {
    return (!curr || curr > val) ? val : curr;
}
function bounding(pt, rect) {
    if (!rect) {
        return new DOMRect(pt.x, pt.y, 0, 0);
    }
    const left = minn(rect.left, pt.x);
    const right = maxx(rect.right, pt.x);
    const top = minn(rect.top, pt.y);
    const bottom = maxx(rect.bottom, pt.y);
    return new DOMRect(left, top, right - left, bottom - top);
}
/**
 * Round a value to the nearest 0.1
 * @param n Any number
 * @returns A number with no significant digits smaller than a tenth
 */
function dec(n) {
    return Math.round(n * 10) / 10;
}
/**
 * Create an SVG inside a <div class='subway'>, to connect input cells.
 * @param subway
 */
function createSubway(subway) {
    let details = verticalSubway(subway);
    if (!details) {
        details = horizontalSubway(subway);
    }
    if (details) {
        const xmlns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(xmlns, 'svg');
        const path = document.createElementNS(xmlns, 'path');
        path.setAttributeNS(null, 'd', details.path_d);
        svg.appendChild(path);
        svg.setAttributeNS(null, 'width', dec(details.bounds.right - details.origin.x - details.shift.x + 2) + 'px');
        svg.setAttributeNS(null, 'height', dec(details.bounds.bottom - details.origin.y - details.shift.y + 2) + 'px');
        subway.appendChild(svg);
        if (details.shift.x != 0) {
            subway.style.left = dec(details.shift.x) + 'px';
        }
        if (details.shift.y != 0) {
            subway.style.top = dec(details.shift.y) + 'px';
        }
    }
}
/**
 * Build the paths of a vertically-oriented subway
 * @param subway The <div class='subway' with coordinate info
 * @returns Details for the SVG and PATH to be created, or undefined if the div does not indicate vertical
 */
function verticalSubway(subway) {
    const origin = subway.getBoundingClientRect();
    let sLefts = subway.getAttributeNS('', 'data-left-end') || '';
    let sRights = subway.getAttributeNS('', 'data-right-end') || '';
    if (sLefts.length == 0 && sRights.length == 0) {
        return undefined;
    }
    const leftId = subway.getAttributeNS('', 'data-left-id');
    const rightId = subway.getAttributeNS('', 'data-right-id');
    sLefts = joinIds(leftId, sLefts);
    sRights = joinIds(rightId, sRights);
    let bounds;
    const yLefts = [];
    const yRights = [];
    // right-side spurs
    const rights = sRights.split(' ');
    for (let i = 0; i < rights.length; i++) {
        const pt = getAnchor(rights[i], 'left');
        bounds = bounding(pt, bounds);
        yRights.push(dec(pt.y - origin.top));
    }
    // left-side spurs
    const lefts = sLefts.split(' ');
    for (let i = 0; i < lefts.length; i++) {
        const pt = getAnchor(lefts[i], 'right');
        bounds = bounding(pt, bounds);
        yLefts.push(dec(pt.y - origin.top));
    }
    if (!bounds) {
        return; // ERROR
    }
    // rationalize the boundaries
    const shift_left = minn(0, bounds.left - origin.left);
    const left = maxx(0, dec(bounds.left - origin.left - shift_left));
    const right = dec(bounds.left + bounds.width - origin.left - shift_left);
    // belatedly calculate the middle
    const sMiddle = subway.getAttributeNS('', 'data-center-line');
    let middle;
    if (!sMiddle) {
        middle = bounds.width / 2;
    }
    else if (sMiddle.indexOf('%') == sMiddle.length - 1) {
        middle = dec(parseInt(sMiddle) * bounds.width / 100);
    }
    else {
        middle = parseInt(sMiddle);
    }
    let d = '';
    if (bounds.height <= 2.5 && yLefts.length == 1 && yRights.length == 1) {
        d = 'M' + left + ',' + yLefts[0]
            + ' L' + right + yRights[0];
    }
    else {
        // Draw the first left to the last right
        let d = 'M' + left + ',' + yLefts[0]
            + ' L' + middle + ',' + yLefts[0]
            + ' L' + middle + ',' + yRights[yRights.length - 1]
            + ' L' + right + ',' + yRights[yRights.length - 1];
        if (yLefts.length > 0 || yRights.length > 0) {
            // Draw the last left to the first right
            d += 'M' + left + ',' + yLefts[yLefts.length - 1]
                + ' L' + middle + ',' + yLefts[yLefts.length - 1]
                + ' L' + middle + ',' + yRights[0]
                + ' L' + right + ',' + yRights[0];
        }
        // Add any middle spurs
        for (let i = 1; i < yLefts.length - 1; i++) {
            d += 'M' + left + ',' + yLefts[i]
                + ' L' + middle + ',' + yLefts[i]
                + ' L' + middle + ',' + yRights[0];
        }
        for (let i = 1; i < yRights.length - 1; i++) {
            d += 'M' + right + ',' + yRights[i]
                + ' L' + middle + ',' + yRights[i]
                + ' L' + middle + ',' + yLefts[0];
        }
    }
    return {
        origin: origin,
        path_d: d,
        bounds: bounds,
        shift: new DOMPoint(shift_left, 0)
    };
}
function joinIds(id, indeces) {
    if (!id || !indeces) {
        return indeces;
    }
    const list = indeces.split(' ').map(i => id + '.' + i);
    return list.join(' ');
}
/**
 * Build the paths of a horizontally-oriented subway
 * @param subway The <div class='subway' with coordinate info
 * @returns Details for the SVG and PATH to be created, or undefined if the div does not indicate horizontal
 */
function horizontalSubway(subway) {
    const origin = subway.getBoundingClientRect();
    let sTops = subway.getAttributeNS('', 'data-top-end') || '';
    let sBottoms = subway.getAttributeNS('', 'data-bottom-end') || '';
    if (sTops.length == 0 && sBottoms.length == 0) {
        return undefined;
    }
    const topId = subway.getAttributeNS('', 'data-top-id');
    const bottomId = subway.getAttributeNS('', 'data-bottom-id');
    sTops = joinIds(topId, sTops);
    sBottoms = joinIds(bottomId, sBottoms);
    let bounds;
    const xTops = [];
    const xBottoms = [];
    // top-side spurs
    if (sBottoms.length > 0) {
        const bottoms = sBottoms.split(' ');
        for (let i = 0; i < bottoms.length; i++) {
            const pt = getAnchor(bottoms[i], 'top');
            bounds = bounding(pt, bounds);
            xBottoms.push(dec(pt.x - origin.left));
        }
    }
    // bottom-side spurs
    if (sTops.length > 0) {
        const tops = sTops.split(' ');
        for (let i = 0; i < tops.length; i++) {
            const pt = getAnchor(tops[i], 'bottom');
            bounds = bounding(pt, bounds);
            xTops.push(dec(pt.x - origin.left));
        }
    }
    if (!bounds) {
        return; // ERROR
    }
    // belatedly calculate the middle
    const sMiddle = subway.getAttributeNS('', 'data-center-line');
    let middle;
    if (!sMiddle) {
        middle = bounds.height / 2;
    }
    else if (sMiddle.indexOf('%') == sMiddle.length - 1) {
        middle = dec(parseInt(sMiddle) * bounds.height / 100);
    }
    else {
        middle = parseInt(sMiddle);
        if (bounds.height <= middle) {
            if (xTops.length == 0) {
                bounds.y -= middle + 1;
            }
            bounds.height = middle + 1;
        }
    }
    // align the boundaries
    const shift_top = minn(0, bounds.top - origin.top); // zero or negative
    const top = maxx(0, dec(bounds.top - origin.top - shift_top));
    const bottom = dec(bounds.top + bounds.height - origin.top - shift_top);
    let d = '';
    if (bounds.width <= 2.5 && xTops.length == 1 && xBottoms.length == 1) {
        // Special case (nearly) vertical connectors
        d = 'M' + xTops[0] + ',' + top
            + ' L' + xBottoms[0] + ',' + bottom;
    }
    else {
        // Draw the horizontal bar
        d = 'M' + dec(bounds.left - origin.left) + ',' + middle
            + ' h' + dec(bounds.width);
        // Draw all up-facing spurs
        for (let i = 0; i < xTops.length; i++) {
            d += ' M' + xTops[i] + ',' + middle
                + ' v' + -middle;
        }
        // Draw all down-facing spurs
        for (let i = 0; i < xBottoms.length; i++) {
            d += ' M' + xBottoms[i] + ',' + middle
                + ' v' + dec(bounds.height - middle);
        }
    }
    return {
        origin: origin,
        path_d: d,
        bounds: bounds,
        shift: new DOMPoint(0, shift_top)
    };
}
/**
 * Find a point on the perimeter of a specific subway cell
 * @param id_index A cell identity in the form "col1.4", where col1 is a letter-cell-block and .4 is the 4th cell in that block
 * @param edge One of {left|right|top|bottom}. The point is the midpoint of that edge of the cell
 * @returns A point on the page in client coordinates
 */
function getAnchor(id_index, edge) {
    const idx = id_index.split('.');
    let elmt = document.getElementById(idx[0]);
    if (idx.length > 1) {
        const children = elmt.getElementsByClassName('letter-cell');
        elmt = children[parseInt(idx[1]) - 1]; // indexes start at 1
    }
    const rect = elmt.getBoundingClientRect();
    if (edge == 'left') {
        return new DOMPoint(rect.left, rect.top + 1 + rect.height / 2);
    }
    if (edge == 'right') {
        return new DOMPoint(rect.right, rect.top - 1 + rect.height / 2);
    }
    if (edge == 'top') {
        return new DOMPoint(rect.left + 1 + rect.width / 2, rect.top);
    }
    if (edge == 'bottom') {
        return new DOMPoint(rect.left - 1 + rect.width / 2, rect.bottom);
    }
    // error: return middle
    return new DOMPoint(rect.left - 1 + rect.width / 2, rect.top - 1 + rect.height / 2);
}
/**
 * Convert an element's left/top style to a position
 * @param elmt Any element with a style
 * @returns A position
 */
function positionFromStyle(elmt) {
    return { x: parseInt(elmt.style.left), y: parseInt(elmt.style.top) };
}
exports.positionFromStyle = positionFromStyle;
// VOCABULARY
// moveable: any object which can be clicked on to begin a move
// drop-target: a container that can receive a (single) moveable element
// drag-source: a container that can hold a single spare moveable element
/**
 * Scan the page for anything marked moveable, drag-source, or drop-target
 * Those items get click handlers
 */
function preprocessDragFunctions() {
    let elems = document.getElementsByClassName('moveable');
    for (let i = 0; i < elems.length; i++) {
        preprocessMoveable(elems[i]);
    }
    elems = document.getElementsByClassName('drop-target');
    for (let i = 0; i < elems.length; i++) {
        preprocessDropTarget(elems[i]);
    }
    elems = document.getElementsByClassName('free-drop');
    for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        preprocessFreeDrop(elem);
        // backward-compatible
        if (hasClass(elem, 'z-grow-up')) {
            elem.setAttributeNS('', 'data-z-grow', 'up');
        }
        else if (hasClass(elem, 'z-grow-down')) {
            elem.setAttributeNS('', 'data-z-grow', 'down');
        }
        initFreeDropZorder(elem);
    }
}
exports.preprocessDragFunctions = preprocessDragFunctions;
/**
 * Similar to pre-process, but a special case when the draggable
 * elements show up after the initial page setup.
 * @param container An element which is or contains 'moveable',
 * and other drag-drop artifacts.
 */
function postprocessDragFunctions(container) {
    let elems = getElementsByClassOrId('moveable', undefined, container);
    for (let i = 0; i < elems.length; i++) {
        preprocessMoveable(elems[i]);
    }
    elems = getElementsByClassOrId('drop-target', undefined, container);
    for (let i = 0; i < elems.length; i++) {
        preprocessDropTarget(elems[i]);
    }
    elems = getElementsByClassOrId('free-drop', undefined, container);
    for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        preprocessFreeDrop(elem);
        // backward-compatible
        if (hasClass(elem, 'z-grow-up')) {
            elem.setAttributeNS('', 'data-z-grow', 'up');
        }
        else if (hasClass(elem, 'z-grow-down')) {
            elem.setAttributeNS('', 'data-z-grow', 'down');
        }
        initFreeDropZorder(elem);
    }
}
exports.postprocessDragFunctions = postprocessDragFunctions;
/**
 * Hook up the necessary mouse events to each moveable item
 * @param elem a moveable element
 */
function preprocessMoveable(elem) {
    var xmlns = elem.namespaceURI;
    if (xmlns != "http://www.w3.org/1999/xhtml") { // This is both HTML and XHTML
        console.error("WARNING: non-HTML elements are not draggable: " + elem.localName);
    }
    elem.setAttribute('draggable', 'true');
    elem.onpointerdown = function (e) { onClickDrag(e); };
    elem.ondrag = function (e) { onDrag(e); };
    elem.ondragend = function (e) { onDragDrop(e); };
}
/**
 * Hook up the necessary mouse events to each drop target
 * @param elem a drop-target element
 */
function preprocessDropTarget(elem) {
    elem.onpointerup = function (e) { onClickDrop(e); };
    elem.ondragenter = function (e) { onDropAllowed(e); };
    elem.ondragover = function (e) { onDropAllowed(e); };
    elem.onpointermove = function (e) { onTouchDrag(e); };
}
/**
 * Hook up the necessary mouse events to each free drop target
 * @param elem a free-drop element
 */
function preprocessFreeDrop(elem) {
    elem.onpointerdown = function (e) { doFreeDrop(e); };
    elem.ondragenter = function (e) { onDropAllowed(e); };
    elem.ondragover = function (e) { onDropAllowed(e); };
}
/**
 * Assign z-index values to all moveable objects within a container.
 * Objects' z index is a function of their y-axis, and can extend up or down.
 * @param container The free-drop container, which can contain a data-z-grow attribute
 */
function initFreeDropZorder(container) {
    const zGrow = container.getAttributeNS('', 'data-z-grow')?.toLowerCase();
    if (!zGrow || (zGrow != 'up' && zGrow != 'down')) {
        return;
    }
    const zUp = zGrow == 'up';
    const height = container.getBoundingClientRect().height;
    const children = container.getElementsByClassName('moveable');
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        let z = parseInt(child.style.top); // will always be in pixels, relative to the container
        z = 1000 + (zUp ? (height - z) : z);
        child.style.zIndex = String(z);
    }
}
exports.initFreeDropZorder = initFreeDropZorder;
/**
 * The most recent object to be moved
 */
let _priorDrag = null;
/**
 * The object that is selected, if any
 */
let _dragSelected = null;
/**
 * The drop-target over which we are dragging
 */
let _dropHover = null;
/**
 * The position within its container that a dragged object was in before dragging started
 */
let _dragPoint = null;
/**
 * Pick up an object
 * @param obj A moveable object
 */
function pickUp(obj) {
    _priorDrag = _dragSelected;
    if (_dragSelected != null && _dragSelected != obj) {
        toggleClass(_dragSelected, 'drag-selected', false);
        _dragSelected = null;
    }
    if (obj != null && obj != _dragSelected) {
        _dragSelected = obj;
        toggleClass(_dragSelected, 'displaced', false); // in case from earlier
        toggleClass(_dragSelected, 'placed', false);
        toggleClass(_dragSelected, 'drag-selected', true);
    }
}
/**
 * Drop the selected drag object onto a destination
 * If something else is already there, it gets moved to an empty drag source
 * Once complete, nothing is selected.
 * @param dest The target of this drag action
 */
function doDrop(dest) {
    if (!_dragSelected) {
        return;
    }
    let src = getDragSource();
    if (dest === src) {
        if (_priorDrag !== _dragSelected) {
            // Don't treat the first click of a 2-click drag
            // as a 1-click non-move.
            return;
        }
        // 2nd click on src is equivalent to dropping no-op
        dest = null;
    }
    let other = null;
    if (dest != null) {
        other = findFirstChildOfClass(dest, 'moveable', undefined, 0);
        if (other != null) {
            dest.removeChild(other);
        }
        src?.removeChild(_dragSelected);
        dest.appendChild(_dragSelected);
        saveContainerLocally(_dragSelected, dest);
    }
    toggleClass(_dragSelected, 'placed', true);
    toggleClass(_dragSelected, 'drag-selected', false);
    _dragSelected = null;
    _dragPoint = null;
    if (_dropHover != null) {
        toggleClass(_dropHover, 'drop-hover', false);
        _dropHover = null;
    }
    if (other != null) {
        // Any element that was previous at dest swaps places
        toggleClass(other, 'placed', false);
        toggleClass(other, 'displaced', true);
        if (!hasClass(src, 'drag-source')) {
            // Don't displace to a destination if an empty source is available
            const src2 = findEmptySource();
            if (src2 != null) {
                src = src2;
            }
        }
        src?.appendChild(other);
        saveContainerLocally(other, src);
    }
}
/**
 * Drag the selected object on a region with flexible placement.
 * @param event The drop event
 */
function doFreeDrop(event) {
    if (_dragPoint == null
        || (event.clientX == _dragPoint.x && event.clientY == _dragPoint.y && _priorDrag == null)) {
        // This is the initial click
        return;
    }
    if (_dragSelected != null) {
        const dx = event.clientX - _dragPoint.x;
        const dy = event.clientY - _dragPoint.y;
        const oldLeft = parseInt(_dragSelected.style.left);
        const oldTop = parseInt(_dragSelected.style.top);
        _dragSelected.style.left = (oldLeft + dx) + 'px';
        _dragSelected.style.top = (oldTop + dy) + 'px';
        updateZ(_dragSelected, oldTop + dy);
        savePositionLocally(_dragSelected);
        doDrop(null);
    }
}
/**
 * When an object is dragged in a container that holds multiple items,
 * the z-order can change. Use the relative y position to set z-index.
 * @param elem The element whose position just changed
 * @param y The y-offset of that element, within its free-drop container
 */
function updateZ(elem, y) {
    let dest = findParentOfClass(elem, 'free-drop');
    const zGrow = dest?.getAttributeNS('', 'data-z-grow')?.toLowerCase();
    if (zGrow == 'down') {
        elem.style.zIndex = String(1000 + y);
    }
    else if (zGrow == 'up') {
        const rect = dest.getBoundingClientRect();
        elem.style.zIndex = String(1000 + rect.height - y);
    }
}
/**
 * The drag-target or drag-source that is the current parent of the dragging item
 * @returns
 */
function getDragSource() {
    if (_dragSelected != null) {
        let src = findParentOfClass(_dragSelected, 'drop-target');
        if (src == null) {
            src = findParentOfClass(_dragSelected, 'drag-source');
        }
        if (src == null) {
            src = findParentOfClass(_dragSelected, 'free-drop');
        }
        return src;
    }
    return null;
}
/**
 * Initialize a drag with mouse-down
 * This may be the beginning of a 1- or 2-click drag action
 * @param event The mouse down event
 */
function onClickDrag(event) {
    const target = event.target;
    if (!target || target.tagName == 'INPUT') {
        return;
    }
    const obj = findParentOfClass(target, 'moveable');
    if (obj != null) {
        if (_dragSelected == null) {
            pickUp(obj);
            _dragPoint = { x: event.clientX, y: event.clientY };
        }
        else if (obj == _dragSelected) {
            // 2nd click on this object - enable no-op drop
            _priorDrag = obj;
        }
    }
}
/**
 * Conclude a drag with the mouse up
 * @param event A mouse up event
 */
function onClickDrop(event) {
    const target = event.target;
    if (!target || target.tagName == 'INPUT') {
        return;
    }
    if (_dragSelected != null) {
        let dest = findParentOfClass(target, 'drop-target');
        if (event.pointerType == 'touch') {
            // Touch events' target is really the source. Need to find target
            let pos = document.elementFromPoint(event.clientX, event.clientY);
            if (pos) {
                pos = findParentOfClass(pos, 'drop-target');
                if (pos) {
                    dest = pos;
                }
            }
        }
        doDrop(dest);
    }
}
/**
 * Conlcude a drag with a single drag-move-release.
 * We we released over a drop-target or free-drop element, make the move.
 * @param event The mouse drag end event
 */
function onDragDrop(event) {
    const elem = document.elementFromPoint(event.clientX, event.clientY);
    let dest = findParentOfClass(elem, 'drop-target');
    if (dest) {
        doDrop(dest);
    }
    else {
        dest = findParentOfClass(elem, 'free-drop');
        if (dest) {
            doFreeDrop(event);
        }
    }
}
/**
 * As a drag is happening, highlight the destination
 * @param event The mouse drag start event
 */
function onDrag(event) {
    if (event.screenX == 0 && event.screenY == 0) {
        return; // not a real event; some extra fire on drop
    }
    const elem = document.elementFromPoint(event.clientX, event.clientY);
    const dest = findParentOfClass(elem, 'drop-target');
    if (dest != _dropHover) {
        toggleClass(_dropHover, 'drop-hover', false);
        const src = getDragSource();
        if (dest != src) {
            toggleClass(dest, 'drop-hover', true);
            _dropHover = dest;
        }
    }
}
/**
 * Touch move events should behave like drag.
 * @param event Any pointer move, but since we filter to touch, they must be dragging
 */
function onTouchDrag(event) {
    if (event.pointerType == 'touch') {
        console.log('touch-drag to ' + event.x + ',' + event.y);
        onDrag(event);
    }
}
/**
 * As a drag is happening, make the cursor show valid or invalid targets
 * @param event A mouse hover event
 */
function onDropAllowed(event) {
    const elem = document.elementFromPoint(event.clientX, event.clientY);
    let dest = findParentOfClass(elem, 'drop-target');
    if (dest == null) {
        dest = findParentOfClass(elem, 'free-drop');
    }
    if (_dragSelected != null && dest != null) {
        event.preventDefault();
    }
}
/**
 * Find a drag-source that is currently empty.
 * Called when a moved object needs to eject another occupant.
 * @returns An un-occuped drag-source, if one can be found
 */
function findEmptySource() {
    const elems = document.getElementsByClassName('drag-source');
    for (let i = 0; i < elems.length; i++) {
        if (findFirstChildOfClass(elems[i], 'moveable', undefined, 0) == null) {
            return elems[i];
        }
    }
    // All drag sources are occupied
    return null;
}
/**
 * Move an object to a destination.
 * @param moveable The object to move
 * @param destination The container to place it in
 */
function quickMove(moveable, destination) {
    if (moveable != null && destination != null && !isSelfOrParent(moveable, destination)) {
        pickUp(moveable);
        doDrop(destination);
    }
}
exports.quickMove = quickMove;
/**
 * Move an object within a free-move container
 * @param moveable The object to move
 * @param position The destination position within the container
 */
function quickFreeMove(moveable, position) {
    if (moveable != null && position != null) {
        moveable.style.left = position.x + 'px';
        moveable.style.top = position.y + 'px';
        updateZ(moveable, position.y);
        toggleClass(moveable, 'placed', true);
    }
}
exports.quickFreeMove = quickFreeMove;
var _svgDragInfo = null;
var _svgSelectInfo = null;
// VOCABULARY
// moveable: any object which can be clicked on to begin a move. Desgined to be <g> elements.
// drop-target: a <g> element that can receive a (single) moveable element
// drag-source: a <g> container of a moveable's starting location. It cannot receive other moveables, but its own moveable can return to it.
//              to achieve that, its ID should be the moveable's ID + "-source"
//              but if sources are interchangeable, then leave off the ID entirely.
// free-drop: a drop-target that is also a free-drop can support a relative transform on the moveable. Otherwise, any transform on the moveable is removed.
// The moveable's positioning should be based at a 0,0 origin provided by the drop-target's transform.
// If "free-drop" is in effect, the moveable will get a transient translation.
// The drop-target may contain other elements inside it, to give it dimensions. Any moveable contents will be placed in front of those.
// Two kinds of movement: Drag-drop and click-twice.
// A single click will select a moveable element.
/**
 * Attach click handlers to the root, and any moveable elements.
 * @root: the ID or class of the root SVG element
 */
function preprocessSvgDragFunctions(svgId) {
    let svg = document.getElementById(svgId);
    if (svg != null) {
        svg.addEventListener('pointerleave', cancelSvgDrag);
        svg.addEventListener('pointermove', midSvgDrag);
        svg.addEventListener('pointerup', endSvgDrag);
        svg.addEventListener('pointerdown', clickSvgDragCanvas);
    }
    else {
        const svgs = document.getElementsByClassName(svgId);
        for (let i = 0; i < svgs.length; i++) {
            svg = svgs[i];
            svg.addEventListener('pointerleave', cancelSvgDrag);
            svg.addEventListener('pointermove', midSvgDrag);
            svg.addEventListener('pointerup', endSvgDrag);
            svg.addEventListener('pointerdown', clickSvgDragCanvas);
        }
    }
}
exports.preprocessSvgDragFunctions = preprocessSvgDragFunctions;
/**
 * Convert a screen coordinate into a point in an element's frame of reference
 * @param element: the SVG element whose frame we're interested in
 * @param clientX: the document X coordinate, as from a pointer event
 * @param clientY: the document Y coordinate, as from a pointer event
 */
function clientToLocalPoint(element, clientX, clientY) {
    const svg = findParentOfTag(element, 'svg');
    // Create a point in screen coordinates
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    // Get the consolidated transformation matrix for the element
    const ctm = element.getScreenCTM();
    if (!ctm)
        return new DOMPoint(NaN, NaN);
    // Transform the point into the element's local coordinate system
    const local = pt.matrixTransform(ctm.inverse());
    return new DOMPoint(local.x, local.y);
}
/**
 * Convert a local element coordinate into a point in screen coordinates
 * @param element: the SVG element whose frame we're starting from
 * @param localX: the local X coordinate
 * @param localY: the local Y coordinate
 */
function localToClientPoint(element, localX, localY) {
    const svg = findParentOfTag(element, 'svg');
    // Create a point in local coordinates
    const pt = svg.createSVGPoint();
    pt.x = localX;
    pt.y = localY;
    // Get the consolidated transformation matrix for the element
    const ctm = element.getScreenCTM();
    if (!ctm)
        return new DOMPoint(NaN, NaN);
    // Transform the point into the element's local coordinate system
    const client = pt.matrixTransform(ctm);
    return new DOMPoint(client.x, client.y);
}
/**
 * Start a drag action on the moveable element at this pointer
 * @param evt A pointer down event
 */
function startSvgDrag(evt) {
    if (evt.pointerType != 'mouse') {
        evt.preventDefault();
    }
    if (_svgDragInfo) {
        cancelSvgDrag();
    }
    let mover = firstSvgMoveable(evt.clientX, evt.clientY);
    if (!mover) {
        return;
    }
    let relPoint = clientToLocalPoint(mover, evt.clientX, evt.clientY);
    let matrix = matrixFromElement(mover);
    let translation = new DOMPoint(matrix.e, matrix.f);
    let handle = null;
    let bounds = mover.getBoundingClientRect();
    let hDist = NaN;
    const handles = mover.getElementsByClassName('drag-handle');
    for (let i = 0; i < handles.length; i++) {
        const h = handles[i];
        const hrc = h.getBoundingClientRect();
        const dist = Math.hypot(hrc.left + hrc.width / 2 - evt.clientX, hrc.top + hrc.height / 2 - evt.clientY);
        if (handle == null || dist < hDist) {
            handle = h;
            hDist = dist;
            bounds = hrc;
            // relPoint = clientToLocalPoint(mover, hrc.left + hrc.width / 2, hrc.top + hrc.height / 2);
        }
    }
    // Before walking up the parent chain, see if the selected handle has a preferred target, which might be different
    let hover = firstSvgDropTarget(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    let target = findParentOfClass(mover, 'drop-target')
        || findParentOfClass(mover, 'drag-source');
    if (!target) {
        console.error('Found a moveable ${mover.id} that is not in a drag-source or drop-target parent');
        return; // not a drag-source or drop-target
    }
    _svgDragInfo = {
        id: mover.id,
        mover: mover,
        handle: handle || mover,
        bounds: bounds,
        parent: target,
        hover: hover || target,
        client: new DOMPoint(evt.clientX, evt.clientY),
        offset: relPoint,
        translation: translation,
        click: true, // this might just be a click, not a drag
    };
    toggleClass(mover, 'dragging', true);
    toggleClass(mover, 'selected', true);
    // not yet droppable
}
/**
 * Continue a drag operation, while the mouse is still down.
 * @param evt A pointer move event
 */
function midSvgDrag(evt) {
    if (_svgDragInfo) {
        if (evt.pointerType != 'mouse') {
            evt.preventDefault();
        }
        var info = calcSvgDropInfo(evt.clientX, evt.clientY);
        if (_svgDragInfo.click && info && info.drag) {
            // We have dragged far enough to be a drag, not just a click
            _svgDragInfo.click = false;
            toggleClass(_svgDragInfo.mover, 'droppable', true);
        }
        if (info && info.target && info.target != _svgDragInfo.hover) {
            // We're hovering over a different target, so update the hover
            if (_svgDragInfo.hover) {
                toggleClass(_svgDragInfo.hover, 'hover', false);
            }
            _svgDragInfo.hover = info.target;
            toggleClass(_svgDragInfo.hover, 'hover', true);
            reparentSvgDrag(info.target);
        }
        // Add a translation to the mover, so that it's offset (where we clicked)
        // lands at the current pointer position, accounting for new transforms.
        let local = clientToLocalPoint(_svgDragInfo.mover.parentNode, evt.clientX, evt.clientY);
        local.x -= _svgDragInfo.offset.x;
        local.y -= _svgDragInfo.offset.y;
        _svgDragInfo.mover.style.transform = 'translate(' + local.x + 'px,' + local.y + 'px)';
        // TODO: consider checking for collisions with other moveables
    }
}
/**
 * Find the top-most moveable candidate from a given client coordinate
 * @param clientX pointer event X
 * @param clientY pointer event Y
 * @returns A moveable element, or a child of one, or else null
 */
function firstSvgMoveable(clientX, clientY) {
    const elements = document.elementsFromPoint(clientX, clientY);
    for (let i = 0; i < elements.length; i++) {
        const elem = elements[i];
        const mov = findParentOfClass(elem, 'moveable');
        if (mov != null) {
            return mov;
        }
    }
    return null;
}
/**
 * Find the top-most drop candidate from a given client coordinate
 * @param clientX pointer event X
 * @param clientY pointer event Y
 * @returns A drop-target or drag-source, or else null
 */
function firstSvgDropTarget(clientX, clientY) {
    const elements = document.elementsFromPoint(clientX, clientY);
    for (let i = 0; i < elements.length; i++) {
        const elem = elements[i];
        if (findParentOfClass(elem, 'moveable')) {
            // Ignore the moveable item, as its parents may be elsewhere on the page
            continue;
        }
        // the target may not actually be one of the elements, but it might be one of their parents
        // IDEA: do a bounding rect, as a check
        let target = findParentOfClass(elem, 'drop-target');
        if (target) {
            return target;
        }
        // drag-sources must match the dragged element or else have no ID at all
        target = findParentOfClass(elem, 'drag-source');
        if (_svgDragInfo && target && (!target.id || (target.id == _svgDragInfo.id + '-source'))) {
            return target;
        }
    }
    return null;
}
/**
 * What would happen if we were to drop here?
 * @param progress The drag info from the start of the drag
 * @param evt The latest pointer event
 * @returns A drop info, or null if not over a drop target
 */
function calcSvgDropInfo(clientX, clientY) {
    if (_svgDragInfo) {
        let target = firstSvgDropTarget(clientX, clientY);
        let handle = _svgDragInfo.handle;
        if (!target) {
            // See if any other handles hit targets?
            const handles = _svgDragInfo.mover.getElementsByClassName('drag-handle');
            for (let i = 0; i < handles.length; i++) {
                handle = handles[i];
                const hrc = handle.getBoundingClientRect();
                const hx = hrc.left + hrc.width / 2;
                const hy = hrc.top + hrc.height / 2;
                target = firstSvgDropTarget(hx, hy);
                if (target != null) {
                    // At least one handle hit one target
                    break;
                }
            }
        }
        let dragging = !_svgDragInfo.click || (target != _svgDragInfo.hover);
        if (!dragging) {
            // We have yet to drag beyond the bounds of the moveable element
            if (clientX < _svgDragInfo.bounds.left || clientX > _svgDragInfo.bounds.right ||
                clientY < _svgDragInfo.bounds.top || clientY > _svgDragInfo.bounds.bottom) {
                // We've dragged outside the bounds
                dragging = true;
            }
        }
        const origin = target == null ? new DOMPoint(NaN, NaN) : localToClientPoint(target, 0, 0);
        return {
            target: target,
            origin: origin,
            handle: handle,
            client: new DOMPoint(clientX, clientY),
            drag: dragging,
        };
    }
    return null;
}
function reparentSvgDrag(target) {
    if (_svgDragInfo && _svgDragInfo.mover.parentNode != target) {
        // The mover is not in the expected parent, so move it
        if (_svgDragInfo.mover.parentNode) {
            _svgDragInfo.mover.parentNode.removeChild(_svgDragInfo.mover);
        }
        target.appendChild(_svgDragInfo.mover); // REVIEW: prepend?
    }
}
/**
 * Attempt to end a drag operation, and drop the element.
 * @param evt The pointer up event
 */
function endSvgDrag(evt) {
    if (_svgDragInfo) {
        if (evt.pointerType != 'mouse') {
            evt.preventDefault();
        }
        // REVIEW: could endSvgDrag be called twice?
        let info = calcSvgDropInfo(evt.clientX, evt.clientY);
        if (_svgDragInfo.click && (!info || !info.drag)) {
            // Never started dragging
            // Do nothing now, but leave element selected
            convertSvgDragToSelection();
            return;
        }
        if (!info || !info.target) {
            cancelSvgDrag();
            return;
        }
        toggleClass(_svgDragInfo.mover, 'dragging', false);
        toggleClass(_svgDragInfo.mover, 'selected', false);
        toggleClass(_svgDragInfo.mover, 'droppable', false);
        // toggleClass(_svgDragInfo.mover, 'collision', false);
        if (_svgDragInfo.hover) {
            toggleClass(_svgDragInfo.hover, 'hover', false);
        }
        reparentSvgDrag(info.target);
        // Add a translation, if needed
        let translate = null;
        if (hasClass(info.target, 'drag-source')) {
            // When returning to the drag source, remove the transform
            _svgDragInfo.mover.style.transform = '';
        }
        else if (hasClass(info.target, 'free-drop')) {
            // Convert the original click offset to the current screen point,
            // but relative to the target origin
            let local = clientToLocalPoint(_svgDragInfo.mover.parentNode, evt.clientX, evt.clientY);
            local.x -= _svgDragInfo.offset.x;
            local.y -= _svgDragInfo.offset.y;
            _svgDragInfo.mover.style.transform = 'translate(' + local.x + 'px,' + local.y + 'px)';
        }
        else {
            // Translate to achieve the offset from the handle to the mover's origin,
            const oH = localToClientPoint(info.handle, 0, 0);
            const oM = localToClientPoint(_svgDragInfo.mover, 0, 0);
            const oT = localToClientPoint(info.target, 0, 0);
            const off = clientToLocalPoint(info.target, oT.x + oM.x - oH.x, oT.y + oM.y - oH.y);
            if (off.x || off.y) {
                _svgDragInfo.mover.style.transform = 'translate(' + off.x + 'px,' + off.y + 'px)';
            }
            else {
                _svgDragInfo.mover.style.transform = '';
            }
        }
        _svgDragInfo = null;
    }
}
/**
 * Abort the current drag operation, and reset the state.
 */
function cancelSvgDrag() {
    if (_svgDragInfo) {
        toggleClass(_svgDragInfo.mover, 'dragging', false);
        toggleClass(_svgDragInfo.mover, 'selected', false);
        toggleClass(_svgDragInfo.mover, 'droppable', false);
        // toggleClass(_svgDragInfo.mover, 'collision', false);
        if (_svgDragInfo.hover) {
            toggleClass(_svgDragInfo.hover, 'hover', false);
        }
        reparentSvgDrag(_svgDragInfo.parent);
        // Revert to original translation
        if (_svgDragInfo.translation.x || _svgDragInfo.translation.y) {
            _svgDragInfo.mover.style.transform = 'translate(' + _svgDragInfo.translation.x + 'px,' + _svgDragInfo.translation.y + 'px)';
        }
        else {
            _svgDragInfo.mover.style.transform = '';
        }
        _svgDragInfo = null;
    }
}
function convertSvgDragToSelection() {
    if (_svgDragInfo) {
        _svgSelectInfo = _svgDragInfo;
        cancelSvgDrag();
        toggleClass(_svgSelectInfo.mover, 'selected', true);
    }
}
function convertSvgSelectionToDrag() {
    if (_svgSelectInfo) {
        _svgDragInfo = _svgSelectInfo;
        _svgSelectInfo = null;
    }
}
/**
 * Implement a 2-click drag equiavlent.
 * The first click is on a moveable element.
 * The second is on a drop target.
 * @param evt
 */
function clickSvgDragCanvas(evt) {
    if (_svgSelectInfo) {
        convertSvgSelectionToDrag();
        var info = calcSvgDropInfo(evt.clientX, evt.clientY);
        if (!info) {
            cancelSvgDrag();
        }
        else {
            midSvgDrag(evt);
            endSvgDrag(evt);
            return;
        }
    }
    const mover = firstSvgMoveable(evt.clientX, evt.clientY);
    if (mover) {
        // Start the drag operation
        startSvgDrag(evt);
    }
}
/**
 * Initialize a stampSet object with nulls
 * @param container The container may already be known
 * @returns A new, blank object
 */
function makeStampSet(container) {
    const ss = {
        name: '',
        container: container || null,
        palette: null,
        stampTools: [],
        selectedTool: null,
        firstTool: null,
        eraseTool: null,
        extractorTool: null,
        canDrag: false,
        prevStampablePointer: null,
        dragDrawTool: null,
        lastDrawTool: null,
        usesMods: false,
    };
    return ss;
}
/**
 * Look up a stamp set by name
 */
const _stampSets = {};
/**
 * Scan the page for anything marked stampable or a draw tool
 */
function preprocessStampObjects() {
    const containers = document.getElementsByClassName('stampable-container');
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        container.addEventListener('pointerdown', pointerDownInContainer);
        const setInfo = makeStampSet(container);
        // TODO: Deprecate rules
        preprocessStampRules(container, setInfo);
        if (hasClass(container, 'stamp-drag')) {
            setInfo.canDrag = true;
            container.addEventListener('pointerup', pointerUpInContainer);
            container.addEventListener('pointermove', pointerMoveInContainer);
            container.addEventListener('pointerleave', pointerLeaveContainer);
        }
        else {
            setInfo.canDrag = false;
        }
        // If a page has multiple containers, they must be named
        setInfo.name = container.getAttributeNS('', 'data-stamp-set') || '';
        if (setInfo.name in _stampSets) {
            throw new ContextError('Different stampable-containers must have unique names: ' + setInfo.name, elementSourceOffset(container, 'data-stamp-set'));
        }
        _stampSets[setInfo.name] = setInfo;
    }
    let elems = document.getElementsByClassName('stampable');
    if (containers.length == 0 && elems.length > 0) {
        _stampSets[''] = makeStampSet();
        const container = document.getElementById('pageBody');
        if (container) {
            container.addEventListener('pointerdown', pointerDownInContainer);
        }
    }
    const palettes = getElementsByClassOrId('stampPalette', 'stampPalette');
    for (let p = 0; p < palettes.length; p++) {
        const palette = palettes[p];
        const setName = palette.getAttributeNS('', 'data-stamp-set') || '';
        if (!(setName in _stampSets)) {
            // A palette can be known before the container, if the container is built dynamically
            _stampSets[setName] = makeStampSet();
        }
        const setInfo = _stampSets[setName];
        elems = palette.getElementsByClassName('stampTool');
        for (let i = 0; i < elems.length; i++) {
            const elmt = elems[i];
            setInfo.stampTools.push(elmt);
            elmt.onclick = function (e) { onSelectStampTool(e); };
            if (getOptionalStyle(elmt, 'data-click-modifier')) {
                setInfo.usesMods = true;
            }
        }
        // Extractor tool can overlap with other tools
        let id = palette.getAttributeNS('', 'data-tool-extractor');
        if (id != null) {
            setInfo.extractorTool = document.getElementById(id);
            // If we're extracting, an optional extracted-id could be set on either the tool/palette or the container
            setInfo.extractedId = getOptionalStyle(setInfo.extractorTool, 'data-extracted-id', undefined, 'extracted-')
                || getOptionalStyle(setInfo.container, 'data-extracted-id', undefined, 'extracted-')
                || 'extracted';
        }
        // Two kinds of erase tools. Explicit and implicit.
        id = palette.getAttributeNS('', 'data-tool-erase');
        if (id != null) {
            // Explicit: one of the stampTools is the eraser.
            setInfo.eraseTool = id != null ? document.getElementById(id) : null;
        }
        else {
            const unstyle = palette.getAttributeNS('', 'data-unstyle');
            const restyle = palette.getAttributeNS('', 'data-style');
            if (unstyle || restyle) {
                // Implicit: the palette itself knows how to erase
                setInfo.eraseTool = document.createElement('span');
                // Don't need to actually add this element to the page. It's just a placeholder.
                if (unstyle) {
                    setInfo.eraseTool.setAttributeNS('', 'data-unstyle', unstyle);
                }
                if (restyle) {
                    setInfo.eraseTool.setAttributeNS('', 'data-style', restyle);
                }
            }
        }
        id = palette.getAttributeNS('', 'data-tool-first');
        setInfo.firstTool = id != null ? document.getElementById(id) : null;
        if (!setInfo.firstTool) {
            setInfo.firstTool = setInfo.stampTools[0];
        }
    }
}
exports.preprocessStampObjects = preprocessStampObjects;
function preprocessStampRules(container, setInfo) {
    const rules = getOptionalStyle(container, 'data-stampable-rules');
    if (rules) {
        const list = rules.split(' ');
        for (let r = 0; r < list.length; r++) {
            const rule = list[r];
            if (rule[0] == '.') {
                const children = container.getElementsByClassName(rule.substring(1));
                for (let i = 0; i < children.length; i++) {
                    toggleClass(children[i], 'stampable', true);
                }
            }
            else if (rule[0] == '#') {
                const child = document.getElementById(rule.substring(1));
                toggleClass(child, 'stampable', true);
            }
            else {
                const children = container.getElementsByTagName(rule.toLowerCase());
                for (let i = 0; i < children.length; i++) {
                    toggleClass(children[i], 'stampable', true);
                }
            }
        }
    }
}
/**
 * Find the stamp set that should be associated with clicks on either
 * stampable or stampTool elements.
 * @param event A mouse event.
 * @returns A stamp set
 */
function stampSetFromEvent(event) {
    return stampSetFromElement(event.target);
}
/**
 * Find the stamp set that should be associated with either
 * stampable or stampTool elements. When in doubt, return the
 * default stamp set ('')
 * @param elmt An element
 * @returns A stamp set
 */
function stampSetFromElement(elmt) {
    const name = getOptionalStyle(elmt, 'data-stamp-set') || '';
    if (!(name in _stampSets)) {
        throw Error('Cannot find stamp set matching target: ' + elmt);
    }
    return _stampSets[name];
}
function pointerDownInContainer(event) {
    if (!isPrimaryButton(event)) {
        return;
    }
    const stampSet = stampSetFromEvent(event);
    if (!stampSet.usesMods && (event.ctrlKey || event.shiftKey || event.altKey)) {
        return;
    }
    if (event.pointerType != 'mouse' && stampSet.canDrag) {
        event.preventDefault();
    }
    const elmt = findStampableAtPointer(event);
    if (elmt) {
        stampSet.prevStampablePointer = elmt;
        onClickStamp(stampSet, event, elmt);
    }
}
function pointerUpInContainer(event) {
    if (!isPrimaryButton(event)) {
        return;
    }
    const stampSet = stampSetFromEvent(event);
    if (!stampSet.usesMods && (event.ctrlKey || event.shiftKey || event.altKey)) {
        return;
    }
    if (event.pointerType != 'mouse' && stampSet.canDrag) {
        event.preventDefault();
    }
    stampSet.prevStampablePointer = null;
}
function pointerMoveInContainer(event) {
    if (!isPrimaryButton(event)) {
        return;
    }
    const stampSet = stampSetFromEvent(event);
    if (event.pointerType != 'mouse' && stampSet.canDrag) {
        event.preventDefault();
    }
    const elmt = findStampableAtPointer(event);
    if (elmt !== stampSet.prevStampablePointer) {
        if (stampSet.prevStampablePointer) {
            preMoveStamp(stampSet, event, stampSet.prevStampablePointer);
        }
        if (elmt) {
            onMoveStamp(stampSet, event, elmt);
        }
        stampSet.prevStampablePointer = elmt;
    }
}
function pointerLeaveContainer(event) {
    if (!isPrimaryButton(event)) {
        return;
    }
    const stampSet = stampSetFromEvent(event);
    if (event.pointerType != 'mouse' && stampSet.canDrag) {
        event.preventDefault();
    }
    if (stampSet.prevStampablePointer) {
        preMoveStamp(stampSet, event, stampSet.prevStampablePointer);
    }
    stampSet.prevStampablePointer = null;
}
function findStampableAtPointer(event) {
    // Prefer finding via direct hit, by z-order
    const targets = document.elementsFromPoint(event.clientX, event.clientY);
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (hasClass(target, 'stampable')) {
            return target;
        }
    }
    // As a fallback, use bounding rect
    const stampable = document.getElementsByClassName('stampable');
    let best = null;
    let bestDist = NaN;
    for (let i = 0; i < stampable.length; i++) {
        const elmt = stampable[i];
        const rect = elmt.getBoundingClientRect();
        if (rect.left <= event.clientX && rect.right > event.clientX
            && rect.top <= event.clientY && rect.bottom > event.clientY) {
            if (isTag(elmt, 'path') && pointInPath(elmt, event)) {
                return elmt;
            }
            const dx = (rect.left + rect.width / 2) - event.clientX;
            const dy = (rect.top + rect.height / 2) - event.clientY;
            const dist = dx * dx + dy * dy;
            if (best == null || dist < bestDist) {
                best = elmt;
                bestDist = dist;
            }
        }
    }
    if (best) {
        return best;
    }
    // The stampable elements themselves can be size 0, due to absolute positioning.
    // So look for a child.
    if (event.target) {
        const parent = findParentOfClass(event.target, 'stampable');
        if (parent) {
            return parent;
        }
    }
    return null;
}
function pointInPath(elmt, event) {
    const pathElmt = elmt;
    const pathD = pathElmt.getAttribute("d");
    if (!pathD) {
        return false;
    }
    const svg = findParentOfTag(elmt, 'svg');
    const bbox = svg.getBoundingClientRect();
    // Create a canvas matching the SVG size
    const canvas = document.createElement("canvas");
    canvas.width = bbox.width;
    canvas.height = bbox.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return false;
    }
    // Convert SVG path to canvas path
    const path = new Path2D(pathD);
    // Adjust mouse coordinates relative to SVG
    const x = event.clientX - bbox.left;
    const y = event.clientY - bbox.top;
    var test = ctx.isPointInPath(path, x, y);
    return test;
}
/**
 * Called when a draw tool is selected from the palette
 * @param event The click event
 */
function onSelectStampTool(event) {
    const tool = findParentOfClass(event.target, 'stampTool');
    const stampSet = stampSetFromEvent(event);
    const prevToolId = getCurrentStampToolId(stampSet);
    if (tool != null) {
        for (let i = 0; i < stampSet.stampTools.length; i++) {
            toggleClass(stampSet.stampTools[i], 'selected', false);
        }
        if (tool != stampSet.selectedTool) {
            toggleClass(tool, 'selected', true);
            stampSet.selectedTool = tool;
        }
        else {
            stampSet.selectedTool = null;
        }
    }
    const fn = theBoiler().onStampChange;
    if (fn) {
        fn(getCurrentStampToolId(stampSet), prevToolId);
    }
}
/**
 * If the user has any shift key pressed, that trumps all other modes.
 * Else if we have a special erase override, use that.
 * Else if the user selected a drawing tool, then use that.
 * Else use the first tool (presumed default).
 * @param event The click event
 * @param toolFromErase An override because we're erasing/rotating
 * @returns the name of a draw tool
 */
function getStampTool(stampSet, event, toolFromErase) {
    // Shift keys always win
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (let i = 0; i < stampSet.stampTools.length; i++) {
            const mods = stampSet.stampTools[i].getAttributeNS('', 'data-click-modifier');
            if (mods != null
                && event.shiftKey == (mods.indexOf('shift') >= 0)
                && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                && event.altKey == (mods.indexOf('alt') >= 0)) {
                return stampSet.stampTools[i];
            }
        }
    }
    // toolFromErase is set by how the stamping began.
    // If it begins on a pre-stamped cell, shift to the next stamp.
    // After the first click, subsequent dragging keeps the same tool.
    if (toolFromErase != null) {
        return toolFromErase;
    }
    // Lacking other inputs, use the selected tool.
    if (stampSet.selectedTool != null) {
        return stampSet.selectedTool;
    }
    // If no selection, the first tool is the default
    return stampSet.firstTool;
}
/**
 * A stamp is referenced by the object it was stamped upon.
 * Look up the original stampTool element.
 * @param id The stamp ID
 * @returns An HTMLElement, unless the stamping is malformed.
 */
function getStampToolById(id) {
    return id ? document.getElementById(id) : null;
}
/**
 * Given one tool, currently applied to a target, what is the next stamp in rotation?
 * @package stampSet The set we're part of
 * @param tool The current tool's HTMLElement, or null if none.
 * @returns The next tool's HTMLElement, or else the _firstTool
 */
function getNextStampTool(stampSet, tool) {
    if (tool) {
        const nextId = tool.getAttributeNS('', 'data-next-stamp-id');
        if (nextId) {
            return document.getElementById(nextId);
        }
        const curIndex = stampSet.stampTools.findIndex((elmt, index) => { return (elmt === tool); });
        // const curIndex = siblingIndexOfClass(stampSet.palette, tool, 'stampTool');
        const nextIndex = (curIndex + 1) % stampSet.stampTools.length;
        return stampSet.stampTools[nextIndex];
    }
    return stampSet.firstTool;
}
/**
 * Expose current stamp tool, in case other features want to react
 * @package stampSet The set we're part of
 * @returns The ID of a stamp tool, or '' if none selected
 */
function getCurrentStampToolId(stampSet) {
    if (stampSet.selectedTool == null) {
        return '';
    }
    var id = stampSet.selectedTool.id;
    return id || '';
}
exports.getCurrentStampToolId = getCurrentStampToolId;
/**
 * A stampable element can be the eventual container of the stamp. (example: TD)
 * Or it can assign another element to be the stamp container, with the data-stamp-parent attribute.
 * If present, that field specifies the ID of an element.
 * @param target An element with class="stampable"
 * @returns
 */
function getStampParent(target) {
    const parentId = getOptionalStyle(target, 'data-stamp-parent');
    if (parentId) {
        return document.getElementById(parentId);
    }
    return target;
}
exports.getStampParent = getStampParent;
/**
 * When drawing on a surface where something is already drawn. The first click
 * always erases the existing drawing.
 * In that case, if the existing drawing was the selected tool, then we are in erase mode.
 * If there is no selected tool, then rotate to the next tool in the palette.
 * Otherwise, return null, to let normal drawing happen.
 * @param target a click event on a stampable object
 * @returns The name of a draw tool (overriding the default), or null
 */
function eraseStamp(stampSet, target) {
    if (target == null) {
        return null;
    }
    const parent = getStampParent(target);
    const cur = findFirstChildOfClass(parent, 'stampedObject');
    let curId;
    if (cur != null) {
        // The target contains a stampedObject, which was injected by a template
        // The tool itself is likely stamped on the parent, but check everywhere
        curId = getOptionalStyle(cur, 'data-stamp-id');
        toggleClass(target, curId, false);
        parent.removeChild(cur);
        parent.removeAttributeNS('', 'data-stamp-id');
        updateStampExtraction(stampSet);
    }
    else if (hasClass(target, 'stampedObject')) {
        // Template is a class on the container itself
        curId = target.getAttributeNS('', 'data-stamp-id');
        toggleClass(target, 'stampedObject', false);
        toggleClass(target, curId, false);
        target.removeAttributeNS('', 'data-stamp-id');
        updateStampExtraction(stampSet);
    }
    else {
        return null; // This cell is currently blank
    }
    if (stampSet.selectedTool && stampSet.selectedTool.id == curId) {
        // When a tool is explicitly selected, clicking on that type toggles it back off
        return stampSet.eraseTool;
    }
    if (stampSet.selectedTool == null) {
        // If no tool is selected, clicking on anything rotates it to the next tool in the cycle
        if (curId) {
            const curTool = getStampToolById(curId);
            const nextTool = getNextStampTool(stampSet, curTool);
            return nextTool;
        }
    }
    // No guidance on what to replace this cell with
    return null;
}
/**
 * Draw on the target surface, using the named tool.
 * @param target The surface on which to draw
 * @param tool The stampTool object that defines a tool
 * A stampTool can then define behavior in several ways...
 *  - data-template-id       id of a template to instantiate
 *  - data-use-template-id   id of a builder template to use, passing arguments
 *  - data-style             apply the named style(s) to the destination
 *  - data-unstyle           remove the named style(s) from the destination
 *  - data-erase             simply delete the existing contents
 * A stampTool can also define the next element in a rotation
 *  - data-next-id           id of another stampTool
 *                           otherwise it will rotate through stampTools in visual order
 */
function doStamp(stampSet, target, tool) {
    stampSet = stampSet || stampSetFromElement(target);
    const parent = getStampParent(target);
    // Template can be null if tool removes drawn objects
    const tmpltId = tool.getAttributeNS('', 'data-template-id');
    const useId = tool.getAttributeNS('', 'data-use-template-id');
    const styles = getOptionalStyle(tool, 'data-style');
    const unstyles = getOptionalStyle(tool, 'data-unstyle');
    const erase = tool.getAttributeNS('', 'data-erase');
    if (tmpltId) {
        let template = document.getElementById(tmpltId);
        if (template === null) {
            throw new Error('Cannot find template "' + tmpltId + '" for stamp ' + tool.id);
        }
        if (template != null) {
            // Inject the template into the stampable container
            const clone = template.content.cloneNode(true);
            parent.appendChild(clone);
        }
        if (tool.id) {
            parent.setAttributeNS('', 'data-stamp-id', tool.id);
        }
    }
    else if (useId) {
        const nodes = useTemplate(tool, useId);
        for (let i = 0; i < nodes.length; i++) {
            parent.appendChild(nodes[i]);
        }
        if (tool.id) {
            parent.setAttributeNS('', 'data-stamp-id', tool.id);
        }
    }
    else if (erase != null) {
        // Do nothing. The caller should already have removed any existing contents
    }
    // Styles can coexist with templates
    if (styles || unstyles) {
        if (tool.id) {
            toggleClass(target, 'stampedObject', true);
            target.setAttributeNS('', 'data-stamp-id', tool.id);
        }
        // Remove styles first. That way, the top-level palette can un-style ALL styles,
        // and they will all get removed, prior to re-adding the desired one.
        // That also makes an erase tool cheap or even free (if you don't want an explicit UI).
        if (unstyles) {
            // Remove one or more styles (delimited by spaces)
            // from the target itself. NOT to some parent stampable object.
            // No parent needed if we're not injecting anything.
            clearAllClasses(target, unstyles);
        }
        if (styles) {
            // Apply one or more styles (delimited by spaces)
            // to the target itself. NOT to some parent stampable object.
            // No parent needed if we're not injecting anything.
            applyAllClasses(target, styles);
        }
    }
    updateStampExtraction(stampSet);
    saveStampingLocally(target);
    const fn = theBoiler().onStamp;
    if (fn) {
        fn(target);
    }
}
exports.doStamp = doStamp;
let _dragDrawTool = null;
let _lastDrawTool = null;
/**
 * Draw where a click happened.
 * Which tool is taken from selected state, click modifiers, and current target state.
 * @param event The mouse click
 */
function onClickStamp(stampSet, event, target) {
    let nextTool = eraseStamp(stampSet, target);
    nextTool = getStampTool(stampSet, event, nextTool);
    if (nextTool) {
        doStamp(stampSet, target, nextTool);
    }
    _lastDrawTool = nextTool;
    _dragDrawTool = null;
}
function isPrimaryButton(event) {
    return event.pointerType != 'mouse' || event.buttons == 1;
}
/**
 * Continue drawing when the mouse is dragged, using the same tool as in the cell we just left.
 * @param event The mouse enter event
 */
function onMoveStamp(stampSet, event, target) {
    if (_dragDrawTool != null) {
        eraseStamp(stampSet, target);
        doStamp(stampSet, target, _dragDrawTool);
        _dragDrawTool = null;
    }
}
/**
 * When dragging a drawing around, copy each cell's drawing to the next one.
 * As the mouse leaves one surface, note which tool is used there.
 * If dragging unrelated to drawing, flag the coming onMoveStamp to do nothing.
 * @param event The mouse leave event
 */
function preMoveStamp(stampSet, event, target) {
    if (target != null) {
        const cur = findFirstChildOfClass(target, 'stampedObject');
        if (cur != null) {
            const stampId = getOptionalStyle(cur, 'data-stamp-id');
            _dragDrawTool = stampId ? document.getElementById(stampId) : null;
        }
        else {
            _dragDrawTool = _lastDrawTool;
        }
    }
    else {
        _dragDrawTool = null;
    }
}
/**
 * Drawing tools can be flagged to do extraction.
 */
function updateStampExtraction(stampSet) {
    if (!stampSet.extractorTool) {
        return;
    }
    const extracted = document.getElementById(stampSet.extractedId || 'extracted');
    if (extracted != null) {
        const stampable = stampSet.container
            ? stampSet.container.getElementsByClassName('stampable')
            : document.getElementsByClassName('stampable');
        let extraction = '';
        for (let i = 0; i < stampable.length; i++) {
            const stamp = stampable[i];
            const tool = getOptionalStyle(stamp, 'data-stamp-id');
            if (tool == stampSet.extractorTool.id) {
                const extract = findFirstChildOfClass(stamp, 'extract');
                if (extract) {
                    extraction += extract.innerText;
                }
            }
        }
        if (extracted.tagName != 'INPUT') {
            extracted.innerText = extraction;
        }
        else {
            let inp = extracted;
            inp.value = extraction;
        }
    }
}
/*-----------------------------------------------------------
 * _straightEdge.ts
 *-----------------------------------------------------------*/
/**
 * Find the center of an element, in client coordinates
 * @param elmt Any element
 * @returns A position
 */
function positionFromCenter(elmt) {
    const rect = elmt.getBoundingClientRect();
    return new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
}
exports.positionFromCenter = positionFromCenter;
/**
 * Find the square of the distance between a point and the mouse
 * @param elmt A position, in screen coordinates
 * @param evt A mouse event
 * @returns The distance, squared
 */
function distance2Mouse(pos, evt) {
    const dx = pos.x - evt.x;
    const dy = pos.y - evt.y;
    return dx * dx + dy * dy;
}
exports.distance2Mouse = distance2Mouse;
function distance2(pos, pos2) {
    const dx = pos.x - pos2.x;
    const dy = pos.y - pos2.y;
    return dx * dx + dy * dy;
}
exports.distance2 = distance2;
// VOCABULARY
// vertex: any point that can anchor a straight edge
// straight-edge-area: the potential drag range
// ruler-path: a drawn line connecting one or more vertices.
// 
// Ruler ranges can have styles and rules.
// Styles shape the straight edge, which can also be an outline
// Rules dictate drop restrictions and the snap range
/**
 * Scan the page for anything marked vertex or straight-edge-area
 * Those items get click handlers
 * @param areaCls the class name of the root SVG for drawing straight edges
 */
function preprocessRulerFunctions(mode, fill) {
    selector_class = mode;
    area_class = mode + '-area';
    selector_fill_class = fill ? (selector_class + '-fill') : null;
    let elems = document.getElementsByClassName(area_class);
    for (let i = 0; i < elems.length; i++) {
        preprocessRulerRange(elems[i]);
        if (fill) {
            ensureFillContiainer(elems[i], mode);
        }
    }
    indexAllVertices();
    // TODO: make lines editable
}
exports.preprocessRulerFunctions = preprocessRulerFunctions;
/**
 * When an edge area has a dedicated (mode)-container class,
 * make sure it also has (mode)-fill-container class and (mode)-build-container
 * elements immediately after.
 * @param area The top-level SVG: class="(mode)-area"
 * @param mode The mode name
 */
function ensureFillContiainer(area, mode) {
    const containers = area.getElementsByClassName(mode + '-container');
    if (containers && containers.length > 0) {
        let fContainers = area.getElementsByClassName(mode + '-fill-container');
        if (!fContainers || fContainers.length == 0) {
            // If a fill container wasn't provided, create one.
            // It solves a z-order glitch that can occur.
            const container = containers[0];
            const fContainer = container.cloneNode(true);
            toggleClass(fContainer, mode + '-container', false);
            toggleClass(fContainer, mode + '-fill-container', true);
            container.insertAdjacentElement('afterend', fContainer);
            fContainers = area.getElementsByClassName(mode + '-fill-container');
        }
        let bContainers = area.getElementsByClassName(mode + '-build-container');
        if (!bContainers || bContainers.length == 0) {
            // If a build container wasn't provided, create one, after the fill container.
            const container = fContainers[0];
            const bContainer = container.cloneNode(true);
            toggleClass(bContainer, mode + '-fill-container', false);
            toggleClass(bContainer, mode + '-build-container', true);
            container.insertAdjacentElement('afterend', bContainer);
        }
    }
}
/**
 * Identified which type of selector is enabled for this page
 * @returns either 'straight-edge' or 'word-select'
 */
function getStraightEdgeType() {
    return selector_class;
}
exports.getStraightEdgeType = getStraightEdgeType;
/**
 * Hook up the necessary mouse events to each moveable item
 * @param elem a moveable element
 */
function preprocessEndpoint(elem) {
}
/**
 * Hook up the necessary mouse events to the background region for a ruler
 * @param elem a moveable element
 */
function preprocessRulerRange(elem) {
    elem.onpointermove = function (e) { onRulerHover(e); };
    elem.onpointerdown = function (e) { onLineStart(e); };
    elem.onpointerup = function (e) { onLineUp(e); };
    elem.onclick = function (e) { onClickInArea(e); };
}
/**
 * Supported kinds of straight edges.
 */
exports.EdgeTypes = {
    straightEdge: 'straight-edge',
    wordSelect: 'word-select',
    hashiBridge: 'hashi-bridge',
};
/**
 * Which class are we looking for: should be one of the EdgeTypes
 */
let selector_class;
/**
 * A second class, which can overlay the first as a fill
 */
let selector_fill_class;
/**
 * What is the class of the container: straight-edge-area or word-select-area
 */
let area_class;
function createPartialRulerData(range) {
    const svg = findParentOfTag(range, 'SVG');
    const containers = svg.getElementsByClassName(selector_class + '-container');
    const container = (containers && containers.length > 0) ? containers[0] : svg;
    const fContainers = svg.getElementsByClassName(selector_class + '-fill-container');
    const fContainer = (fContainers && fContainers.length > 0) ? fContainers[0] : container;
    const bContainers = svg.getElementsByClassName(selector_class + '-build-container');
    const bContainer = (bContainers && bContainers.length > 0) ? bContainers[0] : fContainer;
    const bounds = svg.getBoundingClientRect();
    const max_points = range.getAttributeNS('', 'data-max-points');
    const maxPoints = max_points ? parseInt(max_points) : 2;
    const defaultShare = selector_class == exports.EdgeTypes.hashiBridge ? 'true' : 'false';
    const canShareVertices = range.getAttributeNS('', 'data-can-share-vertices') || defaultShare;
    const defaultCross = selector_class == exports.EdgeTypes.hashiBridge ? 'false' : 'true';
    const canCrossSelf = range.getAttributeNS('', 'data-can-cross-self') || defaultCross;
    const maxBridges = range.getAttributeNS('', 'data-max-bridges');
    const bridgeGap = range.getAttributeNS('', 'data-bridge-gap');
    const hoverRange = range.getAttributeNS('', 'data-hover-range');
    const defaultAngleConstraint = selector_class == exports.EdgeTypes.straightEdge ? undefined
        : selector_class == exports.EdgeTypes.wordSelect ? '45' : '90';
    const angleConstraints = range.getAttributeNS('', 'data-angle-constraints') || defaultAngleConstraint;
    const defaultTurnConstraint = selector_class == exports.EdgeTypes.straightEdge ? undefined
        : selector_class == exports.EdgeTypes.wordSelect ? '0,45,90' : '0,90';
    const turnConstraints = range.getAttributeNS('', 'data-turn-constraints') || defaultTurnConstraint;
    const showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    const angleConstraints2 = angleConstraints ? (angleConstraints + '+0').split('+').map(c => parseInt(c)) : undefined;
    const turnConstraints2 = turnConstraints ? (turnConstraints).split(',').map(c => parseInt(c)) : undefined;
    const data = {
        svg: svg,
        container: container,
        fillContainer: fContainer,
        buildContainer: bContainer,
        bounds: bounds,
        maxPoints: maxPoints <= 0 ? 10000 : maxPoints,
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        canCrossSelf: canCrossSelf ? (canCrossSelf.toLowerCase() == 'true') : false,
        maxBridges: maxBridges ? parseInt(maxBridges) : selector_class == exports.EdgeTypes.hashiBridge ? 2 : 1,
        bridgeGap: bridgeGap ? parseInt(bridgeGap) : 8,
        hoverRange: hoverRange ? parseInt(hoverRange) : ((showOpenDrag != 'false') ? 30 : Math.max(bounds.width, bounds.height)),
        angleConstraints: angleConstraints2 ? angleConstraints2[0] : undefined,
        angleConstraintsOffset: angleConstraints2 ? angleConstraints2[1] : 0,
        turnConstraints: turnConstraints2,
        showOpenDrag: showOpenDrag ? (showOpenDrag.toLowerCase() != 'false') : true,
        evtPos: new DOMPoint(NaN, NaN),
        evtPoint: svg.createSVGPoint(), // stub 
    };
    return data;
}
/**
 * Looks up the containing area, and any optional settings
 * @param evt A mouse event within the area
 * @returns A RulerEventData
 */
function getRulerData(evt) {
    const range = findParentOfClass(evt.target, area_class);
    const data = createPartialRulerData(range);
    data.evtPos = new DOMPoint(evt.x, evt.y);
    data.evtPoint = data.svg.createSVGPoint();
    data.evtPoint.x = data.evtPos.x - data.bounds.left;
    data.evtPoint.y = data.evtPos.y - data.bounds.top;
    let near = findNearestVertex(data);
    if (near) {
        data.nearest = getVertexData(data, near);
    }
    return data;
}
/**
 * Get ruler data as if a user had clicked on a specific vertex
 * @param vertex Any vertex element
 * @returns a RulerEventData
 */
function getRulerDataFromVertex(vertex) {
    const range = findParentOfClass(vertex, area_class);
    const data = createPartialRulerData(range);
    const vBounds = vertex.getBoundingClientRect();
    data.evtPos = new DOMPoint(vBounds.x + vBounds.width / 2, vBounds.y + vBounds.height / 2);
    data.evtPoint = data.svg.createSVGPoint();
    data.evtPoint.x = data.evtPos.x - data.bounds.left;
    data.evtPoint.y = data.evtPos.y - data.bounds.top;
    let near = findNearestVertex(data);
    if (near) {
        data.nearest = getVertexData(data, near);
    }
    return data;
}
/**
 * Constructs a vertex data from a vertex
 * @param ruler the containing RulerEventData
 * @param vert a vertex
 * @returns a VertexData
 */
function getVertexData(ruler, vert) {
    const data = {
        vertex: vert,
        index: getGlobalIndex(vert, 'vx'),
        group: findParentOfClass(vert, 'vertex-g') || vert,
        centerPos: positionFromCenter(vert),
        centerPoint: ruler.svg.createSVGPoint()
    };
    data.centerPoint.x = data.centerPos.x - ruler.bounds.left;
    data.centerPoint.y = data.centerPos.y - ruler.bounds.top;
    return data;
}
/**
 * All straight edges on the page, except for the one under construction
 */
let _straightEdges = [];
/**
 * The nearest vertex, if being affected by hover
 */
let _hoverEndpoint = null;
/**
 * A straight edge under construction
 */
let _straightEdgeBuilder = null;
/**
 * The vertices that are part of the straight edge under construction
 */
let _straightEdgeVertices = [];
/**
 * Handler for both mouse moves and mouse drag
 * @param evt The mouse move event
 */
function onRulerHover(evt) {
    const ruler = getRulerData(evt);
    if (!ruler) {
        return;
    }
    const inLineIndex = ruler.nearest ? indexInLine(ruler.nearest.vertex) : -1;
    if (_straightEdgeBuilder && inLineIndex >= 0) {
        if (inLineIndex == _straightEdgeVertices.length - 2) {
            // Dragging back to the start contracts the line
            _straightEdgeBuilder.points.removeItem(inLineIndex + 1);
            toggleClass(_straightEdgeVertices[inLineIndex + 1], 'building', false);
            _straightEdgeVertices.splice(inLineIndex + 1, 1);
        }
        // Hoving near any other index is ignored
        return;
    }
    if (_straightEdgeBuilder) {
        // Extending a straight-edge that we've already started
        if (ruler.nearest || ruler.showOpenDrag) {
            const extendLast = extendsLastSegment(ruler.nearest);
            const updateOpen = _straightEdgeBuilder.points.length > _straightEdgeVertices.length;
            if (extendLast || _straightEdgeBuilder.points.length >= ruler.maxPoints) {
                if (updateOpen) {
                    _straightEdgeBuilder.points.removeItem(_straightEdgeVertices.length);
                }
                if (extendLast || !updateOpen) {
                    toggleClass(_straightEdgeVertices[ruler.maxPoints - 1], 'building', false);
                    _straightEdgeVertices.splice(_straightEdgeVertices.length - 1, 1);
                    _straightEdgeBuilder.points.removeItem(_straightEdgeVertices.length);
                }
            }
            else if (_straightEdgeVertices.length < _straightEdgeBuilder.points.length) {
                // Always remove the last open end
                _straightEdgeBuilder.points.removeItem(_straightEdgeBuilder.points.length - 1);
            }
        }
        if (_straightEdgeVertices.length < ruler.maxPoints) {
            if (ruler.nearest && isReachable(ruler, ruler.nearest)) {
                // Extend to new point
                snapStraightLineTo(ruler, ruler.nearest);
            }
            else if (ruler.showOpenDrag) {
                openStraightLineTo(ruler);
            }
        }
    }
    else {
        // Hovering near a point
        if (ruler.nearest?.group != _hoverEndpoint) {
            toggleClass(_hoverEndpoint, 'hover', false);
            toggleClass(ruler.nearest?.group, 'hover', true);
            _hoverEndpoint = ruler.nearest?.group || null;
        }
    }
}
/**
 * Starts a drag from the nearest vertex to the mouse
 * @param evt Mouse down event
 */
function onLineStart(evt) {
    const ruler = getRulerData(evt);
    if (!ruler || !ruler.nearest) {
        return;
    }
    if (!ruler.canShareVertices && hasClass(ruler.nearest.vertex, 'has-line')) {
        // User has clicked a point that already has a line
        // Either re-select it or delete it
        const edge = findStraightEdgeFromVertex(ruler, ruler.nearest.index);
        if (edge) {
            const vertices = findStraightEdgeVertices(edge);
            // Always delete the existing edge
            deleteStraightEdge(edge);
            if (vertices.length == 2) {
                // Restart line
                if (vertices[0] == ruler.nearest.vertex) {
                    createStraightLineFrom(ruler, getVertexData(ruler, vertices[1]));
                }
                else {
                    createStraightLineFrom(ruler, getVertexData(ruler, vertices[0]));
                }
                snapStraightLineTo(ruler, ruler.nearest);
            }
            return;
        }
    }
    createStraightLineFrom(ruler, ruler.nearest);
}
/**
 * Ends a straight-edge creation on mouse up
 * @param evt Mouse up event
 */
function onLineUp(evt) {
    const ruler = getRulerData(evt);
    if (!ruler || !_straightEdgeBuilder) {
        return;
    }
    // Clean up classes that track active construction
    const indeces = [];
    for (let i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(_straightEdgeVertices[i], 'building', false);
        toggleClass(_straightEdgeVertices[i], 'has-line', _straightEdgeBuilder != null);
        indeces.push(getGlobalIndex(_straightEdgeVertices[i], 'vx'));
    }
    const vertexList = ',' + indeces.join(',') + ',';
    completeStraightLine(ruler, vertexList);
}
/**
 * Create a new straight-edge, starting at one vertex
 * @param ruler The containing area and rules
 * @param start The first vertex (can equal ruler.nearest, which is otherwise ignored)
 */
function createStraightLineFrom(ruler, start) {
    _straightEdgeVertices = [];
    _straightEdgeVertices.push(start.vertex);
    _straightEdgeBuilder = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    toggleClass(_straightEdgeBuilder, selector_class, true);
    toggleClass(_straightEdgeBuilder, 'building', true);
    toggleClass(start.vertex, 'building', true);
    _straightEdgeBuilder.points.appendItem(start.centerPoint);
    ruler.buildContainer.appendChild(_straightEdgeBuilder);
    toggleClass(_hoverEndpoint, 'hover', false);
    _hoverEndpoint = null;
}
/**
 * Extend a straight-edge being built to a new vertex
 * @param ruler The containing area and rules
 * @param next A new vertex
 */
function snapStraightLineTo(ruler, next) {
    _straightEdgeVertices.push(next.vertex);
    _straightEdgeBuilder?.points.appendItem(next.centerPoint);
    toggleClass(_straightEdgeBuilder, 'open-ended', false);
    toggleClass(next.vertex, 'building', true);
}
/**
 * Extend a straight-edge into open space
 * @param ruler The containing area and rules, including the latest event coordinates
 */
function openStraightLineTo(ruler) {
    toggleClass(_straightEdgeBuilder, 'open-ended', true);
    _straightEdgeBuilder?.points.appendItem(ruler.evtPoint);
}
/**
 * Vertex lists are identifiers, so normalize them to be low-to-high
 * @param vertexList A comma-delimited list of vertex indeces
 * @param edge A Polyline, whose points would also need to be reversed
 * @returns An equivalent list, where the first is always < last
 */
function normalizeVertexList(vertexList, edge) {
    let list = vertexList.split(',').map(v => parseInt(v));
    if (list.length > 2 && list[1] > list[list.length - 2]) {
        // Reverse the point list too
        if (edge) {
            const pts = [];
            for (let i = edge.points.length - 1; i >= 0; i--) {
                pts.push(edge.points[i]);
            }
            edge.points.clear();
            for (let i = 0; i < pts.length; i++) {
                edge.points.appendItem(pts[i]);
            }
        }
        // Reverse the vertex list
        const rev = list.map(n => isNaN(n) ? '' : String(n)).reverse();
        return rev.join(',');
    }
    return vertexList; // unchanged
}
/**
 * Convert the straight line being built to a finished line
 * @param ruler The containing area and rules
 * @param vertexList A string join of all the vertex indeces
 * @param save Determines whether this edge is saved. It should be false when loading from a save.
 */
function completeStraightLine(ruler, vertexList, save = true) {
    if (!_straightEdgeBuilder) {
        return;
    }
    if (_straightEdgeVertices.length < 2) {
        // Incomplete without at least two snapped ends. Abandon
        ruler.buildContainer.removeChild(_straightEdgeBuilder);
        _straightEdgeBuilder = null;
        return;
    }
    else if (_straightEdgeBuilder.points.length > _straightEdgeVertices.length) {
        // Remove open-end
        _straightEdgeBuilder.points.removeItem(_straightEdgeVertices.length);
        toggleClass(_straightEdgeBuilder, 'open-ended', false);
    }
    vertexList = normalizeVertexList(vertexList, _straightEdgeBuilder);
    const dupes = findDuplicateEdges(ruler, 'data-vertices', vertexList, selector_class, []);
    if (dupes.length >= ruler.maxBridges && _straightEdgeBuilder) {
        // Disallow any more duplicates
        ruler.buildContainer.removeChild(_straightEdgeBuilder);
        _straightEdgeBuilder = null;
    }
    if (_straightEdgeBuilder) {
        // Convert to a normal (non-building) bridge
        // Move from build container to regular container (lower z-order)
        ruler.buildContainer.removeChild(_straightEdgeBuilder);
        toggleClass(_straightEdgeBuilder, 'building', false);
        ruler.container.appendChild(_straightEdgeBuilder);
        _straightEdgeBuilder.setAttributeNS('', 'data-vertices', vertexList);
        _straightEdges.push(_straightEdgeBuilder);
        if (selector_fill_class) {
            const fill = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            toggleClass(fill, selector_fill_class, true);
            for (let i = 0; i < _straightEdgeBuilder.points.length; i++) {
                fill.points.appendItem(_straightEdgeBuilder.points[i]);
            }
            ruler.fillContainer.appendChild(fill); // will always be after the original
        }
        dupes.push(_straightEdgeBuilder);
        if (dupes.length > 1) {
            // We have duplicates, so spread them apart
            for (let d = 0; d < dupes.length; d++) {
                const offset = dupes.length == 1 ? 0
                    : (dupes.length % 2) == 0 ? (ruler.bridgeGap / 2) * (d * 2 - (dupes.length - 1))
                        : ruler.bridgeGap * (d - Math.floor(dupes.length / 2));
                offsetBridge(ruler, dupes[d], offset);
            }
        }
        if (save) {
            saveStraightEdge(vertexList, true);
        }
    }
    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}
/**
 * Move an edge sideways by some amount by turning a simple segment into a C shape.
 * Alternatively, remove the C shape, and return to the simple segment.
 * @param edge The polyline to modify
 * @param offset The amount to offset, or 0 to remove the C shape
 */
function offsetBridge(ruler, edge, offset) {
    if (edge.points.length < 2) {
        return;
    }
    const oldPoints = edge.getAttributeNS('', 'points') || '';
    const start = edge.points[0];
    const end = edge.points[edge.points.length - 1];
    const normal = { x: start.y - end.y, y: end.x - start.x };
    const lenNormal = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    normal.x /= lenNormal;
    normal.y /= lenNormal;
    edge.points.clear();
    edge.points.appendItem(start);
    if (offset != 0) {
        const p1 = ruler.svg.createSVGPoint();
        const p2 = ruler.svg.createSVGPoint();
        p1.x = start.x + normal.x * offset;
        p1.y = start.y + normal.y * offset;
        p2.x = end.x + normal.x * offset;
        p2.y = end.y + normal.y * offset;
        edge.points.appendItem(p1);
        edge.points.appendItem(p2);
    }
    edge.points.appendItem(end);
    if (selector_fill_class) {
        const fills = findDuplicateEdges(ruler, 'points', oldPoints, selector_fill_class, []);
        if (fills.length > 0) {
            // Change just 1 to match
            fills[0].setAttributeNS('', 'points', edge.getAttributeNS('', 'points') || '');
        }
    }
}
/**
 * Checks to see if an vertex is already in the current straightline
 * @param end an vertex
 * @returns The index of this element in the straight edge
 */
function indexInLine(end) {
    if (!_straightEdgeVertices || !end) {
        return -1;
    }
    for (let i = 0; i < _straightEdgeVertices.length; i++) {
        if (_straightEdgeVertices[i] == end) {
            return i;
        }
    }
    return -1;
}
/**
 * Does a proposed vertex extend the last segment in the straight-edge under construction?
 * @param vert A new vertex
 * @returns true if this vertex is in the same direction as the last segment, either shorter or longer
 */
function extendsLastSegment(vert) {
    if (!vert || !_straightEdgeBuilder || _straightEdgeVertices.length < 2) {
        return false;
    }
    const last = _straightEdgeBuilder.points[_straightEdgeVertices.length - 1];
    const prev = _straightEdgeBuilder.points[_straightEdgeVertices.length - 2];
    const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
    const err = Math.atan2(vert.centerPoint.y - prev.y, vert.centerPoint.x - prev.x) - angle;
    return Math.abs(err * 180 / Math.PI) < 1;
}
/**
 * Uses a form a dot-product to detect if the sweep from segment AB to AC is counter-clockwise
 * @param a Start of both segments
 * @param b First endpoint
 * @param c Second endpoint
 * @returns true if sweep is to the left (counter-clockwise)
 */
function segmentPointCCW(a, b, c) {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
}
/**
 * A point is on a line if the slope is the same, and the distance
 * is a fraction of the segment's between 0 and 1
 * @param pt Point to test
 * @param a Start of segments
 * @param b End of endpoint
 * @returns true if point lies on the segment between a and b
 */
function pointOnSegment(pt, a, b) {
    if (pt == a || pt == b) {
        return true;
    }
    if (a.x == b.x) {
        return pt.x == a.x && pt.y >= Math.min(a.y, b.y) && pt.y <= Math.max(a.y, b.y);
    }
    if (a.y == b.y) {
        return pt.y == a.y && pt.x >= Math.min(a.x, b.x) && pt.x <= Math.max(a.x, b.x);
    }
    const dxS = b.x - a.x;
    const dyS = b.y - a.y;
    const dxP = pt.x - a.x;
    const dyP = pt.y - a.y;
    const pctX = dxP / dxS;
    const pctY = dyP / dyS;
    return pctX == pctY && pctX > 0 && pctY < 1;
}
/**
 * Sweep algorithm to determine if two segments intersect
 * @param a Start of first segment
 * @param b End of first segment
 * @param c Start of second segment
 * @param d End of second segment
 * @returns true if they intersect along both segments
 */
function segmentsIntersect(a, b, c, d) {
    return (segmentPointCCW(a, c, d) != segmentPointCCW(b, c, d)
        && segmentPointCCW(a, b, c) != segmentPointCCW(a, b, d))
        || (pointOnSegment(c, a, b) || pointOnSegment(d, a, b)
            || pointOnSegment(a, c, d) || pointOnSegment(b, c, d));
}
/**
 * Detect if extending a polyline would cause an intersection with itself
 * @param pt Candidate point to add to polyline
 * @param points Points from a polyline
 * @returns True
 */
function polylineSelfIntersection(pt, points) {
    if (points.length <= 1) {
        return false;
    }
    const p0 = points[points.length - 1];
    for (let i = 1; i < points.length - 1; i++) {
        if (segmentsIntersect(p0, pt, points[i - 1], points[i])) {
            segmentsIntersect(p0, pt, points[i - 1], points[i]);
            return true;
        }
    }
    return false;
}
/**
 * Enforces vertex angle constraints
 * @param data The containing area and rules
 * @param vert A new vertex
 * @returns
 */
function isReachable(data, vert) {
    if (!_straightEdgeBuilder || _straightEdgeVertices.length < 1) {
        return false;
    }
    if (!data.canCrossSelf && polylineSelfIntersection(vert.centerPoint, _straightEdgeBuilder.points)) {
        return false;
    }
    //if (indexInLine(vert.vertex) >= 0) return false;
    const prev = getVertexData(data, _straightEdgeVertices[_straightEdgeVertices.length - 1]);
    const dx = vert.centerPos.x - prev.centerPos.x;
    const dy = vert.centerPos.y - prev.centerPos.y;
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        return false; // Can't re-select the previous point
    }
    else if (data.angleConstraints == undefined) {
        return true; // Any other point is valid
    }
    const degrees = Math.atan2(dy, dx) * 180 / Math.PI + 360;
    let mod = Math.abs((degrees + data.angleConstraintsOffset) % data.angleConstraints);
    if (mod > data.angleConstraints / 2) {
        mod = data.angleConstraints - mod;
    }
    if (mod >= 1) { // Must be within 1 degree of constraint angle pattern
        return false;
    }
    ;
    if (data.turnConstraints !== undefined && _straightEdgeVertices.length >= 2) {
        const prior = getVertexData(data, _straightEdgeVertices[_straightEdgeVertices.length - 2]);
        const dx2 = prev.centerPos.x - prior.centerPos.x;
        const dy2 = prev.centerPos.y - prior.centerPos.y;
        if (Math.abs(dx2) <= 1 && Math.abs(dy2) <= 1) {
            return false; // That would mean previous 2 points are the same
        }
        let turn = Math.abs(Math.atan2(dy2, dx2) * 180 / Math.PI + 360 - degrees);
        turn = Math.min(turn, 360 - turn);
        for (let i = 0; i < data.turnConstraints.length; i++) {
            if (Math.abs(turn - data.turnConstraints[i]) < 1) {
                return true;
            }
        }
        return false;
    }
    return true;
}
/**
 * For various reasons, multiple edges can ocupy the same space. Find them all.
 * @param attr The attribute to check
 * @param points The points attribute
 * @param cls A class name to search through
 * @param dupes A list of elements to append to
 */
function findDuplicateEdges(rules, attr, points, cls, dupes) {
    const list = rules.svg.getElementsByClassName(cls);
    for (let i = 0; i < list.length; i++) {
        const elmt = list[i];
        if (elmt.getAttributeNS('', attr) === points) {
            dupes.push(elmt);
        }
    }
    return dupes;
}
/**
 * Delete an existing straight-edge
 * @param edge The edge to remove
 */
function deleteStraightEdge(edge) {
    const range = findParentOfClass(edge, area_class);
    const data = createPartialRulerData(range);
    for (let i = 0; i < _straightEdges.length; i++) {
        if (_straightEdges[i] === edge) {
            _straightEdges.splice(i, 1);
            break;
        }
    }
    // See if there's a duplicate straight-edge, of class word-select
    let dupes = [];
    const points = edge.getAttributeNS('', 'points');
    if (points) {
        dupes = findDuplicateEdges(data, 'points', points, selector_class, []);
        if (selector_fill_class) {
            dupes = findDuplicateEdges(data, 'points', points, selector_fill_class, dupes);
        }
    }
    let vertexList = '';
    for (let d = 0; d < dupes.length; d++) {
        const dupe = dupes[d];
        if (!vertexList) {
            vertexList = dupe.getAttributeNS('', 'data-vertices') || '';
            if (vertexList) {
                saveStraightEdge(vertexList, false); // Deletes from the saved list
            }
        }
        dupe.parentNode?.removeChild(dupe);
    }
    // See if there were any parallel bridges
    dupes = findDuplicateEdges(data, 'data-vertices', vertexList, selector_class, []);
    if (dupes.length >= 1) {
        // If so, re-layout to show fewer
        for (let d = 0; d < dupes.length; d++) {
            const offset = dupes.length == 1 ? 0
                : (dupes.length % 2) == 0 ? (data.bridgeGap / 2) * (d * 2 - (dupes.length - 1))
                    : data.bridgeGap * (d - Math.floor(dupes.length / 2));
            offsetBridge(data, dupes[d], offset);
        }
    }
}
/**
 * Find the vertex nearest to the mouse event, and within any snap limit
 * @param data The containing area and rules, including mouse event details
 * @returns A vertex data, or null if none close enough
 */
function findNearestVertex(data) {
    let min = data.hoverRange * data.hoverRange;
    const vertices = data.svg.getElementsByClassName('vertex');
    let nearest = null;
    for (let i = 0; i < vertices.length; i++) {
        const end = vertices[i];
        const center = positionFromCenter(end);
        const dist = distance2(center, data.evtPos);
        if (min < 0 || dist < min) {
            min = dist;
            nearest = end;
        }
    }
    return nearest;
}
function distanceToPoint(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
function distanceToLine(edge, pt) {
    const ret = {
        distance: NaN,
        ptOnLine: { x: NaN, y: NaN },
        fractionAlongLine: NaN
    };
    // For our uses, points attribute is always x0 y0 x1 y1
    if (!edge.points || edge.points.length < 2) {
        return ret;
    }
    const p0 = edge.points[0];
    const p1 = edge.points[edge.points.length - 1];
    // Line form: ax + by + c = 0
    const dy = p1.y - p0.y;
    const dx = p1.x - p0.x;
    const line = {
        a: dy,
        b: -dx,
        c: -(dy * p0.x - dx * p0.y)
    };
    const edgeLen = Math.sqrt(dy * dy + dx * dx); // Length of edge
    if (dy == 0) {
        ret.distance = Math.abs(pt.y - p0.y); // Horizontal line
    }
    else if (dx == 0) {
        ret.distance = Math.abs(pt.x - p0.x); // Vertical line
    }
    else {
        ret.distance = Math.abs(line.a * pt.x + line.b * pt.y + line.c) / edgeLen;
    }
    // Normal vector
    const nx = dy / edgeLen;
    const ny = -dx / edgeLen;
    // To find point p2 on the line nearest pt, move ret.distance along the normal
    // However, not sure which direction, so consider either way along normal from pt
    const n1 = { x: pt.x + nx * ret.distance, y: pt.y + ny * ret.distance };
    const n2 = { x: pt.x - nx * ret.distance, y: pt.y - ny * ret.distance };
    // Then take the pt with where ax + by + c is closest to 0
    ret.ptOnLine = Math.abs(line.a * n1.x + line.b * n1.y + line.c) < Math.abs(line.a * n2.x + line.b * n2.y + line.c)
        ? n1 : n2;
    // Calculate where on line, where 0 == p0 and 1 == p1
    ret.fractionAlongLine = line.b != 0
        ? (ret.ptOnLine.x - p0.x) / -line.b
        : (ret.ptOnLine.y - p0.y) / line.a;
    // If fraction is outside [0..1], then distance is to the nearer endpoint
    if (ret.fractionAlongLine < 0) {
        ret.distance = distanceToPoint(pt, p0);
    }
    else if (ret.fractionAlongLine > 1) {
        ret.distance = distanceToPoint(pt, p1);
    }
    return ret;
}
/**
 * Find the vertex nearest to the mouse event, and within any snap limit
 * @param data The containing area and rules, including mouse event details
 * @returns An edge, or null if none is close enough
 */
function findEdgeUnder(data) {
    let min = data.hoverRange;
    const edges = data.svg.getElementsByClassName(selector_class);
    let nearest = null;
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const dtl = distanceToLine(edge, data.evtPoint);
        if (dtl.distance < min && dtl.fractionAlongLine > 0.1 && dtl.fractionAlongLine < 0.9) {
            // We're reasonably near the line segment
            min = dtl.distance;
            nearest = edge;
        }
    }
    return nearest;
}
/**
 * Find the first straight-edge which includes the specified vertex
 * @param index The global index of a vertex
 * @returns A straight edge, or null if none match
 */
function findStraightEdgeFromVertex(ruler, index) {
    const pat = ',' + String(index) + ',';
    const edges = ruler.svg.getElementsByClassName(selector_class);
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const indexList = edge.getAttributeNS('', 'data-vertices');
        if (indexList && indexList.search(pat) >= 0) {
            return edge;
        }
        ;
    }
    return null;
}
/**
 * Given a straight edge, enumerate the vertices that it passes through
 * @param edge A straight-edge
 * @returns An array of zero or more vertices
 */
function findStraightEdgeVertices(edge) {
    const indexList = edge.getAttributeNS('', 'data-vertices');
    const vertices = [];
    const indeces = indexList?.split(',');
    if (indeces) {
        const map = mapGlobalIndeces('vertex', 'vx');
        for (let i = 0; i < indeces.length; i++) {
            if (indeces[i]) {
                const vertex = map[indeces[i]];
                vertices.push(vertex);
            }
        }
    }
    return vertices;
}
/**
 * Create a straight-edge from a list of vertices
 * Called while restoring from a save, so does not redundantly save progress.
 * @param vertexList A joined list of vertex global-indeces, delimeted by commas
 */
function createFromVertexList(vertexList) {
    const map = mapGlobalIndeces('vertex', 'vx');
    const vertices = vertexList.split(',');
    let ruler = null;
    for (let i = 0; i < vertices.length; i++) {
        if (vertices[i].length > 0) {
            const id = parseInt(vertices[i]);
            const vert = map[id];
            if (vert) {
                if (ruler == null) {
                    ruler = getRulerDataFromVertex(vert);
                    createStraightLineFrom(ruler, ruler.nearest);
                }
                else {
                    snapStraightLineTo(ruler, getVertexData(ruler, vert));
                }
                // Both of the above set 'building', but complete does not clear it
                toggleClass(vert, 'building', false);
            }
        }
    }
    if (ruler) {
        completeStraightLine(ruler, vertexList, false /*no save while restoring*/);
    }
}
exports.createFromVertexList = createFromVertexList;
function clearAllStraightEdges(id) {
    const svg = document.getElementById(id);
    if (!svg) {
        return;
    }
    const edges = svg.getElementsByClassName(selector_class);
    for (let i = edges.length - 1; i >= 0; i--) {
        const edge = edges[i];
        edge.parentNode?.removeChild(edge);
    }
    // Remove styles from all vertices
    const vertices = svg.getElementsByClassName('vertex');
    for (let i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(vertices[i], 'building', false);
        toggleClass(vertices[i], 'has-line', false);
    }
    // Remove builder
    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}
exports.clearAllStraightEdges = clearAllStraightEdges;
function onClickInArea(evt) {
    const ruler = getRulerData(evt);
    if (!ruler.nearest) {
        // Don't delete an edge if the user is more likely click on the vertex
        const edge = findEdgeUnder(ruler);
        if (edge) {
            deleteStraightEdge(edge);
        }
    }
}
const defaultRatingDetails = {
    fun: true,
    difficulty: true,
    feedback: true
};
const noEventDetails = {
    'cssRoot': '../Css/',
    'links': []
};
const safariDocsDetails = {
    'title': 'Puzzyl Utility Library',
    'logo': '../Docs/Images/logo.jpg',
    'icon': '../Docs/Images/monster-book-icon.png',
    'iconRoot': '../24/Icons/',
    'cssRoot': '../Css/',
    'fontCss': '../Docs/Css/Fonts.css',
    'googleFonts': 'Caveat Inconsolata',
    'links': [],
    'backLinks': { '': { href: '../Docs/index.xhtml', friendly: 'Documentation' } },
};
const safariAdminDetails = {
    'title': 'Admin Tools',
    'logo': '../DGG/Images/octopus_watermark.png',
    'icon': '../DGG/Images/octopus_icon.png',
    'cssRoot': '../Css/',
    'links': [],
    'backLinks': { '': { href: './Admin.xhtml', friendly: 'Admin' } },
};
const safariSingleDetails = {
    'title': 'Puzzle',
    'logo': './Images/Sample_Logo.png',
    'icon': './Images/Sample_Icon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts.css',
    'googleFonts': 'Caveat',
    'links': [
    //        { rel:'preconnect', href:'https://fonts.googleapis.com' },
    //        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
    ]
};
const safariSampleDetails = {
    'title': 'Puzzle Safari',
    'logo': './Images/Sample_Logo.png',
    'icon': './Images/Sample_Icon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts.css',
    'googleFonts': 'Caveat',
    'links': [],
    'backLinks': { '': { href: './index.html' } },
};
const safari19Details = {
    'title': 'Under Construction',
    'logo': './Images/PS19 sign.png',
    'icon': './Images/PS19 icon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts19.css',
    'googleFonts': 'Overpass,Caveat',
    'links': [],
    // 'qr_folders': {'https://www.puzzyl.net/23/': './Qr/puzzyl/',
    //                'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/'},
    // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
    'backLinks': { 'ps19': { href: './safari.html' } },
};
const safari20Details = {
    'title': 'Safari Labs',
    'logo': './Images/PS20 logo.png',
    'icon': './Images/Beaker_icon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts20.css',
    'googleFonts': 'Architects+Daughter,Caveat',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/23/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/' },
    // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
    'backLinks': { 'gs23': { href: './safari.html' } },
};
const safari21Details = {
    'title': 'Epicurious Enigmas',
    'logo': './Images/PS24_banner.png',
    'icon': './Images/Plate_icon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': '../24/Css/Fonts21.css',
    'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/24/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/' },
    'backLinks': { 'ps21': { href: './Menu.xhtml' } },
    'validation': true,
};
const giving24Details = {
    'title': 'Epicurious Enigmas',
    'logo': './Images/GS24_banner.png',
    'icon': './Images/Plate_icon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': '../24/Css/Fonts21.css',
    'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/24/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/' },
    // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
    'backLinks': { 'gs24': { href: './Menu.xhtml' }, 'ps21': { href: './Menu.xhtml' } },
    'validation': true,
    eventSync: 'GivingSafari24',
};
const giving25Details = {
    'title': 'The Great Outdoors',
    'logo': './Images/GS25_banner.png',
    'icon': './Images/gs25_favicon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': '../gs25/Css/Fonts22.css',
    'googleFonts': 'DM+Serif+Display,National+Park,Caveat',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/gs25/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/gs25/': './Qr/puzzyl/' },
    'backLinks': { 'gs25': { href: './Map25.xhtml' }, 'ps22': { href: './Map22.xhtml' } },
    'validation': true,
    eventSync: 'GivingSafari25',
    ratings: defaultRatingDetails,
};
const safari22Details = {
    'title': 'The Great Outdoors',
    'logo': './Images/PS22_banner.png',
    'icon': './Images/ps22_favicon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': '../gs25/Css/Fonts22.css',
    'googleFonts': 'DM+Serif+Display,National+Park,Caveat',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/gs25/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/gs25/': './Qr/puzzyl/' },
    'backLinks': { 'gs25': { href: './Map25.xhtml' }, 'ps22': { href: './Map22.xhtml' } },
    'validation': true,
    // no eventSync == no login
    ratings: defaultRatingDetails,
};
const ps21Mini = {
    'title': 'Epicurious Enigmas',
    'logo': './Images/GS24_banner.png',
    'icon': './Images/Plate_icon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': '../24/Css/Fonts21.css',
    'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',
    'links': [],
    'backLinks': { '': { href: './MiniMenu.xhtml' } },
    'validation': true,
    eventSync: 'ps21Mini',
};
const safari23Details = {
    'title': 'Bad Idea',
    // 'logo': './23/Images/PS23 logo.png',
    'icon': './Images/Sample_Icon.png',
    'iconRoot': './Icons/',
    'cssRoot': './Css/',
    'fontCss': './Css/Fonts23.css',
    'googleFonts': 'Goblin+One,Caveat',
    'links': [],
    // 'qr_folders': {'https://www.puzzyl.net/23/': './Qr/puzzyl/',
    //    'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/'},
    // 'solverSite': 'https://givingsafari2026.azurewebsites.net/Solver',  // Only during events
    'backLinks': { 'ps23': { href: './ideas.html' }, 'gs26': { href: './safari.html' } },
};
const safari24Details = {
    'title': 'Game Night',
    // 'logo': './Images/PS24 logo.png',
    'icon': './Images/ps24_favicon.png',
    'iconRoot': './Icons/',
    'cssRoot': './Css/',
    'fontCss': './Css/Fonts24.css',
    'googleFonts': 'Goblin+One,Caveat',
    'links': [],
    // 'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
    //    'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
    // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
    'backLinks': { 'ps24': { href: './indexx.html' }, 'gs27': { href: './safari.html' } },
};
const safari25Details = {
    'title': 'Hip To Be Square',
    // 'logo': './Images/PS25_banner.png',
    'icon': './Images/ps25_favicon.png',
    // 'iconRoot': './Icons/',
    'cssRoot': './Css/',
    'fontCss': './Css/Fonts25.css',
    'googleFonts': 'Nova+Square,Caveat',
    'links': [],
    // 'qr_folders': {'https://www.puzzyl.net/ps25/': './Qr/puzzyl/',
    //                'file:///D:/git/GivingSafariTS/ps25/': './Qr/puzzyl/'},
    // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
    // 'backLinks': { 'ps25': { href:'./Menu.xhtml'}},
    'validation': false,
    // eventSync: 'GivingSafari25',
};
const safariDggDetails = {
    'title': 'David’s Puzzles',
    'logo': './Images/octopus_watermark.png',
    'icon': './Images/octopus_icon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts.css',
    'googleFonts': 'Caveat,Righteous,Cormorant+Upright',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/Dgg/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/Dgg/': './Qr/puzzyl/' },
    // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
    'backLinks': { '': { href: './indexx.html' } },
};
// Event for the PuzzylSafariTeam branch
const puzzylSafariTeamDetails = {
    'title': 'Game Night',
    // 'logo': './Images/Sample_Logo.png',
    'icon': '24/favicon.png',
    'iconRoot': './Icons/',
    'cssRoot': 'Css/',
    'fontCss': '24/Fonts24.css',
    'googleFonts': 'Goblin+One,Caveat',
    'links': [
    //        { rel:'preconnect', href:'https://fonts.googleapis.com' },
    //        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
    ]
};
const dnancXmasDetails = {
    'title': 'DNANC X-Mas',
    'icon': './Images/favicon.png',
    'iconRoot': './Icons/',
    'cssRoot': '../Css/',
    'fontCss': '../DnancXmas/Css/Fonts24.css',
    'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/24/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/' },
    'backLinks': { '': { href: './index.xhtml' } },
    'validation': true,
};
const pastSafaris = {
    'Docs': safariDocsDetails,
    'Admin': safariAdminDetails,
    'Sample': safariSampleDetails,
    'Single': safariSingleDetails,
    '20': safari20Details,
    '21': safari21Details,
    'ps19': safari19Details,
    'ps20': safari20Details,
    'ps21': safari21Details,
    'ps22': safari22Details,
    'ps23': safari23Details,
    'ps24': safari24Details,
    'ps25': safari25Details,
    'Dgg': safariDggDetails,
    '24': safari24Details,
    'gs24': giving24Details,
    'gs25': giving25Details,
    'fr21': ps21Mini,
    'ic21': ps21Mini,
    'sb21': ps21Mini,
    'tm21': ps21Mini,
    'team': puzzylSafariTeamDetails,
    'xmas': dnancXmasDetails,
};
const puzzleSafari19 = ['ps19']; //,'gs22'
const givingSafari24 = ['gs24', '21', 'ps21'];
const puzzleSafari22 = ['gs25', 'ps22'];
const puzzleSafari24 = ['ps24']; //,'gs27'
const puzzleSafari25 = ['ps25']; //,'gs28'
const puzzleSafari21Minis = ['ic21', 'sb21', 'tm21', 'fr21'];
const allSafari21 = ['gs24', '21', 'ps21', 'ic21', 'sb21', 'tm21', 'fr21'];
let safariDetails;
/**
* Initialize a global reference to Safari event details.
* Pages can support multiple events, in which case the URL needs to have an arg picking one.
* Finding a match in boiler.safaris takes precedence over boiler.safari, which is the backup.
* If that a urlArg match is found, boiler.safari will be updated, to remove the ambiguity.
*/
function initSafariDetails(boiler) {
    if (boiler?.safaris) {
        for (var i = 0; i < boiler.safaris.length; i++) {
            if (urlArgExists(boiler.safaris[i])) {
                boiler.safari = boiler.safaris[i];
                break;
            }
        }
    }
    if (!boiler?.safari) {
        return safariDetails = noEventDetails;
    }
    if (!(boiler.safari in pastSafaris)) {
        const err = new Error('Unrecognized Safari Event ID: ' + boiler.safari);
        console.error(err);
        return safariDetails = noEventDetails;
    }
    // Mirror final safari name to lookup, as it is often used in link URLs
    if (boiler.lookup) {
        boiler.lookup['_safari'] = boiler.safari;
    }
    safariDetails = pastSafaris[boiler.safari];
    return safariDetails;
}
exports.initSafariDetails = initSafariDetails;
/**
* Return the details of this puzzle event
*/
function getSafariDetails() {
    return safariDetails;
}
exports.getSafariDetails = getSafariDetails;
/**
 * Create a backlink to the puzzle list.
 * Might be subject to prerequisites
 * @returns
 */
function backlinkFromUrl() {
    if (!safariDetails || !safariDetails.backLinks) {
        return undefined;
    }
    // Check if any of the prerequisite triggers are present
    const keys = Object.keys(safariDetails.backLinks);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key && urlArgExists(key)) {
            return createBacklink(safariDetails.backLinks[key]);
        }
    }
    if ('' in safariDetails.backLinks) {
        // Some events don't need a trigger
        return createBacklink(safariDetails.backLinks['']);
    }
    return undefined;
}
exports.backlinkFromUrl = backlinkFromUrl;
/**
 * Create an <a href> to the backlink puzzle list.
 * @param backlink object with an href, and optionally also friendly text
 * @returns An anchor element
 */
function createBacklink(backlink) {
    let a = document.createElement('a');
    a.id = 'backlink';
    const text = backlink['friendly'] || 'Puzzle list';
    a.innerText = text;
    a.href = backlink.href + window.location.search;
    a.target = '_blank';
    return a;
}
/**
 * According to event rules, should we enable local validation
 * @returns
 */
function enableValidation() {
    if (safariDetails.validation === true) {
        return true;
    }
    else if (safariDetails.validation === false || safariDetails.validation === undefined) {
        return false;
    }
    return urlArgExists(safariDetails.validation);
}
exports.enableValidation = enableValidation;
/**
 * Lookup a safari by any of three keys:
 * - event key, as used in URL args
 * - event title
 * - event sync key
 * @param name
 * @returns
 */
function lookupSafari(name) {
    if (name in pastSafaris) {
        return pastSafaris[name];
    }
    var list = Object.values(pastSafaris);
    for (var i = 0; i < list.length; i++) {
        var safari = list[i];
        if (safari.title == name || safari.eventSync == name)
            return safari;
    }
    return null;
}
exports.lookupSafari = lookupSafari;
/*-----------------------------------------------------------
 * _eventSync.ts
 *-----------------------------------------------------------*/
var EventSyncActivity;
(function (EventSyncActivity) {
    EventSyncActivity["Open"] = "Open";
    EventSyncActivity["Edit"] = "Edit";
    EventSyncActivity["Attempt"] = "Attempt";
    EventSyncActivity["Unlock"] = "Unlock";
    EventSyncActivity["Solve"] = "Solve";
})(EventSyncActivity || (exports.EventSyncActivity = EventSyncActivity = {}));
let ActivityRank = {
    "Open": 1,
    "Edit": 2,
    "Attempt": 3,
    "Unlock": 4,
    "Solve": 5,
};
// Support testing against a local Sync server.
// Note: test environment does not define 'window'
const localSync = (typeof window !== 'undefined') ? (window.location.href.substring(0, 5) == 'file:') : true;
let canSyncEvents = false;
let _eventName = undefined;
let _playerName = undefined;
let _teamName = undefined;
let _emojiAvatar = undefined;
let _mostProgress = EventSyncActivity.Open;
function puzzleTitleForSync() {
    return theBoiler().titleSync || theBoiler().title;
}
function setupEventSync(syncKey) {
    canSyncEvents = !!syncKey;
    if (canSyncEvents) {
        _eventName = syncKey;
        document.addEventListener('visibilitychange', function (event) { autoLogin(); });
        var body = document.getElementsByTagName('body')[0];
        body?.addEventListener('focus', function (event) { autoLogin(); });
        // Run immediately
        autoLogin();
    }
}
exports.setupEventSync = setupEventSync;
async function pingEventServer(activity, guess) {
    cacheProgress(activity);
    if (!canSyncEvents || !_playerName) {
        return;
    }
    const data = {
        eventName: _eventName,
        player: _playerName,
        avatar: _emojiAvatar,
        team: _teamName,
        puzzle: puzzleTitleForSync(),
        activity: activity,
        data: guess || ''
    };
    await callSyncApi("PuzzlePing", data);
}
exports.pingEventServer = pingEventServer;
/**
 * Track the highest activity reached on the current puzzle.
 * @param activity
 */
function cacheProgress(activity) {
    let prev = ActivityRank[_mostProgress];
    let next = ActivityRank[activity];
    if (next > prev) {
        _mostProgress = activity;
    }
}
/**
 * Log in to an event
 * @param player The name of the player (required)
 * @param team The player's team name (optional)
 * @param emoji The player's emoji avatar (optional)
 */
function doLogin(player, team, emoji) {
    _playerName = player;
    _teamName = team;
    _emojiAvatar = emoji;
    const info = {
        player: player,
        team: team || '',
        emoji: emoji || '', // IDEA: initials
    };
    cacheLogin(_eventName, info);
    pingEventServer(EventSyncActivity.Open);
    updateLoginUI();
}
/**
 * Clear any cached login info
 * @param isModal If true, helper functions are called on parent. Else, called in local frame.
 * @param deletePlayer If true, tell the server to forget the player. This is async. Else, do nothing async.
 */
async function doLogout(isModal, deletePlayer) {
    if (deletePlayer) {
        const data = {
            eventName: _eventName,
            player: _playerName,
            avatar: _emojiAvatar,
            team: _teamName,
        };
        let callback = undefined;
        try {
            callback = !isModal ? autoLogin
                : 'autoLogin' in parent ? parent['autoLogin']
                    : undefined;
        }
        catch {
            // Will fail when running on local file: protocol
        }
        await callSyncApi("DeletePlayer", data, undefined, callback);
    }
    cacheLogin(_eventName, undefined);
    _playerName = _teamName = _emojiAvatar = undefined;
    updateLoginUI();
}
/**
 * Try to join an existing log-in
 * @param event The current event
 */
function autoLogin() {
    if (!canSyncEvents) {
        return;
    }
    const info = getLogin(_eventName);
    if (info && (_playerName != info.player || _teamName != info?.team)) {
        _playerName = info.player;
        _teamName = info.team || ''; // if missing, player is solo
        _emojiAvatar = info.emoji || '';
        pingEventServer(EventSyncActivity.Open);
    }
    else if (!info || !info.player) {
        _playerName = _teamName = _emojiAvatar = undefined;
    }
    updateLoginUI();
}
/**
 * Ask the user for their username, and optionally team name (via @ suffix)
 * If they provide them, log them in.
 */
function promptLogin(evt) {
    evt.stopPropagation();
    dismissLogin(null);
    let modal = document.getElementById('modal-login');
    let iframe = document.getElementById('modal-iframe');
    if (modal && iframe) {
        iframe.src = `LoginUI.xhtml?iframe&modal&${theBoiler().safari}`;
        toggleClass(modal, 'hidden', false);
    }
    else {
        modal = document.createElement('div');
        const content = document.createElement('div');
        const close = document.createElement('span');
        iframe = document.createElement('iframe');
        modal.id = 'modal-login';
        iframe.id = 'modal-iframe';
        toggleClass(content, 'modal-content', true);
        toggleClass(close, 'modal-close', true);
        close.appendChild(document.createTextNode("×"));
        close.title = 'Close';
        close.onclick = function (e) { dismissLogin(e); };
        iframe.src = `LoginUI.xhtml?iframe&modal&${theBoiler().safari}`;
        content.appendChild(close);
        content.appendChild(iframe);
        modal.appendChild(content);
        document.getElementById('pageBody')?.appendChild(modal); // first child of <body>
        document.getElementById('pageBody')?.addEventListener('click', function (event) { dismissLogin(event); });
    }
}
function dismissLogin(evt) {
    var modal = document.getElementById('modal-login');
    if (modal) {
        if (!hasClass(modal, 'hidden')) {
            toggleClass(modal, 'hidden', true);
            autoLogin();
            refreshTeamHomePage();
        }
    }
    if (evt) {
        evt.stopPropagation();
    }
}
function updateLoginUI() {
    let div = document.getElementById('Login-bar');
    if (!div) {
        div = document.createElement('div');
        div.id = 'Login-bar';
        document.getElementsByTagName('body')[0].appendChild(div);
    }
    let img = document.getElementById('Login-icon');
    if (!img) {
        img = document.createElement('img');
        img.id = 'Login-icon';
        div.appendChild(img);
    }
    let avatar = document.getElementById('Login-avatar');
    if (!avatar) {
        avatar = document.createElement('span');
        avatar.id = 'Login-avatar';
        div.appendChild(avatar);
    }
    let span = document.getElementById('Login-player');
    if (!span) {
        span = document.createElement('span');
        span.id = 'Login-player';
        div.appendChild(span);
    }
    toggleClass(div, 'logged-in', !!_playerName);
    toggleClass(div, 'avatar', !!_emojiAvatar);
    if (_playerName) {
        // Logged in
        if (_emojiAvatar) {
            avatar.innerText = _emojiAvatar;
        }
        else {
            img.src = _teamName ? '../Icons/logged-in-team.png' : '../Icons/logged-in.png';
            avatar.innerHTML = '';
        }
        span.innerText = _teamName ? (_playerName + ' @ ' + _teamName) : _playerName;
        div.onclick = function (e) { promptLogin(e); };
        div.title = "Log out?";
        showRatingUI(true);
    }
    else {
        // Logged out
        img.src = '../Icons/logged-out.png';
        avatar.innerHTML = '';
        span.innerText = "Login?";
        div.onclick = function (e) { promptLogin(e); };
        div.title = "Log in?";
        showRatingUI(false);
    }
}
async function callSyncApi(apiName, data, jsonCallback, textCallback) {
    try {
        var xhr = new XMLHttpRequest();
        var url = (localSync ? "http://localhost:7071/api/"
            : "https://puzzyleventsync.azurewebsites.net/api/")
            + apiName;
        xhr.open("POST", url, true /*async*/);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 /*DONE*/) {
                consoleTrace(xhr.responseText);
                let response = xhr.responseText;
                let isText = true;
                try {
                    var obj = TryParseJson(response, false);
                    isText = false; // it's json
                    if (jsonCallback) {
                        jsonCallback(obj);
                    }
                }
                catch (ex) {
                    // Most likely problem is that xhr.responseText isn't JSON
                    response = xhr.responseText || xhr.statusText;
                    console.error(ex);
                }
                if (isText && textCallback) {
                    textCallback(response);
                }
            }
        };
        var strData = JSON.stringify(data);
        consoleTrace(`Calling ${apiName} with data=${strData}`);
        xhr.send(strData);
    }
    catch (ex) {
        console.error(ex);
    }
}
async function refreshTeamHomePage(callback) {
    if (!canSyncEvents || !_teamName) {
        _teammates = [];
        _teamSolves = {};
        _remoteUnlocked = [];
        if (callback) {
            callback();
        }
        else if (_onTeamHomePageRefresh) {
            _onTeamHomePageRefresh();
        }
        return;
    }
    const data = {
        eventName: _eventName,
        team: _teamName,
        player: _playerName, // not used, but handy for logging
    };
    if (callback) {
        _onTeamHomePageRefresh = callback;
    }
    else {
        callback = _onTeamHomePageRefresh;
    }
    if (_onTeamHomePageRefresh) {
        await callSyncApi('TeamHomePage', data, onRefreshTeamHomePage);
    }
}
exports.refreshTeamHomePage = refreshTeamHomePage;
let _teammates;
let _teamSolves;
let _remoteUnlocked = [];
let _onTeamHomePageRefresh = undefined;
function onRefreshTeamHomePage(json) {
    if (json == null) {
        return;
    }
    var update = false;
    if ('teammates' in json) {
        _teammates = json['teammates'];
        update = true;
    }
    if ('solves' in json) {
        _teamSolves = json['solves'];
        update = true;
    }
    if ('unlocked' in json) {
        _remoteUnlocked = json['unlocked'];
        update = true;
    }
    if (update && _onTeamHomePageRefresh) {
        _onTeamHomePageRefresh();
    }
}
/**
 * Equivalent to window.location.href -minus- window.location.search
 */
function urlSansArgs() {
    return window.location.protocol + "//" + window.location.host + window.location.pathname;
}
exports.urlSansArgs = urlSansArgs;
/**
 * Ping server when a meta feeder has been unlocked.
 * Called directly by the file in question, when it is first loaded.
 * @param metaFeeder "[meta]-[index]"
 * @param url The file's actual window.location.href
 */
async function syncUnlockedFile(metaFeeder, url) {
    if (!canSyncEvents || !_teamName) {
        return;
    }
    const data = {
        eventName: _eventName,
        player: _playerName,
        avatar: _emojiAvatar,
        team: _teamName,
        puzzle: metaFeeder,
        activity: EventSyncActivity.Unlock,
        data: url
    };
    await callSyncApi("PuzzlePing", data);
}
exports.syncUnlockedFile = syncUnlockedFile;
async function sendRating(aspect, val) {
    if (!canSyncEvents) {
        return;
    }
    const data = {
        eventName: _eventName,
        player: _playerName || "",
        avatar: _emojiAvatar || "",
        team: _teamName || "",
        puzzle: puzzleTitleForSync(),
        activity: _mostProgress,
        data: `${aspect}:${val}`
    };
    await callSyncApi("RatePuzzle", data);
}
exports.sendRating = sendRating;
async function sendFeedback(feedback) {
    if (!canSyncEvents) {
        return;
    }
    const data = {
        eventName: _eventName,
        player: _playerName || "",
        avatar: _emojiAvatar || "",
        team: _teamName || "",
        puzzle: puzzleTitleForSync(),
        activity: _mostProgress,
        data: feedback
    };
    await callSyncApi("GiveFeedback", data);
}
exports.sendFeedback = sendFeedback;
/*-----------------------------------------------------------
 * _rating.ts
 *-----------------------------------------------------------*/
/**
 * Create the Rating UI that lives above the top of the page (screen only).
 * @param fun If true, add the "fun" scale.
 * @param difficulty If true, add the "difficulty" scale.
 * @param feedback If true, add a button to provide verbatim feedback.
 */
function createRatingUI(details, margins) {
    const show = shouldShowRatings();
    const div = document.createElement('div');
    div.id = "__puzzle_rating_ui";
    if (!show) {
        div.style.display = 'None';
    }
    div.appendChild(createRatingLabel("Rate this puzzle!"));
    if (details.fun) {
        div.appendChild(createRatingScale('Fun:', 'fun', 'star', 5));
    }
    if (details.difficulty) {
        div.appendChild(createRatingScale('Difficulty:', 'difficulty', 'diff', 5));
    }
    if (details.feedback) {
        div.appendChild(createFeedbackButton());
    }
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(div);
}
exports.createRatingUI = createRatingUI;
function showRatingUI(show) {
    const div = document.getElementById("__puzzle_rating_ui");
    if (div) {
        var isShowing = div.style.display != 'None';
        if (show != isShowing) {
            div.style.display = show ? '' : 'None';
        }
    }
}
exports.showRatingUI = showRatingUI;
function createRatingLabel(text) {
    const span = document.createElement('span');
    toggleClass(span, 'rating-label', true);
    span.textContent = text;
    return span;
}
function createRatingScale(label, scale, img, max) {
    const span = document.createElement('span');
    toggleClass(span, 'rating-group', true);
    span.appendChild(createRatingLabel(label));
    for (let i = 1; i <= max; i++) {
        const star = document.createElement('img');
        star.src = '../Images/Stars/' + img + '-' + i + '.png';
        toggleClass(star, 'rating-star', true);
        star.setAttribute('data-rating-scale', scale);
        star.setAttribute('data-rating-value', i.toString());
        star.onclick = () => { setRating(star); };
        span.appendChild(star);
    }
    return span;
}
function createFeedbackButton() {
    const span = document.createElement('span');
    toggleClass(span, 'rating-label', true);
    const button = document.createElement('button');
    button.textContent = "Give Feedback";
    toggleClass(button, 'rating-feedback-button', true);
    button.onclick = () => { provideFeedback(button); };
    span.appendChild(button);
    return span;
}
/**
 * Callback when the user clicks one of the rating stars.
 * @param img Which image - could be from either group.
 */
async function setRating(img) {
    const group = findParentOfClass(img, "rating-group");
    const others = group.getElementsByClassName('rating-star');
    let unset = hasClass(img, 'selected');
    let changed = false;
    for (let i = others.length - 1; i >= 0; i--) {
        if (hasClass(others[i], 'selected')) {
            changed = true;
        }
        toggleClass(others[i], 'selected', false);
    }
    const scale = getOptionalStyle(img, 'data-rating-scale');
    let val = parseInt(getOptionalStyle(img, 'data-rating-value') || "0");
    if (!unset) {
        toggleClass(img, 'selected', true);
        if (scale) {
            await sendRating(scale, val);
        }
    }
    else {
        val = 0;
    }
}
/**
 * Solicit verbatim feedback, and pass it along to the server.
 * @param button The button the user clicked.
 */
async function provideFeedback(button) {
    const feedback = prompt("Feedback will be forwarded to this puzzle's authors.");
    if (feedback) {
        await sendFeedback(feedback);
        // Show UI on the feedback button that the message was received.
        toggleClass(button, 'sent', !!feedback);
    }
}
/**
 * Only show ratings for puzzles that care, and when we have a means to sync the feedback.
 * Meta materials, challenge tickets, and the home index don't care. They also, coincidentally, don't have authors.
 */
function shouldShowRatings() {
    const boiler = theBoiler();
    if (!boiler) {
        return false;
    }
    if (!boiler.author) {
        return false; // Pages without authors are generally not interesting for ratings
    }
    // Event must be legit, and syncable
    const safari = getSafariDetails();
    if (!safari) {
        return false;
    }
    if (!safari.eventSync) {
        return false;
    }
    // Player must have logged in
    // (two reasons: to nail down the event, and because server doesn't have anonymous players)
    const login = getLogin(safari.eventSync);
    return !!login;
}
/*-----------------------------------------------------------
 * _boilerplate.ts
 *-----------------------------------------------------------*/
/**
 * Cache the URL parameneters as a dictionary.
 * Arguments that don't specify a value receive a default value of true
 */
const urlArgs = {};
/**
 * Scan the url for special arguments.
 */
function debugSetup() {
    if (Object.keys(urlArgs).length > 0) {
        return; // Only process once
    }
    var search = window.location.search;
    if (search !== '') {
        search = search.substring(1); // trim leading ?
        var args = search.split('&');
        for (let i = 0; i < args.length; i++) {
            var toks = args[i].split('=');
            if (toks.length > 1) {
                urlArgs[toks[0].toLowerCase()] = toks[1];
            }
            else {
                urlArgs[toks[0].toLowerCase()] = true; // e.g. present
            }
        }
    }
    if (urlArgs['body-debug'] != undefined && urlArgs['body-debug'] !== false) {
        toggleClass(document.getElementsByTagName('body')[0], 'debug', true);
    }
    if (urlArgs['compare-layout'] != undefined) {
        linkCss('../Css/TestLayoutDiffs.css'); // TODO: path
    }
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    toggleClass(document.getElementsByTagName('body')[0], 'iPad', isiPad);
}
/**
 * Check the URL to see if a given argument has been set.
 * Doesn't matter what it's set to, if anything.
 * @param arg The name of an arg (lower-case)
 * @returns true if present in URL.
 */
function urlArgExists(arg) {
    return urlArgs[arg] !== undefined;
}
exports.urlArgExists = urlArgExists;
/**
 * Determines if the caller has specified <i>debug</i> in the URL
 * NOTE: Debug features can be intrusive. Rendering artifacts and alerts.
 * @returns true if set, unless explictly set to false
 */
function isDebug() {
    return urlArgs['debug'] != undefined && urlArgs['debug'] !== false;
}
exports.isDebug = isDebug;
/**
 * Determines if the caller has specified <i>trace</i> in the URL
 * NOTE: Trace features should not be intrusive. Only console output.
 * @returns true if set, unless explictly set to false
 */
function isTrace() {
    return urlArgs['trace'] != undefined && urlArgs['trace'] !== false;
}
exports.isTrace = isTrace;
/**
 * Determines if the caller has specified <i>body-debug</i> in the URL,
 * or else if the puzzle explictly has set class='debug' on the body.
 * @returns true if set, unless explictly set to false
 */
function isBodyDebug() {
    return hasClass(document.getElementsByTagName('body')[0], 'debug');
}
exports.isBodyDebug = isBodyDebug;
/**
 * Determines if this document is being loaded inside an iframe.
 * While any document could in theory be in an iframe, this library tags such pages with a url argument.
 * @returns true if this page's URL contains an iframe argument (other than false)
 */
function isIFrame() {
    return urlArgs['iframe'] != undefined && urlArgs['iframe'] !== false;
}
exports.isIFrame = isIFrame;
/**
 * Determines if this document's URL was tagged with ?print
 * This is intended to as an alternative way to get a print-look, other than CSS's @media print
 * @returns true if this page's URL contains a print argument (other than false)
 */
function isPrint() {
    return urlArgs['print'] != undefined && urlArgs['print'] !== false;
}
exports.isPrint = isPrint;
/**
 * Determines if this document's URL was tagged with ?icon
 * This is intended to as an alternative way to generate icons for each puzzle
 * @returns true if this page's URL contains a print argument (other than false)
 */
function isIcon() {
    return urlArgs['icon'] != undefined && urlArgs['icon'] !== false;
}
exports.isIcon = isIcon;
/**
 * Special url arg to override any cached storage. Always restarts.
 * @returns true if this page's URL contains a restart argument (other than =false)
 */
function isRestart() {
    // An individual puzzle can set rules
    if (theBoiler().reloadOnRefresh !== undefined) {
        return !theBoiler().reloadOnRefresh;
    }
    // Otherwise, url args can skip the UI
    return urlArgs['restart'] != undefined && urlArgs['restart'] !== false;
}
exports.isRestart = isRestart;
/**
 * Do we want to skip the UI that offers to reload?
 * @returns
 */
function forceReload() {
    // An individual puzzle can set rules
    if (theBoiler().reloadOnRefresh !== undefined) {
        return theBoiler().reloadOnRefresh;
    }
    // Otherwise, url args can skip the UI
    if (urlArgs['reload'] != undefined) {
        return urlArgs['reload'] !== false;
    }
    // Undefined invites a popup UI
    return undefined;
}
exports.forceReload = forceReload;
const print_as_color = { id: 'printAs', html: "<div style='color:#666;'>Print as <span style='color:#FF0000;'>c</span><span style='color:#538135;'>o</span><span style='color:#00B0F0;'>l</span><span style='color:#806000;'>o</span><span style='color:#7030A0;'>r</span>.</div>" };
const print_as_grayscale = { id: 'printAs', text: "<div style='color:#666;'>Print as grayscale</div>" };
/**
 * Do some basic setup before of the page and boilerplate, before building new components
 * @param bp
 */
function preSetup(bp) {
    exports._rawHtmlSource = document.documentElement.outerHTML;
    debugSetup();
    const safariDetails = initSafariDetails(bp);
    var bodies = document.getElementsByTagName('body');
    if (isIFrame()) {
        bodies[0].classList.add('iframe');
    }
    if (isPrint()) {
        bodies[0].classList.add('print');
    }
    if (isIcon()) {
        bodies[0].classList.add('icon');
    }
    if (bp.pathToRoot) {
        if (safariDetails.logo) {
            safariDetails.logo = bp.pathToRoot + '/' + safariDetails.logo;
        }
        if (safariDetails.icon) {
            safariDetails.icon = bp.pathToRoot + '/' + safariDetails.icon;
        }
        if (safariDetails.puzzleList) {
            safariDetails.puzzleList = bp.pathToRoot + '/' + safariDetails.puzzleList;
        }
    }
}
function createSimpleDiv({ id, cls, text, html }) {
    let div = document.createElement('div');
    if (id !== undefined) {
        div.id = id;
    }
    if (cls !== undefined) {
        div.classList.add(cls);
    }
    if (text !== undefined) {
        div.appendChild(document.createTextNode(text));
    }
    else if (html !== undefined) {
        div.innerHTML = html;
    }
    return div;
}
function createSimpleA({ id, cls, friendly, href, target }) {
    let a = document.createElement('a');
    if (id !== undefined) {
        a.id = id;
    }
    if (cls !== undefined) {
        a.classList.add(cls);
    }
    a.innerHTML = friendly;
    a.href = href;
    a.target = target || '_blank';
    return a;
}
/**
 * Map puzzle types to alt text
 */
const iconTypeAltText = {
    'Word': 'Word puzzle',
    'Math': 'Math puzzle',
    'Rebus': 'Rebus puzzle',
    'Code': 'Features encodings',
    'Trivia': 'Trivia puzzle',
    'Meta': 'Meta puzzle',
    'Reassemble': 'Assembly'
};
/**
 * Create an icon appropriate for this puzzle type
 * @param data Base64 image data
 * @returns An img element, with inline base-64 data
 */
function createPrintQrBase64(data) {
    const qr = document.createElement('img');
    qr.id = 'qr';
    qr.src = 'data:image/png;base64,' + data;
    qr.alt = 'QR code to online page';
    return qr;
}
function getQrPath() {
    const safariDetails = getSafariDetails();
    if (safariDetails.qr_folders) {
        const url = window.location.href;
        for (const key of Object.keys(safariDetails.qr_folders)) {
            if (url.indexOf(key) == 0) {
                const folder = safariDetails.qr_folders[key];
                const names = window.location.pathname.split('/'); // trim off path before last slash
                const name = names[names.length - 1].split('.')[0]; // trim off extension
                return folder + '/' + name + '.png';
            }
        }
    }
    return undefined;
}
function createPrintQr() {
    // Find relevant folder:
    const path = getQrPath();
    if (path) {
        const qr = document.createElement('img');
        qr.id = 'qr';
        qr.src = path;
        qr.alt = 'QR code to online page';
        return qr;
    }
    return null;
}
/**
 * Create an icon appropriate for this puzzle type
 * @param puzzleType the name of the puzzle type
 * @param icon_use the purpose of the icon
 * @returns A div element, to be appended to the pageWithinMargins
 */
function createTypeIcon(puzzleType, icon_use = '') {
    if (!icon_use) {
        icon_use = 'puzzle';
    }
    const iconDiv = document.createElement('div');
    iconDiv.id = 'icons';
    const icon = document.createElement('img');
    icon.id = 'icons-' + iconDiv.childNodes.length;
    icon.src = getSafariDetails().iconRoot + puzzleType.toLocaleLowerCase() + '.png';
    icon.alt = iconTypeAltText[puzzleType] || (puzzleType + ' ' + icon_use);
    iconDiv.appendChild(icon);
    return iconDiv;
}
function boilerplate(bp) {
    if (!bp) {
        return;
    }
    _boiler = bp;
    preSetup(bp);
    /* A puzzle doc must have this shape:
     *   <html>
     *    <head>
     *     <script>
     *      const boiler = { ... };        // Most fields are optional
     *     </script>
     *    </head>
     *    <body>
     *     <div id='pageBody'>
     *      // All page contents
     *     </div>
     *    </body>
     *   </html>
     *
     * Several new objects and attibutes are inserted.
     * Some are univeral; some depend on boiler plate data fields.
     *   <html>
     *    <head></head>
     *    <body class='letter portrait'>            // new classes
     *     <div id='page' class='printedPage'>      // new layer
     *      <div id='pageWithinMargins'>            // new layer
     *       <div id='pageBody'>
     *        // All page contents
     *       </div>
     *       <div id='title'>[title]</div>          // new element
     *       <div id='copyright'>[copyright]</div>  // new element
     *       <a id='backlink'>Puzzle List</a>       // new element
     *      </div>
     *     </div>
     *    </body>
     *   </html>
     */
    if (bp.reactiveBuilder) {
        try {
            expandControlTags(bp.reactiveBuilder);
        }
        catch (ex) {
            const ctx = wrapContextError(ex);
            console.error(ctx.stack); // Log, but then continue with the rest of the page
            if (isTrace() || isDebug()) {
                toggleClass(document.getElementsByTagName('body')[0], 'build-error', true);
            }
        }
    }
    else if (hasBuilderElements(document)) {
        const warn = Error('WARNING: this page contains <build>-style elements.\nSet boiler.reactiveBuilder:true to engage.');
        console.error(warn);
    }
    if (bp.tableBuilder) {
        constructTable(bp.tableBuilder);
    }
    const html = document.getElementsByTagName('html')[0];
    const head = document.getElementsByTagName('head')[0];
    const body = document.getElementsByTagName('body')[0];
    const pageBody = document.getElementById('pageBody');
    if (bp.title) {
        document.title = bp.title;
    }
    html.lang = bp.lang || 'en-us';
    const safariDetails = getSafariDetails();
    for (let i = 0; i < safariDetails.links.length; i++) {
        addLink(head, safariDetails.links[i]);
    }
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1';
    head.appendChild(viewport);
    if (safariDetails.fontCss) {
        linkCss(safariDetails.fontCss);
    }
    let gFonts = bp.googleFonts;
    if (safariDetails.googleFonts) {
        gFonts = safariDetails.googleFonts + (gFonts ? (',' + gFonts) : '');
    }
    if (gFonts) {
        //<link rel="preconnect" href="https://fonts.googleapis.com">
        const gapis = {
            'rel': 'preconnect',
            'href': 'https://fonts.googleapis.com'
        };
        addLink(head, gapis);
        //<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        const gstatic = {
            'rel': 'preconnect',
            'href': 'https://fonts.gstatic.com',
            'crossorigin': ''
        };
        addLink(head, gstatic);
        const fonts = gFonts.split(',');
        const link = {
            'href': 'https://fonts.googleapis.com/css2?family=' + fonts.join('&family=') + '&display=swap',
            'rel': 'stylesheet'
        };
        addLink(head, link);
    }
    linkCss(safariDetails.cssRoot + 'PageSizes.css');
    linkCss(safariDetails.cssRoot + 'TextInput.css');
    if (!bp.paperSize) {
        bp.paperSize = 'letter';
    }
    if (!bp.orientation) {
        bp.orientation = 'portrait';
    }
    if (bp.paperSize.indexOf('|') > 0) {
        const ps = bp.paperSize.split('|');
        bp.paperSize = isPrint() ? ps[1] : ps[0];
    }
    toggleClass(body, bp.paperSize);
    toggleClass(body, bp.orientation);
    toggleClass(body, '_' + bp.safari); // So event fonts can trump defaults
    setupEventSync(safariDetails.eventSync);
    const page = createSimpleDiv({ id: 'page', cls: 'printedPage' });
    const margins = createSimpleDiv({ cls: 'pageWithinMargins' });
    body.appendChild(page);
    page.appendChild(margins);
    margins.appendChild(pageBody);
    if (bp.title) {
        margins.appendChild(createSimpleDiv({ cls: 'title', text: bp.title }));
    }
    else {
        toggleClass(body, 'no-title', true);
    }
    if (bp.copyright || bp.author) {
        margins.appendChild(createSimpleDiv({ id: 'copyright', text: '© ' + (bp.copyright || '') + ' ' + (bp.author || '') }));
    }
    const backlink = backlinkFromUrl();
    if (backlink) {
        margins.appendChild(backlink);
    }
    if (bp.printAsColor !== undefined) {
        margins.appendChild(createSimpleDiv(bp.printAsColor ? print_as_color : print_as_grayscale));
    }
    if (safariDetails.icon) {
        // Set tab icon for safari event
        const tabIcon = document.createElement('link');
        tabIcon.rel = 'shortcut icon';
        tabIcon.type = 'image/png';
        tabIcon.href = safariDetails.icon;
        head.appendChild(tabIcon);
    }
    if (bp.qr_base64) {
        margins.appendChild(createPrintQrBase64(bp.qr_base64));
    }
    else if (bp.print_qr) {
        const qrImg = createPrintQr();
        if (qrImg) {
            margins.appendChild(qrImg);
        }
    }
    if (bp.type) {
        margins.appendChild(createTypeIcon(bp.type));
    }
    if (bp.feeder) {
        margins.appendChild(createTypeIcon(bp.feeder, 'feeder'));
    }
    // If the puzzle has a pre-setup method they'd like to run before abilities and contents are processed, do so now
    if (bp.preSetup) {
        bp.preSetup();
    }
    setupAbilities(head, margins, bp.abilities || {});
    if (enableValidation() && theValidation()) {
        linkCss(safariDetails.cssRoot + 'Guesses.css');
        setupValidation();
    }
    if (safariDetails?.ratings) {
        linkCss(safariDetails.cssRoot + 'Ratings.css');
        createRatingUI(safariDetails?.ratings, margins);
    }
    if (!isIFrame()) {
        setTimeout(checkLocalStorage, 100);
    }
}
function debugPostSetup() {
    if (urlArgs['scan-layout'] != undefined) {
        const summary = summarizePageLayout();
        const json = JSON.stringify(summary);
        const comment = document.createComment(json);
        document.getRootNode().appendChild(comment);
    }
    if (urlArgs['compare-layout'] != undefined) {
        const after = summarizePageLayout();
        const root = document.getRootNode();
        for (let i = 0; i < root.childNodes.length; i++) {
            if (root.childNodes[i].nodeType == Node.COMMENT_NODE) {
                const comment = root.childNodes[i];
                let commentJson = comment.textContent;
                if (commentJson) {
                    commentJson = commentJson.trim();
                    if (commentJson.substring(0, 7) == 'layout=') {
                        const before = TryParseJson(commentJson.substring(7));
                        const diffs = diffSummarys(before, after);
                        if (diffs.length > 0) {
                            renderDiffs(diffs);
                        }
                        break;
                    }
                }
            }
        }
    }
}
function theHead() {
    return document.getElementsByTagName('head')[0];
}
function baseHref() {
    const bases = document.getElementsByTagName('base');
    for (let i = 0; i < bases.length; i++) {
        var href = bases[i].getAttribute('href');
        if (href) {
            return relHref(href, document.location.href || '');
        }
    }
    return document.location.href;
}
function relHref(path, fromBase) {
    const paths = path.split('/');
    if (paths[0].length == 0 || paths[0].indexOf(':') >= 0) {
        // Absolute path
        return path;
    }
    if (fromBase === undefined) {
        fromBase = baseHref();
    }
    const bases = fromBase.split('/');
    bases.pop(); // Remove filename at end of base path
    let i = 0;
    for (; i < paths.length; i++) {
        if (paths[i] == '..') {
            if (bases.length == 0 || (bases.length == 1 && bases[0].indexOf(':') > 0)) {
                throw new Error('Relative path beyond base: ' + path);
            }
            bases.pop();
        }
        else if (paths[i] != '.') {
            bases.push(paths[i]);
        }
    }
    return bases.join('/');
}
/**
 * Count-down before we know all delay-linked CSS have been loaded
 */
let cssToLoad = 1;
/**
 * Append any link tag to the header
 * @param head the head tag
 * @param det the attributes of the link tag
 */
function addLink(head, det) {
    head = head || theHead();
    const link = document.createElement('link');
    link.href = relHref(det.href);
    link.rel = det.rel;
    if (det.type) {
        link.type = det.type;
    }
    if (det.crossorigin != undefined) {
        link.crossOrigin = det.crossorigin;
    }
    if (det.rel.toLowerCase() == "stylesheet") {
        link.onload = function () { cssLoaded(); };
        cssToLoad++;
    }
    head.appendChild(link);
}
exports.addLink = addLink;
const linkedCss = {};
/**
 * Append a CSS link to the header
 * @param relPath The contents of the link's href
 * @param head the head tag
 */
function linkCss(relPath, head) {
    if (relPath in linkedCss) {
        return; // Don't re-add
    }
    linkedCss[relPath] = true;
    head = head || theHead();
    const link = document.createElement('link');
    link.href = relHref(relPath);
    link.rel = "Stylesheet";
    link.type = "text/css";
    link.onload = function () { cssLoaded(); };
    cssToLoad++;
    head.appendChild(link);
}
exports.linkCss = linkCss;
/**
 * Each CSS file that is delay-linked needs time to load.
 * Decrement the count after each one.
 * When complete, call final setup step.
 */
function cssLoaded() {
    if (--cssToLoad == 0) {
        setupAfterCss(theBoiler());
    }
}
/**
 * For each ability set to true in the AbilityData, do appropriate setup,
 * and show an indicator emoji or instruction in the bottom corner.
 * Back-compat: Scan the contents of the <ability> tag for known emoji.
 */
function setupAbilities(head, margins, data) {
    const safariDetails = getSafariDetails();
    const page = (margins.parentNode || document.getElementById('page') || margins);
    if (data.textInput !== false) { // If omitted, default to true
        textSetup();
        if (data.textInput == 'nearest') {
            clicksFindInputs(page);
        }
    }
    let ability = document.getElementById('ability');
    if (ability != null) {
        const text = ability.innerText;
        if (text.search('✔️') >= 0) {
            data.checkMarks = true;
        }
        if (text.search('💡') >= 0) {
            data.highlights = true;
        }
        if (text.search('👈') >= 0) {
            data.dragDrop = true;
        }
        if (text.search('✒️') >= 0) {
            data.stamping = true;
        }
    }
    else {
        ability = document.createElement('div');
        ability.id = 'ability';
        page.appendChild(ability);
    }
    let fancy = '';
    let count = 0;
    if (data.checkMarks) {
        setupCrossOffs();
        fancy += '<span id="check-ability" title="Click items to check them off">✔️</span>';
        count++;
    }
    if (data.highlights) {
        let instructions = "Ctrl+click to highlight cells";
        if (theBoiler()?.abilities?.textInput) {
            instructions = "Type ` or ctrl+click to highlight cells";
        }
        fancy += '<span id="highlight-ability" title="' + instructions + '" style="text-shadow: 0 0 3px black;">💡</span>';
        setupHighlights();
        count++;
    }
    if (data.dragDrop !== undefined && data.dragDrop !== false) {
        fancy += '<span id="drag-ability" title="Drag &amp; drop enabled" style="text-shadow: 0 0 3px black;">👈</span>';
        if (typeof (data.dragDrop === 'string')) {
            preprocessSvgDragFunctions(data.dragDrop);
            indexAllDragDropFields();
            linkCss(safariDetails.cssRoot + 'DragDropSvg.css');
        }
        else {
            preprocessDragFunctions();
            indexAllDragDropFields();
            linkCss(safariDetails.cssRoot + 'DragDrop.css');
        }
        count++;
    }
    if (data.stamping) {
        // Review: ability icon
        fancy += '<span id="stamp-ability" title="Click on objects to interact"><img id="stamp-ability-icon" src="../Images/Stamps/stamp-glow.png" style="height:22px;" /></span>';
        preprocessStampObjects();
        indexAllDrawableFields();
        linkCss(safariDetails.cssRoot + 'StampTools.css');
    }
    if (data.straightEdge) {
        fancy += '<span id="drag-ability" title="Line-drawing enabled" style="text-shadow: 0 0 3px black;">📐</span>';
        preprocessRulerFunctions(exports.EdgeTypes.straightEdge, false);
        linkCss(safariDetails.cssRoot + 'StraightEdge.css');
        //indexAllVertices();
    }
    if (data.wordSearch) {
        fancy += '<span id="drag-ability" title="word-search enabled" style="text-shadow: 0 0 3px black;">💊</span>';
        preprocessRulerFunctions(exports.EdgeTypes.wordSelect, true);
        linkCss(safariDetails.cssRoot + 'WordSearch.css');
        //indexAllVertices();
    }
    if (data.hashiBridge) {
        // fancy += '<span id="drag-ability" title="word-search enabled" style="text-shadow: 0 0 3px black;">🌉</span>';
        preprocessRulerFunctions(exports.EdgeTypes.hashiBridge, true);
        linkCss(safariDetails.cssRoot + 'HashiBridge.css');
        //indexAllVertices();
    }
    if (data.subway) {
        linkCss(safariDetails.cssRoot + 'Subway.css');
        // Don't setupSubways() until all styles have applied, so CSS-derived locations are final
    }
    if (data.notes) {
        setupNotes(margins);
        // no ability icon
    }
    if (data.scratchPad) {
        setupScratch();
        let instructions = "Ctrl+click anywhere on the page to create a note.";
        fancy += '<span id="highlight-ability" title="' + instructions + '" style="text-shadow: 0 0 3px black;">📔</span>';
    }
    if (data.decoder) {
        setupDecoderToggle(page, data.decoder);
    }
    ability.innerHTML = fancy;
    ability.style.bottom = data.decoder ? '4pt' : '20pt';
    if (count == 2) {
        ability.style.right = '0.6in';
    }
    // Release our lock on css loading
    cssLoaded();
}
/**
 * All delay-linked CSS files are now loaded. Layout should be complete.
 * @param bp The global boilerplate
 */
function setupAfterCss(bp) {
    if (bp.abilities) {
        if (bp.abilities.subway) {
            setupSubways();
        }
    }
    // If the puzzle has a post-setup method they'd like to run after all abilities and contents are processed, do so now
    if (bp.postSetup) {
        bp.postSetup();
    }
    if (bp.metaParams) {
        // Process metas after page is otherwise fully setup
        setupMetaSync(bp.metaParams);
    }
    debugPostSetup();
}
/**
 * We forward-declare boiler, which we expect calling pages to define.
 * @returns The page's boiler, if any. Else undefined.
 */
function pageBoiler() {
    if (typeof boiler !== 'undefined') {
        return boiler;
    }
    return undefined;
}
let _boiler = {};
/**
 * Expose the boilerplate as an export
 * Only called by code which is triggered by a boilerplate, so safely not null
 */
function theBoiler() {
    return _boiler;
}
exports.theBoiler = theBoiler;
function testBoilerplate(bp) {
    boilerplate(bp);
}
exports.testBoilerplate = testBoilerplate;
if (typeof window !== 'undefined') {
    window.addEventListener('load', function (e) { boilerplate(pageBoiler()); });
}
/*-----------------------------------------------------------
 * _confirmation.ts
 *-----------------------------------------------------------*/
/**
 * Response codes for different kinds of responses
 */
const ResponseType = {
    Error: 0,
    Correct: 1,
    Confirm: 2,
    KeepGoing: 3,
    Unlock: 4,
    Load: 5,
    Show: 6, // cause another cell to show
    //    Save: 7,     // write a key/value directly to storage
};
/**
 * CSS classes for each response type
 */
const ResponseTypeClasses = [
    'rt-error',
    'rt-correct',
    'rt-confirm',
    'rt-keepgoing',
    'rt-unlock',
    'rt-load',
    //    'rt-save',
];
/**
 * The generic response for unknown submissions
 */
const no_match_response = "0";
/**
 * Default response text, if the validation block only specifies a type
 */
const default_responses = [
    "Incorrect",
    "Correct!",
    "Confirmed",
    "Keep going", // Keep Going
];
/**
 * img src= URLs for icons to further indicate whether guesses were correct or not
 */
const response_img = [
    "../Icons/X.png",
    "../Icons/Check.png",
    "../Icons/Thumb.png",
    "../Icons/Thinking.png",
    "../Icons/Unlocked.png", // Unlock
];
/**
 * The full history of guesses on the current puzzle
 */
let guess_history = [];
/**
 * This puzzle has a validation block, so there must be either a place for the
 * player to propose an answer, or an automatic extraction for other elements.
 */
function setupValidation() {
    const body = document.getElementsByTagName('body')[0];
    if (body) {
        toggleClass(body, 'show-validater', true);
    }
    const buttons = document.getElementsByClassName('validater');
    if (buttons.length > 0) {
        let hist = getHistoryDiv('');
        if (!hist) {
            // Create a standard <div id="guess-log"> to track the all guesses
            const log = document.createElement('div');
            log.id = 'guess-log';
            const div = document.createElement('div');
            div.id = 'guess-history';
            const span = document.createElement('span');
            span.id = 'guess-titlebar';
            span.appendChild(document.createTextNode('Submissions'));
            log.appendChild(span);
            log.appendChild(div);
            document.getElementById('pageBody')?.appendChild(log);
        }
    }
    for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        if (isTag(btn, 'button')) {
            btn.onclick = function (e) { clickValidationButton(e.target); };
            const srcId = getOptionalStyle(btn, 'data-extracted-id') || 'extracted';
            let src = document.getElementById(srcId);
            // If button is connected to a text field, hook up ENTER to submit
            if (src && isTag(src, 'span')) {
                // We might be associated with a readonly extracted pattern, or with an input. 
                // For the latter, we likely have a word-cell or letter-cell parent of the actual input
                const inps = src.getElementsByTagName('input');
                if (inps && inps.length == 1) {
                    src = inps[0];
                }
            }
            if (src && ((isTag(src, 'input') && src.type == 'text')
                || isTag(src, 'textarea'))) { // TODO: not multiline
                src.onkeyup = function (e) { validateInputReady(btn, e.key); };
            }
            // Usually, disable/hide the button at first
            validateInputReady(btn, null);
        }
    }
}
exports.setupValidation = setupValidation;
function calculateTextExtents(src, value) {
    let fe = document.getElementById('fontExtents');
    if (!fe) {
        fe = document.createElement('span');
        fe.id = 'fontExtents';
        fe.style.position = 'absolute';
        document.getElementsByTagName('body')[0].appendChild(fe);
    }
    fe.innerText = value;
    const styles = window.getComputedStyle(src, null);
    fe.style.fontFamily = styles.getPropertyValue('font-family');
    fe.style.fontSize = styles.getPropertyValue('font-size');
    fe.style.fontWeight = styles.getPropertyValue('font-weight');
    fe.style.fontStretch = styles.getPropertyValue('font-stretch');
    fe.style.textTransform = styles.getPropertyValue('text-transform');
    //    fe.style.transform = styles.getPropertyValue('transform');
    return fe.scrollWidth;
}
/**
 * When a user types an over-long value into an input, shrink the font
 * @param input An input or textarea element
 * @param value The current text
 */
function horzScaleToFit(input, value) {
    let widthPx = parseFloat(input.getAttribute('data-original-width') || '');
    if (!widthPx) {
        widthPx = calcPxStyle(input, 'width');
        input.setAttribute('data-original-width', '' + widthPx);
    }
    if (value.length == 0) {
        input.style.transform = 'scale(100%, 100%)';
        input.style.width = widthPx + 'px';
    }
    const curScale = calcTransform(input, 'scale', matrix.scaleX, 1);
    const needPx = calculateTextExtents(input, value + '|'); // account for borders
    if (needPx * curScale > widthPx) {
        const wantPx = calculateTextExtents(input, value + ' 12345678'); // one more word
        const newScalePct = Math.floor(widthPx * 100 / wantPx);
        if (newScalePct > 33) { // Maximum compression before unreadable
            input.style.transformOrigin = 'left';
            input.style.transform = 'scale(' + newScalePct + '%, 100%)';
            input.style.width = Math.floor(widthPx * 100 / newScalePct) + 'px';
        }
        const test = calculateTextExtents(input, value);
    }
    else if (input.style.transform.indexOf('scale') == 0 && needPx < widthPx) {
        input.style.transformOrigin = 'left';
        input.style.transform = 'initial';
        input.style.width = widthPx + 'px';
    }
}
function calcPxStyle(elmt, prop) {
    const val = window.getComputedStyle(elmt, null).getPropertyValue(prop);
    return parseFloat(val.substring(0, val.length - 2)); // px
}
function calcPctStyle(elmt, prop) {
    const val = window.getComputedStyle(elmt, null).getPropertyValue(prop);
    return parseFloat(val.substring(0, val.length - 1)); // %
}
const matrix = {
    scaleX: 0,
    rotX: 1,
    rotY: 2,
    scaleY: 3,
    translateX: 4,
    translateY: 5
};
function calcTransform(elmt, prop, index, defValue) {
    const trans = window.getComputedStyle(elmt, null).getPropertyValue('transform');
    let matrix = '1, 0, 0, 0, 1, 0'; // unit transform
    if (trans && trans.substring(0, 7) == 'matrix(') {
        matrix = trans.substring(7, trans.length - 8);
    }
    const split = matrix.split(',');
    if (index < split.length) {
        const val = split[index];
        if (val.substring(val.length - 1) == '%') {
            return parseFloat(val.substring(0, val.length - 1)) * 0.01;
        }
        else if (val.substring(val.length - 2) == 'px') {
            return parseFloat(val.substring(0, val.length - 2));
        }
        else
            return parseFloat(val);
    }
    return defValue;
}
/**
 * When typing in an input connected to a validate button,
 * any non-empty string indicates ready (TODO: add other rules)
 * and ENTER triggers a button click
 * @param btn The button to enable/disable as ready
 * @param key What key was just typed, if any
 */
function validateInputReady(btn, key) {
    const id = getOptionalStyle(btn, 'data-extracted-id', 'extracted');
    const ext = id ? document.getElementById(id) : null;
    if (!ext) {
        console.error('Button ' + btn.id + ' missing a valid "data-extracted-id" linking to its source: ' + id);
        return;
    }
    const value = getValueFromTextContainer(ext, '_');
    const ready = isValueReady(btn, value);
    consoleTrace(`Value ${value} is ${ready ? "" : "NOT "} ready`);
    toggleClass(btn, 'ready', ready);
    if (ready && (key == 'Enter' || key == 'NumpadEnter')) {
        clickValidationButton(btn);
    }
    else if (isTag(ext, 'input') || isTag(ext, 'textarea')) {
        horzScaleToFit(ext, value);
    }
}
exports.validateInputReady = validateInputReady;
/**
 * Is this value complete, such that submitting is possible?
 * @param btn The button to submit
 * @param value The value to submit
 * @returns true if the value is long enough and contains no blanks
 */
function isValueReady(btn, value) {
    if (!value) {
        return false;
    }
    if (value.indexOf('_') >= 0) {
        return false;
    }
    const minLength = getOptionalStyle(btn, 'data-min-length');
    if (minLength) {
        return value.length >= parseInt(minLength);
    }
    return value.length > 0;
}
/**
 * There should be a singleton guess history, which we likely created above
 * @param id The ID, or 'guess-history' by default
 */
function getHistoryDiv(id) {
    return document.getElementById('guess-history');
}
/**
 * The user has clicked a "Submit" button next to their answer.
 * @param btn The target of the click event
 * The button can have parameters pointing to the extraction.
 */
function clickValidationButton(btn) {
    const id = getOptionalStyle(btn, 'data-extracted-id', 'extracted');
    if (!id) {
        return;
    }
    const ext = document.getElementById(id);
    if (!ext) {
        return;
    }
    const value = getValueFromTextContainer(ext, '_');
    const ready = isValueReady(btn, value);
    if (ready) {
        const now = new Date();
        const gl = { field: id, guess: value, time: now };
        decodeAndValidate(gl);
    }
}
/**
 * Validate a user's input against the encoded set of validations
 * @param gl the guess information, but not the response
 */
function decodeAndValidate(gl) {
    consoleTrace(`Guess ${gl.guess}`);
    const validation = theValidation();
    if (!validation) {
        console.error('No validation data');
        return;
    }
    let field = gl.field;
    if (!(field in validation) && ('' in validation)) {
        // Most puzzles have a single validated field, and so don't need to name it
        field = '';
    }
    if (field in validation) {
        const obj = validation[field];
        // Normalize guesses
        // TODO: make this optional, in theBoiler, if a puzzle needs
        // Alternatively, go a step further, and de-accent characters
        gl.guess = gl.guess.toUpperCase(); // All caps (permanent)
        let guess = gl.guess.replace(/[^a-zA-Z0-9]/g, ''); // Remove everything that isn't alphanumeric
        const hash = rot13(guess); // TODO: more complicated hashing
        const block = appendGuess(gl);
        let solved = false;
        if (hash in obj) {
            const encoded = obj[hash];
            // Guess was expected. It may have multiple responses.
            const multi = encoded.split('|');
            for (let i = 0; i < multi.length; i++) {
                solved = appendResponse(block, multi[i]) || solved;
            }
        }
        else {
            // Guess does not match any hashes
            appendResponse(block, no_match_response);
        }
        pingEventServer(solved ? EventSyncActivity.Solve : EventSyncActivity.Attempt, guess);
    }
    else {
        console.error('Unrecognized validation field: ' + gl.field);
    }
}
exports.decodeAndValidate = decodeAndValidate;
/**
 * Build a guess/response block, initialized with the guess
 * @param gl The user's guess info
 * @returns The block, to which responses can be appended
 */
function appendGuess(gl) {
    // Save
    guess_history.push(gl);
    saveGuessHistory(guess_history);
    // Build a block for the guess and any connected responses
    const hist = getHistoryDiv(gl.field);
    const block = document.createElement('div');
    block.classList.add('rt-block');
    const div = document.createElement('div');
    div.classList.add('rt-guess');
    div.appendChild(document.createTextNode(gl.guess));
    const now = gl.time;
    const time = now.getHours() + ":"
        + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes() + ":"
        + (now.getSeconds() < 10 ? "0" : "") + now.getSeconds();
    const span = document.createElement('span');
    span.classList.add('rt-time');
    span.appendChild(document.createTextNode(time));
    div.appendChild(span);
    block.appendChild(div);
    // Newer guesses are inserted at the top
    hist.insertAdjacentElement('afterbegin', block);
    return block;
}
/**
 * Append a response to a guess block.
 * @param block The div containing the guess, and any other responses to the same guess
 * @param response The response, prefixed with the response type
 * The type is pulled off, and dictates the formatting.
 * Some types have side-effects, in addition to text.
 * If the response is only the type, pre-canned text is used instead.
 * @returns true if the response indicates the puzzle has been fully solved
 */
function appendResponse(block, response) {
    const type = parseInt(response[0]);
    response = response.substring(1);
    if (response.length == 0 && type < default_responses.length) {
        response = default_responses[type];
    }
    else {
        response = rot13(response);
    }
    const div = document.createElement('div');
    div.classList.add('response');
    div.classList.add(ResponseTypeClasses[type]);
    if (type == ResponseType.Unlock) {
        // Create a link to a newly unlocked page.
        // The (decrypted) response is either just a URL, 
        // or else URL^Friendly (separated by a caret)
        const caret = response.indexOf('^');
        const friendly = caret < 0 ? response : response.substring(caret + 1);
        if (caret >= 0) {
            response = response.substring(0, caret);
            // Keep any url args
            var urlArgs = (window.location.search ?? "?").substring(1);
            if (urlArgs) {
                if (response.indexOf('?') >= 0) {
                    response += '&' + urlArgs;
                }
                else {
                    response += '?' + urlArgs;
                }
            }
        }
        consoleTrace(`Unlocking ${response}` + (caret >= 0 ? `(aka ${friendly})` : ''));
        div.appendChild(document.createTextNode('You have unlocked '));
        const link = document.createElement('a');
        link.href = response;
        link.target = '_blank';
        link.appendChild(document.createTextNode(friendly));
        div.appendChild(link);
    }
    else if (type == ResponseType.Load) {
        consoleTrace(`Loading ${response}`);
        // Keep any url args
        var urlArgs = (window.location.search ?? "?").substring(1);
        if (urlArgs) {
            if (response.indexOf('?') >= 0) {
                response += '&' + urlArgs;
            }
            else {
                response += '?' + urlArgs;
            }
        }
        // Use an iframe to navigate immediately to the response URL.
        // The iframe will be hidden, but any scripts will run immediately.
        const iframe = document.createElement('iframe');
        iframe.src = response;
        div.appendChild(iframe);
        if (theBoiler().metaParams) {
            setTimeout(() => { scanMetaMaterials(); }, 1000);
        }
    }
    else if (type == ResponseType.Show) {
        const parts = response.split('^'); // caret not allowed in a URL
        const elmt = document.getElementById(parts[0]);
        if (elmt) {
            if (parts.length > 1) {
                toggleClass(elmt, parts[1]);
            }
            else {
                elmt.style.display = 'block';
            }
        }
        else {
            console.error('Cannot show id=' + parts[0]);
        }
    }
    else {
        consoleTrace(`Validation response (type ${type}) : ${response}`);
        // The response (which may be canned) is displayed verbatim.
        div.appendChild(document.createTextNode(response));
    }
    if (type < response_img.length) {
        const img = document.createElement('img');
        img.classList.add('rt-img');
        img.src = response_img[type];
        div.appendChild(img);
    }
    block.appendChild(div);
    setTimeout(() => { div.scrollIntoView({ behavior: "smooth", block: "end" }); }, 100);
    if (type == ResponseType.Correct) {
        // Tag this puzzle as solved
        toggleClass(document.getElementsByTagName('body')[0], 'solved', true);
        // Cache that the puzzle is solved, to be indicated in tables of contents
        updatePuzzleList(getCurFileName(), exports.PuzzleStatus.Solved);
        return true;
    }
    return false;
}
/**
 * Rot-13 cipher, maintaining case.
 * Chars other than A-Z are preserved as-is
 * @param source Text to be encoded, or encoded text to be decoded
 */
function rot13(source) {
    let rot = '';
    for (let i = 0; i < source.length; i++) {
        const ch = source[i];
        let r = ch;
        if (ch >= 'A' && ch <= 'Z') {
            r = String.fromCharCode(((ch.charCodeAt(0) - 52) % 26) + 65);
        }
        else if (ch >= 'a' && ch <= 'z') {
            r = String.fromCharCode(((ch.charCodeAt(0) - 84) % 26) + 97);
        }
        rot += r;
    }
    return rot;
}
/**
 * We forward-declare boiler, which we expect calling pages to define.
 * @returns The page's boiler, if any. Else undefined.
 */
function pageValidation() {
    // validation can be a standalone global variable, defined in another .js
    if (typeof validation !== 'undefined') {
        return validation;
    }
    // Or it can be a member of the boilerplate
    return theBoiler().validation;
}
let _validation;
/**
 * Expose the boilerplate as an export
 * Only called by code which is triggered by a boilerplate, so safely not null
 */
function theValidation() {
    if (!_validation)
        _validation = pageValidation();
    return _validation;
}
exports.theValidation = theValidation;
/**
 * Custom error which identify which parts of the source document are malformed.
 * It can leverage nested try/catch blocks to add additional context.
 */
class ContextError extends Error {
    /**
     * Create a new ContextError (or derived error)
     * @param msg The message of the Error
     * @param source Indicates which source text specifically triggered this error
     * @param inner The inner/causal error, if any
     */
    constructor(msg, source, inner) {
        super(msg);
        this.name = 'ContextError';
        this.cause = inner;
        this.functionStack = [];
        this.sourceStack = [];
        this.callStack = '';
        if (source) {
            if (typeof (source) == 'function') {
                this.sourceStack.push(source());
            }
            else {
                this.sourceStack.push(source);
            }
        }
    }
    _cacheCallstack() {
        if (this.callStack === '') {
            this.callStack = this.cause ? this.cause.stack : this.stack;
            if (this.callStack?.substring(0, this.message.length) == this.message) {
                this.callStack = this.callStack.substring(this.message.length); // REVIEW: trim \n ?
            }
        }
    }
}
exports.ContextError = ContextError;
/**
 * Type predicate to separate ContextErrors from generic errors.
 * @param err Any error
 * @returns true if it is a ContextError
 */
function isContextError(err) {
    //return err instanceof ContextError;
    return err.name === 'ContextError';
}
exports.isContextError = isContextError;
/**
 * Add additional information to a context error.
 * @param inner Another exception, which has just been caught.
 * @param func The name of the current function (optional).
 * @param elmt The name of the current element in the source doc (optional)
 * @param src The source offset that was being evaluated
 * @returns If inner is already a ContextError, returns inner, but now augmented.
 * Otherwise creates a new ContextError that wraps inner.
 */
function wrapContextError(inner, func, src) {
    let ctxErr;
    if (isContextError(inner)) {
        ctxErr = inner;
    }
    else {
        ctxErr = new ContextError(inner.name + ': ' + inner.message, undefined, inner);
    }
    // Cache callstack
    if (ctxErr.callStack === '') {
        ctxErr.callStack = ctxErr.cause ? ctxErr.cause.stack : ctxErr.stack;
        if (ctxErr.callStack?.substring(0, ctxErr.message.length) == ctxErr.message) {
            ctxErr.callStack = ctxErr.callStack.substring(ctxErr.message.length); // REVIEW: trim \n ?
        }
    }
    if (func) {
        ctxErr.functionStack.push(func);
    }
    if (src) {
        if (typeof (src) == 'function') {
            src = src();
        }
        ctxErr.sourceStack.push(src);
    }
    makeBetterStack(ctxErr);
    return ctxErr;
}
exports.wrapContextError = wrapContextError;
/**
 * Once we've added context to the exception, update the stack to reflect it
 */
function makeBetterStack(err) {
    const msg = 'ContextError: ' + err.message;
    let str = msg;
    if (err.sourceStack.length > 0) {
        for (let i = 0; i < err.sourceStack.length; i++) {
            const c = err.sourceStack[i];
            str += '\n' + c.source;
            if (c.offset !== undefined) {
                str += '\n' + Array(c.offset + 1).join(' ') + '^';
                if (c.length && c.length > 1) {
                    str += Array(c.length).join('^');
                }
            }
        }
    }
    if (err.callStack) {
        str += '\n' + err.callStack;
    }
    if (err.cause) {
        str += '\nCaused by: ' + err.cause;
    }
    // if (err.functionStack.length > 0) {
    //   str += "\nBuild functions stack:";
    //   for (let i = 0; i < err.functionStack.length; i++) {
    //     str += '\n    ' + err.functionStack[i];
    //   }
    // }
    err.stack = str;
}
function nodeSourceOffset(node) {
    if (node.nodeType == Node.ELEMENT_NODE) {
        return elementSourceOffset(node);
    }
    else {
        const tok = {
            source: node.nodeValue || '',
            offset: 0,
            length: 1, // No need to span the whole
        };
        return tok;
    }
}
exports.nodeSourceOffset = nodeSourceOffset;
/**
 * Recreate the source for a tag. Then pinpoint the offset of a desired attribute.
 * @param elmt An HTML tag
 * @param attr A specific attribute, whose value is being evaluated.
 * @returns A source offset, built on the recreation
 */
function elementSourceOffset(elmt, attr) {
    let str = '<' + elmt.localName;
    let offset = 0;
    let length = 0;
    for (let i = 0; i < elmt.attributes.length; i++) {
        const name = elmt.attributes[i].name;
        const value = elmt.attributes[i].value;
        if (name === attr) {
            offset = str.length + name.length + 3; // The start of the value
            length = value.length;
        }
        str += ' ' + elmt.attributes[i].name + '="' + elmt.attributes[i].value + '"';
    }
    if (attr && offset == 0) {
        // Never found the attribute we needed. Highlight the element name
        offset = 1;
        length = elmt.localName.length;
    }
    if (elmt.childNodes.length == 0) {
        str += ' /'; // show as empty tag
    }
    str += '>'; // close tag
    if (offset == 0) {
        length = str.length; // Full tag
    }
    const tok = { source: str, offset: offset, length: length };
    return tok;
}
exports.elementSourceOffset = elementSourceOffset;
/**
 * Instead of creating a source offset every time, anticipating an exception
 * that rarely gets thrown, instead pass a lambda.
 */
function elementSourceOffseter(elmt, attr) {
    return () => { return elementSourceOffset(elmt, attr); };
}
exports.elementSourceOffseter = elementSourceOffseter;
/**
 * A code error has no additional fields.
 * It just acknowledges that the bug is probably the code's fault, and not the raw inputs's.
 */
class CodeError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'CodeError';
    }
}
exports.CodeError = CodeError;
/**
 * For debug traces, summarize a tag without including its children/contents
 * @param elmt Any HTML element
 * @returns A recreation of its start tag
 */
function debugTagAttrs(elmt, expandFormulas = false) {
    let str = '<' + elmt.localName;
    for (let i = 0; i < elmt.attributes.length; i++) {
        let val = elmt.attributes[i].value;
        if (expandFormulas) {
            try {
                val = makeString(complexAttribute(val));
            }
            catch {
                val = "#ERROR#"; // 
            }
        }
        str += ' ' + elmt.attributes[i].name + '="' + val + '"';
    }
    if (elmt.childNodes.length == 0) {
        str += ' /'; // show as empty tag
    }
    str += '>'; // close tag
    return str;
}
exports.debugTagAttrs = debugTagAttrs;
/**
 * For debugging, mirror a builder tag as a comment inside the new tag it generated.
 * Show attributes in their raw version, potentially with formulas,
 * and again with resolved values, if different.
 * @param src The original builder element
 * @param dest The new element that replaces it, or else a list of elements
 * @param expandFormulas If true, try expanding formulas.
 * Don't use if the resolved formulas are at risk of being large (i.e. objects or lists)
 */
function traceTagComment(src, dest, expandFormulas) {
    const dbg1 = debugTagAttrs(src);
    const cmt1 = consoleComment(dbg1);
    if (Array.isArray(dest)) {
        pushRange(dest, cmt1);
    }
    else if (cmt1.length > 0) {
        dest.appendChild(cmt1[0]);
    }
    if (expandFormulas) {
        const dbg2 = debugTagAttrs(src, true);
        if (dbg2 !== dbg1) {
            const cmt2 = consoleComment(dbg2);
            if (Array.isArray(dest)) {
                pushRange(dest, cmt1);
            }
            else if (cmt2.length > 0) {
                dest.appendChild(cmt2[0]);
            }
        }
    }
}
exports.traceTagComment = traceTagComment;
/*-----------------------------------------------------------
 * _builder.ts
 *-----------------------------------------------------------*/
/****************************************************************************
 *          BUILDER
 *
 * Buider HTML is loosely inspired by React.
 * It defines the data first.
 * Then the HTML supports special tags for loops and conditionals,
 * and the text and attributes support lookups into the data.
 *
 * Data initialization:
 *    In the script block of the page, add two values to the boilerplate:
 *        const boiler = {
 *          ...
 *          'reactiveBuilder': true,  // required
 *          'lookup': {               // free-form, for example...
 *            magic: 123,
 *            line: { start: {x:1, y:2}, end: {x:3, y:4} },
 *            fonts: [ 'bold', 'italic' ],
 *            grid: [
 *              [1, 2, 3],
 *              [4, 5, 6]
 *            ]
 *          }
 *        };
 *
 * Data lookup:
 *    In text or attribute values, use curly-brace syntax to inject named values:
 *    Examples in text:
 *      {magic}             =>  123
 *      {line.end.x}        =>  3
 *      {grid.0.1}          =>  2   // note that .0 and .1 are indeces
 *
 *    Examples in attributes:
 *      <div id="{magic}" class="{fonts.0} {fonts.1}">
 *                          =>  <div id="123" class="bold italic">
 *
*    There is a special rule for tags and attributes prefixed with _, or starting with a double-letter
 *    when you need to avoid the pre-processed tags/attributes being acted upon by the DOM.
 *      <iimg ssrc="{fonts.0}Icon.png">
 *                          =>  <img src="boldIcon.png">
 *
 *   Parameterized lookups allow one lookup to be used to name the child of another.
 *   Any nested pair of [brackets] restarts the lookup context at the root.
 *      {grid.[line.start.x].[line.start.y]}
 *                          ==  {grid.1.2}      =>  5
 *
 * <for> Loops:
 *    Use the new <for> tag to loop over a set of values,
 *    cloning and re-evaluating the contents of the loop for each.
 *
 *    The targets of loops are implicitly lookups, so the {curly} syntax is not needed.
 *    As they expand, new nested values are dynamically added to the lookup table, to reflect the loop state.
 *
 *    Loop over elements in a list:
 *      <for each="font" in="fonts">{font#}:{font} </for>
 *                          =>  0:bold 1:italic
 *        Note: in="fonts" could have been in="{fonts}"
 *        Inside the <for> tags, new temporary named values exist based on the name specified in each=""
 *          {font} for each value in the list,
 *          and {font#} for the index of that item (starting at 0)
 *
 *    Loop over fields in an object:
 *      <for key="a" in="line.start">{a#}:{a}={a!} </for>
 *                          =>  0:x=1 1:y=2
 *        Inside the <for> tags, an additional temporary:
 *          {a} for each key in the object, {a#} for the index of that key,
 *          and {a!} for the value corresponding to that key.
 *
 *    Loop over characters in text:
 *      <for char="ch" in="fonts.0">{ch} </for>
 *                          =>  b o l d
 *      <for char="ch" in="other">{ch} </for>
 *                          =>  o t h e r
 *
 *        Note that the in="value" can be a literal.
 *
 *    Loop over words in text:
 *      <for char="w" in="Hello World!">{w}-{w}</for>
 *                          =>  Hello-HelloWorld!-World!
 *
 *        Word is really anything delimited by spaces.
 *
 *    Loop over a range of values:
 *      <for range="i" from="1" to="3">{i}</for>
 *                          =>  123
 *      <for range="i" from="1" until="3">{i}</for>
 *                          =>  12
 *      <for range="i" from="5" to="0" step="-2">{i}</for>
 *                          =>  531
 *
 *        from=""   specifies the start value
 *        to=""     specifies the last value (inclusive)
 *        until=""  specifies a stop value (exclusive)
 *        step=""   specifies a step value, if not 1
 *
 *    Use ranges to in compound lookups:
 *      <for range="row" from="0" to="1">
 *        <for range="col" from="0" to="2">
 *          {grid.[row].[col]}
 *      </for>,</for>
 *                          =>  1 2 3 , 4 5 6
 *
 *  <if> conditionals
 *    Use the new <if> tag to check a lookup against various states.
 *    The checked values are implicitly lookups, so the {curly} syntax is not needed.
 *    No new temporary values are generated by ifs.
 *
 *    Note: there is no else syntax. Instead, concatenate multiple ifs.
 *      As such, be careful not to nest, unless intended.
 *
 *    <if test="magic" eq="123">Magic!</if>
 *    <if test="magic" ne="123">Lame.</if>
 *                          =>  Magic!
 *    <if test="magic" ge="100">Big!
 *    <if test="magic" ge="120">Bigger!</if>
 *    </if>
 *                          =>  Big!Bigger!
 *
 *        Relative operators:
 *          eq=""       Equality (case-sensitive, in all cases)
 *          ne=""       Not-equals
 *          gt=""       Greater than
 *          lt=""       Less than
 *          ge=""       Greater than or equals
 *          le=""       Less than or equals
 *        Containment operators:
 *          in="super"  Test value is IN (a substring of) "super"
 *          ni="super"  Test value is NOT IN (not a substring of) "super"
 *        There is no NOT modifier. Instead, use the converse operator.
 *
 *
 *  Loops and Tables:
 *    It is tempting to use loops inside <table> tags.
 *    However, the DOM will refactor them if found inside a <table> but not inside <td>.
 *
 *    Two options: _prefix (or pprefix) and CSS
 *      <ttable>
 *        <for ...>
 *          <ttr>
 *            <if eq ...><tth></tth></if>
 *            <if ne ...><ttd></ttd></if>
 *          </ttr>
 *        </for>
 *      </ttable>
 *
 *      <div style="display:table">
 *        <for ...>
 *          <div style="display:table-row">
 *            <if eq ...><div style="display:table-header"></div></if>
 *            <if ne ...><div style="display:table-cell"></div></if>
 *          </div>
 *        </for>
 *      </div>
 */
const builder_tags = [
    'build', 'use', 'for', 'if', 'else', 'elseif'
];
function firstBuilderElement() {
    const btags = builder_tags.concat(exports.inputAreaTagNames);
    for (const t of btags) {
        const tags = document.getElementsByTagName(t);
        for (let i = 0; i < tags.length; i++) {
            toggleClass(tags[i], '_builder_control_', true);
        }
    }
    const builds = document.getElementsByClassName('_builder_control_');
    if (builds.length == 0)
        return null;
    const first = builds[0];
    for (let i = builds.length - 1; i >= 0; i--) {
        toggleClass(builds[i], '_builder_control_', false);
    }
    return first;
}
/**
 * Does this document contain any builder elements?
 * @param doc An HTML document
 * @returns true if any of our custom tags are present.
 * NOTE: Does not detect {curlies} in plain text or plain elements.
 */
function hasBuilderElements(doc) {
    const btags = builder_tags.concat(exports.inputAreaTagNames);
    for (let i = 0; i < btags.length; i++) {
        if (doc.getElementsByTagName(builder_tags[i]).length > 0) {
            return true;
        }
    }
}
exports.hasBuilderElements = hasBuilderElements;
let src_element_stack = [];
let dest_element_stack = [];
let builder_element_stack = [];
function initElementStack(elmt) {
    dest_element_stack = [];
    src_element_stack = [];
    builder_element_stack = [];
    const parent_stack = [];
    while (elmt !== null && elmt.nodeName != '#document-fragment' && elmt.tagName !== 'BODY') {
        parent_stack.push(elmt);
        elmt = elmt.parentElement;
    }
    // Invert stack
    while (parent_stack.length > 0) {
        src_element_stack.push(parent_stack.pop());
    }
}
exports.initElementStack = initElementStack;
function pushDestElement(elmt) {
    dest_element_stack.push(elmt);
}
function popDestElement() {
    dest_element_stack.pop();
}
function pushBuilderElement(elmt) {
    builder_element_stack.push(elmt);
}
exports.pushBuilderElement = pushBuilderElement;
function popBuilderElement() {
    builder_element_stack.pop();
}
exports.popBuilderElement = popBuilderElement;
var TrimMode;
(function (TrimMode) {
    TrimMode[TrimMode["off"] = 0] = "off";
    TrimMode[TrimMode["on"] = 1] = "on";
    TrimMode[TrimMode["pre"] = 2] = "pre";
    TrimMode[TrimMode["all"] = 3] = "all";
})(TrimMode || (exports.TrimMode = TrimMode = {}));
/**
 * When in trim mode, cloning text between elements will omit any sections that are pure whitespace.
 * Sections that include both text and whitespace will be kept in entirety.
 * @returns One of three trim states, set anywhere in the current element heirarchy.
 */
function getTrimMode() {
    const elmt = getBuilderParentIf(e => hasClass(e, 'trim') || e.getAttributeNS('', 'trim') !== null);
    if (elmt) {
        if (hasClass(elmt, 'trim')) {
            return TrimMode.on;
        }
        let trim = elmt.getAttributeNS('', 'trim');
        trim = trim == null ? null : trim.toLowerCase();
        if (trim === 'all') {
            return TrimMode.all;
        }
        if (trim === 'pre') {
            return TrimMode.pre;
        }
        if (trim != null) {
            return (trim !== 'false' && trim !== 'off') ? TrimMode.on : TrimMode.off;
        }
    }
    return TrimMode.off;
}
exports.getTrimMode = getTrimMode;
/**
 * Throwing exceptions while building will hide large chunks of page.
 * Instead, set nothrow on any build element (not normal elements) to disable rethrow at that level.
 * In that case, the error will be logged, but then building will continue.
 * FUTURE: set onthrow to the name of a local function, and onthrow will call that, passing the error
 * @returns true if the current element expresses nothrow as either a class or attribute.
 */
function shouldThrow(ex, node1, node2, node3) {
    // Inspect any passed-in nodes for throwing instructions.
    const nodes = [node1, node2, node3];
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node || node.nodeType != Node.ELEMENT_NODE) {
            continue;
        }
        const elmt = nodes[i]; // The first element that had a elmt
        if (hasClass(elmt, 'nothrow') || elmt.getAttributeNS('', 'nothrow') !== null) {
            console.error(ex.stack);
            return false;
        }
        const fn = elmt.getAttributeNS('', 'onthrow');
        if (fn) {
            const func = window[fn];
            if (func) {
                console.error(ex.stack);
                func(ex, elmt);
                return false;
            }
        }
    }
    return true;
}
exports.shouldThrow = shouldThrow;
/**
 * See if any parent element in the builder stack matches a lambda
 * @param fn a Lambda which takes an element and returns true for the desired condition
 * @returns the first parent element that satisfies the lambda, or null if none do
 */
function getBuilderParentIf(fn) {
    for (let i = dest_element_stack.length - 1; i >= 0; i--) {
        if (fn(dest_element_stack[i])) {
            return dest_element_stack[i];
        }
    }
    for (let i = src_element_stack.length - 1; i >= 0; i--) {
        if (fn(src_element_stack[i])) {
            return src_element_stack[i];
        }
    }
    for (let i = builder_element_stack.length - 1; i >= 0; i--) {
        if (fn(builder_element_stack[i])) {
            return builder_element_stack[i];
        }
    }
    return null; // no parent satisfied lambda
}
exports.getBuilderParentIf = getBuilderParentIf;
/**
 * See if any parent element, either in the builder stack, or src element tree, matches a lambda
 * @param fn a Lambda which takes an element and returns true for the desired condition
 * @returns the first parent element that satisfies the lambda, or null if none do
 */
function getParentIf(elmt, fn) {
    const bp = getBuilderParentIf(fn);
    if (bp != null) {
        return bp;
    }
    while (elmt !== null && elmt.nodeName != '#document-fragment' && elmt.tagName !== 'BODY') {
        if (fn(elmt)) {
            return elmt;
        }
        if (elmt.parentNode === document) {
            return null;
        }
        elmt = elmt.parentElement;
    }
    return null;
}
exports.getParentIf = getParentIf;
/**
 * Is the current stack of building elements currently inside an SVG tag.
 * @returns returns true if inside an SVG, unless further inside an EMBEDDED_OBJECT.
 */
function inSvgNamespace() {
    const elmt = getBuilderParentIf((e) => isTag(e, 'SVG') || isTag(e, 'FOREIGNOBJECT'));
    if (elmt) {
        return isTag(elmt, 'SVG');
    }
    return false;
}
exports.inSvgNamespace = inSvgNamespace;
/**
 * See if we are inside an existing <svg> tag. Or multiple!
 * @param elmt Any element
 * @returns How many <svg> tags are in its parent chain
 */
function getSvgDepth(elmt) {
    let s = 0;
    let parent = findParentOfTag(elmt, 'SVG');
    while (parent) {
        s++;
        parent = parent.parentElement ? findParentOfTag(parent.parentElement, 'SVG') : null;
    }
    return s;
}
/**
 * Look for control tags like for loops and if branches.
 * @param rootId: if true, search for known builder elements.
 * If a string (usually pageBody), start with that node.
 */
function expandControlTags(rootId) {
    let src = null;
    if (typeof (rootId) === 'string') {
        src = document.getElementById(rootId);
    }
    if (!src) {
        src = firstBuilderElement();
    }
    const ifResult = { passed: false, index: 0 };
    for (; src !== null; src = firstBuilderElement()) {
        try {
            initElementStack(src);
            let dest = [];
            if (isTag(src, ['if', 'elseif', 'else'])) {
                dest = startIfBlock(src, ifResult);
            }
            else {
                ifResult.index = 0; // Reset
                if (isTag(src, 'build')) {
                    dest = expandContents(src);
                }
                else if (isTag(src, 'for')) {
                    dest = startForLoop(src);
                }
                else if (isTag(src, 'use')) {
                    dest = useTemplate(src);
                }
                else if (isTag(src, exports.inputAreaTagNames)) {
                    dest = startInputArea(src);
                }
                else {
                    dest = [cloneWithContext(src)];
                }
            }
            const parent = src.parentNode;
            for (let d = 0; d < dest.length; d++) {
                const node = dest[d];
                parent?.insertBefore(node, src);
            }
            parent?.removeChild(src);
        }
        catch (ex) {
            const ctxerr = wrapContextError(ex, "expandControlTags", elementSourceOffset(src));
            if (shouldThrow(ctxerr, src)) {
                throw ctxerr;
            }
        }
    }
    initElementStack(null);
    // Call any post-builder method
    const fn = theBoiler().postBuild;
    if (fn) {
        fn();
    }
}
exports.expandControlTags = expandControlTags;
/**
 * Concatenate one list onto another
 * @param list The list to modified
 * @param add The list to add to the end
 */
function pushRange(list, add) {
    for (let i = 0; i < add.length; i++) {
        list.push(add[i]);
    }
}
exports.pushRange = pushRange;
/**
 * Append more than one child node to the end of a parent's child list
 * @param parent The parent node
 * @param add A list of new children
 */
function appendRange(parent, add) {
    for (let i = 0; i < add.length; i++) {
        parent.insertBefore(add[i], null);
    }
}
exports.appendRange = appendRange;
/**
 * Clone every node inside a parent element.
 * Any occurence of {curly} braces is in fact a lookup.
 * It can be in body text or an element attribute value
 * @param src The containing element
 * @param context A dictionary of all values that can be looked up
 * @returns A list of nodes
 */
function expandContents(src) {
    const dest = [];
    const ifResult = { passed: false, index: 0 };
    for (let i = 0; i < src.childNodes.length; i++) {
        const child = src.childNodes[i];
        if (child.nodeType == Node.ELEMENT_NODE) {
            const child_elmt = child;
            try {
                if (isTag(child_elmt, ['if', 'elseif', 'else'])) {
                    pushRange(dest, startIfBlock(child_elmt, ifResult));
                    continue;
                }
                ifResult.index = 0; // Reset
                if (isTag(child_elmt, 'for')) {
                    pushRange(dest, startForLoop(child_elmt));
                }
                else if (isTag(child_elmt, 'use')) {
                    pushRange(dest, useTemplate(child_elmt));
                }
                else if (isTag(child_elmt, exports.inputAreaTagNames)) {
                    pushRange(dest, startInputArea(child_elmt));
                }
                else if (isTag(child_elmt, 'template')) {
                    // <template> tags do not clone the same as others
                    throw new ContextError('Templates get corrupted when inside a build region. Define all templates at the end of the BODY');
                }
                else {
                    dest.push(cloneWithContext(child_elmt));
                }
            }
            catch (ex) {
                const ctxerr = wrapContextError(ex, "expandContents", elementSourceOffset(child_elmt));
                if (shouldThrow(ctxerr, child_elmt, src)) {
                    throw ctxerr;
                }
            }
        }
        else if (child.nodeType == Node.TEXT_NODE) {
            pushRange(dest, cloneTextNode(child));
        }
        else {
            dest.push(cloneNode(child));
        }
    }
    return dest;
}
exports.expandContents = expandContents;
/**
 * Some HTML elements and attributes are immediately acted upon by the DOM.
 * To delay that until after builds (especially <for> and <if>),
 * use any of three alternate naming schemes:
 *   _prefix or suffix_  Underscores will be removed.
 *   ddupe-letter        If the initial letter is duplicated, drop it.
 * The tag or attribute will be renamed when cloned, and the browser will treat it as a no-op until then.
 * @param name Any tag or attribute name
 * @returns The name, or the the name without the _ underscore or doubled initial letter
 */
function normalizeName(name) {
    if (name.substring(0, 1) == '_') {
        return name.substring(1);
    }
    if (name.substring(name.length - 1) == '_') {
        return name.substring(0, name.length - 1);
    }
    if (name.length >= 2 && name[0] == name[1]) {
        return name.substring(1);
    }
    // Any other interior underscores are kept
    return name;
}
exports.normalizeName = normalizeName;
const nameSpaces = {
    '': '',
    'svg': exports.svg_xmlns,
    's': exports.svg_xmlns,
    'html': null,
    'h': null,
};
/**
 * Deep-clone an HTML element
 * Note that element and attribute names with _prefix will be renamed without _
 * @param elmt The original element
 * @param context A dictionary of all accessible values
 * @returns A cloned element
 */
function cloneWithContext(elmt) {
    const tagName = normalizeName(elmt.localName);
    let clone;
    // if (tagName == 'svg' && elmt.namespaceURI != svg_xmlns) {
    //   console.warn("WARNING: <SVG> element missing xmlns='http://www.w3.org/2000/svg'");
    // }
    if (inSvgNamespace() || tagName == 'svg') {
        // TODO: contents of embedded objects aren't SVG
        clone = document.createElementNS(exports.svg_xmlns, tagName);
    }
    else if (elmt.getAttribute('xmlns') || elmt.getAttribute('xxmlns')) {
        const xmlns = elmt.getAttribute('xmlns') || elmt.getAttribute('xxmlns');
        clone = document.createElementNS(xmlns, tagName);
    }
    else {
        clone = document.createElement(tagName);
    }
    pushDestElement(clone);
    cloneAttributes(elmt, clone);
    const ifResult = { passed: false, index: 0 };
    for (let i = 0; i < elmt.childNodes.length; i++) {
        const child = elmt.childNodes[i];
        try {
            if (child.nodeType == Node.ELEMENT_NODE) {
                const child_elmt = child;
                if (isTag(child_elmt, ['if', 'elseif', 'else'])) {
                    appendRange(clone, startIfBlock(child_elmt, ifResult));
                    continue;
                }
                ifResult.index = 0; // Reset
                if (isTag(child_elmt, 'for')) {
                    appendRange(clone, startForLoop(child_elmt));
                }
                else if (isTag(child_elmt, 'use')) {
                    appendRange(clone, useTemplate(child_elmt));
                }
                else if (isTag(child_elmt, exports.inputAreaTagNames)) {
                    appendRange(clone, startInputArea(child_elmt));
                }
                else {
                    clone.appendChild(cloneWithContext(child_elmt));
                }
            }
            else if (child.nodeType == Node.TEXT_NODE) {
                appendRange(clone, cloneTextNode(child));
            }
            else {
                clone.insertBefore(cloneNode(child), null);
            }
        }
        catch (ex) {
            const ctxerr = wrapContextError(ex, "cloneWithContext", nodeSourceOffset(child));
            if (shouldThrow(ctxerr, child, elmt)) {
                throw ctxerr;
            }
        }
    }
    popDestElement();
    return clone;
}
/**
 * Splitting a text string by character is complicated when emoji are involved.
 * There are multiple ways glyphs can be combined or extended.
 * @param str A plain text string
 * @returns An array of strings that represent individual visible glyphs.
 */
function splitEmoji(str) {
    const glyphs = [];
    let joining = 0;
    let prev = 0;
    let code = 0;
    for (let ch of str) {
        // Track the current and previous characters
        prev = code;
        code = ch.length == 1 ? ch.charCodeAt(0)
            : ch.length == 2 ? (0x10000 + (((ch.charCodeAt(0) & 0x3ff) << 10) | (ch.charCodeAt(1) & 0x3ff)))
                : -1; // error
        if (code < 0) {
            // Expecting loop to always feed 1 UCS-4 character at a time
            throw new ContextError('Unexpected unicode combination: ' + ch + ' at byte ' + (glyphs.join('').length) + ' in ' + str);
        }
        else if (code >= 0xd800 && code <= 0xdf00) {
            // Half of surrogate pair
            throw new ContextError('Unexpected half of unicode surrogate: ' + code.toString(16) + ' at byte ' + (glyphs.join('').length) + ' in ' + str);
        }
        else if (code >= 0x1f3fb && code <= 0x1f3ff) {
            joining += 1; // Fitzpatrick skin-tone modifier
        }
        else if (code >= 0xfe00 && code <= 0xfe0f) {
            joining += 1; // Variation selectors
        }
        else if (code == 0x200d) {
            joining += 2; // this character plus next
        }
        else if (code >= 0x1f1e6 && code <= 0x1f1ff) {
            // Regional indicator symbols
            if (prev >= 0x1f1e6 && prev <= 0x1f1ff && glyphs[glyphs.length - 1].length == 2) {
                // Always come in pairs, so only join if the previous code was also one
                // and that hasn't already built a pair. Note, a pair of these is length==4
                joining += 1;
            }
        }
        else if (code >= 0xe0001 && code <= 0xe007f) {
            // Tags block
            if (prev != 0xe007f) { // Don't concat past a cancel tag
                joining += 1;
            }
        }
        if (joining > 0) {
            joining--;
            if (glyphs.length == 0) {
                throw new ContextError('Unexpected unicode join character ' + code.toString(16) + ' at byte 0 of ' + str);
            }
            const cur = glyphs.pop();
            ch = cur + ch;
        }
        glyphs.push(ch);
    }
    if (joining > 0) {
        throw new Error('The final emoji sequence expected ' + joining + ' additional characters');
    }
    return glyphs;
}
exports.splitEmoji = splitEmoji;
/**
 * Clone other node types, besides HTML elements and Text
 * @param node Original node
 * @returns A node to use in the clone
 */
function cloneNode(node) {
    return node; // STUB: keep original node
}
/**
 * Write a comment to the console.
 * Only applies if in trace mode. Otherwise, a no-op.
 * @param str What to write
 */
function consoleTrace(str) {
    if (isTrace()) {
        console.log(str);
    }
}
exports.consoleTrace = consoleTrace;
function consoleComment(str) {
    consoleTrace(str);
    if (isTrace()) {
        return [document.createComment(str)];
    }
    return [];
}
exports.consoleComment = consoleComment;
/*-----------------------------------------------------------
 * _builderContext.ts
 *-----------------------------------------------------------*/
/**
 * The root context for all builder functions
 * @returns the lookup object on the boiler.
 */
function theBoilerContext() {
    return theBoiler().lookup || {};
}
exports.theBoilerContext = theBoilerContext;
const contextStack = [];
/**
 * Get the current builder context.
 * If needed, initialized from boilerplate.lookup
 * @returns The top context on the stack.
 */
function getBuilderContext() {
    if (contextStack.length == 0) {
        contextStack.push(theBoilerContext());
    }
    return contextStack[contextStack.length - 1];
}
exports.getBuilderContext = getBuilderContext;
/**
 * Inject a builder context for testing purposes.
 * @param lookup Any object, or undefined to remove.
 */
function testBuilderContext(lookup) {
    theBoiler().lookup = lookup;
    contextStack.splice(0, contextStack.length); // clear
}
exports.testBuilderContext = testBuilderContext;
/**
 * Start a new top level builder context.
 * @param newContext If specified, this is the new context. If not, start from a clone of the current top context.
 * @returns The new context, which the caller may want to modify.
 */
function pushBuilderContext(newContext) {
    if (newContext === undefined) {
        newContext = structuredClone(getBuilderContext());
    }
    contextStack.push(newContext);
    return getBuilderContext();
}
exports.pushBuilderContext = pushBuilderContext;
/**
 * Pop the builder context stack.
 * @returns The new top-level builder context.
 */
function popBuilderContext() {
    contextStack.pop();
    return getBuilderContext();
}
exports.popBuilderContext = popBuilderContext;
/**
 * Try to look up a key in the current context level.
 * @param key A key name
 * @param maybe If true, and key does not work, return ''. If false/omitted, throw on bad keys.
 * @returns The value from that key, or undefined if not present
 */
function valueFromContext(key, maybe) {
    const context = getBuilderContext();
    return getKeyedChild(context, key, undefined, maybe);
}
exports.valueFromContext = valueFromContext;
/**
 * Look up a value, according to the context path cached in an attribute
 * @param path A context path
 * @param maybe If true, and key does not work, return ''. If false/omitted, throw on bad keys.
 * @returns Any JSON object
 */
function valueFromGlobalContext(path, maybe) {
    if (path) {
        return getKeyedChild(null, path, undefined, maybe);
    }
    return undefined;
}
exports.valueFromGlobalContext = valueFromGlobalContext;
/**
 * Finish cloning an HTML element
 * @param src The element being cloned
 * @param dest The new element, still in need of attributes
 */
function cloneAttributes(src, dest) {
    for (let i = 0; i < src.attributes.length; i++) {
        const name = normalizeName(src.attributes[i].name);
        let value = src.attributes[i].value;
        try {
            value = cloneText(value);
            if (name == 'id') {
                dest.id = value;
            }
            else if (name == 'class') {
                if (value) {
                    const classes = value.split(' ');
                    for (let i = 0; i < classes.length; i++) {
                        if (classes[i].length > 0) {
                            dest.classList.add(classes[i]);
                        }
                    }
                }
            }
            else if (name == 'xmlns') {
                // These are applied when the node is cloned, not here as an attribute
            }
            else {
                dest.setAttributeNS('', name, value);
            }
        }
        catch (ex) {
            throw wrapContextError(ex, 'cloneAttributes', elementSourceOffset(src, name));
        }
    }
}
exports.cloneAttributes = cloneAttributes;
/**
 * Finish cloning an HTML element
 * @param src The element being cloned
 * @param dest The new element, still in need of attributes
 * @param attributes A list of attributes we're willing to clone
 */
function cloneSomeAttributes(src, dest, attributes) {
    for (let i = 0; i < attributes.length; i++) {
        const name = attributes[i];
        try {
            let value = src.getAttributeNS('', name);
            if (value !== null && value !== undefined) {
                value = cloneText(value);
                dest.setAttributeNS('', name, value);
            }
        }
        catch (ex) {
            throw wrapContextError(ex, 'cloneAttributes', elementSourceOffset(src, name));
        }
    }
}
exports.cloneSomeAttributes = cloneSomeAttributes;
/**
 * Process a text node which may contain {curly} formatting.
 * @param text A text node
 * @returns A list with 1 or 0 text nodes
 */
function cloneTextNode(text) {
    const str = text.textContent || '';
    const trimMode = getTrimMode();
    if (trimMode === TrimMode.pre) {
        const cloned = complexAttribute(str, TrimMode.off);
        // Trim each line. Use 0xA0 to lock in intended line starts
        let lines = ('' + cloned).split('\n').map(l => simpleTrim(l));
        if (isTag(text.parentElement, 'pre')) {
            // The <pre> and </pre> tags often have their own boundary line breaks.
            // Trim a first blank link, after the opening <pre>
            if ((text.parentNode?.childNodes[0] === text) && lines[0] === '') {
                lines.splice(0, 1);
            }
            // Trim a final blank link, before the closing </pre>
            if ((text.parentNode?.childNodes[text.parentNode?.childNodes.length - 1] === text)
                && lines.length > 0 && lines[lines.length - 1] === '') {
                lines.splice(lines.length - 1, 1);
            }
        }
        const joined = lines.join('\n');
        return [document.createTextNode(joined)];
    }
    const cloned = complexAttribute(str, trimMode);
    if (cloned === '') {
        return [];
    }
    const node = document.createTextNode(cloned);
    return [node];
}
exports.cloneTextNode = cloneTextNode;
/**
 * Process text which may contain {curly} formatting.
 * @param text Any text, including text inside attributes
 * @returns Expanded text
 */
function cloneText(str) {
    if (str === null) {
        return '';
    }
    const trimMode = getTrimMode();
    const cloned = complexAttribute(str, Math.max(trimMode, TrimMode.on));
    return '' + cloned;
}
exports.cloneText = cloneText;
/**
 * Resolve an attribute, in situations where it can resolve to an object,
 * and not just text. If any portion is text, then the entire will concatenate
 * as text.
 * @param str the raw attribute
 * @param trim whether any whitespace should be trimmed while processing. By default, off.
 * @returns an object, if the entire raw attribute string is a {formula}.
 * Otherwise a string, which may simply be a clone of the original.
 */
function complexAttribute(str, trim = TrimMode.off) {
    if (str === null) {
        return '';
    }
    if (trim != TrimMode.off) {
        str = simpleTrim(str);
    }
    const list = tokenizeText(str);
    let buffer = '';
    for (let i = 0; i < list.length; i++) {
        if (!list[i].formula) {
            if (trim == TrimMode.all) {
                buffer += simpleTrim(list[i].text);
            }
            else {
                buffer += list[i].text;
            }
        }
        else {
            try {
                const complex = evaluateFormula(list[i].text);
                if (i == 0 && list.length == 1) {
                    return complex;
                }
                buffer += makeString(complex, list[i]);
            }
            catch (ex) {
                throw wrapContextError(ex, 'complexAttribute', list[i]);
            }
        }
    }
    return buffer;
}
exports.complexAttribute = complexAttribute;
/**
 * Trim a string without taking non-breaking-spaces
 * @param str Any string
 * @returns A substring
 */
function simpleTrim(str) {
    let s = 0;
    let e = str.length;
    while (s < e && (str.charCodeAt(s) || 33) <= 32) {
        s++;
    }
    while (--e > s && (str.charCodeAt(e) || 33) <= 32) {
        ;
    }
    return str.substring(s, e + 1);
}
var TokenType;
(function (TokenType) {
    TokenType[TokenType["unset"] = 0] = "unset";
    TokenType[TokenType["unaryOp"] = 1] = "unaryOp";
    TokenType[TokenType["binaryOp"] = 2] = "binaryOp";
    TokenType[TokenType["anyOperator"] = 3] = "anyOperator";
    TokenType[TokenType["openBracket"] = 16] = "openBracket";
    TokenType[TokenType["closeBracket"] = 32] = "closeBracket";
    TokenType[TokenType["anyBracket"] = 48] = "anyBracket";
    TokenType[TokenType["anyOperatorOrBracket"] = 255] = "anyOperatorOrBracket";
    TokenType[TokenType["word"] = 256] = "word";
    TokenType[TokenType["number"] = 512] = "number";
    TokenType[TokenType["spaces"] = 1024] = "spaces";
    TokenType[TokenType["anyText"] = 3840] = "anyText";
    TokenType[TokenType["node"] = 4096] = "node";
})(TokenType || (TokenType = {}));
/**
 * Divide up a string into sibling tokens.
 * Each token may be divisible into sub-tokens, but those are skipped here.
 * If we're not inside a {=formula}, the only tokens are { and }.
 * If we are inside a {=formula}, then operators and other brackets are tokens too.
 * @param str The parent string
 * @param inFormula True if str should be treated as already inside {}
 * @returns A list of token strings. Uninterpretted.
 * (Only exported for unit tests)
 */
function tokenizeFormula(str) {
    const tokens = [];
    const stack = []; // currently open brackets
    let tok = { text: '', type: TokenType.unset,
        source: str, offset: 0, length: 0 };
    let escape = false;
    const len = str.length;
    for (let i = 0; i <= str.length; i++) {
        const ch = i < str.length ? str[i] : '';
        if (ch == '`') {
            if (!escape) {
                escape = true;
                continue; // First one. Do nothing.
            }
            escape = false;
            // Fall through, and process second ` as normal text
        }
        const op = getOperator(ch);
        if (stack.length > 0 && !escape && ch == stack[stack.length - 1]) {
            // Found a matching close bracket
            stack.pop();
            if (tok.type != TokenType.unset) {
                tokens.push(tok);
            } // push any token in progress
            tokens.push(tok = { text: ch, type: TokenType.closeBracket,
                source: str, offset: i, length: 1 });
            tok = { text: '', type: TokenType.unset,
                source: str, offset: i + 1, length: 0 };
        }
        else if (!isInQuotes(stack) && !escape && (isBracketOperator(op) || isCloseBracket(op))) {
            // New open bracket, or unmatched close
            const type = isBracketOperator(op) ? TokenType.openBracket : TokenType.closeBracket;
            if (tok.type != TokenType.unset) {
                tokens.push(tok);
            } // push any token in progress
            tokens.push(tok = { text: ch, type: type,
                source: str, offset: i, length: 1 });
            if (type == TokenType.openBracket) {
                stack.push(op.closeChar); // cache the pending close bracket
            }
            tok = { text: '', type: TokenType.unset,
                source: str, offset: i + 1, length: 0 };
        }
        else if (!isInQuotes(stack) && !escape && op !== null) {
            // Found an operator
            let tt = TokenType.unset;
            if (isBinaryOperator(op)) {
                tt |= TokenType.binaryOp;
            }
            if (isUnaryOperator(op)) {
                tt |= TokenType.unaryOp;
            }
            if (tok.type != TokenType.unset) {
                tokens.push(tok);
            } // push any token in progress
            tokens.push(tok = { text: ch, type: tt,
                source: str, offset: i, length: 1 });
            tok = { text: '', type: TokenType.unset,
                source: str, offset: i + 1, length: 0 };
        }
        else {
            // Anything else is text
            if (escape && op == null) {
                tok.text += '`'; // Standalone escape. Treat as regular `
            }
            tok.text += ch;
            if (tok.text !== '') {
                tok.type = TokenType.anyText;
                tok.length = Math.min(i + 1, len) - tok.offset;
            }
        }
        escape = false;
    }
    if (tok.type != TokenType.unset) {
        tokens.push(tok); // push any token in progress
    }
    // Re-scan tokens, to clarify operator and text sub-types
    let prev = TokenType.unset;
    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.source == undefined || tok.offset == undefined || tok.length == undefined) {
            throw new CodeError('All tokens should know their source offset: ' + tok);
        }
        if (tok.type & TokenType.anyOperator) {
            if ((prev & (TokenType.word | TokenType.number | TokenType.closeBracket)) == 0) {
                // If no object (text or a closeBracket) precedes us, we're a unary operator
                // For example, consecutive operators mean all but the first are unary (since we have no post-fix unary operators)
                tok.type = TokenType.unaryOp;
                const op = getOperator(tok.text);
                tok.text = op.unaryChar ?? tok.text; // possibly substitute operator char
            }
            else if (tok.type & TokenType.anyOperator) {
                // When an object does precede us, then ambiguous operators are binary
                tok.type = TokenType.binaryOp;
                const op = getOperator(tok.text);
                tok.text = op.binaryChar ?? tok.text; // possibly substitute operator char
            }
        }
        else if (tok.type & TokenType.anyText) {
            if (simpleTrim(tok.text).length == 0) {
                tok.type = TokenType.spaces;
            }
            else if (isIntegerRegex(tok.text)) {
                tok.type = TokenType.number;
            }
            else {
                tok.type = TokenType.word;
            }
        }
        if (tok.type != TokenType.spaces) {
            prev = tok.type;
        }
    }
    return tokens;
}
exports.tokenizeFormula = tokenizeFormula;
function findCloseBracket(tokens, open) {
    const closes = [tokens[open]];
    for (let i = open + 1; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type == TokenType.closeBracket) {
            if (tok.text == bracketPairs[closes[closes.length - 1].text]) {
                closes.pop();
                if (closes.length == 0) {
                    return i;
                }
            }
            else {
                throw new ContextError('Unmatched close bracket', tok);
            }
        }
        else if (tok.type == TokenType.openBracket) {
            closes.push(tok);
        }
    }
    throw new ContextError('Missing close ' + (isStringBracket(closes[closes.length - 1].text) ? 'quotes' : 'brackets'), closes[closes.length - 1]);
}
/**
 * A node of a formula's expression, which can be combined into a binary tree.
 * Each node also has a parent pointer, to support tree restructuring.
 * A single node is one of:
 *   plain text (could be a number)
 *   a unary operation, with an operator and its operand
 *   a binary operation, with an operator and two operands
 * If an operation, the operand(s) are also FormulaNodes.
 * Nodes are decorated with any immediate bracket, which affects text parsing.
 * (Only exported for unit tests)
 */
class FormulaNode {
    constructor(value, right, left, span) {
        this.bracket = ''; // If this node is the root of a bracketed sub-formula, name the bracket char, else ''
        this.left = left;
        this.right = right;
        this.value = value;
        this.span = span ? span : value;
        if (right) {
            right.parent = this;
        }
        if (left) {
            left.parent = this;
        }
    }
    /**
     * Recreate the expression, as text
     * @returns A string equivalent (including any brackets or quotes it was found inside)
     */
    toString() {
        const rbrace = this.bracket === '' ? '' : bracketPairs[this.bracket];
        if (this.left) {
            return this.bracket + this.left.toString() + ' ' + this.value.text + ' ' + this.right?.toString() + rbrace;
        }
        else if (this.right) {
            return this.bracket + this.value.text + ' ' + this.right?.toString() + rbrace;
        }
        else {
            return this.bracket + this.value.text + rbrace;
        }
    }
    /**
     * Is this node plain-text?
     * @returns false if there is an operation and operands, else false
     */
    isSimple() {
        return !this.left && !this.right;
    }
    reRootContext() {
        return this.bracket == '[' || this.bracket == '{';
    }
    /**
     * Evaluate this node.
     * @param evalText if true, any simple text nodes are assumed to be named objects or numbers
     * else any simple text is just that. No effect for non-simple text.
     * @returns If it's a simple value, return it (any type).
     * If there's an operator and operands, return a type appropriate for that operator.
     */
    evaluate(evalText) {
        let result = undefined;
        if (this.left) {
            try {
                const op = getOperator(this.value.text);
                const bop = op.binaryOp;
                // right must also exist, because we're complete
                const lValue = this.left.evaluate(op.evalLeft);
                const rValue = this.right.evaluate(op.evalRight || this.right.reRootContext());
                if (!bop) {
                    throw new ContextError('Unrecognize binary operator', this.value);
                }
                result = bop(lValue, rValue, this.left?.span, this.right?.span);
                if (isTrace() && isDebug()) {
                    console.log(this.toString() + ' => ' + result);
                }
                if (result === undefined || Number.isNaN(result)) {
                    throw new ContextError('Operation ' + op?.raw + ' resulted in ' + result + ' : ' + lValue + op?.raw + rValue, this.value);
                }
            }
            catch (ex) {
                throw wrapContextError(ex, 'evaluate:binary', this.span);
            }
        }
        else if (this.right) {
            try {
                const op = getOperator(this.value.text);
                const uop = op.unaryOp;
                const rValue = this.right.evaluate(op.evalRight);
                if (!uop) {
                    throw new ContextError('Unrecognize unary operator', this.value);
                }
                result = uop(rValue, this.right?.span);
                if (isTrace() && isDebug()) {
                    console.log(this.toString() + ' => ' + result);
                }
                if (result === undefined || Number.isNaN(result)) {
                    throw new ContextError('Operation ' + op?.raw + ' resulted in ' + result + ' : ' + op?.raw + rValue, this.value);
                }
            }
            catch (ex) {
                throw wrapContextError(ex, 'evaluate:unary', this.span);
            }
        }
        else if (this.bracket === '\"' || this.bracket === '\'') {
            // Reliably plain text
            result = resolveEntities(this.value.text);
        }
        else {
            result = resolveEntities(this.value.text); // unless overridden below
            let trimmed = simpleTrim(result);
            // const maybe = result && trimmed[trimmed.length - 1] == '?';
            // if (maybe) {
            //   trimmed = trimmed.substring(0, trimmed.length - 1);
            //   if (evalText === undefined) {
            //     evalText = true;
            //   }
            // }
            // Could be plain text (or a number) or a name in context
            if (evalText === true) {
                const context = getBuilderContext();
                if (trimmed in context) {
                    result = context[trimmed];
                    result = resolveEntities(result);
                }
                // else if (maybe) {
                //   return '';  // Special case
                // }
                else if (isIntegerRegex(trimmed)) {
                    result = parseInt(trimmed);
                }
                else if (this.bracket == '{') {
                    throw new ContextError('Name lookup failed', this.span);
                }
            }
        }
        if (isTrace() && isDebug()) {
            console.log(this.value + ' => ' + result);
        }
        return result;
    }
}
exports.FormulaNode = FormulaNode;
/**
 * Does this string look like an integer?
 * @param str any text
 * @returns true if, once trimmed, it's a well-formed integer
 */
function isIntegerRegex(str) {
    return /^\s*-?\d+\s*$/.test(str);
}
/**
 * Of all the operators, find the one with the highest precedence.
 * @param tokens A list of tokens, which are a mix of operators and values
 * @returns The index of the first operator with the highest precedence,
 * or -1 if no remaining operators
 */
function findHighestPrecedence(tokens) {
    let precedence = -1;
    let first = -1;
    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type & TokenType.anyOperatorOrBracket) {
            const op = getOperator(tok.text ?? '');
            if (op) {
                if ((op.precedence || 0) > precedence) {
                    precedence = op.precedence;
                    first = i;
                }
            }
        }
    }
    return first;
}
/**
 * Create a merged token, which spans the range between (inclusive) two existing tokens.
 * @param first The first token in the span
 * @param last The last token in the span
 * @param node The node this token spans, if one. If omitted, the type is assumed to be text
 * @returns A new token
 */
function makeSpanToken(first, last, node) {
    const start = Math.min(first.offset, last.offset);
    const end = Math.max(first.offset + first.length, last.offset + last.length);
    const tok = {
        type: node ? TokenType.node : TokenType.word,
        node: node,
        source: first.source,
        text: unescapeOperators(first.source.substring(start, end)),
        offset: start,
        length: end - start,
    };
    return tok;
}
/**
 * An edge case, to create a blank token between existing tokens.
 * @param before The token prior to the empty token
 * @returns An empty token, correctly positioned.
 */
function makeEmptyToken(before) {
    const tok = {
        type: TokenType.spaces,
        source: before.source,
        text: '',
        offset: before.offset + before.length,
        length: 0,
    };
    return tok;
}
/**
 * 2nd pass of formula parser.
 * Uses operator precedence.
 * Finds the left-most of the highest-precedence operators.
 * Builds a node that binds that operator to its operand(s).
 * Replace that subset with the node, and repeat
 * @param tokens A sequence of tokens
 * @param bracket An encapsulating bracket, if any
 * @returns A single node
 * @throws an error if the formula is malformed: mismatched brackets or incomplete operators
 */
function treeifyFormula(tokens, bracket) {
    if (tokens.length == 0 && !bracket) {
        throw new CodeError('Cannot treeify without content');
    }
    const fullSpanTok = tokens.length > 0
        ? makeSpanToken(tokens[0], tokens[tokens.length - 1])
        : makeEmptyToken(bracket);
    if (bracket && isStringBracket(bracket.text)) {
        return new FormulaNode(fullSpanTok);
    }
    while (tokens.length > 0) {
        const opIndex = findHighestPrecedence(tokens);
        if (opIndex < 0) {
            // If well formed, there should only be a single non-space token left
            let node = undefined;
            for (let i = 0; i < tokens.length; i++) {
                const tok = tokens[i];
                if (tok.type != TokenType.spaces) {
                    if (node) {
                        // This is a 2nd token
                        // REVIEW: Alternatively invent a concatenation node
                        throw new ContextError('Consecutive tokens with no operator', tok);
                    }
                    if (tok.type == TokenType.node) {
                        node = tok.node;
                    }
                    else {
                        node = new FormulaNode(tok);
                        if (bracket) {
                            node.bracket = bracket.text;
                        }
                    }
                }
            }
            if (!node) {
                const tok = makeSpanToken(tokens[0], tokens[tokens.length - 1]);
                throw new ContextError('No value tokens in span', tok);
            }
            return node;
        }
        const opTok = tokens[opIndex];
        const ch = opTok.text;
        const op = getOperator(ch);
        if (isUnaryOperator(op)) {
            let r = opIndex + 1;
            while (r < tokens.length && tokens[r].type == TokenType.spaces) {
                r++;
            }
            if (r >= tokens.length) {
                throw new ContextError('Unary operator without following operand', opTok);
            }
            const rightSplit = tokens.splice(opIndex + 1, r - opIndex);
            const right = treeifyFormula(rightSplit);
            const node = new FormulaNode(opTok, right);
            const tok = makeSpanToken(opTok, rightSplit[rightSplit.length - 1], node);
            node.span = tok;
            tokens[opIndex] = tok;
        }
        else if (isBinaryOperator(op)) {
            let r = opIndex + 1;
            while (r < tokens.length && tokens[r].type == TokenType.spaces) {
                r++;
            }
            if (r >= tokens.length) {
                throw new ContextError('Binary operator without right operand', opTok);
            }
            const rightSplit = tokens.splice(opIndex + 1, r - opIndex);
            const right = treeifyFormula(rightSplit);
            let l = opIndex - 1;
            while (l >= 0 && tokens[l].type == TokenType.spaces) {
                l--;
            }
            if (l < 0) {
                throw new ContextError('Binary operator without left operand', opTok);
            }
            const leftSplit = tokens.splice(l, opIndex - l);
            const left = treeifyFormula(leftSplit);
            const node = new FormulaNode(opTok, right, left);
            const tok = makeSpanToken(leftSplit[0], rightSplit[rightSplit.length - 1], node);
            node.span = tok;
            tokens[l] = tok;
        }
        else if (isBracketOperator(op)) {
            const close = findCloseBracket(tokens, opIndex);
            const closeTok = tokens.splice(close, 1)[0];
            const nested = tokens.splice(opIndex + 1, close - opIndex - 1);
            const node = treeifyFormula(nested, opTok);
            node.bracket = op.raw;
            const tok = makeSpanToken(opTok, closeTok, node);
            node.span = tok;
            tokens[opIndex] = tok;
        }
        else {
            throw new ContextError('Unknown operator ' + ch, opTok);
        }
    }
    if (fullSpanTok.length == 0) {
        throw new ContextError('Empty brackets yield no value', bracket);
    }
    throw new ContextError('Treeify reduced to an empty span', fullSpanTok);
}
exports.treeifyFormula = treeifyFormula;
/**
 * Evaluate a formula
 * @param str A single formula. The bracketing {} are assumed.
 * @returns A single object, list, or string
 */
function evaluateFormula(str) {
    if (str === null) {
        return '';
    }
    try {
        const tokens = tokenizeFormula(str);
        const node = treeifyFormula(tokens);
        return node.evaluate(true);
    }
    catch (ex) {
        throw wrapContextError(ex, 'evaluateFormula');
    }
}
exports.evaluateFormula = evaluateFormula;
/**
 * Evaluate a single attribute of an HTML element
 * @param elmt The HTML element
 * @param attr The name of the attribute
 * @param implicitFormula Whether the contents of the attribute require {} to indicate a formula
 * @param required Whether the attribute is required, in which case it will throw if not present.
 * Otherwise it would return undefined
 * @param onerr What to return in the special case of an exception. If omitted, exceptions throw.
 * @returns Any data type
 */
function evaluateAttribute(elmt, attr, implicitFormula, required, onerr) {
    const val = elmt.getAttributeNS('', attr);
    if (!val) {
        if (required === false) { // true by default
            return val == '' ? '' : undefined; // empty string is interestingly different from missing
        }
        throw new ContextError('Missing required attribute: ' + attr, elementSourceOffset(elmt));
    }
    try {
        if (implicitFormula) {
            return evaluateFormula(val);
        }
        return complexAttribute(val);
    }
    catch (ex) {
        if (onerr !== undefined) {
            return onerr;
        }
        throw wrapContextError(ex, undefined, elementSourceOffset(elmt, attr));
    }
}
exports.evaluateAttribute = evaluateAttribute;
/* Context formula syntax has several components that need to play nicely with each other.
   Brackets:
     {} to start lookups
     [] to start secondary, nested lookups
     () to do operator precedence, within formulas
   Fields:
     a-z0-9_   normal javascript field name rules
     .         separator
     ?         indicates optional (sub-)fields
   Generated field suffixes:
     #  index in a loop
     !  value of a key
     $  ???
   Operators:
     +-*\%/   numeric operators
     &@       string operators
     .?:      object and context operators

 */
const bracketPairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    // '<': '>',  // should never be used for comparison operators in this context
    '"': '"',
    "'": "'",
};
/**
 * Most brackets can stack inside each other, but once we have quotes, we're done
 * @param stack a stack of pending close brackets, i.e. what we're inside of
 * @returns true if the innermost bracket is " or '
 */
function isInQuotes(stack) {
    return stack.length > 0
        && (stack[stack.length - 1] == '"' || stack[stack.length - 1] == '\'');
}
/**
 * Is this character normally a bracket, and therefore in need of escaping?
 * @param ch
 * @returns
 */
function isBracketChar(ch) {
    return ch in bracketPairs
        || ch == ')' || ch == ']' || ch == '}';
}
/**
 * Convert any type to a number, or throw in broken cases.
 * @param a Any data, but hopefully an int or float
 * @param tok The source offset, if caller knows it
 * @returns The float equivalent
 */
function makeFloat(a, tok) {
    const f = parseFloat(a);
    if (Number.isNaN(f)) {
        throw new ContextError('Not a number: ' + JSON.stringify(a), tok);
    }
    return f;
}
exports.makeFloat = makeFloat;
/**
 * Convert any type to an integer, or throw in broken cases.
 * @param a Any data, but hopefully an int
 * @param tok The source offset, if caller knows it
 * @returns The int equivalent
 */
function makeInt(a, tok) {
    if (typeof (a) == 'number') {
        if (Math.trunc(a) == a) {
            return a;
        }
    }
    else if (isIntegerRegex('' + a)) {
        return parseInt(a);
    }
    throw new ContextError('Not an integer: ' + a, tok);
}
exports.makeInt = makeInt;
/**
 * Convert any type to string, or throw in broken cases.
 * @param a Any data, but hopefully string-friendly
 * @param tok The source offset, if caller knows it
 * @returns The string equivalent
 */
function makeString(a, tok) {
    if (a === undefined || a === null || typeof (a) == 'object') {
        throw new ContextError('Bad cast to string: ' + JSON.stringify(a), tok);
    }
    return String(a);
}
exports.makeString = makeString;
const minus = { raw: '-', unaryChar: '⁻', binaryChar: '−' }; // ambiguously unary or binary minus
const optional = { raw: '?', unaryChar: '⸮', binaryChar: '¿' }; // ambiguously unary or binary optional child
const concat = { raw: '~', precedence: 1, binaryOp: (a, b, aa, bb) => { return makeString(a, aa) + makeString(b, bb); }, evalLeft: true, evalRight: true };
const entity = { raw: '@', precedence: 2, unaryOp: (a, aa) => { return entitize(a, aa); }, evalRight: false };
const plus = { raw: '+', precedence: 3, binaryOp: (a, b, aa, bb) => { return makeFloat(a, aa) + makeFloat(b, bb); }, evalLeft: true, evalRight: true };
const subtract = { raw: '−', precedence: 3, binaryOp: (a, b, aa, bb) => { return makeFloat(a, aa) - makeFloat(b, bb); }, evalLeft: true, evalRight: true };
const times = { raw: '*', precedence: 4, binaryOp: (a, b, aa, bb) => { return makeFloat(a, aa) * makeFloat(b, bb); }, evalLeft: true, evalRight: true };
const divide = { raw: '/', precedence: 4, binaryOp: (a, b, aa, bb) => { return makeFloat(a, aa) / makeFloat(b, bb); }, evalLeft: true, evalRight: true };
const intDivide = { raw: '\\', precedence: 4, binaryOp: (a, b, aa, bb) => { const f = makeFloat(a, aa) / makeFloat(b, bb); return f >= 0 ? Math.floor(f) : Math.ceil(f); }, evalLeft: true, evalRight: true }; // integer divide without Math.trunc
const modulo = { raw: '%', precedence: 4, binaryOp: (a, b, aa, bb) => { return makeFloat(a, aa) % makeFloat(b, bb); }, evalLeft: true, evalRight: true };
const negative = { raw: '⁻', precedence: 5, unaryOp: (a, aa) => { return -makeFloat(a, aa); }, evalRight: true };
const childObj = { raw: '.', precedence: 6, binaryOp: (a, b, aa, bb) => { return getKeyedChild(a, b, bb, false); }, evalLeft: true, evalRight: false };
const optionalChildObj = { raw: '¿', precedence: 6, binaryOp: (a, b, aa, bb) => { return getKeyedChild(a, b, bb, true); }, evalLeft: true, evalRight: false };
const rootObj = { raw: ':', precedence: 7, unaryOp: (a, aa) => { return getKeyedChild(null, a, aa); }, evalRight: false };
const optionalRootObj = { raw: '⸮', precedence: 7, unaryOp: (a, aa) => { return getKeyedChild(null, a, aa, true); }, evalRight: false };
const roundBrackets = { raw: '(', precedence: 8, closeChar: ')' };
const squareBrackets = { raw: '[', precedence: 8, closeChar: ']' };
const curlyBrackets = { raw: '{', precedence: 8, closeChar: '}' };
const closeRoundBrackets = { raw: ')', precedence: 0 };
const closeSquareBrackets = { raw: ']', precedence: 0 };
const closeCurlyBrackets = { raw: '}', precedence: 0 };
const singleQuotes = { raw: '\'', precedence: 10, closeChar: '\'' };
const doubleQuotes = { raw: '"', precedence: 10, closeChar: '"' };
const allOperators = [
    minus, optional,
    concat, plus, subtract, entity,
    times, divide, intDivide, modulo, negative,
    childObj, rootObj, optionalChildObj, optionalRootObj,
    roundBrackets, squareBrackets, curlyBrackets,
    closeRoundBrackets, closeSquareBrackets, closeCurlyBrackets,
    singleQuotes, doubleQuotes
];
// Convert the list to a dictionary, keyed on the raw string
// (accumulate each item in the list into a field in acc, which starts out as {})
const operatorLookup = allOperators.reduce((acc, obj) => { acc[obj.raw] = obj; return acc; }, {});
function isOperator(ch) {
    return ch in isOperator;
}
function getOperator(ch) {
    if (ch === null) {
        return null;
    }
    if (typeof ch === 'string') {
        if (ch in operatorLookup) {
            return operatorLookup[ch];
        }
        return null;
    }
    return ch;
}
function isUnaryOperator(ch) {
    const op = getOperator(ch);
    return op !== null
        && (op.unaryChar !== undefined || op.unaryOp !== undefined);
}
function isBinaryOperator(ch) {
    const op = getOperator(ch);
    return op !== null
        && (op.binaryChar !== undefined || op.binaryOp !== undefined);
}
function isBracketOperator(ch) {
    const op = getOperator(ch);
    return op !== null && op.closeChar !== undefined;
}
function isCloseBracket(ch) {
    const op = getOperator(ch);
    return op == closeRoundBrackets || op == closeSquareBrackets || op == closeCurlyBrackets;
}
function isStringBracket(ch) {
    const op = getOperator(ch);
    return op !== null && (op.raw == '"' || op.raw == '\'');
}
/**
 * A few common named entities
 */
const namedEntities = {
    'quot': '"',
    'apos': '\'',
    'lt': '<',
    'gt': '>',
    'lb': '{',
    'rb': '}',
    'lbrace': '{',
    'rbrace': '}',
    'amp': '&',
    'tilde': '~',
    'at': '@',
    'nbsp': '\xa0',
};
/**
 * Convert an entity term into simple text.
 * Note that the entity prefix is # rather than &, because & injects an actual entity, which becomes text before we see it.
 * Supports decimal @34; and hex @x22; and a few named like @quot;
 * @param str the contents of the entity, after the @, up to the first semicolon
 * @returns a single character, if known, else throws an exception
 */
function entitize(str, tok) {
    if (typeof (str) == 'number') {
        return String.fromCharCode(str);
    }
    str = makeString(str, tok);
    if (str) {
        str = simpleTrim(str);
        if (str.indexOf(';') == str.length - 1) {
            str = str.substring(0, str.length - 1);
        } // trim optional trailing semicolon
        if (str[0] == 'x' || str[0] == '#' || (str[0] >= '0' && str[0] <= '9')) {
            if (str[0] == '#') {
                str = str.substring(1);
            } // # isn't required, but allow it like HTML NCRs
            let code = 0;
            if (str[0] == 'x') {
                str = str.substring(1);
                code = parseInt(str, 16);
                // REVIEW: will fromCharCode work for codes > 0x10000?
            }
            else {
                code = parseInt(str, 10);
            }
            return String.fromCharCode(code);
        }
        if (str in namedEntities) {
            return namedEntities[str];
        }
    }
    if (tok) {
        throw new ContextError('Not a recognized entity: ' + str, tok);
    }
    return '';
}
/**
 * Find any entities in a text string, and convert to
 * Escape characters elsewhere are left.
 * @param raw A string which may contain `
 * @returns The unescapes, user-friendly string
 */
function resolveEntities(raw) {
    if (typeof (raw) != 'string') {
        return raw;
    }
    let str = '';
    let start = 0;
    while (start <= raw.length) {
        const at = raw.indexOf('@', start);
        if (at < 0) {
            str += raw.substring(start);
            break;
        }
        str += raw.substring(start, at);
        const semi = raw.indexOf(';', at + 1);
        if (semi < 0) {
            // Not a valid entity. Treat as plain text.
            str += raw.substring(at);
            break;
        }
        const ent = entitize(raw.substring(at + 1, semi + 1));
        if (ent == '') {
            // Ignore any malformed entities
            str += '@';
            start = at + 1;
        }
        else {
            str += ent;
            start = semi + 1;
        }
    }
    return str;
}
/**
 * Find the next instance of a character, making sure the character isn't escaped.
 * In our custom library, the escape character is a prefixed `
 * The only thing that can be escaped is brackets () [] {} "" '', and the ` itself.
 * Anywhere else, ` is simply that character.
 * @param raw The raw HTML content
 * @param find The character the search for
 * @param start The first position in the raw HTML
 * @returns the index of the character, if found, or else -1 if not found
 */
function findNonEscaped(raw, find, start) {
    while (start < raw.length) {
        let curly = raw.indexOf(find, start);
        if (curly > 0) {
            let esc = 0;
            while (curly - esc > 0 && raw[curly - esc - 1] == '`') {
                esc++;
            }
            if ((esc % 2) == 1) {
                // An odd number of back-slashes means the curly itself is escaped.
                // An even number means the back-slash is itself escaped, but not the curly
                start = curly + 1;
                continue;
            }
        }
        return curly;
    }
    return -1;
}
/**
 * Remove any escape characters preceding curly braces.
 * Since those braces have other meanings when not escaped,
 * then their sheer presence means they were escaped.
 * @param raw A string which may contain `{ or even ```{
 * @returns A somg;e
 */
function unescapeBraces(raw) {
    let str = '';
    let start = 0;
    while (start <= raw.length) {
        let i = raw.indexOf('`', start);
        if (i < 0) {
            str += raw.substring(start);
            break;
        }
        str += raw.substring(start, i);
        const ch = i + 1 < raw.length ? raw[i + 1] : '';
        if (ch == '`' || ch == '{' || ch == '}') {
            // drop the ` escape, and keep the next char
            str += ch;
            start = i + 2;
        }
        else {
            str += '`'; // not a real escape
            start = i + 1;
        }
    }
    return str;
}
/**
 * Remove any escape characters before operators.
 * Escape characters elsewhere are left.
 * @param raw A string which may contain `
 * @returns The unescapes, user-friendly string
 */
function unescapeOperators(raw) {
    let str = '';
    let start = 0;
    while (start <= raw.length) {
        let i = raw.indexOf('`', start);
        if (i < 0) {
            str += raw.substring(start);
            break;
        }
        str += raw.substring(start, i);
        const ch = i + 1 < raw.length ? raw[i + 1] : '';
        const op = getOperator(ch);
        if (op !== null || ch == '`') {
            str += ch; // The character after the escape
        }
        else {
            str += '`' + ch; // Not a real escape
        }
        start = i + 2;
    }
    return str;
}
/**
 * Parse text that occurs inside a built control element into tokens.
 * @param raw the raw document text
 * @param implicitFormula if true, the full text can be a formula without being inside {}.
 * (Only exported for unit tests)
 */
function tokenizeText(raw, implicitFormula) {
    implicitFormula = implicitFormula || false;
    const list = [];
    let start = 0;
    while (start < raw.length) {
        let curly = findNonEscaped(raw, '{', start);
        let errorClose = findNonEscaped(raw, '}', start);
        if (errorClose >= start && (curly < 0 || errorClose < curly)) {
            const src = { source: raw, offset: errorClose, length: 1 };
            throw new ContextError('Close-curly brace without an open brace.', src);
        }
        if (curly < 0) {
            break;
        }
        if (curly > start) {
            // Plain text prior to a formula
            const ttoken = {
                text: unescapeBraces(raw.substring(start, curly)),
                formula: false,
                source: raw,
                offset: start,
                length: curly - start,
            };
            list.push(ttoken);
        }
        let count = 1;
        let inner = curly + 1;
        while (count > 0) {
            let lb = findNonEscaped(raw, '{', inner);
            let rb = findNonEscaped(raw, '}', inner);
            if (rb < 0) {
                const src = { source: raw, offset: curly, length: 1 };
                throw new ContextError('Unclosed curly braces.', src);
            }
            if (lb >= 0 && lb < rb) {
                count++;
                inner = lb + 1;
            }
            else {
                count--;
                inner = rb + 1;
            }
        }
        // The contents of the formula (without the {} braces)
        const ftoken = {
            text: unescapeOperators(raw.substring(curly + 1, inner - 1)),
            formula: true,
            source: raw,
            offset: curly + 1,
            length: inner - 1 - curly - 1,
        };
        list.push(ftoken);
        start = inner;
    }
    if (start < raw.length) {
        // Any remaining plain text
        const isFormula = implicitFormula && start == 0;
        const ttoken = {
            text: isFormula ? unescapeOperators(raw) : unescapeBraces(raw.substring(start)),
            formula: isFormula,
            source: raw,
            offset: start,
            length: raw.length - start,
        };
        list.push(ttoken);
    }
    return list;
}
exports.tokenizeText = tokenizeText;
/**
 * Test a key in the current context
 * @param key A key, initially from {curly} notation
 * @returns true if key is a valid path within the context
 */
function keyExistsInContext(key) {
    try {
        const a = evaluateFormula(key);
        // null, undefined, or '' count as not existing
        return a !== null && a !== undefined && a !== '';
        // Note: empty {} and [] do count as existing.
    }
    catch {
        return false;
    }
}
exports.keyExistsInContext = keyExistsInContext;
/**
 * Enable lookups into the context by key name.
 * Keys can be paths, separated by dots (.)
 * Paths can have other paths as nested arguments, using [ ]
 * Note, the dot separator is still required.
 *   example: foo.[bar].fuz       equivalent to foo[{bar}].fuz
 *   example: foo.[bar.baz].fuz   equivalent to foo[{bar.baz}].fuz
 * Even arrays use dot notation: foo.0 is the 0th item in foo
 * @param key A key, initially from {curly} notation
 * @returns Resolved text
 */
function textFromContext(key) {
    const obj = evaluateFormula(key);
    return makeString(obj);
}
exports.textFromContext = textFromContext;
/**
 * Get a keyed child of a parent, where the key is either a dictionary key
 * or a list index or a string offset.
 * @param parent The parent object: a list, object, or string, which could in turn be the name of a list or object.
 * If null, the parent becomes the root boiler context.
 * @param key The identifier of the child: a dictionary key, a list index, or a string offset.
 * @param kTok The source offset of the token, if caller knows it.
 * @param maybe If true, and key does not work, return ''. If false/omitted, throw on bad keys.
 * @returns A child object, or a substring
 */
function getKeyedChild(parent, key, kTok, maybe) {
    if (parent === null) {
        // When !maybe && !parent, this is the root : operator.
        // When maybe && !parent, this is the maybe ? operator, which can be a <use> param.
        parent = maybe ? getBuilderContext() : theBoilerContext();
    }
    let index = undefined;
    if (typeof (key) == 'number') {
        index = key;
    }
    else if (isIntegerRegex('' + key)) {
        index = parseInt('' + key);
    }
    if (typeof (parent) == 'string') {
        // If the parent is a string, the only key we support is a character index
        if (index !== undefined) {
            if (index < 0 || index >= parent.length) {
                if (maybe) {
                    return '';
                }
                throw new ContextError('Index out of range: ' + index + ' in ' + parent, kTok);
            }
            return parent[index];
        }
        if (maybe) {
            return '';
        }
        throw new ContextError('Named fields are only available on objects: ' + key + ' in ' + JSON.stringify(parent), kTok);
    }
    if (index !== undefined && Array.isArray(parent)) {
        // Indexing into a list. Objects with keys that looks like numbers is handled below.
        if (index < 0 || index >= parent.length) {
            if (maybe) {
                return '';
            }
            throw new ContextError('Index out of range: ' + index + ' in ' + parent, kTok);
        }
        return parent[index];
    }
    // Named members of objects
    let trimmed = simpleTrim(key);
    // if (trimmed[trimmed.length - 1] == '?') {
    //   trimmed = trimmed.substring(0, trimmed.length - 1);
    //   maybe = true;
    // }
    if (!(trimmed in parent)) {
        if (maybe) {
            return '';
        }
        throw new ContextError('Key not found in context: ' + trimmed, kTok);
    }
    return parent[trimmed];
}
/*-----------------------------------------------------------
 * _builderFor.ts
 *-----------------------------------------------------------*/
/**
 * Potentially several kinds of for loops:
 * for each: <for each="var" in="list">  // ideas for optional args: first, last, skip
 * for char: <for char="var" in="text">  // every character in a string
 * for word: <for word="var" in="text">  // space-delimited substrings
 * for range: <for range="var" from="first" to="last" or until="after">
 * for key: <for key="var" in="object">  // idea for optional arg: sort
 * @param src the <for> element
 * @param context the set of values that might get used by the for loop
 * @returns a list of nodes, which will replace this <for> element
 */
function startForLoop(src) {
    const dest = [];
    pushRange(dest, consoleComment(debugTagAttrs(src)));
    let iter = null;
    let list = [];
    let vals = []; // not always used
    // <for each="variable_name" in="list">
    iter = getIterationVariable(src, 'each');
    if (iter) {
        list = parseForEach(src);
    }
    else {
        iter = getIterationVariable(src, 'char');
        if (iter) {
            list = parseForText(src, '');
        }
        else {
            iter = getIterationVariable(src, 'word');
            if (iter) {
                list = parseForText(src, ' ');
            }
            else {
                iter = getIterationVariable(src, 'key');
                if (iter) {
                    list = parseForKey(src);
                    vals = list[1];
                    list = list[0];
                }
                else {
                    // range and int are synonyms
                    iter = getIterationVariable(src, 'range') || getIterationVariable(src, 'int');
                    if (iter) {
                        list = parseForRange(src);
                    }
                    else {
                        throw new ContextError('Unrecognized <for> tag type', elementSourceOffset(src));
                    }
                }
            }
        }
    }
    if (!list) {
        throw new ContextError('Unable to determine loop', elementSourceOffset(src));
    }
    pushRange(dest, consoleComment('Iterating ' + iter + ' over ' + list.length + ' items...'));
    pushBuilderElement(src);
    const inner_context = pushBuilderContext();
    const iter_index = iter + '#';
    for (let i = 0; i < list.length; i++) {
        pushRange(dest, consoleComment(iter + ' #' + i + ' == ' + JSON.stringify(list[i])));
        inner_context[iter_index] = i;
        inner_context[iter] = list[i];
        if (vals.length > 0) {
            // Used only for iterating over dictionaries.
            // {iter} is each key, so {iter!} is the matching value
            inner_context[iter + '!'] = vals[i];
        }
        pushRange(dest, expandContents(src));
    }
    popBuilderContext();
    popBuilderElement();
    return dest;
}
exports.startForLoop = startForLoop;
/**
 * Read an attribute of the <for> tag, looking for the iteration variable name.
 * @param src The <for> element
 * @param attr The attribute name
 * @returns A string, if found, or null if that attribute was not used.
 * @throws an error if the name is malformed - something other than a single word
 */
function getIterationVariable(src, attr) {
    const iter = src.getAttributeNS('', attr);
    if (!iter) {
        return null;
    }
    // Iteration variables need to be a single word. No punctuation.
    if (/^[a-zA-Z]+$/.test(iter)) {
        return iter;
    }
    throw new ContextError('For loop iteration variable must be a single word: ' + iter, elementSourceOffset(src, attr));
}
/**
 * Syntax: <for each="var" in="list">
 * @param src
 * @param context
 * @returns a list of elements
 */
function parseForEach(src) {
    const obj = evaluateAttribute(src, 'in', true);
    if (Array.isArray(obj)) {
        return obj;
    }
    evaluateAttribute(src, 'in', true); // Retry for debugging
    throw new ContextError("For each's in attribute must indicate a list", elementSourceOffseter(src, 'in'));
}
function parseForText(src, delim) {
    const tok = elementSourceOffset(src, 'in');
    const obj = evaluateAttribute(src, 'in', true);
    const str = makeString(obj, tok);
    if (delim == '') { // When splitting every character, we still want to keep graphemes together
        return splitEmoji(str);
    }
    return str.split(delim);
}
function parseForRange(src) {
    const from = evaluateAttribute(src, 'from', true, false);
    const until = evaluateAttribute(src, 'until', true, false);
    const last = evaluateAttribute(src, 'to', true, false);
    const length = evaluateAttribute(src, 'len', true, false);
    const step = evaluateAttribute(src, 'step', true, false);
    const start = from ? makeInt(from, elementSourceOffseter(src, 'from')) : 0;
    let end = until ? makeInt(until, elementSourceOffseter(src, 'until'))
        : last ? (makeInt(last, elementSourceOffseter(src, 'last')) + 1)
            : length ? (makeString(length, elementSourceOffseter(src, 'len'))).length
                : start;
    const inc = step ? makeInt(step, elementSourceOffseter(src, 'step')) : 1;
    if (inc == 0) {
        throw new ContextError("Invalid loop step. Must be non-zero.", elementSourceOffseter(src, 'step'));
    }
    if (!until && inc < 0) {
        end -= 2; // from 5 to 1 step -1 means i >= 0
    }
    const list = [];
    for (let i = start; inc > 0 ? (i < end) : (i > end); i += inc) {
        list.push(i);
    }
    return list;
}
function parseForKey(src) {
    const obj = evaluateAttribute(src, 'in', true);
    try {
        const keys = Object.keys(obj);
        const vals = keys.map(k => obj[k]);
        return [keys, vals];
    }
    catch (ex) {
        throw new ContextError('Not an object with keys: ' + obj, elementSourceOffset(src, 'in'), ex);
    }
}
/**
 * Potentially several kinds of if expressions:
 *   equality: <if test="var" eq="value">
 *   not-equality: <if test="var" ne="value">
 *   less-than: <if test="var" lt="value">
 *   less-or-equal: <if test="var" le="value">
 *   greater-than: <if test="var" gt="value">
 *   greater-or-equal: <if test="var" ge="value">
 *   contains: <if test="var" in="value">
 *   not-contains: <if test="var" ni="value">
 *   boolean: <if test="var">
 * @param src the <if>, <elseif>, or <else> element
 * @param result in/out parameter that determines whether any sibling in a sequence of if/else-if/else tags has passed yet
 * @returns a list of nodes, which will replace this <if> element
 */
function startIfBlock(src, result) {
    const dest = [];
    try {
        traceTagComment(src, dest, true);
        if (isTag(src, 'if')) {
            result.index = 1;
            // Each <if> tag resets the group's passed state
            result.passed = false;
        }
        else {
            if (result.index < 1) {
                throw new ContextError(src.tagName + ' without preceding <if>', elementSourceOffset(src));
            }
            if (isTag(src, 'else')) {
                result.index = -result.index;
            }
            else {
                result.index++;
            }
            if (result.passed) {
                // A prior sibling already passed, so all subsequent elseif and else blocks should abort.
                return [];
            }
        }
        let exists = evaluateAttribute(src, 'exists', false, false, false);
        let notex = evaluateAttribute(src, 'notex', false, false, true);
        let not = evaluateAttribute(src, 'not', true, false);
        let test = evaluateAttribute(src, 'test', true, false);
        if (isTag(src, 'else')) {
            result.passed = true;
        }
        else if (src.hasAttributeNS('', 'exists') || src.hasAttributeNS('', 'notex')) {
            if (exists === false || notex === true) {
                // Special case: calling one of these threw an exception, which is still informative
                result.passed = notex ? true : exists;
            }
            else if (src.hasAttributeNS('', 'exists')) {
                // Does this attribute exist at all?
                result.passed = exists;
            }
            else {
                // Does this attribute exist at all?
                result.passed = !notex;
            }
        }
        else if (not !== undefined) {
            result.passed = (not === 'false') || (not === '') || (not === null);
        }
        else if (test !== undefined) {
            const testTok = elementSourceOffseter(src, 'test');
            let value;
            if ((value = evaluateAttribute(src, 'eq', false, false)) !== undefined) {
                result.passed = test === value; // REVIEW: no casting of either
            }
            else if ((value = evaluateAttribute(src, 'ne', false, false)) !== undefined) { // not-equals
                result.passed = test !== value; // REVIEW: no casting of either
            }
            else if (value = evaluateAttribute(src, 'lt', false, false)) { // less-than
                result.passed = makeFloat(test, testTok) < makeFloat(value, elementSourceOffseter(src, 'lt'));
            }
            else if (value = evaluateAttribute(src, 'le', false, false)) { // less-than or equals
                result.passed = makeFloat(test, testTok) <= makeFloat(value, elementSourceOffseter(src, 'le'));
            }
            else if (value = evaluateAttribute(src, 'gt', false, false)) { // greater-than
                result.passed = makeFloat(test, testTok) > makeFloat(value, elementSourceOffseter(src, 'gt'));
            }
            else if (value = evaluateAttribute(src, 'ge', false, false)) { // greater-than or equals
                result.passed = makeFloat(test, testTok) >= makeFloat(value, elementSourceOffseter(src, 'ge'));
            }
            else if (value = evaluateAttribute(src, 'in', false, false)) { // string contains
                if (Array.isArray(value)) {
                    result.passed = value.indexOf(test) >= 0;
                }
                else if (typeof (value) === 'string') {
                    result.passed = value.indexOf(test) >= 0;
                }
                else if (typeof (value) === 'object') {
                    result.passed = test in value;
                }
                else {
                    throw new ContextError(typeof (value) + " value does not support 'in' queries", elementSourceOffset(src, 'in'));
                }
            }
            else if (value = evaluateAttribute(src, 'ni', false, false)) { // string doesn't contain
                if (Array.isArray(value)) {
                    result.passed = value.indexOf(test) < 0;
                }
                else if (typeof (value) === 'string') {
                    result.passed = value.indexOf(test) < 0;
                }
                else if (typeof (value) === 'object') {
                    result.passed = !(test in value);
                }
                else {
                    throw new ContextError(typeof (value) + " value does not support 'not-in' queries", elementSourceOffset(src, 'in'));
                }
            }
            else if (value = evaluateAttribute(src, 'regex', false, false)) { // regular expression
                const re = new RegExp(value);
                result.passed = re.test(test);
            }
            else { // simple boolean
                result.passed = test === true || test === 'true';
            }
        }
        else {
            throw new ContextError('<' + src.localName + '> elements must have an evaluating attribute: test, not, exists, or notex');
        }
    }
    catch (ex) {
        const ctxerr = wrapContextError(ex, 'startIfBlock', elementSourceOffset(src));
        if (shouldThrow(ctxerr, src)) {
            throw ctxerr;
        }
    }
    if (result.passed) {
        pushBuilderElement(src);
        pushRange(dest, expandContents(src));
        popBuilderElement();
    }
    return dest;
}
exports.startIfBlock = startIfBlock;
/*-----------------------------------------------------------
 * _builderInput.ts
 *-----------------------------------------------------------*/
exports.inputAreaTagNames = [
    'letter', 'letters', 'literal', 'number', 'numbers', 'pattern', 'word', 'extract'
];
// Note that the same input attribute can be a key in multiple conversion fields.
// For example, it could trigger a spanClass, and also an optional style,
// and also get renamed or special cased. The last two should not coexit.
// Separate from anything keyed explicitly, anything else copies verbatim.
const inputAttributeConversions = {
    '': {
        span: {},
        input: {}
    },
    letter: {
        inherit: '',
        spanClass: {
            '': 'letter-cell',
            block: 'block',
            literal: 'literal',
            extract: 'extract',
            'copy-id': 'copy-extracter',
        },
        spanRename: {
            'extracted-id': 'data-extracted-id',
            'copy-id': 'data-copy-id', // Source of extraction
        },
        optionalStyle: {
            '': 'letter',
            literal: 'literal',
            extract: 'extract'
        },
        specialCases: {
            extract: underNumberExtracts,
            literal: specialLiterals,
            block: specialLiterals, // this letter will extract (if a number, then under-numbered)
        }
    },
    letters: {
        inherit: 'letter',
        spanClass: {
            '': 'multiple-letter', // A few letters, squeezed together
        }
    },
    number: {
        inherit: 'letter',
        spanClass: {
            '': 'numeric', // Constrain input to decimal digits (or - or .)
        }
    },
    numbers: {
        inherit: 'number',
        spanClass: {
            '': 'multiple-letter', // Same as letters, but just numbers
        }
    },
    literal: {
        inherit: 'letter',
        spanClass: {
            '': 'literal'
        },
        optionalStyle: {
            '': 'literal',
        },
        specialCases: {
            '': specialLiterals,
            'block': specialLiterals, // literal rendered as a dark block
        }
    },
    word: {
        inherit: '',
        spanClass: {
            '': 'word-cell',
            literal: 'literal',
            'copy-id': 'copy-extracter',
            // TODO: numbers (destination)
        },
        spanRename: {
            extract: 'data-extract-index',
            'extracted-id': 'data-extracted-id',
            'copy-id': 'data-copy-id', // Source of extraction
        },
        specialCases: {
            literal: specialLiterals,
            block: specialLiterals,
        },
        optionalStyle: {
            '': 'word',
        }
    },
    pattern: {
        inherit: '',
        spanClass: {
            '': 'letter-cell-block',
            pattern: 'create-from-pattern',
            extracted: 'create-from-pattern extracted',
            'extract-numbered': 'create-from-pattern extracted',
            'extract-lettered': 'create-from-pattern extracted',
        },
        spanRename: {
            pattern: 'data-letter-pattern',
            extract: 'data-extract-indeces',
            numbers: 'data-number-assignments',
            'extracted-id': 'data-extracted-id',
            // Extracted cases
            extracted: 'data-extracted-pattern',
            'extract-numbered': 'data-extract-numbered',
            'extract-lettered': 'data-extract-lettered', // same as numbered, but under-numbers are alphabetic
        },
    },
    extract: {
        inherit: '',
        spanClass: {
            '': 'extract-literal',
            word: 'word-input',
            letter: 'extract-input',
            letters: 'extract-input',
        },
        spanRename: {
            word: 'value',
            letter: 'value',
            letters: 'value',
            'copy-id': 'data-copy-id', // Source of extraction
        },
        optionalStyle: {
            '': 'hidden',
        }
    },
};
/**
 * If a <letter> has an extract attribute, check if its value is numeric.
 * If so, set up the under-number.
 * @param extract The value of the extract attribute
 * @param span The span that  will contain an input
 */
function underNumberExtracts(extract, span) {
    if (parseInt(extract) > 0) {
        toggleClass(span, 'numbered', true);
        toggleClass(span, 'extract-numbered', true);
        span.setAttributeNS('', 'data-number', extract);
        const under = document.createElement('span');
        toggleClass(under, 'under-number');
        under.innerText = extract;
        span.appendChild(under);
    }
}
function specialLiterals(literal, span) {
    if (literal === '¤') {
        toggleClass(span, 'block', true);
        literal = ' ';
    }
    span.appendChild(document.createTextNode(literal));
}
function startInputArea(src) {
    const span = document.createElement('span');
    traceTagComment(src, span, true);
    // Copy most attributes. 
    // Special-cased ones are harmless - no meaning in generic spans
    cloneAttributes(src, span);
    let optionalStyleSet = undefined;
    let conversion = inputAttributeConversions[src.localName.toLowerCase()];
    while (conversion) {
        // Apply any classes to the span
        if (conversion.spanClass) {
            if (conversion.spanClass['']) {
                applyAllClasses(span, conversion.spanClass['']);
            }
            const keys = Object.keys(conversion.spanClass);
            for (let i = 0; i < keys.length; i++) {
                if (src.getAttributeNS('', keys[i]) !== null) {
                    applyAllClasses(span, conversion.spanClass[keys[i]]);
                }
            }
        }
        // Which group of optional styles should be applied. First one wins.
        if (conversion.optionalStyle && !optionalStyleSet) {
            const keys = Object.keys(conversion.optionalStyle);
            for (let i = 0; i < keys.length; i++) {
                if (src.getAttributeNS('', keys[i]) !== null) {
                    optionalStyleSet = conversion.optionalStyle[keys[i]];
                    break;
                }
            }
            if (!optionalStyleSet && '' in conversion.optionalStyle) {
                optionalStyleSet = conversion.optionalStyle[''];
            }
        }
        // Rename some attributes
        if (conversion.spanRename) {
            const keys = Object.keys(conversion.spanRename);
            for (let i = 0; i < keys.length; i++) {
                const attr = src.getAttributeNS('', keys[i]);
                if (attr !== null) {
                    span.setAttributeNS('', conversion.spanRename[keys[i]], cloneText(attr));
                }
            }
        }
        // Some attributes need custom handling
        if (conversion.specialCases) {
            const keys = Object.keys(conversion.specialCases);
            for (let i = 0; i < keys.length; i++) {
                const attr = src.getAttributeNS('', keys[i]);
                if (attr !== null) {
                    const func = conversion.specialCases[keys[i]];
                    func(cloneText(attr), span);
                }
            }
            if ('' in conversion.specialCases && src.innerText.length > 0) {
                // Special case any innerText
                const func = conversion.specialCases[''];
                func(cloneText(src.innerText), span);
            }
        }
        // Repeat with any additional inherited rules
        conversion = conversion.inherit ? inputAttributeConversions[conversion.inherit] : undefined;
    }
    if (optionalStyleSet) {
        // This tag accepts one of the groups of optional styles
        let styles = getLetterStyles(src, 'underline', 'none', 'box');
        applyAllClasses(span, styles[optionalStyleSet]);
    }
    if (src.localName !== 'literal' && src.childNodes.length > 0) {
        throw new ContextError('Input tags like <' + src.localName + '/> should be empty elements', nodeSourceOffset(src.childNodes[0]));
    }
    return [span];
}
exports.startInputArea = startInputArea;
/**
 * Replace a <use> tag with the contents of a <template>.
 * Along the way, push any attributes of the <use> tag onto the context.
 * Also push the context paths (as strings) as separate attributes.
 * Afterwards, pop them all back off.
 * Optionally, a <use> tag without a template="" attribute is a way to modify the context for the use's children.
 * @param node a <use> tag, whose attributes are cloned as arguments
 * @param tempId The ID of a template to invoke. If not set, the ID should be in node.template
 * @returns An array of nodes to insert into the document in place of the <use> tag
 */
function useTemplate(node, tempId) {
    let dest = [];
    if (!tempId) {
        tempId = node.getAttribute('template');
        if (!tempId) {
            throw new ContextError('<use> tag must specify a template attribute');
        }
        tempId = cloneText(tempId);
    }
    let template = null;
    try {
        template = getTemplate(tempId);
        if (!template.content) {
            throw new ContextError('Invalid template (no content): ' + tempId);
        }
    }
    catch (ex) {
        const ctxerr = wrapContextError(ex, 'useTemplate', elementSourceOffset(node, 'template'));
        if (shouldThrow(ctxerr, node)) {
            throw ctxerr;
        }
        template = null;
    }
    if (template) {
        const passed_args = parseUseNodeArgs(node, template);
        overlayDefaultTemplateArgs(template, passed_args);
        try {
            const inner_context = pushTemplateContext(passed_args);
            pushBuilderElement(node); // the <use> node
            if (!tempId) {
                tempId = node.getAttribute('template');
            }
            if (tempId) {
                const template = getTemplate(tempId);
                if (!template) {
                    throw new ContextError('Template not found: ' + tempId, elementSourceOffset(node, 'template'));
                }
                if (!template.content) {
                    throw new ContextError('Invalid template (no content): ' + tempId, elementSourceOffset(node, 'template'));
                }
                // Push both the <use> and <template> nodes
                pushBuilderElement(template);
                // The template doesn't have any child nodes. Its content must first be cloned.
                const clone = template.content.cloneNode(true);
                dest = expandContents(clone);
                popBuilderElement();
            }
            else {
                dest = expandContents(node);
            }
            popBuilderElement();
        }
        catch (ex) {
            const ctxerr = wrapContextError(ex, 'useTemplate', elementSourceOffset(node));
            if (shouldThrow(ctxerr, node, template)) {
                throw ctxerr;
            }
        }
        popBuilderContext();
    }
    return dest;
}
exports.useTemplate = useTemplate;
/**
 * Parse a <use> node to get the template arguments
 * @param node The <use> node
 * @param template The targeted <template> node
 */
function parseUseNodeArgs(node, template) {
    // We need to build the values to push onto the context, without changing the current context.
    // Do all the evaluations first, and cache them.
    const passed_args = [];
    for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i].name;
        const val = node.attributes[i].value;
        const attri = attr.toLowerCase();
        try {
            if (attri != 'template' && attri != 'class') {
                const arg = {
                    attr: attr,
                    raw: val,
                    text: cloneText(val),
                    any: complexAttribute(val),
                };
                passed_args.push(arg);
            }
        }
        catch (ex) {
            const ctxerr = wrapContextError(ex, 'parseUseNodeArgs', elementSourceOffset(node, attr));
            if (shouldThrow(ctxerr, node, template)) {
                throw ctxerr;
            }
        }
    }
    return passed_args;
}
/**
 * Parse an object's top-level keys as if they were the attributes of a <use> node
 * @param arg A dictionary of keys (attribute names) to values (attribute contents)
 * @returns A list of template arguments.
 */
function parseObjectAsUseArgs(args) {
    if (!args) {
        return [];
    }
    const passed_args = [];
    const keys = Object.keys(args);
    for (let i = 0; i < keys.length; i++) {
        const attr = keys[i];
        const val = args[attr];
        const attri = attr.toLowerCase();
        try {
            // Names that are invalid on a <use> node are invalid here too
            if (attri != 'template' && attri != 'class') {
                const arg = {
                    attr: attr,
                    raw: '',
                    text: JSON.stringify(val),
                    any: val,
                };
                passed_args.push(arg);
            }
        }
        catch (ex) {
            throw wrapContextError(ex, 'parseObjectAsUseArgs');
        }
    }
    return passed_args;
}
/**
 * See if the template has default arguments. If so, and if the <use> element didn't
 * specify a value, then plug in the default arg as if it was specified in the <use>
 * @param template The template element
 * @param use_args The args from parseObjectAsUseArgs
 * @remarks can modify use_args
 */
function overlayDefaultTemplateArgs(template, use_args) {
    for (let i = 0; i < template.attributes.length; i++) {
        const attr = template.attributes[i].name;
        if (!attr.startsWith('default-')) {
            continue;
        }
        const attri = attr.substring(8); // strip 'default-' prefix
        if (use_args.some(a => a.attr == attri)) {
            continue;
        }
        const val = template.attributes[i].value;
        try {
            const arg = {
                attr: attri,
                raw: val,
                text: cloneText(val),
                any: complexAttribute(val),
            };
            use_args.push(arg);
        }
        catch (ex) {
            const ctxerr = wrapContextError(ex, 'overlayDefaultTemplateArgs');
            if (shouldThrow(ctxerr, template)) {
                throw ctxerr;
            }
        }
    }
}
/**
 * Build a template-ready context from a set of template arguments
 * @param passed_args Arguments, as created from a <use> node
 * @returns The inner context. Caller MUST POP CONTEXT AFTERWARDS.
 */
function pushTemplateContext(passed_args) {
    // Push a new context for inside the <use>.
    // Each passed arg generates 3 usable context entries:
    //  arg = 'text'          the attribute, evaluated as text
    //  arg! = *any*          the attribute, evaluated as any
    //  arg$ = unevaluated    the raw contents of the argument attribute, unevaluated.
    const inner_context = pushBuilderContext();
    for (let i = 0; i < passed_args.length; i++) {
        const arg = passed_args[i];
        inner_context[arg.attr] = arg.any;
        inner_context[arg.attr + '!'] = arg.text;
        inner_context[arg.attr + '$'] = arg.raw;
        if (isTrace()) {
            console.log('Use template arg #' + i + ': ' + arg.attr + ' = ' + JSON.stringify(arg.any));
            console.log('Use template arg #' + i + ': ' + arg.attr + '! = ' + arg.text);
            console.log('Use template arg #' + i + ': ' + arg.attr + '$ = ' + arg.raw);
        }
    }
    return inner_context;
}
/**
 * Replace the current contents of a parent element with
 * the contents of a template.
 * @param parent Parent element to refill. Existing contents will be cleared.
 * @param tempId ID of a <template> element
 * @param arg an object whose keys and values will become the arguments to the template.
 * @returns The first injected element
 */
function refillFromTemplate(parent, tempId, args) {
    return injectFromTemplate(parent, refillFromNodes, tempId, args);
}
exports.refillFromTemplate = refillFromTemplate;
/**
 * Appen the contents of a template after any existing children of a parent
 * @param parent Parent element to append to.
 * @param tempId ID of a <template> element
 * @param arg an object whose keys and values will become the arguments to the template.
 * @returns The first injected element
 */
function appendFromTemplate(parent, tempId, args) {
    return injectFromTemplate(parent, appendFromNodes, tempId, args);
}
exports.appendFromTemplate = appendFromTemplate;
/**
 * Expand a template, and then inject the contents into a parent, subject to an injection function.
 * @param parent Parent element to refill. Existing contents will be cleared.
 * @param callback The method of injecting the template contents into the parent.
 * @param tempId ID of a <template> element
 * @param arg an object whose keys and values will become the arguments to the template.
 * @returns The first injected element, if any (ignoring any prefing text). If no elements, can return text.
 */
function injectFromTemplate(parent, callback, tempId, args) {
    if (!tempId) {
        throw new ContextError('Template ID not specified');
    }
    const template = getTemplate(tempId);
    if (!template) {
        throw new ContextError('Template not found: ' + tempId);
    }
    if (!template.content) {
        throw new ContextError('Invalid template (no content): ' + tempId);
    }
    // Make sure we know the stack of our destination
    initElementStack(parent);
    let first = undefined;
    try {
        const passed_args = parseObjectAsUseArgs(args ?? {});
        pushTemplateContext(passed_args);
        pushBuilderElement(template);
        // The template doesn't have any child nodes. Its content must first be cloned.
        const clone = template.content.cloneNode(true);
        const dest = expandContents(clone);
        // Identify the first interesting child of the template. Ideally, the first element.
        first = dest.filter(d => d.nodeType == Node.ELEMENT_NODE)[0];
        if (!first) {
            first = dest[0];
        }
        popBuilderElement();
        callback(parent, dest);
    }
    catch (ex) {
        const ctxerr = wrapContextError(ex, 'injectFromTemplate', elementSourceOffset(template));
        if (shouldThrow(ctxerr, template)) {
            throw ctxerr;
        }
    }
    popBuilderContext();
    return first;
}
/**
 * Wipe the current contents of a container element, and replace with a new list of nodes.
 * @param parent The container
 * @param dest The new list of contents
 */
function refillFromNodes(parent, dest) {
    while (parent.childNodes.length > 0) {
        parent.removeChild(parent.childNodes[0]);
    }
    appendFromNodes(parent, dest);
}
/**
 * Wipe the current contents of a container element, and replace with a new list of nodes.
 * @param parent The container
 * @param dest The new list of contents
 */
function appendFromNodes(parent, dest) {
    for (let i = 0; i < dest.length; i++) {
        parent.appendChild(dest[i]);
    }
}
/*-----------------------------------------------------------
 * _templates.ts
 *-----------------------------------------------------------*/
/**
 * Find a template that matches an ID.
 * Could be on the local page, or a built-in one
 * @param tempId The ID of the template (must be valid)
 * @returns An HTMLTemplateElement, or throws
 */
function getTemplate(tempId) {
    if (tempId) {
        let elmt = document.getElementById(tempId);
        if (elmt) {
            return elmt;
        }
        const template = builtInTemplate(tempId);
        if (template) {
            return template;
        }
    }
    throw new ContextError('Template not found: ' + tempId);
}
exports.getTemplate = getTemplate;
/**
 * Map template names to methods than can generate that template.
 */
const builtInTemplates = {
    paintByNumbers: paintByNumbersTemplate,
    paintByColorNumbers: paintByColorNumbersTemplate,
    classStampPalette: classStampPaletteTemplate,
    classStampNoTools: classStampNoToolsTemplate,
    finalAnswer: finalAnswerTemplate,
};
/**
 * Match a template name to a built-in template object
 * @param tempId The ID
 * @returns A template element (not part of the document), or undefined if unrecognized.
 */
function builtInTemplate(tempId) {
    if (tempId in builtInTemplates) {
        return builtInTemplates[tempId]();
    }
}
exports.builtInTemplate = builtInTemplate;
;
/**
 * Tag a template for default argument values.
 * Each key+value will become an attribute named 'data-'+key.
 * @param temp A newly constructed template element.
 * @param dict A dictionary of attribute names -> default values
 */
function setDefaultsTemplateArgs(temp, dict) {
    for (const [key, value] of Object.entries(dict)) {
        temp.setAttribute('default-' + key, value);
    }
}
/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByNumbersTemplate() {
    linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');
    const temp = document.createElement('template');
    temp.id = 'paintByNumbers';
    temp.innerHTML =
        `<ttable class="paint-by-numbers stampable-container stamp-drag bolden_5 bolden_10" data-col-context="{cols$}" data-row-context="{rows$}">
    <tthead>
      <ttr class="pbn-col-headers">
        <tth class="pbn-corner">
          <span class="pbn-instructions">
            This is a nonogram<br />(aka paint-by-numbers).<br />
            For instructions, see 
            <a href="https://help.puzzyl.net/PBN" target="_blank">
              https://help.puzzyl.net/PBN<br />
              <img src="../Images/Intro/pbn.png" />
            </a>
          </span>
        </tth>
        <for each="col" in="{colGroups}">
          <ttd id="colHeader-{col#}" class="pbn-col-header">
            <for each="group" in="{col}"><span class="pbn-col-group" onclick="togglePbnClue(this)">{group}</span></for>
          </ttd>
        </for>
        <tth class="pbn-row-footer pbn-corner">&#xa0;</tth>
      </ttr>
    </tthead>
    <for each="row" in="{rowGroups}">
      <ttr class="pbn-row">
        <ttd id="rowHeader-{row#}" class="pbn-row-header">
          &#x200a; <for each="group" in="{row}"><span class="pbn-row-group" onclick="togglePbnClue(this)">{group}</span> </for>&#x200a;
        </ttd>
        <for each="col" in="{colGroups}">
          <ttd id="{row#}_{col#}" class="pbn-cell stampable">&times;</ttd>
        </for>
        <ttd class="pbn-row-footer"><span id="rowSummary-{row#}" class="pbn-row-validation"></span></ttd>
      </ttr>
    </for>
    <ttfoot>
      <ttr class="pbn-col-footer">
        <tth class="pbn-corner">&#xa0;</tth>
        <for each="col" in="{colGroups}">
          <ttd class="pbn-col-footer"><span id="colSummary-{col#}" class="pbn-col-validation"></span></ttd>
        </for>
        <tth class="pbn-corner-validation">
          ꜛ&#xa0;&#xa0;&#xa0;&#xa0;ꜛ&#xa0;&#xa0;&#xa0;&#xa0;ꜛ
          <br />←&#xa0;validation</tth>
      </ttr>
    </ttfoot>
  </ttable>`;
    return temp;
}
/**
 * Create a standard paint-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByColorNumbersTemplate() {
    linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');
    const temp = document.createElement('template');
    temp.id = 'paintByNumbers';
    temp.innerHTML =
        `<ttable class="paint-by-numbers stampable-container stamp-drag pbn-two-color {?styles}" data-col-context="{cols$}" data-row-context="{rows$}" data-stamp-list="{stamplist}">
    <tthead>
      <ttr class="pbn-col-headers">
        <tth class="pbn-corner">
          <span class="pbn-instructions">
            This is a nonogram<br />(aka paint-by-numbers).<br />
            For instructions, see 
            <a href="https://help.puzzyl.net/PBN" target="_blank">
              https://help.puzzyl.net/PBN<br />
              <img src="https://help.puzzyl.net/pbn.png" />
            </a>
          </span>
        </tth>
        <for each="col" in="{colGroups}">
          <ttd id="colHeader-{col#}" class="pbn-col-header">
            <for each="colorGroup" in="{col}"><for key="color" in="{colorGroup}"><for each="group" in="{color!}"><span class="pbn-col-group pbn-color-{color}" onclick="togglePbnClue(this)">{group}</span></for></for></for>
          </ttd>
        </for>
        <if test="?validate" ne="false">
          <tth class="pbn-row-footer pbn-corner">&#xa0;</tth>
        </if>
      </ttr>
    </tthead>
      <for each="row" in="{rowGroups}">
        <ttr class="pbn-row">
          <ttd id="rowHeader-{row#}" class="pbn-row-header">
            &#x200a; 
            <for each="colorGroup" in="{row}"><for key="color" in="{colorGroup}">
              <for each="group" in="{color!}"><span class="pbn-row-group pbn-color-{color}" onclick="togglePbnClue(this)">{group}</span> </for>
            &#x200a;</for></for>
          </ttd>
          <for each="col" in="{colGroups}">
          <ttd id="{row#}_{col#}" class="pbn-cell stampable">{?blank}</ttd>
        </for>
        <if test="?validate" ne="false">
          <ttd class="pbn-row-footer"><span id="rowSummary-{row#}" class="pbn-row-validation"></span></ttd>
        </if>
      </ttr>
    </for>
    <if test="?validate" ne="false">
      <ttfoot>
        <ttr class="pbn-col-footer">
          <tth class="pbn-corner">&#xa0;</tth>
          <for each="col" in="{colGroups}">
            <ttd class="pbn-col-footer"><span id="colSummary-{col#}" class="pbn-col-validation"></span></ttd>
          </for>
          <tth class="pbn-corner-validation">
            ꜛ&#xa0;&#xa0;&#xa0;&#xa0;ꜛ&#xa0;&#xa0;&#xa0;&#xa0;ꜛ
            <br />←&#xa0;validation</tth>
        </ttr>
      </ttfoot>
    </if>
  </ttable>`;
    return temp;
}
/**
 * Create a standard paint-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 * @remarks This template takes the following arguments:
 *   size: Optional descriptor of stamp toolbar button size.
 *         Choices are "medium" and "small". The default is large.
 *   erase: the tool id of the eraser
 *   tools: A list of objects, each of which contain:
 *     id: the name of the stamp.
 *     next: Optional id of the next stamp, for rotational clicking.
 *           If absent, clicking on pre-stamped cells does nothing differnt.
 *     modifier: Optional shift state for clicks.
 *               Choices are "ctrl", "alt", "shift".
 *     img: The image source path to the button.
 *     label: Optional text to render below the toolbar button
 * @remarks Invoking this stamping template also loads the PaintByNumbers.css
 * Top candidates of styles to override include:
 *   stampLabel: to change or suppress the display of the label.
 *   stampMod: to change of suppress the modifier as a simple label.
 */
function classStampPaletteTemplate() {
    linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');
    const temp = document.createElement('template');
    temp.id = 'classStampPalette';
    temp.innerHTML =
        `<div id="stampPalette" data-tool-count="3" data-tool-erase="{erase}">
    <for each="tool" in="{tools}">
      <div id="{tool.id}" class="stampTool {?size}" data-stamp-id="{tool.id}" data-style="{tool.id}" data-click-modifier="{tool?modifier}" title="{tool?modifier} + draw" data-next-stamp-id="{tool.next}">
        <div class="roundTool {tool.id}-button">
          <span id="{tool.id}-icon" class="stampIcon"><img src_="{tool.img}" /></span>
          <span id="{tool.id}-label" class="stampLabel">{tool?label}</span>
          <span id="{tool.id}-mod" class="stampMod">{tool?modifier}+click</span>
        </div>
      </div>
    </for>
  </div>`;
    return temp;
}
function classStampNoToolsTemplate() {
    linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');
    const temp = document.createElement('template');
    temp.id = 'classStampPalette';
    temp.innerHTML =
        `<div id="stampPalette" class="hidden" data-tool-erase="{erase}">
    <for each="tool" in="{tools}">
      <div class="stampTool" id="{tool.id}" data-next-stamp-id="{tool.next}" data-style="{tool.id}">
      </div>
    </for>
  </div>`;
    return temp;
}
function stampPaletteTemplate() {
    linkCss(getSafariDetails().cssRoot + 'StampTools.css');
    const temp = document.createElement('template');
    temp.innerHTML =
        `<ttable class="paint-by-numbers bolden_5 bolden_10" data-col-context="{cols$}" data-row-context="{rows$}">
  </ttable>`;
    return temp;
}
/**
 * Invoke via <use template='finalAnswer' left='L' bottom='B' width='w' />
 * where L and B are the absolute position of the div, and W is the width of the word input.
 * If omitted, the defaults are:
 *  - left = "2in"
 *  - bottom = "0px"
 *  - width = "3in"
 * @returns A template element
 */
function finalAnswerTemplate() {
    const temp = document.createElement('template');
    setDefaultsTemplateArgs(temp, {
        left: '2in',
        bottom: '-60px',
        width: '3in'
    });
    temp.innerHTML =
        `<div class="no-print validate-block" style="position:absolute; bottom:{bottom}; left:{left};">
      <span class="no-user-select">Submit: </span>
      <word id="__final-answer" class="extracted" data-show-ready="__submit-answer" style="width:{width}; top:6px;" />
      <button class="validater ready" id="__submit-answer" data-extracted-id="__final-answer">OK</button>
    </div>`;
    return temp;
}
var pbnStampTools = [
    { id: 'stampPaint', modifier: 'ctrl', label: 'Paint', img: '../Images/Stamps/brushH.png', next: 'stampBlank' },
    { id: 'stampBlank', modifier: 'shift', label: 'Blank', img: '../Images/Stamps/blankH.png', next: 'stampErase' },
    { id: 'stampErase', modifier: 'alt', label: 'Erase', img: '../Images/Stamps/eraserH.png', next: 'stampPaint' },
];
/*-----------------------------------------------------------
 * _scratch.ts
 *-----------------------------------------------------------*/
let scratchPad = undefined;
let currentScratchInput = undefined;
/**
 * Setup a scratch pad that is the same size as the page.
 */
function setupScratch() {
    const page = (document.getElementById('page')
        || document.getElementsByClassName('printedPage')[0]);
    if (!page) {
        return;
    }
    scratchPad = document.createElement('div');
    scratchPad.id = 'scratch-pad';
    scratchPad.addEventListener('click', function (e) { scratchPadClick(e); });
    page.addEventListener('click', function (e) { scratchPageClick(e); });
    window.addEventListener('blur', function (e) { scratchFlatten(null); });
    page.insertAdjacentElement('afterbegin', scratchPad);
    if (getSafariDetails()) {
        linkCss(getSafariDetails()?.cssRoot + 'ScratchPad.css');
    }
}
exports.setupScratch = setupScratch;
/**
 * Click on the scratch pad (which is normally in the background).
 * If ctrl+click, start a new note.
 * Otherwise, flatten the current note.
 * @param evt
 * @returns
 */
function scratchClick(evt) {
    if (!scratchPad) {
        return;
    }
    if (currentScratchInput && currentScratchInput !== evt.target) {
        scratchFlatten(evt);
    }
    if (evt.target && hasClass(evt.target, 'scratch-div')) {
        scratchRehydrate(evt.target);
        return;
    }
    if (!evt.ctrlKey) {
        // One way to leave scratch mode is to click away
        return;
    }
    const spRect = scratchPad.getBoundingClientRect();
    const div = document.createElement('div');
    toggleClass(div, 'scratch-div', true);
    currentScratchInput = document.createElement('textarea');
    // Position the new textarea where its first character would be at the click point
    div.style.left = (evt.clientX - spRect.left - 5) + 'px';
    div.style.top = (evt.clientY - spRect.top - 10) + 'px';
    currentScratchInput.style.width = Math.min(spRect.right - evt.clientX, spRect.width / 3) + 'px';
    disableSpellcheck(currentScratchInput);
    currentScratchInput.title = 'Escape to exit note mode';
    currentScratchInput.onkeyup = function (e) { scratchTyped(e); };
    toggleClass(scratchPad, 'topmost', true);
    div.appendChild(currentScratchInput);
    attachDragHandle(div);
    scratchPad.appendChild(div);
    currentScratchInput.focus();
}
/**
 * When the user clicks away, flatten
 * @param evt
 */
function scratchPadClick(evt) {
    if (!evt.ctrlKey) {
        if (scratchFromPoint(evt.clientX, evt.clientY) != currentScratchInput) {
            scratchFlatten(evt);
        }
    }
}
/**
 * Callback when the top-level page is clicked.
 * If it's a ctrl+click, try to create a scratch note at that point.
 * @param evt The mouse event
 */
function scratchPageClick(evt) {
    if (evt.ctrlKey) {
        const targets = document.elementsFromPoint(evt.clientX, evt.clientY);
        let underScratch = false;
        var div = scratchFromPoint(evt.clientX, evt.clientY);
        if (div && div != currentScratchInput) {
            scratchRehydrate(div);
            return;
        }
        // If the user clicked on an existing scratch div, rehydrate
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (hasClass(target, 'scratch-div')) { // impossible, since pointer-events:none
                scratchRehydrate(target);
                return;
            }
            if (hasClass(target, 'scratch-drag-handle')) {
                return; // Let dragging happen
            }
            if (target.id === 'scratch-pad') { // only possible when topmost, else pointer-events:none
                underScratch = true;
                continue;
            }
            if (isTag(target, 'a')) {
                if (underScratch) {
                    // The scratch pad is covering a link. Invoke it.
                    target.click();
                    return;
                }
            }
            if (isTag(target, ['input', 'textarea', 'select', 'a'])) {
                return; // Don't steal clicks from form fields or links
            }
            if (hasClass(target, 'cross-off')) {
                continue; // checkmarks react to click, not ctrl+click
            }
            if (target.id != 'page' && target.onclick) {
                return; // Don't steal clicks from anything else with a click handler
            }
        }
        // We haven't deferred to other controls, so invoke scratch notes
        scratchClick(evt);
    }
}
/**
 * Does this point land inside the active scratch input, or any of the scratch-div regions?
 * @param x Client X
 * @param y Client Y
 * @returns The current textarea, any scratch-div, or null
 */
function scratchFromPoint(x, y) {
    if (currentScratchInput) {
        var rc = currentScratchInput.getBoundingClientRect();
        if (x >= rc.left && x <= rc.right && y >= rc.top && y <= rc.bottom) {
            return currentScratchInput;
        }
    }
    var divs = document.getElementsByClassName('scratch-div');
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        var rc = div.getBoundingClientRect();
        if (x >= rc.left && x <= rc.right && y >= rc.top && y <= rc.bottom) {
            return div;
        }
    }
    return null;
}
/**
 * Disable all squigglies from the note surface. They are distracting.
 * @param elmt A newly created TextArea
 */
function disableSpellcheck(elmt) {
    elmt.setAttribute('spellcheck', 'false');
    elmt.setAttribute('autocomplete', 'off');
    elmt.setAttribute('autocorrect', 'off');
    elmt.setAttribute('autocapitalize', 'off');
}
/**
 * Callback when the user types in the active textarea.
 * Ensures that the textarea stays correctly sized.
 * Exits scratch mode on Escape.
 * @param evt The keyboard event
 */
function scratchTyped(evt) {
    if (!evt.target) {
        return; // WTF?
    }
    if (evt.code == 'Escape') {
        scratchFlatten(null);
        return;
    }
    scratchResize(evt.target);
}
/**
 * Ensure that the active textarea is big enough for all its rows of text
 * @param ta The active textarea
 */
function scratchResize(ta) {
    const lines = 1 + (ta.value || '').split('\n').length;
    ta.setAttributeNS('', 'rows', lines.toString());
}
/**
 * Convert the active textarea to a flattened div
 * The textarea will be removed, and the text added directly to the div.
 */
function scratchFlatten(ev) {
    if (!scratchPad || !currentScratchInput) {
        return;
    }
    const div = currentScratchInput.parentNode;
    if (ev && div.contains(ev.target)) {
        return;
    }
    toggleClass(scratchPad, 'topmost', false);
    // Avoid re-entrancy
    const ta = currentScratchInput;
    const text = ta.value.trimEnd();
    currentScratchInput = undefined;
    const handle = div.getElementsByClassName('scratch-drag-handle')[0];
    if (handle) {
        div.removeChild(handle);
    }
    if (text) {
        const rect = ta.getBoundingClientRect();
        textIntoScratchDiv(text, div);
        const width = parseInt(ta.style.width);
        div.style.maxWidth = width + 'px';
        div.style.maxHeight = rect.height + 'px';
        div.removeChild(ta);
        toggleClass(div, 'hydrated', false);
    }
    else {
        // Remove the entire div
        div.parentNode?.removeChild(div);
    }
    scratchPad.removeEventListener('dragover', allowDropOnScratchPad);
    saveScratches(scratchPad);
}
/**
 * Convert the <div> HTML contents to text appropriate for a textarea or storage
 * @param div A flattened scratch note
 * @returns A string of lines of notes with \n line breaks
 */
function textFromScratchDiv(div) {
    let text = '';
    for (let i = 0; i < div.childNodes.length; i++) {
        const child = div.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            text += child.textContent;
        }
        else if (child.nodeType == Node.ELEMENT_NODE && isTag(child, 'br')) {
            text += '\n';
        }
        else if (child.nodeType == Node.ELEMENT_NODE && isTag(child, 'img')) {
            // Ignore drag handle
        }
        else {
            console.error('Unexpected contents of a scratch-div: ' + child);
        }
    }
    return text;
}
exports.textFromScratchDiv = textFromScratchDiv;
/**
 * Convert a flattened div back to a textarea in the same location
 * @param div A flattened div, which will be removed, and replaced
 */
function scratchRehydrate(div) {
    if (!scratchPad || !hasClass(div, 'scratch-div')) {
        return;
    }
    toggleClass(div, 'hydrated', true);
    const ta = document.createElement('textarea');
    ta.value = textFromScratchDiv(div);
    ta.addEventListener('blur', function (e) { scratchFlatten(e); });
    const rcSP = scratchPad.getBoundingClientRect();
    const rcD = div.getBoundingClientRect();
    // span.style.left = div.style.left;  
    // span.style.top = div.style.top;  
    ta.style.width = Math.min(rcSP.width / 3, rcSP.right - rcD.left) + 'px';
    disableSpellcheck(ta);
    ta.title = 'Escape to exit note mode';
    scratchResize(ta);
    ta.onkeyup = function (e) { scratchTyped(e); };
    toggleClass(scratchPad, 'topmost', true);
    while (div.childNodes.length > 0) {
        div.removeChild(div.childNodes[0]);
    }
    div.appendChild(ta);
    attachDragHandle(div);
    // div.parentNode!.append(ta);
    // div.parentNode!.removeChild(div);
    currentScratchInput = ta;
    ta.focus();
}
/**
 * Wipe away all scratches
 */
function scratchClear() {
    if (!scratchPad) {
        return;
    }
    if (currentScratchInput) {
        currentScratchInput.parentNode.removeChild(currentScratchInput);
        currentScratchInput = undefined;
    }
    const divs = scratchPad.getElementsByClassName('scratch-div');
    for (let i = divs.length - 1; i >= 0; i--) {
        scratchPad.removeChild(divs[i]);
    }
}
exports.scratchClear = scratchClear;
/**
 * Create a scratch div
 * @param x The client-x of the div
 * @param y The client-y of the div
 * @param width The (max) width of the div
 * @param height The (max) height of the div
 * @param text The text contents, as they would come from a textarea, with \n
 */
function scratchCreate(x, y, width, height, text) {
    if (!scratchPad) {
        return;
    }
    if (text) {
        const div = document.createElement('div');
        toggleClass(div, 'scratch-div', true);
        textIntoScratchDiv(text, div);
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        div.style.maxWidth = width + 'px';
        div.style.maxHeight = height + 'px';
        toggleClass(div, 'hydrated', true);
        scratchPad.append(div);
    }
}
exports.scratchCreate = scratchCreate;
/**
 * Convert a multi-line text string into a series of text nodes separated by <br>,
 * and inject those into a div.
 * @param text The raw text, with \n line breaks
 * @param div The destination div
 */
function textIntoScratchDiv(text, div) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
            div.appendChild(document.createElement('br'));
        }
        div.appendChild(document.createTextNode(lines[i]));
        // console.log('flatten: ' + lines[i]);
    }
}
const allowDropOnScratchPad = (ev) => { ev.preventDefault(); };
function attachDragHandle(div) {
    const handle = document.createElement('img');
    handle.src = '../Icons/ScratchMove.png';
    toggleClass(handle, 'scratch-drag-handle', true);
    div.appendChild(handle);
    const doScratchDrop = (ev) => dropScratchDiv(ev);
    div.setAttribute('draggable', 'true');
    div.addEventListener('dragstart', startDragScratch);
    div.addEventListener('dragend', endDragScratch);
    scratchPad.addEventListener('dragover', allowDropOnScratchPad);
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    function startDragScratch(ev) {
        if (startX != 0) {
            console.error('Re-entrant drag!!');
        }
        toggleClass(div, 'dragging', true);
        startX = ev.clientX;
        startY = ev.clientY;
        startLeft = parseFloat(div.style.left);
        startTop = parseFloat(div.style.top);
        scratchPad.addEventListener('drop', doScratchDrop);
        if (ev.dataTransfer) {
            ev.dataTransfer.effectAllowed = "move";
        }
    }
    function dropScratchDiv(ev) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        div.style.left = startLeft + dx + 'px';
        div.style.top = startTop + dy + 'px';
        startX = 0;
        startY = 0;
        currentScratchInput?.focus();
    }
    function endDragScratch(ev) {
        toggleClass(div, 'dragging', false);
        scratchPad.removeEventListener('drop', doScratchDrop);
    }
}
let _metaInfo;
/**
 * Setup meta sync on the named materials object
 * @param id The name of a materials object, shared between pages
 * @param count How many separate meta materials are possible. They will always be numbered [0..count)
 * @param callback The method on the page that will process the materials, whenever they update.
 */
function setupMetaSync(param) {
    if (!param || isIFrame()) {
        return; // Do nothing
    }
    const body = document.getElementsByTagName('body')[0];
    if (!body) {
        throw new Error('Seting up meta sync requires a <body> tag');
    }
    _metaInfo = {
        id: param.id,
        count: param.count,
        onSync: param.onSync,
        refillClass: param.refillClass,
        refillTemplate: param.refillTemplate,
        materials: new Array(param.count).fill(null),
    };
    // Validate fields
    if (param.refillClass) {
        const refills = document.getElementsByClassName(param.refillClass);
        if (refills.length != param.count) {
            throw new ContextError('Refill class (' + param.refillClass + ') has ' + refills.length + ' instances, whereas ' + param.count + ' meta materials are expected.');
        }
        if (!param.refillTemplate) {
            throw new ContextError('MetaParam specified refillClass (' + param.refillClass + ') without also specifying refillTemplate.');
        }
        // All refill points start out as locked
        for (let i = 0; i < refills.length; i++) {
            toggleClass(refills[i], 'locked', true);
            toggleClass(refills[i], 'unlocked', false);
        }
    }
    else if (param.refillTemplate && !param.refillClass) {
        throw new ContextError('MetaParam specified refillTemplate (' + param.refillTemplate + ') without also specifying refillClass.');
    }
    else if (!param.onSync) {
        throw new ContextError('MetaParam expects either an onSync callback, or else both refill fields.');
    }
    // Refresh materials every time the user switches back to this page
    document.addEventListener('visibilitychange', function (event) {
        scanMetaMaterials();
    });
    body.addEventListener('focus', function (event) {
        scanMetaMaterials();
    });
    // Then run it now.
    scanMetaMaterials(true);
}
exports.setupMetaSync = setupMetaSync;
/**
 * Check for any updates to cached meta materials (from other pages).
 * If any changes, invoke the on-page callback.
 * @param force If set, always calls the onSync callback
 */
function scanMetaMaterials(force) {
    let changed = force || false;
    for (var i = 0; i < _metaInfo.count; i++) {
        if (_metaInfo.materials[i]) {
            continue; // materials should never change. Either we have them or we don't.
        }
        var materials = loadMetaMaterials(_metaInfo.id, _metaInfo.up || 0, i);
        if (materials) {
            _metaInfo.materials[i] = materials;
            changed = true;
        }
    }
    if (loadMetaMaterials(_metaInfo.id, _metaInfo.up || 0, _metaInfo.count)) {
        throw new ContextError('WARNING: Meta materials may be misnumbered. Expected #0 - #' + (_metaInfo.count - 1) + ' but found #' + _metaInfo.count);
    }
    if (changed) {
        if (_metaInfo.onSync) {
            _metaInfo.onSync(_metaInfo.materials);
        }
        if (_metaInfo.refillClass) {
            refillFromMeta(_metaInfo.materials);
        }
    }
}
exports.scanMetaMaterials = scanMetaMaterials;
/**
 * Refill a collection of containers on the page with the latest meta materials.
 * The data is formatted using a named template.
 * @param materials The latest meta materials
 */
function refillFromMeta(materials) {
    const containers = document.getElementsByClassName(_metaInfo.refillClass);
    for (var i = 0; i < containers.length; i++) {
        if (materials[i]) {
            var container = containers[i];
            if (!hasClass(container, 'unlocked')) {
                refillFromTemplate(container, _metaInfo.refillTemplate, materials[i]);
                toggleClass(container, 'locked', false);
                toggleClass(container, 'unlocked', true);
            }
        }
    }
}
/*-----------------------------------------------------------
 * _validatePBN.ts
 *-----------------------------------------------------------*/
/**
 * Validate the paint-by-numbers grid that contains this cell
 * @param target The cell that was just modified
 */
function validatePBN(target) {
    const table = findParentOfClass(target, 'paint-by-numbers');
    if (!table) {
        return;
    }
    const stampList = getOptionalStyle(table, 'data-stamp-list');
    if (stampList) {
        validateColorPBN(target, table, stampList);
        return;
    }
    let pos = target.id.split('_');
    const row = parseInt(pos[0]);
    const col = parseInt(pos[1]);
    const rSum = document.getElementById('rowSummary-' + row);
    const cSum = document.getElementById('colSummary-' + col);
    if (!rSum && !cSum) {
        return; // this PBN does not have a UI for validation
    }
    // Scan all cells in this PBN table, looking for those in the current row & column
    // Track the painted ones as a list of row/column indices
    const cells = table.getElementsByClassName('stampable');
    const rowOn = [];
    const colOn = [];
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (hasClass(cell, 'stampPaint')) {
            pos = cell.id.split('_');
            const r = parseInt(pos[0]);
            const c = parseInt(pos[1]);
            if (r == row) {
                rowOn.push(c);
            }
            if (c == col) {
                colOn.push(r);
            }
        }
    }
    const rows = contextDataFromRef(table, 'data-row-context');
    if (rSum && rows) {
        // Convert a list of column indices to group notation
        const groups = summarizePBN(rowOn);
        rSum.innerHTML = '';
        for (const g of groups) {
            if (g > 0) {
                const span = document.createElement('span');
                toggleClass(span, 'pbn-row-group', true);
                span.innerText = g.toString();
                rSum.appendChild(span);
            }
        }
        const header = rows[row];
        const comp = compareGroupsPBN(header, groups);
        toggleClass(rSum, 'done', comp == 0);
        toggleClass(rSum, 'exceeded', comp > 0);
        const rHead = document.getElementById('rowHeader-' + row);
        toggleClass(rHead, 'done', comp == 0);
    }
    const cols = contextDataFromRef(table, 'data-col-context');
    if (cSum) {
        const groups = summarizePBN(colOn);
        cSum.innerHTML = '';
        for (const g of groups) {
            if (g > 0) {
                const span = document.createElement('span');
                toggleClass(span, 'pbn-col-group', true);
                span.innerText = g.toString();
                cSum.appendChild(span);
            }
        }
        const header = cols[col];
        const comp = compareGroupsPBN(header, groups);
        toggleClass(cSum, 'done', comp == 0);
        toggleClass(cSum, 'exceeded', comp > 0);
        const cHead = document.getElementById('colHeader-' + col);
        toggleClass(cHead, 'done', comp == 0);
    }
}
/**
 * Is a given cell tagged with a (non-blank) stamp id?
 * @param cell
 * @param stampTools
 * @returns the stamp data, or undefined if none found
 */
function dataFromTool(cell, stampTools) {
    for (let i = 0; i < stampTools.length; i++) {
        if (stampTools[i].data && hasClass(cell, stampTools[i].id))
            return stampTools[i].data;
    }
    return undefined;
}
/**
 * Look up a value, according to the context path cached in an attribute
 * @param elmt Any element
 * @param attr An attribute name, which should exist in elmt or any parent
 * @returns Any JSON object, or undefined if not found (or found an empty string)
 */
function contextDataFromRef(elmt, attr) {
    const data = getOptionalComplex(elmt, attr);
    return data ? data : undefined;
}
/**
 * Read the user's actual painting within the PBN grid as a list of group sizes.
 * @param list A list of numbers, indicating row or column indices
 * @returns A list of groups separated by gaps. Positive numbers are consecutive painted. Negative are consecutive un-painted.
 * The leading- and trailing- empty cells are ignored. But if the whole series is empty, return [0]
 */
function summarizePBN(list) {
    let prev = NaN;
    let consec = 0;
    const summary = [];
    list.push(NaN);
    for (const next of list) {
        if (next == prev + 1) {
            consec++;
        }
        else {
            if (consec > 0) {
                summary.push(consec);
                const gap = next - prev - 1;
                if (!isNaN(gap) && gap > 0) {
                    summary.push(-gap);
                }
            }
            consec = (!isNaN(next)) ? 1 : 0;
        }
        prev = next;
    }
    if (summary.length == 0) {
        return [0];
    }
    return summary;
}
/**
 * Compare the actual panted cells vs. the clues.
 * The actual cells could indicate either more than was clued, or less than was clued, or exactly what was clued.
 * @param expect A list of expected groups (positives only)
 * @param have A list of actual groups (positives indicate groups, negatives indicates gaps between groups)
 * @returns 0 if exact, 1 if actual exceeds expected, or -1 if actual is not yet expected, but hasn't contradicted it yet
 */
function compareGroupsPBN(expect, have) {
    let exact = true;
    let e = 0;
    let gap = 0;
    let prevH = 0;
    let curE = expect.length > 0 ? expect[0] : 0;
    for (const h of have) {
        if (h <= 0) {
            gap = -h;
            continue;
        }
        prevH = prevH > 0 ? (prevH + gap + h) : h;
        if (prevH <= curE) {
            exact = exact && h == curE;
            gap = 0;
            if (prevH == curE) {
                prevH = 0;
                e++;
                curE = e < expect.length ? expect[e] : 0;
            }
        }
        else {
            exact = false;
            prevH = 0;
            gap = 0;
            e++;
            while (e < expect.length && h > expect[e]) {
                e++;
            }
            curE = e < expect.length ? expect[e] : 0;
            if (h < curE) {
                prevH = h;
            }
            else if (h == curE) {
                e++;
                curE = e < expect.length ? expect[e] : 0;
            }
            else {
                return 1; // too big
            }
        }
    }
    // return 0 for exact match
    // return -1 for incomplete match - groups thus far do not exceed expected
    return (exact && e == expect.length) ? 0 : -1;
}
/**
 * When a PBN group in row or col header is checked,
 * toggle a check- or cross-off effect.
 * @param group The group that was clicked.
 */
function togglePbnClue(group) {
    toggleClass(group, 'pbn-check');
}
const nonIndexTag = { index: NaN, tag: '' };
const nonLinearTag = { len: 0, tag: '' };
const outerGapTag = { len: 1, tag: '' };
/**
* Validate the paint-by-numbers grid that contains this cell
* @param target The cell that was just modified
* @param table The containing table
* @param stampList
*/
function validateColorPBN(target, table, stampList) {
    const stampTools = valueFromGlobalContext(stampList);
    let pos = target.id.split('_');
    const row = parseInt(pos[0]);
    const col = parseInt(pos[1]);
    const rSum = document.getElementById('rowSummary-' + row);
    const cSum = document.getElementById('colSummary-' + col);
    if (!rSum && !cSum) {
        return; // this PBN does not have a UI for validation
    }
    // Scan all cells in this PBN table, looking for those in the current row & column
    // Track the painted ones as a list of row/column indices
    const cells = table.getElementsByClassName('stampable');
    const rowOn = [];
    const colOn = [];
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const data = dataFromTool(cell, stampTools);
        if (data) {
            pos = cell.id.split('_');
            const r = parseInt(pos[0]);
            const c = parseInt(pos[1]);
            if (r == row) {
                const it = { index: c, tag: data };
                rowOn.push(it);
            }
            if (c == col) {
                const it = { index: r, tag: data };
                colOn.push(it);
            }
        }
    }
    const rows = contextDataFromRef(table, 'data-row-context');
    if (rSum && rows) {
        // Convert a list of column indices to group notation
        const groups = summarizeTaggedPBN(rowOn);
        rSum.innerHTML = '';
        for (const g of groups) {
            if (g.tag != '') {
                const span = document.createElement('span');
                toggleClass(span, 'pbn-row-group', true);
                toggleClass(span, 'pbn-color-' + g.tag, true);
                span.innerText = g.len.toString();
                rSum.appendChild(span);
            }
        }
        const header = invertColorTags(rows[row]);
        const comp = compareTaggedGroupsPBN(header, groups);
        toggleClass(rSum, 'done', comp == 0);
        toggleClass(rSum, 'exceeded', comp > 0);
        const rHead = document.getElementById('rowHeader-' + row);
        toggleClass(rHead, 'done', comp == 0);
    }
    const cols = contextDataFromRef(table, 'data-col-context');
    if (cSum) {
        const groups = summarizeTaggedPBN(colOn);
        cSum.innerHTML = '';
        for (const g of groups) {
            if (g.tag != '') {
                const span = document.createElement('span');
                toggleClass(span, 'pbn-col-group', true);
                toggleClass(span, 'pbn-color-' + g.tag, true);
                span.innerText = g.len.toString();
                cSum.appendChild(span);
            }
        }
        const header = invertColorTags(cols[col]);
        const comp = compareTaggedGroupsPBN(header, groups);
        toggleClass(cSum, 'done', comp == 0);
        toggleClass(cSum, 'exceeded', comp > 0);
        const cHead = document.getElementById('colHeader-' + col);
        toggleClass(cHead, 'done', comp == 0);
    }
}
/**
* Starting from a tag-clumped header input:
*  [ {tag1:[1,2]}, {tag2:[3,4]} ]
* Convert to linear groups with tags
*  [ [1,tag1], [2,tag1], [3,tag2], [4,tag2]]
* @param header input-style header
* @returns linear-style header
*/
function invertColorTags(header) {
    const linear = [];
    for (let i = 0; i < header.length; i++) {
        const tagged = header[i]; // {tag:[1,2]}
        const tag = Object.keys(tagged)[0];
        const groups = tagged[tag];
        for (let g = 0; g < groups.length; g++) {
            const lt = { len: groups[g], tag: tag };
            linear.push(lt);
        }
    }
    return linear;
}
/**
 * Read the user's actual painting within the PBN grid as a list of group sizes.
 * @param list A list of numbers, indicating row or column indices
 * @returns A list of groups and gaps, trimming exterior gaps.
 */
function summarizeTaggedPBN(list) {
    let prev = nonIndexTag;
    let consec = 0;
    const summary = [];
    list.push(nonIndexTag);
    for (const next of list) {
        if (next.tag == prev.tag && next.index == prev.index + 1) {
            consec++;
        }
        else {
            if (consec > 0) {
                const line = { len: consec, tag: prev.tag };
                summary.push(line);
                const gap = { len: next.index - prev.index - 1, tag: '' };
                if (next.tag != '') {
                    summary.push(gap);
                }
            }
            consec = next == nonIndexTag ? 0 : 1;
        }
        prev = next;
    }
    if (summary.length == 0) {
        return [];
    }
    return summary;
}
/**
 * Compare the actual painted cells vs. the clues.
 * The actual cells could indicate either more than was clued, or less than was clued, or exactly what was clued.
 * @param expect A list of expected groups (omitting gaps)
 * @param have A list of actual groups (including gaps between groups)
 * @returns 0 if exact, 1 if actual exceeds expected, or -1 if actual is not yet expected, but hasn't contradicted it yet
 */
function compareTaggedGroupsPBN(expect, have) {
    let exact = true;
    let e = 0;
    let gap = outerGapTag;
    let prevH = nonLinearTag;
    let curE = expect.length == 0 ? nonLinearTag : expect[0];
    for (const h of have) {
        if (h.tag == '') {
            gap = h;
            continue;
        }
        if (h.tag == prevH.tag) {
            // Two groups of the same type, separated by a gap, could fit within a single expected range
            prevH.len += gap.len + h.len;
            if (prevH.len <= curE.len) {
                continue;
            }
            // curE has already accomodated prevH. If this new, bigger prevH doesn't fit, move on to the next E, and forget prevH
            e++;
        }
        // If the next expected group is either a different type, or too small, fast forward to one that fits
        while (e < expect.length && (expect[e].tag != h.tag || expect[e].len < h.len)) {
            exact = false;
            e++;
        }
        if (e >= expect.length) {
            return 1; // We're past the end, while still having cells that don't fit
        }
        if (h.len == curE.len) {
            e++;
            prevH = nonLinearTag;
        }
        else {
            exact = false;
            prevH = h;
        }
        curE = expect[e];
    }
    // return 0 for exact match
    // return -1 for incomplete match - groups thus far do not exceed expected
    return (exact && e == expect.length) ? 0 : -1;
}
function equalRect2D(a, b) {
    return a.left == b.left
        && a.right == b.right
        && a.top == b.top
        && a.bottom == b.bottom;
}
/**
 * Simplify a DOMRect to 4 edge position values, each rounded to the nearest 0.1
 * @param r a DOMRect
 * @returns An equivalent Rect2D
 */
function createRect2D(r) {
    const rect = {
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        top: Math.round(r.top * 10) / 10,
        bottom: Math.round(r.bottom * 10) / 10,
    };
    return rect;
}
/**
 * Create a size-0 rect at the top-left corner of another rect
 * @param r a Rect2D
 * @returns An new Rect2D
 */
function pointAtCorner(r) {
    const x = r?.left ?? 0;
    const y = r?.right ?? 0;
    const rect = {
        left: x,
        right: x,
        top: y,
        bottom: y,
    };
    return rect;
}
/**
 * Build a tree of LayoutSummary nodes
 * @param root The root for this (sub-)tree
 * @param index The index of the root within its parent
 * @returns A LayoutSummary tree, which may be merged into a parent tree
 */
function summarizeLayout(root, index) {
    if (index === undefined) {
        index = 0;
    }
    const summary = {
        index: index,
        nodeType: root.nodeType,
        descendents: root.childNodes.length
    };
    if (root.nodeType == Node.ELEMENT_NODE) {
        const elmt = root;
        const rect = elmt.getBoundingClientRect();
        summary.bounds = createRect2D(rect);
        if (elmt.id) {
            summary.id = elmt.id;
        }
        // summary.text = elmt.innerText;
        const children = [];
        for (let i = 0; i < root.childNodes.length; i++) {
            const child = root.childNodes[i];
            const cl = summarizeLayout(child, i);
            children.push(cl);
            summary.descendents += cl.descendents;
        }
        summary.children = children;
    }
    else if (root.nodeType != Node.COMMENT_NODE && root.textContent) {
        summary.text = root.textContent;
        var range = document.createRange();
        range.selectNode(root);
        const rect = range.getBoundingClientRect();
        range.detach(); // frees up memory in older browsers
        summary.bounds = createRect2D(rect);
    }
    return summary;
}
function pageLayoutRootNode() {
    const pageBody = document.getElementById('pageBody');
    if (pageBody) {
        return pageBody;
    }
    const bodies = document.getElementsByTagName('body');
    if (bodies && bodies.length > 0) {
        return bodies[0];
    }
    return document.getRootNode();
}
/**
 * Summarize the full layout of a typical puzzle page.
 * If a pageBody elememt exists, use that as the root.
 * Otherwise, use the <body> tag, or as a last resort, the DOM root node.
 * @returns A tree of LayoutSummary nodes
 */
function summarizePageLayout() {
    const pageRoot = pageLayoutRootNode();
    return summarizeLayout(pageRoot);
}
exports.summarizePageLayout = summarizePageLayout;
/**
 * Bit flags for how two layout summaries might differ
 */
var LayoutDiffType;
(function (LayoutDiffType) {
    LayoutDiffType[LayoutDiffType["None"] = 0] = "None";
    LayoutDiffType[LayoutDiffType["Add"] = 1] = "Add";
    LayoutDiffType[LayoutDiffType["Remove"] = 2] = "Remove";
    LayoutDiffType[LayoutDiffType["Change"] = 3] = "Change";
    LayoutDiffType[LayoutDiffType["AddChild"] = 4] = "AddChild";
    LayoutDiffType[LayoutDiffType["RemoveChild"] = 8] = "RemoveChild";
    LayoutDiffType[LayoutDiffType["ChangeText"] = 16] = "ChangeText";
    LayoutDiffType[LayoutDiffType["ChangeRect"] = 32] = "ChangeRect";
})(LayoutDiffType || (LayoutDiffType = {}));
;
/**
 * Are these two elements sufficiently similar so as to be comparable?
 * Same node type and element tag name. If they have IDs, they must match too.
 * @param a A layout.
 * @param b Another layout.
 * @returns true if these two objects should be compared at greater depth
 */
function canCompareLayouts(a, b) {
    return a.nodeType == b.nodeType
        && a.tagName == b.tagName
        && a.id == b.id;
}
/**
 * Find the next element in the list which could plausibly be compared with a given element.
 * @param s The element seeking a partner to compare
 * @param list A list of potential partner elements
 * @param first The first index in the list to consider
 * @returns -1 if none found, else the index (>= first) of the match.
 */
function findComparableLayout(s, list, first) {
    for (; first < list.length; first++) {
        if (canCompareLayouts(s, list[first])) {
            return first;
        }
    }
    return -1;
}
/**
 * Build a list of diffs for a before- and after- layout tree
 * @param bef The before layout
 * @param aft The after layout
 * @returns A flat list of difference nodes, including differences among child nodes.
 */
function diffSummarys(bef, aft) {
    const diffs = [];
    let ldt = LayoutDiffType.None;
    if (bef.text != aft.text) {
        ldt |= LayoutDiffType.ChangeText;
    }
    if (bef.bounds || aft.bounds) {
        if (!bef.bounds || !aft.bounds || !equalRect2D(bef.bounds, aft.bounds)) {
            ldt |= LayoutDiffType.ChangeRect;
        }
    }
    if (bef.children && aft.children) {
        let b = 0;
        let a = 0;
        while (b < bef.children.length || a < aft.children.length) {
            const bb = a >= aft.children.length ? bef.children.length :
                findComparableLayout(aft.children[a], bef.children, b);
            if (bb < 0) {
                ldt |= LayoutDiffType.AddChild;
                const added = {
                    diffType: LayoutDiffType.Add,
                    after: aft.children[a]
                };
                diffs.push(added);
                a++;
            }
            else {
                for (; b < bb; b++) {
                    ldt |= LayoutDiffType.RemoveChild;
                    const removed = {
                        diffType: LayoutDiffType.Remove,
                        before: bef.children[b]
                    };
                    diffs.push(removed);
                }
                if (a < aft.children.length) {
                    const ds = diffSummarys(bef.children[b], aft.children[a]);
                    for (let i = 0; i < ds.length; i++) {
                        diffs.push(ds[i]);
                    }
                    b++;
                    a++;
                }
            }
        }
    }
    else if (bef.children) {
        ldt |= LayoutDiffType.RemoveChild;
    }
    else if (aft.children) {
        ldt |= LayoutDiffType.AddChild;
        // for (let i = 0; i < aft.children.length; i++) {
        // }
    }
    if (ldt != LayoutDiffType.None) {
        const change = {
            diffType: ldt,
            before: bef,
            after: aft
        };
        diffs.push(change); // TODO: insert at 0
    }
    return diffs;
}
exports.diffSummarys = diffSummarys;
function renderDiffs(diffs) {
    let diffRoot = document.getElementById('render-diffs');
    if (!diffRoot) {
        diffRoot = document.createElement('div');
        diffRoot.id = 'render-diffs';
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(diffRoot);
    }
    // toggleClass(diffRoot, 'diff-div', true);
    for (let i = 0; i < diffs.length; i++) {
        const diff = diffs[i];
        renderDiff(diffRoot, diff);
    }
}
exports.renderDiffs = renderDiffs;
function renderDiff(diffRoot, diff) {
    if (!diff?.after?.bounds && !diff?.before?.bounds) {
        return; // Nowhere to show
    }
    const div = document.createElement('div');
    toggleClass(div, 'diff-div', true);
    toggleClass(div, 'diff-add', (diff.diffType & LayoutDiffType.Add) != 0);
    toggleClass(div, 'diff-rem', (diff.diffType & LayoutDiffType.Remove) != 0);
    toggleClass(div, 'diff-text', (diff.diffType & LayoutDiffType.ChangeText) != 0);
    toggleClass(div, 'diff-rect', (diff.diffType & LayoutDiffType.ChangeRect) != 0);
    const before = diff.before?.bounds ?? pointAtCorner(diff.after?.bounds);
    const after = diff.after?.bounds ?? pointAtCorner(diff.before?.bounds);
    div.style.left = after.left + 'px';
    div.style.top = after.top + 'px';
    div.style.width = (after.right - after.left) + 'px';
    div.style.height = (after.bottom - after.top) + 'px';
    if (before.left != after.left) {
        div.appendChild(createDiffDeltaRect(before.left - after.left, 'left'));
    }
    if (before.top != after.top) {
        div.appendChild(createDiffDeltaRect(before.top - after.top, 'top'));
    }
    if (before.right != after.right) {
        div.appendChild(createDiffDeltaRect(before.right - after.right, 'right'));
    }
    if (before.bottom != after.bottom) {
        div.appendChild(createDiffDeltaRect(before.bottom - after.bottom, 'bottom'));
    }
    diffRoot.appendChild(div);
}
function createDiffDeltaRect(size, edge) {
    const d = document.createElement('div');
    toggleClass(d, 'diff-shrink', size < 0);
    toggleClass(d, 'diff-grow', size > 0);
    if (edge == 'left') {
        d.style.left = ((size < 0) ? size : 0) + 'px';
        d.style.width = Math.abs(size) + 'px';
        d.style.top = '0px';
        d.style.height = '100%';
    }
    else if (edge == 'top') {
        d.style.top = ((size < 0) ? size : 0) + 'px';
        d.style.height = Math.abs(size) + 'px';
        d.style.left = '0px';
        d.style.width = '100%';
    }
    else if (edge == 'right') {
        d.style.right = ((size > 0) ? size : 0) + 'px';
        d.style.width = Math.abs(size) + 'px';
        d.style.top = '0px';
        d.style.height = '100%';
    }
    else if (edge == 'bottom') {
        d.style.bottom = ((size > 0) ? size : 0) + 'px';
        d.style.height = Math.abs(size) + 'px';
        d.style.left = '0px';
        d.style.width = '100%';
    }
    return d;
}
//# sourceMappingURL=kit25.js.map