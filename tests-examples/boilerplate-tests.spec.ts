import { test, expect } from '@playwright/test';
import { BoilerPlateData, testBoilerplate } from '../kit24';

test('no boilerplate', async ({ page }) => {
  await page.goto('file:///D:/git/GivingSafariTS/tests/test.html');
  const bp:BoilerPlateData = {
  };

  expect(testBoilerplate(bp))

});