import { Locator, Page } from "@playwright/test";
import { HelperBase } from '../page-objects/helperBase'

export class NavigationPage extends HelperBase{
    // create a field
    // readonly page:Page
    // readonly fromLayoutMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly toolTipMenuItem: Locator

    // create a constractor
    constructor(page: Page){
        // this.page = page
        super(page)
    }
    // create a method
    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click()
        // await this.fromLayoutMenuItem.click()
        await this.waitForNumberOfSeconds(2)
    }

    async datePickerPage(){
        // await this.page.getByText('Forms').click()
        await this.selectGroupMenuItem('Forms')
        await this.page.waitForTimeout(1000)
        await this.page.getByText('Datepicker').click()
    }

    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click()

    }

    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    async toolTipPage(){
        await this.page.getByText('Modal & Overlays').click()
        await this.page.getByText('Tooltip').click()

    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == 'false') {
            await groupMenuItem.click()
        }
    }
}