import { off } from "process";
import { _rawHtmlSource } from "./_boilerplate";

export type SourceOffset = {
  source:string;
  offset?:number;
  length?:number;
}

/**
 * Custom error which can track nested exceptions
 */
export class ContextError extends Error {
  public cause: Error|undefined;
  public callStack: string|undefined;
  public elementStack: Element[];
  public functionStack: string[];
  public sourceStack: SourceOffset[];

  /**
   * Create a new BuildError (or derived error)
   * @param msg The message of the Error
   * @param source Indicates which source text specifically triggered this error
   * @param inner The inner/causal error, if any
   */
  constructor(msg: string, source?:SourceOffsetable, inner?:Error) {
    super(msg);
    this.name = 'ContextError';
    this.cause = inner;
    this.functionStack = [];
    this.sourceStack = [];
    this.callStack = '';

    if (source) {
      if (typeof(source) == 'function') {
        this.sourceStack.push(source());
      }
      else {
        this.sourceStack.push(source);
      }
    }
  }

  _cacheCallstack():void {
    if (this.callStack === '') {
      this.callStack = this.cause ? this.cause.stack : this.stack;

      if (this.callStack?.substring(0, this.message.length) == this.message) {
        this.callStack = this.callStack.substring(this.message.length);  // REVIEW: trim \n ?
      }
    }
  }
}

/**
 * Type predicate to separate ContextErrors from generic errors.
 * @param err Any error
 * @returns true if it is a ContextError
 */
export function isContextError(err:Error|ContextError): err is ContextError {
  //return err instanceof ContextError;
  return err.name === 'ContextError';
}

/**
 * Instead of creating a source offset every time, anticipating an exception
 * that rarely gets thrown, instead pass a lambda.
 */
type SourceOffseter = () => SourceOffset;

/**
 * Methods generally take either flavor: SourceOffset or SourceOffseter
 */
export type SourceOffsetable = SourceOffset|SourceOffseter;

/**
 * Add additional information to a context error.
 * @param inner Another exception, which has just been caught.
 * @param func The name of the current function (optional).
 * @param elmt The name of the current element in the source doc (optional)
 * @param src The source offset that was being evaluated
 * @returns If inner is already a ContextError, returns inner, but now augmented.
 * Otherwise creates a new ContextError that wraps inner.
 */
export function wrapContextError(inner:Error, func?:string, src?:SourceOffsetable) {
  let ctxErr:ContextError;
  if (isContextError(inner)) {
    ctxErr = inner as ContextError;
  }
  else {
    ctxErr = new ContextError(inner.name + ': ' + inner.message, undefined, inner);
  }

  // Cache callstack
  if (ctxErr.callStack === '') {
    ctxErr.callStack = ctxErr.cause ? ctxErr.cause.stack : ctxErr.stack;

    if (ctxErr.callStack?.substring(0, ctxErr.message.length) == ctxErr.message) {
      ctxErr.callStack = ctxErr.callStack.substring(ctxErr.message.length);  // REVIEW: trim \n ?
    }
  }

  if (func) {
    ctxErr.functionStack.push(func);
  }
  if (src) {
    if (typeof(src) == 'function') {
      src = src() as SourceOffset;
    }
    ctxErr.sourceStack.push(src);
  }

  makeBetterStack(ctxErr);

  return ctxErr;
}

/**
 * Once we've added context to the exception, update the stack to reflect it
 */
function makeBetterStack(err:ContextError):void {
  const msg = 'ContextError: ' + err.message;
  let str = msg;

  if (err.sourceStack.length > 0) {
    for (let i = 0; i < err.sourceStack.length; i++) {
      const c = err.sourceStack[i];
      str += '\n' + c.source;
      if (c.offset !== undefined) {
        str += '\n' + Array(c.offset + 1).join(' ') + '^';
        if (c.length && c.length > 1) {
          str += Array(c.length).join('^');
        }
      }
    }
  }

  if (err.callStack) {
    str += '\n' + err.callStack;
  }

  if (err.cause) {
    str += '\nCaused by: ' + err.cause;
  }

  // if (err.functionStack.length > 0) {
  //   str += "\nBuild functions stack:";
  //   for (let i = 0; i < err.functionStack.length; i++) {
  //     str += '\n    ' + err.functionStack[i];
  //   }
  // }

  err.stack = str;
}

/**
 * Recreate the source for a tag. Then pinpoint the offset of a desired attribute.
 * @param elmt An HTML tag
 * @param attr A specific attribute, whose value is being evaluated.
 * @returns A source offset, built on the recreation
 */
export function elementSourceOffset(elmt:Element, attr?:string):SourceOffset {
  let str = '<' + elmt.localName;
  let offset = 0;
  let length = 0;

  for (let i = 0; i < elmt.attributes.length; i++) {
    const name = elmt.attributes[i].name;
    const value = elmt.attributes[i].value;
    if (name === attr) {
      offset = str.length + name.length + 3; // The start of the value
      length = value.length;
    }
    str += ' ' + elmt.attributes[i].name + '="' + elmt.attributes[i].value + '"';
  }

  if (attr && offset == 0) {
    // Never found the attribute we needed. Highlight the element name
    offset = 1;
    length = elmt.localName.length;
  }

  if (elmt.childNodes.length == 0) {
    str += ' /';  // show as empty tag
  }
  str += '>';  // close tag
  
  if (offset == 0) {
    length = str.length;  // Full tag
  }

  const tok:SourceOffset = { source: str, offset: offset, length: length };
  return tok;
}

/**
 * Instead of creating a source offset every time, anticipating an exception
 * that rarely gets thrown, instead pass a lambda.
 */
export function elementSourceOffseter(elmt:Element, attr?:string): SourceOffseter {
  return () => { return elementSourceOffset(elmt, attr); };
}

/**
 * A code error has no additional fields.
 * It just acknowledges that the bug is probably the code's fault, and not the raw inputs's.
 */
export class CodeError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'CodeError';
  }
}