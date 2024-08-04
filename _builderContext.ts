import { isNumberObject } from "util/types";
import { theBoiler } from "./_boilerplate";
import { getTrimMode, normalizeName, TrimMode } from "./_builder";
import { BuildError, BuildEvalError, BuildTagError } from "./_builderError";

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
 * Inject a builder context for testing purposes.
 * @param lookup Any object, or undefined to remove.
 */
export function testBuilderContext(lookup?:object) {
  theBoiler().builderLookup = lookup;
  contextStack.splice(0, contextStack.length);  // clear
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
 * Try to look up a key in the current context level.
 * @param key A key name
 * @returns The value from that key, or null if not present
 */
export function valueFromContext(key:string):any {
  const context = getBuilderContext();
  if (key in context) {
    return context[key];
  }
  return null;
}

/**
 * Finish cloning an HTML element
 * @param src The element being cloned
 * @param dest The new element, still in need of attributes
 * @param context A dictionary of all accessible values
 */
export function cloneAttributes(src:Element, dest:Element) {
  try {
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
  catch (ex) {
    throw new BuildTagError("cloneAttributes", src, ex);
  }
}

/**
 * Process a text node which may contain {curly} formatting.
 * @param text A text node
 * @returns A list with 1 or 0 text nodes
 */
export function cloneTextNode(text:Text):Node[] {
  const str = text.textContent || '';
  const cloned = complexAttribute(str, getTrimMode());
  if (cloned === '') {
    return [];
  }
  
  const node = document.createTextNode(cloned);
  return [node];
}

/**
 * Process text which may contain {curly} formatting.
 * @param text Any text, including text inside attributes
 * @returns Expanded text
 */
export function cloneText(str:string|null):string {
  if (str === null) {
    return '';
  }
  const trimMode = getTrimMode();
  const cloned = complexAttribute(str, Math.max(trimMode, TrimMode.on));
  return '' + cloned;
}

/**
 * Resolve an attribute, in situations where it can resolve to an object, 
 * and not just text. If any portion is text, then the entire will concatenate
 * as text.
 * @param str the raw attribute
 * @param trim whether any whitespace should be trimmed while processing. By default, off.
 * @returns an object, if the entire raw attribute string is a {formula}.
 * Otherwise a string, which may simply be a clone of the original.
 */
export function complexAttribute(str:string, trim:TrimMode = TrimMode.off):any {
  if (str === null) {
    return '';
  }
  
  if (trim != TrimMode.off) {
    str = simpleTrim(str);
  }

  const list = tokenizeText(str);

  let buffer = '';
  for (let i = 0; i < list.length; i++) {
    if (!list[i].formula) {
      if (trim == TrimMode.all) {
        buffer += simpleTrim(list[i].text);
      }
      else {
        buffer += list[i].text;
      }
    }
    else {
      const complex = evaluateFormula(list[i].text);
      if (i == 0 && list.length == 1) {
        return complex;
      }
      buffer += complex;
    }
  }
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
  while (--e > s && (str.charCodeAt(e) || 33) <= 32) {
    ;
  }
  return str.substring(s, e + 1);
}

enum TokenType {
  unset = 0,
  unaryOp = 0x1,  // sub-types of operator, when we get to that
  binaryOp = 0x2,
  anyOperator = 0x3,
  openBracket = 0x10,
  closeBracket = 0x20,
  anyBracket = 0x30,
  anyOperatorOrBracket = 0xff,
  word = 0x100,
  number = 0x200,
  spaces = 0x400,
  anyText = 0xf00,
  node = 0x1000,
}

type FormulaToken = {
  text?: string;
  type: TokenType;
  node?: FormulaNode;
}

/**
 * Divide up a string into sibling tokens.
 * Each token may be divisible into sub-tokens, but those are skipped here.
 * If we're not inside a {=formula}, the only tokens are { and }.
 * If we are inside a {=formula}, then operators and other brackets are tokens too.
 * @param str The parent string
 * @param inFormula True if str should be treated as already inside {}
 * @returns A list of token strings. Uninterpretted.
 * (Only exported for unit tests)
 */
export function tokenizeFormula(str:string): FormulaToken[] {
  const tokens:FormulaToken[] = [];
  const stack:string[] = [];  // currently open brackets

  let tok:FormulaToken = { text: '', type: TokenType.unset };
  let escape = '';
  for (let i = 0; i <= str.length; i++) {
    const ch = i < str.length ? str[i] : '';
    if (ch == '`') {
      escape += ch;
      continue;
    }
    
    const op = getOperator(ch);

    if (stack.length > 0 && (escape.length % 2) == 0 && ch == stack[stack.length - 1]) {
      stack.pop();
      if (tok.type != TokenType.unset) { tokens.push(tok); }        // push any token in progress
      tokens.push(tok = { text:ch, type:TokenType.closeBracket });  // push close bracket
      tok = { text: '', type: TokenType.unset };                    // reset next token
    }
    else if (!isInQuotes(stack) && (escape.length % 2) == 0 && isBracketOperator(op)) {
      if (tok.type != TokenType.unset) { tokens.push(tok); }       // push any token in progress
      tokens.push(tok = { text:ch, type:TokenType.openBracket });  // push open bracket
      stack.push(op!.closeChar!);                                // cache the matching close bracket
      tok = { text: '', type: TokenType.unset };                   // reset next token
    }
    else if (!isInQuotes(stack) && (escape.length % 2) == 0 && op !== null) {
      let tt:TokenType = TokenType.unset;
      if (isBinaryOperator(op)) { tt |= TokenType.binaryOp; }
      if (isUnaryOperator(op)) { tt |= TokenType.unaryOp; }
      if (tok.type != TokenType.unset) { tokens.push(tok); }   // push any token in progress
      tokens.push(tok = { text:ch, type:tt });                 // push operator (exact type TBD)
      tok = { text: '', type: TokenType.unset };               // reset next token
    }
    else {
      const evenEscape = escape.substring(0, Math.floor(escape.length / 2));
      const oddEscape = escape.substring(0, escape.length % 2);
      tok.text += evenEscape;  // for every pair ``, append one `
      if (isBracketChar(ch) && oddEscape == '`') {
        tok.text += ch;  // Any escaped brackets should drop the escape ` prefix
      }
      else {
        // Keep any odd escape, since we didn't escape anything
        tok.text += oddEscape + ch;
      }
      if (tok.text !== '') {
        tok.type = TokenType.anyText;
      }
    }
    escape = '';
  }
  if (tok.type != TokenType.unset) { 
    tokens.push(tok);  // push any token in progress
  }

  // Re-scan tokens, to clarify operator and text sub-types
  let prev = TokenType.unset;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.type & TokenType.anyOperator) {
      if ((prev & (TokenType.word | TokenType.number | TokenType.closeBracket)) == 0) {
        // If no object (text or a closeBracket) precedes us, we're a unary operator
        // For example, consecutive operators mean all but the first are unary (since we have no post-fix unary operators)
        tok.type = TokenType.unaryOp;
        const op = getOperator(tok.text!);
        tok.text = op!.unaryChar ?? tok.text;  // possibly substitute operator char
      }
      else if (tok.type & TokenType.anyOperator) {
        // When an object does precede us, then ambiguous operators are binary
        tok.type = TokenType.binaryOp;
        const op = getOperator(tok.text!);
        tok.text = op!.binaryChar ?? tok.text;  // possibly substitute operator char
      }
    }
    else if (tok.type & TokenType.anyText) {
      if (simpleTrim(tok.text!).length == 0) {
        tok.type = TokenType.spaces;
      }
      else if (isIntegerRegex(tok.text!)) {
        tok.type = TokenType.number;
      }
      else {
        tok.type = TokenType.word;
      }
    }
    
    if (tok.type != TokenType.spaces) {
      prev = tok.type;
    }
  }

  return tokens;
}

