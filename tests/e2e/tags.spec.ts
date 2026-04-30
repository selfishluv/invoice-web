import { test, expect } from '@playwright/test'

test.describe('태그 관리', () => {
  test('헤더 "태그 관리" 링크 → /admin/tags 이동', async ({ page }) => {
    await page.goto('/admin')
    await page.getByRole('link', { name: '태그 관리' }).click()
    await expect(page).toHaveURL('/admin/tags')
    await expect(page.getByRole('heading', { name: '태그 관리' })).toBeVisible()
  })

  test('/admin/tags 페이지 구성 확인', async ({ page }) => {
    await page.goto('/admin/tags')
    await expect(page.getByText('새 태그 추가')).toBeVisible()
    await expect(page.getByText('태그 목록')).toBeVisible()
  })

  test('새 태그 추가 → 목록에 노출', async ({ page }) => {
    const tagName = `E2E태그${Date.now()}`

    await page.goto('/admin/tags')

    await page.fill('input#tag-name', tagName)
    // 분홍 색상 선택
    await page.getByRole('button', { name: '분홍' }).first().click()
    await page.getByRole('button', { name: '태그 추가' }).click()

    await page.waitForURL('/admin/tags')
    await expect(page.getByText(tagName)).toBeVisible()
  })

  test('태그 수정 → 변경된 이름 노출', async ({ page }) => {
    const originalName = `E2E원본태그${Date.now()}`
    const updatedName = `E2E수정태그${Date.now()}`

    // 태그 생성
    await page.goto('/admin/tags')
    await page.fill('input#tag-name', originalName)
    await page.getByRole('button', { name: '파랑' }).first().click()
    await page.getByRole('button', { name: '태그 추가' }).click()
    await page.waitForURL('/admin/tags')

    // 수정 클릭
    const tagRow = page.locator('li').filter({ hasText: originalName })
    await tagRow.getByRole('link', { name: '수정' }).click()
    await expect(page).toHaveURL(/\/admin\/tags\/.+\/edit/)

    // 이름 변경
    const nameInput = page.locator('input#tag-name')
    await nameInput.clear()
    await nameInput.fill(updatedName)
    await page.getByRole('button', { name: '수정 저장' }).click()
    await page.waitForURL('/admin/tags')

    await expect(page.getByText(updatedName)).toBeVisible()
    await expect(page.getByText(originalName)).not.toBeVisible()
  })

  test('태그 삭제 → 목록에서 제거', async ({ page }) => {
    const tagName = `E2E삭제태그${Date.now()}`

    // 태그 생성
    await page.goto('/admin/tags')
    await page.fill('input#tag-name', tagName)
    await page.getByRole('button', { name: '초록' }).first().click()
    await page.getByRole('button', { name: '태그 추가' }).click()
    await page.waitForURL('/admin/tags')
    await expect(page.getByText(tagName)).toBeVisible()

    // 삭제
    const tagRow = page.locator('li').filter({ hasText: tagName })
    await tagRow.getByRole('button', { name: '삭제' }).click()

    // AlertDialog 확인
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: '삭제' }).click()

    // 다이얼로그 닫힘 후 목록에서 제거 확인
    await expect(dialog).not.toBeVisible()
    await expect(page.locator('li').filter({ hasText: tagName })).toHaveCount(0)
  })
})
