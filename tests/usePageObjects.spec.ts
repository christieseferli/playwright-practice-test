import {expect, test} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')

})

test('navigate to form page @smoke @regression', async ({page}) => {
    // create class instanse
    const pm = new PageManager(page)
    // call the method
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toolTipPage()
    })

test('parametrized methods', async({page}) =>{
    const pm = new PageManager(page)
    // create random data
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    // call the methods
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 1')
    // create screenshot
    await page.screenshot({path: 'screenshots/formLayoutsPage.png'})
    // make screenshot in binary
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))

    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(`${randomFullName}`, `${randomEmail}`, true)
    // take screenshot from a specific part of the page
    await page.locator('nb-card', {hasText: "Inline Form"}).screenshot({path: 'screenshots/inlineForm.png'})


    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromTOday(6,15)
})