import { info } from "console";
import { findParentOfClass, findParentOfTag, hasClass, toggleClass } from "./_classUtil";
import { svg_xmlns } from "./_tableBuilder";

type SvgDragInfo = {
  id: string,  // ID of the element being dragged
  mover: SVGGraphicsElement,  // The element being dragged
  handle: SVGGraphicsElement,  // The sub-element being dragged (or just the main element)
  bounds: DOMRect,  // The bounds of the inntermost handle
  parent: SVGGraphicsElement,  // Its current parent, either drop-target or drag-source
  hover: SVGGraphicsElement|null,  // The prospective parent we're currently over
  client: DOMPoint,  // Initial point of drag, in screen coordinates
  offset: DOMPoint,  // Where within the mover the mouse was clicked, in initial parent coordinates
  translation: DOMPoint,  // Is the mover already translated within its parent?
  click: boolean,  // this might just be a click, not a drag
};

type SvgDropInfo = {
  target: SVGGraphicsElement|null,  // Its current parent, if a drop-target
  origin: DOMPoint,  // Origin of target, in client coordinates
  handle: SVGGraphicsElement,  // Which moving handle hit this target?
  client: DOMPoint,  // Latest client point of drag
  drag: boolean,  // Did this travel far enough to be a drag?
};

var _svgDragInfo:SvgDragInfo|null = null;
var _svgSelectInfo:SvgDragInfo|null = null;

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
export function preprocessSvgDragFunctions(svgId:string) {
    let svg = document.getElementById(svgId) as unknown as SVGSVGElement | null;
    if (svg != null) {
      svg.addEventListener('pointerleave', cancelSvgDrag);
      svg.addEventListener('pointermove', midSvgDrag);
      svg.addEventListener('pointerup', endSvgDrag);
      svg.addEventListener('pointerdown', clickSvgDragCanvas);
    }
    else {
      const svgs = document.getElementsByClassName(svgId);
      for (let i = 0; i < svgs.length; i++) {
        svg = svgs[i] as SVGSVGElement;
        svg.addEventListener('pointerleave', cancelSvgDrag);
        svg.addEventListener('pointermove', midSvgDrag);
        svg.addEventListener('pointerup', endSvgDrag);
        svg.addEventListener('pointerdown', clickSvgDragCanvas);
      }
    }
}

/**
 * Convert a screen coordinate into a point in an element's frame of reference
 * @param element: the SVG element whose frame we're interested in
 * @param clientX: the document X coordinate, as from a pointer event
 * @param clientY: the document Y coordinate, as from a pointer event
 */
