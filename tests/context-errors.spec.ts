import { test, expect } from '@playwright/test';
import { ContentOffset, ContextError, wrapContextError } from '../_contextError';

function mayday(msg:string) {
  throw new ContextError(msg);
}

function alpha() {
  try {
    mayday('oops');
  }
  catch (ex) {
    const token:ContentOffset = {content:'testing', offset:3};
    throw wrapContextError(ex, 'alpha', undefined, token);
  }
}


test('explicit context error', () => {
  try {
    throw alpha();
  }
  catch (ex) {
    console.log(ex.toString());
  }
});
