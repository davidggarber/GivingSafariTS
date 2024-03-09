import { theBoiler } from "./_boilerplate";
import { findFirstChildOfClass, findParentOfClass, getOptionalStyle, hasClass, toggleClass } from "./_classUtil";
import { saveStampingLocally } from "./_storage";

// VOCABULARY
// stampable: any object which can be clicked on to draw an icon
// stampPalette: the toolbar from which a user can see and select the draw tools
// stampTool: a UI control to make one or another draw mode the default
// selected: when a stampTool is primary, and will draw when clicking in an active area
// stampToolTemplates: a hidden container of objects that are cloned when drawn
// stampedObject: templates for cloning when drawn

/**
 * The tools in the palette.
 */
const _stampTools:Array<HTMLElement> = [];
/**
 * The currently selected tool from the palette.
 */
let _selectedTool:HTMLElement|null = null;
/**
 * The tool name to cycle to first.
 */
let _firstTool:string|null = null;
/**
 * A tool name which, as a side effect, extract an answer from the content under it.
 */
let _extractorTool:string|null = null;
/**
 * The tool name that would erase things.
 */
let _eraseTool:string|null = null;

/**
 * Type structure of a stamp tool, as provided to a classStampPalette template
 */
export type StampToolDetails = {
    id: string,
    modifier?: string,
    label?: string,
    img?: string,  // img src url
    next?: string,  // id of another tool
    data?: string,  // extra data, depending on context
};

/**
 * Scan the page for anything marked stampable or a draw tool
 */
export function preprocessStampObjects() {
    const containers = document.getElementsByClassName('stampable-container');
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i] as HTMLElement;
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

    let elems = document.getElementsByClassName('stampable');
    for (let i = 0; i < elems.length; i++) {
        const elmt = elems[i] as HTMLElement;
        elmt.onpointerdown=function(e){onClickStamp(e)};
        //elmt.ondrag=function(e){onMoveStamp(e)};
        elmt.onpointerenter=function(e){onMoveStamp(e)}; 
        elmt.onpointerleave=function(e){preMoveStamp(e)};
    }

    elems = document.getElementsByClassName('stampTool');
    for (let i = 0; i < elems.length; i++) {
        const elmt = elems[i] as HTMLElement;
        _stampTools.push(elmt);
        elmt.onclick=function(e){onSelectStampTool(e)};
    }

    const palette = document.getElementById('stampPalette');
    if (palette != null) {
        _extractorTool = palette.getAttributeNS('', 'data-tool-extractor');
        _eraseTool = palette.getAttributeNS('', 'data-tool-erase');
        _firstTool = palette.getAttributeNS('', 'data-tool-first');
    }

    if (!_firstTool) {
        _firstTool = _stampTools[0].getAttributeNS('', 'data-template-id');
    }
}

/**
 * Called when a draw tool is selected from the palette
 * @param event The click event
 */
