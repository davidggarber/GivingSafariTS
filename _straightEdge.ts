import { isDebug } from "./_boilerplate";
import { findParentOfClass, findParentOfTag, hasClass, toggleClass } from "./_classUtil";
import { Position } from "./_dragDrop";
import { getGlobalIndex, indexAllVertices, mapGlobalIndeces } from "./_storage";

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
// vertex: any point that can anchor a straight edge
// straigh-edge-area: the potential drag range
// ruler-path: a drawn line connecting one or more vertices.
// 
// Ruler ranges can have styles and rules.
// Styles shape the straight edge, which can also be an outline
// Rules dictate drop restrictions and the snap range

/**
 * Scan the page for anything marked vertex or straigh-edge-area
 * Those items get click handlers
 */
export function preprocessRulerFunctions() {
    let elems = document.getElementsByClassName('straigh-edge-area');
    for (let i = 0; i < elems.length; i++) {
        preprocessRulerRange(elems[i] as HTMLElement);
    }

    indexAllVertices();
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

type VertexData = {
    vertex: HTMLElement;
    index: number;
    centerPos: DOMPoint;
    centerPoint: SVGPoint;
    group: HTMLElement;
}

type RulerEventData = {
    svg: SVGSVGElement;
    container: HTMLElement;
    bounds: DOMRect;
    maxPoints: number;
    canShareVertices: boolean;
    hoverRange: number;
    showOpenDrag: boolean;
    evtPos: DOMPoint;
    evtPoint: SVGPoint;
    nearest?: VertexData;
}

function getRulerData(evt:MouseEvent):RulerEventData {
    const range = findParentOfClass(evt.target as Element, 'straigh-edge-area') as HTMLElement;
    const svg = findParentOfTag(range, 'SVG') as SVGSVGElement;
    const bounds = svg.getBoundingClientRect();
    const maxPoints = range.getAttributeNS('', 'data-max-points');
    const canShareVertices = range.getAttributeNS('', 'data-can-share-vertices');
    const hoverRange = range.getAttributeNS('', 'data-hover-range');
    const showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    const pos = new DOMPoint(evt.x, evt.y);
    let spt = svg.createSVGPoint();
        spt.x = pos.x - bounds.left;
        spt.y = pos.y - bounds.top;
    const data:RulerEventData = {
        svg: svg, 
        container: range,
        bounds: bounds,
        maxPoints: maxPoints ? parseInt(maxPoints) : 2, 
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        hoverRange: hoverRange ? parseInt(hoverRange) : (bounds.width + bounds.height),
        showOpenDrag: showOpenDrag ? (showOpenDrag.toLowerCase() == 'true') : false,
        evtPos: pos,
        evtPoint: spt,
    };

    let near = findNearestVertex(data) as HTMLElement;
    if (near) {
        data.nearest = getVertexData(data, near);
    }
    return data;
}

function getVertexData(ruler:RulerEventData, vert:HTMLElement):VertexData {
    const data:VertexData = {
        vertex: vert,
        index: getGlobalIndex(vert, 'vx'),
        group: (findParentOfClass(vert, 'vertex-g') as HTMLElement) || vert,
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
let _straightEdges:SVGPolylineElement[] = [];
/**
 * The nearest vertex, if being affected by hover
 */
let _hoverEndpoint:HTMLElement|null = null;
/**
 * A straight edge under construction
 */
let _straightEdgeBuilder:SVGPolylineElement|null = null;
/**
 * The vertices that are part of the straight edge under construction
 */
let _straightEdgeVertices:HTMLElement[] = [];

function onRulerHover(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler) {
        return;
    }
    const inLineIndex = ruler.nearest ? indexInLine(ruler.nearest.vertex) : -1;
    if (_straightEdgeBuilder && inLineIndex >= 0) {
        if (inLineIndex == _straightEdgeVertices.length - 2) {
            // Dragging back to the start contracts the line
            _straightEdgeBuilder.points.removeItem(ruler.maxPoints - 1);
            toggleClass(_straightEdgeVertices[ruler.maxPoints - 1], 'building', false);
            _straightEdgeVertices.splice(ruler.maxPoints - 1, 1);
        }
        // Hoving near any other index is ignored
        return;
    }
    if (_straightEdgeBuilder) {
        // Extending a straight-edge that we've already started
        if (ruler.nearest || ruler.showOpenDrag) {
            if (_straightEdgeBuilder.points.length >= ruler.maxPoints) {
                if (_straightEdgeVertices.length == _straightEdgeBuilder.points.length) {
                    toggleClass(_straightEdgeVertices[ruler.maxPoints - 1], 'building', false);
                    _straightEdgeVertices.splice(ruler.maxPoints - 1, 1);
                }
                _straightEdgeBuilder.points.removeItem(ruler.maxPoints - 1);
            }
        }
        if (_straightEdgeVertices.length < ruler.maxPoints) {
            if (ruler.nearest) {
                // Extend to new point
                toggleClass(_straightEdgeBuilder, 'open-ended', false);
                snapStraightLineTo(ruler, ruler.nearest);
            }
            else if (ruler.showOpenDrag) {
                toggleClass(_straightEdgeBuilder, 'open-ended', true);
                openStraightLineTo(ruler);
            }
        }
    }
    else {
        // Hovering near a point
        if (ruler.nearest?.group != _hoverEndpoint) {
            toggleClass(_hoverEndpoint, 'hover', false);
            toggleClass(ruler.nearest?.group as HTMLElement, 'hover', true);
            _hoverEndpoint = ruler.nearest?.group || null;
        }
    }
}
/**
 * Mouse down over an vertex
 * @param evt Mouse down event
 */
function onLineStart(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler || !ruler.nearest) {
        return;
    }

    if (!ruler.canShareVertices && hasClass(ruler.nearest.vertex, 'has-line')) {
        // User has clicked a point that already has a line
        // Re-select it
        const edge = findStraightEdgeFromVertex(ruler.nearest.index);
        if (edge) {
            deleteStraightEdge(edge);
            // Find the other end of this edge
            const vertices = findStraightEdgeVertices(edge);
            if (vertices.length == 2) {
                if (vertices[0] == ruler.nearest.vertex) {
                    createStraightLineFrom(ruler, getVertexData(ruler, vertices[1]));
                }
                else {
                    createStraightLineFrom(ruler, getVertexData(ruler, vertices[0]));
                }
                snapStraightLineTo(ruler, ruler.nearest);
                return;
            }
        }
    }

    createStraightLineFrom(ruler, ruler.nearest);
}

function onLineUp(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler) {
        return;
    }
    if (_straightEdgeBuilder) {
        if (_straightEdgeVertices.length < 2) {
            // Incomplete without at least two snapped ends. Abandon
            const range = findParentOfClass(_straightEdgeBuilder, 'straigh-edge-area') as HTMLElement;
            range.removeChild(_straightEdgeBuilder);
            _straightEdgeBuilder = null;
        }
        else {
            if (_straightEdgeBuilder.points.length > _straightEdgeVertices.length) {
                // Remove open-end
                _straightEdgeBuilder.points.removeItem(ruler.maxPoints - 1);
                toggleClass(_straightEdgeBuilder, 'open-ended', false);
            }
        }
    }

    const indeces:number[] = [];
    for (let i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(_straightEdgeVertices[i], 'building', false);
        toggleClass(_straightEdgeVertices[i], 'has-line', _straightEdgeBuilder != null);
        indeces.push(getGlobalIndex(_straightEdgeVertices[i], 'vx'));
    }

    if (_straightEdgeBuilder) {
        toggleClass(_straightEdgeBuilder, 'building', false);
        _straightEdgeBuilder?.setAttributeNS('', 'data-vertices', ','+indeces.join(',')+',');
        _straightEdges.push(_straightEdgeBuilder);
    }

    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}

