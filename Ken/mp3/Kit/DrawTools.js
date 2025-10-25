// When found, expand those elements appropriately.
function drawSetup() {
    simpleSetup();
    preprocessDrawObjects();
    indexAllDrawableFields();
    setTimeout(checkLocalStorage, 100);
}

function textAndDrawSetup() {
    textSetup(false);
    preprocessDrawObjects();
    indexAllDrawableFields();
    setTimeout(checkLocalStorage, 100);
}

// VOCABULARY
// drawable: any object which can be clicked on to draw an icon
// drawPalette: the toolbar from which a user can see and select the draw tools
// drawTool: a UI control to make one or another draw mode the default
// selected: when a drawTool is primary, and will draw when clicking in an active area
// drawToolTemplates: a hidden container of objects that are cloned when drawn
// drawnObject: templates for cloning when drawn

var _drawTools = [];
var _selectedTool = null;
var _extractorTool = null;
var _eraseTool = null;

// Scan the page for anything marked drawable or a draw tool
function preprocessDrawObjects() {
    var elems = document.getElementsByClassName('drawable');
    for (var i = 0; i < elems.length; i++) {
        elems[i].onmousedown=function(e){onClickDraw(e)};
        //elems[i].ondrag=function(e){onMoveDraw(e)};
        elems[i].onmouseenter=function(e){onMoveDraw(e)};
        elems[i].onmouseleave=function(e){preMoveDraw(e)};
    }

    elems = document.getElementsByClassName('drawTool');
    for (var i = 0; i < elems.length; i++) {
        _drawTools.push(elems[i]);
        elems[i].onclick=function(e){onSelectDrawTool(e)};
    }

    var palette = document.getElementById('drawPalette');
    if (palette != null) {
        _extractorTool = palette.getAttributeNS('', 'data-tool-extractor');
        _eraseTool = palette.getAttributeNS('', 'data-tool-erase');
    }
}

function onSelectDrawTool(event) {
    var tool = findParentOfClass(event.srcElement, 'drawTool');
    if (tool != null) {
        for (var i = 0; i < _drawTools.length; i++) {
            toggleClass(_drawTools[i], 'selected', false);
        }
        if (tool != _selectedTool) {
            toggleClass(tool, 'selected', true);
            _selectedTool = tool;
        }
        else {
            _selectedTool = null;
        }
    }
}

// If the user has any shift key pressed, that trumps all other modes.
// If the user selected a drawing tool, then we toggle between that tool and erase.
// If no tool is selected, we rotate through all tools, starting with the first.
function getDrawTool(event, toolFromContext) {
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (var i = 0; i < _drawTools.length; i++) {
            var mods = _drawTools[i].getAttributeNS('', 'data-click-modifier');
            if (event.shiftKey == (mods.indexOf('shift') >= 0)
                && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                && event.altKey == (mods.indexOf('alt') >= 0)) {
                    return _drawTools[i].getAttributeNS('', 'data-template-id');
                }
        }
    }
    
    if (toolFromContext != null) {
        return toolFromContext;
    }
    if (_selectedTool != null) {
        return _selectedTool.getAttributeNS('', 'data-template-id');
    }
    return _drawTools[0].getAttributeNS('', 'data-template-id');
}

// If the target has a drawn object, then clicking again always clears it.
// Return a hint to what tool should replace it.
// When there is no selected tool, we propose rotating through tools.
// When clicking on something that matches the selected tool, we are in erase mode.
// Otherwise we're in normal drawing mode, using the selected tool.
function eraseDraw(target) {
    if (target == null) {
        return null;
    }
    var erased = false;
    var cur = findFirstChildOfClass(target, 'drawnObject');
    if (cur != null) {
        var curTool = cur.getAttributeNS('', 'data-template-id');
        toggleClass(target, curTool, false);
        target.removeChild(cur);
        if (_extractorTool != null) {
            updateDrawExtraction();
        }

        if (_selectedTool == null) {
            return cur.getAttributeNS('', 'data-next-template-id');  // rotate
        }
        if (_selectedTool.getAttributeNS('', 'data-template-id') == curTool) {
            return _eraseTool;  // erase
        }
    }
    return null;  // normal
}

function doDraw(target, tool) {
    // Template can be null if tool removes drawn objects
    var template = document.getElementById(tool);
    if (template != null) {
        var clone = template.content.cloneNode(true);
        target.appendChild(clone);
        toggleClass(target, tool, true);    
    }
    if (_extractorTool != null) {
        updateDrawExtraction();
    }
    saveDrawingLocally(target);
}

var _dragDrawTool = null;
var _lastDrawTool = null;

function onClickDraw(event) {
    var target = findParentOfClass(event.srcElement, 'drawable');
    var nextTool = eraseDraw(target);
    nextTool = getDrawTool(event, nextTool);
    doDraw(target, nextTool);
    _lastDrawTool = nextTool;
    _dragDrawTool = null;
}

function onMoveDraw(event) {
    if (event.buttons == 1 && _dragDrawTool != null) {
        var target = findParentOfClass(event.srcElement, 'drawable');
        eraseDraw(target);
        doDraw(target, _dragDrawTool);
        _dragDrawTool = null;
    }
}

function preMoveDraw(event) {
    if (event.buttons == 1) {
        var target = findParentOfClass(event.srcElement, 'drawable');
        if (target != null) {
            var cur = findFirstChildOfClass(target, 'drawnObject');
            if (cur != null) {
                _dragDrawTool = cur.getAttributeNS('', 'data-template-id');
            }
            else {
                _dragDrawTool = _lastDrawTool;
            }
            return;
        }
        _dragDrawTool = null;
    }
}

function updateDrawExtraction() {
    var extracted = document.getElementById('extracted');
    if (extracted == null) {
        return;
    }

    var drawn = document.getElementsByClassName('drawnObject');
    var extraction = '';
    for (var i = 0; i < drawn.length; i++) {
        var tool = drawn[i].getAttributeNS('', 'data-template-id');
        if (tool == _extractorTool) {
            var extract = findFirstChildOfClass(drawn[i].parentNode, 'extract');
            if (extract != null) {
                extraction += extract.innerText;
            }
        }
    }

    if (extracted.tagName != 'INPUT') {
        extracted.innerText = extraction;
    }
    else {
        extracted.value = extraction;    
    }

}