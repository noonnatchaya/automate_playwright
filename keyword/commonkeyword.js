// keywords.js

const { expect } = require('@playwright/test');

// Custom keyword to log in
async function login(page,username, password) {
    // Go to login page
    await page.goto('https://sit-business.q-chang.io/login');
    // Fill login form
    await page.fill('input[id="feedback-username"]', username);
    await page.fill('input[id="feedback-password"]', password);
    // Submit form
    await page.click('#login > div');
    await page.screenshot({ path: 'login.png', fullPage: true });
    console.log('Screenshot saved as login.png');
    // Verify login success has title
    await page.waitForTimeout(2000);
    await expect(page.locator('#__layout > div > div.d-flex.justify-content-center > div > div > div > div:nth-child(1) > div > div > div.p-0.title-product-txt.qc-font-size-3xl.col')).toHaveText('จองบริการคิวช่าง');
    
}

async function empSearch(page,empName) {
    const searchText = empName;
    const input = page.locator('#__layout > div > div.d-flex.justify-content-center > div > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div > input');
    await input.waitFor({ state: 'visible' }); // Wait for visibility
    // Fill the input field with text
    await input.focus();
    await input.click();
    await input.type(searchText, { delay: 500 });
    await page.waitForTimeout(5000);
    //await page.pause();
    await page.screenshot({ path: 'searchEmp.png', fullPage: true });
    const element = page.locator('.search-autofill-list > div:nth-child(2)');
    //Click the first matching element
    await element.first().click();
    await page.waitForTimeout(1000);
    console.log('Screenshot saved as searchEmp.png');
}

async function productSearch(page,productname) {
    const searchText = productname;
    const input = page.locator('.position-relative > .search-autofill');
    await input.waitFor({ state: 'visible' });
    await input.focus();
    await input.click();
    await input.type(searchText, { delay: 500 });
}
module.exports = {
    login,
    productSearch,
    empSearch

};