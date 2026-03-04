import { test, expect } from "@playwright/test";

test.describe("Admin manages projects", () => {
  test("Admin accesses the project page", async ({ page }) => {
    await page.goto("/admin");
    await page.getByTestId("project-menu").click();
    await expect(page).toHaveURL(/.*\/admin\/projects/);
  });

  test("Admin views the project list", async ({ page }) => {
    await page.goto("/admin/projects");
    await expect(page.getByTestId("project-list")).toBeVisible();
  });

  test("Admin sets up a new project", async ({ page }) => {
    await page.goto("/admin/projects");

    await page.getByTestId("project-name-input").fill("New Project");
    await page.getByTestId("start-date-input").fill("2023-11-01");
    await page.getByTestId("end-date-input").fill("2024-01-01");
    await page.getByTestId("assignee-email-input").fill("john.doe@example.com");
    await page.getByTestId("assignee-name-input").fill("John Doe");

    await page.getByTestId("submit-project-btn").click();

    // TODO: Replace with actual success message check
    await expect(page.getByText("Project created successfully")).toBeVisible();
  });

  test("Admin enters invalid project dates", async ({ page }) => {
    await page.goto("/admin/projects");

    await page.getByTestId("project-name-input").fill("New Project");
    await page.getByTestId("start-date-input").fill("2024-01-01");
    await page.getByTestId("end-date-input").fill("2023-11-01");

    await page.getByTestId("submit-project-btn").click();

    // TODO: Replace with actual error message check
    await expect(page.getByText("End date must be after start date")).toBeVisible();
  });
});
