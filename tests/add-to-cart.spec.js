const { test, expect } = require('@playwright/test');
const keywords = require('../keyword/commonkeyword');
test('Successful add to cart', async ({ page }) => {
    await keywords.login(page, 'fangcms4', '12345678t');
    await keywords.empSearch(page, 'ทดสอบ');
    await keywords.productSearch(page, 'เครื่องซักผ้า\n');
});