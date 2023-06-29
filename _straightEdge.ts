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
export function preprocessRulerFunctions(mode:string, fill:boolean) {
    selector_class = mode;
    area_class = mode + '-area';
    selector_fill_class = fill ? (selector_class + '-fill') : null;
    let elems = document.getElementsByClassName(area_class);
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
}

/**
 * Which class are we looking for: straight-edge or word-select
 */
let selector_class:string;
/**
 * A second class, which can overlay the first as a fill
 */
let selector_fill_class:string|null;
/**
 * What is the class of the container: straight-edge-are or word-select-area
 */
let area_class:string;

/**
 * A VertexData contains all the information about a defined vertex in the puzzle
 * @property vertex The element tagged as a vertex
 * @property group (optional) The contained of the vertex, which should react to hovers
 * @property index The global-index of the vertex (assigned during initialization)
 * @property centerPos The center of the vertex, in screen coordinates
 * @property centerPoint The center of the vertex, in svg coordinates
 */
type VertexData = {
    vertex: HTMLElement;
    index: number;
    centerPos: DOMPoint;
    centerPoint: SVGPoint;
    group: HTMLElement;
}

/**
 * A RulerEventData is the collection of all ruler settings that might be useful following a mouse event
 * @property svg the root svg object
 * @property container the container for any straight edges we create
 * @property bounds the bounds of the svg, in client coordinates
 * @property maxPoints an official maximum for how many vertices may be in a single straight-edge
 * @property canShareVertices can two straight-edges share the same vertex?
 * @property hoverRange the maximum distance from a vertex before hover/snap is triggered
 * @property angleConstraints optional limit for connectable vertices to multiples of a base angle (in degrees) - usually 90 or 45, if set at all
 * @property showOpenDrag determines whether a straight-edge, mid-drag, can exist in open space (un-snapped)
 * @property evtPos the position of the mouse event, in client coordinates
 * @property evtPoint the position of the mouse event, in svg coordinates
 * @property nearest the nearest vertex, if any is within the hoverRange of the event
 */
type RulerEventData = {
    svg: SVGSVGElement;
    container: Element;
    bounds: DOMRect;
    maxPoints: number;
    canShareVertices: boolean;
    hoverRange: number;
    angleConstraints?: number;
    showOpenDrag: boolean;
    evtPos: DOMPoint;
    evtPoint: SVGPoint;
    nearest?: VertexData;
}

/**
 * Looks up the containing area, and any optional settings
 * @param evt A mouse event within the area
 * @returns A RulerEventData
 */
function getRulerData(evt:MouseEvent):RulerEventData {
    const range = findParentOfClass(evt.target as Element, area_class) as HTMLElement;
    const svg = findParentOfTag(range, 'SVG') as SVGSVGElement;
    const containers = svg.getElementsByClassName(selector_class + '-container');
    const bounds = svg.getBoundingClientRect();
    const maxPoints = range.getAttributeNS('', 'data-max-points');
    const canShareVertices = range.getAttributeNS('', 'data-can-share-vertices');
    const hoverRange = range.getAttributeNS('', 'data-hover-range');
    const angleConstraints = range.getAttributeNS('', 'data-angle-constraints');
    const showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    const pos = new DOMPoint(evt.x, evt.y);
    let spt = svg.createSVGPoint();
        spt.x = pos.x - bounds.left;
        spt.y = pos.y - bounds.top;
    const data:RulerEventData = {
        svg: svg, 
        container: (containers && containers.length > 0) ? containers[0] : svg,
        bounds: bounds,
        maxPoints: maxPoints ? parseInt(maxPoints) : 2, 
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        hoverRange: hoverRange ? parseInt(hoverRange) : (bounds.width + bounds.height),
        angleConstraints: angleConstraints ? parseInt(angleConstraints) : undefined,
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

/**
 * Constructs a vertex data from a vertex
 * @param ruler the containing RulerEventData
 * @param vert a vertex
 * @returns a VertexData
 */
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

/**
 * Handler for both mouse moves and mouse drag
 * @param evt The mouse move event
 */
function onRulerHover(evt:MouseEvent) {
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
            if (_straightEdgeBuilder.points.length >= ruler.maxPoints) {
                if (_straightEdgeVertices.length == _straightEdgeBuilder.points.length) {
                    toggleClass(_straightEdgeVertices[ruler.maxPoints - 1], 'building', false);
                    _straightEdgeVertices.splice(ruler.maxPoints - 1, 1);
                }
                _straightEdgeBuilder.points.removeItem(ruler.maxPoints - 1);
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
            toggleClass(ruler.nearest?.group as HTMLElement, 'hover', true);
            _hoverEndpoint = ruler.nearest?.group || null;
        }
    }
}
/**
 * Starts a drag from the nearest vertex to the mouse
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

/**
 * Ends a straight-edge creation on mouse up
 * @param evt Mouse up event
 */
function onLineUp(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler || !_straightEdgeBuilder) {
        return;
    }

    // Clean up classes that track active construction
    const indeces:number[] = [];
    for (let i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(_straightEdgeVertices[i], 'building', false);
        toggleClass(_straightEdgeVertices[i], 'has-line', _straightEdgeBuilder != null);
        indeces.push(getGlobalIndex(_straightEdgeVertices[i], 'vx'));
    }

    if (_straightEdgeVertices.length < 2) {
        // Incomplete without at least two snapped ends. Abandon
        ruler.container.removeChild(_straightEdgeBuilder);
        _straightEdgeBuilder = null;
    }
    else if (_straightEdgeBuilder.points.length > _straightEdgeVertices.length) {
        // Remove open-end
        _straightEdgeBuilder.points.removeItem(ruler.maxPoints - 1);
        toggleClass(_straightEdgeBuilder, 'open-ended', false);
    }

    if (_straightEdgeBuilder) {
        toggleClass(_straightEdgeBuilder, 'building', false);
        _straightEdgeBuilder?.setAttributeNS('', 'data-vertices', ','+indeces.join(',')+',');
        _straightEdges.push(_straightEdgeBuilder);

        if (selector_fill_class) {
            const fill = document.createElementNS('http://www.w3.org/2000/svg', 'polyline') as SVGPolylineElement;
            toggleClass(fill, selector_fill_class, true);
            for (let i = 0; i < _straightEdgeBuilder.points.length; i++) {
                fill.points.appendItem(_straightEdgeBuilder.points[i]);
            }
            ruler.container.appendChild(fill);  // will always be after the original
        }
    }

    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}

