const { expect } = require('@playwright/test');
const locators = require('../repository/commonRepository.json')
// Custom keyword to log in
async function login(page, username, password) {
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

async function empSearch(page, empName) {
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

async function productSearch(page, productname) {
    const searchText = productname;
    const input = page.locator('.position-relative > .search-autofill');
    await input.waitFor({ state: 'visible' });
    await input.focus();
    await input.click();
    await input.type(searchText, { delay: 200 });
}

async function searchArea(page, area) {
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
}
async function customer_address(page, province) {
    const searchText = province;
    await page.locator('input[placeholder="กรุณาระบุ เขต/อำเภอ, แขวง/ตำบล, จังหวัด, ฯลฯ"]');
    await page.fill('input[placeholder="กรุณาระบุ เขต/อำเภอ, แขวง/ตำบล, จังหวัด, ฯลฯ"]', searchText, { delay: 200 });
    await page.locator('.vs__dropdown-option--highlight').click();
    await page.waitForTimeout(10000)

}

async function start_date(page,targetDate) {
    const dateXPath = `//span[contains(@class, "cell day") and text()="${targetDate}"]`;

    // Check if the date is enabled
    const dateElement = page.locator(dateXPath);
    if (await dateElement.count() > 0) {
    const isDisabled = await dateElement.getAttribute('class').then(cls => cls.includes('disabled'));

    if (!isDisabled) {
        console.log(`Clicking on the target date: ${targetDate}`);
        await dateElement.click();
    } else {
        console.log(`The target date (${targetDate}) is disabled. Searching for the next available date...`);
        await selectNextEnabledDate(page, targetDate);
    }
    } else {
    console.error(`Date element not found for target date: ${targetDate}`);
    }
    };

async function selectNextEnabledDate(page, currentTargetDate,targetDate) {
    const allDatesXPath = `//span[contains(@class, "cell day")]`;
    const allDates = page.locator(allDatesXPath);

    const count = await allDates.count();
    let targetFound = false;

    for (let i = 0; i < count; i++) {
    const dateElement = allDates.nth(i);
    const className = await dateElement.getAttribute('class');

      // Check if the date is enabled
    if (!className.includes('disabled')) {
        const nextDate = await dateElement.textContent();

        // Click the next enabled date only if it is after the current target date
        if (parseInt(nextDate, 10) > parseInt(currentTargetDate, 10)) {
        console.log(`Clicking on the next available date: ${nextDate}`);
        await dateElement.click();
        targetFound = true;
        break;
        }
    }
    }

    // If no enabled date is found, move to the next month
    if (!targetFound) {
    console.log('No enabled date found in the current month. Moving to the next month...');
    const nextMonthButtonXPath = `.vdp-datepicker > div:nth-of-type(2) .next`; 
    const nextMonthButton = page.locator(nextMonthButtonXPath);

    if (await nextMonthButton.count() > 0) {
        await nextMonthButton.click();
        console.log('Clicked on the "Next Month" button.');

        // Retry selecting the next enabled date in the new month
        await selectNextEnabledDate(page, 0); // Pass 0 to start from the first day of the next month
    } else {
        console.error('Next Month button not found. Unable to proceed further.');
    }
    }
    await start_date(page, targetDate);
    };

async function cust_detail(page,name,lastname,mobile,email) {
    const customer_name=name;
    const customer_last=lastname;
    const customer_phone=mobile;
    const customer_email=email;
    const input = page.locator('//*[@id="firstname"]');
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await input.fill(customer_name, { delay: 200 });
    await page.getByPlaceholder('นามสกุล').click();
    await page.getByPlaceholder('นามสกุล').fill(customer_last, { delay: 200 });
    await page.locator('#mobile').click();
    await page.locator('#mobile').fill(customer_phone, { delay: 200 });
    await page.getByPlaceholder('xxx@gmail.com, etc.').click();
    await page.getByPlaceholder('xxx@gmail.com, etc.').fill(customer_email, { delay: 200 });
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
    const context = page.context(); 
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: page.url() });

    const copiedText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
    });
    console.log('Copied Text:', copiedText);
    console.log('Copied URL:', copiedText);
    await page.goto(copiedText);
    await page.screenshot({ path: 'customerTracking.png', fullPage: true })
}

async function payment_confirm(page) {
    //const payment_card = card;
    //const otp_number = otp;
    await page.locator('.custom-control-label').click();
    await page.getByRole('button', { name: 'ชำระค่าบริการ' }).click();
    await page.locator('#tel-cardNumber').click();
    await page.fill('#tel-cardNumber','4111111111111111');
    await page.locator('#expyear').click();
    await page.type('#expyear','0728');
    await page.locator('#tel-cvv').click();
    await page.fill('#tel-cvv','123');
    await page.locator('.btn-primary').click();
    await page.waitForTimeout(2000);
    await page.fill('//*[@id="parentFormElement"]/form/div/main/div[1]/div[1]/input','123456');
    await page.locator('//button[contains(.,"Submit")]').click();
    await page.waitForTimeout(6000);
    
}

