const { expect } = require('@playwright/test');
const locators = require('../repository/commonRepository.json')
// Custom keyword to log in
async function login(page,username, password) {
    // Go to login page
    await page.goto('https://sit-business.q-chang.io/login');
    // Fill login form
    await page.fill(locators.loginPage.usernameField, username);
    await page.fill(locators.loginPage.passwordField, password);
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
    await input.type(searchText, { delay: 200 });
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
    await input.type(searchText, { delay: 200 });
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
    await page.getByRole('link', { name: 'งานติดตั้ง บริการล้างเครื่องซักผ้าฝาหน้าอัตโนมัติ <= 15 kg ฿2,500 / เครื่อง' }).click();
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'จองบริการ' }).click();
    await page.waitForTimeout(5000)
    await page.getByRole('button', { name: 'เลือกวันรับบริการ' }).click();
    await page.waitForTimeout(1000)
    //await page.pause();
}
async function customer_address(page,province) {
    const searchText = province;
    await page.locator('input[placeholder="กรุณาระบุ เขต/อำเภอ, แขวง/ตำบล, จังหวัด, ฯลฯ"]');
    await page.fill('input[placeholder="กรุณาระบุ เขต/อำเภอ, แขวง/ตำบล, จังหวัด, ฯลฯ"]',searchText,{ delay: 200 });
    await page.locator('.vs__dropdown-option--highlight').click();
    await page.waitForTimeout(10000)
    //await page.getByText('30', { exact: true }).click();
}

async function start_date(page,targetDate) {
    const targetDate = '30'; // Replace with your desired date
    const dateXPath = `//span[contains(@class, 'cell') and not(contains(@class, 'disabled')) and text()='${targetDate}']`;
  // Check if the target date is available and clickable
    const isDateAvailable = await page.locator(dateXPath).count();

    if (isDateAvailable > 0) {
    // Click on the target date
    await page.locator(dateXPath).click();
    console.log(`Successfully selected the date: ${targetDate}`);
    } else {
    console.error(`The date ${targetDate} is not available or is disabled.`);
    }
    }

async function cust_detail(page,name,lastname,mobile,email) {
    const customer_name=name;
    const customer_last=lastname;
    const customer_phone=mobile;
    const customer_email=email;
    // Locate the element using XPath or a CSS selector
    const input = page.locator('//*[@id="firstname"]');
    // Scroll the element into view if it's not already visible
    await input.scrollIntoViewIfNeeded();
    // Now you can interact with the element (e.g., click, fill)
    await input.click();
    await input.fill(customer_name, { delay: 200 });
    await page.getByPlaceholder('นามสกุล').click();
    await page.getByPlaceholder('นามสกุล').fill(customer_last,{delay: 200});
    await page.locator('#mobile').click();
    await page.locator('#mobile').fill(customer_phone,{delay: 200});
    await page.getByPlaceholder('xxx@gmail.com, etc.').click();
    await page.getByPlaceholder('xxx@gmail.com, etc.').fill(customer_email,{delay: 200});
    await page.locator('#lead_from').getByRole('combobox').locator('div').filter({ hasText: 'ลูกค้าเห็นบริการคิวช่างผ่านช่องทางใด' }).click();
    await page.getByRole('option', { name: 'ลูกค้า Walk in' }).locator('span').first().click();
    await page.screenshot({ path: 'customerDetail.png', fullPage: true });    
}

async function address_detail(page) {
    await page.waitForTimeout(5000)
    await page.getByPlaceholder('บ้านเลขที่, ถนน, ซอย, ฯลฯ').click();
    await page.getByPlaceholder('บ้านเลขที่, ถนน, ซอย, ฯลฯ').fill('123');
    await page.getByPlaceholder('เช่น ประตูสีฟ้า, ตรงข้ามร้านสะดวกซื้อ, ฯลฯ').click();
    await page.getByPlaceholder('เช่น ประตูสีฟ้า, ตรงข้ามร้านสะดวกซื้อ, ฯลฯ').fill('test');
    await page.screenshot({ path: 'addressDetail.png', fullPage: true }); 
}

async function confirm_order_2(page) {
    await page.getByRole('button', { name: 'ยืนยันการจองบริการ' }).click();
    await page.getByRole('button', { name: 'คัดลอก' }).click();
    const context = page.context(); // Get the browser context from the page
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: page.url() });

    const copiedText = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
    });
    console.log('Copied Text:', copiedText);
//Close the context
    console.log('Copied URL:', copiedText);
    await page.goto(copiedText);
    await page.screenshot({ path: 'customerTracking.png', fullPage: true })
    await page.pause()
}

async function payment_confirm(page,) {
    //const payment_card = card;
    //const otp_number = otp;
    await page.locator('.custom-control').click();
    await page.getByRole('button', { name: 'ชำระค่าบริการ' }).click();
}



module.exports = {
    login,
    productSearch,
    empSearch,
    searchArea,
    addProduct,
    cust_detail,
    customer_address,
    address_detail,
    confirm_order_2,
    payment_confirm,
    start_date
};