function onSelectStampTool(event:MouseEvent) {
    const tool = findParentOfClass(event.target as HTMLElement, 'stampTool') as HTMLElement;
    const prevToolId = getCurrentStampToolId();
    if (tool != null) {
        for (let i = 0; i < _stampTools.length; i++) {
            toggleClass(_stampTools[i], 'selected', false);
        }
        if (tool != _selectedTool) {
            toggleClass(tool, 'selected', true);
            _selectedTool = tool;
        }
        else {
            _selectedTool = null;
        }
    }

    const fn = theBoiler().onStampChange;
    if (fn) {
        fn(getCurrentStampToolId(), prevToolId);
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
function getStampTool(event:MouseEvent, toolFromErase:string|null):string|null {
    // Shift keys always win
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (let i = 0; i < _stampTools.length; i++) {
            const mods = _stampTools[i].getAttributeNS('', 'data-click-modifier');
            if (mods != null
                    && event.shiftKey == (mods.indexOf('shift') >= 0)
                    && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                    && event.altKey == (mods.indexOf('alt') >= 0)) {
                return _stampTools[i].getAttributeNS('', 'data-template-id');
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
    if (_selectedTool != null) {
        return _selectedTool.getAttributeNS('', 'data-template-id');
    }

    // If no selection, the first tool is the default
    return _firstTool;
}

/**
 * Expose current stamp tool, in case other features want to react
 */
export function getCurrentStampToolId() {
    if (_selectedTool == null) {
        return '';
    }
    var id = _selectedTool.getAttributeNS('', 'data-template-id');
    return id || '';
}

/**
 * A stampable element can be the eventual container of the stamp. (example: TD)
 * Or it can assign another element to be the stamp container, with the data-stamp-parent attribute.
 * If present, that field specifies the ID of an element.
 * @param target An element with class="stampable"
 * @returns 
 */
export function getStampParent(target:HTMLElement) {
    const parentId = getOptionalStyle(target, 'data-stamp-parent');
    if (parentId) {
        return document.getElementById(parentId) as HTMLElement;
    }
    return target;
}

/**
 * When drawing on a surface where something is already drawn. The first click
 * always erases the existing drawing.
 * In that case, if the existing drawing was the selected tool, then we are in erase mode.
 * If there is no selected tool, then rotate to the next tool in the palette.
 * Otherwise, return null, to let normal drawing happen.
 * @param target a click event on a stampable object
 * @returns The name of a draw tool (overriding the default), or null
 */
function eraseStamp(target:HTMLElement):string|null {
    if (target == null) {
        return null;
    }
    const parent = getStampParent(target);

    const cur = findFirstChildOfClass(parent, 'stampedObject');
    let curId:string|null;
    let nextId:string|null = '';
    if (cur != null) {
        curId = cur.getAttributeNS('', 'data-template-id');
        toggleClass(target, curId, false);
        parent.removeChild(cur);
        if (_extractorTool != null) {
            updateStampExtraction();
        }
        nextId = cur.getAttributeNS('', 'data-next-template-id');   
    }
    else if (hasClass(target, 'stampedObject')) {
        // Template is a class on the container itself
        curId = target.getAttributeNS('', 'data-template-id');
        toggleClass(target, 'stampedObject', false);
        toggleClass(target, curId, false);
        target.removeAttributeNS('', 'data-template-id');
        if (_extractorTool != null) {
            updateStampExtraction();
        }
    }
    else {
        return null;  // This cell is currently blank
    }

    if (_selectedTool == null) {
        // rotate through the tools
        if (!nextId && curId) {
            const stampTool = findStampTool(curId);
            nextId = stampTool.getAttributeNS('', 'data-next-template-id');
        }
        if (nextId) {
            return nextId;
        }
        
    }
    if (_selectedTool && _selectedTool.getAttributeNS('', 'data-template-id') == curId) {
        // When a tool is explicitly selected, clicking on that type toggles it back off
        return _eraseTool;
    }

    // No guidance on what to replace this cell with
    return null;
}

/**
 * Given a stamp ID from a stamped element, find the tool that applied it.
 * @param templateId A string that must match a stampTool in this document.
 * @returns The stampTool element.
 */
function findStampTool(templateId:string):HTMLElement {
    const tools = document.getElementsByClassName('stampTool');
    for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        if (tool.getAttributeNS('', 'data-template-id') == templateId) {
            return tool as HTMLElement;
        }
    }
    throw new Error('Unrecognized stamp tool: ' + templateId);
}

/**
 * Draw on the target surface, using the named tool.
 * @param target The surface on which to draw
 * @param tool The name of a tool template
 */
export function doStamp(target:HTMLElement, tool:string) {
    const parent = getStampParent(target);
    
    // Template can be null if tool removes drawn objects
    let template = document.getElementById(tool) as HTMLTemplateElement;
    if (template != null) {
        // Inject the template into the stampable container
        const clone = template.content.cloneNode(true);
        parent.appendChild(clone);
    }
    else if (tool) {
        // Apply the template ID as a style. The container is itself the stamped object
        toggleClass(target, 'stampedObject', true);
        target.setAttributeNS('', 'data-template-id', tool);
    }
    toggleClass(target, tool, true);
    if (_extractorTool != null) {
        updateStampExtraction();
    }
    saveStampingLocally(target);

    const fn = theBoiler().onStamp;
    if (fn) {
        fn(target);
    }
}

let _dragDrawTool:string|null = null;
let _lastDrawTool:string|null = null;

/**
 * Draw where a click happened.
 * Which tool is taken from selected state, click modifiers, and current target state.
 * @param event The mouse click
 */
function onClickStamp(event:MouseEvent) {
    const target = findParentOfClass(event.target as HTMLElement, 'stampable') as HTMLElement;
    let nextTool = eraseStamp(target);
    nextTool = getStampTool(event, nextTool);
    if (nextTool) {
        doStamp(target, nextTool);   
    }
    _lastDrawTool = nextTool;
    _dragDrawTool = null;
}

/**
 * Continue drawing when the mouse is dragged, using the same tool as in the cell we just left.
 * @param event The mouse enter event
 */
function onMoveStamp(event:MouseEvent) {
    if (event.buttons == 1 && _dragDrawTool != null) {
        const target = findParentOfClass(event.target as HTMLElement, 'stampable') as HTMLElement;
        eraseStamp(target);
        doStamp(target, _dragDrawTool);
        _dragDrawTool = null;
    }
}

/**
 * When dragging a drawing around, copy each cell's drawing to the next one.
 * As the mouse leaves one surface, note which tool is used there.
 * If dragging unrelated to drawing, flag the coming onMoveStamp to do nothing.
 * @param event The mouse leave event
 */
function preMoveStamp(event:MouseEvent) {
    if (event.buttons == 1) {
        const target = findParentOfClass(event.target as HTMLElement, 'stampable');
        if (target != null) {
            const cur = findFirstChildOfClass(target, 'stampedObject');
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
function updateStampExtraction() {
    const extracted = document.getElementById('extracted');
    if (extracted != null) {
        const drawnObjects = document.getElementsByClassName('stampedObject');
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