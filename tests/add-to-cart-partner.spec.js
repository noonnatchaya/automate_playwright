const { test, expect } = require('@playwright/test');
const keywords = require('../keyword/commonkeyword');

test('Successful add to cart - Marketplace', async ({ page }) => {
    await keywords.OpenPartnerPage(page)
    await keywords.PartnerSelectProduct(page)
    await keywords.PartnerCustAddress(page,'สีบัวทอง', '11', 'Landmark')
    await keywords.PartnerCustDetail(page, 'MarketplaceAutomated', 'SurveyTest', '0634844124', 'kaefortest@gmail.com')
    await keywords.ConfirmBasedOnConditions(page, 'survey', 'marketplace')
    await keywords.PaidByCreditCard(page, '4111-1111-1111-1111', '12/24', 'AutomatedTest', '123', '123456')
    await keywords.DisplaySuccessPage(page)
});

test('Successful add to cart - Retail', async ({ page }) => {
    await keywords.OpenPartnerPage(page)
    await keywords.PartnerSelectProduct(page)
    await keywords.PartnerCustAddress(page,'สีบัวทอง', '11', 'Landmark')
    await keywords.PartnerCustDetail(page, 'RetailAutomated', 'SurveyTest', '0634844124', 'kaefortest@gmail.com')
    await keywords.PartnerApplyCoupon(page,'retailautomate')
    await keywords.ConfirmBasedOnConditions(page, 'survey', 'retail')
    await keywords.DisplaySuccessPage(page)
});