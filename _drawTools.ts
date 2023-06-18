import { findFirstChildOfClass, findParentOfClass, toggleClass } from "./_classUtil";
import { saveDrawingLocally } from "./_storage";

// VOCABULARY
// drawable: any object which can be clicked on to draw an icon
// drawPalette: the toolbar from which a user can see and select the draw tools
// drawTool: a UI control to make one or another draw mode the default
// selected: when a drawTool is primary, and will draw when clicking in an active area
// drawToolTemplates: a hidden container of objects that are cloned when drawn
// drawnObject: templates for cloning when drawn

/**
 * The tools in the palette.
 */
const _drawTools:Array<HTMLElement> = [];
/**
 * The currently selected tool from the palette.
 */
let _selectedTool:HTMLElement|null = null;
/**
 * A tool name which, as a side effect, extract an answer from the content under it.
 */
let _extractorTool:string|null = null;
/**
 * The tool name that would erase things.
 */
let _eraseTool:string|null = null;

/**
 * Scan the page for anything marked drawable or a draw tool
 */
export function preprocessDrawObjects() {
    let elems = document.getElementsByClassName('drawable');
    for (let i = 0; i < elems.length; i++) {
        const elmt = elems[i] as HTMLElement;
        elmt.onmousedown=function(e){onClickDraw(e)};
        //elmt.ondrag=function(e){onMoveDraw(e)};
        elmt.onmouseenter=function(e){onMoveDraw(e)};
        elmt.onmouseleave=function(e){preMoveDraw(e)};
    }

    elems = document.getElementsByClassName('drawTool');
    for (let i = 0; i < elems.length; i++) {
        const elmt = elems[i] as HTMLElement;
        _drawTools.push(elmt);
        elmt.onclick=function(e){onSelectDrawTool(e)};
    }

    const palette = document.getElementById('drawPalette');
    if (palette != null) {
        _extractorTool = palette.getAttributeNS('', 'data-tool-extractor');
        _eraseTool = palette.getAttributeNS('', 'data-tool-erase');
    }
}

/**
 * Called when a draw tool is selected from the palette
 * @param event The click event
 */
function onSelectDrawTool(event:MouseEvent) {
    const tool = findParentOfClass(event.target as HTMLElement, 'drawTool') as HTMLElement;
    if (tool != null) {
        for (let i = 0; i < _drawTools.length; i++) {
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

/**
 * If the user has any shift key pressed, that trumps all other modes.
 * Else if we have a special erase override, use that.
 * Else if the user selected a drawing tool, then use that.
 * Else use the first tool (presumed default).
 * @param event The click event
 * @param toolFromErase An override because we're erasing/rotating
 * @returns the name of a draw tool
 */
function getDrawTool(event:MouseEvent, toolFromErase:string|null):string|null {
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (let i = 0; i < _drawTools.length; i++) {
            const mods = _drawTools[i].getAttributeNS('', 'data-click-modifier');
            if (mods != null
                    && event.shiftKey == (mods.indexOf('shift') >= 0)
                    && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                    && event.altKey == (mods.indexOf('alt') >= 0)) {
                return _drawTools[i].getAttributeNS('', 'data-template-id');
            }
        }
    }
    
    if (toolFromErase != null) {
        return toolFromErase;
    }
    if (_selectedTool != null) {
        return _selectedTool.getAttributeNS('', 'data-template-id');
    }
    return _drawTools[0].getAttributeNS('', 'data-template-id');
}

/**
 * When drawing on a surface where something is already drawn. The first click
 * always erases the existing drawing.
 * In that case, if the existing drawing was the selected tool, then we are in erase mode.
 * If there is no selected tool, then rotate to the next tool in the palette.
 * Otherwise, return null, to let normal drawing happen.
 * @param target a click event on a drawable object
 * @returns The name of a draw tool (overriding the default), or null
 */
function eraseDraw(target:HTMLElement):string|null {
    if (target == null) {
        return null;
    }
    const cur = findFirstChildOfClass(target, 'drawnObject');
    if (cur != null) {
        const curTool = cur.getAttributeNS('', 'data-template-id');
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

/**
 * Draw on the target surface, using the named tool.
 * @param target The surface on which to draw
 * @param tool The name of a tool template
 */
export function doDraw(target:HTMLElement, tool:string) {
    // Template can be null if tool removes drawn objects
    let template = document.getElementById(tool) as HTMLTemplateElement;
    if (template != null) {
        const clone = template.content.cloneNode(true);
        target.appendChild(clone);
        toggleClass(target, tool, true);
    }
    if (_extractorTool != null) {
        updateDrawExtraction();
    }
    saveDrawingLocally(target);
}

let _dragDrawTool:string|null = null;
let _lastDrawTool:string|null = null;

/**
 * Draw where a click happened.
 * Which tool is taken from selected state, click modifiers, and current target state.
 * @param event The mouse click
 */
function onClickDraw(event:MouseEvent) {
    const target = findParentOfClass(event.target as HTMLElement, 'drawable') as HTMLElement;
    let nextTool = eraseDraw(target);
    nextTool = getDrawTool(event, nextTool);
    if (nextTool) {
        doDraw(target, nextTool);   
    }
    _lastDrawTool = nextTool;
    _dragDrawTool = null;
}

/**
 * Continue drawing when the mouse is dragged, using the same tool as in the cell we just left.
 * @param event The mouse enter event
 */
function onMoveDraw(event:MouseEvent) {
    if (event.buttons == 1 && _dragDrawTool != null) {
        const target = findParentOfClass(event.target as HTMLElement, 'drawable') as HTMLElement;
        eraseDraw(target);
        doDraw(target, _dragDrawTool);
        _dragDrawTool = null;
    }
}

/**
 * When dragging a drawing around, copy each cell's drawing to the next one.
 * As the mouse leaves one surface, note which tool is used there.
 * If dragging unrelated to drawing, flag the coming onMoveDraw to do nothing.
 * @param event The mouse leave event
 */
function preMoveDraw(event:MouseEvent) {
    if (event.buttons == 1) {
        const target = findParentOfClass(event.target as HTMLElement, 'drawable');
        if (target != null) {
            const cur = findFirstChildOfClass(target, 'drawnObject');
            if (cur != null) {
                _dragDrawTool = cur.getAttributeNS('', 'data-template-id');
            }
            else {
                _dragDrawTool = _lastDrawTool;
            }
        }
        else {
            _dragDrawTool = null;
        }
    }
}

/**
 * Drawing tools can be flagged to do extraction.
 */
function updateDrawExtraction() {
    const extracted = document.getElementById('extracted');
    if (extracted != null) {
        const drawnObjects = document.getElementsByClassName('drawnObject');
        let extraction = '';
        for (let i = 0; i < drawnObjects.length; i++) {
            const tool = drawnObjects[i].getAttributeNS('', 'data-template-id');
            if (tool == _extractorTool) {
                const drawn = drawnObjects[i] as HTMLElement;
                const extract = findFirstChildOfClass(drawn, 'extract') as HTMLElement;
                if (extract) {
                    extraction += extract.innerText;
                }
            }
        }

        if (extracted.tagName != 'INPUT') {
            extracted.innerText = extraction;
        }
        else {
            let inp = extracted as HTMLInputElement;
            inp.value = extraction;    
        }
    }
}