/**
 * Create a new straight-edge, starting at one vertex
 * @param ruler The containing area and rules
 * @param start The first vertex (can equal ruler.nearest, which is otherwise ignored)
 */
function createStraightLineFrom(ruler:RulerEventData, start:VertexData) {
    _straightEdgeVertices = [];
    _straightEdgeVertices.push(start.vertex);

    _straightEdgeBuilder = document.createElementNS('http://www.w3.org/2000/svg', 'polyline') as SVGPolylineElement;
    toggleClass(_straightEdgeBuilder, selector_class, true);
    toggleClass(_straightEdgeBuilder, 'building', true);
    toggleClass(start.vertex, 'building', true);
    _straightEdgeBuilder.points.appendItem(start.centerPoint);
    ruler.container.appendChild(_straightEdgeBuilder);

    toggleClass(_hoverEndpoint, 'hover', false);
    _hoverEndpoint = null;
}

/**
 * Extend a straight-edge being built to a new vertex
 * @param ruler The containing area and rules
 * @param next A new vertex
 */
function snapStraightLineTo(ruler:RulerEventData, next:VertexData) {
    _straightEdgeVertices.push(next.vertex);
    _straightEdgeBuilder?.points.appendItem(next.centerPoint);
    toggleClass(_straightEdgeBuilder, 'open-ended', false);
    toggleClass(next.vertex, 'building', true);
}

/**
 * Extend a straight-edge into open space
 * @param ruler The containing area and rules, including the latest event coordinates
 */
function openStraightLineTo(ruler:RulerEventData) {
    toggleClass(_straightEdgeBuilder, 'open-ended', true);
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

/**
 * Enforces vertex angle constraints
 * @param data The containing area and rules
 * @param vert A new vertex
 * @returns 
 */
function isReachable(data:RulerEventData, vert: VertexData):boolean {
    if (_straightEdgeVertices.length < 1) {
        return false;
    }
    
    //if (indexInLine(vert.vertex) >= 0) return false;

    const prev = getVertexData(data, _straightEdgeVertices[_straightEdgeVertices.length - 1]);
    const dx = vert.centerPos.x - prev.centerPos.x;
    const dy = vert.centerPos.y - prev.centerPos.y;
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        return false;  // Can't re-select the previous point
    }
    else if (data.angleConstraints == undefined) {
        return true;  // Any other point is valid
    }
    const degrees = Math.atan2(dy, dx) * 180 / Math.PI;
    const mult = degrees / data.angleConstraints;
    const err = Math.abs(mult - Math.round(mult));
    return err <= 0.1;  // Within 10% of constraint angle pattern
}

/**
 * Delete an existing straight-edge
 * @param edge The edge to remove
 */
function deleteStraightEdge(edge:SVGPolylineElement) {
    for (let i = 0; i < _straightEdges.length; i++) {
        if (_straightEdges[i] === edge) {
            _straightEdges.splice(i, 1);
            break;
        }
    }

    // See if there's a duplicate straight-edge, of class word-select2
    if (selector_fill_class) {
        const second = document.getElementsByClassName(selector_fill_class);
        for (let i = 0; i < 0; i < second.length) {
            const sec = second[i] as SVGPolylineElement;
            if (sec.points == edge.points) {
                edge.parentNode?.removeChild(sec);
                break;
            }
        }
    }

    edge.parentNode?.removeChild(edge);
}

/**
 * Find the vertex nearest to the mouse event, and within any snap limit
 * @param data The containing area and rules, including mouse event details
 * @returns A vertex data, or null if none close enough
 */
function findNearestVertex(data:RulerEventData):Element|null {
    let min = data.hoverRange * data.hoverRange;
    const vertices = data.svg.getElementsByClassName('vertex');
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

/**
 * Find the first straight-edge which includes the specified vertex
 * @param index The global index of a vertex
 * @returns A straight edge, or null if none match
 */
function findStraightEdgeFromVertex(index:number):SVGPolylineElement|null {
    const pat = ',' + String(index) + ',';
    const edges = document.getElementsByClassName(selector_class);
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i] as SVGPolylineElement;
        const indexList = edge.getAttributeNS('', 'data-vertices')
        if (indexList && indexList.search(pat) >= 0) {
            return edge;
        };
    }
    return null;
}

/**
 * Given a straight edge, enumerate the vertices that it passes through
 * @param edge A straight-edge
 * @returns An array of zero or more vertices
 */
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