// Partner Q-Chang V1

async function OpenPartnerPage(page) {
    await page.goto('https://sit-partner.q-chang.io/');
}


async function PartnerSelectProduct(page) {
    await page.getByRole('link', { name: 'เลือกบริการ' }).click();
    await page.getByRole('heading', { name: 'รางน้ำฝน' }).click();
    await page.getByRole('link', { name: 'รางน้ำฝน SCG พร้อมติดตั้ง' }).click();
    await page.getByRole('button', { name: 'จองสำรวจ' }).click();
}

async function PartnerCustAddress(page, sub_district, add_no, landmark) {
    const customer_sub_district = sub_district;
    const customer_no = add_no;
    const customer_landmark = landmark;
    await page.locator('#sub-district').click();
    await page.locator('#sub-district').fill(sub_district);
    await page.locator('ul').filter({ hasText: 'สีบัวทอง' }).locator('div').click()
    // await page.getByText('สามโก้ » สามโก้ » อ่างทอง »').click();
    await page.getByPlaceholder('ที่อยู่ (บ้านเลขที่ ซอย ถนน)').fill(add_no);
    await page.getByPlaceholder('สถานที่ สิ่งก่อสร้าง อื่นๆ').fill(landmark);
}

async function PartnerCustDetail(page, firstname, lastname, phone, email) {
    const customer_name = firstname;
    const customer_last = lastname;
    const customer_phone = phone;
    const customer_email = email;
    await page.locator('#firstname').fill(firstname);
    await page.locator('#lastname').fill(lastname);
    await page.locator('#phone').fill(phone);
    await page.locator('#email').fill(email);
}

async function ConfirmBasedOnConditions(page, type_of_work, sale_model) {
    await page.getByText('ยอมรับข้อกำหนดและเงื่อนไขและเข้าใจนโยบายความเป็นส่วนตัว(ดูรายละเอียด คลิก)').click();
    if (type_of_work === 'survey' && sale_model === 'marketplace') {
        await page.getByRole('button', { name: 'ชำระค่าสำรวจ' }).click(); 
    } else if (type_of_work === 'installation' && sale_model === 'marketplace') {
        await page.getByRole('button', { name: 'ชำระค่าติดตั้ง' }).click(); 
    } else if (type_of_work === 'survey' && sale_model === 'retail') {
        await page.getByRole('button', { name: 'ยืนยันการสำรวจ' }).click(); 
    } else if (type_of_work === 'installation' && sale_model === 'retail') {
        await page.getByRole('button', { name: 'ยืนยันการติดตั้ง' }).click(); 
    } else {
        console.log('No matching condition found');
    }
    await page.getByRole('button', { name: 'ตกลง' }).click();
}


async function PaidByCreditCard(page, card_no, card_expire, card_name, card_ccv, card_otp) {
    const credit_card_no = card_no;
    const credit_card_expire = card_expire;
    const credit_card_name = card_name;
    const credit_card_ccv = card_ccv;
    const credit_card_otp = card_otp;
    await expect(page.getByText('บัตร', { exact: true })).toBeVisible({});
    await page.getByPlaceholder('-0000-0000-0000').click();
    await page.getByPlaceholder('-0000-0000-0000').fill(card_no);
    await page.getByPlaceholder('ดด/ปป').click();
    await page.getByPlaceholder('ดด/ปป').fill(card_expire);
    await page.getByPlaceholder('. .').click();
    await page.getByPlaceholder('. .').fill(card_ccv);
    await page.getByLabel('ชื่อผู้ถือบัตร (ภาษาอังกฤษ)').click();
    await page.getByLabel('ชื่อผู้ถือบัตร (ภาษาอังกฤษ)').fill(card_name);
    await page.getByRole('button', { name: 'ชำระเงินต่อ' }).click();
    // Enter OTP
    await expect(page.getByRole('heading', { name: 'Secure Cardholder Verification' })).toBeVisible();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill(card_otp);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Return to Merchant' }).click();
    await expect(page.getByText('การทำธุรกรรมที่ประสบความสำเร็จ')).toBeVisible();
}

async function PartnerApplyCoupon(page, code) {
    const coupon_code = code;
    await page.locator('#promocode').click();
    await page.locator('#promocode').fill(code);
    await page.getByRole('button', { name: 'ใช้ส่วนลด' }).click();
    await expect(page.getByText('Retail Automate Code V1')).toBeVisible();
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
    start_date,
    OpenPartnerPage,
    ConfirmBasedOnConditions,
    PartnerSelectProduct,
    PartnerCustAddress,
    PartnerCustDetail,
    PaidByCreditCard,
    PartnerApplyCoupon,
    selectNextEnabledDate,
};