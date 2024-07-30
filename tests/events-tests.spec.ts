import { test, expect } from '@playwright/test';
import { getSafariDetails, initSafariDetails } from '../kit24';

test.beforeEach(async ({ page }) => {
  // Load a blank page
  await page.goto('file:///D:/git/GivingSafariTS/tests/blank.html');
});

test('safariDetails', async ({ page }) => {
  expect(getSafariDetails()).toBeUndefined()

  expect(initSafariDetails('')).toBeTruthy();

  expect(getSafariDetails()).toBeTruthy()
  expect('cssRoot' in getSafariDetails()).toBeTruthy();
});

test('safariDocsDetails', async ({ page }) => {
  expect(getSafariDetails()).toBeUndefined()

  expect(initSafariDetails('Docs').googleFonts).toEqual('Caveat');

  expect(getSafariDetails()).toBeTruthy()
  expect('logo' in getSafariDetails()).toBeTruthy();
  expect(getSafariDetails().title).toEqual('Puzzyl Utility Library');
});