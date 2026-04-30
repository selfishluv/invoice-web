import { test, expect } from '@playwright/test'

test.describe('인증', () => {
  test('미인증 /admin 접근 → /login 리다이렉트', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('잘못된 비밀번호 → 에러 메시지 표시', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@aitime.app')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(
      page.getByText('이메일 또는 비밀번호가 올바르지 않습니다')
    ).toBeVisible()
  })

  test('올바른 로그인 → /admin 리다이렉트', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@aitime.app')
    await page.fill('input[type="password"]', 'admin1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
    await expect(page.getByText('성장 기록 관리')).toBeVisible()
  })

  test('로그아웃 → /login으로 이동', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@aitime.app')
    await page.fill('input[type="password"]', 'admin1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')

    await page.getByRole('button', { name: '로그아웃' }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('로그아웃 후 /admin 접근 → /login 리다이렉트', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@aitime.app')
    await page.fill('input[type="password"]', 'admin1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')

    await page.getByRole('button', { name: '로그아웃' }).click()
    await expect(page).toHaveURL(/\/login/)

    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })
})