function findCloseBracket(tokens:FormulaToken[], open:number):number {
  const closes:string[] = [bracketPairs[tokens[open].text!]];
  for (let i = open + 1; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.type == TokenType.closeBracket) {
      if (tok.text == closes[closes.length - 1]) {
        closes.pop();
        if (closes.length == 0) {
          return i;
        }
      }
      else {
        throw new BuildError('Unmatched close bracket: ' + tok.text);
      }
    }
    else if (tok.type == TokenType.openBracket) {
      closes.push(bracketPairs[tok.text!]);
    }
  }
  throw new BuildError('Missing close brackets: ' + closes.join(' '));
}

/**
 * A node of a formula's expression, which can be combined into a binary tree.
 * Each node also has a parent pointer, to support tree restructuring.
 * A single node is one of:
 *   plain text (could be a number)
 *   a unary operation, with an operator and its operand
 *   a binary operation, with an operator and two operands
 * If an operation, the operand(s) are also FormulaNodes.
 * Nodes are decorated with any immediate bracket, which affects text parsing.
 * (Only exported for unit tests)
 */
export class FormulaNode {
  value: string;  // Doubles as the operator and the simple string value
  left?: FormulaNode;
  right?: FormulaNode;
  complete: boolean;
  bracket: string = '';  // If this node is the root of a bracketed sub-formula, name the bracket char, else ''
  parent?: FormulaNode;

