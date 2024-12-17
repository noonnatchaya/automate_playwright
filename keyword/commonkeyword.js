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
    const searchText = empName
    const input = page.locator('#__layout > div > div.d-flex.justify-content-center > div > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div > input');
    await input.waitFor({ state: 'visible' }); // Wait for visibility
    // Fill the input field with text
    await page.waitForTimeout(2000);
    await input.focus();
    await input.click();
    await input.type(searchText, { delay: 500 });
    await page.screenshot({ path: 'searchEmp.png', fullPage: true });
    const element = page.locator('.search-autofill-list > div:nth-child(2)');
    // //Click the first matching element
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

async function searchArea(page,area) {
    const searchText = area;
    await page.getByText('พื้นที่ให้บริการ').click();
    await page.locator('#sidebar-right').press('CapsLock');
    await page.getByPlaceholder('กรุณาระบุจังหวัด').click();
    await page.getByPlaceholder('กรุณาระบุจังหวัด').fill(searchText);
    await page.locator('#vs3__option-0').getByText(searchText).click();
    await page.locator('#sidebar-right').getByRole('button').click();
}

async function addProduct(page) {
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'งานติดตั้ง บริการล้างเครื่องซักผ้าฝาบนอัตโนมัติ <= 15 kg ฿890 / เครื่อง' }).click();
    await page.locator('#cart-button-content').getByRole('img').click();
    await page.getByRole('link', { name: '1', exact: true }).click();
}
async function customerAddress(page,province) {
    await page.getByRole('button', { name: 'เลือกวันรับบริการ' }).click();
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('กรุณาระบุ เขต/อำเภอ, แขวง/ตำบล, จังหวัด, ฯลฯ').click();
    await page.getByPlaceholder('กรุณาระบุ เขต/อำเภอ, แขวง/ตำบล, จังหวัด, ฯลฯ').fill(province);
    await page.getByRole('option', { name: 'อ่างทอง > สามโก้ > ราษฎรพัฒนา >' }).click();
    await page.locator('[id="__BVID__194"]').selectOption('2');
}

async function start_date(date,time) {
    await page.locator('[id="__BVID__194"]').selectOption(time);
    await page.getByText(date, { exact: true }).click();
    
}

async function customer_detail(name,lastname,mobile,email) {
    await page.getByPlaceholder('ชื่อ').click();
    await page.getByPlaceholder('ชื่อ').fill(name);
    await page.getByPlaceholder('นามสกุล').click();
    await page.getByPlaceholder('นามสกุล').fill(lastname);
    await page.locator('#mobile').click();
    await page.locator('#mobile').fill(mobile);
    await page.getByPlaceholder('xxx@gmail.com, etc.').click();
    await page.getByPlaceholder('xxx@gmail.com, etc.').fill(email);
    
}


module.exports = {
    login,
    productSearch,
    empSearch,
    searchArea,
    addProduct,
    customerAddress,
    start_date,
    customer_detail
};