import { isDebug, isTrace, theBoiler } from "./_boilerplate";
import { cloneAttributes, cloneTextNode } from "./_builderContext";
import { startForLoop } from "./_builderFor";
import { ifResult, startIfBlock } from "./_builderIf";
import { inputAreaTagNames, startInputArea } from "./_builderInput";
import { useTemplate } from "./_builderUse";
import { findParentOfTag, hasClass, isTag, toggleClass } from "./_classUtil";
import { ContextError, elementSourceOffset, nodeSourceOffset, wrapContextError } from "./_contextError";
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
 *          'lookup': {               // free-form, for example...
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
*    There is a special rule for tags and attributes prefixed with _, or starting with a double-letter
 *    when you need to avoid the pre-processed tags/attributes being acted upon by the DOM.
 *      <iimg ssrc="{fonts.0}Icon.png">
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
 *    However, the DOM will refactor them if found inside a <table> but not inside <td>.
 *    
 *    Two options: _prefix (or pprefix) and CSS
 *      <ttable>
 *        <for ...>
 *          <ttr>
 *            <if eq ...><tth></tth></if>
 *            <if ne ...><ttd></ttd></if>
 *          </ttr>
 *        </for>
 *      </ttable>
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
  'build', 'use', 'for', 'if', 'else', 'elseif'
];

function firstBuilderElement():HTMLElement|null {
  const btags = builder_tags.concat(inputAreaTagNames);
  for (const t of btags) {
    const tags = document.getElementsByTagName(t);
    for (let i=0; i < tags.length; i++) {
      toggleClass(tags[i], '_builder_control_', true);
    }
  }
  const builds = document.getElementsByClassName('_builder_control_');
  if (builds.length == 0)
    return null;
  const first = builds[0];
  for (let i = builds.length-1; i >= 0; i--) {
    toggleClass(builds[i], '_builder_control_', false);
  }
  return first as HTMLElement;
}

/**
 * Does this document contain any builder elements?
 * @param doc An HTML document
 * @returns true if any of our custom tags are present.
 * NOTE: Does not detect {curlies} in plain text or plain elements.
 */
export function hasBuilderElements(doc:Document) {
  const btags = builder_tags.concat(inputAreaTagNames);
  for (let i = 0; i < btags.length; i++) {
    if (doc.getElementsByTagName(builder_tags[i]).length > 0) {
      return true;
    }
  }
}

let src_element_stack:Element[] = [];
let dest_element_stack:Element[] = [];
let builder_element_stack:Element[] = [];