  constructor(complete:boolean, value:string, right?:FormulaNode, left?:FormulaNode) {
    this.left = left;
    this.right = right;
    this.value = value;
    this.complete = complete;

    if (right) {
      right.parent = this;
    }
    if (left) {
      left.parent = this;
    }
  }

  /**
   * Recreate the expression, as text
   * @returns A string equivalent (including any brackets or quotes it was found inside)
   */
  toString(): string {
    const rbrace = this.bracket === '' ? '' : bracketPairs[this.bracket];
    if (this.left) {
      return this.bracket + this.left.toString() + ' ' + this.value + ' ' + this.right?.toString() + rbrace;
    }
    else if (this.right) {
      return this.bracket + this.value + ' ' + this.right?.toString() + rbrace;
    }
    else {
      return this.bracket + this.value + rbrace;
    }
  }

  /**
   * Is this node waiting for the object of an operator?
   * @returns true if the object is complete. false if awaiting an object.
   */
  isComplete():boolean {
    return this.complete;
  }

  /**
   * Is this node plain-text?
   * @returns false if there is an operation and operands, else false
   */
  isSimple():boolean {
    return this.complete && !this.left && !this.right;
  }

  /**
   * A node that doesn't yet have all of its operands can be appended.
   * If complete, reject the new node (it should be retried on a parent).
   * Otherwise, assign to the right. Never the left.
   * @param node The trailing operand in either a unary or binary operation.
   * @returns true if this node has absorbed this as a new argument, 
   * else false if we're already complete.
   */
  append(node:FormulaNode):boolean {
    if (this.complete) {
      return false;
    }
    this.right = node;
    node.parent = this;
    this.complete = true;
    return true;
  }

  /**
   * Evaluate this node.
   * @param evalText if true, any simple text nodes are assumed to be named objects or numbers
   * else any simple text is just that. No effect for non-simple text.
   * @returns If it's a simple value, return it (any type).
   * If there's an operator and operands, return a type appropriate for that operator.
   */
  evaluate(evalText?:boolean): any {
    if (!this.complete) {
      throw new Error('ERROR: Cannot evaluate incomplete node: ' + this.toString());
    }
    if (this.left) {
      try {
        const op = getOperator(this.value!);
        const bop:undefined|BinaryOperator = op!.binaryOp;

        // right must also exist, because we're complete
        const lValue = this.left.evaluate(op!.evalLeft);
        const rValue = this.right!.evaluate(op!.evalRight);

        if (bop) {
          return bop(lValue, rValue);
        }
      }
      catch (ex) {
        throw new BuildEvalError('FormulaNode.evaluateBinary', toString(), ex);
      }
      throw new Error('ERROR: Unrecognize binary operator: ' + this.value);
    }
    else if (this.right) {
      try {
        const op = getOperator(this.value!);
        const uop:undefined|UnaryOperator = op!.unaryOp;
        const rValue = this.right.evaluate(op!.evalRight);
        if (uop) {
          return uop(rValue);
        }
      }
      catch (ex) {
        throw new BuildEvalError('FormulaNode.evaluateUnary', toString(), ex);
      }
      throw new Error('ERROR: Unrecognize unary operator: ' + this.value);
    }
    else if (this.bracket === '\"' || this.bracket === '\'') {
      // Reliably plain text
      return this.value;
    }
    else {
      // Could be plain text (or a number) or a name in context
      const context = getBuilderContext();
      const trimmed = simpleTrim(this.value);
      if (evalText === true) {
        if (trimmed in context) {
          return context[trimmed];
        }
        if (isIntegerRegex(trimmed)) {
          return parseInt(trimmed);
        }
      }
      return this.value;
    }
  }
}

