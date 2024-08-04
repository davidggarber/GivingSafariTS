import { test, expect } from '@playwright/test';
import { tokenizeText, testBuilderContext, valueFromContext, tokenizeFormula, FormulaNode, treeifyFormula, evaluateFormula, complexAttribute } from '../_builderContext';
import { ContentOffset, ContextError, isContextError } from '../_contextError';

function nothrowTokenizeText(raw:string):boolean {
  try {
    tokenizeText(raw);
    return true;
  }
  catch (ex) {
    return false;
  }
}

function catchTokenizeText(raw:string):ContentOffset|null {
  try {
    tokenizeText(raw);
    return null;
  }
  catch (ex) {
    if (isContextError(ex)) {
      return (ex as ContextError).contentStack[0];
    }
    return null;
  }
}

test('matched curlies', () => {
  expect(nothrowTokenizeText('{num}')).toBeTruthy();
  expect(nothrowTokenizeText('no curlies')).toBeTruthy();
});

test('mis-matched curlies', () => {
  expect(catchTokenizeText(' {started')?.offset).toEqual(1);
  expect(catchTokenizeText('ended}')?.offset).toEqual(5);
  expect(catchTokenizeText('{escaped`}')?.offset).toEqual(0);
});
