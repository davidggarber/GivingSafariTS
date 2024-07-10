import { theBoiler } from "./_boilerplate";
import { useTemplate } from "./_builderUse";
import { findFirstChildOfClass, findNthChildOfClass, findParentOfClass, getOptionalStyle, hasClass, siblingIndexOfClass, toggleClass } from "./_classUtil";
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
let _firstTool:HTMLElement|null = null;
/**
 * A tool name which, as a side effect, extract an answer from the content under it.
 */
let _extractorTool:HTMLElement|null = null;
/**
 * The tool name that would erase things.
 */
let _eraseTool:HTMLElement|null = null;

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

let stamps_can_drag = false;

/**
 * A document can only support a single stamp palette.
 * @returns The palette container, if one exists, else null
 */
function findStampPalette():HTMLElement|null {
    return document.getElementById('stampPalette');
}

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
        container.addEventListener('pointerdown', pointerDownInContainer);
        if (hasClass(container, 'stamp-drag')) {
            stamps_can_drag = true;
            container.addEventListener('pointerup', pointerUpInContainer);
            container.addEventListener('pointermove', pointerMoveInContainer);
            container.addEventListener('pointerleave', pointerLeaveContainer);    
        }
    }

    let elems = document.getElementsByClassName('stampable');
    if (containers.length == 0 && elems.length > 0) {
        const container = document.getElementById('pageBody');
        if (container) {
            container.addEventListener('pointerdown', pointerDownInContainer);
            // container.addEventListener('pointerup', pointerUpInContainer);
            // container.addEventListener('pointermove', pointerMoveInContainer);
            // container.addEventListener('pointerleave', pointerLeaveContainer);
        }
        // for (let i = 0; i < elems.length; i++) {
        //     const elmt = elems[i] as HTMLElement;
        //     elmt.onpointerdown=function(e){onClickStamp(e, findStampableAtPointer(e))};
        //     //elmt.ondrag=function(e){onMoveStamp(e)};
        //     elmt.onpointerenter=function(e){onMoveStamp(e)}; 
        //     elmt.onpointerleave=function(e){preMoveStamp(e)};
        // }
    }

    elems = document.getElementsByClassName('stampTool');
    for (let i = 0; i < elems.length; i++) {
        const elmt = elems[i] as HTMLElement;
        _stampTools.push(elmt);
        elmt.onclick=function(e){onSelectStampTool(e)};
    }

    const palette = findStampPalette();
    if (palette != null) {
        let id = palette.getAttributeNS('', 'data-tool-extractor');
        _extractorTool = id != null ? document.getElementById(id) : null;
        id = palette.getAttributeNS('', 'data-tool-erase');
        _eraseTool = id != null ? document.getElementById(id) : null;
        id = palette.getAttributeNS('', 'data-tool-first');
        _firstTool = id != null ? document.getElementById(id) : null;
    }

    if (!_firstTool) {
        _firstTool = _stampTools[0];
    }
}

let prevStampablePointer:HTMLElement|null = null;
function pointerDownInContainer(event:PointerEvent) {
    if (!isPrimaryButton(event)) {
        return;
    }
    if (event.pointerType != 'mouse' && stamps_can_drag) {
        event.preventDefault();
    }
    const elmt = findStampableAtPointer(event);
    if (elmt) {
        prevStampablePointer = elmt;
        onClickStamp(event, elmt);
    }
}

function pointerUpInContainer(event:PointerEvent) {
    if (!isPrimaryButton(event)) {
        return;
    }
    if (event.pointerType != 'mouse' && stamps_can_drag) {
        event.preventDefault();
    }
    prevStampablePointer = null;
}

function pointerMoveInContainer(event:PointerEvent) {
    if (!isPrimaryButton(event)) {
        return;
    }
    if (event.pointerType != 'mouse' && stamps_can_drag) {
        event.preventDefault();
    }
    const elmt = findStampableAtPointer(event);
    if (elmt !== prevStampablePointer) {
        if (prevStampablePointer) {
            preMoveStamp(event, prevStampablePointer);
        }
        if (elmt) {
            onMoveStamp(event, elmt);
        }
        prevStampablePointer = elmt;
    }
}