/**
 * Does this string look like an integer?
 * @param str any text
 * @returns true if, once trimmed, it's a well-formed integer
 */
function isIntegerRegex(str:string):boolean {
  return /^-?\d+$/.test(str.trim());
}

/**
 * Of all the operators, find the one with the highest precedence.
 * @param tokens A list of tokens, which are a mix of operators and values
 * @returns The index of the first operator with the highest precedence,
 * or -1 if no remaining operators
 */
function findHighestPrecedence(tokens:FormulaToken[]): number {
  let precedence = 0;
  let first = -1;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.type & TokenType.anyOperatorOrBracket) {
      const op = getOperator(tok.text ?? '');
      if (op) {
        if ((op.precedence || 0) > precedence) {
          precedence = op.precedence!;
          first = i;
        }
      }
    }
  }
  return first;
}

/**
 * 2nd pass of formula parser.
 * Uses operator precedence. 
 * Finds the left-most of the highest-precedence operators.
 * Builds a node that binds that operator to its operand(s).
 * Replace that subset with the node, and repeat
 * @param tokens A sequence of tokens
 * @param bracket An encapsulating bracket, if any
 * @returns A single node
 * @throws an error if the formula is malformed: mismatched brackets or incomplete operators
 */
export function treeifyFormula(tokens:FormulaToken[], bracket?:string):FormulaNode
{
  if (isStringBracket(bracket || '')) {
    // concatenate all tokens into one string
    const str = tokens.map(t => t.text || '').join('');
    return new FormulaNode(true, str);
  }

  while (tokens.length > 0) {
    const opIndex = findHighestPrecedence(tokens);
    if (opIndex < 0) {
      // If well informed, there should only be a single non-space token left
      let node:FormulaNode|undefined = undefined;
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type != TokenType.spaces) {
          if (node) {
            // This is a 2nd token
            // REVIEW: Alternatively invent a concatenation node
            throw new Error('ERROR: consecutive tokens with no operator: ' 
              + node?.toString() + ' ' + (tok.text || tok.node?.toString()));
          }
          if (tok.type == TokenType.node) {
            node = tok.node!;
          }
          else {
            node = new FormulaNode(true, tok.text || '');
          }
        }
      }
      if (!node) {
        throw new Error('ERROR: no value tokens in span');
      }
      return node;
    }

    // const tok = tokens[opIndex];
    const ch = tokens[opIndex].text!
    const op = getOperator(ch);
    
    if (isUnaryOperator(op)) {
      let r = opIndex + 1;
      while (r < tokens.length && tokens[r].type == TokenType.spaces) { 
        r++; 
      }
      if (r >= tokens.length) {
        throw new Error('ERROR: Unary operator with no following operand: ' + ch);
      }
      const rightSplit = tokens.splice(opIndex + 1, r - opIndex);
      const right = treeifyFormula(rightSplit);
      const node = new FormulaNode(true, op!.raw, right);
      const tok:FormulaToken = { type:TokenType.node, node:node };
      tokens[opIndex] = tok;
    }

    else if (isBinaryOperator(op)) {
      let r = opIndex + 1;
      while (r < tokens.length && tokens[r].type == TokenType.spaces) { 
        r++; 
      }
      if (r >= tokens.length) {
        throw new Error('ERROR: Unary operator with no right operand: ' + ch);
      }
      const rightSplit = tokens.splice(opIndex + 1, r - opIndex);
      const right = treeifyFormula(rightSplit);

      let l = opIndex - 1;
      while (l >= 0 && tokens[l].type == TokenType.spaces) { 
        l--; 
      }
      if (l < 0) {
        throw new Error('ERROR: Binary operator with left operand: ' + ch);
      }
      const leftSplit = tokens.splice(l, opIndex - l);
      const left = treeifyFormula(leftSplit);

      const node = new FormulaNode(true, op!.raw, right, left);
      const tok:FormulaToken = { type:TokenType.node, node:node };
      tokens[l] = tok;
    }

    else if (isBracketOperator(op)) {
      const close = findCloseBracket(tokens, opIndex);
      tokens.splice(close, 1);  // Delete close bracket
      const nested = tokens.splice(opIndex + 1, close - opIndex - 1);
      const node = treeifyFormula(nested, op?.raw);
      const tok:FormulaToken = { type:TokenType.node, node:node };
      tokens[opIndex] = tok;
    }
    else {
      throw new Error('ERROR: Unknown operator from ' + ch + ': ' + op);
    }
  }

  throw new Error('ERROR: Treeify reduced to an empty span');
}

