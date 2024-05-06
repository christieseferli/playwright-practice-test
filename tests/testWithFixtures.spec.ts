import {test} from '../test-options'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'


test.skip('parametrized methods', async({page, formLayoutsPage}) =>{
    const pm = new PageManager(page)
    // create random data
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    // call the methods
        await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 1')
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(`${randomFullName}`, `${randomEmail}`, true)
})

test('parametrized methods with pageManager', async({pageManager}) =>{
    // create random data
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    // call the methods
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 1')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(`${randomFullName}`, `${randomEmail}`, true)
})