function createStraightLineFrom(ruler:RulerEventData, start:VertexData) {
    _straightEdgeVertices = [];
    _straightEdgeVertices.push(start.vertex);

    _straightEdgeBuilder = document.createElementNS('http://www.w3.org/2000/svg', 'polyline') as SVGPolylineElement;
    toggleClass(_straightEdgeBuilder, 'straight-edge', true);
    toggleClass(_straightEdgeBuilder, 'building', true);
    toggleClass(start.vertex, 'building', true);
    _straightEdgeBuilder.points.appendItem(start.centerPoint);
    ruler.container.appendChild(_straightEdgeBuilder);

    toggleClass(_hoverEndpoint, 'hover', false);
    _hoverEndpoint = null;
}

function snapStraightLineTo(ruler:RulerEventData, next:VertexData) {
    _straightEdgeVertices.push(next.vertex);
    _straightEdgeBuilder?.points.appendItem(next.centerPoint);
    toggleClass(next.vertex, 'building', true);
}

function openStraightLineTo(ruler:RulerEventData) {
    _straightEdgeBuilder?.points.appendItem(ruler.evtPoint);
}

/**
 * Checks to see if an vertex is already in the current straightline
 * @param end an vertex
 * @returns The index of this element in the straight edge
 */
function indexInLine(end: HTMLElement):number {
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

function deleteStraightEdge(edge:SVGPolylineElement) {
    for (let i = 0; i < _straightEdges.length; i++) {
        if (_straightEdges[i] === edge) {
            _straightEdges.splice(i, 1);
            break;
        }
    }
    edge.parentNode?.removeChild(edge);
}

function onRulerAllowed(evt:MouseEvent) {
    
}

function findNearestVertex(data:RulerEventData):Element|null {
    let min = data.hoverRange * data.hoverRange;
    const vertices = data.container.getElementsByClassName('vertex');
    let nearest:HTMLElement|null = null;
    for (let i = 0; i < vertices.length; i++) {
        const end = vertices[i] as HTMLElement;
        const center = positionFromCenter(end);
        const dist = distance2(center, data.evtPos);
        if (min < 0 || dist < min) {
            min = dist;
            nearest = end;
        }
    }
    return nearest;
}

function findStraightEdgeFromVertex(index:number):SVGPolylineElement|null {
    const pat = ',' + String(index) + ',';
    const edges = document.getElementsByClassName('straight-edge');
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i] as SVGPolylineElement;
        const indexList = edge.getAttributeNS('', 'data-vertices')
        if (indexList && indexList.search(pat) >= 0) {
            return edge;
        };
    }
    return null;
}

function findStraightEdgeVertices(edge:SVGPolylineElement):HTMLElement[] {
    const indexList = edge.getAttributeNS('', 'data-vertices')
    const vertices:HTMLElement[] = [];
    const indeces = indexList?.split(',');
    if (indeces) {
        const map = mapGlobalIndeces('vertex', 'vx');
        for (var i = 0; i < indeces.length; i++) {
            if (indeces[i]) {
                const vertex = map[indeces[i]];
                vertices.push(vertex);
            }
        }        
    }
    return vertices;
}