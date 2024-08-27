import { appendRange, consoleComment, expandContents, normalizeName } from "./_builder";
import { cloneAttributes, cloneText } from "./_builderContext";
import { applyAllClasses, getOptionalStyle, isTag, toggleClass } from "./_classUtil";
import { ContextError, debugTagAttrs, traceTagComment, elementSourceOffset, nodeSourceOffset, SourceOffset } from "./_contextError";
import { getLetterStyles } from "./_textSetup";

export const inputAreaTagNames = [
  'letter', 'letters', 'literal', 'number', 'numbers', 'pattern', 'word', 'extract'
];

type SpecialCaseFunction = (attr:string,span:HTMLSpanElement) => void;

type InputAttributeConversion = {
  inherit?: string,        // If present, this conversion extends the named set of conversion rules
  spanRename?: object,     // If any key attribute is present, rename it to the value attribute on the span
  spanClass?: object,      // If any key attribute is present, apply the value as a class on the span
  optionalStyle?: object   // If any key attribute is present, apply one of the optional data styles. First one wins
  specialCases?: object    // If any key attribute is present, call the value as a SpecialCaseFunction
  required?: string,       // If any attribute is required
}
// Note that the same input attribute can be a key in multiple conversion fields.
// For example, it could trigger a spanClass, and also an optional style,
// and also get renamed or special cased. The last two should not coexit.
// Separate from anything keyed explicitly, anything else copies verbatim.

const inputAttributeConversions = {
  '': {
    span: {},
    input: {}
  },
  letter: {
    inherit: '',
    spanClass: {
      '': 'letter-cell',
      block: 'block',
      literal: 'literal',
      extract: 'extract',
    },
    spanRename: {
      'extracted-id': 'data-extracted-id', // Destination of extraction
    },
    optionalStyle: {
      '': 'letter',
      literal: 'literal',
      extract: 'extract'   
    },
    specialCases: {
      extract: underNumberExtracts,  // extracted letter
      literal: specialLiterals,      // literal, read-only
      block: specialLiterals,        // this letter will extract (if a number, then under-numbered)
    }
  },
  letters: {
    inherit: 'letter',
    spanClass: {
      '': 'multiple-letter',  // A few letters, squeezed together
    }
  },
  number: {
    inherit: 'letter',
    spanClass: {
      '': 'numeric',  // Constrain input to decimal digits (or - or .)
    }
  },
  numbers: {
    inherit: 'number',
    spanClass: {
      '': 'multiple-letter',  // Same as letters, but just numbers
    }
  },
  literal: {
    inherit: 'letter',
    spanClass: {
      '': 'literal'
    },
    optionalStyle: {
      '': 'literal',
    },
    specialCases: {
      '': specialLiterals,      // process the inner text
      'block': specialLiterals, // literal rendered as a dark block
    }
  },

  word: {
    inherit: '',
    spanClass: {
      '': 'word-cell',
      literal: 'literal',
      // TODO: numbers (destination)
    },
    spanRename: {
      extract: 'data-extract-index',       // Either letter index, or word.letter index
      'extracted-id': 'data-extracted-id', // Destination of extraction
    },
    specialCases: {
      literal: specialLiterals,
      block: specialLiterals,
    },
    optionalStyle: {
      '': 'word',
    }
  },

  pattern: {
    inherit: '',
    spanClass: {
      '': 'letter-cell-block',
      pattern: 'create-from-pattern',
      extracted:          'create-from-pattern extracted',
      'extract-numbered': 'create-from-pattern extracted',
      'extract-lettered': 'create-from-pattern extracted',
    },
    spanRename: {
      pattern: 'data-letter-pattern',       // A length list
      extract: 'data-extract-indeces',      // An index list of extract indeces
      numbers: 'data-number-assignments',   // A list of index=number pairs
      'extracted-id': 'data-extracted-id',  // Destination of extraction
    // Extracted cases
      extracted: 'data-extracted-pattern',        // same as pattern, but as the extracted target
      'extract-numbered': 'data-extract-numbered',  // each letter is given an under-number
      'extract-lettered': 'data-extract-lettered',  // same as numbered, but under-numbers are alphabetic
    },
  },

  extract: {
    inherit: '',
    spanClass: {
      '': 'extract-literal',
      word: 'word-input',
      letter: 'extract-input',
      letters: 'extract-input',
    },
    spanRename: {
      word: 'value',
      letter: 'value',
      letters: 'value',
    },
    optionalStyle: {
      '': 'hidden',
    }
  },
};

/**
 * If a <letter> has an extract attribute, check if its value is numeric.
 * If so, set up the under-number.
 * @param extract The value of the extract attribute
 * @param span The span that  will contain an input
 */
function underNumberExtracts(extract:string, span:HTMLSpanElement) {
  if (parseInt(extract) > 0) {
    toggleClass(span, 'numbered', true);
    toggleClass(span, 'extract-numbered', true);
    span.setAttributeNS('', 'data-number', extract);
    
    const under = document.createElement('span');
    toggleClass(under, 'under-number');
    under.innerText = extract;
    span.appendChild(under);
  }
}

