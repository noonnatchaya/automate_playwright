const { test, expect } = require('@playwright/test');
const keywords = require('../keyword/commonkeyword');
test('Successful add to cart', async ({ page }) => {
    await keywords.login(page, 'fangcms4', '12345678t');
    await keywords.empSearch(page, 'ทดสอบ');
    await keywords.productSearch(page, 'เครื่องซักผ้า\n');
    await keywords.searchArea(page, 'อ่างทอง');
    await keywords.addProduct(page);
    await keywords.customer_address(page,'แสวงหา');
    await keywords.cust_detail(page,'qatest','qalastname','0627504107','piggienunoo24@gmail.com');
    await keywords.address_detail(page);
    //await keywords.confirm_customer_order(page)
    await keywords.confirm_order_2(page);
    await keywords.payment_confirm(page);
});