function clientToLocalPoint(element: SVGGraphicsElement, clientX: number, clientY: number): DOMPoint {
  const svg = findParentOfTag(element, 'svg') as SVGSVGElement;
  
  // Create a point in screen coordinates
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    // Get the consolidated transformation matrix for the element
    const ctm = element.getScreenCTM();
    if (!ctm) return new DOMPoint(NaN, NaN);

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
function localToClientPoint(element: SVGGraphicsElement, localX: number, localY: number): DOMPoint {
  const svg = findParentOfTag(element, 'svg') as SVGSVGElement;

  // Create a point in local coordinates
  const pt = svg.createSVGPoint();
  pt.x = localX;
  pt.y = localY;

  // Get the consolidated transformation matrix for the element
  const ctm = element.getScreenCTM();
  if (!ctm) return new DOMPoint(NaN, NaN);

  // Transform the point into the element's local coordinate system
  const client = pt.matrixTransform(ctm);
  return new DOMPoint(client.x, client.y);
}

/**
 * Start a drag action on the moveable element at this pointer
 * @param evt A pointer down event
 */
function startSvgDrag(evt:PointerEvent) {
  if (evt.pointerType != 'mouse') {
    evt.preventDefault();
  }

  if (_svgDragInfo) {
    cancelSvgDrag()
  }
  let mover = firstSvgMoveable(evt.clientX, evt.clientY);
  if (!mover) {
    return;
  }

  let relPoint = clientToLocalPoint(mover, evt.clientX, evt.clientY);
  let translation = new DOMPoint(0, 0);
  if (mover.transform && mover.transform.baseVal.length > 0) {
    translation.x = mover.transform.baseVal[0].matrix.e;
    translation.y = mover.transform.baseVal[0].matrix.f;
  }

  let handle:SVGGraphicsElement|null = null;
  let bounds = mover.getBoundingClientRect();
  let hDist = NaN;
  const handles = mover.getElementsByClassName('drag-handle');
  for (let i = 0; i < handles.length; i++) {
    const h = handles[i] as SVGGraphicsElement;
    const hrc = h.getBoundingClientRect();
    const dist = Math.hypot(hrc.left + hrc.width / 2 - evt.clientX, hrc.top + hrc.height / 2 - evt.clientY);
    if (handle == null || dist < hDist) {
      handle = h;
      hDist = dist;
      bounds = hrc;
      // relPoint = clientToLocalPoint(mover, hrc.left + hrc.width / 2, hrc.top + hrc.height / 2);
    }
  }

  let source = findParentOfClass(mover, 'drag-source') as SVGGraphicsElement;
  let target = findParentOfClass(mover, 'drop-target') as SVGGraphicsElement;
  if (!target && !source) {
    console.error('Found a moveable ${mover.id} that is not in a drag-source or drop-target parent');
    return;  // not a drag-source or drop-target
  }

  _svgDragInfo = {
    id: mover.id,
    mover: mover,
    handle: handle || mover,
    bounds: bounds,
    parent: target || source,
    hover: target || source,
    client: new DOMPoint(evt.clientX, evt.clientY),
    offset: relPoint,
    translation: translation,
    click: true,  // this might just be a click, not a drag
  };

  toggleClass(mover, 'dragging', true);
  toggleClass(mover, 'selected', true);
  // not yet droppable
}

/**
 * Continue a drag operation, while the mouse is still down.
 * @param evt A pointer move event
 */
function midSvgDrag(evt:PointerEvent) {
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
    let local = clientToLocalPoint(_svgDragInfo.mover.parentNode as SVGGraphicsElement, evt.clientX, evt.clientY);
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
function firstSvgMoveable(clientX:number, clientY:number): SVGGraphicsElement|null {
  const elements = document.elementsFromPoint(clientX, clientY);
  for (let i = 0; i < elements.length; i++) {
    const elem = elements[i] as Element;
    const mov = findParentOfClass(elem, 'moveable');
    if (mov != null) {
      return mov as SVGGraphicsElement;
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
function firstSvgDropTarget(clientX:number, clientY:number): SVGGraphicsElement|null {
  const elements = document.elementsFromPoint(clientX, clientY);
  for (let i = 0; i < elements.length; i++) {
    const elem = elements[i] as Element;
    if (findParentOfClass(elem, 'moveable')) {
      // Ignore the moveable item, as its parents may be elsewhere on the page
      continue;
    }
    // the target may not actually be one of the elements, but it might be one of their parents
    // IDEA: do a bounding rect, as a check
    let target = findParentOfClass(elem, 'drop-target') as SVGGraphicsElement|null
    if (target) {
      return target;
    } 

    // drag-sources must match the dragged element or else have no ID at all
    target = findParentOfClass(elem, 'drag-source') as SVGGraphicsElement|null;
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
function calcSvgDropInfo(clientX:number, clientY:number): SvgDropInfo|null {
  if (_svgDragInfo) {
    let target = firstSvgDropTarget(clientX, clientY);
    let handle = _svgDragInfo.handle;
    if (!target) {
      // See if any other handles hit targets?
      const handles = _svgDragInfo.mover.getElementsByClassName('drag-handle');
      for (let i = 0; i < handles.length; i++) {
        handle = handles[i] as SVGGraphicsElement;
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

    let dragging = !_svgDragInfo.click || (target != _svgDragInfo.parent);
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

function reparentSvgDrag(target:SVGGraphicsElement) {
  if (_svgDragInfo && _svgDragInfo.mover.parentNode != target) {
    // The mover is not in the expected parent, so move it
    if (_svgDragInfo.mover.parentNode) {
      _svgDragInfo.mover.parentNode.removeChild(_svgDragInfo.mover);
    }
    target.appendChild(_svgDragInfo.mover);  // REVIEW: prepend?
  }
}

/**
 * Attempt to end a drag operation, and drop the element.
 * @param evt The pointer up event
 */
function endSvgDrag(evt:PointerEvent) {
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
    reparentSvgDrag(info.target!);
    
    // Add a translation, if needed
    let translate:DOMPoint|null = null;
    if (hasClass(info.target, 'drag-source')) {
      // When returning to the drag source, remove the transform
      _svgDragInfo.mover.style.transform = '';
    }
    else if (hasClass(info.target, 'free-drop')) {
      // Convert the original click offset to the current screen point,
      // but relative to the target origin
      let local = clientToLocalPoint(_svgDragInfo.mover.parentNode as SVGGraphicsElement, evt.clientX, evt.clientY);
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
function clickSvgDragCanvas(evt:PointerEvent) {
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

