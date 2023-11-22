
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
 * Potentially several kinds of for loops:
 * for each: <for each="var" in="list">  // ideas for optional args: first, last, skip
 * for char: <for char="var" in="text">
 * for key: <for key="var" in="object">  // idea for optional arg: sort
 * @param src the <for> element
 * @param context the set of values that might get used by the for loop
 * @returns a list of nodes, which will replace this <for> element
 */
function startForLoop(src:HTMLElement, context:object):Node[] {
  const dest:Node[] = [];

  // <for each="variable_name" in="list">
  const each = src.getAttributeNS('', 'each');
  // const char = src.getAttributeNS('', 'char');
  if (each) {
    const list_name = src.getAttributeNS('', 'in');
    if (!list_name) {
      throw new Error('for each requires "in" attribute');
    }
    const list = list_name ? context[list_name] : null;
    if (!list) {
      throw new Error('unresolved context: ' + list_name);
    }
    const each_index = each + '#';
    for (let i = 0; i < list.length; i++) {
      context[each_index] = i;
      context[each] = list[i];
      pushRange(dest, expandContents(src, context));
    }
    context[each_index] = undefined;
    context[each] = undefined;
  }
  
  return dest;
}

function pushRange(list:Node[], add:Node[]) {
  for (let i = 0; i < add.length; i++) {
    list.push(add[i]);
  }
}

function appendRange(node:Node, add:Node[]) {
  for (let i = 0; i < add.length; i++) {
    node.insertBefore(add[i], null);
  }
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
 * Even arrays use dot notation: foo.0 is the 0th item in foo
 * @param key A key, initially from {curly} notation
 * @param context A dictionary of all accessible values
 * @returns Resolved text
 */
function textFromContext(key:string, context:object):string {
  const path = key.split('.');
  let c = context;
  for (let i = 0; i < path.length; i++) {
    c = c[path[i]];
  }
  return c.toString();
}

/**
 * Clone other node types, besides HTML elements and Text
 * @param node Original node
 * @returns A node to use in the clone
 */
function cloneNode(node:Node):Node {
  return node;  // STUB: keep original node
}