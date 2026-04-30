import { test as setup } from '@playwright/test'
import path from 'path'

const storageStatePath = path.join(__dirname, '../fixtures/storageState.json')

setup('admin 로그인 상태 저장', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'admin@aitime.app')
  await page.fill('input[type="password"]', 'admin1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
  await page.context().storageState({ path: storageStatePath })
})