/**
 * Evaluate a formula
 * @param str A single formula. The bracketing {} are assumed.
 * @returns A single object, list, or string
 */
export function evaluateFormula(str:string|null):any {
  if (str === null) {
    return '';
  }
  try {
    const tokens = tokenizeFormula(str);
    // const node = buildFormulaNodeTree(tokens);
    const node = treeifyFormula(tokens);
    return node.evaluate(true);  
  }
  catch (ex) {
    throw new BuildEvalError('evaluateFormula', str, ex);
  }
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
     .?:      object and context operators

 */


const bracketPairs = {
  '(': ')',
  '[': ']',
  '{': '}',
  // '<': '>',  // should never be used for comparison operators in this context
  '"': '"',
  "'": "'",
}

/**
 * Most brackets can stack inside each other, but once we have quotes, we're done
 * @param stack a stack of pending close brackets, i.e. what we're inside of
 * @returns true if the innermost bracket is " or '
 */
function isInQuotes(stack:string[]) {
  return stack.length > 0 
    && (stack[stack.length - 1] == '"' || stack[stack.length - 1] == '\'');
}

/**
 * Is this character normally a bracket, and therefore in need of escaping?
 * @param ch 
 * @returns 
 */
function isBracketChar(ch:string):boolean {
  return ch in bracketPairs
    || ch == ')' || ch == ']' || ch == '}';
}

type UnaryOperator = (a:any) => any;
type BinaryOperator = (a:any,b:any) => any;

type OperatorInfo = {
  raw: string;
  precedence?: number;  // higher numbers should evaluate before lower
  unaryChar?: string;  // if a unaryOp, replace text for a unique operator
  binaryChar?: string;  // if a binaryOp, replace text for a unique operator
  closeChar?: string;  // only for brackets
  unaryOp?: UnaryOperator;  // only supports prefixed unary operators: -4, but not 4!
  binaryOp?: BinaryOperator;
  evalLeft?: boolean;
  evalRight?: boolean;
}

const minus:OperatorInfo = { raw:'-', unaryChar:'⁻', binaryChar:'−'};  // ambiguously unary or binary
const concat:OperatorInfo = { raw:'&', precedence:1, binaryOp:(a,b) => {return String(a) + String(b)}, evalLeft:true, evalRight:true};
const entity:OperatorInfo = { raw:'@', precedence:1, unaryOp:(a) => {return deentify(a)}, evalRight:false};
const plus:OperatorInfo = { raw:'+', precedence:3, binaryOp:(a,b) => {return parseFloat(a) + parseFloat(b)}, evalLeft:true, evalRight:true};
const subtract:OperatorInfo = { raw:'−', precedence:3, binaryOp:(a,b) => {return parseFloat(a) - parseFloat(b)}, evalLeft:true, evalRight:true};
const times:OperatorInfo = { raw:'*', precedence:4, binaryOp:(a,b) => {return parseFloat(a) * parseFloat(b)}, evalLeft:true, evalRight:true};
const divide:OperatorInfo = { raw:'/', precedence:4, binaryOp:(a,b) => {return parseFloat(a) / parseFloat(b)}, evalLeft:true, evalRight:true};
const intDivide:OperatorInfo = { raw:'\\', precedence:4, binaryOp:(a,b) => {const f=parseFloat(a) / parseFloat(b); return f >= 0 ? Math.floor(f) : Math.ceil(f)}, evalLeft:true, evalRight:true};  // integer divide without Math.trunc
const modulo:OperatorInfo = { raw:'%', precedence:4, binaryOp:(a,b) => {return parseFloat(a) % parseFloat(b)}, evalLeft:true, evalRight:true};
const negative:OperatorInfo = { raw:'⁻', precedence:5, unaryOp:(a) => {return -parseFloat(a)}, evalRight:true};
const childObj:OperatorInfo = { raw:'.', precedence:6, binaryOp:(a,b) => {return getKeyedChild(a, b, false)}, evalLeft:true, evalRight:false};
const rootObj:OperatorInfo = { raw:':', precedence:7, unaryOp:(a) => {return globalContextData(a)}, evalRight:false};
const roundBrackets:OperatorInfo = { raw:'(', precedence:8, closeChar:')'};
const squareBrackets:OperatorInfo = { raw:'[', precedence:8, closeChar:']'};
const curlyBrackets:OperatorInfo = { raw:'{', precedence:8, closeChar:'}'};
const closeRoundBrackets:OperatorInfo = { raw:')'};
const closeSquareBrackets:OperatorInfo = { raw:']'};
const closeCurlyBrackets:OperatorInfo = { raw:'}'};
const singleQuotes:OperatorInfo = { raw:'\'', precedence:10, closeChar:'\''};
const doubleQuotes:OperatorInfo = { raw:'"', precedence:10, closeChar:'"'};

const allOperators:OperatorInfo[] = [
  minus, concat, entity, plus, subtract,
  times, divide, intDivide, modulo, negative,
  childObj, rootObj,
  roundBrackets, squareBrackets, curlyBrackets,
  closeRoundBrackets, closeSquareBrackets, closeCurlyBrackets,
  singleQuotes, doubleQuotes
];

// Convert the list to a dictionary, keyed on the raw string
// (accumulate each item in the list into a field in acc, which starts out as {})
const operatorLookup = allOperators.reduce((acc, obj) => { acc[obj.raw] = obj; return acc; }, {});

function isOperator(ch:string) {
  return ch in isOperator;
}

function getOperator(ch:string|OperatorInfo|null):OperatorInfo|null {
  if (ch === null) {
    return null;
  }
  if (typeof ch === 'string') {
    if (ch in operatorLookup) {
      return operatorLookup[ch];
    }
    return null;
  }
  return ch as OperatorInfo;
}

function isUnaryOperator(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op !== null
    && (op.unaryChar !== undefined || op.unaryOp !== undefined);
}

function isBinaryOperator(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op !== null
    && (op.binaryChar !== undefined || op.binaryOp !== undefined);
}

function isBracketOperator(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op !== null && op.closeChar !== undefined;
}

function isStringBracket(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op !== null && (op.raw == '"' || op.raw == '\'');
}

// const binaryOperators = {
//   '+': (a,b) => {return String(parseFloat(a) + parseFloat(b))},
//   '-': (a,b) => {return String(parseFloat(a) - parseFloat(b))},
//   '*': (a,b) => {return String(parseFloat(a) * parseFloat(b))},
//   '/': (a,b) => {return String(parseFloat(a) / parseFloat(b))},
//   '\\': (a,b) => {const f=parseFloat(a) / parseFloat(b); return String(f >= 0 ? Math.floor(f) : Math.ceil(f)); },  // integer divide without Math.trunc
//   '%': (a,b) => {return String(parseFloat(a) % parseInt(b))},
//   '&': (a,b) => {return String(a) + String(b)},
// }

// const unaryOperators = {
//   '-': (a) => {return String(-parseFloat(a))},
// //  '@': (a) => {return deentify(a)},
//   ':': (a) => {return globalContextData(a)},
// }

// const objectOperators = {
//   '.': (a,b) => {return getKeyedChild(a, b, false)},
//   // '?': (a,b) => {return getKeyedChild(a, b, true)},
// }

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
  throw new BuildEvalError('deentify', str);
}

