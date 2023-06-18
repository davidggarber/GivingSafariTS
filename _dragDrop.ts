export type Position = {
  x: number;
  y: number;
}

/**
 * Convert an element's left/top style to a position
 * @param elmt Any element with a style
 * @returns A position
 */
export function positionFromStyle(elmt:HTMLElement): Position {
  return { x: parseInt(elmt.style.left), y: parseInt(elmt.style.top) };
}

export function quickMove(moveable:HTMLElement, destination:HTMLElement) {

}

export function quickFreeMove(moveable:HTMLElement, position:Position) {
}