import { findParentOfClass, findParentOfTag, toggleClass } from "./_classUtil";
import { Position } from "./_dragDrop";

/**
 * Find the center of an element, in client coordinates
 * @param elmt Any element
 * @returns A position
 */
export function positionFromCenter(elmt:HTMLElement): DOMPoint {
    const rect = elmt.getBoundingClientRect();
    return new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
}

/**
 * Convert a client position to an SVG point
 * @param elmt An element in an SVG
 * @param pos A position, in client coordinates
 * @returns an SVG position, in SVG coordinates
 */
export function createSVGPoint(elmt:HTMLElement, pos:DOMPoint) {
    const svg = findParentOfTag(elmt, 'SVG') as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const spt = svg.createSVGPoint();
    spt.x = pos.x - rect.left;
    spt.y = pos.y - rect.top;
    return spt;
}

/**
 * Find the square of the distance between a point and the mouse
 * @param elmt A position, in screen coordinates
 * @param evt A mouse event
 * @returns The distance, squared
 */
export function distance2Mouse(pos:DOMPoint, evt:MouseEvent): number {
    const dx = pos.x - evt.x;
    const dy = pos.y - evt.y;
    return dx * dx + dy * dy;
}

export function distance2(pos:DOMPoint, pos2:DOMPoint): number {
    const dx = pos.x - pos2.x;
    const dy = pos.y - pos2.y;
    return dx * dx + dy * dy;
}

// VOCABULARY
// endpoint: any point that can anchor a straight edge
// ruler-range: the potential drag range
// ruler-path: a drawn line connecting one or more endpoints.
// 
// Ruler ranges can have styles and rules.
// Styles shape the straight edge, which can also be an outline
// Rules dictate drop restrictions and the snap range

/**
 * Scan the page for anything marked endpoint or ruler-range
 * Those items get click handlers
 */
export function preprocessRulerFunctions() {
    let elems = document.getElementsByClassName('ruler-range');
    for (let i = 0; i < elems.length; i++) {
        preprocessRulerRange(elems[i] as HTMLElement);
    }

    // TODO: make lines editable
}

/**
 * Hook up the necessary mouse events to each moveable item
 * @param elem a moveable element
 */
function preprocessEndpoint(elem:HTMLElement) {
}

/**
 * Hook up the necessary mouse events to the background region for a ruler
 * @param elem a moveable element
 */
function preprocessRulerRange(elem:HTMLElement) {
    elem.onmousemove=function(e){onRulerHover(e)};
    elem.onmousedown=function(e){onLineStart(e)};
    elem.onmouseup=function(e){onLineUp(e)};
    elem.ondragenter=function(e){onRulerAllowed(e)};
    elem.ondragover=function(e){onRulerAllowed(e)};
}

type NearestEndpoint = {
    endpoint: HTMLElement;
    centerPos: DOMPoint;
    centerPoint: SVGPoint;
    group: HTMLElement;
}

type RulerEventData = {
    svg: SVGSVGElement;
    container: HTMLElement;
    bounds: DOMRect;
    maxPoints: number;
    hoverRange: number;
    evtPos: DOMPoint;
    evtPoint: SVGPoint;
    nearest?: NearestEndpoint;
}

function getRulerData(evt:MouseEvent):RulerEventData {
    const range = findParentOfClass(evt.target as Element, 'ruler-range') as HTMLElement;
    const svg = findParentOfTag(range, 'SVG') as SVGSVGElement;
    const bounds = svg.getBoundingClientRect();
    const maxPoints = range.getAttributeNS('', 'data-max-points');
    const hoverRange = range.getAttributeNS('', 'data-hover-range');
    const pos = new DOMPoint(evt.x, evt.y);
    let spt = svg.createSVGPoint();
        spt.x = pos.x - bounds.left;
        spt.y = pos.y - bounds.top;
    const data:RulerEventData = {
        svg:svg, 
        container: range,
        bounds: bounds,
        maxPoints:maxPoints ? parseInt(maxPoints) : 2, 
        hoverRange:hoverRange ? parseInt(hoverRange) : (bounds.width + bounds.height),
        evtPos: pos,
        evtPoint: spt,
    };

    let near = findNearestEndpoint(data) as HTMLElement;
    if (near) {
        data.nearest = {
            endpoint: near,
            group: (findParentOfClass(near, 'endpoint-g') as HTMLElement) || near,
            centerPos: positionFromCenter(near),
            centerPoint: svg.createSVGPoint()    
        };
        data.nearest.centerPoint.x = data.nearest.centerPos.x - bounds.left;
        data.nearest.centerPoint.y = data.nearest.centerPos.y - bounds.top;
    }
    return data;
}

let _nearestEndpoint:HTMLElement|null = null;
let _straightLine:SVGPolylineElement|null = null;
let _linePoints:HTMLElement[] = [];

function onRulerHover(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler) {
        return;
    }
    if (ruler.nearest && isInLine(ruler.nearest.endpoint)) {
        return;
    }
    if (ruler.nearest && _straightLine) {
        if (_linePoints.length >= ruler.maxPoints) {
            _straightLine.points.removeItem(ruler.maxPoints - 1);
            _linePoints.splice(ruler.maxPoints - 1, 1);
        }
        // Extend to new point
        _linePoints.push(ruler.nearest.endpoint);
        _straightLine.points.appendItem(ruler.nearest.centerPoint);
    }
    else {
        if (ruler.nearest?.group != _nearestEndpoint) {
            toggleClass(_nearestEndpoint, 'hover', false);
            toggleClass(ruler.nearest?.group as HTMLElement, 'hover', true);
            _nearestEndpoint = ruler.nearest?.group || null;
        }
    }
}

/**
 * Checks to see if an endpoint is already in the current straightline
 * @param end an endpoint
 * @returns true if that endpoint is already in the polyline
 */
function isInLine(end: HTMLElement):boolean {
    if (!_linePoints || !end) {
        return false;
    }
    for (let i = 0; i < _linePoints.length; i++) {
        if (_linePoints[i] == end) {
            return true;
        }
    }
    return false;
}

/**
 * Mouse down over an endpoint
 * @param evt Mouse down event
 */
function onLineStart(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler || !ruler.nearest) {
        return;
    }

    _linePoints = [];
    _linePoints.push(ruler.nearest.endpoint);

    _straightLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline') as SVGPolylineElement;
    toggleClass(_straightLine, 'straight-line');
    _straightLine.points.appendItem(ruler.nearest.centerPoint);
    ruler.container.appendChild(_straightLine);

    toggleClass(_nearestEndpoint, 'hover', false);
    _nearestEndpoint = null;
}

function onLineUp(evt:MouseEvent) {
    if (_straightLine) {
        const range = findParentOfClass(_straightLine, 'ruler-range') as HTMLElement;
        range.removeChild(_straightLine);
        _straightLine = null;
        _linePoints = [];
    }
}

function onRulerAllowed(evt:MouseEvent) {
    
}

function findNearestEndpoint(data:RulerEventData):Element|null {
    let min = data.hoverRange * data.hoverRange;
    const endpoints = data.container.getElementsByClassName('endpoint');
    let nearest:HTMLElement|null = null;
    for (let i = 0; i < endpoints.length; i++) {
        const end = endpoints[i] as HTMLElement;
        const center = positionFromCenter(end);
        const dist = distance2(center, data.evtPos);
        if (min < 0 || dist < min) {
            min = dist;
            nearest = end;
        }
    }
    return nearest;
}