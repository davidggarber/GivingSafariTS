import { anyFromContext, theBoilerContext } from "./_builder";
import { findParentOfClass, getOptionalStyle, hasClass, toggleClass } from "./_classUtil";

/**
 * Validate the paint-by-numbers grid that contains this cell
 * @param target 
 */
function validatePBN(target:HTMLElement) {
  const table = findParentOfClass(target, 'paint-by-numbers');
  if (!table) {
    return;
  }
  let pos = target.id.split('_');
  const row = parseInt(pos[0]);
  const col = parseInt(pos[1]);
  const rSum = document.getElementById('rowSummary-' + row);
  const cSum = document.getElementById('colSummary-' + col);

  if (!rSum && !cSum) {
    return;  // this PBN does not have a UI for validation
  }

  // Scan all cells in this PBN table, looking for those in the current row & column
  // Track the painted ones as a list of row/column indices
  const cells = table.getElementsByClassName('stampable');
  const rowOn:number[] = [];
  const colOn:number[] = [];
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (hasClass(cell, 'stampPaint')) {
      pos = cell.id.split('_');
      const r = parseInt(pos[0]);
      const c = parseInt(pos[1]);
      if (r == row) {
        rowOn.push(c);
      }
      if (c == col) {
        colOn.push(r);
      }
    }
  }

  const rows = contextDataFromRef(table, 'data-row-context');
  if (rSum && rows) {
    // Convert a list of column indices to group notation
    const groups = summarizePBN(rowOn);
    rSum.innerHTML = '';
    for (const g of groups) {
      if (g > 0) {
        const span = document.createElement('span');
        toggleClass(span, 'pbn-row-group', true);
        span.innerText = g.toString();
        rSum.appendChild(span);
      }
    }
    const header = rows[row];
    const comp = compareGroupsPBN(header, groups);
    toggleClass(rSum, 'done', comp == 0);
    toggleClass(rSum, 'exceeded', comp > 0);
    const rHead = document.getElementById('rowHeader-' + row);
    toggleClass(rHead, 'done', comp == 0);
  }

  const cols = contextDataFromRef(table, 'data-col-context');
  if (cSum) {
    const groups = summarizePBN(colOn);
    cSum.innerHTML = '';
    for (const g of groups) {
      if (g > 0) {
        const span = document.createElement('span');
        toggleClass(span, 'pbn-col-group', true);
        span.innerText = g.toString();
        cSum.appendChild(span);
      }
    }
    const header = cols[col];
    const comp = compareGroupsPBN(header, groups);
    toggleClass(cSum, 'done', comp == 0);
    toggleClass(cSum, 'exceeded', comp > 0);
    const cHead = document.getElementById('colHeader-' + col);
    toggleClass(cHead, 'done', comp == 0);
  }

}

/**
 * Look up a value, according to the context path cached in an attribute
 * @param elmt Any element
 * @param attr An attribute name, which should exist in elmt or any parent
 * @returns Any JSON object
 */
function contextDataFromRef(elmt:Element, attr:string):any {
  const context = theBoilerContext();
  const path = getOptionalStyle(elmt, attr);
  if (path && context) {
    return anyFromContext(path, context);
  }
  return undefined;
}

/**
 * Read the user's actual painting within the PBN grid as a list of group sizes.
 * @param list A list of numbers, indicating row or column indices
 * @returns A list of groups separated by gaps. Positive numbers are consecutive painted. Negative are consecutive un-painted.
 * The leading- and trailing- empty cells are ignored. But if the whole series is empty, return [0]
 */
function summarizePBN(list) {
  let prev = NaN;
  let consec = 0;
  const summary:number[] = [];
  list.push(NaN);
  for (const next of list) {
    if (next == prev + 1) {
      consec++;
    }
    else {
      if (consec > 0) {
        summary.push(consec);
        const gap = next - prev - 1;
        if (!isNaN(gap) && gap > 0) {
          summary.push(-gap);
        }
      }
      consec = (!isNaN(next)) ? 1 : 0;
    }
    prev = next;
  }
  if (summary.length == 0) {
    return [0];
  }
  return summary;
}

/**
 * Compare the actual panted cells vs. the clues.
 * The actual cells could indicate either more than was clued, or less than was clued, or exactly what was clued.
 * @param expect A list of expected groups (positives only)
 * @param have A list of actual groups (positives indicate groups, negatives indicates gaps between groups)
 * @returns 0 if exact, 1 if actual exceeds expected, or -1 if actual is not yet expected, but hasn't contradicted it yet
 */
function compareGroupsPBN(expect:number[], have:number[]) {
  let exact = true;
  let e = 0;
  let gap = 0;
  let prevH = 0;
  let curE = expect.length > 0 ? expect[0] : 0;
  for (const h of have) {
    if (h <= 0) {
      gap = -h;
      continue;
    }
    prevH = prevH > 0 ? (prevH + gap + h) : h;
    if (prevH <= curE) {
      exact = exact && h == curE;
      gap = 0;
      if (prevH == curE) {
        prevH = 0;
        e++;
        curE = e < expect.length ? expect[e] : 0;
      }
    }
    else {
      exact = false;
      prevH = 0;
      gap = 0;
      e++;
      while (e < expect.length && h > expect[e]) {
        e++;
      }
      curE = e < expect.length ? expect[e] : 0;
      if (h < curE) {
        prevH = h;
      }
      else if (h == curE) {
        e++;
        curE = e < expect.length ? expect[e] : 0;
      }
      else {
        return 1;  // too big
      }
    }
  }
  // return 0 for exact match
  // return -1 for incomplete match - groups thus far do not exceed expected
  return (exact && e == expect.length) ? 0 : -1;
}