export function initElementStack(elmt:Element|null) {
  dest_element_stack = [];
  src_element_stack = [];
  builder_element_stack = [];
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

export function pushBuilderElement(elmt:Element) {
  builder_element_stack.push(elmt);
}

export function popBuilderElement() {
  builder_element_stack.pop();
}

export enum TrimMode {
  off = 0,  // no trimming (default)
  on,       // trim text regions that are only whitespace
  pre,      // trim each line, so that <pre> tags don't need to be artificially outdented
  all,      // trim all text regions
}

/**
 * When in trim mode, cloning text between elements will omit any sections that are pure whitespace.
 * Sections that include both text and whitespace will be kept in entirety.
 * @returns One of three trim states, set anywhere in the current element heirarchy.
 */
export function getTrimMode():TrimMode {
  const elmt = getBuilderParentIf(e => hasClass(e, 'trim') || e.getAttributeNS('', 'trim') !== null);
  if (elmt) {
    if (hasClass(elmt, 'trim')) {
      return TrimMode.on;
    }
    let trim = elmt.getAttributeNS('', 'trim');
    trim = trim == null ? null : trim.toLowerCase();
    if (trim === 'all') {
      return TrimMode.all;
    }
    if (trim === 'pre') {
      return TrimMode.pre;
    }
    if (trim != null) {
      return (trim !== 'false' && trim !== 'off') ? TrimMode.on : TrimMode.off;
    }
  }
  return TrimMode.off;
}

/**
 * Throwing exceptions while building will hide large chunks of page.
 * Instead, set nothrow on any build element (not normal elements) to disable rethrow at that level.
 * In that case, the error will be logged, but then building will continue.
 * FUTURE: set onthrow to the name of a local function, and onthrow will call that, passing the error
 * @returns true if the current element expresses nothrow as either a class or attribute.
 */
export function shouldThrow(ex:Error, node1?:Node, node2?:Node, node3?:Node):boolean {
  // Inspect any passed-in nodes for throwing instructions.
  const nodes = [node1, node2, node3];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node || node.nodeType != Node.ELEMENT_NODE) {
        continue;
    }

    const elmt = nodes[i] as Element;  // The first element that had a elmt
    if (hasClass(elmt, 'nothrow') || elmt.getAttributeNS('', 'nothrow') !== null) {
      console.error(ex.stack);
      return false;
    }
    const fn = elmt.getAttributeNS('', 'onthrow');
    if (fn) {
      const func = window[fn];
      if (func) {
        console.error(ex.stack);
        func(ex, elmt);
        return false;
      }
    }
  }
  return true;
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

  for (let i = builder_element_stack.length - 1; i >= 0; i--) {
    if (fn(builder_element_stack[i])) {
      return builder_element_stack[i];
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
    if (elmt.parentNode === document) {
        return null;
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
 * @param rootId: if true, search for known builder elements.
 * If a string (usually pageBody), start with that node.
 */
export function expandControlTags(rootId:string|boolean) {
  let src:HTMLElement|null = null;
  if (typeof(rootId) === 'string') {
    src = document.getElementById(rootId as string)
  }
  if (!src) {
    src = firstBuilderElement();
  }
  const ifResult:ifResult = {passed:false, index:0};
  for ( ; src !== null; src = firstBuilderElement()) {
    try {
      initElementStack(src);
      let dest:Node[] = [];
      if (isTag(src, ['if', 'elseif', 'else'])) {
        dest = startIfBlock(src, ifResult);        
      }
      else {
        ifResult.index = 0;  // Reset

        if (isTag(src, 'build')) {
          dest = expandContents(src);
        }
        else if (isTag(src, 'for')) {
          dest = startForLoop(src);
        }
        else if (isTag(src, 'use')) {
          dest = useTemplate(src);
        }
        else if (isTag(src, inputAreaTagNames)) {
          dest = startInputArea(src);
        }
        else {
          dest = [cloneWithContext(src)];
        }
      }
      const parent = src.parentNode;
      for (let d = 0; d < dest.length; d++) {
        const node = dest[d];
        parent?.insertBefore(node, src);
      }
      parent?.removeChild(src);
    }
    catch (ex) {
      const ctxerr = wrapContextError(ex, "expandControlTags", elementSourceOffset(src));
      if (shouldThrow(ctxerr, src)) { throw ctxerr; }
    }
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
  const ifResult:ifResult = {passed:false, index:0};
  for (let i = 0; i < src.childNodes.length; i++) {
    const child = src.childNodes[i];
    if (child.nodeType == Node.ELEMENT_NODE) {
      const child_elmt = child as HTMLElement;
      try {
        if (isTag(child_elmt, ['if', 'elseif', 'else'])) {
          pushRange(dest, startIfBlock(child_elmt, ifResult));
          continue;
        }
        ifResult.index = 0;  // Reset

        if (isTag(child_elmt, 'for')) {
          pushRange(dest, startForLoop(child_elmt));
        }
        else if (isTag(child_elmt, 'use')) {
          pushRange(dest, useTemplate(child_elmt));
        }
        else if (isTag(child_elmt, inputAreaTagNames)) {
          pushRange(dest, startInputArea(child_elmt));
        }
        else if (isTag(child_elmt, 'template')) {
          // <template> tags do not clone the same as others
          throw new ContextError('Templates get corrupted when inside a build region. Define all templates at the end of the BODY');
        }
        else {
          dest.push(cloneWithContext(child_elmt));
        }
      }
      catch (ex) {
        const ctxerr = wrapContextError(ex, "expandContents", elementSourceOffset(child_elmt));
        if (shouldThrow(ctxerr, child_elmt, src)) { throw ctxerr; }
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
 * use any of three alternate naming schemes:
 *   _prefix or suffix_  Underscores will be removed.
 *   ddupe-letter        If the initial letter is duplicated, drop it.
 * The tag or attribute will be renamed when cloned, and the browser will treat it as a no-op until then.
 * @param name Any tag or attribute name
 * @returns The name, or the the name without the _ underscore or doubled initial letter
 */
export function normalizeName(name:string):string {
  if (name.substring(0, 1) == '_') {
    return name.substring(1);
  }
  if (name.substring(name.length - 1) == '_') {
    return name.substring(0, name.length - 1);
  }
  if (name.length >= 2 && name[0] == name[1]) {
    return name.substring(1);
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
  if (tagName == 'svg' && elmt.namespaceURI != svg_xmlns) {
    console.error("WARNING: <SVG> element missing xmlns='http://www.w3.org/2000/svg'");
  }
  if (inSvgNamespace() || tagName == 'svg') {
    // TODO: contents of embedded objects aren't SVG
    clone = document.createElementNS(svg_xmlns, tagName);
  }
  else if (elmt.getAttribute('xmlns') || elmt.getAttribute('xxmlns')) {
    const xmlns = elmt.getAttribute('xmlns') || elmt.getAttribute('xxmlns');
    clone = document.createElementNS(xmlns, tagName);
  }
  else {
    clone = document.createElement(tagName);
  }
  pushDestElement(clone);
  cloneAttributes(elmt, clone);

  const ifResult:ifResult = {passed:false, index:0};
  for (let i = 0; i < elmt.childNodes.length; i++) {
    const child = elmt.childNodes[i];
    try {
      if (child.nodeType == Node.ELEMENT_NODE) {
        const child_elmt = child as HTMLElement;
        if (isTag(child_elmt, ['if', 'elseif', 'else'])) {
          appendRange(clone, startIfBlock(child_elmt, ifResult));
          continue;
        }
        ifResult.index = 0;  // Reset

        if (isTag(child_elmt, 'for')) {
          appendRange(clone, startForLoop(child_elmt));
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
    catch (ex) {
      const ctxerr = wrapContextError(ex, "cloneWithContext", nodeSourceOffset(child));
      if (shouldThrow(ctxerr, child, elmt)) { throw ctxerr; }
    }
    
  }
  popDestElement();
  return clone;
}

/**
 * Splitting a text string by character is complicated when emoji are involved.
 * There are multiple ways glyphs can be combined or extended.
 * @param str A plain text string
 * @returns An array of strings that represent individual visible glyphs.
 */
export function splitEmoji(str:string):string[] {
  const glyphs:string[] = [];
  let joining = 0;
  let prev = 0;
  let code = 0;
  for (let ch of str) {
    // Track the current and previous characters
    prev = code;
    code = ch.length == 1 ? ch.charCodeAt(0)
      : ch.length == 2 ? (0x10000 + (((ch.charCodeAt(0) & 0x3ff) << 10)  | (ch.charCodeAt(1) & 0x3ff)))
      : -1;  // error

    if (code < 0) {
      // Expecting loop to always feed 1 UCS-4 character at a time
      throw new ContextError('Unexpected unicode combination: ' + ch + ' at byte ' + (glyphs.join('').length) + ' in ' + str);
    }
    else if (code >= 0xd800 && code <= 0xdf00) {
      // Half of surrogate pair
      throw new ContextError('Unexpected half of unicode surrogate: ' + code.toString(16) + ' at byte ' + (glyphs.join('').length) + ' in ' + str);
    }
    else if (code >= 0x1f3fb && code <= 0x1f3ff) {
      joining += 1;  // Fitzpatrick skin-tone modifier
    }
    else if (code >= 0xfe00 && code <= 0xfe0f) {
      joining += 1;  // Variation selectors
    }
    else if (code == 0x200d) {
      joining += 2;  // this character plus next
    }
    else if (code >= 0x1f1e6 && code <= 0x1f1ff) {
      // Regional indicator symbols
      if (prev >= 0x1f1e6 && prev <= 0x1f1ff && glyphs[glyphs.length - 1].length == 2) {
        // Always come in pairs, so only join if the previous code was also one
        // and that hasn't already built a pair. Note, a pair of these is length==4
        joining += 1;
      }
    }
    else if (code >= 0xe0001 && code <= 0xe007f) {
      // Tags block
      if (prev != 0xe007f) {  // Don't concat past a cancel tag
        joining += 1;
      }
    }

    if (joining > 0) {
      joining--;
      if (glyphs.length == 0) {
        throw new ContextError('Unexpected unicode join character ' + code.toString(16) + ' at byte 0 of ' + str);
      }
      const cur = glyphs.pop();
      ch = cur + ch;
    }

    glyphs.push(ch);
  }
  if (joining > 0) {
    throw new Error('The final emoji sequence expected ' + joining + ' additional characters')
  }  
  return glyphs;
}

/**
 * Clone other node types, besides HTML elements and Text
 * @param node Original node
 * @returns A node to use in the clone
 */
function cloneNode(node:Node):Node {
  return node;  // STUB: keep original node
}

/**
 * Write a comment to the console.
 * Only applies if in trace mode. Otherwise, a no-op.
 * @param str What to write
 */
export function consoleTrace(str:string) {
  if (isTrace()) {
    console.log(str);
  }
} 
export function consoleComment(str:string):Node[] {
  consoleTrace(str);
  if (isTrace()) {
    return [document.createComment(str)];
  }
  return [];
} 