import {expect, test} from '@playwright/test'


test.beforeEach(async({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 20000)


})

test('timeouts', async ({page}) => {
    // test.setTimeout(10000)
    
    // increase the timeout by 3 times: in config the timeout set to 10s, so it's increased to 30s
    // test.slow()

    const successButton = page.locator('.bg-success')
    await successButton.click()

})



test.skip('alternative waits', async ({page}) => {
    const successButton = page.locator('.bg-success')

    // __wait for element
    // await page.waitForSelector('.bg-success')


    // __wait forparticular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // __wait for network calls to be completed ('Not recomended')
    // await page.waitForLoadState('networkidle')
    
    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')

})

test.skip('Auto Waiting', async ({page}) => {
    const successButton = page.locator('.bg-success')
    // await successButton.click()

    // const text = await successButton.textContent()
    // expect(text).toEqual('Data loaded with AJAX get request.')

    // await successButton.waitFor({state: "attached"})
    // const text = await successButton.allTextContents()

    // // its array not text
    // expect(text).toContain('Data loaded with AJAX get request.')

    // alternatively with the timeout into
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})


})
