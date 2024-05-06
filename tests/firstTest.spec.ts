import {expect, test} from '@playwright/test'


test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()


})


test.skip('Assertions', async ({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    // General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    // locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    // soft assertion - if you want to continue running test after a validation has failed
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()

})

test.skip('Extract values from DOM', async ({page}) => {
    // single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // all text values
    const allRadioButtonsLabels =  await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    // input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    // placeholder
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test.skip('Reusing the locators', async ({page}) => {
    // asign locators in constants and call those constants
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')

})

test.skip('find parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator("#inputEmail1")}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator(".status-danger")}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    // not recomented by XPath
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()

})


test.skip('locating child elements', async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    // avoid selecting by index. Code might change!
    await page.locator('nb-card').nth(3).getByRole('button').click()

})



test.skip('User facing locators', async ({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the Grid').click()
    await page.getByTestId('SignIn').click()
    await page.getByTitle('IoT Dashboard').click()

})

test.skip('Locator syntax rules', async ({page}) => {
    // by Tag name
    await page.locator('input').first().click()

    // by ID
    await page.locator('#inputEmail1').click()

    // by Class
    await page.locator('.shape-rectangle').click()

    // by attribute
    await page.locator('[placeholder="Email"]').click()

    // by class full value
    await page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]').click()

    // combine different selectors
    await page.locator('input[placeholder="Email"][nbinput]').click()

    // by XPath (not recomended). Avoid selecting by XPath. Code might change!
    await page.locator('//*[@id="inputEmail"]').click()

    // by partial text match
    await page.locator(':text("Using")').click()

    // by exact text match
    await page.locator(':text-is("Using the Grid")').click()

})

test.skip('navigate to datepicker page', async ({page}) => {
    await page.getByText('Datepicker').click()

})
