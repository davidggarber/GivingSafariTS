import { theBoiler } from "./_boilerplate";
import { cloneAttributes, cloneTextNode } from "./_builderContext";
import { startForLoop } from "./_builderFor";
import { startIfBlock } from "./_builderIf";
import { inputAreaTagNames, startInputArea } from "./_builderInput";
import { useTemplate } from "./_builderUse";
import { findParentOfTag, isTag, toggleClass } from "./_classUtil";
import { svg_xmlns } from "./_tableBuilder";

/****************************************************************************
 *          BUILDER
 * 
 * Buider HTML is loosely inspired by React.
 * It defines the data first.
 * Then the HTML supports special tags for loops and conditionals,
 * and the text and attributes support lookups into the data.
 * 
 * Data initialization:
 *    In the script block of the page, add two values to the boilerplate:
 *        const boiler = {
 *          ...
 *          'reactiveBuilder': true,  // required
 *          'builderLookup': {        // free-form, for example...
 *            magic: 123,
 *            line: { start: {x:1, y:2}, end: {x:3, y:4} },
 *            fonts: [ 'bold', 'italic' ],
 *            grid: [
 *              [1, 2, 3],
 *              [4, 5, 6]
 *            ]
 *          }
 *        };
 *
 * Data lookup:
 *    In text or attribute values, use curly-brace syntax to inject named values:
 *    Examples in text:
 *      {magic}             =>  123
 *      {line.end.x}        =>  3
 *      {grid.0.1}          =>  2   // note that .0 and .1 are indeces
 *     
 *    Examples in attributes:
 *      <div id="{magic}" class="{fonts.0} {fonts.1}">
 *                          =>  <div id="123" class="bold italic">
 * 
*    There is a special rule for tags and attributes prefixed with _
 *    when you need to avoid the pre-processed tags/attributes being acted upon by the DOM.
 *      <_img _src="{fonts.0}Icon.png">
 *                          =>  <img src="boldIcon.png">
 * 
 *   Parameterized lookups allow one lookup to be used to name the child of another.
 *   Any nested pair of [brackets] restarts the lookup context at the root.
 *      {grid.[line.start.x].[line.start.y]}
 *                          ==  {grid.1.2}      =>  5
 * 
 * <for> Loops:
 *    Use the new <for> tag to loop over a set of values, 
 *    cloning and re-evaluating the contents of the loop for each.
 * 
 *    The targets of loops are implicitly lookups, so the {curly} syntax is not needed.
 *    As they expand, new nested values are dynamically added to the lookup table, to reflect the loop state.
 *
 *    Loop over elements in a list:
 *      <for each="font" in="fonts">{font#}:{font} </for>
 *                          =>  0:bold 1:italic
 *        Note: in="fonts" could have been in="{fonts}"
 *        Inside the <for> tags, new temporary named values exist based on the name specified in each=""
 *          {font} for each value in the list,
 *          and {font#} for the index of that item (starting at 0)
 * 
 *    Loop over fields in an object:
 *      <for key="a" in="line.start">{a#}:{a}={a!} </for>
 *                          =>  0:x=1 1:y=2
 *        Inside the <for> tags, an additional temporary:
 *          {a} for each key in the object, {a#} for the index of that key,
 *          and {a!} for the value corresponding to that key.
 * 
 *    Loop over characters in text:
 *      <for char="ch" in="fonts.0">{ch} </for>
 *                          =>  b o l d
 *      <for char="ch" in="other">{ch} </for>
 *                          =>  o t h e r
 * 
 *        Note that the in="value" can be a literal.
 * 
 *    Loop over words in text:
 *      <for char="w" in="Hello World!">{w}-{w}</for>
 *                          =>  Hello-HelloWorld!-World!
 *
 *        Word is really anything delimited by spaces.
 * 
 *    Loop over a range of values:
 *      <for range="i" from="1" to="3">{i}</for>
 *                          =>  123
 *      <for range="i" from="1" until="3">{i}</for>
 *                          =>  12
 *      <for range="i" from="5" to="0" step="-2">{i}</for>
 *                          =>  531
 *
 *        from=""   specifies the start value
 *        to=""     specifies the last value (inclusive)
 *        until=""  specifies a stop value (exclusive)
 *        step=""   specifies a step value, if not 1
 * 
 *    Use ranges to in compound lookups:
 *      <for range="row" from="0" to="1">
 *        <for range="col" from="0" to="2">
 *          {grid.[row].[col]}
 *      </for>,</for>
 *                          =>  1 2 3 , 4 5 6
 * 
 *  <if> conditionals
 *    Use the new <if> tag to check a lookup against various states.
 *    The checked values are implicitly lookups, so the {curly} syntax is not needed.
 *    No new temporary values are generated by ifs.
 * 
 *    Note: there is no else syntax. Instead, concatenate multiple ifs.
 *      As such, be careful not to nest, unless intended.
 *
 *    <if test="magic" eq="123">Magic!</if>
 *    <if test="magic" ne="123">Lame.</if>
 *                          =>  Magic!
 *    <if test="magic" ge="100">Big!
 *    <if test="magic" ge="120">Bigger!</if>
 *    </if>
 *                          =>  Big!Bigger!
 * 
 *        Relative operators:
 *          eq=""       Equality (case-sensitive, in all cases)
 *          ne=""       Not-equals
 *          gt=""       Greater than
 *          lt=""       Less than
 *          ge=""       Greater than or equals
 *          le=""       Less than or equals
 *        Containment operators:
 *          in="super"  Test value is IN (a substring of) "super"
 *          ni="super"  Test value is NOT IN (not a substring of) "super"
 *        There is no NOT modifier. Instead, use the converse operator.
 *
 * 
 *  Loops and Tables:
 *    It is tempting to use loops inside <table> tags.
 *    However, the DOM will likely refactor them if found inside a <table> but not inside <td>.
 *    
 *    Two options: _prefix and CSS
 *      <_table>
 *        <for ...>
 *          <_tr>
 *            <if eq ...><_th></_th></if>
 *            <if ne ...><_td></_td></if>
 *          </_tr>
 *        </for>
 *      </_table>
 * 
 *      <div style="display:table">
 *        <for ...>
 *          <div style="display:table-row">
 *            <if eq ...><div style="display:table-header"></div></if>
 *            <if ne ...><div style="display:table-cell"></div></if>
 *          </div>
 *        </for>
 *      </div>
 */


