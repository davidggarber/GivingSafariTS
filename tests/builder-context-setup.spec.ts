import { test, expect } from '@playwright/test';
import { getBuilderContext, popBuilderContext, pushBuilderContext, testBuilderContext, theBoilerContext } from '../kit24';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val))

test.beforeEach(async ({ page }) => {
  // Load a blank page
  // await page.goto('file:///D:/git/GivingSafariTS/tests/blank.html');
});

test('no context', async ({ page }) => {
  expect(testBuilderContext());
  expect(theBoilerContext()).toEqual({})
});

test('blank context', async ({ page }) => {
  expect(testBuilderContext({}));
  expect(theBoilerContext()).toEqual({})
});

test('get context', async ({ page }) => {
  expect(testBuilderContext({sample:true}));
  expect(getBuilderContext()).toEqual({sample:true})
});

test('push context', async ({ page }) => {
  expect(testBuilderContext({outer:true}));
  expect(pushBuilderContext({inner:true})).toEqual({inner:true});
  expect(getBuilderContext()['inner']).toBeTruthy()
  expect(getBuilderContext()['outer']).toBeUndefined();
});

test('push and clone context', async ({ page }) => {
  expect(testBuilderContext({outer:true}));
  expect(pushBuilderContext()).toEqual({outer:true});
});
