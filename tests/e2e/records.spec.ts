import { test, expect } from '@playwright/test'

test.describe('기록 관리', () => {
  test('/admin 페이지 로드', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByText('성장 기록 관리')).toBeVisible()
    await expect(
      page.getByRole('link', { name: '+ 새 기록 추가' })
    ).toBeVisible()
  })

  test('새 기록 추가 → 목록에 노출', async ({ page }) => {
    const title = `E2E 테스트 기록 ${Date.now()}`

    await page.goto('/admin')
    await page.getByRole('link', { name: '+ 새 기록 추가' }).click()
    await expect(page).toHaveURL('/admin/records/new')
    await expect(page.getByText('새 기록 추가')).toBeVisible()

    await page.fill('input#title', title)
    await page.fill('input#date', '2025-01-15')

    await page.getByRole('button', { name: '기록 추가' }).click()
    await page.waitForURL('/admin')

    await expect(page.getByText(title)).toBeVisible()
  })

  test('기록 수정 → 변경된 제목 노출', async ({ page }) => {
    test.setTimeout(120_000)
    const originalTitle = `E2E 수정 원본 ${Date.now()}`
    const updatedTitle = `E2E 수정 완료 ${Date.now()}`

    // 테스트용 기록 생성
    await page.goto('/admin/records/new')
    await page.fill('input#title', originalTitle)
    await page.fill('input#date', '2025-02-01')
    await page.getByRole('button', { name: '기록 추가' }).click()
    await page.waitForURL('/admin')

    // 수정 페이지로 이동
    const row = page.getByRole('row').filter({ hasText: originalTitle })
    await row.getByRole('link', { name: '수정' }).click()
    await expect(page).toHaveURL(/\/admin\/records\/.+\/edit/)

    // 제목 수정
    const titleInput = page.locator('input#title')
    await titleInput.clear()
    await titleInput.fill(updatedTitle)
    await page.getByRole('button', { name: '수정 저장' }).click()
    await expect(page).toHaveURL('/admin', { timeout: 30_000 })

    await expect(page.getByText(updatedTitle)).toBeVisible()
    await expect(page.getByText(originalTitle)).not.toBeVisible()
  })

  test('기록 삭제 → 목록에서 제거', async ({ page }) => {
    const title = `E2E 삭제 테스트 ${Date.now()}`

    // 테스트용 기록 생성
    await page.goto('/admin/records/new')
    await page.fill('input#title', title)
    await page.fill('input#date', '2025-03-01')
    await page.getByRole('button', { name: '기록 추가' }).click()
    await page.waitForURL('/admin')
    await expect(page.getByText(title)).toBeVisible()

    // 삭제
    const row = page.getByRole('row').filter({ hasText: title })
    await row.getByRole('button', { name: '삭제' }).click()

    // AlertDialog 확인 후 삭제
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: '삭제' }).click()

    // 다이얼로그 닫힘 대기 후 행 제거 확인
    await expect(dialog).not.toBeVisible()
    await expect(page.getByRole('row').filter({ hasText: title })).toHaveCount(
      0
    )
  })
})
