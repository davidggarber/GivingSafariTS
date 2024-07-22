import { expandContents, pushRange } from "./_builder";
import { anyFromContext, cloneText, getBuilderContext, popBuilderContext, pushBuilderContext, textFromContext } from "./_builderContext";
import { BuildError, BuildEvalError, BuildTagError } from "./_builderError";

/**
 * Potentially several kinds of for loops:
 * for each: <for each="var" in="list">  // ideas for optional args: first, last, skip
 * for char: <for char="var" in="text">  // every character in a string
 * for word: <for word="var" in="text">  // space-delimited substrings
 * for range: <for range="var" from="first" to="last" or until="after"> 
 * for key: <for key="var" in="object">  // idea for optional arg: sort
 * @param src the <for> element
 * @param context the set of values that might get used by the for loop
 * @returns a list of nodes, which will replace this <for> element
 */
export function startForLoop(src:HTMLElement):Node[] {
  const dest:Node[] = [];

  let iter:string|null = null;
  let list:any[] = [];
  let vals:any[] = [];  // not always used

  // <for each="variable_name" in="list">
  iter = src.getAttributeNS('', 'each');
  if (iter) {
    list = parseForEach(src);
  }
  else {
    iter = src.getAttributeNS('', 'char');
    if (iter) {
      list = parseForText(src, '');
    }
    else {
      iter = src.getAttributeNS('', 'word');
      if (iter) {
        list = parseForText(src, ' ');
      }
      else {
        iter = src.getAttributeNS('', 'key');
        if (iter) {
          list = parseForKey(src);
          vals = list[1];
          list = list[0];
        }
        else {
          // range and int are synonyms
          iter = src.getAttributeNS('', 'range') || src.getAttributeNS('', 'int');
          if (iter) {
            list = parseForRange(src);
          }
          else {
            throw new BuildTagError('Unrecognized <for> tag type', src);
          }
        }
      }
    }
  }

  if (!list) {
    throw new BuildTagError('Unable to determine loop: ', src);
  }

  const inner_context = pushBuilderContext();
  const iter_index = iter + '#';
  for (let i = 0; i < list.length; i++) {
    inner_context[iter_index] = i;
    inner_context[iter] = list[i];
    if (vals.length > 0) {
      inner_context[iter + '!'] = vals[i];
    }
    pushRange(dest, expandContents(src));
  }
  popBuilderContext();
  
  return dest;
}

/**
 * Syntax: <for each="var" in="list">
 * @param src 
 * @param context 
 * @returns a list of elements
 */
function parseForEach(src:HTMLElement):any[] {
  const list_name = src.getAttributeNS('', 'in');
  if (!list_name) {
    throw new BuildTagError('for each requires "in" attribute', src);
  }
  return anyFromContext(list_name);
}

function parseForText(src:HTMLElement, delim:string) {
  const list_name = src.getAttributeNS('', 'in');
  if (!list_name) {
    throw new BuildError('for char requires "in" attribute');
  }
  // The list_name can just be a literal string
  const list = textFromContext(list_name);
  if (!list) {
    throw new BuildError('unresolved context: ' + list_name);
  }
  return list.split(delim);
}

function parseForRange(src:HTMLElement):any {
  const from = src.getAttributeNS('', 'from');
  let until = src.getAttributeNS('', 'until');
  const last = src.getAttributeNS('', 'to');
  const length = src.getAttributeNS('', 'len');
  const step = src.getAttributeNS('', 'step');

  const start = from ? parseInt(cloneText(from)) : 0;
  let end = until ? parseInt(cloneText(until))
    : last ? (parseInt(cloneText(last)) + 1)
    : length ? (anyFromContext(length).length)
    : start;
  const inc = step ? parseInt(cloneText(step)) : 1;
  if (inc == 0) {
    throw new BuildTagError("Invalid loop step. Must be non-zero.", src);
  }
  if (!until && inc < 0) {
    end -= 2;  // from 5 to 1 step -1 means i >= 0
  }

  const list:number[] = [];
  for (let i = start; inc > 0 ? (i < end) : (i > end); i += inc) {
    list.push(i);
  }
  return list;
}

function parseForKey(src:HTMLElement):any {
  const obj_name = src.getAttributeNS('', 'in');
  if (!obj_name) {
    throw new BuildTagError('for each requires "in" attribute', src);
  }
  const obj = anyFromContext(obj_name)
  if (!obj) {
    throw new BuildEvalError('unresolved list context', obj_name);
  }
  const keys = Object.keys(obj);
  const vals = keys.map(k => obj[k]);
  return [keys, vals];
}

