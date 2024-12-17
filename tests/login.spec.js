const { test, expect } = require('@playwright/test');
const keywords = require('../keyword/commonkeyword');

test('Successful login', async ({ page }) => {
    await keywords.login(page, 'fangcms4', '12345678t');
});