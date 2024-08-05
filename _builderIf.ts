import { expandContents } from "./_builder";
import { evaluateAttribute, keyExistsInContext, makeFloat } from "./_builderContext";
import { isTag } from "./_classUtil";
import { ContextError, elementSourceOffset, elementSourceOffseter, wrapContextError } from "./_contextError";

export type ifResult = {
  passed:boolean;
  index:number;
}

/**
 * Potentially several kinds of if expressions:
 *   equality: <if test="var" eq="value">  
 *   not-equality: <if test="var" ne="value">  
 *   less-than: <if test="var" lt="value">  
 *   less-or-equal: <if test="var" le="value">  
 *   greater-than: <if test="var" gt="value">  
 *   greater-or-equal: <if test="var" ge="value">  
 *   contains: <if test="var" in="value">  
 *   not-contains: <if test="var" ni="value">  
 *   boolean: <if test="var">
 * @param src the <if>, <elseif>, or <else> element
 * @param result in/out parameter that determines whether any sibling in a sequence of if/else-if/else tags has passed yet
 * @returns a list of nodes, which will replace this <if> element
 */
export function startIfBlock(src:HTMLElement, result:ifResult):Node[] {
  try {
    
    if (isTag(src, 'if')) {
      result.index = 1;
      // Each <if> tag resets the group's passed state
      result.passed = false;
    }
    else {
      if (result.index < 1) {
        throw new ContextError(src.tagName + ' without preceding <if>', elementSourceOffset(src));
      }
      if (isTag(src, 'else')) {
        result.index = -result.index;
      }
      else {
        result.index++;
      }
      if (result.passed) {
        // A prior sibling already passed, so all subsequent elseif and else blocks should abort.
        return [];
      }
    }

    let exists = evaluateAttribute(src, 'exists', false, false);
    let notex = evaluateAttribute(src, 'notex', false, false);
    let not = evaluateAttribute(src, 'not', true, false);
    let test = evaluateAttribute(src, 'test', true, false);

    if (isTag(src, 'else')) {
      result.passed = true;
    }
    else if (exists || notex) {
      // Does this attribute exist at all?
      result.passed = (exists != null && keyExistsInContext(exists)) || (notex != null && !keyExistsInContext(notex));
    }
    else if (not) {
      result.passed = (not === 'false') || (not === '') || (not === null);
    }
    else if (test) {
      const testTok = elementSourceOffseter(src, 'test');

      let value:string|null;
      if (value = evaluateAttribute(src, 'eq', false, false)) {
        result.passed = test === value;  // REVIEW: no casting of either
      }
      else if (value = evaluateAttribute(src, 'ne', false, false)) {  // not-equals
        result.passed = test !== value;  // REVIEW: no casting of either
      }
      else if (value = evaluateAttribute(src, 'lt', false, false)) {  // less-than
        result.passed = makeFloat(test, testTok) < makeFloat(value, elementSourceOffseter(src, 'lt'));
      }
      else if (value = evaluateAttribute(src, 'le', false, false)) {  // less-than or equals
        result.passed = makeFloat(test, testTok) <= makeFloat(value, elementSourceOffseter(src, 'le'));
      }
      else if (value = evaluateAttribute(src, 'gt', false, false)) {  // greater-than
        result.passed = makeFloat(test, testTok) > makeFloat(value, elementSourceOffseter(src, 'gt'));
      }
      else if (value = evaluateAttribute(src, 'ge', false, false)) {  // greater-than or equals
        result.passed = makeFloat(test, testTok) >= makeFloat(value, elementSourceOffseter(src, 'ge'));
      }
      else if (value = evaluateAttribute(src, 'in', false, false)) {  // string contains
        if (Array.isArray(value)) {
          result.passed = value.indexOf(test) >= 0;
        }
        else if (typeof(value) === 'string') {
          result.passed = value.indexOf(test) >= 0;
        }
        else if (typeof(value) === 'object') {
          result.passed = test in value;
        }
        else {
          throw new ContextError(typeof(value) + " value does not support 'in' queries", elementSourceOffset(src, 'in'));
        }
      }
      else if (value = evaluateAttribute(src, 'ni', false, false)) {  // string doesn't contain
        if (Array.isArray(value)) {
          result.passed = value.indexOf(test) < 0;
        }
        else if (typeof(value) === 'string') {
          result.passed = value.indexOf(test) < 0;
        }
        else if (typeof(value) === 'object') {
          result.passed = !(test in value);
        }
        else {
          throw new ContextError(typeof(value) + " value does not support 'not-in' queries", elementSourceOffset(src, 'in'));
        }
      }
      else if (value = evaluateAttribute(src, 'regex', false, false)) {  // regular expression
        const re = new RegExp(value);
        result.passed = re.test(test);
      }
      else {  // simple boolean
        result.passed = test === 'true';
      }
    }
    else {
      throw new ContextError('<' + src.localName + '> elements must have an evaluating attribute: test, not, exists, or notex');
    }
  }
  catch (ex) {
    throw wrapContextError(ex, 'startIfBlock', elementSourceOffset(src));
  }

  if (result.passed) {
    return expandContents(src);
  }
  
  return [];
}

