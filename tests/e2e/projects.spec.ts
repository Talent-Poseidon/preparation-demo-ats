import { test, expect } from "@playwright/test";

test.describe("Admin manages projects", () => {
  test("Admin views project list", async ({ page }) => {
    await page.goto("/admin/projects");

    // Wait for content
    await expect(page.getByTestId("project-list-container")).toBeVisible();

    // Check list
    const list = page.getByTestId("project-list-container");
    await expect(list).toBeVisible();
  });

  test("Admin sets up a new project", async ({ page }) => {
    await page.goto("/admin/projects");

    // Fill form using getByTestId
    await page.getByTestId("project-name-input").fill("New Project");
    await page.getByTestId("start-date-input").fill("2023-11-01");
    await page.getByTestId("end-date-input").fill("2024-01-01");
    await page.getByTestId("assignee-email-input").fill("john.doe@example.com");
    await page.getByTestId("assignee-name-input").fill("John Doe");

    // Add another assignee
    await page.getByRole('button', { name: 'Add Assignee' }).click();
    await page.getByTestId("assignee-email-input").fill("jane.smith@example.com");
    await page.getByTestId("assignee-name-input").fill("Jane Smith");

    // Submit
    await page.getByTestId("submit-project-btn").click();

    // Assert result
    await expect(page.getByTestId("success-alert")).toBeVisible();
  });

  test("Admin tries to setup a project with missing information", async ({ page }) => {
    await page.goto("/admin/projects");

    // Attempt to submit with missing project name
    await page.getByTestId("submit-project-btn").click();

    // Assert error message
    await expect(page.getByText("Project name is required")).toBeVisible();
  });

  test("Admin tries to setup a project with invalid dates", async ({ page }) => {
    await page.goto("/admin/projects");

    // Fill form with invalid dates
    await page.getByTestId("project-name-input").fill("Invalid Date Project");
    await page.getByTestId("start-date-input").fill("2024-01-01");
    await page.getByTestId("end-date-input").fill("2023-11-01");

    // Submit
    await page.getByTestId("submit-project-btn").click();

    // Assert error message
    await expect(page.getByText("End date must be after start date")).toBeVisible();
  });
});
