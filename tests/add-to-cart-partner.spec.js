const { test, expect } = require('@playwright/test');
const keywords = require('../keyword/commonkeyword');

test('Successful add to cart', async ({ page }) => {
    await keywords.open_partner_page(page)
    await keywords.partner_select_product(page)
    await keywords.partner_cust_address(page,'สีบัวทอง', '11', 'Landmark')
    await keywords.partner_cust_detail(page, 'AutomatedTest', 'QATest', '0634843441', 'kaefortest@gmail.com')
    await keywords.partner_confirm_order(page)
    await keywords.pay_by_credit_card_2c2p(page, '4111-1111-1111-1111', '12/24', 'AutomatedTest', '123', '123456')
});