/**
 * Each token in a text string is either plain text or a formula that should be processed.
 */
type TextToken = {
  text: string;
  formula: boolean;
}

/**
 * Find the next instance of a character, making sure the character isn't escaped.
 * In our custom library, the escape character is a prefixed `
 * The only thing that can be escaped is brackets () [] {} "" '', and the ` itself.
 * Anywhere else, ` is simply that character.
 * @param raw The raw HTML content
 * @param find The character the search for
 * @param start The first position in the raw HTML
 * @returns the index of the character, if found, or else -1 if not found
 */
function findNonEscaped(raw:string, find:string, start:number) {
  while (start < raw.length) {
    let curly = raw.indexOf(find, start);
    if (curly > 0) {
      let esc = 0;
      while (curly - esc > 0 && raw[curly - esc - 1] == '`') {
        esc++;
      }
      if ((esc % 2) == 1) {
        // An odd number of back-slashes means the curly itself is escaped.
        // An even number means the back-slash is itself escaped, but not the curly
        start = curly + 1;
        continue;
      }
    }
    return curly;
  }
  return -1;
}

/**
 * Remove any escape characters preceding curly braces.
 * Since those braces have other meanings when not escaped, 
 * then their sheer presence means they were escaped.
 * @param raw A string which may contain `{ or even ```{
 * @returns A somg;e
 */