function pointerLeaveContainer(event:PointerEvent) {
    if (!isPrimaryButton(event)) {
        return;
    }
    if (event.pointerType != 'mouse' && stamps_can_drag) {
        event.preventDefault();
    }
    if (prevStampablePointer) {
        preMoveStamp(event, prevStampablePointer);
    }
    prevStampablePointer = null;
}

function findStampableAtPointer(event:PointerEvent):HTMLElement|null {
    const stampable = document.getElementsByClassName('stampable');
    for (let i = 0; i < stampable.length; i++) {
        const rect = stampable[i].getBoundingClientRect();
        if (rect.left <= event.clientX && rect.right > event.clientX
                && rect.top <= event.clientY && rect.bottom > event.clientY) {
            return stampable[i] as HTMLElement;
        }
    }
    return null;
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
function getStampTool(event:PointerEvent, toolFromErase:HTMLElement|null):HTMLElement|null {
    // Shift keys always win
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (let i = 0; i < _stampTools.length; i++) {
            const mods = _stampTools[i].getAttributeNS('', 'data-click-modifier');
            if (mods != null
                    && event.shiftKey == (mods.indexOf('shift') >= 0)
                    && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                    && event.altKey == (mods.indexOf('alt') >= 0)) {
                return _stampTools[i];
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
        return _selectedTool;
    }

    // If no selection, the first tool is the default
    return _firstTool;
}

/**
 * A stamp is referenced by the object it was stamped upon.
 * Look up the original stampTool element.
 * @param id The stamp ID
 * @returns An HTMLElement, unless the stamping is malformed.
 */
function getStampToolById(id:string|null):HTMLElement|null {
    return id ? document.getElementById(id) : null;
}

/**
 * Given one tool, currently applied to a target, what is the next stamp in rotation?
 * @param tool The current tool's HTMLElement, or null if none.
 * @returns The next tool's HTMLElement, or else the _firstTool
 */
function getNextStampTool(tool:HTMLElement|null):HTMLElement|null {
    if (tool) {
        const nextId = tool.getAttributeNS('', 'data-next-stamp-id');
        if (nextId) {
            return document.getElementById(nextId);
        }
        const palette = findStampPalette();
        if (palette) {
            const curIndex = siblingIndexOfClass(palette, tool, 'stampTool');
            return findNthChildOfClass(palette, 'stampTool', curIndex + 1) as HTMLElement|null;
        }
    }
    return _firstTool;
} 

/**
 * Expose current stamp tool, in case other features want to react
 */
export function getCurrentStampToolId() {
    if (_selectedTool == null) {
        return '';
    }
    var id = _selectedTool.id;
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
function eraseStamp(target:HTMLElement):HTMLElement|null {
    if (target == null) {
        return null;
    }
    const parent = getStampParent(target);

    const cur = findFirstChildOfClass(parent, 'stampedObject');
    let curId:string|null;
    if (cur != null) {
        // The target contains a stampedObject, which was injected by a template
        // The tool itself is likely stamped on the parent, but check everywhere
        curId = getOptionalStyle(cur, 'data-stamp-id');
        toggleClass(target, curId, false);
        parent.removeChild(cur);
        parent.removeAttributeNS('', 'data-stamp-id');
        updateStampExtraction();
    }
    else if (hasClass(target, 'stampedObject')) {
        // Template is a class on the container itself
        curId = target.getAttributeNS('', 'data-stamp-id');
        toggleClass(target, 'stampedObject', false);
        toggleClass(target, curId, false);
        target.removeAttributeNS('', 'data-stamp-id');
        updateStampExtraction();
    }
    else {
        return null;  // This cell is currently blank
    }

    if (_selectedTool && _selectedTool.id == curId) {
        // When a tool is explicitly selected, clicking on that type toggles it back off
        return _eraseTool;
    }
    if (_selectedTool == null) {
        // If no tool is selected, clicking on anything rotates it to the next tool in the cycle
        if (curId) {
            const curTool = getStampToolById(curId);
            const nextTool = getNextStampTool(curTool);
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
export function doStamp(target:HTMLElement, tool:HTMLElement) {
    const parent = getStampParent(target);
    
    // Template can be null if tool removes drawn objects
    const tmpltId = tool.getAttributeNS('', 'data-template-id');
    const useId = tool.getAttributeNS('', 'data-use-template-id');
    const styles = tool.getAttributeNS('', 'data-style');
    const unstyles = tool.getAttributeNS('', 'data-unstyle');
    const erase = tool.getAttributeNS('', 'data-erase');
    if (tmpltId) {
        let template = document.getElementById(tmpltId) as HTMLTemplateElement;
        if (template != null) {
            // Inject the template into the stampable container
            const clone = template.content.cloneNode(true);
            parent.appendChild(clone);
        }
        parent.setAttributeNS('', 'data-stamp-id', tool.id);
    }
    else if (useId) {
        const nodes = useTemplate(tool, useId);
        for (let i = 0; i < nodes.length; i++) {
            parent.appendChild(nodes[i]);
        }
        parent.setAttributeNS('', 'data-stamp-id', tool.id);
    }
    else if (erase != null) {
        // Do nothing. The caller should already have removed any existing contents
    }

    // Styles can coexist with templates
    if (styles || unstyles) {
        toggleClass(target, 'stampedObject', true);
        target.setAttributeNS('', 'data-stamp-id', tool.id);
        
        if (styles) {
            // Apply one or more styles (delimited by spaces)
            // to the target itself. NOT to some parent stampable object.
            // No parent needed if we're not injecting anything.
            const split = styles.split(' ');
            for (let i = 0; i < split.length; i++) {
                toggleClass(target, split[i], true);
            }
        }
        if (unstyles) {
            // Apply one or more styles (delimited by spaces)
            // to the target itself. NOT to some parent stampable object.
            // No parent needed if we're not injecting anything.
            const split = unstyles.split(' ');
            for (let i = 0; i < split.length; i++) {
                toggleClass(target, split[i], false);
            }
        }    
    }

    updateStampExtraction();
    saveStampingLocally(target);

    const fn = theBoiler().onStamp;
    if (fn) {
        fn(target);
    }
}

let _dragDrawTool:HTMLElement|null = null;
let _lastDrawTool:HTMLElement|null = null;

/**
 * Draw where a click happened.
 * Which tool is taken from selected state, click modifiers, and current target state.
 * @param event The mouse click
 */
function onClickStamp(event:PointerEvent, target:HTMLElement) {
    let nextTool = eraseStamp(target);
    nextTool = getStampTool(event, nextTool);
    if (nextTool) {
        doStamp(target, nextTool);   
    }
    _lastDrawTool = nextTool;
    _dragDrawTool = null;
}

function isPrimaryButton(event:PointerEvent) {
    return event.pointerType != 'mouse' || event.buttons == 1;
}

/**
 * Continue drawing when the mouse is dragged, using the same tool as in the cell we just left.
 * @param event The mouse enter event
 */
function onMoveStamp(event:PointerEvent, target:HTMLElement) {
    if (_dragDrawTool != null) {
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
function preMoveStamp(event:PointerEvent, target:HTMLElement) {
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
function updateStampExtraction() {
    if (!_extractorTool) {
        return;
    }
    const extracted = document.getElementById('extracted');
    if (extracted != null) {
        const drawnObjects = document.getElementsByClassName('stampedObject');
        let extraction = '';
        for (let i = 0; i < drawnObjects.length; i++) {
            const tool = getOptionalStyle(drawnObjects[i], 'data-stamp-id');
            if (tool == _extractorTool.id) {
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