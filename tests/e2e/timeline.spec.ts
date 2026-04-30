import { test, expect } from '@playwright/test'

test.describe('타임라인', () => {
  test('타임라인 페이지 정상 렌더링', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/AiTime/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('태그 필터 영역 노출', async ({ page }) => {
    await page.goto('/')
    const filterGroup = page.locator('[role="group"][aria-label="태그 필터"]')
    await expect(filterGroup).toBeVisible()
  })

  test('"전체 보기" 칩 기본 선택 상태', async ({ page }) => {
    await page.goto('/')
    const allChip = page.getByRole('button', { name: '전체 보기' })
    await expect(allChip).toBeVisible()
    // 기본 선택 상태: ring 클래스 포함
    await expect(allChip).toHaveClass(/ring/)
  })

  test('태그 칩 클릭 → 선택 스타일 적용', async ({ page }) => {
    await page.goto('/')
    const filterGroup = page.locator('[role="group"][aria-label="태그 필터"]')
    const chips = filterGroup.getByRole('button')
    const count = await chips.count()

    if (count > 1) {
      // "전체 보기" 외 첫 번째 태그 칩 클릭
      const firstTagChip = chips.nth(1)
      await firstTagChip.click()
      await expect(firstTagChip).toHaveClass(/ring/)

      // "전체 보기"는 이제 비선택 상태
      const allChip = page.getByRole('button', { name: '전체 보기' })
      await expect(allChip).not.toHaveClass(/ring-2/)
    }
  })

  test('필터 칩이 1개 이상 존재함 ("전체 보기" 포함)', async ({ page }) => {
    await page.goto('/')
    const filterGroup = page.locator('[role="group"][aria-label="태그 필터"]')
    await expect(filterGroup).toBeVisible()
    const chipCount = await filterGroup.getByRole('button').count()
    expect(chipCount).toBeGreaterThanOrEqual(1)
  })
})