function unescapeBraces(raw:string):string {
  let str = '';
  let start = 0;
  while (start <= raw.length) {
    let i = raw.indexOf('`', start);
    if (i < 0) {
      str += raw.substring(start);
      break;
    }
    str += raw.substring(start, i);
    const ch = i + 1 < raw.length ? raw[i + 1] : '';
    if (ch == '`' || ch == '{' || ch == '}') {
      // drop the ` escape, and keep the next char
      str += ch;
      start = i + 2;
    }
    else {
      str += str += '`';  // not a real escape
      start = i + 1;
    }
  }
  return str;
}

/**
 * Parse text that occurs inside a built control element into tokens.
 * @param raw the raw document text
 * @param implicitFormula if true, the full text can be a formula without being inside {}.
 * (Only exported for unit tests)
 */
export function tokenizeText(raw:string, implicitFormula?:boolean):TextToken[] {
  implicitFormula = implicitFormula || false;
  const list:TextToken[] = [];

  let start = 0;
  while (start < raw.length) {
    let curly = findNonEscaped(raw, '{', start);
    if (curly < 0) {
      break;
    }

    if (curly > start) {
      // Plain text prior to a formula
      const ttoken:TextToken = {
        text: unescapeBraces(raw.substring(start, curly)),
        formula: false
      };
      list.push(ttoken);  
    }

    let count = 1;
    let inner = curly + 1;
    while (count > 0) {
      let lb = findNonEscaped(raw, '{', inner);
      let rb = findNonEscaped(raw, '}', inner);
      if (rb < 0) {
        throw new BuildError('Mismatched curly braces. No close } for open at position ' + curly + '. Raw: ' + raw);
      }
      if (lb >= 0 && lb < rb) {
        count++;
        inner = lb + 1;
      }
      else {
        count--;
        inner = rb + 1;
      }
    }
    // The contents of the formula (without the {} braces)
    const ftoken:TextToken = {
      text: raw.substring(curly + 1, inner - 1),
      formula: true
    };
    list.push(ftoken);
    start = inner;
  }
  if (start < raw.length) {
    // Any remaining plain text
    const ttoken:TextToken = {
      text: unescapeBraces(raw.substring(start)),
      formula: false
    };
    list.push(ttoken);  
  }
  return list;
}

/**
 * Look up a value, according to the context path cached in an attribute
 * @param path A context path
 * @returns Any JSON object
 */
export function globalContextData(path:string):any {
  const context = theBoilerContext();
  if (path && context) {
    return getKeyedChild(context, path);
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
    const a = evaluateFormula(key);
    // null, undefined, or '' count as not existing
    return a !== null && a !== undefined && a !== '';
    // Note: empty {} and [] do count as existing.
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
  return evaluateFormula(key) as string;
}


/**
 * Get a keyed child of a parent, where the key is either a dictionary key 
 * or a list index or a string offset.
 * @param parent The parent object: a list, object, or string, which could in turn be the name of a list or object
 * @param key The identifier of the child: a dictionary key, a list index, or a string offset
 * @param maybe If true, and key does not work, return ''
 * @returns A child object, or a substring
 */
function getKeyedChild(parent:any, key:string, maybe?:boolean):any {
  // if (typeof(parent) == 'string') {
  //   const obj = valueFromContext(simpleTrim(parent));
  //   if (obj != null) {
  //     parent = obj;
  //   }
  // }

  if (typeof(parent) == 'string') {
    let index:number|undefined = undefined;
    if (typeof(key) == 'number') {
      index = key;
    }
    else if (isIntegerRegex('' + key)) {
      index = parseInt('' + key);
    }
    if (index !== undefined) {
      if (index < 0 || index >= (parent as string).length) {
        if (maybe) {
          return '';
        }
        throw new BuildError('Index out of range: ' + index + ' in ' + parent);
      }
      return (parent as string)[index];
    }
  }

  const trimmed = simpleTrim(key);
  if (!(trimmed in parent)) {
    if (maybe) {
      return '';
    }
    throw new BuildEvalError('getKeyedChild', trimmed);
  }
  return parent[trimmed];
}
