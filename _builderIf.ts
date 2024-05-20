import { expandContents } from "./_builder";
import { anyFromContext, cloneText, keyExistsInContext, textFromContext } from "./_builderContext";

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
 * Note there is no else or else-if block, because there are no scoping blocks
 * @param src the <if> element
 * @param context the set of values that might get used by or inside the if block
 * @returns a list of nodes, which will replace this <if> element
 */
export function startIfBlock(src:HTMLElement):Node[] {
  let exists = src.getAttributeNS('', 'exists');
  let notex = src.getAttributeNS('', 'not');
  if (exists || notex) {
    // Does this attribute exist at all?
    if ((exists && keyExistsInContext(exists)) || (notex && !keyExistsInContext(notex))) {
      return expandContents(src);
    }
    return [];
  }

  let test = src.getAttributeNS('', 'test');
  if (!test) {
    throw new Error('<if> tags must have a test attribute');
  }
  test = textFromContext(test); 

  let pass:boolean = false;
  let value:string|null;
  if (value = src.getAttributeNS('', 'eq')) {  // equality
    pass = test == cloneText(value);
  }
  else if (value = src.getAttributeNS('', 'ne')) {  // not-equals
    pass = test != cloneText(value);
  }
  else if (value = src.getAttributeNS('', 'lt')) {  // less-than
    pass = parseFloat(test) < parseFloat(cloneText(value));
  }
  else if (value = src.getAttributeNS('', 'le')) {  // less-than or equals
    pass = parseFloat(test) <= parseFloat(cloneText(value));
  }
  else if (value = src.getAttributeNS('', 'gt')) {  // greater-than
    pass = parseFloat(test) > parseFloat(cloneText(value));
  }
  else if (value = src.getAttributeNS('', 'ge')) {  // greater-than or equals
    pass = parseFloat(test) >= parseFloat(cloneText(value));
  }
  else if (value = src.getAttributeNS('', 'in')) {  // string contains
    pass = cloneText(value).indexOf(test) >= 0;
  }
  else if (value = src.getAttributeNS('', 'ni')) {  // string doesn't contain
    pass = cloneText(value).indexOf(test) >= 0;
  }
  else {  // simple boolean
    pass = test === 'true';
  }

  if (pass) {
    // No change in context from the if
    return expandContents(src);
  }
  
  return [];
}