function specialLiterals(literal:string, span:HTMLSpanElement) {
  if (literal === '¤') {
    toggleClass(span, 'block', true);
    literal = ' ';
  }
  span.appendChild(document.createTextNode(literal));
}

export function startInputArea(src:HTMLElement):Node[] {
  const span = document.createElement('span');
  traceTagComment(src, span, true);

  // Copy most attributes. 
  // Special-cased ones are harmless - no meaning in generic spans
  cloneAttributes(src, span);

  let optionalStyleSet:string|undefined = undefined;
  let conversion:InputAttributeConversion = inputAttributeConversions[src.localName.toLowerCase()];
  while (conversion) {
    // Apply any classes to the span
    if (conversion.spanClass) {
      if (conversion.spanClass['']) {
        applyAllClasses(span, conversion.spanClass['']);
      }
      const keys = Object.keys(conversion.spanClass);
      for (let i = 0; i < keys.length; i++) {
        if (src.getAttributeNS('', keys[i]) !== null) {
          applyAllClasses(span, conversion.spanClass[keys[i]]);
        }
      }
    }
    // Which group of optional styles should be applied. First one wins.
    if (conversion.optionalStyle && !optionalStyleSet) {
      const keys = Object.keys(conversion.optionalStyle);
      for (let i = 0; i < keys.length; i++) {
        if (src.getAttributeNS('', keys[i]) !== null) {
          optionalStyleSet = conversion.optionalStyle[keys[i]];
          break;
        }
      }
      if (!optionalStyleSet && '' in conversion.optionalStyle) {
        optionalStyleSet = conversion.optionalStyle[''] as string;
      }
    }
    // Rename some attributes
    if (conversion.spanRename) {
      const keys = Object.keys(conversion.spanRename);
      for (let i = 0; i < keys.length; i++) {
        const attr = src.getAttributeNS('', keys[i]);
        if (attr !== null) {
          span.setAttributeNS('', conversion.spanRename[keys[i]], cloneText(attr));
        }
      }
    }
    // Some attributes need custom handling
    if (conversion.specialCases) {
      const keys = Object.keys(conversion.specialCases);
      for (let i = 0; i < keys.length; i++) {
        const attr = src.getAttributeNS('', keys[i]);
        if (attr !== null) {
          const func:SpecialCaseFunction = conversion.specialCases[keys[i]] as SpecialCaseFunction;
          func(cloneText(attr), span);
        }
      }
      if ('' in conversion.specialCases && src.innerText.length > 0) {
        // Special case any innerText
        const func:SpecialCaseFunction = conversion.specialCases[''] as SpecialCaseFunction;
        func(cloneText(src.innerText), span);
      }
    }

    // Repeat with any additional inherited rules
    conversion = conversion.inherit ? inputAttributeConversions[conversion.inherit] : undefined;
  }

  if (optionalStyleSet) {
    // This tag accepts one of the groups of optional styles
    let styles = getLetterStyles(src, 'underline', 'none', 'box');
    applyAllClasses(span, styles[optionalStyleSet]);
  }

  if (src.localName !== 'literal' && src.childNodes.length > 0) {
    throw new ContextError('Input tags like <' + src.localName + '/> should be empty elements', nodeSourceOffset(src.childNodes[0]));
  }

  return [span];
}


/**
 * Shortcut tags for text input. These include:
 *  letter: any single character
 *  letters: a few characters, in a single input
 *  literal: readonly single character
 *  number: any numeric digit
 *  numbers: a few numeric digits
 *  word: full multi-character
 *  pattern: multiple inputs, generated from a pattern
 * @param src One of the input shortcut tags
 * @param context A dictionary of all values that can be looked up
 * @returns a node array containing a single <span>
 */
