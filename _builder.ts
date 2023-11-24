
// TODO: track progress as a stack, so we don't search from the top every time

import { theBoiler } from "./_boilerplate";
import { isTag } from "./_classUtil";

/**
 * Look for control tags like for loops and if branches.
 */
export function expandControlTags() {
  const context = theBoiler().builderLookup || {};
  let fors = document.getElementsByTagName('for');
  while (fors.length > 0) {
    const src = fors[0] as HTMLElement;
    const dest = startForLoop(src, context);
    const parent = src.parentNode;
    for (let d = 0; d < dest.length; d++) {
      const node = dest[d];
      parent?.insertBefore(node, src);
    }
    parent?.removeChild(src);

    // See if there are more
    fors = document.getElementsByTagName('for');
  }
}

/**
 * Concatenate one list onto another
 * @param list The list to modified
 * @param add The list to add to the end
 */
function pushRange(list:Node[], add:Node[]) {
  for (let i = 0; i < add.length; i++) {
    list.push(add[i]);
  }
}

/**
 * Append more than one child node to the end of a parent's child list
 * @param parent The parent node
 * @param add A list of new children
 */
function appendRange(parent:Node, add:Node[]) {
  for (let i = 0; i < add.length; i++) {
    parent.insertBefore(add[i], null);
  }
}

/**
 * Potentially several kinds of for loops:
 * for each: <for each="var" in="list">  // ideas for optional args: first, last, skip
 * for char: <for char="var" in="text">  // every character in a string
 * for char: <for word="var" in="text">  // space-delimited substrings
 * for range: <for range="var" from="first" to="last" or until="after"> 
 * for key: <for key="var" in="object">  // idea for optional arg: sort
 * @param src the <for> element
 * @param context the set of values that might get used by the for loop
 * @returns a list of nodes, which will replace this <for> element
 */
function startForLoop(src:HTMLElement, context:object):Node[] {
  const dest:Node[] = [];

  let iter:string|null = null;
  let list:any[] = [];

  // <for each="variable_name" in="list">
  iter = src.getAttributeNS('', 'each');
  if (iter) {
    list = parseForEach(src, context);
  }
  else {
    iter = src.getAttributeNS('', 'char');
    if (iter) {
      list = parseForText(src, context, '');
    }
    else {
      iter = src.getAttributeNS('', 'word');
      if (iter) {
        list = parseForText(src, context, ' ');
      }
      else {
        iter = src.getAttributeNS('', 'key');
        if (iter) {
          list = parseForKey(src, context);
        }
        else {
          iter = src.getAttributeNS('', 'range');
          if (iter) {
            list = parseForRange(src, context);
          }
          else {
            throw new Error('Unrecognized <for> tag type: ' + src);
          }
        }
      }
    }
  }

  const iter_index = iter + '#';
  for (let i = 0; i < list.length; i++) {
    context[iter_index] = i;
    context[iter] = list[i];
    pushRange(dest, expandContents(src, context));
  }
  context[iter_index] = undefined;
  context[iter] = undefined;
  
  return dest;
}

/**
 * Syntax: <for each="var" in="list">
 * @param src 
 * @param context 
 * @returns a list of elements
 */
function parseForEach(src:HTMLElement, context:object) {
  const list_name = src.getAttributeNS('', 'in');
  if (!list_name) {
    throw new Error('for each requires "in" attribute');
  }
  const list = (list_name in context) ? context[list_name] : null;
  if (!list) {
    throw new Error('unresolved list context: ' + list_name);
  }
  return list;
}

function parseForText(src:HTMLElement, context:object, delim:string) {
  const list_name = src.getAttributeNS('', 'in');
  if (!list_name) {
    throw new Error('for char requires "in" attribute');
  }
  // The list_name can just be a literal string
  const list = (list_name in context) ? context[list_name] : list_name;
  if (!list) {
    throw new Error('unresolved context: ' + list_name);
  }
  return list.split(delim);
}

