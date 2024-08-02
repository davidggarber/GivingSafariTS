import { test, expect } from '@playwright/test';
import { tokenizeText, complexAttribute, testBuilderContext, valueFromContext, tokenizeFormula, buildFormulaNodeTree, FormulaNode } from '../_builderContext';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val))

test.beforeEach(() => {
  expect(testBuilderContext({
    num: 1234,
    fonts: [ 'bold', 'italic' ],
    sentence: 'Unit tests are the best!',
    pt: { x: 3, y: 5 },
    nest: { alpha: { bravo: 1, charlie: 'delta' }, echo: { foxtrot: { golf: 'hotel' } } }
  }));
});

test('value', () => {
  expect(valueFromContext('num')).toEqual(1234);
});

function testTokenizeText(input:string, texts:string[], formulas:boolean[]) {
  expect(tokenizeText(input).map(t=>t.text)).toEqual(texts);
  expect(tokenizeText(input).map(t=>t.formula)).toEqual(formulas);
}

test('tokenizeText', () => {
  // 1 text token
  testTokenizeText('num', ['num'], [false]);

  // 1 formula token
  testTokenizeText('{num}', ['num'], [true]);

  // formula+text+formula
  testTokenizeText('{num} {pt}', ['num',' ','pt'], [true,false,true]);

  // escaped braces
  testTokenizeText('`{num`}', ['{num}'], [false]);

  // escaped and real braces
  testTokenizeText('`{{num}`}', ['{','num','}'], [false,true,false]);

  // escaped escapes and braces
  testTokenizeText('```{num```}', ['`{num`}'], [false]);

  // escaped escapes and real braces
  testTokenizeText('``{num}', ['`','num'], [false,true]);

  // nested braces
  testTokenizeText('{pt.{x}}', ['pt.{x}'], [true]);

});

const tokenShorthand = {
  '!':0x1,  // sub-types of operator, when we get to that
  '+':0x2,
  '.':0x4,
  '?':0x7,
  '[':0x10,
  ']':0x20,
  '|':0x30,
  't':0x100,
}

/**
 * Helper for testing a formula tokenization
 * @param input The raw formula to tokenize
 * @param texts A sequence of tokens' text, presented as a single string separated by commas
 * @param tokens A sequence of tokens' types, presented as shorthand (see above)
 */
function testTokenizeFormula(input:string, texts:string, tokens:string) {
  expect(tokenizeFormula(input).map(t=>t.text)).toEqual(texts.split(','));
  expect(tokenizeFormula(input).map(t=>t.type)).toEqual(tokens.split('').map(ch => tokenShorthand[ch]));
}

test('tokenizeFormula', () => {
  // 1 text token
  testTokenizeFormula('num', 'num', 't');

  // binary operator
  testTokenizeFormula('num+3', 'num,+,3', 't+t');

  // whitespace is preserved at this first level, attached to adjacent text
  testTokenizeFormula(' num + 3 ', ' num ,+, 3 ', 't+t');

  // unary operator
  testTokenizeFormula('-num', '-,num', '!t');

  // unary operator after binary
  testTokenizeFormula('2*-num', '2,*,-,num', 't+!t');

  // stacked unary operators
  testTokenizeFormula('--2----num', '-,-,2,-,-,-,-,num', '!!t+!!!t');

  // several binary operators
  testTokenizeFormula('num+3*num\\5%10', 'num,+,3,*,num,\\,5,%,10', 't+t+t+t+t');

  // various brackets
  testTokenizeFormula('(aa+[bb-3]*(cc/4))', '(,aa,+,[,bb,-,3,],*,(,cc,/,4,),)', '[t+[t+t]+[t+t]]');

  // quotes
  testTokenizeFormula('"abc"&\'def\'', '",abc,",&,\',def,\'', '[t]+[t]');

  // escaped quotes
  testTokenizeFormula('`"abc`"&`\'def`\'', '"abc",&,\'def\'', 't+t');

  // escaped brackets
  testTokenizeFormula('"`(abc`)"&\'`[def`]\'', '",(abc),",&,\',[def],\'', '[t]+[t]');

  // brackets and operators in quotes
  testTokenizeFormula('"(abc)"&\'[d"e+f]\'', '",(abc),",&,\',[d"e+f],\'', '[t]+[t]');

});

/**
 * Helper for testing tree formation: rearrange an infix formula to prefix.
 * @param node A root/branch/leaf of a binary tree
 * @returns A list, starting with this node's value, then any left branch (recursive), then any right branch (recursive)
 */
function depthFirstValues(node:FormulaNode):string[] {
  const list:string[] = [node.value];
  if (node.left) {
    list.push(...depthFirstValues(node.left));
  }
  if (node.right) {
    list.push(...depthFirstValues(node.right));
  }
  return list;
}

/**
 * Test building a formula into a tree.
 * @param raw The original formula
 * @param prefix A prefix notation (aka depth first) expression of the tree, with terms separated by commas
 */
function testBuildFormulaNodeTree(raw:string, prefix:string) {
  const tokens = tokenizeFormula(raw);
  const tree = buildFormulaNodeTree(tokens);
  expect(tree.value).toEqual(prefix.split(',')[0]);
  const dfv = depthFirstValues(tree).join(',');
  expect(dfv).toEqual(prefix);

}

test('buildFormulaNodeTree', () => {
  // Simple string
  testBuildFormulaNodeTree("hello", 'hello');

  // Simple number
  testBuildFormulaNodeTree("321", '321');

  // Binary operation
  testBuildFormulaNodeTree("num*10", '*,num,10');

  // Unary operation
  testBuildFormulaNodeTree("-10", '-,10');

  // Multiple operations
  testBuildFormulaNodeTree("num*-10", '*,num,-,10');

});

// test('cloneAttributes', async ({ page }) => {
//   expect(complexAttribute('num')).toEqual(1234);
//   expect(complexAttribute('fonts')).toEqual(['bold','italic']);
//   expect(complexAttribute('pt')).toEqual({ x: 3, y: 5 });
// });
