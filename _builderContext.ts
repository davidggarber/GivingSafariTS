import { theBoiler } from "./_boilerplate";
import { normalizeName } from "./_builder";

/**
 * The root context for all builder functions
 * @returns the builderLookup object on the boiler.
 */
export function theBoilerContext() {
  return theBoiler().builderLookup || {};
}

const contextStack:object[] = [];

/**
 * Get the current builder context.
 * If needed, initialized from boilerplate.builderLookup
 * @returns The top context on the stack.
 */
export function getBuilderContext():object {
  if (contextStack.length == 0) {
    contextStack.push(theBoilerContext());
  }
  return contextStack[contextStack.length - 1];
}

/**
 * Start a new top level builder context.
 * @param newContext If specified, this is the new context. If not, start from a clone of the current top context.
 * @returns The new context, which the caller may want to modify.
 */
export function pushBuilderContext(newContext?:object):object {
  if (newContext === undefined) {
    newContext = structuredClone(getBuilderContext());
  }
  contextStack.push(newContext);
  return getBuilderContext();
}

/**
 * Pop the builder context stack.
 * @returns The new top-level builder context.
 */
export function popBuilderContext():object {
  contextStack.pop();
  return getBuilderContext();
}

/**
 * Finish cloning an HTML element
 * @param src The element being cloned
 * @param dest The new element, still in need of attributes
 * @param context A dictionary of all accessible values
 */
export function cloneAttributes(src:Element, dest:Element) {
  for (let i = 0; i < src.attributes.length; i++) {
    const name = normalizeName(src.attributes[i].name);
    let value = src.attributes[i].value;
    value = cloneText(value);
    if (name == 'id') {
      dest.id = value;
    }
    else if (name == 'class') {
      if (value) {
        const classes = value.split(' ');
        for (let i = 0; i < classes.length; i++) {
          if (classes[i].length > 0) {
            dest.classList.add(classes[i]);
          }
        }
      }    
    }
    // REVIEW: special case 'style'?
    else {
      dest.setAttributeNS('', name, value);
    }
  }
}

/**
 * Process a text node which may contain {curly} formatting.
 * @param text A text node
 * @param context A dictionary of all accessible values
 * @returns A list of text nodes
 */
