import {expect, test} from '@playwright/test'
import { callbackify } from 'util'

// in case you want to run the tests ONLY from this file in parallel. Assingning independent worker in each test.
// test.describe.configure({mode: 'parallel'})

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')

})

test.describe('Form Layouts page', () => {
    // if you don't configure the test retries into "playright.config.ts", you can also do it in this stage.
    // test.describe.configure({retries: 2})

    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    
    })

    test('input fields', async ({page}, testInfo) => {
        // if you want to retry test with a precondition. For example cleanup the database.
        if(testInfo.retry){
            // do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially("test2@test.com", {delay: 500})

        // generic assertion
        // inputValue extracts the value
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual("test2@test.com")

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue("test2@test.com")

    })

    test.skip('radio buttons', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        // or this command
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})

        // generic assertion
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot({timeout: 5000})
        expect(radioStatus).toBeTruthy

        // or locator assertion
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})

test('checkboxes', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true})
    
    // Better use the below methods
    // or check command
    await page.getByRole('checkbox', {name: "Hide on click"}).check({force: true})
    // or uncheck command
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})

    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    // .all() creates array for all elements
    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()) {
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy
    }

    const allBoxesUnchecked = page.getByRole('checkbox')
    for(const box of await allBoxesUnchecked.all()) {
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }

})

test('Lists and dropdowns', async ({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    // recomended commands
    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has a LI tag

    // const optionList = page.getByRole('list').locator('nb-option')
    // or preferably first find the parent and then the child
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)",
    }

    // loop through the object of the values
    // colors[color] expression will return the color value
    await dropDownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropDownMenu.click()
    }
})

test('Tooltips', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: 'TOP'}).hover()

    // or
    // if you have a role tooltip created
    page.getByRole('tooltip') 
    // or
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})


test('Dialog box', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // browser dialog pages
    // create a listener and accept the browser's pop up
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('Web tables', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // get the row by any text in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    // get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowID = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowID.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowID.locator('td').nth(5)).toHaveText('test@test.com')

})

test('Web tables - filter table', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    const ages = ["20", "30", "40", "200"]
    for(let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)

        //hard coded waiting time
        await page.waitForTimeout(500)
        
        const ageRows = page.locator('tbody tr')
        // validate specific value of that row
        for(let row of await ageRows.all()) {
            // you get the last() column
            const cellValue = await row.locator('td').last().textContent()
            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('Date Picker', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    
    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
  
    // unique locator by class
    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click()
    await expect(calendarInputField).toHaveValue('Apr 1, 2024')
})

test('Date Picker Dynamically', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    // javascript code for the Date dynamically
    let date = new Date()
    date.setDate(date.getDate() + 500)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('EN-EU', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('EN-EU', {month: 'long'})


    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        // parent element and child element in []
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()


    }


    // unique locator by class
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)

    
})


test('Sliders', async ({page}) => {
    // update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    
    // evaluation of the javascript expression
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '26.756')
        node.setAttribute('cy', '26.756')
    })
    await tempGauge.click()

    // mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x -100, y)
    await page.mouse.move(x-100, y+100)
    await page.mouse.up()
    await expect(tempBox).toContainText('13')
})
