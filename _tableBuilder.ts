
/***********************************************************
 * TABLEBUILDER.TS
 * Utilities for building pages with 2D tables
 *  - Constructs cells on the fly
 *  - Can use actual tables, or SVG
 * Should be called before other initializers, 
 * so the generated contents can trigger other behaviors.
 */

import { applyAllClasses } from "./_classUtil";


export type TableDetails = {
  rootId: string;
  height?: number;  // number of rows, indexed [0..height)
  width?: number;   // number of columns, indexed [0..width)
  data?: string[];  // array of strings, where each string is one row and each character is one cell
                        // if set, height and width can be omitted, and derived from this array
  onRow?: (y: number) => HTMLElement|null;
  onCell: (val: string, x: number, y: number) => HTMLElement|null;
}

/**
 * Create a generic TR tag for each row in a table.
 * Available for TableDetails.onRow where that is all that's needed
 */
export function newTR(y:number) {
  return document.createElement('tr');
}

/**
 * Create a table from details
 * @param details A TableDetails, which can exist in several permutations with optional fields
 */
export function constructTable(details: TableDetails) {
  const root = document.getElementById(details.rootId);
  const height = (details.data) ? details.data.length : (details.height as number);
  for (let y = 0; y < height; y++) {
    let row = root;
    if (details.onRow) {
      const rr = details.onRow(y);
      if (rr) {
        root?.appendChild(rr);
        row = rr;
      }
    }

    const width = (details.data) ? details.data[y].length : (details.width as number);
    for (let x = 0; x < width; x++) {
      const val:string = (details.data) ? details.data[y][x] : '';
      const cc = details.onCell(val, x, y);
      if (cc) {
        row?.appendChild(cc);
      }
    }
  }
}

export function constructSvgTextCell(val:string, dx:number, dy:number, cls:string) {
  if (val == ' ') {
    return null;
  }
  var vg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  vg.classList.add('vertex-g');
  if (cls) {
    applyAllClasses(vg, cls);
  }
  vg.setAttributeNS('', 'transform', 'translate(' + dx + ', ' + dy + ')');
  var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  r.classList.add('vertex');
  var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t. appendChild(document.createTextNode(val));
  vg.appendChild(r);
  vg.appendChild(t);
  return vg;
}

export function constructSvgImageCell(img:string, dx:number, dy:number, cls:string) {
  var vg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  vg.classList.add('vertex-g');
  if (cls) {
    applyAllClasses(vg, cls);
  }
  vg.setAttributeNS('', 'transform', 'translate(' + dx + ', ' + dy + ')');
  var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  r.classList.add('vertex');
  var i = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  i.setAttributeNS('', 'href', img);
  vg.appendChild(r);
  vg.appendChild(i);
  return vg;
}
