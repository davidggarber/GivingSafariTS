import { expandContents } from "./_builder";
import { anyFromContext, cloneText, keyExistsInContext, textFromContext } from "./_builderContext";
import { BuildError, BuildHtmlError, BuildTagError } from "./_builderError";
import { isTag } from "./_classUtil";

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
        throw new BuildError(src.tagName + ' without preceding <if>');
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

    let exists = src.getAttributeNS('', 'exists');
    let notex = src.getAttributeNS('', 'notex');
    let not = src.getAttributeNS('', 'not');
    let test = src.getAttributeNS('', 'test');

    if (isTag(src, 'else')) {
      result.passed = true;
    }
    else if (exists || notex) {
      // Does this attribute exist at all?
      result.passed = (exists != null && keyExistsInContext(exists)) || (notex != null && !keyExistsInContext(notex));
    }
    else if (not) {
      test = textFromContext(not); 
      result.passed = test !== 'true';
    }
    else if (test) {
      test = textFromContext(test); 

      let value:string|null;
      if (value = src.getAttributeNS('', 'eq')) {  // equality
        result.passed = test == cloneText(value);
      }
      else if (value = src.getAttributeNS('', 'ne')) {  // not-equals
        result.passed = test != cloneText(value);
      }
      else if (value = src.getAttributeNS('', 'lt')) {  // less-than
        result.passed = parseFloat(test) < parseFloat(cloneText(value));
      }
      else if (value = src.getAttributeNS('', 'le')) {  // less-than or equals
        result.passed = parseFloat(test) <= parseFloat(cloneText(value));
      }
      else if (value = src.getAttributeNS('', 'gt')) {  // greater-than
        result.passed = parseFloat(test) > parseFloat(cloneText(value));
      }
      else if (value = src.getAttributeNS('', 'ge')) {  // greater-than or equals
        result.passed = parseFloat(test) >= parseFloat(cloneText(value));
      }
      else if (value = src.getAttributeNS('', 'in')) {  // string contains
        result.passed = cloneText(value).indexOf(test) >= 0;
      }
      else if (value = src.getAttributeNS('', 'ni')) {  // string doesn't contain
        result.passed = cloneText(value).indexOf(test) < 0;
      }
      else if (value = src.getAttributeNS('', 'regex')) {  // regular expression
        const re = new RegExp(value);
        result.passed = re.test(test);
      }
      else {  // simple boolean
        result.passed = test === 'true';
      }
    }
    else {
      throw new BuildHtmlError('<' + src.localName + '> elements must have an evaluating attribute: test, not, exists, or notex', src);
    }
  }
  catch (ex) {
    throw new BuildTagError('startIfBlock', src, ex);
  }

  if (result.passed) {
    return expandContents(src);
  }
  
  return [];
}