export function cloneTextNode(text:Text):Node[] {
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
    const txt = textFromContext(key);
    dest.push(document.createTextNode(txt));
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
export function cloneText(str:string|null):string {
  if (str === null) {
    return '';
  }
  return contextFormula(str, false);
}

enum TokenType {
  start = 0,
  bracket,
  operator,
  text
}

/**
 * Divide up a string into sibling tokens.
 * Each token may be divisible into sub-tokens, but those are skipped here.
 * If we're not inside a {=formula}, the only tokens are { and }.
 * If we are inside a {=formula}, then operators and other brackets are tokens too.
 * @param str The parent string
 * @param inFormula True if str should be treated as already inside {}
 * @returns A list of token strings. Uninterpretted.
 */
function tokenizeFormula(str:string, inFormula:boolean): string[] {
  const tokens:string[] = [];
  const stack:string[] = [];
  let tok = '';
  let tokType = TokenType.start;
  for (let i = 0; i < str.length; i++) {
    const prevTT = tokType;
    const ch = str[i];
    if (!inFormula && ch == '{') {
      stack.push(bracketPairs[ch]);  // push the expected close
      tokType = TokenType.bracket;
    }
    else if (inFormula && ch in bracketPairs) {
      stack.push(bracketPairs[ch]);  // push the expected close
      tokType = TokenType.bracket;
    }
    else if (stack.length > 0) {
      tok += ch;
      if (ch == stack[stack.length - 1]) {
        stack.pop();
        if (stack.length == 0) {
          tokens.push(tok);
          tok = '';
          tokType = TokenType.start;
        }
      }
      continue;
    }
    else if (inFormula && (ch in binaryOperators || ch in unaryOperators)) {
      tokType = TokenType.operator;
    }
    else {
      tokType = TokenType.text;
    }

    if (tokType != prevTT) {
      if (tok) {
        tokens.push(tok);
      }
      tok = ch;
      if (tokType == TokenType.operator) {
        tokens.push(ch);
        tok = '';
        tokType = TokenType.start;
      }
    }
    else {
      tok += ch;
    }
  }
  if (tok) {
    tokens.push(tok);
  }
  return tokens;
}

/* Context formula syntax has several components that need to play nicely with each other.
   Brackets:
     {} to start lookups
     [] to start secondary, nested lookups
     () to do operator precedence, within formulas
   Fields:
     a-z0-9_   normal javascript field name rules
     .         separator
     ?         indicates optional (sub-)fields
   Generated field suffixes:
     #  index in a loop
     !  value of a key
     $  ???
   Operators:
     +-*\%/   numeric operators
     &@       string operators

 */


const bracketPairs = {
  '(': ')',
  // '[': ']',
  '{': '}',
  // '<': '>',  // should never be used for comparison operators in this context
  '"': '"',
  "'": "'",
}

const binaryOperators = {
  '+': (a,b) => {return String(parseFloat(a) + parseFloat(b))},
  '-': (a,b) => {return String(parseFloat(a) - parseFloat(b))},
  '*': (a,b) => {return String(parseFloat(a) * parseFloat(b))},
  '/': (a,b) => {return String(parseFloat(a) / parseFloat(b))},
  '\\': (a,b) => {const f=parseFloat(a) / parseFloat(b); return String(f >= 0 ? Math.floor(f) : Math.ceil(f)); },  // integer divide without Math.trunc
  '%': (a,b) => {return String(parseFloat(a) % parseInt(b))},
  '&': (a,b) => {return String(a) + String(b)},
}

const unaryOperators = {
  '-': (a) => {return String(-parseFloat(a))},
  '@': (a) => {return deentify(a)},
}

/**
 * A few common named entities
 */
const namedEntities = {
  'quot': '"',
  'apos': '\'',
  'lt': '<',
  'gt': '>',
  'lb': '{',  // not the real name. It should be &lbrace;
  'rb': '}',  // not the real name. It should be &rbrace;
  'lbrace': '{',
  'rbrace': '}',
  'amp': '&',
  'nbsp': '\xa0',
}

/**
 * Convert an entity term into simple text.
 * Note that the entity prefix is # rather than &, because & injects an actual entity, which becomes text before we see it.
 * Supports decimal @34; and hex @x22; and a few named like @quot;
 * @param str the contents of the entity, after the @
 * @returns a single character, if known, else throws an exception
 */
function deentify(str:string):string {
  if (!str || str == ';') { return ''; }
  if (str[str.length - 1] == ';') { str = str.substring(0, str.length - 1); }  // trim trailing semicolon
  if (str[0] == 'x' || (str[0] >= '0' && str[9] <= '9')) {
    let code = 0;
    if (str[0] == 'x') {
      str = str.substring(1);
      code = parseInt(str, 16);
      // REVIEW: will fromCharCode work for codes > 0x10000?
    }
    else {
      code = parseInt(str, 10);
    }
    return String.fromCharCode(code);
  }
  if (str in namedEntities) {
    return namedEntities[str];
  }
  throw new Error('Unknown named entity: &' + str + ';');
}

/**
 * Handle a mix of context tokens and operators
 * @param str Raw text of a token/operator string
 * @param context A dictionary of all accessible values
 * @param inFormula True if str should be treated as already inside {}
 * @returns Expanded text
 */
function contextFormula(str:string, inFormula:boolean):string {
  let dest = '';
  const tokens = tokenizeFormula(str, inFormula);
  let binaryOp:undefined|((a:string,b:string) => string);
  let unaryOp:undefined|((a:string) => string);
  for (let t = 0; t < tokens.length; t++) {
    let tok = tokens[t];
    if (!tok) {
      continue;
    }
    if (inFormula && (tok in binaryOperators || tok in unaryOperators)) {
      if ((binaryOp || dest == '') && tok in unaryOperators) {
        unaryOp = unaryOperators[tok];
      }
      else if (binaryOp || !(tok in binaryOperators)) {
        throw new Error("Consecutive binary operators: " + tok);
      }
      else {
        binaryOp = binaryOperators[tok];
      }
      continue;  
    }
    let fromContext = false;
    if (tok[0] in bracketPairs) {
      const inner = tok.substring(1, tok.length - 1);
      if (tok[0] == '(') {
        // (...) is a precedence operator
        tok = contextFormula(inner, true);
        fromContext = true;
      }
      else if (tok[0] == '{') {
        if (tok[1] == '=') {
          // {=...} is a nested formula
          tok = contextFormula(inner.substring(1), true);
        }
        else {
          // {...} is a context look-up
          tok = '' + anyFromContext(inner);
        }
        fromContext = true;
      }
    }
    if (unaryOp) {
      tok = unaryOp(tok);
      unaryOp = undefined;
    }
    if (binaryOp) {
      // All operators read left-to-right
      // TODO: if dest=='', consider unary operators
      dest = binaryOp(dest, tok);
      binaryOp = undefined;  // used up
    }
    else if (inFormula && !fromContext) {
      dest += anyFromContext(tok);
    }
    else {
      dest += tok;
    }
  }
  if (unaryOp) {
    throw new Error("Incomplete unary operation: " + str);
  }
  if (binaryOp) {
    throw new Error("Incomplete binary operation: " + str);
  }
  return dest;
}

/**
 * Trim a string without taking non-breaking-spaces
 * @param str Any string
 * @returns A substring
 */
function simpleTrim(str:string):string {
  let s = 0;
  let e = str.length;
  while (s < e && (str.charCodeAt(s) || 33) <= 32) {
    s++;
  }
  while (e > s && (str.charCodeAt(e) || 33) <= 32) {
    e--;
  }
  return str.substring(s, e);
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
export function anyFromContext(key:string):any {
  key = simpleTrim(key);
  if (key === '') {
    return '';
  }
  const context = getBuilderContext();
  let rootCurly = false;
  if (key[0] == '{' && key[key.length - 1] == '}') {
    // Remove redundant {curly}, since some fields don't require them
    key = simpleTrim(key.substring(1, key.length - 1));
    rootCurly = false;
  }
  const path = key.split('.');
  const nested = [context];
  for (let i = 0; i < path.length; i++) {
    let step = path[i];
    if (!step) {
      continue;  // Ignore blank steps for now
    }
    const maybe = step.indexOf('?') == step.length - 1;
    if (maybe) {
      step = step.substring(0, step.length - 1);
    }
    const newNest = step[0] == '[';
    if (newNest) {
      step = step.substring(1);
      nested.push(context);
    }
    // steps can end in one more more ']', which can't occur anywhere else
    let unnest = step.indexOf(']');
    if (unnest >= 0) {
      unnest = step.length - unnest;
      if (nested.length <= unnest) {
        throw new Error('Malformed path has unmatched ] : ' + key);
      }
      step = step.substring(0, step.length - unnest);
    }

    if (!(step in nested[nested.length - 1])) {
      if (maybe) {
        if (i != path.length - 1) {
          console.log('Optional key ' + step + '?' + ' before the end of ' + key);
        }
        return '';  // All missing optionals return ''
      }
      if ((rootCurly && i == 0 && path.length == 1) || (newNest && unnest > 0)) {
        nested[nested.length - 1] = new String(step);  // A lone step (or nested step) can be a literal
      }
      else {
        throw new Error('Unrecognized key: ' + step + ' in ' + key);
      }
    }
    else {
      nested[nested.length - 1] = getKeyedChild(nested[nested.length - 1], step, maybe);
    }

    for (; unnest > 0; unnest--) {
      const pop:string = '' + nested.pop();
      nested[nested.length - 1] = getKeyedChild(nested[nested.length - 1], pop, maybe);
    }
  }
  if (nested.length > 1) {
    throw new Error('Malformed path has unmatched [ : ' + key);
  }
  return nested.pop();
}

/**
 * Look up a value, according to the context path cached in an attribute
 * @param path A context path
 * @returns Any JSON object
 */
export function globalContextData(path:string):any {
  const context = theBoilerContext();
  if (path && context) {
    return anyFromContext(path);
  }
  return undefined;
}

/**
 * Test a key in the current context
 * @param key A key, initially from {curly} notation
 * @returns true if key is a valid path within the context
 */
export function keyExistsInContext(key:string) {
  try {
    const a = anyFromContext(key);
    // null, undefined, or '' count as not existing
    return a !== null && a !== undefined && a !== '';
  }
  catch {
    return false;
  }
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
 * @returns Resolved text
 */
export function textFromContext(key:string|null):string {
  if (!key) {
    return '';
  }
  try {
    return contextFormula(key, true);
  }
  catch(ex) {
    if (key.indexOf('.') < 0) {
      return key;  // key can be a literal value
    }
    throw ex;
  }
}


/**
 * Get a keyed child of a parent, where the key is either a dictionary key 
 * or a list index or a string offset.
 * @param parent The parent object: a list, object, or string
 * @param key The identifier of the child: a dictionary key, a list index, or a string offset
 * @param maybe If true, and key does not work, return ''
 * @returns A child object, or a substring
 */
function getKeyedChild(parent:any, key:string, maybe?:boolean) {
  if (typeof(parent) == 'string') {
    const i = parseInt(key);
    if (maybe && (i < 0 || i >= (parent as string).length)) {
      return '';
    }
    return (parent as string)[i];
  }
  if (!(key in parent)) {
    if (maybe) {
      return '';
    }
    throw new Error('Unrecognized key: ' + key);
  }
  return parent[key];
}