const builder_tags = [
  'build', 'use', 'for', 'if', 'xml'
];
function identifyBuilders() {
  for (const t of builder_tags) {
    const tags = document.getElementsByTagName(t);
    for (let i=0; i < tags.length; i++) {
      toggleClass(tags[i], 'builder_control', true);
    }  
  }
}

let src_element_stack:Element[] = [];
let dest_element_stack:Element[] = [];

function initElementStack(elmt:Element|null) {
  dest_element_stack = [];
  src_element_stack = [];
  const parent_stack:Element[] = [];
  while (elmt !== null && elmt.nodeName != '#document-fragment' && elmt.tagName !== 'BODY') {
    parent_stack.push(elmt);
    elmt = elmt.parentElement;
  }
  // Invert stack
  while (parent_stack.length > 0) {
    src_element_stack.push(parent_stack.pop() as Element);
  }
}

function pushDestElement(elmt:Element) {
  dest_element_stack.push(elmt);
}

function popDestElement() {
  dest_element_stack.pop();
}

/**
 * See if any parent element in the builder stack matches a lambda
 * @param fn a Lambda which takes an element and returns true for the desired condition
 * @returns the first parent element that satisfies the lambda, or null if none do
 */
export function getBuilderParentIf(fn:(e:Element) => boolean):Element|null {
  for (let i = dest_element_stack.length - 1; i >= 0; i--) {
    if (fn(dest_element_stack[i])) {
      return dest_element_stack[i];
    }
  }

  for (let i = src_element_stack.length - 1; i >= 0; i--) {
    if (fn(src_element_stack[i])) {
      return src_element_stack[i];
    }
  }

  return null;  // no parent satisfied lambda
}

/**
 * See if any parent element, either in the builder stack, or src element tree, matches a lambda
 * @param fn a Lambda which takes an element and returns true for the desired condition
 * @returns the first parent element that satisfies the lambda, or null if none do
 */
export function getParentIf(elmt:Element|null, fn:(e:Element) => boolean):Element|null {
  const bp = getBuilderParentIf(fn);
  if (bp != null) {
    return bp;
  }

  while (elmt !== null && elmt.nodeName != '#document-fragment' && elmt.tagName !== 'BODY') {
    if (fn(elmt)) {
      return elmt;
    }
    elmt = elmt.parentElement;
  }

  return null;
}

/**
 * Is the current stack of building elements currently inside an SVG tag.
 * @returns returns true if inside an SVG, unless further inside an EMBEDDED_OBJECT.
 */
export function inSvgNamespace():boolean {
  const elmt = getBuilderParentIf((e)=>isTag(e, 'SVG') || isTag(e, 'FOREIGNOBJECT'));
  if (elmt) {
    return isTag(elmt, 'SVG');
  }
  return false;
}


/**
 * See if we are inside an existing <svg> tag. Or multiple!
 * @param elmt Any element
 * @returns How many <svg> tags are in its parent chain
 */
function getSvgDepth(elmt:Element) {
  let s = 0;
  let parent = findParentOfTag(elmt, 'SVG');
  while (parent) {
    s++;
    parent = parent.parentElement ? findParentOfTag(parent.parentElement, 'SVG') : null;
  }
  return s;
}

/**
 * Look for control tags like for loops and if branches.
 */
