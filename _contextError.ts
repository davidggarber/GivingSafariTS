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
  public contentStack: SourceOffset[];

  /**
   * Create a new BuildError (or derived error)
   * @param msg The message of the Error
   * @param source Indicates which source text specifically triggered this error
   * @param inner The inner/causal error, if any
   */
  constructor(msg: string, source?:SourceOffset, inner?:Error) {
    super(msg);
    this.name = 'ContextError';
    this.cause = inner;
    this.elementStack = [];
    this.functionStack = [];
    this.contentStack = [];

    if (source) {
      this.contentStack.push(source);
    }
  }

  toString(): string {
    const msg = 'ContextError: ' + this.message;
    let str = msg;

    if (this.contentStack.length > 0) {
      for (let i = 0; i < this.contentStack.length; i++) {
        const c = this.contentStack[i];
        str += '\n' + c.source;
        if (c.offset !== undefined) {
          str += '\n' + Array(c.offset + 1).join(' ') + '^';
          if (c.length && c.length > 1) {
            str += Array(c.length).join('^');
          }
        }
      }
    }

    if (this.callStack) {
      if (this.callStack.substring(0, msg.length) == msg) {
        this.callStack = this.callStack.substring(msg.length).trimStart();
      }
      str += '\n' + this.callStack;
    }

    if (this.cause) {
      str += '\nCaused by: ' + this.cause;
    }

    if (this.elementStack.length > 0) {
      str += "\nSource page's element stack:";
      for (let i = 0; i < this.elementStack.length; i++) {
        str += ' ' + tagWithAttrs(this.elementStack[i]);
      }
    }

    // if (this.functionStack.length > 0) {
    //   str += "\nBuild functions stack:";
    //   for (let i = 0; i < this.functionStack.length; i++) {
    //     str += '\n    ' + this.functionStack[i];
    //   }
    // }

    return str;
  }
}

/**
 * Type predicate to separate ContextErrors from generic errors.
 * @param err Any error
 * @returns true if it is a ContextError
 */
export function isContextError(err:Error|ContextError): err is ContextError {
  return err instanceof ContextError;
}

/**
 * Recreate the start tag for this element, without including its children/contents
 * @param elmt Any HTML element
 * @returns A <tag with='attributes'>
 */
function tagWithAttrs(elmt:Element): string {
  let str = '<' + elmt.localName;
  for (let i = 0; i < elmt.attributes.length; i++) {
    str += ' ' + elmt.attributes[i].name + '="' + elmt.attributes[i].value + '"';
  }
  if (elmt.childNodes.length == 0) {
    str += ' /';  // show as empty tag
  }
  str += '>';  // close tag
  return str;
}


/**
 * Add additional information to a context error.
 * @param inner Another exception, which has just been caught.
 * @param func The name of the current function (optional).
 * @param elmt The name of the current element in the source doc (optional)
 * @returns If inner is already a ContextError, returns inner, but now augmented.
 * Otherwise creates a new ContextError that wraps inner.
 */
export function wrapContextError(inner:Error, func?:string, elmt?:Element, content?:SourceOffset) {
  let ctxErr:ContextError;
  if (isContextError(inner)) {
    ctxErr = inner as ContextError;
    // Cache this callstack, in case re-throwing changes it
    ctxErr.callStack = inner.stack
  }
  else {
    ctxErr = new ContextError(inner.name + ': ' + inner.message, undefined, inner);
  }

  const cerr = inner as ContextError;
  if (elmt) {
    ctxErr.elementStack.push(elmt);
  }
  if (func) {
    ctxErr.functionStack.push(func);
  }
  if (content) {
    ctxErr.contentStack.push(content);
  }
  return ctxErr;
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