function parseForRange(src:HTMLElement, context:object):any {
  const from = src.getAttributeNS('', 'in');
  let until = src.getAttributeNS('', 'until');
  const last = src.getAttributeNS('', 'to');
  const step = src.getAttributeNS('', 'step');

  const start = from ? parseInt(from) : 0;
  let end = until ? parseInt(until)
    : last ? (parseInt(last) + 1)
    : start;
  const inc = step ? parseInt(step) : 1;
  if (!until && inc < 0) {
    end -= 2;  // from 5 to 1 step -1 means i >= 0
  }

  const list:number[] = [];
  for (let i = start; inc > 0 ? (i < end) : (i > end); i += inc) {
    list.push(i);
  }
  return list;
}

function parseForKey(src:HTMLElement, context:object):any {
  const obj_name = src.getAttributeNS('', 'in');
  if (!obj_name) {
    throw new Error('for each requires "in" attribute');
  }
  const obj = (obj_name in context) ? context[obj_name] : null;
  if (!obj) {
    throw new Error('unresolved list context: ' + obj_name);
  }
  return Object.keys(obj);
}

/**
 * Clone every node inside a parent element.
 * Any occurence of {curly} braces is in fact a lookup.
 * It can be in body text or an element attribute value
 * @param src The containing element
 * @param context A dictionary of all values that can be looked up
 * @returns A list of nodes
 */
function expandContents(src:HTMLElement, context:object):Node[] {
  const dest:Node[] = [];
  for (let i = 0; i < src.childNodes.length; i++) {
    const child = src.childNodes[i];
    console.log(child);
    if (child.nodeType == Node.ELEMENT_NODE) {
      const elmt = child as HTMLElement;
      if (isTag(elmt, 'for')) {
        pushRange(dest, startForLoop(elmt, context));
      }
      else {
        dest.push(cloneWithContext(elmt, context));
      }
    }
    else if (child.nodeType == Node.TEXT_NODE) {
        pushRange(dest, cloneTextNode(child as Text, context));
    }
    else {
        dest.push(cloneNode(child));
    }
  }

  return dest;
}

/**
 * Deep-clone an HTML element
 * @param elmt The original element
 * @param context A dictionary of all accessible values
 * @returns A cloned element
 */
function cloneWithContext(elmt:HTMLElement, context:object):HTMLElement {
  const clone = document.createElement(elmt.tagName);
  cloneAttributes(elmt, clone, context);

  for (let i = 0; i < elmt.childNodes.length; i++) {
    const child = elmt.childNodes[i];
    if (child.nodeType == Node.ELEMENT_NODE) {
      const elmt = child as HTMLElement;
      if (isTag(elmt, 'for')) {
        appendRange(clone, startForLoop(elmt, context));
      }
      else {
        clone.appendChild(cloneWithContext(elmt, context));
      }
    }
    else if (child.nodeType == Node.TEXT_NODE) {
      appendRange(clone, cloneTextNode(child as Text, context));
    }
    else {
      clone.insertBefore(cloneNode(child), null);
    }
  }

  return clone;
}

/**
 * Finish cloning an HTML element
 * @param src The element being cloned
 * @param dest The new element, still in need of attributes
 * @param context A dictionary of all accessible values
 */
function cloneAttributes(src:HTMLElement, dest:HTMLElement, context:object) {
  for (let i = 0; i < src.attributes.length; i++) {
    const name = src.attributes[i].name;
    const value = src.attributes[i].value;
    console.log(name + '=' + value);
    if (name == 'id') {
      dest.id = cloneText(src.id, context);
    }
    else if (name == 'class') {
      const classes = src.classList;
      if (classes) {
        for (let i = 0; i < classes.length; i++) {
          dest.classList.add(cloneText(classes[i], context));
        }
      }    
    }
    // REVIEW: special case 'style'?
    else {
      dest.setAttribute(name, cloneText(value, context));
    }
  }
}

