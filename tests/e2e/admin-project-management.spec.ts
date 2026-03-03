import { test, expect } from '@playwright/test';

// This file runs in chromium (authenticated)
test.describe('Admin Project Management', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/projects...`);

    const response = await page.goto('/admin/projects');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.getByTestId('project-menu')).toBeVisible();
  });

  test('Accessing the Project Page', async ({ page }) => {
    await expect(page.getByTestId('project-list')).toBeVisible();
  });

  test('Setting Up a New Project', async ({ page }) => {
    await page.click('[data-testid="setup-new-project-btn"]');

    await page.fill('[data-testid="project-name-input"]', 'New Project');
    await page.fill('[data-testid="start-date-input"]', '2023-11-01');
    await page.fill('[data-testid="end-date-input"]', '2023-12-01');
    await page.fill('[data-testid="assignee-email-input"]', 'john.doe@example.com');
    await page.fill('[data-testid="assignee-name-input"]', 'John Doe');

    await page.click('[data-testid="submit-project-btn"]');

    await expect(page.getByTestId('confirmation-message')).toContainText('Project setup successfully');
  });

  test('Validation of Assignee Email', async ({ page }) => {
    await page.click('[data-testid="setup-new-project-btn"]');

    await page.fill('[data-testid="project-name-input"]', 'New Project');
    await page.fill('[data-testid="start-date-input"]', '2023-11-01');
    await page.fill('[data-testid="end-date-input"]', '2023-12-01');
    await page.fill('[data-testid="assignee-email-input"]', 'invalid-email');
    await page.fill('[data-testid="assignee-name-input"]', 'John Doe');

    await page.click('[data-testid="submit-project-btn"]');

    // Check for the validation message
    await expect(page.locator('[data-testid="assignee-email-input"] + .form-message')).toContainText('Invalid email format');
  });

  test('Validation of Project Dates', async ({ page }) => {
    await page.click('[data-testid="setup-new-project-btn"]');

    await page.fill('[data-testid="project-name-input"]', 'New Project');
    await page.fill('[data-testid="start-date-input"]', '2023-12-01');
    await page.fill('[data-testid="end-date-input"]', '2023-11-01');
    await page.fill('[data-testid="assignee-email-input"]', 'john.doe@example.com');
    await page.fill('[data-testid="assignee-name-input"]', 'John Doe');

    await page.click('[data-testid="submit-project-btn"]');

    // Check for the validation message
    await expect(page.locator('[data-testid="start-date-input"] + .form-message')).toContainText('Start date must be before end date');
  });
});