export function startInputArea1(src:HTMLElement):Node[] {
  const span = document.createElement('span');
  traceTagComment(src, span, true);

  // Copy most attributes. 
  // Special-cased ones are harmless - no meaning in generic spans
  cloneAttributes(src, span);


  let cloneContents = false;
  let literal:string|null = null;
  const extract = src.hasAttributeNS('', 'extract') ? cloneText(src.getAttributeNS('', 'extract')) : null;
  
  let styles = getLetterStyles(src, 'underline', 'none', 'box');

  // Convert special attributes to data-* attributes for later text setup
  let attr:string|null;
  if (isTag(src, 'letter')) {  // 1 input cell for (usually) one character
    toggleClass(span, 'letter-cell', true);
    literal = src.getAttributeNS('', 'literal');  // converts letter to letter-literal
  }
  else if (isTag(src, 'letters')) {  // 1 input cell for a few characters
    toggleClass(span, 'letter-cell', true);
    toggleClass(span, 'multiple-letter', true);
    literal = src.getAttributeNS('', 'literal');  // converts letter to letter-literal
  }
  else if (isTag(src, 'literal')) {  // 1 input cell for (usually) one character
    toggleClass(span, 'letter-cell', true);
    literal = ' ';
    cloneContents = true;  // literal value
  }
  else if (isTag(src, 'number')) {  // 1 input cell for one numeric character
    toggleClass(span, 'letter-cell', true);
    toggleClass(span, 'numeric', true);
    literal = src.getAttributeNS('', 'literal');  // converts letter to letter-literal
  }
  else if (isTag(src, 'numbers')) {  // 1 input cell for multiple numeric digits
    toggleClass(span, 'letter-cell', true);
    toggleClass(span, 'multiple-letter', true);
    toggleClass(span, 'numeric', true);
    // To support longer (or negative) numbers, set class = 'multiple-letter'
    literal = src.getAttributeNS('', 'literal');  // converts letter to letter-literal
  }
  else if (isTag(src, 'word')) {  // 1 input cell for one or more words
    toggleClass(span, 'word-cell', true);
    if (attr = src.getAttributeNS('', 'extract')) {
      // attr should be 1 or more numbers (separated by spaces), detailing which letters to extract
      span.setAttributeNS('', 'data-extract-index', cloneText(attr));
    }
    if (attr = src.getAttributeNS('', 'extracted-id')) {
      span.setAttributeNS('', 'data-extracted-id', cloneText(attr));
    }
    if (attr = src.getAttributeNS('', 'literal')) {
      toggleClass(span, 'literal', true);
      span.innerText = cloneText(attr);
    }
  }
  else if (isTag(src, 'extract')) {
    // Backdoor way to inject literals into extraction.
    // They can have rules too.
    // Don't specify a *-cell, since we don't actually need an <input>
    span.style.display = 'none';
    toggleClass(span, 'extract-literal', true);
    if (attr = src.getAttributeNS('', 'word')) {
      toggleClass(span, 'word-input', true);
      span.setAttributeNS('', 'value', attr);
    }
    else if (attr = src.getAttributeNS('', 'letter') || src.getAttributeNS('', 'letters')) {  // can be multiple letters
      toggleClass(span, 'extract-input', true);
      span.setAttributeNS('', 'value', attr);
    }
    // Other styles, especially data-*, have already copied across
  }
  else if (isTag(src, 'pattern')) {  // multiple input cells for (usually) one character each
    toggleClass(span, 'letter-cell-block', true);
    if (attr = src.getAttributeNS('', 'pattern')) {  // Pattern for input
      toggleClass(span, 'create-from-pattern', true);
      span.setAttributeNS('', 'data-letter-pattern', cloneText(attr));
    }
    else if (attr = src.getAttributeNS('', 'extract-numbers')) {  // Pattern for #extracted with numbers
        span.setAttributeNS('', 'data-number-pattern', cloneText(attr));
    }
    else if (attr = src.getAttributeNS('', 'extract-pattern')) {  // Pattern for the #extracted target
      span.setAttributeNS('', 'data-letter-pattern', cloneText(attr));
      span.setAttributeNS('', 'data-indexed-by-letter', '');
    }
    if (attr = src.getAttributeNS('', 'extract')) {  // Extraction indeces
      span.setAttributeNS('', 'data-extract-indeces', cloneText(attr));
    }
    if (attr = src.getAttributeNS('', 'numbers')) {  // Extraction with under-numbers
      span.setAttributeNS('', 'data-number-assignments', cloneText(attr));
    }
  }
  else {
    return [src];  // Unknown tag. NYI?
  }

  let block = src.getAttributeNS('', 'block');  // Used in grids
  if (block) {
    toggleClass(span, 'block', true);
    literal = literal || block;
  }

  if (literal == '¤') {  // Special case (and back-compat)
    toggleClass(span, 'block', true);
    literal = ' ';
  }
  
  if (literal) {
    if (!cloneContents) {
      span.innerText = cloneText(literal);  
    }
    toggleClass(span, 'literal', true);
    applyAllClasses(span, styles.literal);
  }      
  else if (!isTag(src, 'pattern')) {
    if (!isTag(src, 'word')) {
      applyAllClasses(span, styles.letter);
    }
    if (extract != null) {
      toggleClass(span, 'extract', true);
      if (parseInt(extract) > 0) {
        toggleClass(span, 'numbered', true);
        toggleClass(span, 'extract-numbered', true);
        span.setAttributeNS('', 'data-number', extract);
        
        const under = document.createElement('span');
        toggleClass(under, 'under-number');
        under.innerText = extract;
        span.appendChild(under);
      }
      applyAllClasses(span, styles.extract);
    }
  }

  if (cloneContents) {
    appendRange(span, expandContents(src));
  }
  else if (src.childNodes.length > 0) {
    throw new ContextError('Input tags like <' + src.localName + '/> should be empty elements', nodeSourceOffset(src.childNodes[0]));
  }

  return [span];
}