/**
 * Process a text node which may contain {curly} formatting.
 * @param text A text node
 * @param context A dictionary of all accessible values
 * @returns A list of text nodes
 */
function cloneTextNode(text:Text, context:object):Node[] {
  const dest:Node[] = [];
  let str = text.textContent;
  let i = str ? str.indexOf('{') : -1;
  while (str && i >= 0) {
    const j = str.indexOf('}', i);
    if (j < 0) {
      break;
    }
    if (i > 0) {
      dest.push(document.createTextNode(str.substring(0, i)));
    }
    const key = str.substring(i + 1, j);
    dest.push(document.createTextNode(textFromContext(key, context)));
    str = str.substring(j + 1);
    i = str.indexOf('{');
  }
  if (str) {
    dest.push(document.createTextNode(str));
  }
  return dest;
}

/**
 * Process text which may contain {curly} formatting.
 * @param text Any text
 * @param context A dictionary of all accessible values
 * @returns Expanded text
 */
function cloneText(str:string, context:object):string {
  let dest = '';
  let i = str ? str.indexOf('{') : -1;
  while (str && i >= 0) {
    const j = str.indexOf('}', i);
    if (j < 0) {
      break;
    }
    if (i > 0) {
      dest += str.substring(0, i);
    }
    const key = str.substring(i + 1, j);
    dest += textFromContext(key, context);
    str = str.substring(j + 1);
    i = str.indexOf('{');
  }
  if (str) {
    dest += str;
  }
  return dest;
}

/**
 * Enable lookups into the context by key name.
 * Keys can be paths, separated by dots (.)
 * Paths can have other paths as nested arguments, using [ ]
 * Note, the dot separator is still required.
 *   example: foo.[bar].fuz       equivalent to foo[{bar}].fuz
 *   example: foo.[bar.baz].fuz   equivalent to foo[{bar.baz}].fuz
 * Even arrays use dot notation: foo.0 is the 0th item in foo
 * @param key A key, initially from {curly} notation
 * @param context A dictionary of all accessible values
 * @returns Resolved text
 */
function textFromContext(key:string, context:object):string {
  const path = key.split('.');
  const nested = [context];
  for (let i = 0; i < path.length; i++) {
    let step = path[i];
    if (!step) {
      continue;  // Ignore blank steps for now
    }
    if (step[0] == '[') {
      step = step.substring(1);
      nested.push(context);
    }
    let unnest = step[step.length - 1] == ']';
    if (unnest) {
      if (nested.length <= 1) {
        throw new Error('Malformed path has unmatched ] : ' + key);
      }
      step = step.substring(0, step.length - 1);
    }

    if (!(step in nested[nested.length - 1])) {
      throw new Error('Unrecognized key: ' + step);
    }
    nested[nested.length - 1] = getKeyedChild(nested[nested.length - 1], step);
    if (unnest) {
      const pop:string = '' + nested.pop();
      nested[nested.length - 1] = getKeyedChild(nested[nested.length - 1], pop);
    }
  }
  if (nested.length > 1) {
    throw new Error('Malformed path has unmatched [ : ' + key);
  }
  return '' + nested.pop();
}

/**
 * Get a keyed child of a parent, where the key is either a dictionary key 
 * or a list index or a string offset.
 * @param parent The parent object: a list, object, or string
 * @param key The identifier of the child: a dictionary key, a list index, or a string offset
 * @returns A child object, or a substring
 */
function getKeyedChild(parent:any, key:string) {
  if (typeof(parent) == 'string') {
    const i = parseInt(key);
    return (parent as string)[i];
  }
  if (!(key in parent)) {
    throw new Error('Unrecognized key: ' + key);
  }
  return parent[key];
}

/**
 * Clone other node types, besides HTML elements and Text
 * @param node Original node
 * @returns A node to use in the clone
 */
function cloneNode(node:Node):Node {
  return node;  // STUB: keep original node
}