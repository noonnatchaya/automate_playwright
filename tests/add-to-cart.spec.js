const { test, expect } = require('@playwright/test');
const keywords = require('../keyword/commonkeyword');
test('Successful add to cart', async ({ page }) => {
    await keywords.login(page, 'fangcms4', '12345678t');
    await keywords.empSearch(page, 'ทดสอบ');
    await keywords.productSearch(page, 'เครื่องซักผ้า\n');
    await keywords.searchArea(page, 'อ่างทอง');
    await keywords.addProduct(page);
    await keywords.customerAddress('อ่างทอง');
    await keywords.start_date('25','2');
    await keywords.customer_detail('qatest','qalastname','0627504107','piggienunoo24@gmail.com')
});