export function expandControlTags() {
  identifyBuilders();
  let controls = document.getElementsByClassName('builder_control');
  while (controls.length > 0) {
    const src = controls[0] as HTMLElement;
    initElementStack(src);
    let dest:Node[] = [];
    if (isTag(src, 'build') || isTag(src, 'xml')) {
      dest = expandContents(src);
    }
    else if (isTag(src, 'for')) {
      dest = startForLoop(src);
    }
    else if (isTag(src, 'if')) {
      dest = startIfBlock(src);
    }
    else if (isTag(src, 'use')) {
      dest = useTemplate(src);
    }
    const parent = src.parentNode;
    for (let d = 0; d < dest.length; d++) {
      const node = dest[d];
      parent?.insertBefore(node, src);
    }
    parent?.removeChild(src);

    // See if there are more
    controls = document.getElementsByClassName('builder_control');
  }
  initElementStack(null);

  // Call any post-builder method
  const fn = theBoiler().postBuild;
  if (fn) {
      fn();
  }
}

/**
 * Concatenate one list onto another
 * @param list The list to modified
 * @param add The list to add to the end
 */
export function pushRange(list:Node[], add:Node[]) {
  for (let i = 0; i < add.length; i++) {
    list.push(add[i]);
  }
}

/**
 * Append more than one child node to the end of a parent's child list
 * @param parent The parent node
 * @param add A list of new children
 */
export function appendRange(parent:Node, add:Node[]) {
  for (let i = 0; i < add.length; i++) {
    parent.insertBefore(add[i], null);
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
export function expandContents(src:HTMLElement):Node[] {
  const dest:Node[] = [];
  for (let i = 0; i < src.childNodes.length; i++) {
    const child = src.childNodes[i];
    if (child.nodeType == Node.ELEMENT_NODE) {
      const child_elmt = child as HTMLElement;
      if (isTag(child_elmt, 'for')) {
        pushRange(dest, startForLoop(child_elmt));
      }
      else if (isTag(child_elmt, 'if')) {
        pushRange(dest, startIfBlock(child_elmt));
      }
      else if (isTag(child_elmt, 'use')) {
        pushRange(dest, useTemplate(child_elmt));
      }
      else if (isTag(child_elmt, inputAreaTagNames)) {
        pushRange(dest, startInputArea(child_elmt));
      }
      else {
        dest.push(cloneWithContext(child_elmt));
      }
    }
    else if (child.nodeType == Node.TEXT_NODE) {
      pushRange(dest, cloneTextNode(child as Text));
    }
    else {
      dest.push(cloneNode(child));
    }
  }

  return dest;
}

/**
 * Some HTML elements and attributes are immediately acted upon by the DOM.
 * To delay that until after builds (especially <for> and <if>), 
 * use _prefx or suffix_, and the tag or attribute will be renamed when cloned.
 * @param name Any tag or attribute name
 * @returns The name, or the the name without the _
 */
export function normalizeName(name:string):string {
  if (name.substring(0, 1) == '_') {
    return name.substring(1);
  }
  if (name.substring(name.length - 1) == '_') {
    return name.substring(0, name.length - 1);
  }
  // Any other interior underscores are kept
  return name;
}

const nameSpaces = {
  '': '',
  'svg': svg_xmlns,
  's': svg_xmlns,
  'html': null,
  'h': null,
}

/**
 * Deep-clone an HTML element
 * Note that element and attribute names with _prefix will be renamed without _
 * @param elmt The original element
 * @param context A dictionary of all accessible values
 * @returns A cloned element
 */
function cloneWithContext(elmt:HTMLElement):Element {
  const tagName = normalizeName(elmt.localName);
  let clone:Element;
  if (inSvgNamespace() || tagName == 'svg') {
    // TODO: contents of embedded objects aren't SVG
    clone = document.createElementNS(svg_xmlns, tagName);
  }
  else {
    clone = document.createElement(tagName);
  }
  pushDestElement(clone);
  cloneAttributes(elmt, clone);

  for (let i = 0; i < elmt.childNodes.length; i++) {
    const child = elmt.childNodes[i];
    if (child.nodeType == Node.ELEMENT_NODE) {
      const child_elmt = child as HTMLElement;
      if (isTag(child_elmt, 'for')) {
        appendRange(clone, startForLoop(child_elmt));
      }
      else if (isTag(child_elmt, 'if')) {
        appendRange(clone, startIfBlock(child_elmt));
      }
      else if (isTag(child_elmt, 'use')) {
        appendRange(clone, useTemplate(child_elmt));
      }
      else if (isTag(child_elmt, inputAreaTagNames)) {
        appendRange(clone, startInputArea(child_elmt));
      }
      else {
        clone.appendChild(cloneWithContext(child_elmt));
      }
    }
    else if (child.nodeType == Node.TEXT_NODE) {
      appendRange(clone, cloneTextNode(child as Text));
    }
    else {
      clone.insertBefore(cloneNode(child), null);
    }
  }
  popDestElement();
  return clone;
}

/**
 * Clone other node types, besides HTML elements and Text
 * @param node Original node
 * @returns A node to use in the clone
 */
function cloneNode(node:Node):Node {
  return node;  // STUB: keep original node
}
